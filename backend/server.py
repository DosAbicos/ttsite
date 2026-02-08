from fastapi import FastAPI, APIRouter, HTTPException, Depends, Query
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List, Optional
from datetime import datetime, timedelta

from models import (
    User, UserCreate, UserLogin, UserResponse, Token,
    Category, CategoryCreate, CategoryUpdate,
    Product, ProductCreate, ProductUpdate,
    Order, OrderCreate, OrderStatusUpdate
)
from auth import (
    get_password_hash, verify_password, create_access_token,
    get_current_user, get_current_user_optional, decode_token
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'ddebuut')]

# Create the main app
app = FastAPI(title="ddebuut API")

# Create routers
api_router = APIRouter(prefix="/api")
admin_router = APIRouter(prefix="/api/admin")

# ============ Auth Helper ============
async def get_admin_user(user_id: str = Depends(get_current_user)):
    user = await db.users.find_one({"id": user_id})
    if not user or not user.get("is_admin", False):
        raise HTTPException(status_code=403, detail="Admin access required")
    return user

# ============ Auth Routes ============
@api_router.post("/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    # Check if user exists
    existing = await db.users.find_one({"email": user_data.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    import uuid
    user = {
        "id": str(uuid.uuid4()),
        "email": user_data.email,
        "name": user_data.name,
        "password": get_password_hash(user_data.password),
        "is_admin": False,
        "created_at": datetime.utcnow()
    }
    await db.users.insert_one(user)
    
    # Generate token
    access_token = create_access_token({"user_id": user["id"]})
    return Token(access_token=access_token)

@api_router.post("/auth/login", response_model=Token)
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email})
    if not user or not verify_password(credentials.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token({"user_id": user["id"]})
    return Token(access_token=access_token)

@api_router.get("/auth/me", response_model=UserResponse)
async def get_me(user_id: str = Depends(get_current_user)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return UserResponse(
        id=user["id"],
        email=user["email"],
        name=user["name"],
        is_admin=user.get("is_admin", False)
    )

# ============ Public Category Routes ============
@api_router.get("/categories", response_model=List[Category])
async def get_categories():
    categories = await db.categories.find({}, {"_id": 0}).to_list(100)
    return categories

@api_router.get("/categories/{slug}")
async def get_category(slug: str):
    category = await db.categories.find_one({"slug": slug}, {"_id": 0})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category

# ============ Public Product Routes ============
@api_router.get("/products")
async def get_products(
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    in_stock: Optional[bool] = None,
    sort: Optional[str] = "recommended",
    search: Optional[str] = None,
    limit: int = Query(default=50, le=100),
    skip: int = 0
):
    query = {}
    
    # Category filter
    if category:
        cat = await db.categories.find_one({"slug": category})
        if cat:
            query["category_id"] = cat["id"]
    
    # Price filter
    if min_price is not None or max_price is not None:
        query["price"] = {}
        if min_price is not None:
            query["price"]["$gte"] = min_price
        if max_price is not None:
            query["price"]["$lte"] = max_price
        if not query["price"]:
            del query["price"]
    
    # Stock filter
    if in_stock is not None:
        query["in_stock"] = in_stock
    
    # Search filter
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    # Sorting
    sort_field = "created_at"
    sort_order = -1
    if sort == "price-low":
        sort_field = "price"
        sort_order = 1
    elif sort == "price-high":
        sort_field = "price"
        sort_order = -1
    elif sort == "name-az":
        sort_field = "name"
        sort_order = 1
    elif sort == "name-za":
        sort_field = "name"
        sort_order = -1
    
    products = await db.products.find(query, {"_id": 0}).sort(sort_field, sort_order).skip(skip).limit(limit).to_list(limit)
    total = await db.products.count_documents(query)
    
    return {"products": products, "total": total}

@api_router.get("/products/{slug}")
async def get_product(slug: str):
    product = await db.products.find_one({"slug": slug})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# ============ Order Routes ============
@api_router.post("/orders")
async def create_order(order_data: OrderCreate, user_id: Optional[str] = Depends(get_current_user_optional)):
    import uuid
    
    # Calculate totals
    subtotal = sum(item.price * item.quantity for item in order_data.items)
    shipping_cost = 0 if subtotal >= 39 else 5.99
    total = subtotal + shipping_cost
    
    order = {
        "id": str(uuid.uuid4()),
        "user_id": user_id,
        "email": order_data.email,
        "shipping_address": order_data.shipping_address.dict(),
        "items": [item.dict() for item in order_data.items],
        "subtotal": subtotal,
        "shipping_cost": shipping_cost,
        "total": total,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    
    await db.orders.insert_one(order)
    return order

@api_router.get("/orders")
async def get_user_orders(user_id: str = Depends(get_current_user)):
    orders = await db.orders.find({"user_id": user_id}).sort("created_at", -1).to_list(100)
    return orders

@api_router.get("/orders/{order_id}")
async def get_order(order_id: str, user_id: Optional[str] = Depends(get_current_user_optional)):
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Check access
    if order.get("user_id") and order["user_id"] != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    
    return order

# ============ Admin Routes ============

# Admin Products
@admin_router.get("/products")
async def admin_get_products(admin: dict = Depends(get_admin_user)):
    products = await db.products.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return products

@admin_router.post("/products")
async def admin_create_product(product_data: ProductCreate, admin: dict = Depends(get_admin_user)):
    import uuid
    
    # Check slug uniqueness
    existing = await db.products.find_one({"slug": product_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Product slug already exists")
    
    product = {
        "id": str(uuid.uuid4()),
        **product_data.dict(),
        "created_at": datetime.utcnow()
    }
    
    await db.products.insert_one(product)
    return product

@admin_router.put("/products/{product_id}")
async def admin_update_product(product_id: str, product_data: ProductUpdate, admin: dict = Depends(get_admin_user)):
    product = await db.products.find_one({"id": product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    update_data = {k: v for k, v in product_data.dict().items() if v is not None}
    
    if update_data:
        await db.products.update_one({"id": product_id}, {"$set": update_data})
    
    updated = await db.products.find_one({"id": product_id})
    return updated

@admin_router.delete("/products/{product_id}")
async def admin_delete_product(product_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.products.delete_one({"id": product_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"}

# Admin Categories
@admin_router.get("/categories")
async def admin_get_categories(admin: dict = Depends(get_admin_user)):
    categories = await db.categories.find().to_list(100)
    return categories

@admin_router.post("/categories")
async def admin_create_category(category_data: CategoryCreate, admin: dict = Depends(get_admin_user)):
    import uuid
    
    existing = await db.categories.find_one({"slug": category_data.slug})
    if existing:
        raise HTTPException(status_code=400, detail="Category slug already exists")
    
    category = {
        "id": str(uuid.uuid4()),
        **category_data.dict(),
        "created_at": datetime.utcnow()
    }
    
    await db.categories.insert_one(category)
    return category

@admin_router.put("/categories/{category_id}")
async def admin_update_category(category_id: str, category_data: CategoryUpdate, admin: dict = Depends(get_admin_user)):
    category = await db.categories.find_one({"id": category_id})
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    update_data = {k: v for k, v in category_data.dict().items() if v is not None}
    
    if update_data:
        await db.categories.update_one({"id": category_id}, {"$set": update_data})
    
    updated = await db.categories.find_one({"id": category_id})
    return updated

@admin_router.delete("/categories/{category_id}")
async def admin_delete_category(category_id: str, admin: dict = Depends(get_admin_user)):
    result = await db.categories.delete_one({"id": category_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Category not found")
    return {"message": "Category deleted"}

# Admin Orders
@admin_router.get("/orders")
async def admin_get_orders(admin: dict = Depends(get_admin_user)):
    orders = await db.orders.find().sort("created_at", -1).to_list(1000)
    return orders

@admin_router.put("/orders/{order_id}/status")
async def admin_update_order_status(order_id: str, status_data: OrderStatusUpdate, admin: dict = Depends(get_admin_user)):
    order = await db.orders.find_one({"id": order_id})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    valid_statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
    if status_data.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    await db.orders.update_one({"id": order_id}, {"$set": {"status": status_data.status}})
    
    updated = await db.orders.find_one({"id": order_id})
    return updated

# Admin Users
@admin_router.get("/users")
async def admin_get_users(admin: dict = Depends(get_admin_user)):
    users = await db.users.find().to_list(1000)
    return [{
        "id": u["id"],
        "email": u["email"],
        "name": u["name"],
        "is_admin": u.get("is_admin", False),
        "created_at": u.get("created_at")
    } for u in users]

@admin_router.put("/users/{user_id}/admin")
async def admin_toggle_user_admin(user_id: str, admin: dict = Depends(get_admin_user)):
    user = await db.users.find_one({"id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_status = not user.get("is_admin", False)
    await db.users.update_one({"id": user_id}, {"$set": {"is_admin": new_status}})
    
    return {"message": f"User admin status set to {new_status}"}

# Admin Dashboard Stats
@admin_router.get("/stats")
async def admin_get_stats(admin: dict = Depends(get_admin_user)):
    products_count = await db.products.count_documents({})
    categories_count = await db.categories.count_documents({})
    orders_count = await db.orders.count_documents({})
    users_count = await db.users.count_documents({})
    
    # Recent orders
    recent_orders = await db.orders.find().sort("created_at", -1).limit(5).to_list(5)
    
    # Total revenue
    pipeline = [{"$group": {"_id": None, "total": {"$sum": "$total"}}}]
    revenue_result = await db.orders.aggregate(pipeline).to_list(1)
    total_revenue = revenue_result[0]["total"] if revenue_result else 0
    
    return {
        "products": products_count,
        "categories": categories_count,
        "orders": orders_count,
        "users": users_count,
        "total_revenue": total_revenue,
        "recent_orders": recent_orders
    }

# Root endpoint
@api_router.get("/")
async def root():
    return {"message": "ddebuut API", "version": "1.0.0"}

# Include routers
app.include_router(api_router)
app.include_router(admin_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    # Seed database with initial data
    from seed_data import seed_database
    await seed_database()
    logger.info("Database seeded successfully")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()

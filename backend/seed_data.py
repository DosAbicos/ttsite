from motor.motor_asyncio import AsyncIOMotorClient
import os
from models import Category, Product
import asyncio
from datetime import datetime

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'ddebuut')

# Initial categories data
initial_categories = [
    {
        "id": "cat-1",
        "name": "vescartes",
        "slug": "vescartes",
        "image": "https://img-va.myshopline.com/image/store/1747638107971/-20250903064321-89-2.png?w=690&h=810"
    },
    {
        "id": "cat-2",
        "name": "ykarchive club",
        "slug": "ykarchive-club",
        "image": "https://img-va.myshopline.com/image/store/1747638107971/691FE659-7FF0-46BE-A41E-AF0A25223FA7-0.jpg?w=1170&h=1160"
    },
    {
        "id": "cat-3",
        "name": "TOPS",
        "slug": "tops",
        "image": "https://img-va.myshopline.com/image/store/1747638107971/5727cb6bafe57b55fe993262c0472c5f.jpg?w=3259&h=3994"
    },
    {
        "id": "cat-4",
        "name": "HOLY HEADEN & IT'S HOUSES",
        "slug": "holy-headen",
        "image": "https://img-va.myshopline.com/image/store/1747638107971/CBE13275-D619-4316-9973-01D84AFDC537-0.jpg?w=900&h=1350"
    },
    {
        "id": "cat-5",
        "name": "Down Jacket",
        "slug": "down-jacket",
        "image": "https://img-va.myshopline.com/image/store/1747638107971/PHOTO2-0.jpg?w=1440&h=1800"
    },
    {
        "id": "cat-6",
        "name": "DRMERS CLUB",
        "slug": "drmers-club",
        "image": "https://img-va.myshopline.com/image/store/1747638107971/5-11-0.jpg?w=1440&h=1800"
    },
    {
        "id": "cat-retro",
        "name": "Retro Series",
        "slug": "retro-series",
        "image": "https://img-va.myshopline.com/image/store/1747638107971/c55dacb8aa88b027354d1539059a0be1.webp?w=1280&h=1280"
    }
]

# Initial products data
initial_products = [
    {
        "id": "prod-1",
        "name": '"BLOSSOM" WORKWEAR JACKET',
        "slug": "blossom-workwear-jacket",
        "price": 7.60,
        "original_price": 120.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/c55dacb8aa88b027354d1539059a0be1.webp?w=1280&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/858a40375586ed47191c1e71c592974d.jpg?w=1280&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Cream", "Black"],
        "description": "Premium quality workwear jacket with beautiful blossom embroidery.",
        "in_stock": True
    },
    {
        "id": "prod-2",
        "name": "Blossom Black Denim",
        "slug": "blossom-black-denim",
        "price": 6.90,
        "original_price": 120.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/47.png?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/48.png?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["28", "30", "32", "34", "36"],
        "colors": ["Black"],
        "description": "Black denim jeans with elegant blossom pattern.",
        "in_stock": True
    },
    {
        "id": "prod-3",
        "name": "Blossom Denim",
        "slug": "blossom-denim",
        "price": 6.98,
        "original_price": 70.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/28-12.jpg?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/27-7.jpg?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["28", "30", "32", "34", "36"],
        "colors": ["Light Blue"],
        "description": "Light blue denim with blossom embroidery details.",
        "in_stock": True
    },
    {
        "id": "prod-4",
        "name": "Fallen Knight Denim",
        "slug": "fallen-knight-denim",
        "price": 6.98,
        "original_price": 70.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/19-880d1955-d93b-4aee-8bdc-54dc159aface.jpg?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/18-918b0a20-3648-4a3c-81be-e46936b4d417.jpg?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["28", "30", "32", "34", "36"],
        "colors": ["Black"],
        "description": "Unique fallen knight design denim jeans.",
        "in_stock": True
    },
    {
        "id": "prod-5",
        "name": "LAST SUPPER JACKET",
        "slug": "last-supper-jacket",
        "price": 8.85,
        "original_price": 75.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/RENAISSANCE-PRODUCT-IMAGES.jpg?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/RENAISSANCE-PRODUCT-IMAGES-1.jpg?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Multi"],
        "description": "Renaissance style jacket with Last Supper print.",
        "in_stock": True
    },
    {
        "id": "prod-6",
        "name": "HEAVENS ECLIPSE DENIM",
        "slug": "heavens-eclipse-denim",
        "price": 6.98,
        "original_price": 60.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/RENAISSANCE-PRODUCT-IMAGES-14.jpg?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/RENAISSANCE-PRODUCT-IMAGES-13.jpg?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["28", "30", "32", "34", "36"],
        "colors": ["Blue"],
        "description": "Heaven's eclipse themed denim jeans.",
        "in_stock": True
    },
    {
        "id": "prod-7",
        "name": "Fast Draw Black Denim",
        "slug": "fast-draw-black-denim",
        "price": 6.90,
        "original_price": 120.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/42.png?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/43-99dbe161-f5a8-4c86-b2c5-e3bcb3348bfe.png?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["28", "30", "32", "34", "36"],
        "colors": ["Black"],
        "description": "Fast draw design black denim jeans.",
        "in_stock": True
    },
    {
        "id": "prod-8",
        "name": "Fast Draw Denim",
        "slug": "fast-draw-denim",
        "price": 6.98,
        "original_price": 70.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/7-e7ce98eb-50ae-45c2-bdce-bd7bd29f465c.jpg?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/8-69deb065-a329-4eab-a869-725bfe67c69d.jpg?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["28", "30", "32", "34", "36"],
        "colors": ["Blue"],
        "description": "Fast draw design blue denim jeans.",
        "in_stock": True
    },
    {
        "id": "prod-9",
        "name": "Souk Jacket",
        "slug": "souk-jacket",
        "price": 7.60,
        "original_price": 120.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/6-1a0181bd-b655-457d-8ca2-fdf8b0739dc5.jpg?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/7-38701085-831f-449d-ac30-2f23883660dd.jpg?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Brown"],
        "description": "Premium souk style jacket with unique patterns.",
        "in_stock": True
    },
    {
        "id": "prod-10",
        "name": "BONNIE & CLYDE JACKET",
        "slug": "bonnie-clyde-jacket",
        "price": 7.60,
        "original_price": 75.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/15-2.jpg?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/16-dbc0ec5f-7a07-49d8-bfb0-8a7450e0fdf7.jpg?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Cream"],
        "description": "Bonnie & Clyde themed vintage jacket.",
        "in_stock": True
    },
    {
        "id": "prod-11",
        "name": "HERCULES JACKET",
        "slug": "hercules-jacket",
        "price": 7.60,
        "original_price": 75.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/RENAISSANCE-PRODUCT-IMAGES-2.jpg?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/RENAISSANCE-PRODUCT-IMAGES-3.jpg?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Multi"],
        "description": "Hercules themed renaissance jacket.",
        "in_stock": True
    },
    {
        "id": "prod-12",
        "name": "Velvet Shell Jacket",
        "slug": "velvet-shell-jacket",
        "price": 7.60,
        "original_price": 120.00,
        "currency": "USD",
        "images": [
            "https://img-va.myshopline.com/image/store/1747638107971/1-b0f0b861-6e1b-43e5-9a4b-0e73fb67fc95.jpg?w=1024&h=1280",
            "https://img-va.myshopline.com/image/store/1747638107971/2-642210ef-d46b-4eb8-8692-eb19526f52b7.jpg?w=1024&h=1280"
        ],
        "category_id": "cat-retro",
        "sizes": ["S", "M", "L", "XL", "XXL"],
        "colors": ["Purple"],
        "description": "Premium velvet shell jacket with unique design.",
        "in_stock": True
    }
]

async def seed_database():
    """Seed database with initial data if empty"""
    client = AsyncIOMotorClient(mongo_url)
    db = client[db_name]
    
    # Check if categories exist
    cat_count = await db.categories.count_documents({})
    if cat_count == 0:
        print("Seeding categories...")
        for cat in initial_categories:
            cat["created_at"] = datetime.utcnow() if "created_at" not in cat else cat["created_at"]
            await db.categories.insert_one(cat)
        print(f"Inserted {len(initial_categories)} categories")
    
    # Check if products exist
    prod_count = await db.products.count_documents({})
    if prod_count == 0:
        print("Seeding products...")
        for prod in initial_products:
            prod["created_at"] = datetime.utcnow() if "created_at" not in prod else prod["created_at"]
            await db.products.insert_one(prod)
        print(f"Inserted {len(initial_products)} products")
    
    # Create default admin user if not exists
    admin_exists = await db.users.find_one({"email": "admin@ddebuut.com"})
    if not admin_exists:
        from auth import get_password_hash
        admin_user = {
            "id": "admin-1",
            "email": "admin@ddebuut.com",
            "name": "Admin",
            "password": get_password_hash("admin123"),
            "is_admin": True,
            "created_at": datetime.utcnow()
        }
        await db.users.insert_one(admin_user)
        print("Created default admin user: admin@ddebuut.com / admin123")
    
    client.close()

if __name__ == "__main__":
    from datetime import datetime
    asyncio.run(seed_database())

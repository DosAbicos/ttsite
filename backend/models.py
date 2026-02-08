from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime
import uuid

# ============ User Models ============
class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    is_admin: bool

# ============ Category Models ============
class CategoryBase(BaseModel):
    name: str
    slug: str
    image: str

class CategoryCreate(CategoryBase):
    pass

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    image: Optional[str] = None

class Category(CategoryBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# ============ Product Models ============
class ProductBase(BaseModel):
    name: str
    slug: str
    price: float
    original_price: float
    currency: str = "USD"
    description: str
    images: List[str]
    category_id: str
    sizes: List[str]
    colors: List[str]
    in_stock: bool = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    price: Optional[float] = None
    original_price: Optional[float] = None
    description: Optional[str] = None
    images: Optional[List[str]] = None
    category_id: Optional[str] = None
    sizes: Optional[List[str]] = None
    colors: Optional[List[str]] = None
    in_stock: Optional[bool] = None

class Product(ProductBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# ============ Order Models ============
class ShippingAddress(BaseModel):
    first_name: str
    last_name: str
    address: str
    apartment: Optional[str] = None
    city: str
    zip_code: str
    phone: Optional[str] = None

class OrderItem(BaseModel):
    product_id: str
    name: str
    price: float
    size: str
    color: str
    quantity: int
    image: str

class OrderCreate(BaseModel):
    email: EmailStr
    shipping_address: ShippingAddress
    items: List[OrderItem]

class Order(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: Optional[str] = None
    email: str
    shipping_address: ShippingAddress
    items: List[OrderItem]
    subtotal: float
    shipping_cost: float
    total: float
    status: str = "pending"
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class OrderStatusUpdate(BaseModel):
    status: str

# ============ Review Models ============
class ReviewBase(BaseModel):
    product_id: str
    rating: int  # 1-5
    title: str
    comment: str

class ReviewCreate(ReviewBase):
    order_id: str  # To verify the user actually purchased

class Review(ReviewBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    verified_purchase: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# ============ Token Models ============
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None

# ============ Hero Slide Models ============
class HeroSlideBase(BaseModel):
    image: str
    link: str = "/collections"

class HeroSlideCreate(HeroSlideBase):
    order: Optional[int] = None

class HeroSlideUpdate(BaseModel):
    image: Optional[str] = None
    link: Optional[str] = None
    order: Optional[int] = None

class HeroSlide(HeroSlideBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    order: int = 1
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

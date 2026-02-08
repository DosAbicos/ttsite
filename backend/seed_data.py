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

# Initial reviews data (fake reviews for demonstration)
initial_reviews = [
    # Reviews for prod-1 (BLOSSOM WORKWEAR JACKET)
    {"id": "rev-1", "product_id": "prod-1", "user_name": "Maria K.", "rating": 5, "title": "Absolutely stunning!", "comment": "This jacket exceeded my expectations. The quality is amazing and the blossom embroidery is so detailed.", "verified_purchase": True},
    {"id": "rev-2", "product_id": "prod-1", "user_name": "Alex T.", "rating": 4, "title": "Great quality", "comment": "Beautiful jacket, fits perfectly. Only giving 4 stars because shipping took a bit longer than expected.", "verified_purchase": True},
    {"id": "rev-3", "product_id": "prod-1", "user_name": "Sophie L.", "rating": 5, "title": "Worth every penny", "comment": "I get compliments every time I wear this. The cream color is gorgeous!", "verified_purchase": True},
    
    # Reviews for prod-2 (Blossom Black Denim)
    {"id": "rev-4", "product_id": "prod-2", "user_name": "James W.", "rating": 5, "title": "Perfect fit!", "comment": "These jeans fit like a glove. The black is deep and rich, very stylish.", "verified_purchase": True},
    {"id": "rev-5", "product_id": "prod-2", "user_name": "Emma R.", "rating": 4, "title": "Nice denim", "comment": "Good quality denim, comfortable to wear all day. The blossom pattern is subtle but nice.", "verified_purchase": True},
    
    # Reviews for prod-3 (Blossom Denim)
    {"id": "rev-6", "product_id": "prod-3", "user_name": "David M.", "rating": 5, "title": "Amazing design", "comment": "The light blue color is perfect for summer. The embroidery details are beautiful.", "verified_purchase": True},
    {"id": "rev-7", "product_id": "prod-3", "user_name": "Linda P.", "rating": 5, "title": "Love it!", "comment": "Second pair I bought because I loved the first one so much!", "verified_purchase": True},
    {"id": "rev-8", "product_id": "prod-3", "user_name": "Michael S.", "rating": 4, "title": "Good quality", "comment": "Nice jeans, true to size. Would recommend.", "verified_purchase": True},
    
    # Reviews for prod-4 (Fallen Knight Denim)
    {"id": "rev-9", "product_id": "prod-4", "user_name": "Chris B.", "rating": 5, "title": "Unique design!", "comment": "Never seen anything like this. The fallen knight design is so unique and edgy.", "verified_purchase": True},
    {"id": "rev-10", "product_id": "prod-4", "user_name": "Anna K.", "rating": 4, "title": "Very cool", "comment": "Great jeans with an artistic touch. Comfortable too!", "verified_purchase": True},
    
    # Reviews for prod-5 (LAST SUPPER JACKET)
    {"id": "rev-11", "product_id": "prod-5", "user_name": "Robert H.", "rating": 5, "title": "Masterpiece!", "comment": "This jacket is a work of art. The print quality is exceptional.", "verified_purchase": True},
    {"id": "rev-12", "product_id": "prod-5", "user_name": "Jessica N.", "rating": 5, "title": "Conversation starter", "comment": "Everyone asks me where I got this jacket. Absolutely love it!", "verified_purchase": True},
    {"id": "rev-13", "product_id": "prod-5", "user_name": "Thomas G.", "rating": 4, "title": "Great jacket", "comment": "Beautiful design, good quality material. Runs slightly large.", "verified_purchase": True},
    
    # Reviews for prod-6 (HEAVENS ECLIPSE DENIM)
    {"id": "rev-14", "product_id": "prod-6", "user_name": "Sarah J.", "rating": 5, "title": "Heavenly!", "comment": "The eclipse design is breathtaking. Perfect fit and super comfortable.", "verified_purchase": True},
    {"id": "rev-15", "product_id": "prod-6", "user_name": "Daniel C.", "rating": 4, "title": "Nice jeans", "comment": "Good quality denim with a unique design. Happy with my purchase.", "verified_purchase": True},
    
    # Reviews for prod-7 (Fast Draw Black Denim)
    {"id": "rev-16", "product_id": "prod-7", "user_name": "Kevin L.", "rating": 5, "title": "Sleek and stylish", "comment": "These black jeans are perfect for any occasion. Love the subtle design.", "verified_purchase": True},
    {"id": "rev-17", "product_id": "prod-7", "user_name": "Michelle T.", "rating": 5, "title": "Best purchase!", "comment": "Fits perfectly, looks amazing. Will definitely buy more!", "verified_purchase": True},
    
    # Reviews for prod-8 (Fast Draw Denim)
    {"id": "rev-18", "product_id": "prod-8", "user_name": "Brian F.", "rating": 4, "title": "Good jeans", "comment": "Nice blue color, comfortable fit. The fast draw design is cool.", "verified_purchase": True},
    {"id": "rev-19", "product_id": "prod-8", "user_name": "Laura W.", "rating": 5, "title": "Love the design", "comment": "Unique design that stands out. Great quality too!", "verified_purchase": True},
    
    # Reviews for prod-9 (Souk Jacket)
    {"id": "rev-20", "product_id": "prod-9", "user_name": "Paul D.", "rating": 5, "title": "Premium quality", "comment": "The patterns on this jacket are incredible. Premium feel and look.", "verified_purchase": True},
    {"id": "rev-21", "product_id": "prod-9", "user_name": "Nicole M.", "rating": 4, "title": "Beautiful jacket", "comment": "Love the brown color and unique patterns. Slightly heavy but worth it.", "verified_purchase": True},
    
    # Reviews for prod-10 (BONNIE & CLYDE JACKET)
    {"id": "rev-22", "product_id": "prod-10", "user_name": "Steve R.", "rating": 5, "title": "Vintage vibes!", "comment": "This jacket gives off such cool vintage vibes. Love the Bonnie & Clyde theme!", "verified_purchase": True},
    {"id": "rev-23", "product_id": "prod-10", "user_name": "Amy H.", "rating": 5, "title": "Stunning!", "comment": "The cream color is beautiful and the design is so unique. Gets compliments everywhere.", "verified_purchase": True},
    
    # Reviews for prod-11 (HERCULES JACKET)
    {"id": "rev-24", "product_id": "prod-11", "user_name": "George K.", "rating": 5, "title": "Powerful look", "comment": "Feel like a hero wearing this jacket. The renaissance design is amazing!", "verified_purchase": True},
    {"id": "rev-25", "product_id": "prod-11", "user_name": "Rachel E.", "rating": 4, "title": "Great design", "comment": "Love the Hercules theme. Quality is good, colors are vibrant.", "verified_purchase": True},
    
    # Reviews for prod-12 (Velvet Shell Jacket)
    {"id": "rev-26", "product_id": "prod-12", "user_name": "Mark V.", "rating": 5, "title": "Luxurious feel", "comment": "The velvet is so soft and the purple color is rich. Premium quality!", "verified_purchase": True},
    {"id": "rev-27", "product_id": "prod-12", "user_name": "Diana S.", "rating": 5, "title": "Absolutely love it!", "comment": "This jacket is gorgeous! The design is unique and the quality is top-notch.", "verified_purchase": True},
    {"id": "rev-28", "product_id": "prod-12", "user_name": "Jason P.", "rating": 4, "title": "Very nice", "comment": "Beautiful jacket, stands out from the crowd. Comfortable to wear.", "verified_purchase": True},
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
    
    # Seed reviews if empty
    reviews_count = await db.reviews.count_documents({})
    if reviews_count == 0:
        print("Seeding reviews...")
        for review in initial_reviews:
            review["created_at"] = datetime.utcnow() if "created_at" not in review else review["created_at"]
            await db.reviews.insert_one(review)
        print(f"Inserted {len(initial_reviews)} reviews")
    
    client.close()

if __name__ == "__main__":
    from datetime import datetime
    asyncio.run(seed_database())

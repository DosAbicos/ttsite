#!/usr/bin/env python3
"""
Debug MongoDB ObjectId serialization issue
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent / "backend"
load_dotenv(ROOT_DIR / '.env')

async def debug_mongo():
    # MongoDB connection
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ.get('DB_NAME', 'ddebuut')]
    
    print("🔍 Checking MongoDB data...")
    
    # Check products
    products = await db.products.find().limit(1).to_list(1)
    print(f"\nProducts count: {await db.products.count_documents({})}")
    if products:
        print("Sample product structure:")
        for key, value in products[0].items():
            print(f"  {key}: {type(value)} = {value}")
    
    # Check categories  
    categories = await db.categories.find().limit(1).to_list(1)
    print(f"\nCategories count: {await db.categories.count_documents({})}")
    if categories:
        print("Sample category structure:")
        for key, value in categories[0].items():
            print(f"  {key}: {type(value)} = {value}")
    
    client.close()

if __name__ == "__main__":
    asyncio.run(debug_mongo())
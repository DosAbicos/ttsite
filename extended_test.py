#!/usr/bin/env python3
"""
Extended Backend API Tests - Comprehensive validation
"""

import requests
import json

def test_extended_api():
    base_url = "https://ecommerce-staging.preview.emergentagent.com"
    
    print("🧪 Extended API Testing...")
    print("=" * 50)
    
    # Test products endpoint with filters
    print("\n1. Testing products with category filter:")
    response = requests.get(f"{base_url}/api/products?category=retro-series")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Retro products: {data['total']} found")
    else:
        print(f"   ❌ Category filter failed: {response.status_code}")
    
    # Test products endpoint with price filter
    print("\n2. Testing products with price filter:")
    response = requests.get(f"{base_url}/api/products?min_price=7&max_price=8")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Price filtered products: {data['total']} found")
    else:
        print(f"   ❌ Price filter failed: {response.status_code}")
    
    # Test single product by slug
    print("\n3. Testing single product endpoint:")
    response = requests.get(f"{base_url}/api/products/blossom-workwear-jacket")
    if response.status_code == 200:
        product = response.json()
        print(f"   ✅ Product: {product['name']} - ${product['price']}")
    else:
        print(f"   ❌ Single product failed: {response.status_code}")
    
    # Test single category by slug
    print("\n4. Testing single category endpoint:")
    response = requests.get(f"{base_url}/api/categories/retro-series")
    if response.status_code == 200:
        category = response.json()
        print(f"   ✅ Category: {category['name']} (slug: {category['slug']})")
    else:
        print(f"   ❌ Single category failed: {response.status_code}")
    
    # Test auth/me endpoint
    print("\n5. Testing auth/me with token:")
    # First login
    login_response = requests.post(
        f"{base_url}/api/auth/login",
        json={"email": "admin@ddebuut.com", "password": "admin123"}
    )
    
    if login_response.status_code == 200:
        token = login_response.json()["access_token"]
        me_response = requests.get(
            f"{base_url}/api/auth/me",
            headers={"Authorization": f"Bearer {token}"}
        )
        
        if me_response.status_code == 200:
            user = me_response.json()
            print(f"   ✅ User: {user['name']} ({user['email']}) - Admin: {user['is_admin']}")
        else:
            print(f"   ❌ Auth/me failed: {me_response.status_code}")
    else:
        print(f"   ❌ Login failed: {login_response.status_code}")
    
    print("\n✅ Extended testing complete!")

if __name__ == "__main__":
    test_extended_api()
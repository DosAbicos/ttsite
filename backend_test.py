#!/usr/bin/env python3
"""
Backend API Test Suite for ddebuut.com Clone
Testing endpoints at: https://nostalgic-rubin-1.preview.emergentagent.com/api
"""

import requests
import json
from typing import Dict, Any

class BackendTester:
    def __init__(self, base_url: str):
        self.base_url = base_url.rstrip('/')
        self.session = requests.Session()
        self.access_token = None
        self.test_results = []
    
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Any = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "response_data": response_data
        }
        self.test_results.append(result)
        print(f"{'✅' if success else '❌'} {test_name}: {details}")
        if response_data and not success:
            print(f"   Response: {response_data}")
    
    def test_root_endpoint(self):
        """Test GET /api/ - Should return API info"""
        try:
            response = self.session.get(f"{self.base_url}/api/")
            
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "version" in data:
                    self.log_test("GET /api/", True, f"API Info: {data['message']} v{data['version']}", data)
                    return True
                else:
                    self.log_test("GET /api/", False, f"Missing required fields in response", data)
                    return False
            else:
                self.log_test("GET /api/", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("GET /api/", False, f"Request failed: {str(e)}")
            return False
    
    def test_products_endpoint(self):
        """Test GET /api/products - Should return products list"""
        try:
            response = self.session.get(f"{self.base_url}/api/products")
            
            if response.status_code == 200:
                data = response.json()
                if "products" in data and "total" in data:
                    products = data["products"]
                    if isinstance(products, list) and len(products) > 0:
                        # Check if products have required fields
                        sample_product = products[0]
                        required_fields = ["id", "name", "slug", "price", "images", "category_id"]
                        missing_fields = [field for field in required_fields if field not in sample_product]
                        
                        if not missing_fields:
                            self.log_test("GET /api/products", True, f"Found {len(products)} products, total: {data['total']}")
                            return True
                        else:
                            self.log_test("GET /api/products", False, f"Products missing fields: {missing_fields}", sample_product)
                            return False
                    else:
                        self.log_test("GET /api/products", False, "No products found in database")
                        return False
                else:
                    self.log_test("GET /api/products", False, "Response missing 'products' or 'total' field", data)
                    return False
            else:
                self.log_test("GET /api/products", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("GET /api/products", False, f"Request failed: {str(e)}")
            return False
    
    def test_categories_endpoint(self):
        """Test GET /api/categories - Should return categories list"""
        try:
            response = self.session.get(f"{self.base_url}/api/categories")
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list) and len(data) > 0:
                    # Check if categories have required fields
                    sample_category = data[0]
                    required_fields = ["id", "name", "slug", "image"]
                    missing_fields = [field for field in required_fields if field not in sample_category]
                    
                    if not missing_fields:
                        self.log_test("GET /api/categories", True, f"Found {len(data)} categories")
                        return True
                    else:
                        self.log_test("GET /api/categories", False, f"Categories missing fields: {missing_fields}", sample_category)
                        return False
                else:
                    self.log_test("GET /api/categories", False, "No categories found or invalid response format", data)
                    return False
            else:
                self.log_test("GET /api/categories", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("GET /api/categories", False, f"Request failed: {str(e)}")
            return False
    
    def test_login_endpoint(self):
        """Test POST /api/auth/login with admin credentials"""
        try:
            login_data = {
                "email": "admin@ddebuut.com",
                "password": "admin123"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/auth/login",
                json=login_data,
                headers={"Content-Type": "application/json"}
            )
            
            if response.status_code == 200:
                data = response.json()
                if "access_token" in data:
                    self.access_token = data["access_token"]
                    self.log_test("POST /api/auth/login", True, "Admin login successful, token received")
                    return True
                else:
                    self.log_test("POST /api/auth/login", False, "No access_token in response", data)
                    return False
            else:
                self.log_test("POST /api/auth/login", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("POST /api/auth/login", False, f"Request failed: {str(e)}")
            return False
    
    def test_admin_stats_endpoint(self):
        """Test GET /api/admin/stats with authentication"""
        if not self.access_token:
            self.log_test("GET /api/admin/stats", False, "No access token available - login first")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = self.session.get(f"{self.base_url}/api/admin/stats", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ["products", "categories", "orders", "users", "total_revenue"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields:
                    stats_info = f"Products: {data['products']}, Categories: {data['categories']}, Orders: {data['orders']}, Users: {data['users']}"
                    self.log_test("GET /api/admin/stats", True, stats_info)
                    return True
                else:
                    self.log_test("GET /api/admin/stats", False, f"Stats missing fields: {missing_fields}", data)
                    return False
            else:
                self.log_test("GET /api/admin/stats", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("GET /api/admin/stats", False, f"Request failed: {str(e)}")
            return False
    
    def test_admin_products_endpoint(self):
        """Test GET /api/admin/products with authentication"""
        if not self.access_token:
            self.log_test("GET /api/admin/products", False, "No access token available - login first")
            return False
        
        try:
            headers = {"Authorization": f"Bearer {self.access_token}"}
            response = self.session.get(f"{self.base_url}/api/admin/products", headers=headers)
            
            if response.status_code == 200:
                data = response.json()
                if isinstance(data, list):
                    if len(data) > 0:
                        # Check if products have required admin fields
                        sample_product = data[0]
                        required_fields = ["id", "name", "slug", "price", "original_price", "created_at"]
                        missing_fields = [field for field in required_fields if field not in sample_product]
                        
                        if not missing_fields:
                            self.log_test("GET /api/admin/products", True, f"Found {len(data)} admin products")
                            return True
                        else:
                            self.log_test("GET /api/admin/products", False, f"Admin products missing fields: {missing_fields}", sample_product)
                            return False
                    else:
                        self.log_test("GET /api/admin/products", False, "No products found for admin")
                        return False
                else:
                    self.log_test("GET /api/admin/products", False, "Invalid response format - expected array", data)
                    return False
            else:
                self.log_test("GET /api/admin/products", False, f"HTTP {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_test("GET /api/admin/products", False, f"Request failed: {str(e)}")
            return False
    
    def test_database_seeded(self):
        """Verify database is properly seeded with data"""
        print("\n🔍 Verifying Database Seeding...")
        
        # Check if we have products and categories
        has_products = any(result["test"] == "GET /api/products" and result["success"] for result in self.test_results)
        has_categories = any(result["test"] == "GET /api/categories" and result["success"] for result in self.test_results)
        
        if has_products and has_categories:
            self.log_test("Database Seeding", True, "Database properly seeded with products and categories")
            return True
        else:
            missing = []
            if not has_products:
                missing.append("products")
            if not has_categories:
                missing.append("categories")
            self.log_test("Database Seeding", False, f"Database missing: {', '.join(missing)}")
            return False
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"🧪 Testing Backend API at: {self.base_url}")
        print("=" * 60)
        
        # Test all endpoints in order
        tests = [
            self.test_root_endpoint,
            self.test_products_endpoint,
            self.test_categories_endpoint,
            self.test_login_endpoint,
            self.test_admin_stats_endpoint,
            self.test_admin_products_endpoint,
            self.test_database_seeded
        ]
        
        success_count = 0
        for test in tests:
            if test():
                success_count += 1
        
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {success_count}/{len(tests)} tests passed")
        
        # Summary of failures
        failures = [result for result in self.test_results if not result["success"]]
        if failures:
            print("\n❌ Failed Tests:")
            for failure in failures:
                print(f"   • {failure['test']}: {failure['details']}")
        
        return success_count == len(tests)

def main():
    # Use the configured backend URL
    backend_url = "https://nostalgic-rubin-1.preview.emergentagent.com"
    
    tester = BackendTester(backend_url)
    all_passed = tester.run_all_tests()
    
    if all_passed:
        print("\n🎉 All backend tests passed!")
    else:
        print("\n⚠️  Some backend tests failed - check details above")
    
    return all_passed

if __name__ == "__main__":
    main()
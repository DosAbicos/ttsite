# ddebuut.com Clone - API Contracts

## Database Models

### User
- id: string (UUID)
- email: string (unique)
- password: string (hashed)
- name: string
- is_admin: boolean (default: false)
- created_at: datetime

### Category
- id: string (UUID)
- name: string
- slug: string (unique)
- image: string (URL)
- created_at: datetime

### Product
- id: string (UUID)
- name: string
- slug: string (unique)
- price: float
- original_price: float
- currency: string (default: "USD")
- description: string
- images: list[string]
- category_id: string (FK)
- sizes: list[string]
- colors: list[string]
- in_stock: boolean (default: true)
- created_at: datetime

### Order
- id: string (UUID)
- user_id: string (FK, optional for guest checkout)
- email: string
- shipping_address: object
- items: list[OrderItem]
- subtotal: float
- shipping_cost: float
- total: float
- status: string (pending, processing, shipped, delivered)
- created_at: datetime

### OrderItem
- product_id: string
- name: string
- price: float
- size: string
- color: string
- quantity: int
- image: string

## API Endpoints

### Auth
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user
- POST /api/auth/logout - Logout user

### Products (Public)
- GET /api/products - List all products (with filters)
- GET /api/products/{slug} - Get product by slug

### Categories (Public)
- GET /api/categories - List all categories
- GET /api/categories/{slug} - Get category by slug

### Orders
- POST /api/orders - Create new order
- GET /api/orders - Get user orders (authenticated)
- GET /api/orders/{id} - Get order by ID

### Admin Endpoints (requires admin auth)
- GET /api/admin/products - List all products
- POST /api/admin/products - Create product
- PUT /api/admin/products/{id} - Update product
- DELETE /api/admin/products/{id} - Delete product

- GET /api/admin/categories - List all categories
- POST /api/admin/categories - Create category
- PUT /api/admin/categories/{id} - Update category
- DELETE /api/admin/categories/{id} - Delete category

- GET /api/admin/orders - List all orders
- PUT /api/admin/orders/{id}/status - Update order status

- GET /api/admin/users - List all users
- PUT /api/admin/users/{id}/admin - Toggle admin status

## Frontend Integration

### Replace mock data with API calls:
1. HomePage - fetch products and categories from API
2. CollectionPage - fetch products with filters
3. ProductPage - fetch single product
4. CheckoutPage - submit order to API
5. Auth forms - use API for login/register

### Add Admin Panel:
- /admin - Admin dashboard
- /admin/products - Product management
- /admin/categories - Category management
- /admin/orders - Order management

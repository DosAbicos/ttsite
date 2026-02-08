# Songy E-Commerce - PRD

## Original Problem Statement
Create a 100% functional, multi-page clone of the e-commerce website `https://ddebuut.com/` with working forms, authorization, and shopping cart. Additional features include admin panel, Stripe payments, product recommendations, and customer reviews.

## Brand Info
- **Name:** Songy
- **Domain:** songy.me
- **Logo:** Black text "Songy" on white background

## Tech Stack
- **Frontend:** React.js with Tailwind CSS
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Payments:** Stripe
- **Auth:** JWT-based authentication

## Implemented Features

### Core E-Commerce (Completed)
- [x] Home page with product showcase
- [x] Collections/Categories pages
- [x] Product detail pages with images, sizes, colors
- [x] Shopping cart functionality
- [x] Checkout flow
- [x] User authentication (register/login)

### Admin Panel (Completed)
- [x] Products management (CRUD)
- [x] Categories management (CRUD)
- [x] Orders management
- [x] Users management
- [x] Dashboard with stats
- [x] Image upload for products (file upload + URL support) - Added 2026-02-08
- [x] Hero Slides management (homepage carousel) - Added 2026-02-08

### Customer Features (Added 2026-02-08)
- [x] Order history page (/orders)
- [x] "My Orders" link in user menu
- [x] "View My Orders" button on checkout success

### Payments (Completed)
- [x] Stripe integration
- [x] Checkout session creation
- [x] Payment status tracking
- [x] Webhook handling

### Product Reviews (Completed - 2026-02-08)
- [x] Review display on product pages
- [x] Star ratings with average calculation
- [x] Verified purchase badges
- [x] Review submission for purchasers
- [x] 28 fake reviews seeded for demonstration
- [x] Customer Reviews section positioned above "You May Also Like"

### Product Recommendations (Completed)
- [x] "You May Also Like" section
- [x] Horizontal scroll carousel
- [x] Excludes current product

### Footer (Completed)
- [x] Payment icons (Visa, Mastercard, PayPal)
- [x] Quick links
- [x] Customer service links

## API Endpoints

### Public
- `GET /api/products` - List products with filters
- `GET /api/products/{slug}` - Get product by slug
- `GET /api/categories` - List categories
- `GET /api/reviews/product/{slug}` - Get product reviews

### Auth
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

### Payments
- `POST /api/checkout/create` - Create Stripe checkout
- `GET /api/checkout/status/{session_id}` - Check payment status

### Admin (requires auth)
- `/api/admin/products` - Products CRUD
- `/api/admin/categories` - Categories CRUD
- `/api/admin/orders` - Orders management
- `/api/admin/users` - Users management
- `/api/admin/stats` - Dashboard stats

## Database Schema

### Products
```
{id, name, slug, price, original_price, images[], category_id, sizes[], colors[], description, in_stock}
```

### Reviews
```
{id, product_id, user_name, rating, title, comment, verified_purchase, created_at}
```

### Users
```
{id, email, name, password, is_admin, created_at}
```

### Orders
```
{id, user_id, email, shipping_address, items[], subtotal, shipping_cost, total, status, paid, created_at}
```

## Test Credentials
- **Admin:** admin@ddebuut.com / admin123

## Pending Issues (P1)
- [ ] Admin panel: Verify categories/products lists display correctly

## Upcoming Tasks
- [ ] E2E Stripe payment flow testing
- [ ] Error handling improvements on frontend

## Backlog (P2)
- [ ] Refactor MongoDB _id exclusion into helper function
- [ ] User-friendly error messages
- [ ] Order confirmation emails

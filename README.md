# <img src="image.png" width=250px height=auto alt="Logo">

# E-Commerce Platform: Admin Dashboard + Store

This project provides a comprehensive solution for online stores, featuring a powerful admin dashboard and a customer-facing store frontend. It uses a modern tech stack with direct database access and API fallbacks for robust data retrieval.

## Features

### Admin Dashboard (http://localhost:3000)

#### Store Management
- **Multi-store Support**: Create and manage multiple stores with independent inventories
- **Dashboard Analytics**: View key metrics like revenue, sales, and inventory status
- **User Management**: Assign staff roles and permissions (via Clerk)

#### Content Management
- **Billboard Management**: Create attractive promotional banners with images and text
  - Add, edit, and delete billboards
  - Set billboard visibility and order
  - Assign billboards to specific categories

- **Category Management**: Organize products into browsable categories
  - Create nested category structures
  - Assign categories to billboards for visual presentation
  - Reorder categories as needed

- **Size Management**: Define available product sizes
  - Create custom size options (S, M, L, XL, etc.)
  - Set size values for consistent filtering

- **Color Management**: Define available product colors
  - Add colors with visual color picker
  - Set color values with hex codes

#### Product Management
- **Product Creation**: Create detailed product listings
  - Add product name, description, price
  - Mark products as featured to highlight on homepage
  - Archive products without deleting them
  
- **Variant Management**: Create multiple versions of products
  - Combine sizes and colors to create unique variants
  - Set stock levels for each variant
  - Track inventory for each variant separately

- **Image Management**: Upload and manage product images
  - Multiple images per product
  - Cloud storage via Cloudinary
  - Image reordering

#### Order Management
- **Order Tracking**: View all customer orders
  - See order details including products, quantities, and prices
  - Track payment status (paid/unpaid)
  - Track fulfillment status (sent/not sent)

- **Order Processing**: Process customer orders
  - Mark orders as sent when shipped
  - View customer contact information

#### Payment Integration
- **Stripe Integration**: Process payments securely
  - Real-time payment processing
  - Webhook support for payment confirmation
  - Secure checkout flow

### Store Frontend (http://localhost:3001)

#### User Experience
- **Responsive Design**: Fully mobile-responsive interface
  - Adapts to all screen sizes
  - Touch-friendly navigation
  - Optimized for mobile and desktop

- **Navigation**: Intuitive site navigation
  - Category-based browsing
  - Search functionality
  - Featured product showcase
  - Billboard promotions

#### Product Discovery
- **Homepage**: Featured products and promotions
  - Billboard slider with promotional content
  - Featured products section
  - Category quicklinks

- **Category Browsing**: Browse products by category
  - Filter by size and color
  - Sort by price and newest
  - Quick view functionality

- **Search**: Find products quickly
  - Search by product name
  - Real-time search results
  - Filter search results

#### Product Interaction
- **Product Details**: Comprehensive product information
  - Multiple product images
  - Detailed descriptions
  - Size and color selection
  - Stock availability
  - Related products

- **Quick View**: Preview products without leaving current page
  - Essential product information
  - Add to cart functionality
  - Continue shopping seamlessly

#### Shopping Experience
- **Cart Management**: Manage shopping cart
  - Add/remove products
  - Update quantities
  - View cart summary
  - Persistent cart (survives page refresh)

- **Checkout Process**: Streamlined checkout
  - Shipping information collection
  - Secure payment via Stripe
  - Order confirmation
  - Receipt generation

#### Account Features
- **Favorites/Wishlist**: Save products for later
  - Add/remove favorite products
  - Persistent favorites list
  - Quick add to cart from favorites

- **Order History**: View past orders
  - Order details and status
  - Order tracking

## Technical Architecture

The project consists of two separate Next.js applications that work together:

1. **Admin Dashboard** (`ecommerce-admin`) - For store management
2. **Store Frontend** (`ecommerce-store`) - For customer shopping

### Data Access Pattern

The store frontend implements a dual data access approach:
1. **Primary: Direct Database Access** - The store connects directly to the MongoDB database using Prisma
2. **Fallback: API Calls** - If direct database access fails, the store falls back to calling the Admin API

This approach provides:
- Improved performance with direct database reads
- Redundancy in case of database connection issues
- Consistent data between admin and store

### Database Schema

The MongoDB database schema includes the following key models:

- **Store**: The top-level entity for multi-store support
- **Billboard**: Promotional banners shown on the store
- **Category**: Product categories with billboard associations
- **Size**: Product size options
- **Color**: Product color options
- **Product**: Core product information
- **Variant**: Specific product variants (size/color combinations)
- **Image**: Product images
- **Order**: Customer orders
- **OrderItem**: Individual items within an order
- **User**: User accounts (including auth via Clerk)
- **Favorite**: User-saved favorite products

## Tech Stack

**Frontend:** 
- React 18
- Next.js 13 (App Router)
- TailwindCSS for styling
- shadcn/ui components
- Zustand for state management
- SWR for data fetching
- React Hot Toast for notifications

**Backend:**
- Prisma ORM
- MongoDB database
- Next.js API routes
- Server Components & Server Actions

**Third-party Services:**
- Clerk (Authentication)
- Cloudinary (Image storage)
- Stripe (Payment processing)
- Uploadthing (File uploads)

## Installation and Setup

### Prerequisites
- Node.js 18+ and npm
- MongoDB database (cloud or local)
- Accounts with Clerk, Cloudinary, and Stripe

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/ecommerce-project.git
cd ecommerce-project
```

### 2. Admin Dashboard Setup

```bash
cd ecommerce-admin
npm install
```

Create a `.env` file in the `ecommerce-admin` directory with:

```bash
# Environment Variables
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y29uY3JldGUtbXV0dC02LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_xRcw8YjDFj5GxfabiwRZHz9yQM9I43PYM2nrjYAst4
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# MongoDB
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ecommerce"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_APP_ID=your_app_id

# Stripe
STRIPE_API_KEY=sk_test_your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
FRONTEND_STORE_URL=http://localhost:3001

# For local development webhook
STRIPE_WEBHOOK_SECRET=whsec_local_development_secret
```

Initialize Prisma:
```bash
npx prisma generate
npx prisma db push
```

Start the admin dashboard:
```bash
npm run dev
```

### 3. Store Frontend Setup

```bash
cd ../ecommerce-store
npm install
```

Create a `.env` file in the `ecommerce-store` directory with:

```bash
# Database - Same connection string as admin
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/ecommerce"

# NextAuth
NEXTAUTH_URL="http://localhost:3001"
NEXTAUTH_SECRET="YourSuperSecretKeyHere-UseAStrongSecretKey"

# Admin API Connection - Base URL without store ID
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Stripe - Same keys as admin
STRIPE_API_KEY=sk_test_your_stripe_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_local_development_secret

# Cloudinary - Same as admin
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_APP_ID=your_app_id

# Clerk - Same keys as admin
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_Y29uY3JldGUtbXV0dC02LmNsZXJrLmFjY291bnRzLmRldiQ
CLERK_SECRET_KEY=sk_test_xRcw8YjDFj5GxfabiwRZHz9yQM9I43PYM2nrjYAst4
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

Initialize Prisma for the store:
```bash
npx prisma generate
```

Start the store:
```bash
npm run dev
```

## Initial Setup Steps

1. Access the Admin Dashboard at http://localhost:3000
2. Sign in with Clerk
3. Create a new store
4. Add billboards, categories, sizes, and colors
5. Add products with variants
6. Visit the Store Frontend at http://localhost:3001 to see your products

## Data Synchronization

The store and admin dashboard are automatically synchronized through:
1. Shared MongoDB database
2. Identical Prisma schema
3. Dual data access strategy (direct DB + API fallback)

This ensures that any changes made in the admin dashboard immediately appear in the store.

## Key Workflows

### Admin Workflows

1. **Creating a Product**:
   - Navigate to Products in your store
   - Click "Add New"
   - Fill in product details (name, description, price)
   - Upload product images
   - Select a category
   - Set featured and archived status
   - Create variants with size and color combinations
   - Set stock levels for each variant
   - Save the product

2. **Managing Orders**:
   - View all orders in the Orders section
   - Check payment status (paid/unpaid)
   - Mark orders as sent when fulfilled
   - View customer details

3. **Creating Billboards**:
   - Go to Billboards section
   - Add a new billboard with image and text
   - Assign to store front or specific categories

### Store Workflows

1. **Customer Shopping**:
   - Browse products by category or featured items
   - Filter by size, color, or price
   - View product details
   - Select variant (size/color)
   - Add to cart
   - Proceed to checkout
   - Enter shipping information
   - Complete payment with Stripe

2. **Account Management**:
   - Create account or shop as guest
   - Save favorite products
   - View order history and status

## Troubleshooting

### Common Issues

#### Database Connection
- Ensure your MongoDB connection string is correct
- Check that both projects use the exact same `DATABASE_URL`
- Run `npx prisma generate` after any schema changes

#### API Errors
- Check console for error messages about API calls
- Verify the `NEXT_PUBLIC_API_URL` is set to `http://localhost:3000/api` (without store ID)
- Ensure the admin server is running when accessing the store

#### Missing Products/Categories
- Look for database connection errors in the console
- Verify products are marked as "Featured" to appear on the homepage
- Check products aren't archived in the admin panel

#### Category JSON Errors
- If you see "Unexpected token '<', '<!DOCTYPE'" errors, implement direct DB access for categories
- This error occurs when the API fallback doesn't return proper JSON

#### Clerk Authentication Issues
- Ensure Clerk environment variables are correctly set
- Check for CORS issues if using custom domains

## Development Workflow

### Adding New Features

1. **Update Prisma Schema**: Make changes in `prisma/schema.prisma` in admin project
2. **Generate Prisma Client**: Run `npx prisma generate` in both projects
3. **Copy Schema**: Copy schema changes to store project
4. **Update DB**: Run `npx prisma db push` from admin project

### API Routes

When adding new API endpoints:
1. Create route in admin project (e.g., `/api/[storeId]/new-feature`)
2. Update store actions to fetch from this endpoint as a fallback
3. Implement direct DB access in store actions as primary method

### Dual Access Pattern

When implementing a new data access function:
1. Create a function in the store's `actions` directory
2. First attempt to access data directly via Prisma
3. If Prisma access fails, fall back to API call
4. Include proper error handling for both methods
5. Return consistent data structure regardless of source

## Project Structure

### Admin Dashboard
```
ecommerce-admin/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   └── [storeId]/      # Store-specific API routes
│   ├── (dashboard)/        # Dashboard routes
│   │   └── [storeId]/      # Store-specific dashboard
│   └── (auth)/             # Authentication routes
├── components/             # UI components
├── hooks/                  # Custom React hooks
├── prisma/                 # Prisma schema and client
└── lib/                    # Utility functions
```

### Store Frontend
```
ecommerce-store/
├── app/                    # Next.js App Router
│   └── (routes)/           # Store routes
├── components/             # UI components
├── actions/                # Data fetching functions with dual access
├── hooks/                  # Custom React hooks
├── prisma/                 # Prisma schema and client
└── lib/                    # Utility functions
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database ORM
- [MongoDB](https://www.mongodb.com/) - Database
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [shadcn/ui](https://ui.shadcn.com/) - UI component library
- [Clerk](https://clerk.dev/) - Authentication
- [Cloudinary](https://cloudinary.com/) - Image storage
- [Stripe](https://stripe.com/) - Payment processing

## Screenshots

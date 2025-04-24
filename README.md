# <img src="image.png" width=250px height=auto alt="Logo">

This project serves as a comprehensive solution for online stores, seamlessly integrating real-time store management with an elegant and efficient e-commerce platform. It was created as a reference point to understand how to build an advanced online store.

## Features

- Admin dashboard featuring extensive functionalities for modifying size, color, main billboard, and category options
- Creating products with many possible variants
- Managing orders for future employees
- Client store site with product page, quickview, filtered categories, search bar, cart and summary checkout
- **NEW:** Customer authentication with secure sign-up, sign-in, and profile management
- **NEW:** Customer profile dashboard with order history, favorites, and personal information
- **NEW:** Admin control panel for managing customers and viewing customer data

## Tech Stack

**Client:** React, Next.js, TailwindCSS, shadcn/ui

**Server:** Prisma with MongoDB

**Authentication:** 
- Admin: Clerk (for admin dashboard)
- Customer: Custom authentication with Prisma and MongoDB (for store customers)

**Payment:** Stripe

## Demo

Admin Dashboard: https://localhost:3000

Store: https://localhost:3001
## Installation

To install this project you have to run both instances (Admin Dashboard and Store) in separate servers. Download the whole repository and follow these instructions:

### 1. Admin Dashboard Setup

```bash
cd ecommerce-admin 
npm i
```

Configure your **.env** file with your own keys from Clerk, MongoDB, Cloudinary and Stripe.

```bash
# Environment Variables
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# MongoDB (previously PlanetScale)
DATABASE_URL="mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/yourdatabase"

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

# Stripe
STRIPE_API_KEY=
FRONTEND_STORE_URL=http://localhost:3001

STRIPE_WEBHOOK_SECRET=
```

Initialize the Prisma client and push the schema to your database:
```bash
npx prisma generate
npx prisma db push
npm run dev
```

Your admin dashboard should now be running at http://localhost:3000

### 2. Store Setup

```bash
cd ecommerce-store
npm i
```

Create a store in the admin dashboard, then copy the store ID (found in the URL as /[storeId]/ when viewing your store in the admin dashboard).

Create a **.env** file in the ecommerce-store folder with:

```
# API Connection
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_STORE_ID=your_store_id

# Database - Same as admin dashboard for shared data
DATABASE_URL="mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/yourdatabase"

# Authentication
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secure_random_string_here

# Optional Email Service (for password reset)
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email@example.com
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_FROM=noreply@yourstore.com
```

Start the store:
```bash
npm run dev
```

The store should now be running at http://localhost:3001

## Important Notes

1. **First Time Setup**: After starting the admin dashboard, you'll need to:
   - Sign up with Clerk
   - Create a new store
   - Create categories, sizes, and colors before you can add products

2. **Product Variants**: When adding products, you must select valid sizes and colors from the dropdown menus

3. **MongoDB**: This project uses MongoDB, so make sure your connection string is correctly formatted

4. **Local Development**: For Stripe webhooks with local environment, use the Stripe CLI:
   ```
   stripe listen --forward-to localhost:3000/api/webhook
   ```

## Troubleshooting

### Common Issues

1. **Missing Scripts**: If you get "Missing script: dev" error, make sure you're in the right directory.

2. **MongoDB ObjectID Errors**: When creating products, ensure that size and color IDs are valid MongoDB ObjectIDs.

3. **Pricing Error**: If you see "toNumber is not a function" error, it means the pricing data structure has changed. This has been fixed in the latest version.

4. **API Connection Issues**: Make sure your store's .env file has the correct store ID in the API URL.

5. **Clerk Authentication Issues**: If you see clock skew errors, ensure your system clock is correctly synchronized.

6. **Customer Authentication**: If customer login isn't working, verify your DATABASE_URL and NEXTAUTH_SECRET environment variables.

7. **Profile Updates Failing**: Ensure your database schema is up to date with the latest migrations: `npx prisma db push` in both admin and store folders.

## Customer Authentication & Profile Management

The new customer authentication system integrates directly with your MongoDB database through Prisma, allowing for a unified data model between the admin dashboard and store frontend.

### Authentication Flow

1. **Registration**: Customers can register with email/password or social login
2. **Email Verification**: Optional email verification process
3. **Login**: Secure authentication with session management
4. **Password Reset**: Self-service password reset functionality

### Customer Profile Features

1. **Profile Dashboard**: Customers can view and update their profile information
2. **Order History**: View past orders and order status
3. **Favorites/Wishlist**: Save and manage favorite products
4. **Addresses**: Manage shipping and billing addresses
5. **Account Settings**: Update password and notification preferences

### Admin Customer Management

1. **Customer List**: View all customers with filtering and sorting
2. **Customer Details**: View detailed customer information
3. **Order History**: View a customer's order history
4. **Customer Analytics**: Basic analytics on customer activity
5. **Customer Status Management**: Activate, deactivate, or flag accounts

### Database Schema Updates

The Prisma schema has been extended with the following models:

```prisma
model User {
  id            String     @id @default(auto()) @map("_id") @db.ObjectId
  email         String     @unique
  password      String?    // Hashed password
  name          String?
  image         String?    // Profile image URL
  phone         String?
  isVerified    Boolean    @default(false)
  addresses     Address[]
  favorites     Favorite[]
  orders        Order[]    @relation("UserToOrder")
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
}

model Address {
  id          String   @id @default(auto()) @map("_id") @db.ObjectId
  userId      String   @db.ObjectId
  user        User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  name        String   // Address name (e.g. "Home", "Work")
  line1       String
  line2       String?
  city        String
  state       String?
  postalCode  String
  country     String
  isDefault   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([userId])
}
```

### Implementation Details

1. **Authentication API**: Custom authentication endpoints in the store application
2. **Middleware**: Secure routes with authentication middleware
3. **Password Security**: Bcrypt for password hashing
4. **Session Management**: JWT-based authentication with secure HTTP-only cookies
5. **Admin Integration**: API endpoints for admin access to customer data

### Security Considerations

1. **Password Policies**: Enforce strong password requirements
2. **Rate Limiting**: Prevent brute force attacks
3. **CSRF Protection**: Cross-Site Request Forgery protection
4. **Data Privacy**: Compliance with data protection regulations
5. **Input Validation**: Strict validation of all user inputs

## Screenshots

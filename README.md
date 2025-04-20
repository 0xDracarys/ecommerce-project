# <img src="image.png" width=250px height=auto alt="Logo">

This project serves as a comprehensive solution for online stores, seamlessly integrating real-time store management with an elegant and efficient e-commerce platform. It was created as a reference point to understand how to build an advanced online store.

## Features

- Admin dashboard featuring extensive functionalities for modifying size, color, main billboard, and category options
- Creating products with many possible variants
- Managing orders for future employees
- Client store site with product page, quickview, filtered categories, search bar, cart and summary checkout

## Tech Stack

**Client:** React, Next.js, TailwindCSS, shadcn/ui

**Server:** Prisma with MongoDB

**Other:** Stripe, Clerk

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
NEXT_PUBLIC_API_URL=http://localhost:3000/api/[your_store_id]
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

## Screenshots

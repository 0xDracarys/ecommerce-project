// Load dependencies
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

// Initialize Prisma client
const prisma = new PrismaClient();

// Store ID to check - use the one from environment variables or the hardcoded one
const storeId = process.env.NEXT_PUBLIC_STORE_ID || "6805036219e37a55ea8551b6";

async function checkStore() {
  console.log(`Checking store with ID: ${storeId}`);
  
  try {
    // Find store by ID
    const store = await prisma.store.findUnique({
      where: {
        id: storeId,
      },
      include: {
        products: {
          include: {
            images: true,
            variants: true,
          }
        },
        billboards: true,
        categories: true,
      }
    });

    if (!store) {
      console.error(`❌ Store with ID ${storeId} not found in the database.`);
      console.error("Please check if this is the correct store ID or create a new store.");
      return;
    }

    console.log(`✅ Found store: ${store.name}`);
    console.log(`Created at: ${store.createdAt}`);
    console.log(`Owner user ID: ${store.userId}`);
    
    console.log("\nStore resources:");
    console.log(`- Products: ${store.products.length}`);
    console.log(`- Billboards: ${store.billboards.length}`);
    console.log(`- Categories: ${store.categories.length}`);

    if (store.products.length === 0) {
      console.warn("⚠️ This store has no products. Consider adding some products through the admin interface.");
    } else {
      console.log("\nProducts in this store:");
      store.products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.name} - $${product.price} - ${product.variants.length} variants - ${product.images.length} images`);
      });
    }

    console.log("\nVerification complete!");
    console.log("✅ The store ID is valid and exists in the database.");
  } catch (error) {
    console.error("Error checking store:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the check
checkStore()
  .catch((error) => {
    console.error("Fatal error:", error);
    process.exit(1);
  });


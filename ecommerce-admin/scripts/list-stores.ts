import prismadb from "../lib/prismadb";

async function listStores() {
  try {
    const stores = await prismadb.store.findMany();
    console.log('Available stores:');
    stores.forEach(store => {
      console.log(`Store ID: ${store.id}`);
      console.log(`Name: ${store.name}`);
      console.log('---');
    });
  } catch (error) {
    console.error('Error fetching stores:', error);
  } finally {
    await prismadb.$disconnect();
  }
}

listStores();


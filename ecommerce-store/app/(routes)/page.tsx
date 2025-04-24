import { Billboard as BillboardType } from "@/types";
import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";

export const revalidate = 0;

const HomePage = async () => {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  console.log("Store ID:", process.env.NEXT_PUBLIC_STORE_ID);
  
  // Get store ID from environment variable
  const storeId = process.env.NEXT_PUBLIC_STORE_ID || '';
  if (!storeId) {
    console.error("Missing store ID. Please set NEXT_PUBLIC_STORE_ID in your environment variables.");
  }
  
  let products = [];
  try {
    products = await getProducts({ isFeatured: true });
    console.log("Products loaded:", products.length);
  } catch (error) {
    console.error("Error loading products:", error);
  }
  
  // Create a fallback billboard in case we can't fetch one
  let firstBillboard: BillboardType = {
    id: 'fallback',
    label: 'Welcome to Our Store',
    imageUrl: 'https://via.placeholder.com/1200x400'
  };
  
  try {
    // Check if API URL is properly configured
    const billboardsUrl = `${process.env.NEXT_PUBLIC_API_URL}/[storeId]/billboards`.replace('[storeId]', storeId);
    if (!billboardsUrl || billboardsUrl.includes("undefined")) {
      console.error("Invalid billboards API URL:", billboardsUrl);
      throw new Error("Invalid API URL configuration");
    }
    
    if (!storeId) {
      console.error("Missing store ID for billboard API call. The API requires a store ID in the path: /api/[storeId]/billboards");
      throw new Error("Missing store ID configuration");
    }

    // Try to fetch billboards with better error handling
    const response = await fetch(billboardsUrl, {
      next: { revalidate: 0 } // Use consistent caching strategy matching products
    });
    console.log("Billboard API response status:", response.status);
    
    if (response.ok) {
      const billboards = await response.json();
      console.log("Billboards loaded:", billboards.length);
      
      if (billboards && Array.isArray(billboards) && billboards.length > 0) {
        // Validate that the billboard has the required fields
        const billboard = billboards[0];
        if (billboard && billboard.id && billboard.label && billboard.imageUrl) {
          firstBillboard = billboard;
        } else {
          console.warn("First billboard missing required fields, using fallback");
        }
      }
    }
  } catch (error) {
    console.error("Error fetching billboards:", error);
  }

  return (
    <div>
      <div className="m-0 space-y-10">
        <Billboard
          data={firstBillboard}
          rounded=""
          additionalProps="transition aspect-[3.3/1] p-0 rounded-none"
        />
      </div>
      <Container>
        <div className="flex flex-col px-8 pb-8 gap-y-8 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <ProductList
              title="Featured Products"
              items={products}
            />
          ) : (
            <div className="mt-6">
              <NoResults />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default HomePage;

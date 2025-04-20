import getBillboard from "@/actions/get-billboard";
import getProducts from "@/actions/get-products";
import Billboard from "@/components/billboard";
import ProductList from "@/components/product-list";
import Container from "@/components/ui/container";
import NoResults from "@/components/ui/no-results";

export const revalidate = 0;

const HomePage = async () => {
  console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
  
  let products = [];
  try {
    products = await getProducts({ isFeatured: true });
    console.log("Products loaded:", products.length);
  } catch (error) {
    console.error("Error loading products:", error);
  }
  
  // Create a fallback billboard in case we can't fetch one
  let firstBillboard = {
    id: 'fallback',
    label: 'Welcome to Our Store',
    imageUrl: 'https://via.placeholder.com/1200x400'
  };
  
  try {
    // Try to fetch billboards with better error handling
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/billboards`);
    console.log("Billboard API response status:", response.status);
    
    if (response.ok) {
      const billboards = await response.json();
      console.log("Billboards loaded:", billboards.length);
      
      if (billboards && billboards.length > 0) {
        firstBillboard = billboards[0];
      }
    } else {
      console.error("Failed to fetch billboards:", response.statusText);
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

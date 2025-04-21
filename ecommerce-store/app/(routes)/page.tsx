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
  
  // Fetch the first billboard from database or API
  let billboard = {
    id: 'fallback',
    label: 'Welcome to Our Store',
    imageUrl: 'https://via.placeholder.com/1200x400'
  };
  
  try {
    // Use an empty ID to get the first available billboard
    const fetchedBillboard = await getBillboard("");
    
    if (fetchedBillboard && fetchedBillboard.id) {
      billboard = fetchedBillboard;
      console.log("Billboard loaded successfully:", billboard.label);
    }
  } catch (error) {
    console.error("Error fetching billboard:", error);
  }

  return (
    <div>
      <div className="m-0 space-y-10">
        <Billboard
          data={billboard}
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

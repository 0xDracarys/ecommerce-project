import { Product } from "@/types";
import prismadb from "@/lib/prismadb";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

const getProduct = async (id: string): Promise<Product> => {
  try {
    console.log(`Fetching product with ID: ${id}`);
    
    // First try database direct access
    try {
      const product = await prismadb.product.findUnique({
        where: {
          id
        },
        include: {
          images: true,
          category: {
            include: {
              billboard: true
            }
          },
          variants: {
            include: {
              color: true,
              size: true
            }
          }
        }
      });
      
      if (product) {
        console.log(`Successfully loaded product from database: ${product.name}`);
        return product as any;
      }
    } catch (dbError) {
      console.error('Error accessing product from database:', dbError);
    }
    
    // Fallback to API
    console.log(`Falling back to API for product data: ${URL}/${id}`);
    const res = await fetch(`${URL}/${id}`, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!res.ok) {
      console.error(`Failed to fetch product from API: ${res.status}`);
      throw new Error(`Failed to fetch product: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log(`Successfully loaded product from API: ${data.name}`);
    return data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export default getProduct;

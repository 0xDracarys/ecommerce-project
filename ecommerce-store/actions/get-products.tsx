import qs from "query-string";
import prismadb from "@/lib/prismadb";
import { Product } from "@/types";

// Keep the URL reference for backwards compatibility
const URL = `${process.env.NEXT_PUBLIC_API_URL}/products`;

interface Query {
  name?: string;
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  try {
    console.log("Fetching products with query:", query);
    
    // Create a filter object for Prisma based on query parameters
    const where: any = {
      isArchived: false,
    };
    
    if (query.categoryId) {
      where.categoryId = query.categoryId;
    }
    
    if (query.colorId) {
      where.variants = {
        some: {
          colorId: query.colorId
        }
      };
    }
    
    if (query.sizeId) {
      where.variants = {
        some: {
          sizeId: query.sizeId
        }
      };
    }
    
    if (query.name) {
      where.name = {
        contains: query.name,
        mode: 'insensitive'
      };
    }
    
    if (query.isFeatured) {
      where.isFeatured = query.isFeatured;
    }
    
    // First try direct database access
    try {
      const products = await prismadb.product.findMany({
        where,
        include: {
          images: true,
          category: true,
          variants: {
            include: {
              color: true,
              size: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      console.log(`Successfully loaded ${products.length} products directly from database`);
      return products as any;
    } catch (dbError) {
      console.error('Error accessing database directly:', dbError);
      
      // Fallback to API if direct DB access fails
      console.log("Falling back to API for product data");
      const url = qs.stringifyUrl({
        url: URL,
        query: {
          name: query.name,
          colorId: query.colorId,
          sizeId: query.sizeId,
          categoryId: query.categoryId,
          isFeatured: query.isFeatured,
        },
      });
      
      console.log("Fetching products from API:", url);
      const res = await fetch(url, { 
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      
      if (!res.ok) {
        console.error(`Error fetching products from API: ${res.status} ${res.statusText}`);
        return [];
      }
      
      const data = await res.json();
      console.log(`Successfully loaded ${data.length} products from API`);
      return data;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export default getProducts;

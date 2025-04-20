import qs from "query-string";

import { Product } from "@/types";

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
    console.log("API URL for products:", URL);
    
    if (!query || Object.keys(query).length === 0) {
      console.log("No query params provided for products");
      return [];
    }

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
    
    console.log("Fetching products from:", url);

    const res = await fetch(url, { 
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!res.ok) {
      console.error(`Error fetching products: ${res.status} ${res.statusText}`);
      // Return empty array when API fails
      return [];
    }

    const data = await res.json();
    console.log(`Successfully loaded ${data.length} products`);
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export default getProducts;

import qs from "query-string";

import { Product } from "@/types";

// Get store ID from environment variable or use a default
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || '';
// Check if API URL already ends with 'api'
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
// Construct URL with the correct path structure: 
// if NEXT_PUBLIC_API_URL includes "/api" at the end, use: "{apiBaseUrl}/{storeId}/products"
// if it doesn't, use: "{apiBaseUrl}/api/{storeId}/products"
const URL = apiBaseUrl.endsWith('/api') 
  ? `${apiBaseUrl}/${STORE_ID}/products` 
  : `${apiBaseUrl}/api/${STORE_ID}/products`;

interface Query {
  name?: string;
  categoryId?: string;
  colorId?: string;
  sizeId?: string;
  isFeatured?: boolean;
}

const getProducts = async (query: Query): Promise<Product[]> => {
  try {
    // Log the base API URL for debugging
    console.log("API Base URL:", apiBaseUrl);
    console.log("API URL includes /api:", apiBaseUrl.endsWith('/api'));
    console.log("Store ID being used:", STORE_ID);
    console.log("Complete API URL for products:", URL);
    
    // Check if API URL and store ID are properly configured
    if (!process.env.NEXT_PUBLIC_API_URL) {
      console.error("Missing API URL. Please set NEXT_PUBLIC_API_URL in your environment variables.");
      return [];
    }
    
    if (URL.includes("undefined")) {
      console.error("Invalid API URL configuration. URL contains 'undefined':", URL);
      return [];
    }
    
    if (!STORE_ID) {
      console.error("Missing store ID. Please set NEXT_PUBLIC_STORE_ID in your environment variables. The API requires a store ID in the path: /api/[storeId]/products");
      return [];
    }
    
    if (!query || Object.keys(query).length === 0) {
      console.log("No query params provided for products");
      return [];
    }

    // Use the URL directly since we've already included the STORE_ID
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
      next: { revalidate: 0 }  // Use Next.js revalidation instead of cache: 'no-store'
    });
    
    if (!res.ok) {
      console.error(`Error fetching products: ${res.status} ${res.statusText}`);
      // Try to log response body for debugging
      try {
        const text = await res.text();
        console.error("Response body:", text.substring(0, 200) + "...");
      } catch (e) {
        console.error("Could not read response body:", e);
      }
      // Return empty array when API fails
      return [];
    }

    // Try to parse JSON response
    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error parsing JSON response:", error);
      try {
        const text = await res.text();
        console.error("Response body (first 200 chars):", text.substring(0, 200) + "...");
      } catch (e) {
        console.error("Could not read response body:", e);
      }
      return [];
    }
    
    // Validate response data structure
    if (!data) {
      console.error('Empty response from API');
      return [];
    }
    
    if (!Array.isArray(data)) {
      console.error('Invalid API response format: expected array, got:', typeof data);
      console.error('Response data:', JSON.stringify(data).substring(0, 200) + '...');
      return [];
    }

    // Validate each product has required fields
    const validProducts = data.filter((item): item is Product => {
      const isValid = item && 
        typeof item === 'object' &&
        'id' in item &&
        'name' in item &&
        'price' in item;
      
      if (!isValid) {
        console.warn('Found invalid product in API response:', item);
      }
      return isValid;
    });

    console.log(`Successfully loaded ${validProducts.length} valid products`);
    return validProducts;
  } catch (error) {
    console.error('Error fetching products:', error);
    console.error('API URL that failed:', URL);
    console.error('Query parameters:', query);
    return [];
  }
};

export default getProducts;

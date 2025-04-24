import { Category } from "@/types";

// Get store ID from environment variable
const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || '';
// Check if API URL already ends with 'api'
const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
// Construct URL with the correct path structure
const URL = apiBaseUrl.endsWith('/api') 
  ? `${apiBaseUrl}/${STORE_ID}/categories` 
  : `${apiBaseUrl}/api/${STORE_ID}/categories`;

const getCategories = async (): Promise<Category[]> => {
  try {
    // Log details for debugging
    console.log("API Base URL:", apiBaseUrl);
    console.log("Store ID being used:", STORE_ID);
    console.log("Categories API URL:", URL);
    
    // Validate URL and store ID
    if (!apiBaseUrl) {
      console.error("Missing API URL. Please set NEXT_PUBLIC_API_URL in your environment variables.");
      return [];
    }
    
    if (!STORE_ID) {
      console.error("Missing store ID. Please set NEXT_PUBLIC_STORE_ID in your environment variables.");
      return [];
    }

    // Fetch categories
    const res = await fetch(URL, {
      next: { revalidate: 0 } // Disable cache
    });
    
    // Check response status
    if (!res.ok) {
      console.error(`Error fetching categories: ${res.status} ${res.statusText}`);
      try {
        const text = await res.text();
        console.error("Response body:", text.substring(0, 200) + "...");
      } catch (e) {
        console.error("Could not read response body:", e);
      }
      return [];
    }

    // Parse JSON response
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
    
    // Validate data
    if (!data) {
      console.error('Empty response from categories API');
      return [];
    }
    
    if (!Array.isArray(data)) {
      console.error('Invalid API response format: expected array, got:', typeof data);
      console.error('Response data:', JSON.stringify(data).substring(0, 200) + '...');
      return [];
    }
    
    // Log success
    console.log(`Successfully loaded ${data.length} categories`);
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export default getCategories;

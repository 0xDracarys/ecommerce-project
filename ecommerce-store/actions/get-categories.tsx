import { Category } from "@/types";
import fetcher from "@/lib/fetcher";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategories = async (): Promise<Category[]> => {
  try {
    console.log("Fetching categories from URL:", URL);
    
    // Check if the API URL is properly configured
    if (!URL || URL.includes("undefined")) {
      console.error("Invalid API URL:", URL);
      return [];
    }
    
    const data = await fetcher<Category[]>(URL);
    console.log(`Successfully fetched ${data.length} categories`);
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export default getCategories;

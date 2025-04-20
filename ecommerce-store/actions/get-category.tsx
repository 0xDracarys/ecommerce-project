import { Category } from "@/types";
import fetcher from "@/lib/fetcher";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/categories`;

const getCategory = async (id: string): Promise<Category> => {
  try {
    console.log(`Fetching category with id: ${id} from ${URL}/${id}`);
    
    // Check if the API URL is properly configured
    if (!URL || URL.includes("undefined")) {
      console.error("Invalid API URL:", URL);
      return { id: '', name: 'Error', billboard: { id: '', label: '', imageUrl: '' } };
    }
    
    const data = await fetcher<Category>(`${URL}/${id}`);
    return data;
  } catch (error) {
    console.error(`Error fetching category ${id}:`, error);
    return { id: '', name: 'Error', billboard: { id: '', label: '', imageUrl: '' } };
  }
};

export default getCategory;

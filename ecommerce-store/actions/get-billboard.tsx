import { Billboard } from "@/types";
import prismadb from "@/lib/prismadb";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getBillboard = async (id: string): Promise<Billboard> => {
  try {
    console.log(`Fetching billboard with ID: ${id}`);
    
    // First try to fetch from database directly
    try {
      let billboard;
      
      if (id) {
        // Try to get specific billboard by ID
        billboard = await prismadb.billboard.findUnique({
          where: {
            id
          }
        });
      }
      
      // If no specific billboard found, get first available
      if (!billboard) {
        const billboards = await prismadb.billboard.findMany({
          take: 1
        });
        
        if (billboards.length > 0) {
          billboard = billboards[0];
          console.log("Using first billboard from database");
        }
      }
      
      if (billboard) {
        console.log("Successfully loaded billboard from database");
        return billboard as Billboard;
      }
    } catch (dbError) {
      console.error('Error accessing billboard from database:', dbError);
    }
    
    // Fallback to API if database access fails
    console.log("Falling back to API for billboard data");
    
    // Try to fetch specific billboard
    const res = await fetch(`${URL}/${id}`, { 
      cache: 'no-store',
      next: { revalidate: 0 } 
    });
    
    if (!res.ok) {
      console.log(`Failed to fetch billboard ${id} from API, status: ${res.status}`);
      
      // If specific billboard fetch fails, try to get all billboards
      console.log("Attempting to fetch all billboards from API");
      const allRes = await fetch(URL, { 
        cache: 'no-store',
        next: { revalidate: 0 } 
      });
      
      if (!allRes.ok) {
        console.error(`Failed to fetch all billboards from API: ${allRes.status} ${allRes.statusText}`);
        // Return fallback billboard
        return { id: '', label: 'No Billboards Available', imageUrl: 'https://via.placeholder.com/1200x400' };
      }
      
      const billboards = await allRes.json();
      console.log(`Loaded ${billboards.length} billboards from API`);
      
      // Return the first billboard if available
      if (billboards && billboards.length > 0) {
        console.log("Using first billboard from API as fallback");
        return billboards[0];
      }
      
      // Return empty billboard as fallback
      console.log("No billboards found in API, using fallback");
      return { id: '', label: 'No Billboards Available', imageUrl: 'https://via.placeholder.com/1200x400' };
    }
    
    const data = await res.json();
    console.log("Successfully loaded billboard from API");
    return data;
  } catch (error) {
    console.error('Error fetching billboard:', error);
    // Return empty billboard as fallback
    return { id: '', label: 'Failed to load content', imageUrl: 'https://via.placeholder.com/1200x400' };
  }
};

export default getBillboard;

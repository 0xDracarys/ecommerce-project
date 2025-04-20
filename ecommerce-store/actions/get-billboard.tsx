import { Billboard } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/billboards`;

const getBillboard = async (id: string): Promise<Billboard> => {
  try {
    console.log(`Fetching billboard with ID: ${id} from ${URL}/${id}`);
    
    // Try to fetch specific billboard
    const res = await fetch(`${URL}/${id}`, { 
      cache: 'no-store',
      next: { revalidate: 0 } 
    });
    
    if (!res.ok) {
      console.log(`Failed to fetch billboard ${id}, status: ${res.status}`);
      
      // If specific billboard fetch fails, try to get all billboards
      console.log("Attempting to fetch all billboards instead");
      const allRes = await fetch(URL, { 
        cache: 'no-store',
        next: { revalidate: 0 } 
      });
      
      if (!allRes.ok) {
        console.error(`Failed to fetch all billboards: ${allRes.status} ${allRes.statusText}`);
        // Return fallback billboard
        return { id: '', label: 'No Billboards Available', imageUrl: 'https://via.placeholder.com/1200x400' };
      }
      
      const billboards = await allRes.json();
      console.log(`Loaded ${billboards.length} billboards`);
      
      // Return the first billboard if available
      if (billboards && billboards.length > 0) {
        console.log("Using first billboard as fallback");
        return billboards[0];
      }
      
      // Return empty billboard as fallback
      console.log("No billboards found, using fallback");
      return { id: '', label: 'No Billboards Available', imageUrl: 'https://via.placeholder.com/1200x400' };
    }
    
    const data = await res.json();
    console.log("Successfully loaded billboard");
    return data;
  } catch (error) {
    console.error('Error fetching billboard:', error);
    // Return empty billboard as fallback
    return { id: '', label: 'Failed to load content', imageUrl: 'https://via.placeholder.com/1200x400' };
  }
};

export default getBillboard;

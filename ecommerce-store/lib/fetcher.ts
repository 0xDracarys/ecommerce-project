/**
 * Utility for making fetch requests to the API with proper error handling
 */

export const fetcher = async <T>(
  url: string,
  options?: RequestInit
): Promise<T> => {
  try {
    console.log(`Fetching data from: ${url}`);
    
    const baseOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      ...options,
    };

    const response = await fetch(url, baseOptions);

    if (!response.ok) {
      console.error(`API error: ${response.status} ${response.statusText}`);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// Default export for easy importing
export default fetcher; 
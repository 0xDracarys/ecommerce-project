'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Container from '@/components/ui/container';
import Button from '@/components/ui/button';
import ProductCard from '@/components/ui/product-card';
import { Product } from '@/types';
import { Heart } from 'lucide-react';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadFavorites() {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push('/auth/login');
          return;
        }
        
        // Fetch favorites from API
        const response = await fetch('/api/favorites');
        if (response.ok) {
          const data = await response.json();
          setFavorites(data);
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [router, supabase]);

  const handleRemoveFavorite = async (productId: string) => {
    try {
      const response = await fetch(`/api/favorites?productId=${productId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        // Remove from state
        setFavorites(favorites.filter(item => item.id !== productId));
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-16 h-16 border-t-4 border-purple-500 rounded-full animate-spin"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10">
        <h1 className="text-3xl font-bold mb-8">My Favorites</h1>
        
        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart size={64} className="text-gray-300" />
            </div>
            <h2 className="text-xl font-medium mb-4">No favorites yet</h2>
            <p className="text-gray-600 mb-6">
              Browse our products and add some to your favorites
            </p>
            <Button 
              onClick={() => router.push('/categories')}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Browse Products
            </Button>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {favorites.map((product) => (
                <div key={product.id} className="relative">
                  <button
                    onClick={() => handleRemoveFavorite(product.id)}
                    className="absolute right-2 top-2 z-10 bg-white p-1.5 rounded-full shadow-md"
                  >
                    <Heart size={20} className="text-red-500 fill-red-500" />
                  </button>
                  <ProductCard data={product} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Container>
  );
} 
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import Container from '@/components/ui/container'
import Button from '@/components/ui/button'
import Currency from '@/components/ui/currency'
import { Heart, Trash } from 'lucide-react'

type FavoriteProduct = {
  id: string
  productId: string
  product: {
    id: string
    name: string
    price: number
    description: string
    images: { url: string }[]
    variants: any[]
  }
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getFavorites() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          router.push('/auth/login')
          return
        }

        const response = await fetch('/api/user/favorites')
        if (!response.ok) {
          throw new Error('Failed to fetch favorites')
        }

        const data = await response.json()
        setFavorites(data)
      } catch (error: any) {
        console.error('Error loading favorites:', error)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    getFavorites()
  }, [router, supabase.auth])

  const removeFavorite = async (favoriteId: string) => {
    try {
      const response = await fetch(`/api/user/favorites/${favoriteId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove from favorites')
      }

      setFavorites(favorites.filter(fav => fav.id !== favoriteId))
    } catch (error: any) {
      console.error('Error removing favorite:', error)
      setError(error.message)
    }
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p>Loading favorites...</p>
        </div>
      </Container>
    )
  }

  return (
    <Container>
      <div className="max-w-6xl mx-auto py-8">
        <div className="flex items-center mb-6">
          <Heart className="w-6 h-6 mr-2 text-red-500" />
          <h1 className="text-3xl font-bold">My Favorites</h1>
        </div>

        {error && (
          <div className="p-3 mb-6 text-sm text-white bg-red-500 rounded">
            {error}
          </div>
        )}

        {favorites.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <p className="text-gray-600 mb-4">You haven't added any favorites yet.</p>
            <Link href="/categories">
              <Button>
                Browse Products
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((favorite) => (
              <div key={favorite.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="relative group">
                  <Link href={`/product/${favorite.product.id}`}>
                    <div className="aspect-square relative">
                      <Image
                        src={favorite.product.images[0]?.url || '/placeholder.png'}
                        alt={favorite.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </Link>
                  <div className="absolute top-2 right-2">
                    <Button 
                      onClick={() => removeFavorite(favorite.id)}
                      className="rounded-full p-2"
                      variant="destructive"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <Link href={`/product/${favorite.product.id}`}>
                    <h3 className="font-semibold text-lg truncate">{favorite.product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 line-clamp-2 mt-1 mb-2">
                    {favorite.product.description}
                  </p>
                  <Currency value={favorite.product.price} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
} 
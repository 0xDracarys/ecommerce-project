'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import Button from '@/components/ui/button'

/**
 * FavoriteButton Component
 * @param {Object} props
 * @param {string} props.productId - The ID of the product to favorite
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {string} [props.variant='outline'] - Button variant
 * @param {string} [props.size='icon'] - Button size
 */
export default function FavoriteButton({ 
  productId, 
  className = '', 
  variant = 'outline',
  size = 'icon'
}) {
  const [isFavorite, setIsFavorite] = useState(false)

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // In a real implementation, this would call an API
    console.log(`Toggle favorite for product ${productId}`)
  }

  return (
    <Button
      onClick={toggleFavorite}
      variant={variant}
      size={size}
      className={className}
    >
      <Heart 
        className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
      />
    </Button>
  )
} 
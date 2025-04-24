'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  productId: string;
  variant?: 'default' | 'outline';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
}

const FavoriteButton = ({
  productId,
  variant = 'default',
  size = 'default',
  className,
}: FavoriteButtonProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    
    // This is a placeholder for future API integration
    // In the future, you can add API calls to save favorites to the database
    console.log(`Toggle favorite for product: ${productId}`);
  };

  // Size classes
  const sizeClasses = {
    default: 'p-2',
    sm: 'p-1.5',
    lg: 'p-2.5',
  };

  // Variant classes
  const variantClasses = {
    default: 'bg-white shadow-md',
    outline: 'bg-transparent border border-gray-200',
  };

  return (
    <button
      onClick={toggleFavorite}
      className={cn(
        'rounded-full transition-colors',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20}
        className={cn(
          'transition-colors',
          isFavorited ? 'text-red-500 fill-red-500' : 'text-gray-500'
        )}
      />
    </button>
  );
};

export default FavoriteButton;

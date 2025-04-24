'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import Button from '@/components/ui/button';

interface FavoriteButtonProps {
  productId: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const FavoriteButton = ({
  productId,
  className = '',
  variant = 'outline',
  size = 'icon'
}: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real implementation, this would call an API
    console.log(`Toggle favorite for product ${productId}`);
  };

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
  );
};

export default FavoriteButton; 
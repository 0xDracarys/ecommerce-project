"use client";
import React, { useState, useEffect } from "react";
import { ShoppingCart, Heart } from "lucide-react";

import { Color, Product, Size } from "@/types";
import Currency from "@/components/ui/currency";
import Button from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import SizeTable from "./size-table";

interface InfoProps {
  data: Product;
}

const Info: React.FC<InfoProps> = ({ data }) => {
  const cart = useCart();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [filteredSizeOptions, setFilteredSizeOptions] = useState<string[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch colors and sizes when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Extract store ID from the API URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        
        // Fetch colors
        const colorsResponse = await fetch(`${apiUrl}/colors`);
        const colorsData = await colorsResponse.json();
        setColors(colorsData);
        
        // Fetch sizes
        const sizesResponse = await fetch(`${apiUrl}/sizes`);
        const sizesData = await sizesResponse.json();
        setSizes(sizesData);
      } catch (error) {
        console.error('Error fetching color and size data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const colorOptions = Array.from(
    new Set(data.variants.map((variant) => variant.colorId))
  );

  // Get color name from color ID
  const getColorName = (colorId: string) => {
    const color = colors.find(c => c.id === colorId);
    return color ? color.name : colorId;
  };

  // Get size name from size ID
  const getSizeName = (sizeId: string) => {
    const size = sizes.find(s => s.id === sizeId);
    return size ? size.name : sizeId;
  };

  const onColorSelect = (color: string) => {
    setSelectedColor(color);
    const relatedVariants = data.variants.filter(
      (variant) => variant.colorId === color
    );
    const relatedSizes = Array.from(
      new Set(
        relatedVariants.map((variant) => variant.sizeId)
      )
    );
    setFilteredSizeOptions(relatedSizes);
  };

  const onAddToCart = () => {
    const variantToAdd = data.variants.find(
      (variant) =>
        variant.colorId === selectedColor &&
        variant.sizeId === selectedSize
    );

    if (variantToAdd) {
      cart.addItem(data, variantToAdd);
    }
  };

  // Toggle favorite
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    console.log(`Toggle favorite for product: ${data.id}`);
  };

  if (isLoading) {
    return <div className="p-4">Loading product details...</div>;
  }

  return (
    <nav>
      {/* Name and Favorite Button */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          {data.name}
        </h1>
        <Button
          onClick={toggleFavorite}
          variant="outline"
          size="default"
          className="ml-2"
        >
          <Heart 
            className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </Button>
      </div>

      {/* Price */}
      <section className="flex items-end justify-between mt-3">
        <p className="text-2xl text-gray-900">
          <Currency value={data.price} />
        </p>
      </section>
      <hr className="my-4" />
    </nav>
  );
};

export default Info; 
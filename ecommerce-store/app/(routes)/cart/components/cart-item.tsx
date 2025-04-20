"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Trash2,
  X,
} from "lucide-react";

import IconButton from "@/components/ui/icon-button";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { CartItem, Color, Size } from "@/types";

interface CartItemProps {
  data: CartItem;
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {
  const cart = useCart();
  const [colors, setColors] = useState<Color[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        
        // Fetch colors
        const colorsResponse = await fetch(`${apiUrl}/colors`);
        const colorsData = await colorsResponse.json();
        setColors(colorsData);
        
        // Fetch sizes
        const sizesResponse = await fetch(`${apiUrl}/sizes`);
        const sizesData = await sizesResponse.json();
        setSizes(sizesData);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching color and size data:', error);
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

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

  return (
    <li className="flex py-6 border-b">
      {/* Product info - Image -> Name -> Color -> Size */}
      <div className="relative w-24 h-24 overflow-hidden rounded-md sm:h-48 sm:w-48">
        <Image
          fill
          src={data.product.images[0].url}
          alt=""
          className="object-cover object-center"
        />
      </div>
      <div className="relative flex flex-col justify-between flex-1 ml-4 sm:ml-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold text-black ">
              {data.product.name}
            </p>
            <div className="mt-1 mb-2 text-sm ">
              <div className="flex flex-row">
                <p className="text-gray-500">Color: </p>
                <p className="font-semibold">
                  &nbsp;{isLoading ? '...' : getColorName(data.variant.colorId)}
                </p>{" "}
              </div>
              <div className="flex flex-row">
                <p className="text-gray-500 ">Size:</p>
                <p className="font-semibold">
                  &nbsp;{isLoading ? '...' : getSizeName(data.variant.sizeId)}
                </p>{" "}
              </div>
            </div>
          </div>
          <div>
            {/* Action buttons -> Delete Decrease Add */}
            <div className="flex items-center gap-x-2">
              <IconButton
                onClick={() =>
                  cart.removeItem(
                    data.product.id,
                    data.variant.id
                  )
                }
                icon={<Trash2 size={15} />}
                aria-label="Remove item"
                className="ml-4"
              />
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-x-2">
            <IconButton
              onClick={() =>
                cart.decreaseItem(
                  data.product.id,
                  data.variant.id
                )
              }
              icon={<ChevronDown size={15} />}
              aria-label="Decrease quantity"
            />
            <p className="mx-2">{data.quantity}</p>

            <IconButton
              onClick={() =>
                cart.addItem(data.product, data.variant)
              }
              icon={<ChevronUp size={15} />}
              aria-label="Increase quantity"
            />
          </div>
          <Currency
            value={data.product.price * data.quantity}
            aria-label="Checkout"
          />
        </div>
      </div>
    </li>
  );
};

export default CartItem;

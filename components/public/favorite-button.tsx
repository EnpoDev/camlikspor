"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/contexts/favorites-context";

interface FavoriteButtonProps {
  productId: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
  className?: string;
}

export function FavoriteButton({
  productId,
  name,
  price,
  image,
  slug,
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorited = isFavorite(productId);

  return (
    <Button
      size="icon"
      variant="secondary"
      className={className}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite({ productId, name, price, image, slug });
      }}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${
          favorited ? "fill-red-500 text-red-500" : ""
        }`}
      />
    </Button>
  );
}

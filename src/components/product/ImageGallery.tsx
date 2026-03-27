"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square rounded-[2rem] bg-surface-container-low flex items-center justify-center editorial-shadow">
        <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 80 }}>
          image
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-surface-container-low editorial-shadow">
        <Image
          src={images[activeIndex]}
          alt={`${productName} — imagen ${activeIndex + 1}`}
          fill
          priority
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((src, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-200 cursor-pointer",
                activeIndex === index
                  ? "border-primary scale-[1.03] ambient-shadow"
                  : "border-transparent hover:border-outline-variant"
              )}
              aria-label={`Ver imagen ${index + 1}`}
            >
              <Image
                src={src}
                alt={`${productName} miniatura ${index + 1}`}
                fill
                className="object-cover"
                sizes="15vw"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

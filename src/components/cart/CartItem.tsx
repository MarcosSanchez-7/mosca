"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { QuantityControl } from "./QuantityControl";
import { formatPrice } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/types";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { dispatch } = useCart();

  function handleRemove() {
    dispatch({ type: "REMOVE_ITEM", payload: { productId: item.product.id } });
  }

  return (
    <div className="flex gap-4 p-5 bg-surface-container-lowest rounded-3xl ambient-shadow">
      {/* Image */}
      <Link href={`/product/${item.product.slug}`} className="flex-shrink-0">
        <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-surface-container-low">
          {item.product.image_url ? (
            <Image
              src={item.product.image_url}
              alt={item.product.name}
              fill
              className="object-cover"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 32 }}>image</span>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/product/${item.product.slug}`}>
            <h3 className="font-semibold text-on-surface text-sm leading-snug hover:text-primary transition-colors line-clamp-2">
              {item.product.name}
            </h3>
          </Link>
          <button
            onClick={handleRemove}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full text-outline hover:text-error hover:bg-error/8 transition-all duration-200 cursor-pointer"
            aria-label="Eliminar del carrito"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <QuantityControl productId={item.product.id} quantity={item.quantity} />
          <div className="text-right">
            <div className="font-black text-on-surface text-base">
              {formatPrice(item.product.price * item.quantity)}
            </div>
            {item.quantity > 1 && (
              <div className="text-xs text-on-surface-variant">
                {formatPrice(item.product.price)} c/u
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

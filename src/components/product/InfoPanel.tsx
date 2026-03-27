"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";

interface InfoPanelProps {
  product: Product;
}

export function InfoPanel({ product }: InfoPanelProps) {
  const { dispatch } = useCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    dispatch({
      type: "ADD_ITEM",
      payload: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image_url: product.image_url,
      },
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
        <Link href="/catalog" className="hover:text-primary transition-colors">Catálogo</Link>
        {product.categories && (
          <>
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
            <Link
              href={`/catalog?category=${product.categories.slug}`}
              className="hover:text-primary transition-colors"
            >
              {product.categories.name}
            </Link>
          </>
        )}
      </nav>

      {/* Badge */}
      {product.badge && <Badge variant={product.badge} />}

      {/* Title */}
      <h1 className="text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tight">
        {product.name}
      </h1>

      {/* Rating */}
      {product.reviews_count > 0 && (
        <div className="flex items-center gap-2">
          <div className="flex" style={{ color: "#f59e0b" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                className="material-symbols-outlined"
                style={{
                  fontSize: 18,
                  fontVariationSettings: `'FILL' ${star <= Math.round(product.rating) ? 1 : 0}`,
                }}
              >
                star
              </span>
            ))}
          </div>
          <span className="text-sm text-on-surface-variant">
            {product.rating.toFixed(1)} ({product.reviews_count} reseñas)
          </span>
        </div>
      )}

      {/* Description */}
      {product.description && (
        <p className="text-on-surface-variant leading-relaxed text-base">
          {product.description}
        </p>
      )}

      {/* Price */}
      <div className="flex items-baseline gap-4 py-2">
        <span className="text-4xl font-black text-on-surface">
          {formatPrice(product.price)}
        </span>
        {product.old_price && (
          <div className="flex flex-col">
            <span className="text-lg text-outline line-through">
              {formatPrice(product.old_price)}
            </span>
            <span className="text-xs text-error font-semibold">
              Ahorrás {formatPrice(product.old_price - product.price)}
            </span>
          </div>
        )}
      </div>

      {/* Value props */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "local_shipping", label: "Envío gratis", sub: "En compras +$50.000" },
          { icon: "verified_user", label: "Garantía oficial", sub: "12 meses" },
        ].map(({ icon, label, sub }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-4 bg-surface-container-low rounded-2xl"
          >
            <span className="material-symbols-outlined text-primary flex-shrink-0" style={{ fontSize: 20 }}>
              {icon}
            </span>
            <div>
              <p className="text-sm font-semibold text-on-surface">{label}</p>
              <p className="text-xs text-on-surface-variant">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-3 pt-2">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          onClick={handleAddToCart}
        >
          {added ? (
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              ¡Agregado!
            </span>
          ) : (
            "Agregar al carrito"
          )}
        </Button>
        <Button
          variant="secondary"
          size="lg"
          className="w-full"
          onClick={() => {
            handleAddToCart();
            window.location.href = "/cart";
          }}
        >
          Comprar ahora
        </Button>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { Container } from "@/components/ui/Container";
import { CartItem } from "@/components/cart/CartItem";
import { OrderSummary } from "@/components/cart/OrderSummary";
import { Button } from "@/components/ui/Button";

export default function CartPage() {
  const { items, itemCount, dispatch } = useCart();

  if (itemCount === 0) {
    return (
      <div className="py-32">
        <Container className="text-center max-w-md mx-auto space-y-6">
          <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mx-auto">
            <span
              className="material-symbols-outlined text-outline-variant"
              style={{ fontSize: 44 }}
            >
              shopping_cart
            </span>
          </div>
          <h1 className="text-3xl font-black text-on-surface tracking-tight">
            Tu carrito está vacío
          </h1>
          <p className="text-on-surface-variant">
            Explorá nuestro catálogo y encontrá tu próximo favorito.
          </p>
          <Link
            href="/catalog"
            className="btn-gradient text-on-primary font-semibold px-8 py-4 rounded-full text-base hover:opacity-90 active:scale-[0.98] transition-all duration-200 text-center block"
          >
            Ir al catálogo
          </Link>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-black text-on-surface tracking-tight">
            Tu carrito
          </h1>
          <button
            onClick={() => dispatch({ type: "CLEAR_CART" })}
            className="text-sm text-on-surface-variant hover:text-error transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete_sweep</span>
            Vaciar carrito
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={item.product.id} item={item} />
            ))}

            <div className="pt-4">
              <Link
                href="/catalog"
                className="flex items-center gap-1.5 text-sm text-primary font-semibold hover:gap-2.5 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                Seguir comprando
              </Link>
            </div>
          </div>

          {/* Summary sidebar */}
          <OrderSummary />
        </div>
      </Container>
    </div>
  );
}

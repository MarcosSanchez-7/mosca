"use client";

import { useCart } from "@/context/CartContext";

interface QuantityControlProps {
  productId: string;
  quantity: number;
}

export function QuantityControl({ productId, quantity }: QuantityControlProps) {
  const { dispatch } = useCart();

  function update(delta: number) {
    dispatch({
      type: "UPDATE_QUANTITY",
      payload: { productId, quantity: quantity + delta },
    });
  }

  return (
    <div className="inline-flex items-center rounded-full bg-surface-container border border-outline-variant/30 overflow-hidden">
      <button
        onClick={() => update(-1)}
        className="w-9 h-9 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
        aria-label="Reducir cantidad"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>remove</span>
      </button>
      <span className="w-10 text-center text-sm font-semibold text-on-surface tabular-nums">
        {quantity}
      </span>
      <button
        onClick={() => update(1)}
        className="w-9 h-9 flex items-center justify-center text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
        aria-label="Aumentar cantidad"
      >
        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
      </button>
    </div>
  );
}

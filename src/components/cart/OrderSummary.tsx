"use client";

import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/Button";
import { PromoCode } from "./PromoCode";
import { formatPrice } from "@/lib/utils";

const SHIPPING_THRESHOLD = 50000;
const SHIPPING_COST = 4999;

export function OrderSummary() {
  const { total, itemCount } = useCart();

  const shipping = total >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const grandTotal = total + shipping;

  if (itemCount === 0) return null;

  return (
    <aside className="lg:sticky lg:top-24 bg-surface-container-lowest rounded-3xl p-6 ambient-shadow space-y-5">
      <h2 className="text-xl font-black text-on-surface tracking-tight">
        Resumen del pedido
      </h2>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-on-surface-variant">
          <span>{itemCount} producto{itemCount !== 1 ? "s" : ""}</span>
          <span className="text-on-surface font-medium">{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-on-surface-variant">
          <span>Envío</span>
          <span className={shipping === 0 ? "text-primary font-semibold" : "text-on-surface font-medium"}>
            {shipping === 0 ? "Gratis" : formatPrice(shipping)}
          </span>
        </div>
      </div>

      {shipping > 0 && (
        <p className="text-xs text-on-surface-variant bg-surface-container rounded-xl px-3 py-2.5 flex items-center gap-1.5">
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>info</span>
          Agrega {formatPrice(SHIPPING_THRESHOLD - total)} más para envío gratis
        </p>
      )}

      <PromoCode />

      <div className="border-t border-outline-variant/30 pt-4 flex justify-between font-black text-on-surface text-xl">
        <span>Total</span>
        <span>{formatPrice(grandTotal)}</span>
      </div>

      <Button variant="primary" size="lg" className="w-full">
        Proceder al pago
      </Button>

      <div className="flex items-center justify-center gap-1.5 text-xs text-on-surface-variant">
        <span className="material-symbols-outlined" style={{ fontSize: 14 }}>lock</span>
        Pago seguro con encriptación SSL
      </div>
    </aside>
  );
}

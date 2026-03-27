"use client";

import { useState } from "react";

export function PromoCode() {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");

  return (
    <div className="border-t border-outline-variant/30 pt-4">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full text-sm font-semibold text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>local_offer</span>
          ¿Tenés un código de descuento?
        </span>
        <span
          className="material-symbols-outlined transition-transform duration-200"
          style={{ fontSize: 18, transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div className="flex gap-2 mt-3">
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Ej: PIXEL10"
            className="flex-1 bg-surface-container-high text-on-surface placeholder:text-outline rounded-full px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all uppercase"
          />
          <button className="bg-on-surface text-surface font-semibold px-5 py-3 rounded-full text-sm hover:opacity-80 active:scale-95 transition-all cursor-pointer">
            Aplicar
          </button>
        </div>
      )}
    </div>
  );
}

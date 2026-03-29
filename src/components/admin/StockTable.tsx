"use client";

import { useState } from "react";
import type { ProductWithStock } from "@/lib/supabase/admin-queries";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

const BADGE_LABELS: Record<string, string> = {
  new: "Nuevo",
  sale: "Oferta",
  limited: "Limitado",
  imported: "Importado",
};

function StockBadge({ stock }: { stock: number }) {
  if (stock < 5) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: "#ba1a1a18", color: "#ba1a1a" }}>
        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
        Crítico
      </span>
    );
  }
  if (stock < 10) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
        style={{ background: "#e67e2218", color: "#e67e22" }}>
        <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
        Bajo
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
      style={{ background: "#10b98118", color: "#10b981" }}>
      <span className="w-1.5 h-1.5 rounded-full bg-current inline-block" />
      Normal
    </span>
  );
}

function EditStockModal({
  product,
  onSave,
  onClose,
}: {
  product: ProductWithStock;
  onSave: (id: string, newStock: number) => void;
  onClose: () => void;
}) {
  const [value, setValue] = useState(String(product.stock));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-container-lowest rounded-3xl p-6 w-full max-w-sm editorial-shadow">
        <div className="flex items-center gap-3 mb-5">
          {product.image_url && (
            <img src={product.image_url} alt={product.name}
              className="w-12 h-12 rounded-xl object-cover bg-surface-container" />
          )}
          <div>
            <h3 className="font-semibold text-on-surface text-sm leading-tight">{product.name}</h3>
            <p className="text-xs text-on-surface-variant mt-0.5">{product.categories?.name}</p>
          </div>
        </div>

        <label className="block text-xs font-medium text-on-surface-variant mb-2">
          Unidades en stock
        </label>
        <input
          type="number"
          min="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full text-3xl font-bold text-on-surface bg-surface-container-low rounded-2xl px-4 py-3 outline-none focus:ring-2 ring-primary tabular-nums text-center"
        />

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-full text-sm font-medium bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              const n = parseInt(value, 10);
              if (!isNaN(n) && n >= 0) onSave(product.id, n);
            }}
            className="flex-1 py-2.5 rounded-full text-sm font-semibold btn-gradient text-white hover:opacity-90 transition-opacity"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Mobile card for one product ──────────────────────────────────────────────
function ProductCard({ p, onEdit }: { p: ProductWithStock; onEdit: () => void }) {
  const stockColor = p.stock < 5 ? "#ba1a1a" : p.stock < 10 ? "#e67e22" : "#10b981";

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[color:var(--color-outline-variant)] last:border-0">
      {/* Thumbnail */}
      {p.image_url ? (
        <img src={p.image_url} alt={p.name}
          className="w-11 h-11 rounded-xl object-cover bg-surface-container shrink-0" />
      ) : (
        <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>image</span>
        </div>
      )}

      {/* Main info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-on-surface leading-tight truncate">{p.name}</p>
        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
          <span className="text-xs text-on-surface-variant">{p.categories?.name ?? "—"}</span>
          {p.badge && (
            <span className="text-xs font-medium px-1.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant">
              {BADGE_LABELS[p.badge] ?? p.badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs font-semibold text-on-surface">{formatPrice(p.price)}</span>
          <span className="text-on-surface-variant/40 text-xs">·</span>
          <StockBadge stock={p.stock} />
        </div>
      </div>

      {/* Stock + edit */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <span className="text-xl font-black tabular-nums" style={{ color: stockColor }}>
          {p.stock}
        </span>
        <button
          onClick={onEdit}
          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:bg-primary/8 px-2.5 py-1.5 rounded-full transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>edit</span>
          Editar
        </button>
      </div>
    </div>
  );
}

export function StockTable({ initialProducts }: { initialProducts: ProductWithStock[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "critical" | "low" | "ok">("all");
  const [editing, setEditing] = useState<ProductWithStock | null>(null);

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.categories?.name ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ? true :
      filter === "critical" ? p.stock < 5 :
      filter === "low" ? p.stock >= 5 && p.stock < 10 :
      p.stock >= 10;
    return matchSearch && matchFilter;
  });

  const handleSave = async (id: string, newStock: number) => {
    setProducts((prev) => prev.map((p) => p.id === id ? { ...p, stock: newStock } : p));
    setEditing(null);
    await fetch("/api/admin/stock", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: id, quantity: newStock }),
    });
  };

  const footer = (
    <div className="px-4 sm:px-6 py-3 flex items-center gap-3 text-xs text-on-surface-variant flex-wrap"
      style={{ borderTop: "1px solid var(--color-outline-variant)", background: "var(--color-surface-container-low)" }}>
      <span>{filtered.length} productos</span>
      <span>·</span>
      <span style={{ color: "#ba1a1a" }}>{products.filter(p => p.stock < 5).length} críticos</span>
      <span>·</span>
      <span style={{ color: "#e67e22" }}>{products.filter(p => p.stock >= 5 && p.stock < 10).length} bajos</span>
      <span>·</span>
      <span style={{ color: "#10b981" }}>{products.filter(p => p.stock >= 10).length} normales</span>
    </div>
  );

  return (
    <>
      {/* ── Filters ── */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-5">
        <div className="flex items-center gap-2 bg-surface-container-lowest rounded-full px-4 py-2.5 ambient-shadow flex-1">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>search</span>
          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-on-surface outline-none flex-1 placeholder:text-on-surface-variant"
          />
        </div>
        <div className="flex items-center gap-1 p-1 bg-surface-container-lowest rounded-full ambient-shadow">
          {(["all", "critical", "low", "ok"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 sm:flex-none px-3 sm:px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-150 whitespace-nowrap",
                filter === f
                  ? "bg-on-surface text-surface shadow-sm"
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {f === "all" ? "Todos" : f === "critical" ? "Crítico" : f === "low" ? "Bajo" : "Normal"}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile: card list (hidden on md+) ── */}
      <div className="md:hidden bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden">
        {filtered.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm text-on-surface-variant">
            No se encontraron productos
          </p>
        ) : (
          filtered.map((p) => (
            <ProductCard key={p.id} p={p} onEdit={() => setEditing(p)} />
          ))
        )}
        {footer}
      </div>

      {/* ── Desktop: full table (hidden on mobile) ── */}
      <div className="hidden md:block bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-on-surface-variant font-medium"
                style={{ background: "var(--color-surface-container-low)", borderBottom: "1px solid var(--color-outline-variant)" }}>
                <th className="text-left px-6 py-3 font-medium">Producto</th>
                <th className="text-left px-6 py-3 font-medium">Categoría</th>
                <th className="text-left px-6 py-3 font-medium">Badge</th>
                <th className="text-right px-6 py-3 font-medium">Precio</th>
                <th className="text-center px-6 py-3 font-medium">Unidades</th>
                <th className="text-center px-6 py-3 font-medium">Estado</th>
                <th className="text-right px-6 py-3 font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--color-outline-variant)]">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-on-surface-variant">
                    No se encontraron productos
                  </td>
                </tr>
              )}
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-surface-container-low transition-colors duration-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name}
                          className="w-9 h-9 rounded-xl object-cover bg-surface-container shrink-0" />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 16 }}>image</span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-on-surface leading-tight max-w-[180px] truncate">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-on-surface-variant">{p.categories?.name ?? "—"}</span>
                  </td>
                  <td className="px-6 py-4">
                    {p.badge ? (
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-container text-on-surface-variant capitalize">
                        {BADGE_LABELS[p.badge] ?? p.badge}
                      </span>
                    ) : (
                      <span className="text-xs text-on-surface-variant">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-on-surface tabular-nums">
                      {formatPrice(p.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold tabular-nums" style={{
                      color: p.stock < 5 ? "#ba1a1a" : p.stock < 10 ? "#e67e22" : "#10b981"
                    }}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StockBadge stock={p.stock} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => setEditing(p)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:bg-primary/8 px-3 py-1.5 rounded-full transition-colors duration-150"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 15 }}>edit</span>
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {footer}
      </div>

      {editing && (
        <EditStockModal
          product={editing}
          onSave={handleSave}
          onClose={() => setEditing(null)}
        />
      )}
    </>
  );
}

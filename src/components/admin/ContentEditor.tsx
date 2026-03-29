"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";
import type { HeroConfig, PromoConfig } from "@/lib/supabase/queries";

// ─── Shared helpers ────────────────────────────────────────────────────────────

const inputCls =
  "w-full bg-surface-container-low text-sm text-on-surface rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-primary placeholder:text-on-surface-variant/50 transition-all";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-on-surface-variant/60">{hint}</p>}
    </div>
  );
}

function SaveButton({ pending, onClick }: { pending: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold btn-gradient text-white hover:opacity-90 transition-opacity disabled:opacity-60"
    >
      {pending ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
      )}
      {pending ? "Guardando…" : "Guardar"}
    </button>
  );
}

function Toast({ toast }: { toast: { type: "ok" | "err"; msg: string } | null }) {
  if (!toast) return null;
  return (
    <div
      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium text-white"
      style={{ background: toast.type === "ok" ? "#10b981" : "#ba1a1a" }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
        {toast.type === "ok" ? "check_circle" : "error"}
      </span>
      {toast.msg}
    </div>
  );
}

// ─── Image URL + file uploader ─────────────────────────────────────────────────

function ImageInput({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: "ok" | "err" | "info"; text: string } | null>(null);
  const [tab, setTab] = useState<"url" | "file">("url");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setUploadMsg(null);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) { setUploadMsg({ type: "err", text: data.error ?? "Error al subir." }); return; }
      onChange(data.url);
      setUploadMsg(data.simulated
        ? { type: "info", text: "Modo demo: imagen de ejemplo usada." }
        : { type: "ok", text: "Imagen subida correctamente." }
      );
    } catch {
      setUploadMsg({ type: "err", text: "Sin conexión con el servidor." });
    } finally { setUploading(false); }
  }, [onChange]);

  return (
    <div className="space-y-3">
      {label && <p className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">{label}</p>}

      {/* Tab toggle */}
      <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-full w-fit">
        {(["url", "file"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
              tab === t ? "bg-surface-container-lowest text-on-surface shadow-sm" : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 13 }}>{t === "url" ? "link" : "upload"}</span>
            {t === "url" ? "URL" : "Subir archivo"}
          </button>
        ))}
      </div>

      {/* URL input */}
      {tab === "url" && (
        <input
          type="url"
          placeholder="https://..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}

      {/* File drop zone */}
      {tab === "file" && (
        <>
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files?.[0]; if (f) uploadFile(f); }}
            className={cn(
              "flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-6 px-4 cursor-pointer transition-all",
              dragging ? "border-primary bg-primary/5" : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low",
              uploading && "pointer-events-none opacity-60"
            )}
          >
            {uploading ? (
              <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>cloud_upload</span>
                <p className="text-xs text-on-surface-variant text-center">
                  Arrastrá o <span className="text-primary font-medium">seleccioná</span> · JPG, PNG, WebP · Máx. 5 MB
                </p>
              </>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
          {uploadMsg && (
            <p className={cn("text-xs font-medium px-3 py-1.5 rounded-xl",
              uploadMsg.type === "ok" ? "bg-emerald-500/10 text-emerald-600" :
              uploadMsg.type === "err" ? "bg-red-500/10 text-red-600" : "bg-surface-container text-on-surface-variant"
            )}>{uploadMsg.text}</p>
          )}
        </>
      )}

      {/* Preview */}
      {value && (
        <div className="relative rounded-xl overflow-hidden bg-surface-container aspect-video group">
          <img src={value} alt="Preview" className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")} />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Tab: Categorías ───────────────────────────────────────────────────────────

function CategoryCard({
  category,
  onSaved,
}: {
  category: Category;
  onSaved: (updated: Category) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: category.name, subtitle: category.subtitle ?? "", image_url: category.image_url ?? "" });
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const save = () => {
    startTransition(async () => {
      const res = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: category.id, ...form }),
      });
      if (res.ok) {
        onSaved({ ...category, ...form });
        setToast({ type: "ok", msg: "Categoría actualizada." });
        setEditing(false);
      } else {
        const d = await res.json().catch(() => ({}));
        setToast({ type: "err", msg: d.error ?? "Error al guardar." });
      }
      setTimeout(() => setToast(null), 3000);
    });
  };

  return (
    <div className="bg-surface-container-lowest rounded-2xl overflow-hidden ambient-shadow">
      {/* Image */}
      <div className="relative aspect-video bg-surface-container-low">
        {form.image_url ? (
          <img src={form.image_url} alt={form.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 40 }}>image</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <p className="text-white font-bold text-sm">{form.name}</p>
          {form.subtitle && <p className="text-white/70 text-xs">{form.subtitle}</p>}
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
        </button>
      </div>

      {/* Edit form */}
      {editing && (
        <div className="p-4 space-y-4 border-t border-outline-variant">
          {toast && <Toast toast={toast} />}

          <Field label="Nombre">
            <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className={inputCls} />
          </Field>

          <Field label="Subtítulo">
            <input value={form.subtitle} onChange={(e) => setForm(p => ({ ...p, subtitle: e.target.value }))} className={inputCls} placeholder="Ej: Portátiles de alto rendimiento" />
          </Field>

          <ImageInput value={form.image_url} onChange={(url) => setForm(p => ({ ...p, image_url: url }))} label="Imagen de categoría" />

          <div className="flex justify-end gap-2">
            <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-full text-sm font-medium bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors">
              Cancelar
            </button>
            <SaveButton pending={isPending} onClick={save} />
          </div>
        </div>
      )}
    </div>
  );
}

function CategoriesTab({ initialCategories }: { initialCategories: Category[] }) {
  const [categories, setCategories] = useState(initialCategories);

  const handleSaved = (updated: Category) => {
    setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
  };

  return (
    <div>
      <p className="text-sm text-on-surface-variant mb-6">
        Hacé click en el ícono de editar en cada categoría para cambiar su imagen, nombre o subtítulo. Los cambios se guardan en la base de datos.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} onSaved={handleSaved} />
        ))}
      </div>
    </div>
  );
}

// ─── Tab: Hero ─────────────────────────────────────────────────────────────────

function HeroTab({ initialConfig }: { initialConfig: HeroConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const set = (key: keyof HeroConfig, val: string) => setConfig((p) => ({ ...p, [key]: val }));

  const save = () => {
    startTransition(async () => {
      const res = await fetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "hero", value: config }),
      });
      setToast(res.ok
        ? { type: "ok", msg: "Hero actualizado. Recargá la tienda para ver los cambios." }
        : { type: "err", msg: "Error al guardar." }
      );
      setTimeout(() => setToast(null), 4000);
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && <Toast toast={toast} />}

      {/* Texts */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow space-y-4">
        <h3 className="text-sm font-semibold text-on-surface">Textos del hero</h3>
        <Field label="Badge (texto pequeño arriba)">
          <input value={config.badge} onChange={(e) => set("badge", e.target.value)} className={inputCls} />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field label="Línea 1">
            <input value={config.title_line1} onChange={(e) => set("title_line1", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Línea 2 (degradado)">
            <input value={config.title_line2_gradient} onChange={(e) => set("title_line2_gradient", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Línea 3">
            <input value={config.title_line3} onChange={(e) => set("title_line3", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Subtítulo">
          <textarea rows={2} value={config.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={cn(inputCls, "resize-none")} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Botón primario — texto">
            <input value={config.cta_primary_text} onChange={(e) => set("cta_primary_text", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Botón primario — enlace">
            <input value={config.cta_primary_href} onChange={(e) => set("cta_primary_href", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Botón secundario — texto">
            <input value={config.cta_secondary_text} onChange={(e) => set("cta_secondary_text", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Botón secundario — enlace">
            <input value={config.cta_secondary_href} onChange={(e) => set("cta_secondary_href", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Card */}
      <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow space-y-4">
        <h3 className="text-sm font-semibold text-on-surface">Tarjeta flotante (derecha)</h3>
        <ImageInput value={config.card_image_url} onChange={(url) => set("card_image_url", url)} label="Imagen del producto" />
        <div className="grid grid-cols-2 gap-4">
          <Field label="Etiqueta (ej: Destacado)">
            <input value={config.card_label} onChange={(e) => set("card_label", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Nombre del producto">
            <input value={config.card_name} onChange={(e) => set("card_name", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Precio (ej: $2.499.000)">
            <input value={config.card_price} onChange={(e) => set("card_price", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Badge rojo (ej: -11% OFF)">
            <input value={config.card_badge} onChange={(e) => set("card_badge", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Texto de envío">
            <input value={config.card_shipping_text} onChange={(e) => set("card_shipping_text", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton pending={isPending} onClick={save} />
      </div>
    </div>
  );
}

// ─── Tab: Promo ────────────────────────────────────────────────────────────────

function PromoTab({ initialConfig }: { initialConfig: PromoConfig }) {
  const [config, setConfig] = useState(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);

  const set = (key: keyof PromoConfig, val: string) => setConfig((p) => ({ ...p, [key]: val }));

  const save = () => {
    startTransition(async () => {
      const res = await fetch("/api/admin/config", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "promo", value: config }),
      });
      setToast(res.ok
        ? { type: "ok", msg: "Sección promo actualizada. Recargá la tienda para ver los cambios." }
        : { type: "err", msg: "Error al guardar." }
      );
      setTimeout(() => setToast(null), 4000);
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && <Toast toast={toast} />}

      <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow space-y-4">
        <h3 className="text-sm font-semibold text-on-surface">Contenido de la sección oscura</h3>

        <Field label="Badge (texto pequeño arriba)">
          <input value={config.badge} onChange={(e) => set("badge", e.target.value)} className={inputCls} />
        </Field>

        <div className="grid grid-cols-3 gap-3">
          <Field label="Línea 1 del título">
            <input value={config.title_line1} onChange={(e) => set("title_line1", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Línea 2 del título">
            <input value={config.title_line2} onChange={(e) => set("title_line2", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Línea 3 (color azul)">
            <input value={config.title_line3} onChange={(e) => set("title_line3", e.target.value)} className={inputCls} />
          </Field>
        </div>

        <Field label="Descripción">
          <textarea rows={3} value={config.description} onChange={(e) => set("description", e.target.value)} className={cn(inputCls, "resize-none")} />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Botón primario — texto">
            <input value={config.cta_primary_text} onChange={(e) => set("cta_primary_text", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Botón primario — enlace">
            <input value={config.cta_primary_href} onChange={(e) => set("cta_primary_href", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Botón secundario — texto">
            <input value={config.cta_secondary_text} onChange={(e) => set("cta_secondary_text", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Botón secundario — enlace">
            <input value={config.cta_secondary_href} onChange={(e) => set("cta_secondary_href", e.target.value)} className={inputCls} />
          </Field>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton pending={isPending} onClick={save} />
      </div>
    </div>
  );
}

// ─── Main ContentEditor ────────────────────────────────────────────────────────

type Tab = "categories" | "hero" | "promo";

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "categories", label: "Categorías", icon: "grid_view" },
  { id: "hero",       label: "Hero",        icon: "web_asset" },
  { id: "promo",      label: "Sección Promo", icon: "campaign" },
];

export function ContentEditor({
  categories,
  heroConfig,
  promoConfig,
}: {
  categories: Category[];
  heroConfig: HeroConfig;
  promoConfig: PromoConfig;
}) {
  const [activeTab, setActiveTab] = useState<Tab>("categories");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-2xl w-fit mb-8">
        {TABS.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
              activeTab === id
                ? "bg-surface-container-lowest text-on-surface ambient-shadow"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18, fontVariationSettings: activeTab === id ? "'FILL' 1" : "'FILL' 0" }}>
              {icon}
            </span>
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "categories" && <CategoriesTab initialCategories={categories} />}
      {activeTab === "hero"       && <HeroTab initialConfig={heroConfig} />}
      {activeTab === "promo"      && <PromoTab initialConfig={promoConfig} />}
    </div>
  );
}

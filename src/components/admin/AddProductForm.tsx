"use client";

import { useState, useTransition, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface SpecRow {
  key: string;
  value: string;
}

interface FormState {
  name: string;
  slug: string;
  description: string;
  price: string;
  old_price: string;
  category_id: string;
  badge: string;
  image_url: string;
  is_featured: boolean;
  specs: SpecRow[];
}

type ImageMode = "url" | "file";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-on-surface-variant uppercase tracking-wide">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full bg-surface-container-low text-sm text-on-surface rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-primary placeholder:text-on-surface-variant/50 transition-all";

function ImageUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const [mode, setMode] = useState<ImageMode>("url");
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{ type: "ok" | "err" | "info"; text: string } | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setUploading(true);
    setUploadMsg(null);

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setLocalPreview(objectUrl);

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setUploadMsg({ type: "err", text: data.error ?? "Error al subir la imagen." });
        setLocalPreview(null);
        return;
      }

      onChange(data.url);

      if (data.simulated) {
        setUploadMsg({ type: "info", text: data.note ?? "Modo demo: imagen de ejemplo usada." });
      } else {
        setUploadMsg({ type: "ok", text: "Imagen subida correctamente." });
      }
    } catch {
      setUploadMsg({ type: "err", text: "Sin conexión con el servidor." });
      setLocalPreview(null);
    } finally {
      setUploading(false);
    }
  }, [onChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  };

  const preview = localPreview ?? value;

  return (
    <div className="space-y-3">
      {/* Mode toggle */}
      <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-full w-fit">
        {(["url", "file"] as ImageMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => { setMode(m); setUploadMsg(null); }}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-150",
              mode === m
                ? "bg-surface-container-lowest text-on-surface shadow-sm"
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>
              {m === "url" ? "link" : "upload"}
            </span>
            {m === "url" ? "URL" : "Subir archivo"}
          </button>
        ))}
      </div>

      {/* URL input */}
      {mode === "url" && (
        <input
          type="url"
          placeholder="https://..."
          value={value}
          onChange={(e) => { onChange(e.target.value); setLocalPreview(null); }}
          className={inputCls}
        />
      )}

      {/* File upload */}
      {mode === "file" && (
        <>
          <div
            onClick={() => !uploading && fileRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={cn(
              "relative flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed transition-all duration-150 cursor-pointer select-none",
              dragging
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-outline-variant hover:border-primary/50 hover:bg-surface-container-low",
              uploading ? "pointer-events-none opacity-60" : "",
              "py-8 px-4"
            )}
          >
            {uploading ? (
              <>
                <span className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <p className="text-xs text-on-surface-variant">Subiendo imagen...</p>
              </>
            ) : (
              <>
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 22 }}>
                    cloud_upload
                  </span>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-on-surface">
                    Arrastra una imagen aquí
                  </p>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    o <span className="text-primary font-medium">selecciona un archivo</span>
                  </p>
                </div>
                <p className="text-xs text-on-surface-variant">
                  JPG, PNG, WebP, AVIF · Máx. 5 MB
                </p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Upload feedback */}
          {uploadMsg && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium"
              style={{
                background:
                  uploadMsg.type === "ok" ? "#10b98118" :
                  uploadMsg.type === "err" ? "#ba1a1a18" :
                  "var(--color-surface-container)",
                color:
                  uploadMsg.type === "ok" ? "#10b981" :
                  uploadMsg.type === "err" ? "#ba1a1a" :
                  "var(--color-on-surface-variant)",
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16, fontVariationSettings: "'FILL' 1" }}>
                {uploadMsg.type === "ok" ? "check_circle" : uploadMsg.type === "err" ? "error" : "info"}
              </span>
              {uploadMsg.text}
            </div>
          )}
        </>
      )}

      {/* Preview */}
      {preview && (
        <div className="relative rounded-xl overflow-hidden bg-surface-container aspect-video group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
          <button
            type="button"
            onClick={() => { onChange(""); setLocalPreview(null); }}
            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
          >
            <span className="material-symbols-outlined" style={{ fontSize: 14 }}>close</span>
          </button>
        </div>
      )}
    </div>
  );
}

export function AddProductForm({ categories }: { categories: Category[] }) {
  const [form, setForm] = useState<FormState>({
    name: "",
    slug: "",
    description: "",
    price: "",
    old_price: "",
    category_id: "",
    badge: "",
    image_url: "",
    is_featured: false,
    specs: [{ key: "", value: "" }],
  });
  const [toast, setToast] = useState<{ type: "ok" | "err"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const set = (field: keyof FormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleNameChange = (v: string) => {
    setForm((prev) => ({
      ...prev,
      name: v,
      slug: prev.slug === slugify(prev.name) || prev.slug === "" ? slugify(v) : prev.slug,
    }));
  };

  const updateSpec = (i: number, field: "key" | "value", v: string) =>
    setForm((prev) => {
      const specs = [...prev.specs];
      specs[i] = { ...specs[i], [field]: v };
      return { ...prev, specs };
    });

  const addSpec = () => set("specs", [...form.specs, { key: "", value: "" }]);

  const removeSpec = (i: number) =>
    set("specs", form.specs.filter((_, idx) => idx !== i));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name || !form.slug || !form.price || !form.category_id) {
      setToast({ type: "err", msg: "Completa los campos obligatorios." });
      setTimeout(() => setToast(null), 3500);
      return;
    }

    startTransition(async () => {
      const specsObj: Record<string, string> = {};
      form.specs.filter((s) => s.key && s.value).forEach((s) => { specsObj[s.key] = s.value; });

      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        price: parseFloat(form.price),
        old_price: form.old_price ? parseFloat(form.old_price) : null,
        category_id: form.category_id,
        badge: form.badge || null,
        image_url: form.image_url || null,
        is_featured: form.is_featured,
        specs: specsObj,
        images: [],
        rating: 0,
        reviews_count: 0,
      };

      try {
        const res = await fetch("/api/admin/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          setToast({ type: "ok", msg: "¡Producto creado exitosamente!" });
          setForm({
            name: "", slug: "", description: "", price: "", old_price: "",
            category_id: "", badge: "", image_url: "", is_featured: false,
            specs: [{ key: "", value: "" }],
          });
        } else {
          const data = await res.json().catch(() => ({}));
          setToast({ type: "err", msg: data.error ?? "Error al guardar el producto." });
        }
      } catch {
        setToast({ type: "err", msg: "Sin conexión con el servidor." });
      }

      setTimeout(() => setToast(null), 4000);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-white"
          style={{ background: toast.type === "ok" ? "#10b981" : "#ba1a1a" }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: "'FILL' 1" }}>
            {toast.type === "ok" ? "check_circle" : "error"}
          </span>
          {toast.msg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — main info */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow space-y-4">
            <h3 className="text-sm font-semibold text-on-surface">Información general</h3>

            <Field label="Nombre del producto" required>
              <input
                type="text"
                placeholder='Ej: MacBook Pro M3 14"'
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                className={inputCls}
              />
            </Field>

            <Field label="Slug (URL)">
              <div className="flex items-center bg-surface-container-low rounded-xl overflow-hidden focus-within:ring-2 ring-primary transition-all">
                <span className="px-3 text-xs text-on-surface-variant select-none">/producto/</span>
                <input
                  type="text"
                  placeholder="macbook-pro-m3"
                  value={form.slug}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                  className="flex-1 bg-transparent text-sm text-on-surface py-2.5 pr-4 outline-none"
                />
              </div>
            </Field>

            <Field label="Descripción">
              <textarea
                rows={3}
                placeholder="Descripción del producto..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className={cn(inputCls, "resize-none")}
              />
            </Field>
          </div>

          {/* Pricing */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow space-y-4">
            <h3 className="text-sm font-semibold text-on-surface">Precios</h3>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Precio" required>
                <div className="flex items-center bg-surface-container-low rounded-xl overflow-hidden focus-within:ring-2 ring-primary transition-all">
                  <span className="px-3 text-xs text-on-surface-variant">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                    className="flex-1 bg-transparent text-sm text-on-surface py-2.5 pr-4 outline-none tabular-nums"
                  />
                </div>
              </Field>
              <Field label="Precio anterior (opcional)">
                <div className="flex items-center bg-surface-container-low rounded-xl overflow-hidden focus-within:ring-2 ring-primary transition-all">
                  <span className="px-3 text-xs text-on-surface-variant">$</span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="0"
                    value={form.old_price}
                    onChange={(e) => set("old_price", e.target.value)}
                    className="flex-1 bg-transparent text-sm text-on-surface py-2.5 pr-4 outline-none tabular-nums"
                  />
                </div>
              </Field>
            </div>
          </div>

          {/* Specs */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-on-surface">Especificaciones técnicas</h3>
              <button
                type="button"
                onClick={addSpec}
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:bg-primary/8 px-3 py-1.5 rounded-full transition-colors"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 15 }}>add</span>
                Agregar
              </button>
            </div>
            <div className="space-y-2.5">
              {form.specs.map((spec, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Ej: Procesador"
                    value={spec.key}
                    onChange={(e) => updateSpec(i, "key", e.target.value)}
                    className={cn(inputCls, "flex-1")}
                  />
                  <input
                    type="text"
                    placeholder="Ej: Apple M3 Pro"
                    value={spec.value}
                    onChange={(e) => updateSpec(i, "value", e.target.value)}
                    className={cn(inputCls, "flex-1")}
                  />
                  <button
                    type="button"
                    onClick={() => removeSpec(i)}
                    disabled={form.specs.length === 1}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error/10 hover:text-error transition-colors disabled:opacity-30"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>remove</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — meta */}
        <div className="space-y-5">
          <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow space-y-4">
            <h3 className="text-sm font-semibold text-on-surface">Categoría y badge</h3>

            <Field label="Categoría" required>
              <select
                value={form.category_id}
                onChange={(e) => set("category_id", e.target.value)}
                className={cn(inputCls, "cursor-pointer")}
              >
                <option value="">Seleccionar...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Badge">
              <select
                value={form.badge}
                onChange={(e) => set("badge", e.target.value)}
                className={cn(inputCls, "cursor-pointer")}
              >
                <option value="">Sin badge</option>
                <option value="new">Nuevo</option>
                <option value="sale">Oferta</option>
                <option value="limited">Limitado</option>
                <option value="imported">Importado</option>
              </select>
            </Field>
          </div>

          {/* Image section */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow space-y-3">
            <h3 className="text-sm font-semibold text-on-surface">Imagen del producto</h3>
            <ImageUploader
              value={form.image_url}
              onChange={(url) => set("image_url", url)}
            />
          </div>

          <div className="bg-surface-container-lowest rounded-2xl p-6 ambient-shadow">
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <div
                className={cn(
                  "w-10 h-6 rounded-full transition-all duration-200 relative shrink-0",
                  form.is_featured ? "bg-primary" : "bg-surface-container-high"
                )}
                onClick={() => set("is_featured", !form.is_featured)}
              >
                <span
                  className={cn(
                    "absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200",
                    form.is_featured ? "left-5" : "left-1"
                  )}
                />
              </div>
              <div>
                <p className="text-sm font-medium text-on-surface">Destacado en homepage</p>
                <p className="text-xs text-on-surface-variant">Aparece en la sección featured</p>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-full text-sm font-semibold btn-gradient text-white hover:opacity-90 transition-opacity disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>save</span>
                Crear producto
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}

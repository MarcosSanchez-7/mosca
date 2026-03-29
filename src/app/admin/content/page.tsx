import type { Metadata } from "next";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { getCategories, getSiteConfig } from "@/lib/supabase/queries";

export const metadata: Metadata = { title: "Contenido" };

export default async function ContentPage() {
  const [categories, heroConfig, promoConfig] = await Promise.all([
    getCategories(),
    getSiteConfig("hero"),
    getSiteConfig("promo"),
  ]);

  return (
    <div className="flex-1 p-8 overflow-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-1">Admin</p>
        <h1 className="text-3xl font-black text-on-surface tracking-tight">Contenido de la tienda</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Editá las imágenes y textos del Hero, las categorías y la sección promo de la página principal.
        </p>
      </div>

      <ContentEditor
        categories={categories}
        heroConfig={heroConfig}
        promoConfig={promoConfig}
      />
    </div>
  );
}

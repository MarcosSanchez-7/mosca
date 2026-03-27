import { getCategoriesAdmin } from "@/lib/supabase/admin-queries";
import { AddProductForm } from "@/components/admin/AddProductForm";

export const metadata = { title: "Nuevo Producto" };

export default async function NewProductPage() {
  const categories = await getCategoriesAdmin();

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Nuevo Producto</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Completa los datos para agregar un producto al catálogo
        </p>
      </div>
      <AddProductForm categories={categories} />
    </div>
  );
}

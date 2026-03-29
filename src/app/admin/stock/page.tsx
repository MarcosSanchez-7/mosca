import { getAllProductsAdmin } from "@/lib/supabase/admin-queries";
import { StockTable } from "@/components/admin/StockTable";

export const metadata = { title: "Control de Stock" };

export default async function StockPage() {
  const products = await getAllProductsAdmin();

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface">Control de Stock</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Gestiona las unidades disponibles de cada producto
        </p>
      </div>
      <StockTable initialProducts={products} />
    </div>
  );
}

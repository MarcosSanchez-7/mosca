import Link from "next/link";
import { getAdminStats, getAllProductsAdmin } from "@/lib/supabase/admin-queries";
import { formatPrice } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

function StatCard({
  label,
  value,
  icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: string;
  sub?: string;
}) {
  return (
    <div className="bg-surface-container-lowest rounded-2xl p-4 sm:p-5 editorial-shadow flex items-start gap-3">
      <div
        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: color + "18" }}
      >
        <span
          className="material-symbols-outlined"
          style={{ fontSize: 18, color, fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-xl sm:text-2xl font-bold text-on-surface leading-none">{value}</p>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-1 font-medium leading-tight">{label}</p>
        {sub && <p className="text-xs text-on-surface-variant/70 mt-0.5 leading-tight">{sub}</p>}
      </div>
    </div>
  );
}

export default async function AdminDashboard() {
  const [stats, products] = await Promise.all([
    getAdminStats(),
    getAllProductsAdmin(),
  ]);

  const recent = products.slice(0, 5);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-on-surface">Dashboard</h1>
        <p className="text-on-surface-variant mt-1 text-sm">
          Resumen general del negocio
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        <StatCard
          label="Productos"
          value={stats.totalProducts}
          icon="package_2"
          color="var(--color-primary)"
          sub={`${stats.totalCategories} categorías`}
        />
        <StatCard
          label="Stock crítico"
          value={stats.lowStock}
          icon="warning"
          color="#e67e22"
          sub="Menos de 10 unidades"
        />
        <StatCard
          label="Destacados"
          value={stats.featured}
          icon="star"
          color="#8b5cf6"
          sub="En homepage"
        />
        <StatCard
          label="Categorías"
          value={stats.totalCategories}
          icon="category"
          color="#10b981"
          sub="Activas"
        />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8 sm:mb-10">
        {[
          { href: "/admin/products/new", icon: "add_box", label: "Nuevo producto", desc: "Agregar al catálogo" },
          { href: "/admin/stock", icon: "inventory_2", label: "Gestionar stock", desc: "Editar cantidades" },
          { href: "/admin/users", icon: "group", label: "Ver usuarios", desc: "Gestionar clientes" },
        ].map(({ href, icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-surface-container-lowest rounded-2xl p-4 ambient-shadow flex items-center gap-3 hover:bg-surface-container-low transition-colors duration-150 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center shrink-0 group-hover:bg-primary/15 transition-colors duration-150">
              <span className="material-symbols-outlined text-primary" style={{ fontSize: 20 }}>
                {icon}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-on-surface">{label}</p>
              <p className="text-xs text-on-surface-variant">{desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent products */}
      <div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden">
        <div className="px-4 sm:px-6 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
          <h2 className="text-sm font-semibold text-on-surface">Productos recientes</h2>
          <Link href="/admin/stock" className="text-xs text-primary font-medium hover:underline">
            Ver todos →
          </Link>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[520px]">
          <thead>
            <tr className="text-xs text-on-surface-variant font-medium" style={{ background: "var(--color-surface-container-low)" }}>
              <th className="text-left px-6 py-3">Producto</th>
              <th className="text-left px-6 py-3">Categoría</th>
              <th className="text-right px-6 py-3">Precio</th>
              <th className="text-right px-6 py-3">Stock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-outline-variant)]">
            {recent.map((p) => {
              const stockColor =
                p.stock < 5
                  ? "#ba1a1a"
                  : p.stock < 10
                  ? "#e67e22"
                  : "#10b981";
              return (
                <tr key={p.id} className="hover:bg-surface-container-low transition-colors duration-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {p.image_url && (
                        <img
                          src={p.image_url}
                          alt={p.name}
                          className="w-8 h-8 rounded-lg object-cover bg-surface-container"
                        />
                      )}
                      <span className="text-sm font-medium text-on-surface truncate max-w-[200px]">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-on-surface-variant">
                      {p.categories?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-semibold text-on-surface">
                      {formatPrice(p.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold tabular-nums" style={{ color: stockColor }}>
                      {p.stock} u.
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  );
}

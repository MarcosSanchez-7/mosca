import { getUsersAdmin } from "@/lib/supabase/admin-queries";
import { cn } from "@/lib/utils";

export const metadata = { title: "Usuarios" };

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AVATAR_COLORS = [
  "#0059b5", "#8b5cf6", "#10b981", "#e67e22", "#ba1a1a", "#06b6d4", "#ec4899",
];

function colorFor(id: string) {
  const sum = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

export default async function UsersPage() {
  const users = await getUsersAdmin();
  const active = users.filter((u) => u.status === "active").length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface">Usuarios</h1>
          <p className="text-on-surface-variant mt-1 text-sm">
            {users.length} registrados · {active} activos
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-5 sm:mb-6">
        {[
          { label: "Total usuarios", value: users.length, icon: "group", color: "var(--color-primary)" },
          { label: "Activos", value: active, icon: "check_circle", color: "#10b981" },
          { label: "Inactivos", value: users.length - active, icon: "cancel", color: "#e67e22" },
        ].map(({ label, value, icon, color }) => (
          <div key={label} className="bg-surface-container-lowest rounded-2xl p-5 ambient-shadow flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: color + "18" }}>
              <span className="material-symbols-outlined" style={{ fontSize: 20, color, fontVariationSettings: "'FILL' 1" }}>
                {icon}
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-on-surface leading-none">{value}</p>
              <p className="text-xs text-on-surface-variant mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded-2xl editorial-shadow overflow-hidden">
        <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="text-xs text-on-surface-variant font-medium"
              style={{ background: "var(--color-surface-container-low)", borderBottom: "1px solid var(--color-outline-variant)" }}>
              <th className="text-left px-6 py-3 font-medium">Usuario</th>
              <th className="text-left px-6 py-3 font-medium">Email</th>
              <th className="text-center px-6 py-3 font-medium">Rol</th>
              <th className="text-center px-6 py-3 font-medium">Pedidos</th>
              <th className="text-left px-6 py-3 font-medium">Registro</th>
              <th className="text-center px-6 py-3 font-medium">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[color:var(--color-outline-variant)]">
            {users.map((user) => {
              const color = colorFor(user.id);
              const date = new Date(user.created_at).toLocaleDateString("es-AR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              });
              return (
                <tr key={user.id} className="hover:bg-surface-container-low transition-colors duration-100">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                        style={{ background: color }}
                      >
                        {initials(user.name)}
                      </div>
                      <span className="text-sm font-medium text-on-surface">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-on-surface-variant">{user.email}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        "text-xs font-semibold px-2.5 py-1 rounded-full",
                        user.role === "admin"
                          ? "text-white"
                          : "text-on-surface-variant"
                      )}
                      style={{
                        background: user.role === "admin" ? "var(--color-primary)" : "var(--color-surface-container)",
                      }}
                    >
                      {user.role === "admin" ? "Admin" : "Cliente"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-semibold text-on-surface tabular-nums">
                      {user.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-on-surface-variant">{date}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {user.status === "active" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: "#10b98118", color: "#10b981" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: "#e67e2218", color: "#e67e22" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        Inactivo
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        </div>
        <div className="px-4 sm:px-6 py-3 text-xs text-on-surface-variant"
          style={{ borderTop: "1px solid var(--color-outline-variant)", background: "var(--color-surface-container-low)" }}>
          {users.length} usuarios registrados
        </div>
      </div>
    </div>
  );
}

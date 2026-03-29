"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/content", label: "Contenido", icon: "edit_note" },
  { href: "/admin/stock", label: "Control de Stock", icon: "inventory_2" },
  { href: "/admin/users", label: "Usuarios", icon: "group" },
  { href: "/admin/products/new", label: "Nuevo Producto", icon: "add_box" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 bg-surface-container-lowest flex flex-col min-h-screen sticky top-0 shrink-0"
      style={{ borderRight: "1px solid var(--color-outline-variant)" }}>
      {/* Brand */}
      <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-bold text-lg text-primary">Pixel</span>
          <span className="font-bold text-lg text-on-surface">Import</span>
        </Link>
        <p className="text-xs text-on-surface-variant mt-0.5 font-medium tracking-wide uppercase">
          Admin
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, label, icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: 20, fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}
              >
                {icon}
              </span>
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-3" style={{ borderTop: "1px solid var(--color-outline-variant)" }}>
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all duration-150"
        >
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>
            storefront
          </span>
          Ver tienda
        </Link>
      </div>
    </aside>
  );
}

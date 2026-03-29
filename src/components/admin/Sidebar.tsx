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

interface SidebarProps {
  mobile?: boolean;
  onClose?: () => void;
}

export function Sidebar({ mobile, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    if (mobile && onClose) onClose();
  };

  return (
    <aside
      className={cn(
        "flex flex-col bg-surface-container-lowest",
        mobile
          ? "w-full h-full"
          : "hidden md:flex w-60 min-h-screen sticky top-0 shrink-0"
      )}
      style={{ borderRight: "1px solid var(--color-outline-variant)" }}
    >
      {/* Brand */}
      <div className="px-5 h-14 flex items-center justify-between shrink-0"
        style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
        <Link href="/" className="flex items-center gap-0.5 group">
          <span className="font-bold text-lg text-primary">Pixel</span>
          <span className="font-bold text-lg text-on-surface">Import</span>
          <span className="ml-2 text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
            Admin
          </span>
        </Link>
        {mobile && onClose && (
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors"
            aria-label="Cerrar menú"
          >
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>
              close
            </span>
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={handleNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <span
                className="material-symbols-outlined shrink-0"
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
      <div className="p-3 shrink-0" style={{ borderTop: "1px solid var(--color-outline-variant)" }}>
        <Link
          href="/"
          onClick={handleNavClick}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-all duration-150"
        >
          <span className="material-symbols-outlined shrink-0" style={{ fontSize: 20 }}>
            storefront
          </span>
          Ver tienda
        </Link>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";
import { Container } from "@/components/ui/Container";
import { SearchBox } from "@/components/layout/SearchBox";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Inicio" },
  { href: "/catalog", label: "Catálogo" },
];

export function Navbar() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Close mobile search on route change
  useEffect(() => {
    setMobileSearchOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 glass-nav border-b border-outline-variant/30">
      <Container>
        <nav className="flex items-center justify-between h-16 gap-4">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-gradient text-xl font-black tracking-tight">
              PixelImport
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 flex-shrink-0">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                  pathname === href
                    ? "text-primary bg-primary/10"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop search bar */}
          <div className="hidden md:flex flex-1 max-w-sm">
            <SearchBox inputClassName="h-9" />
          </div>

          {/* Right: mobile search toggle + cart */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setMobileSearchOpen((v) => !v)}
              className={cn(
                "md:hidden flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                mobileSearchOpen
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-surface-container text-on-surface"
              )}
              aria-label={mobileSearchOpen ? "Cerrar búsqueda" : "Buscar"}
            >
              <span className="material-symbols-outlined" style={{ fontSize: 22 }}>
                {mobileSearchOpen ? "close" : "search"}
              </span>
            </button>

            <Link
              href="/cart"
              className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container transition-colors"
              aria-label={`Carrito, ${itemCount} producto${itemCount !== 1 ? "s" : ""}`}
            >
              <span className="material-symbols-outlined text-on-surface" style={{ fontSize: 22 }}>
                shopping_cart
              </span>
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-primary text-on-primary text-[10px] font-bold rounded-full px-1 leading-none">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Mobile search bar */}
        {mobileSearchOpen && (
          <div className="md:hidden pb-3">
            <SearchBox
              inputClassName="h-10"
              autoFocus
              onSearch={() => setMobileSearchOpen(false)}
            />
          </div>
        )}
      </Container>
    </header>
  );
}

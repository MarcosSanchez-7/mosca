"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* ── Desktop sidebar (always visible md+) ── */}
      <Sidebar />

      {/* ── Mobile drawer ── */}
      <div
        className={cn(
          "md:hidden fixed inset-y-0 left-0 z-40 w-72 flex flex-col bg-surface-container-lowest shadow-2xl",
          "transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <Sidebar mobile onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Mobile backdrop ── */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="md:hidden sticky top-0 z-20 h-14 bg-surface-container-lowest flex items-center gap-3 px-4"
          style={{ borderBottom: "1px solid var(--color-outline-variant)" }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-surface-container transition-colors"
            aria-label="Abrir menú"
          >
            <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 22 }}>
              menu
            </span>
          </button>
          <div className="flex items-center gap-0.5">
            <span className="font-bold text-base text-primary">Pixel</span>
            <span className="font-bold text-base text-on-surface">Import</span>
            <span className="ml-2 text-xs font-medium text-on-surface-variant bg-surface-container px-2 py-0.5 rounded-full">
              Admin
            </span>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}

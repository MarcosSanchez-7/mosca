"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

interface FilterBarProps {
  categories: Category[];
  activeSlug: string;
}

export function FilterBar({ categories, activeSlug }: FilterBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleFilter(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug === "all") {
      params.delete("category");
    } else {
      params.set("category", slug);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const allFilters = [
    { slug: "all", name: "Todos" },
    ...categories.map((c) => ({ slug: c.slug, name: c.name })),
  ];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {allFilters.map((filter) => (
        <button
          key={filter.slug}
          onClick={() => handleFilter(filter.slug)}
          className={cn(
            "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer",
            activeSlug === filter.slug
              ? "btn-gradient text-on-primary shadow-sm"
              : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
          )}
        >
          {filter.name}
        </button>
      ))}
    </div>
  );
}

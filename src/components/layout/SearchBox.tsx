"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Suggestion {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  categories: { id: string; name: string; slug: string } | null;
}

interface SearchBoxProps {
  inputClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: () => void;
}

export function SearchBox({
  inputClassName,
  placeholder = "Buscar productos...",
  autoFocus = false,
  onSearch,
}: SearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Auto-focus when requested
  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  // Click outside closes dropdown
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  // Debounced suggestions fetch
  useEffect(() => {
    clearTimeout(debounceRef.current);
    const q = query.trim();

    if (q.length < 3) {
      setSuggestions([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const data: Suggestion[] = await res.json();
        setSuggestions(data);
        setOpen(data.length > 0);
        setActiveIndex(-1);
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [query]);

  function go(path: string) {
    router.push(path);
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    onSearch?.();
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    go(`/search?q=${encodeURIComponent(q)}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      go(`/product/${suggestions[activeIndex].slug}`);
    }
  }

  function clearQuery() {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.focus();
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative group">
          {/* Search icon / spinner */}
          <span
            className={cn(
              "material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none transition-colors",
              loading
                ? "text-primary animate-pulse"
                : "text-on-surface-variant group-focus-within:text-primary"
            )}
            style={{ fontSize: 18 }}
          >
            search
          </span>

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => { if (suggestions.length > 0) setOpen(true); }}
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            className={cn(
              "w-full pl-9 pr-9 rounded-full bg-surface-container text-sm text-on-surface placeholder:text-on-surface-variant/60 outline-none focus:ring-2 focus:ring-primary/40 transition",
              inputClassName
            )}
          />

          {/* Clear button */}
          {query && (
            <button
              type="button"
              onClick={clearQuery}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition"
              aria-label="Limpiar búsqueda"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          role="listbox"
          className="absolute top-full left-0 right-0 mt-2 bg-surface border border-outline-variant/30 rounded-2xl shadow-xl overflow-hidden z-50"
        >
          {suggestions.map((s, i) => (
            <li key={s.id} role="option" aria-selected={i === activeIndex}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()} // keep input focus
                onClick={() => go(`/product/${s.slug}`)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors",
                  i === activeIndex
                    ? "bg-primary/10"
                    : "hover:bg-surface-container"
                )}
              >
                {/* Thumbnail */}
                <div className="w-10 h-10 rounded-xl bg-surface-container-low flex-shrink-0 overflow-hidden">
                  {s.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={s.image_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-outline-variant" style={{ fontSize: 18 }}>image</span>
                    </div>
                  )}
                </div>

                {/* Name + category */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">{s.name}</p>
                  {s.categories && (
                    <p className="text-xs text-on-surface-variant">{s.categories.name}</p>
                  )}
                </div>

                {/* Price */}
                <span className="text-sm font-semibold text-primary flex-shrink-0">
                  {formatPrice(s.price)}
                </span>
              </button>
            </li>
          ))}

          {/* Footer: see all results */}
          <li role="option" aria-selected={false}>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 border-t border-outline-variant/20 text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: 16 }}>search</span>
              Ver todos los resultados de &ldquo;{query}&rdquo;
            </button>
          </li>
        </ul>
      )}
    </div>
  );
}

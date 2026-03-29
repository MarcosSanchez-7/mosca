import { createClient, createStaticClient } from "./server";
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from "@/lib/mock-data";
import type { Category, Product } from "@/types";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && !url.includes("YOUR_PROJECT");
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return MOCK_CATEGORIES;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");
    if (error) throw error;
    return data ?? [];
  } catch {
    return MOCK_CATEGORIES;
  }
}

export async function getFeaturedProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured()) return MOCK_PRODUCTS.filter((p) => p.is_featured);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(6);
    if (error) throw error;
    return (data as Product[]) ?? [];
  } catch {
    return MOCK_PRODUCTS.filter((p) => p.is_featured);
  }
}

export async function getProductsByCategory(
  categorySlug?: string
): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    if (!categorySlug || categorySlug === "all") return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => p.categories?.slug === categorySlug);
  }
  try {
    const supabase = await createClient();

    if (categorySlug && categorySlug !== "all") {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories!inner(id, name, slug)")
        .eq("categories.slug", categorySlug)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as Product[]) ?? [];
    }

    const { data, error } = await supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Product[]) ?? [];
  } catch {
    if (!categorySlug || categorySlug === "all") return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter((p) => p.categories?.slug === categorySlug);
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!isSupabaseConfigured()) {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .eq("slug", slug)
      .single();
    if (error) return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
    return data as Product;
  } catch {
    return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim();
  if (!q) return [];

  if (!isSupabaseConfigured()) {
    const lower = q.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.description ?? "").toLowerCase().includes(lower)
    );
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("products")
      .select("*, categories(id, name, slug)")
      .or(`name.ilike.%${q}%,description.ilike.%${q}%`)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Product[]) ?? [];
  } catch {
    const lower = q.toLowerCase();
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        (p.description ?? "").toLowerCase().includes(lower)
    );
  }
}

export interface HeroConfig {
  badge: string;
  title_line1: string;
  title_line2_gradient: string;
  title_line3: string;
  subtitle: string;
  cta_primary_text: string;
  cta_primary_href: string;
  cta_secondary_text: string;
  cta_secondary_href: string;
  card_label: string;
  card_name: string;
  card_price: string;
  card_badge: string;
  card_shipping_text: string;
  card_image_url: string;
}

export interface PromoConfig {
  badge: string;
  title_line1: string;
  title_line2: string;
  title_line3: string;
  description: string;
  cta_primary_text: string;
  cta_primary_href: string;
  cta_secondary_text: string;
  cta_secondary_href: string;
}

const DEFAULT_HERO: HeroConfig = {
  badge: "Tecnología de vanguardia",
  title_line1: "Importado.",
  title_line2_gradient: "Premium.",
  title_line3: "Tuyo.",
  subtitle: "Los mejores Notebooks, Smartphones, Hardware y Accesorios del mercado internacional, directo a tus manos.",
  cta_primary_text: "Ver catálogo",
  cta_primary_href: "/catalog",
  cta_secondary_text: "Ver Notebooks",
  cta_secondary_href: "/catalog?category=notebooks",
  card_label: "Destacado",
  card_name: "MacBook Pro M3",
  card_price: "$2.499.000",
  card_badge: "-11% OFF",
  card_shipping_text: "Envío gratis",
  card_image_url: "",
};

const DEFAULT_PROMO: PromoConfig = {
  badge: "Oferta exclusiva",
  title_line1: "MacBook Pro",
  title_line2: "M3 Pro — 11%",
  title_line3: "OFF",
  description: "El portátil profesional de Apple con el chip M3 Pro de 11 núcleos. Stock limitado, oferta por tiempo limitado.",
  cta_primary_text: "Ver oferta",
  cta_primary_href: "/product/macbook-pro-m3-pro-14",
  cta_secondary_text: "Ver Notebooks",
  cta_secondary_href: "/catalog?category=notebooks",
};

export async function getSiteConfig(key: "hero"): Promise<HeroConfig>;
export async function getSiteConfig(key: "promo"): Promise<PromoConfig>;
export async function getSiteConfig(key: string): Promise<HeroConfig | PromoConfig> {
  if (!isSupabaseConfigured()) {
    return key === "hero" ? DEFAULT_HERO : DEFAULT_PROMO;
  }
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", key)
      .single();
    if (error) throw error;
    return { ...(key === "hero" ? DEFAULT_HERO : DEFAULT_PROMO), ...(data.value as object) };
  } catch {
    return key === "hero" ? DEFAULT_HERO : DEFAULT_PROMO;
  }
}

// Uses static client — safe for generateStaticParams (no HTTP context)
export async function getAllProductSlugs(): Promise<string[]> {
  if (!isSupabaseConfigured()) return MOCK_PRODUCTS.map((p) => p.slug);
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase.from("products").select("slug");
    if (error) return MOCK_PRODUCTS.map((p) => p.slug);
    return (data ?? []).map((row: { slug: string }) => row.slug);
  } catch {
    return MOCK_PRODUCTS.map((p) => p.slug);
  }
}

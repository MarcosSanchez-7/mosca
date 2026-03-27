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

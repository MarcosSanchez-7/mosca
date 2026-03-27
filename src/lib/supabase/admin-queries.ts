import { createClient } from "./server";
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from "@/lib/mock-data";
import type { Product, Category } from "@/types";

function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return url.startsWith("https://") && !url.includes("YOUR_PROJECT");
}

// Mock stock levels for products (units in inventory)
export const MOCK_STOCK: Record<string, number> = {
  "prod-1": 3,
  "prod-2": 12,
  "prod-3": 28,
  "prod-4": 15,
  "prod-5": 5,
  "prod-6": 45,
};

export interface ProductWithStock extends Product {
  stock: number;
}

export async function getAdminStats() {
  const products = await getAllProductsAdmin();
  const categories = await getCategoriesAdmin();

  const totalProducts = products.length;
  const totalCategories = categories.length;
  const featured = products.filter((p) => p.is_featured).length;
  const lowStock = products.filter((p) => {
    const stock = MOCK_STOCK[p.id] ?? 20;
    return stock < 10;
  }).length;

  return { totalProducts, totalCategories, featured, lowStock };
}

export async function getAllProductsAdmin(): Promise<ProductWithStock[]> {
  let products: Product[];

  if (!isSupabaseConfigured()) {
    products = MOCK_PRODUCTS;
  } else {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(id, name, slug)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      products = (data as Product[]) ?? [];
    } catch {
      products = MOCK_PRODUCTS;
    }
  }

  return products.map((p) => ({
    ...p,
    stock: MOCK_STOCK[p.id] ?? Math.floor(Math.random() * 40) + 5,
  }));
}

export async function getCategoriesAdmin(): Promise<Category[]> {
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

// Mock users since auth.users isn't accessible via anon key
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  status: "active" | "inactive";
  created_at: string;
  orders: number;
}

export const MOCK_USERS: AdminUser[] = [
  {
    id: "usr-1",
    name: "Carlos Mendez",
    email: "carlos@pixelimport.com",
    role: "admin",
    status: "active",
    created_at: "2024-01-15T10:00:00Z",
    orders: 0,
  },
  {
    id: "usr-2",
    name: "María Torres",
    email: "maria.torres@gmail.com",
    role: "customer",
    status: "active",
    created_at: "2024-03-22T14:30:00Z",
    orders: 4,
  },
  {
    id: "usr-3",
    name: "Juan López",
    email: "jlopez@hotmail.com",
    role: "customer",
    status: "active",
    created_at: "2024-05-10T09:15:00Z",
    orders: 2,
  },
  {
    id: "usr-4",
    name: "Ana García",
    email: "ana.garcia@outlook.com",
    role: "customer",
    status: "inactive",
    created_at: "2024-06-01T16:00:00Z",
    orders: 1,
  },
  {
    id: "usr-5",
    name: "Roberto Silva",
    email: "rsilva@empresa.com",
    role: "customer",
    status: "active",
    created_at: "2024-08-14T11:45:00Z",
    orders: 7,
  },
  {
    id: "usr-6",
    name: "Valentina Ríos",
    email: "vale.rios@gmail.com",
    role: "customer",
    status: "active",
    created_at: "2024-10-03T08:20:00Z",
    orders: 3,
  },
  {
    id: "usr-7",
    name: "Diego Ramírez",
    email: "d.ramirez@icloud.com",
    role: "customer",
    status: "inactive",
    created_at: "2025-01-18T13:00:00Z",
    orders: 0,
  },
];

export async function getUsersAdmin(): Promise<AdminUser[]> {
  // In production, query auth.users via service role or a profiles table
  return MOCK_USERS;
}

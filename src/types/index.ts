export interface Category {
  id: string;
  name: string;
  slug: string;
  subtitle: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  old_price: number | null;
  image_url: string | null;
  images: string[];
  badge: "new" | "sale" | "limited" | "imported" | null;
  rating: number;
  reviews_count: number;
  category_id: string | null;
  specs: Record<string, string>;
  is_featured: boolean;
  created_at: string;
  categories?: Pick<Category, "id" | "name" | "slug"> | null;
}

export interface CartItem {
  product: Pick<Product, "id" | "name" | "slug" | "price" | "image_url">;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem["product"] }
  | { type: "REMOVE_ITEM"; payload: { productId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; quantity: number } }
  | { type: "CLEAR_CART" };

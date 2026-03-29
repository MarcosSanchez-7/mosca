import { NextRequest, NextResponse } from "next/server";
import { searchProducts } from "@/lib/supabase/queries";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";

  if (q.trim().length < 3) {
    return NextResponse.json([]);
  }

  const products = await searchProducts(q);

  const suggestions = products.slice(0, 6).map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    image_url: p.image_url,
    price: p.price,
    categories: p.categories ?? null,
  }));

  return NextResponse.json(suggestions);
}

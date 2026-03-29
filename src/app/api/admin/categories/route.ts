import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createSupabaseClient(url, serviceKey);
}

// PATCH /api/admin/categories  { id, name?, subtitle?, image_url? }
export async function PATCH(req: NextRequest) {
  try {
    const { id, ...fields } = await req.json();

    if (!id) {
      return NextResponse.json({ error: "Falta el id de la categoría" }, { status: 400 });
    }

    const allowed = ["name", "subtitle", "image_url"];
    const update: Record<string, string> = {};
    for (const key of allowed) {
      if (key in fields && fields[key] !== undefined) update[key] = fields[key];
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Sin campos para actualizar" }, { status: 400 });
    }

    const supabase = getAdminClient();
    if (!supabase) return NextResponse.json({ ok: true, simulated: true });

    const { data, error } = await supabase
      .from("categories")
      .update(update)
      .eq("id", id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error interno" },
      { status: 500 }
    );
  }
}

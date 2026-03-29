import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return createSupabaseClient(url, serviceKey);
}

// GET /api/admin/config?key=hero
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (!key) return NextResponse.json({ error: "Falta el parámetro key" }, { status: 400 });

  const supabase = getAdminClient();
  if (!supabase) return NextResponse.json({ value: {} });

  const { data, error } = await supabase
    .from("site_config")
    .select("value")
    .eq("key", key)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json({ value: data.value });
}

// PATCH /api/admin/config  { key, value }
export async function PATCH(req: NextRequest) {
  try {
    const { key, value } = await req.json();

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Faltan key o value" }, { status: 400 });
    }

    const supabase = getAdminClient();
    if (!supabase) return NextResponse.json({ ok: true, simulated: true });

    const { error } = await supabase
      .from("site_config")
      .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error interno" },
      { status: 500 }
    );
  }
}

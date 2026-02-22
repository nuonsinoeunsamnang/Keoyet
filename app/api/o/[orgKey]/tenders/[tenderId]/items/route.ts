import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db";
import { requireOrg } from "@/lib/org";
import { getTenderById, getTenderItems, replaceTenderItems } from "@/lib/tenders";
import { putTenderItemsBody } from "@/lib/validators";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgKey: string; tenderId: string }> }
) {
  const { orgKey, tenderId } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  const tender = await getTenderById(tenderId, result.org.id);
  if (!tender)
    return NextResponse.json({ error: "Tender not found" }, { status: 404 });

  const supabase = getSupabase();
  const { data: rawData, error: rawError } = await supabase
    .from("tender_items")
    .select("id, tender_id, sort_order, description, quantity, unit, notes, image_url, created_at")
    .eq("tender_id", tenderId)
    .order("sort_order");

  if (process.env.NODE_ENV === "development") {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
    const host = url ? new URL(url).hostname : "(missing)";
    console.log("[items GET]", {
      tenderId,
      count: rawData?.length ?? 0,
      supabaseHost: host,
      rawError: rawError?.message ?? null,
    });
  }

  if (rawError) throw rawError;
  const items = (rawData ?? []) as Awaited<ReturnType<typeof getTenderItems>>;
  const res = NextResponse.json({ items });
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orgKey: string; tenderId: string }> }
) {
  const { orgKey, tenderId } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  const tender = await getTenderById(tenderId, result.org.id);
  if (!tender)
    return NextResponse.json({ error: "Tender not found" }, { status: 404 });
  try {
    const body = await request.json();
    const parsed = putTenderItemsBody.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const toInsert = parsed.data.items;
    if (process.env.NODE_ENV === "development") {
      console.log("[items PUT]", { tenderId, incomingCount: toInsert.length });
    }
    await replaceTenderItems(tenderId, toInsert);
    const saved = await getTenderItems(tenderId);
    if (process.env.NODE_ENV === "development") {
      console.log("[items PUT]", { tenderId, savedCount: saved?.length ?? 0 });
    }
    return NextResponse.json({ ok: true, items: saved });
  } catch (err) {
    console.error("PUT items", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to save items", details: message },
      { status: 500 }
    );
  }
}

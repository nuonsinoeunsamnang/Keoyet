import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getTenderById, updateTender } from "@/lib/tenders";
import { updateTenderBody } from "@/lib/validators";
import { getSupabase } from "@/lib/db";

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
  return NextResponse.json(tender);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ orgKey: string; tenderId: string }> }
) {
  const { orgKey, tenderId } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  try {
    const body = await request.json();
    const parsed = updateTenderBody.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const tender = await updateTender(tenderId, result.org.id, parsed.data);
    if (!tender)
      return NextResponse.json({ error: "Tender not found" }, { status: 404 });
    return NextResponse.json(tender);
  } catch (err) {
    console.error("PATCH tender", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Delete a draft tender. Only allowed when status is draft and there are no submissions.
 */
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ orgKey: string; tenderId: string }> }
) {
  const { orgKey, tenderId } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  const tender = await getTenderById(tenderId, result.org.id);
  if (!tender)
    return NextResponse.json({ error: "Tender not found" }, { status: 404 });
  if (tender.status !== "draft") {
    return NextResponse.json(
      { error: "Only draft tenders can be deleted." },
      { status: 400 }
    );
  }
  const supabase = getSupabase();
  const { count, error: countError } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("tender_id", tenderId);
  if (countError) {
    console.error("DELETE tender submissions count", countError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
  if ((count ?? 0) > 0) {
    return NextResponse.json(
      { error: "Can't delete — submissions already received." },
      { status: 400 }
    );
  }
  const { error: deleteError } = await supabase
    .from("tenders")
    .delete()
    .eq("id", tenderId)
    .eq("workspace_id", result.org.id);
  if (deleteError) {
    console.error("DELETE tender", deleteError);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
  return new NextResponse(null, { status: 204 });
}

import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getTenderById } from "@/lib/tenders";
import { createAwardBody } from "@/lib/validators";
import { getSupabase } from "@/lib/db";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgKey: string }> }
) {
  const { orgKey } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  try {
    const body = await request.json();
    const parsed = createAwardBody.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const tender = await getTenderById(parsed.data.tender_id, result.org.id);
    if (!tender)
      return NextResponse.json({ error: "Tender not found" }, { status: 404 });
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("awards")
      .upsert(
        {
          tender_id: parsed.data.tender_id,
          submission_id: parsed.data.submission_id,
          notify_winner: parsed.data.notify_winner ?? false,
          notes: parsed.data.notes ?? null,
        },
        { onConflict: "tender_id" }
      )
      .select()
      .single();
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    await supabase
      .from("submissions")
      .update({ status: "awarded" })
      .eq("id", parsed.data.submission_id);
    return NextResponse.json(data);
  } catch (err) {
    console.error("POST award", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

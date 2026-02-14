import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getTenderById } from "@/lib/tenders";
import { ingestSubmissionBody } from "@/lib/validators";
import { getSupabase } from "@/lib/db";

export async function POST(
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
    const parsed = ingestSubmissionBody.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const supabase = getSupabase();

    const { data: vendor } = await supabase
      .from("vendors")
      .insert({
        workspace_id: result.org.id,
        name: parsed.data.vendor_name,
        contact_email: parsed.data.contact_email ?? null,
        contact_phone: parsed.data.contact_phone ?? null,
        status: "pending",
      })
      .select("id")
      .single();

    if (!vendor) {
      return NextResponse.json(
        { error: "Failed to create vendor" },
        { status: 500 }
      );
    }

    const { data: submission } = await supabase
      .from("submissions")
      .insert({
        tender_id: tenderId,
        vendor_id: vendor.id,
        status: "submitted",
        submitted_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (!submission) {
      return NextResponse.json(
        { error: "Failed to create submission" },
        { status: 500 }
      );
    }

    if (parsed.data.items.length > 0) {
      await supabase.from("submission_items").insert(
        parsed.data.items.map((item) => ({
          submission_id: submission.id,
          tender_item_id: item.tender_item_id,
          unit_price: item.unit_price ?? null,
          total: item.total ?? null,
        }))
      );
    }

    if (parsed.data.docs?.length) {
      await supabase.from("submission_docs").insert(
        parsed.data.docs.map((d) => ({
          submission_id: submission.id,
          required_doc_id: d.required_doc_id,
          file_url: d.file_url ?? null,
          status: d.status ?? "pending",
        }))
      );
    }

    return NextResponse.json({ submissionId: submission.id, vendorId: vendor.id });
  } catch (err) {
    console.error("POST ingest submission", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getTenderById, updateTender } from "@/lib/tenders";
import { updateTenderBody } from "@/lib/validators";

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

import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { publishTender } from "@/lib/tenders";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ orgKey: string; tenderId: string }> }
) {
  const { orgKey, tenderId } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  const tender = await publishTender(tenderId, result.org.id);
  if (!tender)
    return NextResponse.json({ error: "Tender not found" }, { status: 404 });
  return NextResponse.json(tender);
}

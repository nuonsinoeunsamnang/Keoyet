import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getTenderById } from "@/lib/tenders";
import { getVendorsByTender } from "@/lib/vendors";

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
  const vendors = await getVendorsByTender(tenderId, result.org.id);
  return NextResponse.json(vendors);
}

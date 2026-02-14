import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getVendorById } from "@/lib/vendors";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgKey: string; vendorId: string }> }
) {
  const { orgKey, vendorId } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  const vendor = await getVendorById(vendorId, result.org.id);
  if (!vendor)
    return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
  return NextResponse.json(vendor);
}

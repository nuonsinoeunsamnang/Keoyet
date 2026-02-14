import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getTenderById } from "@/lib/tenders";
import { getComparison } from "@/lib/comparison";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orgKey: string; tenderId: string }> }
) {
  const { orgKey, tenderId } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  const tender = await getTenderById(tenderId, result.org.id);
  if (!tender)
    return NextResponse.json({ error: "Tender not found" }, { status: 404 });
  const url = new URL(request.url);
  const include = url.searchParams.get("include") === "all" ? "all" : "compliant";
  const data = await getComparison(tenderId, include);
  return NextResponse.json(data);
}

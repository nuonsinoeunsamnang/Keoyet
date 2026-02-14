import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getTenderById } from "@/lib/tenders";
import { getSubmissionsByTender } from "@/lib/submissions";

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
  const submissions = await getSubmissionsByTender(tenderId);
  return NextResponse.json(submissions);
}

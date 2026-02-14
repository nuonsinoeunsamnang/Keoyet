import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getSubmissionById, requestMissingDocs } from "@/lib/submissions";
import { requestMissingDocsBody } from "@/lib/validators";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgKey: string; submissionId: string }> }
) {
  const { orgKey, submissionId } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  const submission = await getSubmissionById(submissionId, result.org.id);
  if (!submission)
    return NextResponse.json(
      { error: "Submission not found" },
      { status: 404 }
    );
  const body = await request.json().catch(() => ({}));
  const parsed = requestMissingDocsBody.safeParse(body);
  const payload = parsed.success ? parsed.data : {};
  const ok = await requestMissingDocs(submissionId, payload);
  if (!ok)
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  return NextResponse.json({ ok: true });
}

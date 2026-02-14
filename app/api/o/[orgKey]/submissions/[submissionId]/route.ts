import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getSubmissionById } from "@/lib/submissions";

export async function GET(
  _request: Request,
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
  return NextResponse.json(submission);
}

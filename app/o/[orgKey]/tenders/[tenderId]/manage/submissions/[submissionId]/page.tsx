import Link from "next/link";
import { getSubmissionById } from "@/lib/submissions";
import { getOrgByKey } from "@/lib/org";
import { RequestMissingDocsModal } from "@/components/modals/RequestMissingDocsModal";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ orgKey: string; tenderId: string; submissionId: string }>;
}) {
  const { orgKey, tenderId, submissionId } = await params;
  const org = await getOrgByKey(orgKey);
  if (!org) return null;
  const submission = await getSubmissionById(submissionId, org.id);
  if (!submission) return null;

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>
        Submission: {submission.vendors?.name ?? submissionId.slice(0, 8)}
      </h1>
      <p>
        Status: <strong>{submission.status}</strong>
      </p>
      <p>
        Submitted:{" "}
        {submission.submitted_at
          ? new Date(submission.submitted_at).toLocaleString()
          : "—"}
      </p>
      <p style={{ marginTop: "1rem" }}>
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions`}
          style={{ textDecoration: "underline" }}
        >
          Back to submissions
        </Link>
      </p>
      <RequestMissingDocsModal
        orgKey={orgKey}
        submissionId={submissionId}
      />
    </div>
  );
}

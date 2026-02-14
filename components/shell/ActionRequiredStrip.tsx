import Link from "next/link";

async function getCounts(orgKey: string, tenderId: string) {
  const { getOrgByKey } = await import("@/lib/org");
  const { getSubmissionsByTender } = await import("@/lib/submissions");
  const { getVendorsByTender } = await import("@/lib/vendors");
  const org = await getOrgByKey(orgKey);
  if (!org) return { submissionsToReview: 0, vendorsPending: 0 };
  const [submissions, vendors] = await Promise.all([
    getSubmissionsByTender(tenderId),
    getVendorsByTender(tenderId, org.id),
  ]);
  const submissionsToReview = submissions.filter(
    (s) => s.status === "submitted" || s.status === "under_review"
  ).length;
  const vendorsPending = vendors.filter((v) => v.status === "pending").length;
  return { submissionsToReview, vendorsPending };
}

export async function ActionRequiredStrip({
  orgKey,
  tenderId,
}: {
  orgKey: string;
  tenderId: string;
}) {
  const { submissionsToReview, vendorsPending } = await getCounts(
    orgKey,
    tenderId
  );
  if (submissionsToReview === 0 && vendorsPending === 0) return null;
  return (
    <div
      style={{
        padding: "0.5rem 0.75rem",
        background: "#f0f9ff",
        borderRadius: 4,
        marginBottom: "1rem",
        fontSize: "0.875rem",
      }}
    >
      {submissionsToReview > 0 && (
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions`}
          style={{ textDecoration: "underline" }}
        >
          {submissionsToReview} submission(s) to review
        </Link>
      )}
      {submissionsToReview > 0 && vendorsPending > 0 && " · "}
      {vendorsPending > 0 && (
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/vendors`}
          style={{ textDecoration: "underline" }}
        >
          {vendorsPending} vendor(s) pending approval
        </Link>
      )}
    </div>
  );
}

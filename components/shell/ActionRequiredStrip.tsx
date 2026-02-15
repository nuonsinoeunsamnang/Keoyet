import Link from "next/link";
import { theme } from "@/lib/theme";

async function getCounts(orgKey: string, tenderId: string) {
  const { getOrgByKey } = await import("@/lib/org");
  const { getSubmissionsByTender } = await import("@/lib/submissions");
  const { getVendorsByTender } = await import("@/lib/vendors");
  const org = await getOrgByKey(orgKey);
  if (!org)
    return {
      questionsPending: 0,
      vendorsPending: 0,
      submissionsToReview: 0,
      waitingOnVendors: 0,
    };
  const [submissions, vendors] = await Promise.all([
    getSubmissionsByTender(tenderId),
    getVendorsByTender(tenderId, org.id),
  ]);
  const submissionsToReview = submissions.filter(
    (s) => s.status === "submitted" || s.status === "under_review"
  ).length;
  const vendorsPending = vendors.filter((v) => v.status === "pending").length;
  return {
    questionsPending: 0,
    vendorsPending,
    submissionsToReview,
    waitingOnVendors: 0,
  };
}

const cardStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  padding: "1rem",
  borderRadius: 8,
  border: `1px solid ${theme.orangeBorder}`,
  background: theme.orangeLight,
};

export async function ActionRequiredStrip({
  orgKey,
  tenderId,
}: {
  orgKey: string;
  tenderId: string;
}) {
  const counts = await getCounts(orgKey, tenderId);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "stretch",
        gap: "1rem",
        marginBottom: "1.5rem",
        padding: "1rem",
        borderRadius: 8,
        background: "#fefce8",
        border: `1px solid ${theme.orangeBorder}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          marginRight: "0.5rem",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: theme.orange,
            fontSize: "1.25rem",
          }}
          aria-hidden
        >
          &#x26A0;
        </span>
        <h2
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 600,
            color: theme.orangeText,
          }}
        >
          Action Required
        </h2>
      </div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          flex: 1,
        }}
      >
        <div style={cardStyle}>
          <div style={{ fontSize: "0.75rem", color: theme.orangeText, marginBottom: "0.25rem" }}>
            Questions pending
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: theme.orangeTitle }}>
            {counts.questionsPending}
          </div>
          <Link
            href={`/o/${orgKey}/tenders/${tenderId}/manage/qa`}
            style={{
              display: "inline-block",
              marginTop: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: theme.orange,
              textDecoration: "none",
            }}
          >
            Review
          </Link>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: "0.75rem", color: theme.orangeText, marginBottom: "0.25rem" }}>
            Vendors pending verification
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: theme.orangeTitle }}>
            {counts.vendorsPending}
          </div>
          <Link
            href={`/o/${orgKey}/tenders/${tenderId}/manage/vendors`}
            style={{
              display: "inline-block",
              marginTop: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: theme.orange,
              textDecoration: "none",
            }}
          >
            Review
          </Link>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: "0.75rem", color: theme.orangeText, marginBottom: "0.25rem" }}>
            Submissions to review
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: theme.orangeTitle }}>
            {counts.submissionsToReview}
          </div>
          <Link
            href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions`}
            style={{
              display: "inline-block",
              marginTop: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: theme.orange,
              textDecoration: "none",
            }}
          >
            Review
          </Link>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: "0.75rem", color: theme.orangeText, marginBottom: "0.25rem" }}>
            Waiting on vendors
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: theme.orangeTitle }}>
            {counts.waitingOnVendors}
          </div>
          <Link
            href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions`}
            style={{
              display: "inline-block",
              marginTop: "0.5rem",
              fontSize: "0.8125rem",
              fontWeight: 500,
              color: theme.orange,
              textDecoration: "none",
            }}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
}

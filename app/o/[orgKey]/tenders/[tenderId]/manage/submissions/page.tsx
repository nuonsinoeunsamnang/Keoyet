import Link from "next/link";
import { getSubmissionsByTender } from "@/lib/submissions";
import { getTenderById } from "@/lib/tenders";
import { getOrgByKey } from "@/lib/org";
import { SubmissionsTable } from "@/components/tables/SubmissionsTable";

const NEW_STATUSES = ["submitted", "under_review"];

export default async function SubmissionsListPage({
  params,
  searchParams,
}: {
  params: Promise<{ orgKey: string; tenderId: string }>;
  searchParams: Promise<{ filter?: string }>;
}) {
  const { orgKey, tenderId } = await params;
  const { filter } = await searchParams;
  const org = await getOrgByKey(orgKey);
  if (!org) return null;
  const tender = await getTenderById(tenderId, org.id);
  if (!tender) return null;
  const allSubmissions = await getSubmissionsByTender(tenderId);
  const submissions =
    filter === "new"
      ? allSubmissions.filter((s) => NEW_STATUSES.includes(s.status))
      : allSubmissions;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600 }}>
          Submissions
        </h1>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>Filter:</span>
          <Link
            href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions`}
            style={{
              fontSize: "0.875rem",
              padding: "0.375rem 0.75rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: filter === "new" ? "#fff" : "#f3f4f6",
              color: "#374151",
              textDecoration: "none",
            }}
          >
            All
          </Link>
          <Link
            href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions?filter=new`}
            style={{
              fontSize: "0.875rem",
              padding: "0.375rem 0.75rem",
              borderRadius: 6,
              border: "1px solid #d1d5db",
              background: filter === "new" ? "#f3f4f6" : "#fff",
              color: "#374151",
              textDecoration: "none",
            }}
          >
            New / Submitted
          </Link>
        </div>
      </div>
      <SubmissionsTable
        submissions={submissions}
        orgKey={orgKey}
        tenderId={tenderId}
      />
    </div>
  );
}

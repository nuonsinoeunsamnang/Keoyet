import { getSubmissionsByTender } from "@/lib/submissions";
import { getTenderById } from "@/lib/tenders";
import { getOrgByKey } from "@/lib/org";
import { SubmissionsTable } from "@/components/tables/SubmissionsTable";

export default async function SubmissionsListPage({
  params,
}: {
  params: Promise<{ orgKey: string; tenderId: string }>;
}) {
  const { orgKey, tenderId } = await params;
  const org = await getOrgByKey(orgKey);
  if (!org) return null;
  const tender = await getTenderById(tenderId, org.id);
  if (!tender) return null;
  const submissions = await getSubmissionsByTender(tenderId);

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
        <select
          aria-label="Filter submissions"
          style={{
            padding: "0.375rem 0.75rem",
            borderRadius: 6,
            border: "1px solid #d1d5db",
            fontSize: "0.875rem",
            background: "#fff",
            color: "#374151",
          }}
        >
          <option>All submissions</option>
        </select>
      </div>
      <SubmissionsTable
        submissions={submissions}
        orgKey={orgKey}
        tenderId={tenderId}
      />
    </div>
  );
}

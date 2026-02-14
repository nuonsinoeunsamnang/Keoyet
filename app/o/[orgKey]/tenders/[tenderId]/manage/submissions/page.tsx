import Link from "next/link";
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
      <h1 style={{ marginBottom: "1rem" }}>Submissions</h1>
      <SubmissionsTable
        submissions={submissions}
        orgKey={orgKey}
        tenderId={tenderId}
      />
    </div>
  );
}

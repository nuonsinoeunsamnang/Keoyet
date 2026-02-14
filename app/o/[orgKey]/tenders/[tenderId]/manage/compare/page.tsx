import Link from "next/link";
import { getTenderById } from "@/lib/tenders";
import { getOrgByKey } from "@/lib/org";
import { getComparison } from "@/lib/comparison";
import { CompareTable } from "@/components/tables/CompareTable";

export default async function ComparePage({
  params,
  searchParams,
}: {
  params: Promise<{ orgKey: string; tenderId: string }>;
  searchParams: Promise<{ include?: string }>;
}) {
  const { orgKey, tenderId } = await params;
  const { include } = await searchParams;
  const org = await getOrgByKey(orgKey);
  if (!org) return null;
  const tender = await getTenderById(tenderId, org.id);
  if (!tender) return null;
  const comparison = await getComparison(
    tenderId,
    include === "all" ? "all" : "compliant"
  );

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Compare & Award</h1>
      <p style={{ marginBottom: "1rem" }}>
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/compare/award`}
          style={{ textDecoration: "underline" }}
        >
          Award tender
        </Link>
      </p>
      <CompareTable data={comparison} />
    </div>
  );
}

import Link from "next/link";
import { getVendorsByTender } from "@/lib/vendors";
import { getTenderById } from "@/lib/tenders";
import { getOrgByKey } from "@/lib/org";
import { VendorsTable } from "@/components/tables/VendorsTable";

export default async function VendorsListPage({
  params,
}: {
  params: Promise<{ orgKey: string; tenderId: string }>;
}) {
  const { orgKey, tenderId } = await params;
  const org = await getOrgByKey(orgKey);
  if (!org) return null;
  const tender = await getTenderById(tenderId, org.id);
  if (!tender) return null;
  const vendors = await getVendorsByTender(tenderId, org.id);

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Vendors</h1>
      <VendorsTable vendors={vendors} orgKey={orgKey} tenderId={tenderId} />
    </div>
  );
}

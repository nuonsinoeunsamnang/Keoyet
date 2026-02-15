import { getTenderById } from "@/lib/tenders";
import { getOrgByKey } from "@/lib/org";
import { redirect } from "next/navigation";
import { TenderHeader } from "@/components/shell/TenderHeader";
import { ActionRequiredStrip } from "@/components/shell/ActionRequiredStrip";
import { ManageTabs } from "@/components/shell/ManageTabs";

export default async function ManageLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgKey: string; tenderId: string }>;
}) {
  const { orgKey, tenderId } = await params;
  const org = await getOrgByKey(orgKey);
  if (!org) redirect("/invalid-workspace");
  const tender = await getTenderById(tenderId, org.id);
  if (!tender) redirect("/invalid-workspace");

  return (
    <div>
      <TenderHeader tender={tender} orgKey={orgKey} />
      <ActionRequiredStrip orgKey={orgKey} tenderId={tenderId} />
      <ManageTabs orgKey={orgKey} tenderId={tenderId} />
      {children}
    </div>
  );
}

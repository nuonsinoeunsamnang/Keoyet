import { redirect } from "next/navigation";
import { getOrgByKey } from "@/lib/org";
import { theme } from "@/lib/theme";
import { Sidebar } from "@/components/shell/Sidebar";

export default async function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ orgKey: string }>;
}) {
  const { orgKey } = await params;
  const org = await getOrgByKey(orgKey);
  if (!org) redirect("/invalid-workspace");

  return (
    <div className="o-dashboard-root" style={{ display: "flex", minHeight: "100vh", width: "100%" }}>
      <Sidebar orgKey={orgKey} orgName={org.name} />
      <div className="o-dashboard-main" style={{ flex: 1, display: "flex", flexDirection: "column", background: theme.white }}>
        <main style={{ flex: 1, padding: "1.5rem", background: theme.white }}>{children}</main>
      </div>
    </div>
  );
}

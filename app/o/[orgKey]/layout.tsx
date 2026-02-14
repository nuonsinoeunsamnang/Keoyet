import { redirect } from "next/navigation";
import { getOrgByKey } from "@/lib/org";
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
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar orgKey={orgKey} orgName={org.name} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <header
          style={{
            borderBottom: "1px solid #e5e5e5",
            padding: "0.75rem 1.5rem",
            background: "var(--background)",
          }}
        >
          <span style={{ fontWeight: 600 }}>
            {org.name || `Workspace ${orgKey}`}
          </span>
        </header>
        <main style={{ flex: 1, padding: "1.5rem" }}>{children}</main>
      </div>
    </div>
  );
}

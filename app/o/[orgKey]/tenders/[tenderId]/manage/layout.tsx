import Link from "next/link";
import { getTenderById } from "@/lib/tenders";
import { getOrgByKey } from "@/lib/org";
import { redirect } from "next/navigation";
import { TenderHeader } from "@/components/shell/TenderHeader";
import { ActionRequiredStrip } from "@/components/shell/ActionRequiredStrip";

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
      <TenderHeader
        title={tender.title}
        status={tender.status}
        orgKey={orgKey}
        tenderId={tenderId}
      />
      <ActionRequiredStrip orgKey={orgKey} tenderId={tenderId} />
      <nav
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "1rem",
          borderBottom: "1px solid #e5e5e5",
          paddingBottom: "0.5rem",
        }}
      >
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions`}
          style={{ textDecoration: "underline" }}
        >
          Submissions
        </Link>
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/vendors`}
          style={{ textDecoration: "underline" }}
        >
          Vendors
        </Link>
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/compare`}
          style={{ textDecoration: "underline" }}
        >
          Compare
        </Link>
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/qa`}
          style={{ textDecoration: "underline" }}
        >
          Q&A
        </Link>
      </nav>
      {children}
    </div>
  );
}

import Link from "next/link";
import { getVendorById } from "@/lib/vendors";
import { getOrgByKey } from "@/lib/org";
import { ApproveVendorModal } from "@/components/modals/ApproveVendorModal";
import { RejectVendorModal } from "@/components/modals/RejectVendorModal";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ orgKey: string; tenderId: string; vendorId: string }>;
}) {
  const { orgKey, tenderId, vendorId } = await params;
  const org = await getOrgByKey(orgKey);
  if (!org) return null;
  const vendor = await getVendorById(vendorId, org.id);
  if (!vendor) return null;

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>{vendor.name}</h1>
      <p>Email: {vendor.contact_email ?? "—"}</p>
      <p>Phone: {vendor.contact_phone ?? "—"}</p>
      <p>Status: <strong>{vendor.status}</strong></p>
      <p style={{ marginTop: "1rem" }}>
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/vendors`}
          style={{ textDecoration: "underline" }}
        >
          Back to vendors
        </Link>
      </p>
      {vendor.status === "pending" && (
        <div style={{ marginTop: "1rem", display: "flex", gap: 8 }}>
          <ApproveVendorModal orgKey={orgKey} vendorId={vendorId} />
          <RejectVendorModal orgKey={orgKey} vendorId={vendorId} />
        </div>
      )}
    </div>
  );
}

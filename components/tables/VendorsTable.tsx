"use client";

import Link from "next/link";

type Vendor = {
  id: string;
  name: string;
  contact_email: string | null;
  status: string;
};

export function VendorsTable({
  vendors,
  orgKey,
  tenderId,
}: {
  vendors: Vendor[];
  orgKey: string;
  tenderId: string;
}) {
  if (vendors.length === 0) {
    return <p style={{ color: "var(--foreground)" }}>No vendors yet.</p>;
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Name</th>
          <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Contact</th>
          <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Status</th>
          <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }} />
        </tr>
      </thead>
      <tbody>
        {vendors.map((v) => (
          <tr key={v.id}>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
              {v.name}
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
              {v.contact_email ?? "—"}
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
              {v.status}
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
              <Link
                href={`/o/${orgKey}/tenders/${tenderId}/manage/vendors/${v.id}`}
                style={{ textDecoration: "underline" }}
              >
                Review
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

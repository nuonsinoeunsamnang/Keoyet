"use client";

import Link from "next/link";

type Submission = {
  id: string;
  status: string;
  submitted_at: string | null;
  vendors: { name: string } | null;
};

export function SubmissionsTable({
  submissions,
  orgKey,
  tenderId,
}: {
  submissions: Submission[];
  orgKey: string;
  tenderId: string;
}) {
  if (submissions.length === 0) {
    return (
      <p style={{ color: "var(--foreground)" }}>
        No submissions yet.
      </p>
    );
  }
  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Vendor</th>
          <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Status</th>
          <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Submitted</th>
          <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }} />
        </tr>
      </thead>
      <tbody>
        {submissions.map((s) => (
          <tr key={s.id}>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
              {s.vendors?.name ?? "—"}
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
              {s.status}
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
              {s.submitted_at
                ? new Date(s.submitted_at).toLocaleDateString()
                : "—"}
            </td>
            <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
              <Link
                href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions/${s.id}`}
                style={{ textDecoration: "underline" }}
              >
                View
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

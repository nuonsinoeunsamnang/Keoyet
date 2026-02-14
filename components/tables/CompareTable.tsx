"use client";

import type { ComparisonResult } from "@/lib/comparison";

export function CompareTable({ data }: { data: ComparisonResult }) {
  const { rows, submissionIds, vendorNames, totals } = data;
  const headers = rows[0]?.submissions.map((s) => s.vendor_name) ?? [];

  if (rows.length === 0 && submissionIds.length === 0) {
    return (
      <p style={{ color: "var(--foreground)" }}>
        No submissions to compare yet.
      </p>
    );
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
              Item
            </th>
            <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
              Unit
            </th>
            {headers.map((h, i) => (
              <th
                key={i}
                style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.tender_item_id}>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
                {row.description}
              </td>
              <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>
                {row.unit ?? "—"}
              </td>
              {row.submissions.map((cell, j) => (
                <td
                  key={j}
                  style={{ textAlign: "right", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}
                >
                  {cell.unit_price != null
                    ? Number(cell.unit_price).toLocaleString()
                    : "—"}
                  {cell.total != null && (
                    <span style={{ display: "block", fontSize: "0.875rem" }}>
                      ({Number(cell.total).toLocaleString()})
                    </span>
                  )}
                </td>
              ))}
            </tr>
          ))}
          {submissionIds.length > 0 && (
            <tr>
              <td
                colSpan={2}
                style={{
                  padding: "0.5rem",
                  borderBottom: "1px solid #e5e5e5",
                  fontWeight: 600,
                }}
              >
                Total
              </td>
              {submissionIds.map((id) => (
                <td
                  key={id}
                  style={{
                    textAlign: "right",
                    padding: "0.5rem",
                    borderBottom: "1px solid #e5e5e5",
                    fontWeight: 600,
                  }}
                >
                  {Number(totals[id] ?? 0).toLocaleString()}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import Link from "next/link";
import { theme } from "@/lib/theme";

type Submission = {
  id: string;
  status: string;
  submitted_at: string | null;
  compliance?: unknown;
  vendors: {
    name: string;
    status?: string;
  } | null;
};

const STATUS_STYLE: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  submitted: {
    bg: theme.blueLighter,
    text: theme.blueText,
    border: theme.blueBorder,
  },
  under_review: {
    bg: theme.greenLighter,
    text: theme.greenText,
    border: theme.greenBorder,
  },
  draft: {
    bg: theme.amberLight,
    text: theme.amberText,
    border: theme.orangeBorder,
  },
  needs_info: {
    bg: theme.amberLight,
    text: theme.amberText,
    border: theme.orangeBorder,
  },
  awarded: {
    bg: theme.greenLighter,
    text: theme.greenText,
    border: theme.greenBorder,
  },
  rejected: {
    bg: theme.redLight,
    text: theme.redText,
    border: "#fecaca",
  },
};

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under review",
  draft: "Draft",
  needs_info: "Needs info",
  awarded: "Awarded",
  rejected: "Rejected",
};

function formatSubmitted(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function documentSummary(compliance: unknown): string {
  if (compliance == null) return "—";
  const c = compliance as { required?: number; completed?: number };
  if (
    typeof c.required === "number" &&
    typeof c.completed === "number"
  ) {
    return `${c.completed}/${c.required} complete`;
  }
  return "—";
}

export function SubmissionsTable({
  submissions,
  orgKey,
  tenderId,
}: {
  submissions: Submission[];
  orgKey: string;
  tenderId: string;
}) {
  const thStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "0.75rem 1rem",
    fontWeight: 600,
    color: theme.grayMuted,
    textTransform: "uppercase",
    letterSpacing: "0.025em",
    fontSize: "0.75rem",
    borderBottom: `1px solid ${theme.grayBorder}`,
  };
  const tdStyle: React.CSSProperties = {
    padding: "0.75rem 1rem",
    borderBottom: `1px solid ${theme.grayBorder}`,
    fontSize: "0.875rem",
    color: "#374151",
  };

  if (submissions.length === 0) {
    return (
      <p style={{ color: theme.grayMuted, fontSize: "0.9375rem" }}>
        No submissions yet.
      </p>
    );
  }

  return (
    <div
      style={{
        border: `1px solid ${theme.grayBorder}`,
        borderRadius: 8,
        overflow: "hidden",
        background: theme.white,
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: theme.grayBg }}>
            <th style={thStyle}>Vendor</th>
            <th style={thStyle}>Submitted</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Documents</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((s) => {
            const style = STATUS_STYLE[s.status] ?? {
              bg: theme.grayBadgeBg,
              text: theme.grayBadgeText,
              border: theme.grayBorder,
            };
            const label =
              STATUS_LABEL[s.status] ??
              s.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
            const isVerified = s.vendors?.status === "approved";
            return (
              <tr key={s.id} style={{ background: theme.white }}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 500 }}>{s.vendors?.name ?? "—"}</div>
                  <div
                    style={{
                      fontSize: "0.8125rem",
                      color: theme.grayMuted,
                      marginTop: "0.125rem",
                    }}
                  >
                    {isVerified ? "Verified vendor" : "Pending verification"}
                  </div>
                </td>
                <td style={tdStyle}>{formatSubmitted(s.submitted_at)}</td>
                <td style={tdStyle}>
                  <span
                    style={{
                      display: "inline-flex",
                      padding: "0.25rem 0.5rem",
                      borderRadius: 9999,
                      fontSize: "0.75rem",
                      fontWeight: 500,
                      background: style.bg,
                      color: style.text,
                      border: `1px solid ${style.border}`,
                    }}
                  >
                    {label}
                  </span>
                </td>
                <td style={tdStyle}>
                  {documentSummary(s.compliance)}
                  {documentSummary(s.compliance) !== "—" && (
                    <span
                      style={{
                        marginLeft: "0.25rem",
                        color:
                          (s.compliance as { completed?: number; required?: number })
                            ?.completed ===
                          (s.compliance as { required?: number })?.required
                            ? theme.green
                            : theme.amber,
                      }}
                      aria-hidden
                    >
                      {(s.compliance as { completed?: number; required?: number })
                        ?.completed ===
                      (s.compliance as { required?: number })?.required
                        ? "✓"
                        : "!"}
                    </span>
                  )}
                </td>
                <td style={tdStyle}>
                  <Link
                    href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions/${s.id}`}
                    style={{
                      color: theme.blue,
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    Open submission
                  </Link>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

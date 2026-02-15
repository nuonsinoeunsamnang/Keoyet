"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { theme } from "@/lib/theme";
import type { TenderWithMeta } from "@/lib/dashboard";
import type { TenderDisplayStatus } from "@/lib/dashboard";

const STATUS_OPTIONS: { value: TenderDisplayStatus | "all"; label: string }[] = [
  { value: "all", label: "All Status" },
  { value: "draft", label: "Draft" },
  { value: "published", label: "Published" },
  { value: "submission_closed", label: "Submission Closed" },
  { value: "evaluation", label: "Evaluation" },
  { value: "awarded", label: "Awarded" },
];

const STATUS_LABEL: Record<TenderDisplayStatus, string> = {
  draft: "Draft",
  published: "Published",
  submission_closed: "Submission Closed",
  evaluation: "Evaluation",
  awarded: "Awarded",
};

const STATUS_PILL_STYLE: Record<
  TenderDisplayStatus,
  { dot: string; text: string; bg: string; border: string }
> = {
  draft: {
    dot: theme.grayMuted,
    text: theme.grayBadgeText,
    bg: theme.grayBadgeBg,
    border: theme.grayBorder,
  },
  published: {
    dot: theme.green,
    text: theme.greenText,
    bg: theme.greenLighter,
    border: theme.greenBorder,
  },
  submission_closed: {
    dot: theme.amber,
    text: theme.amberText,
    bg: theme.amberLight,
    border: theme.orangeBorder,
  },
  evaluation: {
    dot: theme.purple,
    text: theme.purple,
    bg: theme.purpleLight,
    border: "#c4b5fd",
  },
  awarded: {
    dot: theme.blue,
    text: theme.blueText,
    bg: theme.blueLighter,
    border: theme.blueBorder,
  },
};

function StatusPill({ status }: { status: TenderDisplayStatus }) {
  const s = STATUS_PILL_STYLE[status];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.25rem 0.5rem",
        borderRadius: 9999,
        fontSize: "0.75rem",
        fontWeight: 500,
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          flexShrink: 0,
        }}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TenderListTable({
  tenders,
  orgKey,
}: {
  tenders: TenderWithMeta[];
  orgKey: string;
}) {
  const [statusFilter, setStatusFilter] = useState<TenderDisplayStatus | "all">(
    "all"
  );

  const filtered = useMemo(() => {
    if (statusFilter === "all") return tenders;
    return tenders.filter((t) => t.displayStatus === statusFilter);
  }, [tenders, statusFilter]);

  const manageHref = (t: TenderWithMeta) =>
    `/o/${orgKey}/tenders/${t.id}/manage`;

  const tableHeaderStyle: React.CSSProperties = {
    textAlign: "left",
    padding: "0.75rem 1rem",
    fontWeight: 600,
    color: theme.grayMuted,
    textTransform: "uppercase",
    letterSpacing: "0.025em",
    fontSize: "0.75rem",
  };

  const rowBg = theme.white;
  const primaryText = "#374151";
  const secondaryText = theme.grayMuted;

  return (
    <div
      style={{
        border: `1px solid ${theme.grayBorder}`,
        borderRadius: 8,
        overflow: "hidden",
        background: rowBg,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          padding: "0.5rem 1rem",
          borderBottom: `1px solid ${theme.grayBorder}`,
          background: theme.grayBg,
        }}
      >
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as TenderDisplayStatus | "all")
          }
          style={{
            padding: "0.375rem 0.75rem",
            borderRadius: 6,
            border: `1px solid ${theme.grayInputBorder}`,
            fontSize: "0.875rem",
            background: theme.white,
            color: primaryText,
            cursor: "pointer",
          }}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.875rem",
          }}
        >
          <thead>
            <tr style={{ background: theme.grayBg }}>
              <th style={tableHeaderStyle}>Tender title & ID</th>
              <th style={tableHeaderStyle}>Status</th>
              <th style={tableHeaderStyle}>Next deadline</th>
              <th style={tableHeaderStyle}>Pending work</th>
              <th style={tableHeaderStyle}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr style={{ background: rowBg }}>
                <td
                  colSpan={5}
                  style={{
                    padding: "2rem 1rem",
                    textAlign: "center",
                    color: secondaryText,
                    fontSize: "0.9375rem",
                  }}
                >
                  {statusFilter === "all" && tenders.length === 0 ? (
                    <>
                      No tenders yet. Use &ldquo;+ Create Tender&rdquo; to add one.
                      If you just created a tender, click Refresh above.
                    </>
                  ) : (
                    "No tenders match the selected filter."
                  )}
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr
                  key={t.id}
                  style={{
                    borderTop: `1px solid ${theme.grayBorder}`,
                    background: rowBg,
                  }}
                >
                  <td style={{ padding: "0.75rem 1rem", color: primaryText }}>
                    <div style={{ fontWeight: 500, color: primaryText }}>
                      {t.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: secondaryText,
                        marginTop: "0.125rem",
                      }}
                    >
                      {t.tenderNumber}
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <StatusPill status={t.displayStatus} />
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: primaryText }}>
                    <div style={{ color: primaryText }}>
                      {formatDate(t.nextDeadlineDate)}
                    </div>
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: secondaryText,
                        marginTop: "0.125rem",
                      }}
                    >
                      {t.nextDeadlineLabel}
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem", color: primaryText }}>
                    {t.pendingWork > 0 ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          padding: "0.2rem 0.5rem",
                          borderRadius: 9999,
                          fontSize: "0.75rem",
                          fontWeight: 500,
                          background: theme.amberLight,
                          color: theme.amberText,
                        }}
                      >
                        Pending: {t.pendingWork}
                      </span>
                    ) : (
                      <span style={{ color: secondaryText }}>Pending: 0</span>
                    )}
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <Link
                      href={manageHref(t)}
                      style={{
                        color: theme.blue,
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      Open
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
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

const STATUS_VARIANT: Record<
  TenderDisplayStatus,
  "default" | "success" | "warning" | "info" | "purple"
> = {
  draft: "default",
  published: "success",
  submission_closed: "warning",
  evaluation: "purple",
  awarded: "info",
};

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

  const manageHref = (t: TenderWithMeta) => {
    if (t.status === "draft")
      return `/o/${orgKey}/tenders/${t.id}/setup/step-1`;
    return `/o/${orgKey}/tenders/${t.id}/manage/submissions`;
  };

  return (
    <div
      style={{
        border: `1px solid ${theme.grayBorder}`,
        borderRadius: 8,
        overflow: "hidden",
        background: "var(--background)",
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
            border: `1px solid ${theme.grayBorder}`,
            fontSize: "0.875rem",
            background: theme.white,
            color: "var(--foreground)",
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
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  fontWeight: 600,
                  color: theme.grayMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                  fontSize: "0.75rem",
                }}
              >
                Tender title & ID
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  fontWeight: 600,
                  color: theme.grayMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                  fontSize: "0.75rem",
                }}
              >
                Status
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  fontWeight: 600,
                  color: theme.grayMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                  fontSize: "0.75rem",
                }}
              >
                Next deadline
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  fontWeight: 600,
                  color: theme.grayMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                  fontSize: "0.75rem",
                }}
              >
                Pending work
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "0.75rem 1rem",
                  fontWeight: 600,
                  color: theme.grayMuted,
                  textTransform: "uppercase",
                  letterSpacing: "0.025em",
                  fontSize: "0.75rem",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    padding: "2rem 1rem",
                    textAlign: "center",
                    color: theme.grayMuted,
                  }}
                >
                  No tenders match the selected filter.
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr
                  key={t.id}
                  style={{
                    borderTop: `1px solid ${theme.grayBorder}`,
                  }}
                >
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div style={{ fontWeight: 500 }}>{t.title}</div>
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: theme.grayMuted,
                        marginTop: "0.125rem",
                      }}
                    >
                      {t.tenderNumber}
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <Badge variant={STATUS_VARIANT[t.displayStatus]}>
                      {STATUS_LABEL[t.displayStatus]}
                    </Badge>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    <div>{formatDate(t.nextDeadlineDate)}</div>
                    <div
                      style={{
                        fontSize: "0.8125rem",
                        color: theme.grayMuted,
                        marginTop: "0.125rem",
                      }}
                    >
                      {t.nextDeadlineLabel}
                    </div>
                  </td>
                  <td style={{ padding: "0.75rem 1rem" }}>
                    {t.pendingWork > 0 ? (
                      <Badge
                        variant={
                          t.pendingWork <= 3 ? "warning" : "info"
                        }
                      >
                        Pending: {t.pendingWork}
                      </Badge>
                    ) : (
                      <span style={{ color: theme.grayMuted }}>Pending: 0</span>
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

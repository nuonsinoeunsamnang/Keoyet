"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useRef, useEffect } from "react";
import { theme } from "@/lib/theme";
import { CopySubmissionLinkButton } from "@/components/shell/CopySubmissionLinkButton";
import { ConfirmModal } from "@/components/modals/ConfirmModal";
import { MessageModal } from "@/components/modals/MessageModal";
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
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<TenderDisplayStatus | "all">(
    "all"
  );
  const [openMenuTenderId, setOpenMenuTenderId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openMenuTenderId === null) return;
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuTenderId(null);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openMenuTenderId]);

  function openDeleteConfirm(t: TenderWithMeta) {
    if (t.submissionCount > 0) return;
    setOpenMenuTenderId(null);
    setConfirmDeleteId(t.id);
  }

  async function confirmDelete() {
    if (!confirmDeleteId) return;
    setDeletingId(confirmDeleteId);
    try {
      const res = await fetch(`/api/o/${orgKey}/tenders/${confirmDeleteId}`, {
        method: "DELETE",
      });
      if (res.status === 204) {
        setConfirmDeleteId(null);
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setConfirmDeleteId(null);
      setErrorMessage(data.error ?? "Failed to delete draft.");
    } finally {
      setDeletingId(null);
    }
  }

  const filtered = useMemo(() => {
    if (statusFilter === "all") return tenders;
    return tenders.filter((t) => t.displayStatus === statusFilter);
  }, [tenders, statusFilter]);

  const openHref = (t: TenderWithMeta) =>
    t.displayStatus === "draft"
      ? `/o/${orgKey}/tenders/${t.id}/setup/step-1`
      : `/o/${orgKey}/tenders/${t.id}/manage/submissions`;
  const showCopyLink = (t: TenderWithMeta) =>
    t.displayStatus === "published" && t.accept_online_submissions === true;

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
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.75rem",
                      }}
                    >
                      {t.displayStatus === "draft" ? (
                        <div
                          ref={openMenuTenderId === t.id ? menuRef : undefined}
                          style={{ position: "relative" }}
                        >
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenMenuTenderId((id) =>
                                id === t.id ? null : t.id
                              );
                            }}
                            aria-expanded={openMenuTenderId === t.id}
                            aria-haspopup="true"
                            style={{
                              padding: "0.25rem",
                              border: "none",
                              background: "transparent",
                              color: secondaryText,
                              cursor: "pointer",
                              fontSize: "1.25rem",
                              lineHeight: 1,
                            }}
                          >
                            ⋯
                          </button>
                          {openMenuTenderId === t.id && (
                            <div
                              style={{
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                marginTop: "0.25rem",
                                minWidth: "11rem",
                                background: theme.white,
                                border: `1px solid ${theme.grayBorder}`,
                                borderRadius: 6,
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                zIndex: 10,
                                padding: "0.25rem 0",
                              }}
                            >
                              <Link
                                href={`/o/${orgKey}/tenders/${t.id}/setup/step-1`}
                                style={{
                                  display: "block",
                                  padding: "0.5rem 0.75rem",
                                  color: primaryText,
                                  textDecoration: "none",
                                  fontSize: "0.875rem",
                                }}
                                onClick={() => setOpenMenuTenderId(null)}
                              >
                                Continue setup
                              </Link>
                              {t.submissionCount > 0 ? (
                                <div
                                  style={{
                                    padding: "0.5rem 0.75rem",
                                    fontSize: "0.8125rem",
                                    color: secondaryText,
                                    borderTop: `1px solid ${theme.grayBorder}`,
                                  }}
                                  title="Cannot delete — submissions already received."
                                >
                                  Cannot delete — submissions already received.
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  disabled={deletingId === t.id}
                                  onClick={() => openDeleteConfirm(t)}
                                  style={{
                                    display: "block",
                                    width: "100%",
                                    padding: "0.5rem 0.75rem",
                                    border: "none",
                                    background: "transparent",
                                    color: "#b91c1c",
                                    fontSize: "0.875rem",
                                    textAlign: "left",
                                    cursor:
                                      deletingId === t.id
                                        ? "wait"
                                        : "pointer",
                                  }}
                                >
                                  {deletingId === t.id
                                    ? "Deleting…"
                                    : "Delete draft"}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ) : (
                        <>
                          <Link
                            href={openHref(t)}
                            style={{
                              color: theme.blue,
                              textDecoration: "none",
                              fontWeight: 500,
                            }}
                          >
                            Open
                          </Link>
                          {showCopyLink(t) && (
                            <CopySubmissionLinkButton slug={t.slug} />
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ConfirmModal
        open={confirmDeleteId !== null}
        onClose={() => setConfirmDeleteId(null)}
        onConfirm={confirmDelete}
        title="Delete draft?"
        message="This can't be undone."
        confirmLabel="Delete draft"
        cancelLabel="Cancel"
        loading={deletingId !== null}
        variant="danger"
      />

      <MessageModal
        open={errorMessage !== null}
        onClose={() => setErrorMessage(null)}
        title="Could not delete"
        message={errorMessage ?? ""}
      />
    </div>
  );
}

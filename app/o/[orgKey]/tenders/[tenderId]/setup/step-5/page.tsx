"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const steps = [
  { num: 1, label: "Basics", path: "step-1" },
  { num: 2, label: "Timeline", path: "step-2" },
  { num: 3, label: "Items", path: "step-3" },
  { num: 4, label: "Documents", path: "step-4" },
  { num: 5, label: "Review", path: "step-5" },
];

const REJECTION_CRITERIA_LABELS: Record<string, string> = {
  missing_required_docs: "Missing required documents",
  after_deadline: "Submitted after submission deadline",
  vendor_not_verified: "Vendor not verified",
};

function formatDateTime(iso: string | null): string {
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

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

type Tender = {
  id: string;
  slug: string;
  title: string;
  status: string;
  description: string | null;
  reference_id: string | null;
  category: string | null;
  delivery_location: string | null;
  publish_at: string | null;
  questions_deadline: string | null;
  submission_deadline: string | null;
  accept_online_submissions?: boolean;
  accept_physical_submissions?: boolean;
  rejection_criteria: Record<string, boolean> | null;
  only_verified_vendors: boolean;
};

type TenderItem = {
  id: string;
  sort_order: number;
  description: string;
  quantity: number;
  unit: string | null;
};

type RequiredDoc = { id: string; name: string; sort_order: number };

const OVERVIEW_TRUNCATE = 120;
const ITEMS_PREVIEW = 3;

export default function SetupStep5Page() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const base = `/o/${orgKey}/tenders/${tenderId}/setup`;

  const [tender, setTender] = useState<Tender | null>(null);
  const [items, setItems] = useState<TenderItem[]>([]);
  const [requiredDocs, setRequiredDocs] = useState<RequiredDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [overviewExpanded, setOverviewExpanded] = useState(false);

  const load = useCallback(async () => {
    const [tRes, iRes, dRes] = await Promise.all([
      fetch(`/api/o/${orgKey}/tenders/${tenderId}`),
      fetch(`/api/o/${orgKey}/tenders/${tenderId}/items`),
      fetch(`/api/o/${orgKey}/tenders/${tenderId}/required-docs`),
    ]);
    if (tRes.ok) {
      const t = await tRes.json();
      setTender(t);
    }
    if (iRes.ok) {
      const data = await iRes.json();
      setItems((data.items ?? []).sort((a: TenderItem, b: TenderItem) => a.sort_order - b.sort_order));
    }
    if (dRes.ok) {
      const data = await dRes.json();
      setRequiredDocs((data.docs ?? []).sort((a: RequiredDoc, b: RequiredDoc) => a.sort_order - b.sort_order));
    }
    setLoading(false);
  }, [orgKey, tenderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveDraft() {
    // Review step is read-only; Save Draft is a no-op or could re-sync. Kept for UX consistency.
    router.push(`/o/${orgKey}/tenders`);
  }

  async function handlePublish() {
    setPublishError(null);
    setPublishing(true);
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}/publish`, { method: "POST" });
    setPublishing(false);
    if (res.ok) {
      router.push(`/o/${orgKey}/tenders/${tenderId}/manage/submissions`);
    } else {
      const err = await res.json().catch(() => ({}));
      setPublishError(err?.error ?? "Failed to publish. Please try again.");
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: theme.grayMuted }}>
        Loading…
      </div>
    );
  }

  if (!tender) {
    return (
      <div style={{ padding: "2rem" }}>
        Tender not found.
      </div>
    );
  }

  const overviewText = tender.description?.trim() ?? "";
  const overviewShort =
    overviewText.length <= OVERVIEW_TRUNCATE || overviewExpanded
      ? overviewText
      : overviewText.slice(0, OVERVIEW_TRUNCATE) + "...";
  const showViewMore = overviewText.length > OVERVIEW_TRUNCATE && !overviewExpanded;

  const rejectionCriteria = tender.rejection_criteria ?? {};
  const activeRejectionKeys = (Object.keys(REJECTION_CRITERIA_LABELS) as string[]).filter(
    (key) => rejectionCriteria[key] === true
  );

  const basicsOk = !!(tender.title?.trim() && tender.reference_id?.trim());
  const timelineOk = !!(tender.publish_at && tender.questions_deadline && tender.submission_deadline);
  const itemsOk = items.length > 0;
  const docsOk = requiredDocs.length > 0;
  const onlineOk = tender.accept_online_submissions === true;
  const readyCount = [basicsOk, timelineOk, itemsOk, docsOk, onlineOk].filter(Boolean).length;

  const previewItems = items.slice(0, ITEMS_PREVIEW);
  const moreItemsCount = items.length - ITEMS_PREVIEW;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: "4rem" }}>
      <nav
        style={{
          fontSize: "0.875rem",
          color: theme.grayMuted,
          marginBottom: "0.5rem",
        }}
      >
        <Link
          href={`/o/${orgKey}`}
          style={{ color: theme.grayMuted, textDecoration: "none" }}
        >
          Dashboard
        </Link>
        <span style={{ margin: "0 0.375rem" }}>/</span>
        <span style={{ color: "var(--foreground)" }}>Create Tender</span>
      </nav>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1 style={{ margin: 0, marginBottom: "0.25rem", fontSize: "1.5rem", fontWeight: 700 }}>
            Create Tender
          </h1>
          <p style={{ margin: 0, fontSize: "0.9375rem", color: theme.grayMuted }}>
            Review your tender and publish to make it visible to vendors.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button
            type="button"
            onClick={() => router.push(`${base}/step-4`)}
            style={{
              background: theme.white,
              border: `1px solid ${theme.grayInputBorder}`,
              borderRadius: 6,
              color: "#374151",
            }}
          >
            ← Back
          </Button>
          <Button
            type="button"
            onClick={() => router.push(`/o/${orgKey}/tenders`)}
            style={{
              background: theme.white,
              border: `1px solid ${theme.grayInputBorder}`,
              borderRadius: 6,
              color: "#374151",
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={saveDraft}
            style={{
              background: theme.blueBorder,
              color: theme.blue,
              border: `1px solid ${theme.blue}`,
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            Save Draft
          </Button>
          <Button
            type="button"
            onClick={handlePublish}
            disabled={publishing || tender.status === "published"}
            style={{
              background: theme.blue,
              color: theme.white,
              border: "none",
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            {publishing ? "Publishing…" : "Publish Tender"}
          </Button>
        </div>
      </div>
      {publishError && (
        <p style={{ margin: 0, marginBottom: "1rem", color: "#b91c1c", fontSize: "0.875rem" }}>
          {publishError}
        </p>
      )}

      {/* Tender pill + ref + status */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
        }}
      >
        <span
          style={{
            padding: "0.25rem 0.5rem",
            borderRadius: 8,
            background: theme.blueLight,
            border: `1px solid ${theme.blueBorder}`,
            fontSize: "0.9375rem",
            fontWeight: 500,
            color: theme.blueTitle,
          }}
        >
          {tender.title || "Untitled Tender"}
        </span>
        <span style={{ fontSize: "0.9375rem", color: theme.grayMuted }}>
          {tender.reference_id || "—"}
        </span>
        <span
          style={{
            padding: "0.25rem 0.5rem",
            borderRadius: 9999,
            fontSize: "0.75rem",
            fontWeight: 500,
            background: theme.grayBadgeBg,
            color: theme.grayBadgeText,
          }}
        >
          {tender.status === "published" ? "Published" : "Draft"}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        {steps.map((s) => {
          const isCurrent = s.path === "step-5";
          const isComplete = s.num < 5;
          return (
            <div
              key={s.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.875rem",
                color: isCurrent ? "#0a0a0a" : theme.grayMuted,
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: isComplete ? theme.green : isCurrent ? theme.blue : theme.grayInputBorder,
                  color: isComplete || isCurrent ? theme.white : "#374151",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                }}
              >
                {isComplete ? "✓" : s.num}
              </span>
              <span>{s.label}</span>
              {s.num < 5 && (
                <span
                  style={{
                    width: 20,
                    height: 1,
                    background: theme.grayInputBorder,
                    marginLeft: "0.25rem",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Tender Overview */}
      <Card
        style={{
          marginBottom: "1.25rem",
          padding: "1.25rem",
          border: `1px solid ${theme.grayInputBorder}`,
          background: theme.white,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ margin: 0, marginBottom: "1rem", fontSize: "1rem", fontWeight: 600, color: "#0a0a0a" }}>
          Tender Overview
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9375rem" }}>
          <div>
            <span style={{ color: theme.grayMuted, display: "block", fontSize: "0.8125rem" }}>Tender Title</span>
            <span style={{ fontWeight: 500 }}>{tender.title || "—"}</span>
          </div>
          <div>
            <span style={{ color: theme.grayMuted, display: "block", fontSize: "0.8125rem" }}>Category</span>
            <span>{tender.category || "—"}</span>
          </div>
          <div>
            <span style={{ color: theme.grayMuted, display: "block", fontSize: "0.8125rem" }}>Overview (English)</span>
            <span style={{ whiteSpace: "pre-wrap" }}>{overviewShort || "Not provided"}</span>
            {showViewMore && (
              <button
                type="button"
                onClick={() => setOverviewExpanded(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: theme.blue,
                  cursor: "pointer",
                  fontSize: "0.875rem",
                  padding: 0,
                  marginTop: "0.25rem",
                  textDecoration: "underline",
                }}
              >
                View more
              </button>
            )}
          </div>
          <div>
            <span style={{ color: theme.grayMuted, display: "block", fontSize: "0.8125rem" }}>Overview (Khmer)</span>
            <span>Not provided</span>
          </div>
          <div>
            <span style={{ color: theme.grayMuted, display: "block", fontSize: "0.8125rem" }}>Reference ID</span>
            <span>{tender.reference_id || "—"}</span>
          </div>
          <div>
            <span style={{ color: theme.grayMuted, display: "block", fontSize: "0.8125rem" }}>Location</span>
            <span>{tender.delivery_location || "—"}</span>
          </div>
        </div>
      </Card>

      {/* Timeline */}
      <Card
        style={{
          marginBottom: "1.25rem",
          padding: "1.25rem",
          border: `1px solid ${theme.grayInputBorder}`,
          background: theme.white,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ margin: 0, marginBottom: "1rem", fontSize: "1rem", fontWeight: 600, color: "#0a0a0a" }}>
          Timeline
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9375rem" }}>
          <div>
            <span style={{ color: theme.grayMuted, display: "block", fontSize: "0.8125rem" }}>Publish Date</span>
            <span>{formatDateTime(tender.publish_at)}</span>
          </div>
          <div>
            <span style={{ color: theme.grayMuted, display: "block", fontSize: "0.8125rem" }}>Questions Deadline</span>
            <span>{formatDateTime(tender.questions_deadline)}</span>
          </div>
          <div>
            <span style={{ color: theme.grayMuted, display: "block", fontSize: "0.8125rem" }}>Submission Deadline</span>
            <span>{formatDateTime(tender.submission_deadline)}</span>
          </div>
        </div>
      </Card>

      {/* Submission Method */}
      <Card
        style={{
          marginBottom: "1.25rem",
          padding: "1.25rem",
          border: `1px solid ${theme.grayInputBorder}`,
          background: theme.white,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ margin: 0, marginBottom: "1rem", fontSize: "1rem", fontWeight: 600, color: "#0a0a0a" }}>
          Submission Method
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.9375rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {tender.accept_online_submissions ? (
              <span style={{ color: theme.green }}><CheckIcon /></span>
            ) : (
              <span style={{ color: theme.grayMuted }}><XIcon /></span>
            )}
            <span>
              Online submissions {tender.accept_online_submissions ? "enabled" : "disabled"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {tender.accept_physical_submissions ? (
              <span style={{ color: theme.green }}><CheckIcon /></span>
            ) : (
              <span style={{ color: theme.grayMuted }}><XIcon /></span>
            )}
            <span>
              Physical submissions {tender.accept_physical_submissions ? "enabled" : "disabled"}
            </span>
          </div>
        </div>
      </Card>

      {/* Items */}
      <Card
        style={{
          marginBottom: "1.25rem",
          padding: "1.25rem",
          border: `1px solid ${theme.grayInputBorder}`,
          background: theme.white,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 600, color: "#0a0a0a" }}>
            {items.length} items
          </h2>
          <Link
            href={`${base}/step-3`}
            style={{ fontSize: "0.875rem", color: theme.blue, textDecoration: "none", fontWeight: 500 }}
          >
            Edit items
          </Link>
        </div>
        {items.length > 0 ? (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9375rem" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", borderBottom: `1px solid ${theme.grayInputBorder}`, fontWeight: 600, color: "#374151" }}>
                    Item No.
                  </th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", borderBottom: `1px solid ${theme.grayInputBorder}`, fontWeight: 600, color: "#374151" }}>
                    Description
                  </th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", borderBottom: `1px solid ${theme.grayInputBorder}`, fontWeight: 600, color: "#374151" }}>
                    Unit
                  </th>
                  <th style={{ textAlign: "left", padding: "0.5rem 0.75rem", borderBottom: `1px solid ${theme.grayInputBorder}`, fontWeight: 600, color: "#374151" }}>
                    Qty
                  </th>
                </tr>
              </thead>
              <tbody>
                {previewItems.map((item, i) => (
                  <tr key={item.id}>
                    <td style={{ padding: "0.5rem 0.75rem", borderBottom: `1px solid ${theme.grayBorder}` }}>{i + 1}</td>
                    <td style={{ padding: "0.5rem 0.75rem", borderBottom: `1px solid ${theme.grayBorder}` }}>{item.description}</td>
                    <td style={{ padding: "0.5rem 0.75rem", borderBottom: `1px solid ${theme.grayBorder}` }}>{item.unit || "—"}</td>
                    <td style={{ padding: "0.5rem 0.75rem", borderBottom: `1px solid ${theme.grayBorder}` }}>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {moreItemsCount > 0 && (
              <p style={{ margin: "0.5rem 0 0", fontSize: "0.875rem", color: theme.grayMuted }}>
                + {moreItemsCount} more items
              </p>
            )}
          </>
        ) : (
          <p style={{ margin: 0, fontSize: "0.9375rem", color: theme.grayMuted }}>No items added.</p>
        )}
      </Card>

      {/* Documents & Compliance */}
      <Card
        style={{
          marginBottom: "1.25rem",
          padding: "1.25rem",
          border: `1px solid ${theme.grayInputBorder}`,
          background: theme.white,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ margin: 0, marginBottom: "1rem", fontSize: "1rem", fontWeight: 600, color: "#0a0a0a" }}>
          Documents & Compliance
        </h2>
        <div style={{ marginBottom: "1rem" }}>
          <span style={{ color: theme.grayMuted, fontSize: "0.8125rem", display: "block", marginBottom: "0.5rem" }}>
            Required Documents ({requiredDocs.length})
          </span>
          {requiredDocs.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9375rem" }}>
              {requiredDocs.map((doc) => (
                <li key={doc.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ color: theme.grayMuted }}><DocumentIcon /></span>
                  {doc.name}
                </li>
              ))}
            </ul>
          ) : (
            <span style={{ fontSize: "0.9375rem", color: theme.grayMuted }}>None selected.</span>
          )}
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <span style={{ color: theme.grayMuted, fontSize: "0.8125rem", display: "block", marginBottom: "0.5rem" }}>
            Rejection Criteria
          </span>
          {activeRejectionKeys.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9375rem" }}>
              {activeRejectionKeys.map((key) => (
                <li key={key} style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ color: theme.redText }}><XIcon /></span>
                  {REJECTION_CRITERIA_LABELS[key]}
                </li>
              ))}
            </ul>
          ) : (
            <span style={{ fontSize: "0.9375rem", color: theme.grayMuted }}>None selected.</span>
          )}
        </div>
        <div>
          <span style={{ color: theme.grayMuted, fontSize: "0.8125rem", display: "block", marginBottom: "0.25rem" }}>
            Vendor Verification Policy
          </span>
          <span style={{ fontSize: "0.9375rem" }}>
            {tender.only_verified_vendors
              ? "Only verified vendors can submit"
              : "Allow any registered vendor to submit"}
          </span>
        </div>
      </Card>

      {/* Ready to publish? */}
      <Card
        style={{
          marginBottom: "1.25rem",
          padding: "1.25rem",
          border: `1px solid ${theme.grayInputBorder}`,
          background: theme.white,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ margin: 0, marginBottom: "1rem", fontSize: "1rem", fontWeight: 600, color: "#0a0a0a" }}>
          Ready to publish?
        </h2>
        <ul style={{ margin: 0, paddingLeft: "1.25rem", fontSize: "0.9375rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: basicsOk ? theme.green : theme.grayMuted }}><CheckIcon /></span>
            Basics completed
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: timelineOk ? theme.green : theme.grayMuted }}><CheckIcon /></span>
            Timeline valid
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: itemsOk ? theme.green : theme.grayMuted }}><CheckIcon /></span>
            Items added ({items.length} items)
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: docsOk ? theme.green : theme.grayMuted }}><CheckIcon /></span>
            Required documents selected ({requiredDocs.length} documents)
          </li>
          <li style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span style={{ color: onlineOk ? theme.green : theme.grayMuted }}><CheckIcon /></span>
            Online submission enabled
          </li>
        </ul>
      </Card>

      {/* Preview */}
      <Card
        style={{
          marginBottom: "1.25rem",
          padding: "1.25rem",
          border: `1px solid ${theme.grayInputBorder}`,
          background: theme.white,
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <h2 style={{ margin: 0, marginBottom: "0.5rem", fontSize: "1rem", fontWeight: 600, color: "#0a0a0a" }}>
          Preview
        </h2>
        <p style={{ margin: 0, marginBottom: "1rem", fontSize: "0.875rem", color: theme.grayMuted }}>
          Preview is not visible to vendors until you publish.
        </p>
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/preview`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.9375rem",
            fontWeight: 500,
            color: theme.blue,
            border: `1px solid ${theme.blue}`,
            borderRadius: 6,
            padding: "0.5rem 1rem",
            background: theme.white,
            textDecoration: "none",
          }}
        >
          View public tender preview
          <ExternalLinkIcon />
        </Link>
      </Card>

      {/* Bottom actions */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", paddingTop: "0.5rem" }}>
        <Button
          type="button"
          onClick={() => router.push(`${base}/step-4`)}
          style={{
            background: theme.white,
            border: `1px solid ${theme.grayInputBorder}`,
            borderRadius: 6,
            color: "#374151",
          }}
        >
          ← Back
        </Button>
        <Button
          type="button"
          onClick={() => router.push(`/o/${orgKey}/tenders`)}
          style={{
            background: theme.white,
            border: `1px solid ${theme.grayInputBorder}`,
            borderRadius: 6,
            color: "#374151",
          }}
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={saveDraft}
          style={{
            background: theme.blueBorder,
            color: theme.blue,
            border: `1px solid ${theme.blue}`,
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          Save Draft
        </Button>
        <Button
          type="button"
          onClick={handlePublish}
          disabled={publishing || tender.status === "published"}
          style={{
            background: theme.blue,
            color: theme.white,
            border: "none",
            borderRadius: 6,
            fontWeight: 500,
          }}
        >
          {publishing ? "Publishing…" : "Publish Tender"}
        </Button>
      </div>
    </div>
  );
}

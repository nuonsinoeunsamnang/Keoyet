import Link from "next/link";
import type { Tender } from "@/lib/tenders";
import { theme } from "@/lib/theme";
import { CopySubmissionLinkButton } from "./CopySubmissionLinkButton";

function formatDaysUntil(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.ceil((d.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
  if (diff < 0) return null;
  if (diff === 0) return "Today";
  if (diff === 1) return "1 day";
  return `${diff} days`;
}

function StatusPill({ status }: { status: string }) {
  const isPublished = status === "published";
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
        background: isPublished ? theme.greenLighter : theme.grayBadgeBg,
        color: isPublished ? theme.greenText : theme.grayBadgeText,
        border: `1px solid ${isPublished ? theme.greenBorder : theme.grayBorder}`,
      }}
    >
      {isPublished ? (
        <>
          <span aria-hidden>✓</span>
          Published
        </>
      ) : (
        status === "draft"
          ? "Draft"
          : status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " ")
      )}
    </span>
  );
}

export function TenderHeader({
  tender,
  orgKey,
}: {
  tender: Tender;
  orgKey: string;
}) {
  const { title, status, reference_id, category, delivery_location, submission_deadline, questions_deadline, slug } = tender;
  const tenderIdLine = [reference_id || tender.id.slice(0, 8), category, delivery_location]
    .filter(Boolean)
    .join(" • ") || "Tender";
  const submissionsClose = formatDaysUntil(submission_deadline);
  const questionsClose = formatDaysUntil(questions_deadline);
  const publicPageHref = `/t/${slug}`;

  return (
    <header
      style={{
        marginBottom: "1.5rem",
        paddingBottom: "1rem",
        borderBottom: `1px solid ${theme.grayBorder}`,
      }}
    >
      <Link
        href={`/o/${orgKey}/tenders`}
        style={{
          fontSize: "0.875rem",
          color: theme.grayMuted,
          textDecoration: "none",
        }}
      >
        Tenders
      </Link>
      <span style={{ margin: "0 0.35rem", color: theme.grayMuted }}>/</span>
      <span style={{ fontSize: "0.875rem", color: theme.grayMuted }}>
        {title}
      </span>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "1rem",
          marginTop: "0.75rem",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#111827",
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: "0.25rem 0 0",
              fontSize: "0.875rem",
              color: theme.grayMuted,
            }}
          >
            {tenderIdLine}
          </p>
          {(submissionsClose || questionsClose) && (
            <p
              style={{
                margin: "0.35rem 0 0",
                fontSize: "0.8125rem",
                color: theme.grayMuted,
              }}
            >
              {submissionsClose && `Submissions close in: ${submissionsClose}`}
              {submissionsClose && questionsClose && " · "}
              {questionsClose && `Questions close in: ${questionsClose}`}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <StatusPill status={status} />
          <Link
            href={publicPageHref}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              padding: "0.5rem 0.75rem",
              borderRadius: 6,
              fontSize: "0.875rem",
              fontWeight: 500,
              background: theme.blue,
              color: theme.white,
              textDecoration: "none",
              border: "none",
            }}
          >
            View Public Page
            <span aria-hidden>↗</span>
          </Link>
          <CopySubmissionLinkButton slug={slug} />
        </div>
      </div>
    </header>
  );
}

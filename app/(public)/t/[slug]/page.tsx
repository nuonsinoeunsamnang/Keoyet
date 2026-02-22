import Link from "next/link";
import { getTenderBySlug, getTenderItems, getTenderRequiredDocs } from "@/lib/tenders";
import { getWorkspaceById } from "@/lib/org";
import { notFound } from "next/navigation";
import { QuestionsSection } from "@/components/public/QuestionsSection";

const maxWidth = 720;

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "1.5rem",
};
const logoStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "1rem",
  fontWeight: 600,
  color: "#0a0a0a",
  textDecoration: "none",
};
const backLinkStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  fontSize: "0.9375rem",
  color: "#2563eb",
  textDecoration: "none",
};
const titleBlockStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  gap: "1rem",
  marginBottom: "1rem",
  flexWrap: "wrap",
};
const statusPillStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "0.375rem",
  padding: "0.25rem 0.75rem",
  borderRadius: 9999,
  fontSize: "0.8125rem",
  fontWeight: 500,
  backgroundColor: "#dcfce7",
  color: "#166534",
  flexShrink: 0,
};
const deadlineCardStyle: React.CSSProperties = {
  padding: "1rem 1.25rem",
  backgroundColor: "#fafaf9",
  border: "1px solid #e7e5e4",
  borderRadius: 8,
  marginBottom: "1.5rem",
  color: "#0a0a0a",
};
const sectionTitleStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  fontSize: "1.125rem",
  fontWeight: 600,
  marginBottom: "0.75rem",
  color: "#0a0a0a",
};
const docItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
  marginBottom: "0.5rem",
  fontSize: "0.9375rem",
};
const footerRefStyle: React.CSSProperties = {
  fontSize: "0.9375rem",
  marginBottom: "0.5rem",
};
const footerNoteStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "0.5rem",
  fontSize: "0.875rem",
  color: "#64748b",
};

function BriefcaseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c2410c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function DocIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

export default async function PublicTenderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tender = await getTenderBySlug(slug);
  if (!tender || tender.status !== "published") notFound();

  const [items, docs, workspace] = await Promise.all([
    getTenderItems(tender.id),
    getTenderRequiredDocs(tender.id),
    getWorkspaceById(tender.workspace_id),
  ]);

  const orgName = workspace?.name ?? "Procurement Department";
  const deadlineFormatted = tender.submission_deadline
    ? new Date(tender.submission_deadline).toLocaleString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <main
      style={{
        maxWidth,
        margin: "0 auto",
        padding: "2rem",
        minHeight: "100vh",
        backgroundColor: "#ffffff",
        color: "#0a0a0a",
      }}
    >
      <header style={headerStyle}>
        <Link href="/" style={logoStyle}>
          <BriefcaseIcon />
          Procurement Portal
        </Link>
        <Link href="/" style={backLinkStyle}>
          <ArrowLeftIcon />
          Back to Tenders
        </Link>
      </header>

      <div style={titleBlockStyle}>
        <div>
          <h1 style={{ margin: 0, marginBottom: "0.25rem", fontSize: "1.5rem", fontWeight: 700 }}>
            {tender.title}
          </h1>
          <p style={{ margin: 0, fontSize: "0.9375rem", color: "#64748b" }}>{orgName}</p>
        </div>
        <span style={statusPillStyle}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#16a34a" }} />
          Open
        </span>
      </div>

      {deadlineFormatted && (
        <div style={deadlineCardStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
            <ClockIcon />
            <span style={{ fontSize: "0.875rem", fontWeight: 500, color: "#9a3412" }}>
              Submission Deadline
            </span>
          </div>
          <div style={{ fontSize: "1.125rem", fontWeight: 700, color: "#0a0a0a" }}>
            {deadlineFormatted}
          </div>
        </div>
      )}

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={sectionTitleStyle}>
          <DocIcon />
          Tender Scope
        </h2>
        {tender.description && (
          <div
            style={{
              fontSize: "0.9375rem",
              lineHeight: 1.6,
              color: "#0a0a0a",
              marginBottom: "1rem",
              whiteSpace: "pre-wrap",
            }}
          >
            {tender.description}
          </div>
        )}
        <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem" }}>Lots Summary</h3>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1rem 0" }}>
          {items.map((item, i) => (
            <li
              key={item.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.375rem",
                fontSize: "0.9375rem",
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                }}
              >
                {i + 1}
              </span>
              {item.description} – {item.quantity} {item.unit ?? "items"}
            </li>
          ))}
        </ul>
        <Link
          href={`/submit/${slug}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.75rem 1.5rem",
            backgroundColor: "#2563eb",
            color: "#fff",
            borderRadius: 8,
            fontSize: "1rem",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          <PaperPlaneIcon />
          Start Submission
        </Link>
      </section>

      <section style={{ marginBottom: "2rem" }}>
        <h2 style={sectionTitleStyle}>
          <ListIcon />
          Required Documents
        </h2>
        <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "0.75rem" }}>
          You will upload these during submission.
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {docs.map((d) => (
            <li key={d.id} style={docItemStyle}>
              <CheckIcon />
              <span>{d.name}</span>
              <span style={{ color: d.required ? "#dc2626" : "#64748b", fontSize: "0.8125rem" }}>
                {d.required ? "Required" : "Optional"}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <QuestionsSection />

      <footer style={{ marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid #e5e7eb" }}>
        {tender.reference_id && (
          <p style={footerRefStyle}>
            Tender Reference <strong>{tender.reference_id}</strong>
          </p>
        )}
        <p style={footerNoteStyle}>
          <InfoIcon />
          All official questions must be submitted through this portal. Questions submitted via
          email or phone will not be answered.
        </p>
      </footer>
    </main>
  );
}

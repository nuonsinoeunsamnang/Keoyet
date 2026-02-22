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

const PRESET_DOCS = {
  company: [
    "Business registration certificate",
    "Tax registration certificate",
    "Company profile",
  ],
  bid: [
    "Technical proposal",
    "Financial proposal / Quotation",
    "Completed BoQ / Price schedule",
  ],
  other: [
    "Product datasheets (if applicable)",
    "Warranty statement",
  ],
} as const;

const PRESET_DOC_LIST = [
  ...PRESET_DOCS.company,
  ...PRESET_DOCS.bid,
  ...PRESET_DOCS.other,
];

const REJECTION_CRITERIA_KEYS = {
  missing_required_docs: "Missing required documents",
  after_deadline: "Submitted after submission deadline",
  vendor_not_verified: "Vendor not verified",
} as const;

const inputBase = {
  display: "block",
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: `1px solid ${theme.grayInputBorder}`,
  borderRadius: 6,
  fontSize: "0.9375rem",
  marginTop: "0.25rem",
} as const;

const labelStyle = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#374151",
} as const;

const helperStyle = {
  fontSize: "0.8125rem",
  color: theme.grayMuted,
  marginTop: "0.25rem",
} as const;

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

function LightbulbIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14" />
    </svg>
  );
}

export default function SetupStep4Page() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const base = `/o/${orgKey}/tenders/${tenderId}/setup`;

  const [tenderTitle, setTenderTitle] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [eligibilityText, setEligibilityText] = useState("");
  const [selectedPresetDocs, setSelectedPresetDocs] = useState<Set<string>>(new Set());
  const [customDocInput, setCustomDocInput] = useState("");
  const [customDocs, setCustomDocs] = useState<string[]>([]);
  const [rejectionCriteria, setRejectionCriteria] = useState<Record<string, boolean>>({
    missing_required_docs: true,
    after_deadline: true,
    vendor_not_verified: false,
  });
  const [onlyVerifiedVendors, setOnlyVerifiedVendors] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const load = useCallback(async () => {
    const [tenderRes, docsRes] = await Promise.all([
      fetch(`/api/o/${orgKey}/tenders/${tenderId}`),
      fetch(`/api/o/${orgKey}/tenders/${tenderId}/required-docs`),
    ]);
    if (tenderRes.ok) {
      const t = await tenderRes.json();
      setTenderTitle(t.title ?? "");
      setReferenceId(t.reference_id ?? "");
      setEligibilityText(t.eligibility_requirements ?? "");
      setRejectionCriteria(
        t.rejection_criteria && typeof t.rejection_criteria === "object"
          ? {
              missing_required_docs: t.rejection_criteria.missing_required_docs !== false,
              after_deadline: t.rejection_criteria.after_deadline !== false,
              vendor_not_verified: t.rejection_criteria.vendor_not_verified === true,
            }
          : { missing_required_docs: true, after_deadline: true, vendor_not_verified: false }
      );
      setOnlyVerifiedVendors(t.only_verified_vendors === true);
    }
    if (docsRes.ok) {
      const data = await docsRes.json();
      const names = ((data.docs ?? []) as { name: string }[]).map((d) => d.name);
      const preset = new Set<string>();
      const custom: string[] = [];
      for (const name of names) {
        if ((PRESET_DOC_LIST as readonly string[]).includes(name)) preset.add(name);
        else if (name.trim()) custom.push(name);
      }
      setSelectedPresetDocs(preset);
      setCustomDocs(custom);
    } else {
      setSelectedPresetDocs(new Set());
      setCustomDocs([]);
    }
    setLoading(false);
  }, [orgKey, tenderId]);

  useEffect(() => {
    load();
  }, [load]);

  function togglePresetDoc(name: string) {
    setSelectedPresetDocs((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function addCustomDoc() {
    const name = customDocInput.trim();
    if (!name || customDocs.includes(name)) return;
    setCustomDocs((prev) => [...prev, name]);
    setCustomDocInput("");
  }

  function removeCustomDoc(name: string) {
    setCustomDocs((prev) => prev.filter((x) => x !== name));
  }

  function setRejection(key: string, value: boolean) {
    setRejectionCriteria((prev) => ({ ...prev, [key]: value }));
  }

  const builtDocs = [
    ...PRESET_DOC_LIST.filter((name) => selectedPresetDocs.has(name)),
    ...customDocs,
  ].map((name, i) => ({ name, required: true, sort_order: i }));

  async function saveDraft() {
    setSaveError(null);
    setSaving(true);
    const patchRes = await fetch(`/api/o/${orgKey}/tenders/${tenderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eligibility_requirements: eligibilityText.trim() || null,
        rejection_criteria: rejectionCriteria,
        only_verified_vendors: onlyVerifiedVendors,
      }),
    });
    if (!patchRes.ok) {
      setSaving(false);
      const err = await patchRes.json().catch(() => ({}));
      setSaveError(err?.error ?? "Failed to save. Please try again.");
      return;
    }
    const putRes = await fetch(`/api/o/${orgKey}/tenders/${tenderId}/required-docs`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docs: builtDocs }),
    });
    setSaving(false);
    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      setSaveError(err?.error ?? "Failed to save documents. Please try again.");
    }
  }

  async function saveAndContinue(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    setSaving(true);
    const patchRes = await fetch(`/api/o/${orgKey}/tenders/${tenderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eligibility_requirements: eligibilityText.trim() || null,
        rejection_criteria: rejectionCriteria,
        only_verified_vendors: onlyVerifiedVendors,
      }),
    });
    if (!patchRes.ok) {
      setSaving(false);
      const err = await patchRes.json().catch(() => ({}));
      setSaveError(err?.error ?? "Failed to save. Please try again.");
      return;
    }
    const putRes = await fetch(`/api/o/${orgKey}/tenders/${tenderId}/required-docs`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ docs: builtDocs }),
    });
    setSaving(false);
    if (!putRes.ok) {
      const err = await putRes.json().catch(() => ({}));
      setSaveError(err?.error ?? "Failed to save documents. Please try again.");
      return;
    }
    router.push(`${base}/step-5`);
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: theme.grayMuted }}>
        Loading…
      </div>
    );
  }

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
        <span style={{ color: "var(--dashboard-fg, #0a0a0a)" }}>Create Tender</span>
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
          <h1
            style={{
              margin: 0,
              marginBottom: "0.25rem",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Create Tender
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.9375rem",
              color: theme.grayMuted,
            }}
          >
            Define document requirements and compliance rules.
          </p>
        </div>
        {saveError && (
          <p style={{ margin: 0, color: "#b91c1c", fontSize: "0.875rem", width: "100%" }}>
            {saveError}
          </p>
        )}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button
            type="button"
            onClick={() => router.push(`${base}/step-3`)}
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
            disabled={saving}
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
            type="submit"
            form="step4-form"
            disabled={saving}
            style={{
              background: theme.blue,
              color: theme.white,
              border: "none",
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            {saving ? "Saving…" : "Save & Continue"}
          </Button>
        </div>
      </div>

      {tenderTitle && referenceId && (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 0.75rem",
            borderRadius: 8,
            background: theme.blueLight,
            border: `1px solid ${theme.blueBorder}`,
            marginBottom: "1.5rem",
          }}
        >
          <span style={{ color: theme.blue }}>
            <DocumentIcon />
          </span>
          <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: theme.blueTitle }}>
            {tenderTitle}
          </span>
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: "50%",
              background: theme.blue,
              opacity: 0.6,
            }}
            aria-hidden
          />
          <span style={{ fontSize: "0.9375rem", fontWeight: 500, color: theme.blueTitle }}>
            {referenceId}
          </span>
          <span
            style={{
              marginLeft: "0.5rem",
              padding: "0.25rem 0.5rem",
              borderRadius: 9999,
              fontSize: "0.75rem",
              fontWeight: 500,
              background: theme.blueBorder,
              color: theme.blueText,
            }}
          >
            Draft
          </span>
        </div>
      )}

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {steps.map((s) => {
          const isCurrent = s.path === "step-4";
          const isComplete = s.num < 4;
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
                  background: isComplete
                    ? theme.green
                    : isCurrent
                      ? theme.blue
                      : theme.grayInputBorder,
                  color: isComplete || isCurrent ? theme.white : "#374151",
                  border: "none",
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

      <form id="step4-form" onSubmit={saveAndContinue}>
        {/* Eligibility */}
        <Card
          style={{
            marginBottom: "1.25rem",
            padding: "1.25rem",
            border: `1px solid ${theme.grayInputBorder}`,
            background: theme.white,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "0.25rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#0a0a0a",
            }}
          >
            Eligibility
          </h2>
          <p style={{ ...helperStyle, marginBottom: "1rem" }}>
            List who is eligible to bid (optional but recommended).
          </p>
          <label htmlFor="eligibility" style={{ ...labelStyle, marginBottom: "0.25rem" }}>
            Eligibility requirements
          </label>
          <textarea
            id="eligibility"
            value={eligibilityText}
            onChange={(e) => setEligibilityText(e.target.value)}
            placeholder={"• Registered business in Cambodia\n• Valid tax registration certificate\n• At least 2 similar project references"}
            rows={5}
            style={{ ...inputBase, resize: "vertical" }}
          />
          <div
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              background: theme.blueLight,
              borderRadius: 6,
              border: `1px solid ${theme.blueBorder}`,
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              fontSize: "0.875rem",
              color: theme.blueText,
            }}
          >
            <span style={{ color: theme.blue, flexShrink: 0 }}>
              <LightbulbIcon />
            </span>
            <span>
              Add at least 1 eligibility requirement to reduce non-qualified bids.{" "}
              <button
                type="button"
                onClick={() => setEligibilityText((prev) => (prev.trim() ? prev + "\n• " : "• "))}
                style={{
                  background: "none",
                  border: "none",
                  color: theme.blue,
                  fontWeight: 500,
                  cursor: "pointer",
                  padding: 0,
                  textDecoration: "underline",
                }}
              >
                Add
              </button>
            </span>
          </div>
        </Card>

        {/* Required Documents */}
        <Card
          style={{
            marginBottom: "1.25rem",
            padding: "1.25rem",
            border: `1px solid ${theme.grayInputBorder}`,
            background: theme.white,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "0.25rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#0a0a0a",
            }}
          >
            Required Documents
          </h2>
          <p style={{ ...helperStyle, marginBottom: "1rem" }}>
            Vendors must upload these documents to submit online.
          </p>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ ...labelStyle, marginBottom: "0.5rem" }}>Company Documents</div>
            {PRESET_DOCS.company.map((name) => (
              <label
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.9375rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedPresetDocs.has(name)}
                  onChange={() => togglePresetDoc(name)}
                />
                {name}
              </label>
            ))}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ ...labelStyle, marginBottom: "0.5rem" }}>Bid Documents</div>
            {PRESET_DOCS.bid.map((name) => (
              <label
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.9375rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedPresetDocs.has(name)}
                  onChange={() => togglePresetDoc(name)}
                />
                {name}
              </label>
            ))}
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <div style={{ ...labelStyle, marginBottom: "0.5rem" }}>Other</div>
            {PRESET_DOCS.other.map((name) => (
              <label
                key={name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "0.375rem",
                  cursor: "pointer",
                  fontSize: "0.9375rem",
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedPresetDocs.has(name)}
                  onChange={() => togglePresetDoc(name)}
                />
                {name}
              </label>
            ))}
          </div>

          <div>
            <div style={{ ...labelStyle, marginBottom: "0.5rem" }}>Custom Documents</div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input
                type="text"
                value={customDocInput}
                onChange={(e) => setCustomDocInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomDoc())}
                placeholder="e.g., Manufacturer authorization letter"
                style={{ ...inputBase, flex: "1 1 200px", marginTop: 0 }}
              />
              <Button
                type="button"
                onClick={addCustomDoc}
                style={{
                  background: theme.blue,
                  color: theme.white,
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 500,
                }}
              >
                Add
              </Button>
            </div>
            {customDocs.length > 0 && (
              <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem", fontSize: "0.9375rem" }}>
                {customDocs.map((name) => (
                  <li key={name} style={{ marginBottom: "0.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    {name}
                    <button
                      type="button"
                      onClick={() => removeCustomDoc(name)}
                      style={{
                        background: "none",
                        border: "none",
                        color: theme.grayMuted,
                        cursor: "pointer",
                        fontSize: "0.8125rem",
                        textDecoration: "underline",
                      }}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Card>

        {/* Rejection Criteria */}
        <Card
          style={{
            marginBottom: "1.25rem",
            padding: "1.25rem",
            border: `1px solid ${theme.grayInputBorder}`,
            background: theme.white,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "0.25rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#0a0a0a",
            }}
          >
            Rejection Criteria
          </h2>
          <p style={{ ...helperStyle, marginBottom: "1rem" }}>
            These rules mark bids as non-compliant.
          </p>
          {(Object.keys(REJECTION_CRITERIA_KEYS) as (keyof typeof REJECTION_CRITERIA_KEYS)[]).map((key) => (
            <label
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "0.375rem",
                cursor: "pointer",
                fontSize: "0.9375rem",
              }}
            >
              <input
                type="checkbox"
                checked={rejectionCriteria[key] ?? false}
                onChange={(e) => setRejection(key, e.target.checked)}
              />
              {REJECTION_CRITERIA_KEYS[key]}
            </label>
          ))}
        </Card>

        {/* Vendor Verification Policy */}
        <Card
          style={{
            marginBottom: "1.25rem",
            padding: "1.25rem",
            border: `1px solid ${theme.grayInputBorder}`,
            background: theme.white,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "0.25rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#0a0a0a",
            }}
          >
            Vendor Verification Policy
          </h2>
          <p style={{ ...helperStyle, marginBottom: "1rem" }}>
            Choose who can submit bids for this tender.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                cursor: "pointer",
                fontSize: "0.9375rem",
              }}
            >
              <input
                type="radio"
                name="vendor-verification"
                checked={!onlyVerifiedVendors}
                onChange={() => setOnlyVerifiedVendors(false)}
                style={{ marginTop: "0.2rem" }}
              />
              <div>
                <span style={{ fontWeight: 500 }}>Allow any registered vendor to submit</span>
                <p style={{ ...helperStyle, marginTop: "0.25rem", marginBottom: 0 }}>
                  Vendors can submit immediately after registration.
                </p>
              </div>
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.5rem",
                cursor: "pointer",
                fontSize: "0.9375rem",
              }}
            >
              <input
                type="radio"
                name="vendor-verification"
                checked={onlyVerifiedVendors}
                onChange={() => setOnlyVerifiedVendors(true)}
                style={{ marginTop: "0.2rem" }}
              />
              <div>
                <span style={{ fontWeight: 500 }}>Only verified vendors can submit</span>
                <p style={{ ...helperStyle, marginTop: "0.25rem", marginBottom: 0 }}>
                  Vendors must be verified by your organization first.
                </p>
              </div>
            </label>
          </div>
        </Card>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            paddingTop: "0.5rem",
          }}
        >
          <Button
            type="button"
            onClick={() => router.push(`${base}/step-3`)}
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
            disabled={saving}
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
            type="submit"
            disabled={saving}
            style={{
              background: theme.blue,
              color: theme.white,
              border: "none",
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            {saving ? "Saving…" : "Save & Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}

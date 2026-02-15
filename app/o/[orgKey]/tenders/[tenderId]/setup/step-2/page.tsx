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

function daysUntil(iso: string | null): number | null {
  if (!iso) return null;
  const end = new Date(iso).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((end - now) / (24 * 60 * 60 * 1000)));
}

function isoFromDateAndTime(dateStr: string, timeStr: string): string | null {
  if (!dateStr || !timeStr) return null;
  return new Date(`${dateStr}T${timeStr}`).toISOString();
}

function dateTimeFromIso(iso: string | null): { date: string; time: string } {
  if (!iso) return { date: "", time: "" };
  const d = new Date(iso);
  const date = d.toISOString().slice(0, 10);
  const hours = d.getHours();
  const mins = d.getMinutes();
  const time = `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
  return { date, time };
}

export default function SetupStep2Page() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const base = `/o/${orgKey}/tenders/${tenderId}/setup`;

  const [tenderTitle, setTenderTitle] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [publishTime, setPublishTime] = useState("");
  const [questionsDate, setQuestionsDate] = useState("");
  const [questionsTime, setQuestionsTime] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [submissionTime, setSubmissionTime] = useState("");
  const [acceptOnline, setAcceptOnline] = useState(true);
  const [acceptPhysical, setAcceptPhysical] = useState(false);
  const [physicalInstructions, setPhysicalInstructions] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}`);
    if (!res.ok) return;
    const t = await res.json();
    setTenderTitle(t.title ?? "");
    setReferenceId(t.reference_id ?? "");
    const pub = dateTimeFromIso(t.publish_at ?? null);
    setPublishDate(pub.date);
    setPublishTime(pub.time || "09:00");
    const q = dateTimeFromIso(t.questions_deadline ?? null);
    setQuestionsDate(q.date);
    setQuestionsTime(q.time || "17:00");
    const sub = dateTimeFromIso(t.submission_deadline ?? null);
    setSubmissionDate(sub.date);
    setSubmissionTime(sub.time || "17:00");
    setAcceptOnline(t.accept_online_submissions !== false);
    setAcceptPhysical(t.accept_physical_submissions === true);
    setPhysicalInstructions(t.physical_submission_instructions ?? "");
    setLoading(false);
  }, [orgKey, tenderId]);

  useEffect(() => {
    load();
  }, [load]);

  const submissionDeadlineIso =
    submissionDate && submissionTime
      ? isoFromDateAndTime(submissionDate, submissionTime)
      : null;
  const publishAtIso =
    publishDate && publishTime
      ? isoFromDateAndTime(publishDate, publishTime)
      : null;
  const questionsDeadlineIso =
    questionsDate && questionsTime
      ? isoFromDateAndTime(questionsDate, questionsTime)
      : null;
  const timeRemainingDays = daysUntil(submissionDeadlineIso);

  async function saveDraft() {
    setSaving(true);
    await fetch(`/api/o/${orgKey}/tenders/${tenderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publish_at: publishAtIso,
        questions_deadline: questionsDeadlineIso,
        submission_deadline: submissionDeadlineIso,
        accept_online_submissions: acceptOnline,
        accept_physical_submissions: acceptPhysical,
        physical_submission_instructions:
          acceptPhysical && physicalInstructions ? physicalInstructions : null,
      }),
    });
    setSaving(false);
  }

  async function saveAndContinue(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/o/${orgKey}/tenders/${tenderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        publish_at: publishAtIso,
        questions_deadline: questionsDeadlineIso,
        submission_deadline: submissionDeadlineIso,
        accept_online_submissions: acceptOnline,
        accept_physical_submissions: acceptPhysical,
        physical_submission_instructions:
          acceptPhysical && physicalInstructions ? physicalInstructions : null,
      }),
    });
    setSaving(false);
    router.push(`${base}/step-3`);
  }

  const physicalInstructionsRequired = acceptPhysical;
  const canSubmit =
    publishDate &&
    publishTime &&
    questionsDate &&
    questionsTime &&
    submissionDate &&
    submissionTime &&
    (!physicalInstructionsRequired || physicalInstructions.trim());

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: theme.grayMuted }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
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
            Set deadlines and enable online submissions.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button
            type="button"
            onClick={() => router.push(`${base}/step-1`)}
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
            form="step2-form"
            disabled={saving || !canSubmit}
            style={{
              background: theme.blue,
              color: theme.white,
              border: "none",
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            Save & Continue
          </Button>
        </div>
      </div>

      {tenderTitle && referenceId && (
        <div
          style={{
            display: "inline-block",
            padding: "0.25rem 0.75rem",
            borderRadius: 9999,
            background: theme.blueLight,
            color: theme.blue,
            fontSize: "0.875rem",
            fontWeight: 500,
            marginBottom: "1.5rem",
          }}
        >
          {tenderTitle} • {referenceId}
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
          const isCurrent = s.path === "step-2";
          const isComplete = s.num < 2;
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

      <form id="step2-form" onSubmit={saveAndContinue}>
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
            Timeline
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1rem" }}>
            <div>
              <label htmlFor="publish-date" style={labelStyle}>
                Publish date & time *
              </label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <input
                  id="publish-date"
                  type="date"
                  value={publishDate}
                  onChange={(e) => setPublishDate(e.target.value)}
                  required
                  style={{ ...inputBase, flex: "1 1 140px" }}
                />
                <input
                  id="publish-time"
                  type="time"
                  value={publishTime}
                  onChange={(e) => setPublishTime(e.target.value)}
                  required
                  style={{ ...inputBase, flex: "1 1 100px" }}
                />
              </div>
              <p style={helperStyle}>
                Tender becomes visible to vendors at this time.
              </p>
            </div>
            <div>
              <label htmlFor="questions-date" style={labelStyle}>
                Questions deadline *
              </label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <input
                  id="questions-date"
                  type="date"
                  value={questionsDate}
                  onChange={(e) => setQuestionsDate(e.target.value)}
                  required
                  style={{ ...inputBase, flex: "1 1 140px" }}
                />
                <input
                  id="questions-time"
                  type="time"
                  value={questionsTime}
                  onChange={(e) => setQuestionsTime(e.target.value)}
                  required
                  style={{ ...inputBase, flex: "1 1 100px" }}
                />
              </div>
              <p style={helperStyle}>
                Vendors can submit questions until this time.
              </p>
            </div>
            <div>
              <label htmlFor="submission-date" style={labelStyle}>
                Submission deadline *
              </label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                <input
                  id="submission-date"
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                  required
                  style={{ ...inputBase, flex: "1 1 140px" }}
                />
                <input
                  id="submission-time"
                  type="time"
                  value={submissionTime}
                  onChange={(e) => setSubmissionTime(e.target.value)}
                  required
                  style={{ ...inputBase, flex: "1 1 100px" }}
                />
              </div>
              <p style={helperStyle}>
                Online submissions are automatically locked after this time.
              </p>
            </div>
            <div
              style={{
                padding: "0.75rem 1rem",
                background: theme.grayBg,
                borderRadius: 6,
                border: `1px solid ${theme.grayInputBorder}`,
                fontSize: "0.875rem",
                color: "#374151",
              }}
            >
              <div style={{ marginBottom: "0.25rem" }}>
                Publishes: {formatDateTime(publishAtIso)}
              </div>
              <div style={{ marginBottom: "0.25rem" }}>
                Questions close: {formatDateTime(questionsDeadlineIso)}
              </div>
              <div style={{ marginBottom: "0.25rem" }}>
                Submissions close: {formatDateTime(submissionDeadlineIso)}
              </div>
              <div>
                Time remaining:{" "}
                {timeRemainingDays !== null ? (
                  <span style={{ color: theme.blue, fontWeight: 500 }}>
                    {timeRemainingDays} day{timeRemainingDays !== 1 ? "s" : ""}
                  </span>
                ) : (
                  "—"
                )}
              </div>
            </div>
          </div>
        </Card>

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
            Submission Method
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", marginTop: "1rem" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <button
                type="button"
                role="switch"
                aria-checked={acceptOnline}
                onClick={() => setAcceptOnline(!acceptOnline)}
                style={{
                  flexShrink: 0,
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  border: "none",
                  background: acceptOnline ? theme.blue : theme.grayInputBorder,
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: acceptOnline ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: theme.white,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    transition: "left 0.15s ease",
                  }}
                />
              </button>
              <div>
                <div style={{ ...labelStyle, marginTop: 0 }}>Accept online submissions</div>
                <p style={{ ...helperStyle, marginBottom: 0 }}>
                  Vendors submit bids through Keoyet. No physical delivery required.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem" }}>
              <button
                type="button"
                role="switch"
                aria-checked={acceptPhysical}
                onClick={() => setAcceptPhysical(!acceptPhysical)}
                style={{
                  flexShrink: 0,
                  width: 44,
                  height: 24,
                  borderRadius: 12,
                  border: "none",
                  background: acceptPhysical ? theme.blue : theme.grayInputBorder,
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 2,
                    left: acceptPhysical ? 22 : 2,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: theme.white,
                    boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                    transition: "left 0.15s ease",
                  }}
                />
              </button>
              <div>
                <div style={{ ...labelStyle, marginTop: 0 }}>Also accept physical submissions</div>
                <p style={{ ...helperStyle, marginBottom: 0 }}>
                  Allow vendors to submit sealed envelopes in addition to online.
                </p>
              </div>
            </div>
            {acceptPhysical && (
              <div>
                <label htmlFor="physical-instructions" style={labelStyle}>
                  Physical submission instructions *
                </label>
                <textarea
                  id="physical-instructions"
                  value={physicalInstructions}
                  onChange={(e) => setPhysicalInstructions(e.target.value)}
                  placeholder="Office address, sealed envelope instructions, and submission hours."
                  rows={3}
                  required={acceptPhysical}
                  style={{ ...inputBase, resize: "vertical" }}
                />
                <p style={helperStyle}>
                  Shown on the tender page under submission instructions.
                </p>
              </div>
            )}
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
            onClick={() => router.push(`${base}/step-1`)}
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
            disabled={saving || !canSubmit}
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

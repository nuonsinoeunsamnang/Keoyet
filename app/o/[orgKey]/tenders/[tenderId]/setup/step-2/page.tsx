"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SetupStep2Page() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const [deadline, setDeadline] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}`);
    if (!res.ok) return;
    const t = await res.json();
    setDeadline(
      t.submission_deadline
        ? new Date(t.submission_deadline).toISOString().slice(0, 16)
        : ""
    );
    setNote(t.submission_link_note ?? "");
    setLoading(false);
  }, [orgKey, tenderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/o/${orgKey}/tenders/${tenderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submission_deadline: deadline ? new Date(deadline).toISOString() : null,
        submission_link_note: note || null,
      }),
    });
    setSaving(false);
    router.push(`/o/${orgKey}/tenders/${tenderId}/setup/step-3`);
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Step 2: Timeline & submission links</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="deadline">Submission deadline</label>
          <input
            id="deadline"
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            style={{ display: "block", width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="note">Submission link note</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            style={{ display: "block", width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Next"}
        </button>
      </form>
    </div>
  );
}

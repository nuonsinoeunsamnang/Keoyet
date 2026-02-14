"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Submission = { id: string; vendors: { name: string } | null };

export default function AwardPage() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionId, setSubmissionId] = useState("");
  const [notifyWinner, setNotifyWinner] = useState(false);
  const [notes, setNotes] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(
      `/api/o/${orgKey}/tenders/${tenderId}/submissions`
    );
    if (!res.ok) return;
    const data = await res.json();
    setSubmissions(data);
    if (data.length > 0 && !submissionId) setSubmissionId(data[0].id);
  }, [orgKey, tenderId, submissionId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!submissionId) return;
    setSending(true);
    const res = await fetch(`/api/o/${orgKey}/awards`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tender_id: tenderId,
        submission_id: submissionId,
        notify_winner: notifyWinner,
        notes: notes || undefined,
      }),
    });
    setSending(false);
    if (res.ok) {
      router.push(`/o/${orgKey}/tenders/${tenderId}/manage/compare/success`);
    }
  }

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Award tender</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="submission">Winner (submission)</label>
          <select
            id="submission"
            value={submissionId}
            onChange={(e) => setSubmissionId(e.target.value)}
            style={{ display: "block", width: "100%", padding: "0.5rem" }}
          >
            {submissions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.vendors?.name ?? s.id.slice(0, 8)}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label>
            <input
              type="checkbox"
              checked={notifyWinner}
              onChange={(e) => setNotifyWinner(e.target.checked)}
            />
            Notify winner
          </label>
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            style={{ display: "block", width: "100%", padding: "0.5rem" }}
          />
        </div>
        <button type="submit" disabled={sending}>
          {sending ? "Saving…" : "Confirm award"}
        </button>
      </form>
    </div>
  );
}

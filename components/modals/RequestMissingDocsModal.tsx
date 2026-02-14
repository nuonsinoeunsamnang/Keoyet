"use client";

import { useState } from "react";

export function RequestMissingDocsModal({
  orgKey,
  submissionId,
}: {
  orgKey: string;
  submissionId: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSending(true);
    await fetch(
      `/api/o/${orgKey}/submissions/${submissionId}/request-missing-docs`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      }
    );
    setSending(false);
    setOpen(false);
    setMessage("");
  }

  return (
    <div style={{ marginTop: "1rem" }}>
      <button type="button" onClick={() => setOpen(true)}>
        Request missing docs
      </button>
      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
          onClick={() => setOpen(false)}
        >
          <div
            style={{
              background: "var(--background)",
              padding: "1.5rem",
              borderRadius: 8,
              maxWidth: 400,
              width: "100%",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "1rem" }}>Request missing docs</h2>
            <form onSubmit={handleSubmit}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message (optional)"
                rows={3}
                style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
              />
              <div style={{ display: "flex", gap: 8 }}>
                <button type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Send"}
                </button>
                <button type="button" onClick={() => setOpen(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApproveVendorModal({
  orgKey,
  vendorId,
}: {
  orgKey: string;
  vendorId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleApprove() {
    setSending(true);
    const res = await fetch(`/api/o/${orgKey}/vendors/${vendorId}/approve`, {
      method: "POST",
    });
    setSending(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Approve
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
              maxWidth: 360,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ marginBottom: "1rem" }}>Approve vendor</h2>
            <p style={{ marginBottom: "1rem" }}>
              Confirm approval for this vendor.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={handleApprove} disabled={sending}>
                {sending ? "Saving…" : "Approve"}
              </button>
              <button type="button" onClick={() => setOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

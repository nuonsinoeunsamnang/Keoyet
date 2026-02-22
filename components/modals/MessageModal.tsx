"use client";

import { theme } from "@/lib/theme";

export function MessageModal({
  open,
  onClose,
  title = "Error",
  message,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}) {
  if (!open) return null;

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="message-modal-title"
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: theme.white,
          padding: "1.5rem 1.5rem 1.25rem",
          borderRadius: 10,
          maxWidth: 400,
          width: "100%",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
          border: `1px solid ${theme.grayBorder}`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="message-modal-title"
          style={{
            margin: 0,
            marginBottom: "0.5rem",
            fontSize: "1.125rem",
            fontWeight: 600,
            color: "#111827",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: 0,
            marginBottom: "1.25rem",
            fontSize: "0.9375rem",
            color: theme.grayMuted,
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: theme.white,
              background: theme.blue,
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

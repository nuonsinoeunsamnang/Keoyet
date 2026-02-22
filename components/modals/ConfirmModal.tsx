"use client";

import { theme } from "@/lib/theme";

type Variant = "danger" | "default";

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
  variant = "default",
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  variant?: Variant;
}) {
  if (!open) return null;

  const confirmBg = variant === "danger" ? "#b91c1c" : theme.blue;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
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
          id="confirm-modal-title"
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
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "0.75rem",
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "#374151",
              background: theme.white,
              border: `1px solid ${theme.grayBorder}`,
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: theme.white,
              background: confirmBg,
              border: "none",
              borderRadius: 6,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
            }}
          >
            {loading ? "Deleting…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

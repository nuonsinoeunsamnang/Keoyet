"use client";

import { useCallback, useState } from "react";
import { theme } from "@/lib/theme";

export function CopySubmissionLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/submit/${slug}`
        : "";
    if (!url) return;
    void navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [slug]);

  return (
    <button
      type="button"
      onClick={copy}
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
        border: "none",
        cursor: "pointer",
      }}
    >
      {copied ? "Copied" : "Copy Submission Link"}
      {!copied && <span aria-hidden>⎘</span>}
    </button>
  );
}

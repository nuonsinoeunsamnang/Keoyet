"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { theme } from "@/lib/theme";

export default function NewTenderPage() {
  const router = useRouter();
  const params = useParams();
  const orgKey = params.orgKey as string;
  const [status, setStatus] = useState<"idle" | "creating" | "error">("idle");

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "idle") return;
    setStatus("creating");
    setErrorMessage(null);
    fetch(`/api/o/${orgKey}/tenders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.id) {
          router.replace(`/o/${orgKey}/tenders/${data.id}/setup/step-1`);
        } else {
          setStatus("error");
          setErrorMessage(
            res.status === 404
              ? "Workspace not found. Use the homepage to create a workspace first, then create tenders from that dashboard."
              : (data?.error as string) ?? "Failed to create tender."
          );
        }
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Network error. Please try again.");
      });
  }, [orgKey, router, status]);

  if (status === "error") {
    return (
      <div style={{ padding: "2rem", maxWidth: 480 }}>
        <p style={{ marginBottom: "0.5rem" }}>Failed to create tender.</p>
        {errorMessage && (
          <p style={{ marginBottom: "1rem", fontSize: "0.875rem", color: theme.grayMuted }}>
            {errorMessage}
          </p>
        )}
        <a href={`/o/${orgKey}/tenders`} style={{ color: theme.blue }}>
          Back to tenders
        </a>
      </div>
    );
  }
  return <p>Creating tender…</p>;
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();
  const [orgKeyInput, setOrgKeyInput] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateWorkspace() {
    setCreating(true);
    setError(null);
    try {
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create workspace");
      router.push(`/o/${data.orgKey}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  function handleEnterWorkspace(e: React.FormEvent) {
    e.preventDefault();
    const key = orgKeyInput.trim();
    if (!key) return;
    router.push(`/o/${key}`);
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>Keoyet</h1>
      <p style={{ color: "var(--foreground)", marginBottom: "2rem" }}>
        Tender and submission management. Create a workspace or enter an
        existing one.
      </p>

      <section style={{ marginBottom: "2rem" }}>
        <button
          type="button"
          onClick={handleCreateWorkspace}
          disabled={creating}
          style={{
            padding: "0.75rem 1.25rem",
            fontSize: "1rem",
            cursor: creating ? "not-allowed" : "pointer",
          }}
        >
          {creating ? "Creating…" : "Create workspace"}
        </button>
      </section>

      <section>
        <form onSubmit={handleEnterWorkspace}>
          <label htmlFor="orgKey" style={{ display: "block", marginBottom: "0.5rem" }}>
            Enter workspace link (org key)
          </label>
          <input
            id="orgKey"
            type="text"
            value={orgKeyInput}
            onChange={(e) => setOrgKeyInput(e.target.value)}
            placeholder="e.g. abc12-def34"
            style={{
              width: "100%",
              padding: "0.5rem",
              marginBottom: "0.75rem",
            }}
          />
          <button
            type="submit"
            style={{ padding: "0.5rem 1rem", cursor: "pointer" }}
          >
            Open workspace
          </button>
        </form>
      </section>

      {error && (
        <p style={{ marginTop: "1rem", color: "crimson" }}>{error}</p>
      )}
    </main>
  );
}

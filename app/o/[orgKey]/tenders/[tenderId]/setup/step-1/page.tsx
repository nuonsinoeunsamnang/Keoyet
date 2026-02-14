"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SetupStep1Page() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}`);
    if (!res.ok) return;
    const t = await res.json();
    setTitle(t.title ?? "");
    setDescription(t.description ?? "");
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
      body: JSON.stringify({ title: title || "Untitled", description: description || undefined }),
    });
    setSaving(false);
    router.push(`/o/${orgKey}/tenders/${tenderId}/setup/step-2`);
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Step 1: Basics</h1>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, marginTop: "1rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ display: "block", width: "100%", padding: "0.5rem" }}
          />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
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

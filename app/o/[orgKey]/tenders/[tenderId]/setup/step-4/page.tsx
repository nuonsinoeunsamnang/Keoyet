"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Doc = { name: string; required: boolean; sort_order: number };

export default function SetupStep4Page() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}/required-docs`);
    if (res.ok) {
      const data = await res.json();
      const list = (data.docs ?? []).length
        ? data.docs
        : [{ name: "", required: true, sort_order: 0 }];
      setDocs(list);
    } else {
      setDocs([{ name: "", required: true, sort_order: 0 }]);
    }
    setLoading(false);
  }, [orgKey, tenderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/o/${orgKey}/tenders/${tenderId}/required-docs`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        docs: docs
          .filter((d) => d.name.trim())
          .map((d, idx) => ({
            name: d.name,
            required: d.required,
            sort_order: idx,
          })),
      }),
    });
    setSaving(false);
    router.push(`/o/${orgKey}/tenders/${tenderId}/setup/step-5`);
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Step 4: Required docs & rejection rules</h1>
      <div style={{ maxWidth: 500, marginTop: "1rem" }}>
        {docs.map((d, i) => (
          <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            <input
              value={d.name}
              onChange={(e) =>
                setDocs((prev) =>
                  prev.map((x, j) =>
                    j === i ? { ...x, name: e.target.value } : x
                  )
                )
              }
              placeholder="Document name"
              style={{ flex: 1, padding: "0.5rem" }}
            />
            <label>
              <input
                type="checkbox"
                checked={d.required}
                onChange={(e) =>
                  setDocs((prev) =>
                    prev.map((x, j) =>
                      j === i ? { ...x, required: e.target.checked } : x
                    )
                  )
                }
              />
              Required
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            setDocs((prev) => [
              ...prev,
              { name: "", required: true, sort_order: prev.length },
            ])
          }
          style={{ marginBottom: "1rem" }}
        >
          Add doc
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Next"}
        </button>
      </form>
    </div>
  );
}

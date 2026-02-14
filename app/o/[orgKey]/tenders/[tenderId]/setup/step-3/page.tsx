"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ItemsTable } from "@/components/tables/ItemsTable";

type Item = { sort_order: number; description: string; quantity: number; unit: string; notes: string };

export default function SetupStep3Page() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}`);
    if (!res.ok) return;
    const t = await res.json();
    const itemsRes = await fetch(`/api/o/${orgKey}/tenders/${tenderId}/items`);
    let list: Item[] = [];
    if (itemsRes.ok) {
      const data = await itemsRes.json();
      list = (data.items ?? []).map((i: { sort_order: number; description: string; quantity: number; unit?: string; notes?: string }) => ({
        sort_order: i.sort_order,
        description: i.description,
        quantity: i.quantity ?? 1,
        unit: i.unit ?? "",
        notes: i.notes ?? "",
      }));
    }
    if (list.length === 0) list = [{ sort_order: 0, description: "", quantity: 1, unit: "", notes: "" }];
    setItems(list);
    setLoading(false);
  }, [orgKey, tenderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/o/${orgKey}/tenders/${tenderId}/items`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: items
          .filter((i) => i.description.trim())
          .map((i, idx) => ({
            sort_order: idx,
            description: i.description,
            quantity: i.quantity,
            unit: i.unit || null,
            notes: i.notes || null,
          })),
      }),
    });
    setSaving(false);
    router.push(`/o/${orgKey}/tenders/${tenderId}/setup/step-4`);
  }

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1>Step 3: Items (BoQ)</h1>
      <ItemsTable
        items={items}
        onChange={setItems}
        onAdd={() =>
          setItems((prev) => [
            ...prev,
            {
              sort_order: prev.length,
              description: "",
              quantity: 1,
              unit: "",
              notes: "",
            },
          ])
        }
        onRemove={(i) =>
          setItems((prev) => prev.filter((_, idx) => idx !== i))
        }
      />
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <button type="submit" disabled={saving}>
          {saving ? "Saving…" : "Next"}
        </button>
      </form>
    </div>
  );
}

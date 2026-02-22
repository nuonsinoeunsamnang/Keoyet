"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Tender = {
  id: string;
  title: string;
  description: string | null;
  submission_deadline: string | null;
  status: string;
};

type TenderItem = {
  id: string;
  sort_order: number;
  description: string;
  quantity: number;
  unit: string | null;
  image_url?: string | null;
};

type RequiredDoc = { id: string; name: string };

export default function TenderPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const [tender, setTender] = useState<Tender | null>(null);
  const [items, setItems] = useState<TenderItem[]>([]);
  const [docs, setDocs] = useState<RequiredDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [itemsError, setItemsError] = useState(false);

  const load = useCallback(async () => {
    setItemsError(false);
    const cacheBuster = `_=${Date.now()}`;
    const [tRes, iRes, dRes] = await Promise.all([
      fetch(`/api/o/${orgKey}/tenders/${tenderId}?${cacheBuster}`, { cache: "no-store" }),
      fetch(`/api/o/${orgKey}/tenders/${tenderId}/items?${cacheBuster}`, { cache: "no-store" }),
      fetch(`/api/o/${orgKey}/tenders/${tenderId}/required-docs?${cacheBuster}`, { cache: "no-store" }),
    ]);
    if (tRes.ok) {
      const t = await tRes.json();
      setTender(t);
    }
    if (iRes.ok) {
      const data = await iRes.json();
      const rawItems = Array.isArray(data.items) ? data.items : [];
      setItems(rawItems.sort((a: TenderItem, b: TenderItem) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
    } else {
      setItems([]);
      setItemsError(true);
    }
    if (dRes.ok) {
      const data = await dRes.json();
      setDocs(data.docs ?? []);
    }
    setLoading(false);
  }, [orgKey, tenderId]);

  useEffect(() => {
    router.refresh();
    load();
  }, [load, router]);

  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        setLoading(true);
        load();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [load]);

  if (loading) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem", color: "#64748b" }}>
        Loading…
      </main>
    );
  }

  if (!tender) {
    return (
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
        <p>Tender not found.</p>
        <Link href={`/o/${orgKey}/tenders`} style={{ color: "#2563eb" }}>
          Back to tenders
        </Link>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
      <p style={{ fontSize: "0.875rem", color: "#64748b", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
        <Link href={`/o/${orgKey}/tenders/${tenderId}/setup/step-5`} style={{ color: "#2563eb", textDecoration: "none" }}>
          ← Back to Review
        </Link>
        <button
          type="button"
          onClick={() => { setLoading(true); load(); }}
          style={{ color: "#2563eb", background: "none", border: "none", cursor: "pointer", fontSize: "0.875rem", padding: 0, textDecoration: "underline" }}
        >
          Refresh
        </button>
      </p>
      <h1 style={{ marginBottom: "0.5rem" }}>{tender.title}</h1>
      {tender.description && (
        <p style={{ marginBottom: "1.5rem", color: "var(--foreground)" }}>
          {tender.description}
        </p>
      )}
      {tender.submission_deadline && (
        <p style={{ marginBottom: "1rem" }}>
          Submission deadline:{" "}
          {new Date(tender.submission_deadline).toLocaleString()}
        </p>
      )}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>
          Items (BoQ)
        </h2>
        {itemsError ? (
          <p style={{ color: "#b91c1c", fontSize: "0.875rem" }}>
            Couldn&apos;t load items. Ensure you&apos;re signed in and have access to this tender, then refresh the page.
          </p>
        ) : items.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            No items yet. Add items on Step 3 (Items), save, then refresh this preview.
          </p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>#</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Image</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Description</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Qty</th>
                <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Unit</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id}>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5", verticalAlign: "middle" }}>{i + 1}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5", verticalAlign: "middle" }}>
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt=""
                        style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 4, display: "block" }}
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <span style={{ color: "#94a3b8", fontSize: "0.8125rem" }}>—</span>
                    )}
                  </td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>{item.description}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>{item.quantity}</td>
                  <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>{item.unit ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <section>
        <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>
          Required documents
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {docs.map((d) => (
            <li key={d.id} style={{ marginBottom: "0.25rem" }}>
              {d.name} (required)
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

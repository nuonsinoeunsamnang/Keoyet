"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

const steps = [
  { num: 1, label: "Basics", path: "step-1" },
  { num: 2, label: "Timeline", path: "step-2" },
  { num: 3, label: "Items", path: "step-3" },
  { num: 4, label: "Documents", path: "step-4" },
  { num: 5, label: "Review", path: "step-5" },
];

const inputBase = {
  display: "block",
  width: "100%",
  padding: "0.5rem 0.75rem",
  border: `1px solid ${theme.grayInputBorder}`,
  borderRadius: 6,
  fontSize: "0.9375rem",
  marginTop: "0.25rem",
} as const;

const labelStyle = {
  display: "block",
  fontSize: "0.875rem",
  fontWeight: 500,
  color: "#374151",
} as const;

const helperStyle = {
  fontSize: "0.8125rem",
  color: theme.grayMuted,
  marginTop: "0.25rem",
} as const;

export default function SetupStep1Page() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const base = `/o/${orgKey}/tenders/${tenderId}/setup`;

  const [tenderTitle, setTenderTitle] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [category, setCategory] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}`);
    if (!res.ok) return;
    const t = await res.json();
    setTenderTitle(t.title ?? "");
    setReferenceId(t.reference_id ?? "");
    setCategory(t.category ?? "");
    setDeliveryLocation(t.delivery_location ?? "");
    setLoading(false);
  }, [orgKey, tenderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveDraft() {
    setSaving(true);
    await fetch(`/api/o/${orgKey}/tenders/${tenderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: tenderTitle || "Untitled Tender",
        reference_id: referenceId || null,
        category: category || null,
        delivery_location: deliveryLocation || null,
      }),
    });
    setSaving(false);
  }

  async function saveAndContinue(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/o/${orgKey}/tenders/${tenderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: tenderTitle || "Untitled Tender",
        reference_id: referenceId || null,
        category: category || null,
        delivery_location: deliveryLocation || null,
      }),
    });
    setSaving(false);
    router.push(`${base}/step-2`);
  }

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: theme.grayMuted }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <nav
        style={{
          fontSize: "0.875rem",
          color: theme.grayMuted,
          marginBottom: "0.5rem",
        }}
      >
        <Link
          href={`/o/${orgKey}`}
          style={{ color: theme.grayMuted, textDecoration: "none" }}
        >
          Dashboard
        </Link>
        <span style={{ margin: "0 0.375rem" }}>/</span>
        <span style={{ color: "var(--foreground)" }}>Create Tender</span>
      </nav>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              marginBottom: "0.25rem",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Create Tender
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.9375rem",
              color: theme.grayMuted,
            }}
          >
            Add basic information. You can complete the rest later.
          </p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          <Button
            type="button"
            onClick={() => router.push(`/o/${orgKey}/tenders`)}
            style={{
              background: theme.white,
              border: `1px solid ${theme.grayInputBorder}`,
              borderRadius: 6,
              color: "#374151",
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            style={{
              background: theme.blueBorder,
              color: theme.blue,
              border: `1px solid ${theme.blue}`,
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            form="step1-form"
            disabled={saving}
            style={{
              background: theme.blue,
              color: theme.white,
              border: "none",
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            Save & Continue
          </Button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {steps.map((s) => (
          <div
            key={s.path}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              fontSize: "0.875rem",
              color: s.path === "step-1" ? "#0a0a0a" : theme.grayMuted,
              fontWeight: s.path === "step-1" ? 600 : 400,
            }}
          >
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: s.path === "step-1" ? theme.blue : theme.grayInputBorder,
                color: s.path === "step-1" ? theme.white : "#374151",
                border: "none",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "0.75rem",
              }}
            >
              {s.num}
            </span>
            <span>{s.label}</span>
            {s.num < 5 && (
              <span
                style={{
                  width: 20,
                  height: 1,
                  background: theme.grayInputBorder,
                  marginLeft: "0.25rem",
                }}
              />
            )}
          </div>
        ))}
      </div>

      <form id="step1-form" onSubmit={saveAndContinue}>
        <Card
          style={{
            marginBottom: "1.25rem",
            padding: "1.25rem",
            border: `1px solid ${theme.grayInputBorder}`,
            background: theme.white,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <h2
            style={{
              margin: 0,
              marginBottom: "0.25rem",
              fontSize: "1rem",
              fontWeight: 600,
              color: "#0a0a0a",
            }}
          >
            Tender Identification
          </h2>
          <p style={{ margin: 0, fontSize: "0.8125rem", color: theme.grayMuted, marginBottom: "1rem" }}>
            Internal identification used for tracking.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label htmlFor="tender-title" style={labelStyle}>
                Tender Title *
              </label>
              <input
                id="tender-title"
                type="text"
                value={tenderTitle}
                onChange={(e) => setTenderTitle(e.target.value)}
                placeholder="e.g., Supply of IT Equipment for FY2026"
                required
                style={inputBase}
              />
              <p style={helperStyle}>
                This is what vendors will see on the tender page.
              </p>
            </div>
            <div>
              <label htmlFor="reference-id" style={labelStyle}>
                Tender Reference ID *
              </label>
              <input
                id="reference-id"
                type="text"
                value={referenceId}
                onChange={(e) => setReferenceId(e.target.value)}
                placeholder="e.g., RFQ-FY26-ITEquipment-006"
                style={inputBase}
              />
              <p style={helperStyle}>
                Use your internal reference number for tracking and audit.
              </p>
            </div>
            <div>
              <label htmlFor="category" style={labelStyle}>
                Category *
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ ...inputBase, cursor: "pointer" }}
              >
                <option value="">Select category</option>
                <option value="goods">Goods</option>
                <option value="services">Services</option>
                <option value="works">Works</option>
                <option value="consultancy">Consultancy</option>
              </select>
            </div>
            <div>
              <label htmlFor="delivery-location" style={labelStyle}>
                Delivery / Work Location *
              </label>
              <input
                id="delivery-location"
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                placeholder="e.g., Phnom Penh, Cambodia"
                style={inputBase}
              />
              <p style={helperStyle}>
                Where goods will be delivered or work will take place.
              </p>
            </div>
          </div>
        </Card>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            paddingTop: "0.5rem",
          }}
        >
          <Button
            type="button"
            onClick={() => router.push(`/o/${orgKey}/tenders`)}
            style={{
              background: theme.white,
              border: `1px solid ${theme.grayInputBorder}`,
              borderRadius: 6,
              color: "#374151",
            }}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            style={{
              background: theme.blueBorder,
              color: theme.blue,
              border: `1px solid ${theme.blue}`,
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            Save Draft
          </Button>
          <Button
            type="submit"
            disabled={saving}
            style={{
              background: theme.blue,
              color: theme.white,
              border: "none",
              borderRadius: 6,
              fontWeight: 500,
            }}
          >
            {saving ? "Saving…" : "Save & Continue"}
          </Button>
        </div>
      </form>
    </div>
  );
}

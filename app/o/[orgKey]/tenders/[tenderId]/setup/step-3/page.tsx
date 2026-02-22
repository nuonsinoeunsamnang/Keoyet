"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { theme } from "@/lib/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ItemsTable } from "@/components/tables/ItemsTable";
import type { ItemRow } from "@/components/tables/ItemsTable";

const steps = [
  { num: 1, label: "Basics", path: "step-1" },
  { num: 2, label: "Timeline", path: "step-2" },
  { num: 3, label: "Items", path: "step-3" },
  { num: 4, label: "Documents", path: "step-4" },
  { num: 5, label: "Review", path: "step-5" },
];

const ACCEPTED_FILE_TYPES = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";
const ACCEPTED_TYPES_STR = "PDF, DOCX, XLSX, JPG, PNG";

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={theme.grayInputBorder} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={theme.grayMuted} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  );
}

export default function SetupStep3Page() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const base = `/o/${orgKey}/tenders/${tenderId}/setup`;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [tenderTitle, setTenderTitle] = useState("");
  const [referenceId, setReferenceId] = useState("");
  const [items, setItems] = useState<ItemRow[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const loadIdRef = useRef(0);
  const itemsRef = useRef<ItemRow[]>([]);
  itemsRef.current = items;

  const load = useCallback(async () => {
    const loadId = ++loadIdRef.current;
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}`, { cache: "no-store" });
    if (!res.ok) return;
    const t = await res.json();
    setTenderTitle(t.title ?? "");
    setReferenceId(t.reference_id ?? "");
    const itemsRes = await fetch(`/api/o/${orgKey}/tenders/${tenderId}/items`, { cache: "no-store" });
    let list: ItemRow[] = [];
    if (itemsRes.ok) {
      const data = await itemsRes.json();
      list = (data.items ?? []).map(
        (i: {
          sort_order: number;
          description: string;
          quantity: number;
          unit?: string;
          notes?: string;
          image_url?: string | null;
        }) => ({
          sort_order: i.sort_order,
          description: i.description ?? "",
          quantity: i.quantity ?? 1,
          unit: i.unit ?? "",
          notes: i.notes ?? "",
          image_url: i.image_url ?? "",
        })
      );
    }
    if (loadId === loadIdRef.current) {
      const currentItems = itemsRef.current;
      const dontOverwriteUserRows = currentItems.length > 0 && list.length === 0;
      if (!dontOverwriteUserRows) {
        setItems(list);
      }
    }
    setLoading(false);
  }, [orgKey, tenderId]);

  useEffect(() => {
    load();
  }, [load]);

  const addItem = useCallback(() => {
    setItems((prev) => [
      ...prev,
      {
        sort_order: prev.length,
        description: "",
        quantity: 1,
        unit: "",
        notes: "",
        image_url: "",
      },
    ]);
  }, []);

  const removeItem = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const showEmptyState = items.length === 0;

  function buildItemsPayload(list: ItemRow[]) {
    return list.map((i, idx) => ({
      sort_order: idx,
      description: i.description.trim() || "",
      quantity: Number(i.quantity) >= 0 ? Number(i.quantity) : 0,
      unit: i.unit?.trim() || null,
      notes: i.notes?.trim() || null,
      image_url: (() => {
        const u = i.image_url?.trim();
        if (!u) return null;
        try {
          const url = new URL(u);
          return url.protocol === "http:" || url.protocol === "https:" ? u : null;
        } catch {
          return null;
        }
      })(),
    }));
  }

  async function saveDraft() {
    setSaveError(null);
    setSaving(true);
    const payload = buildItemsPayload(items);
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}/items`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      const msg = data?.error ?? "Failed to save items. Please try again.";
      const fieldErrs = data?.details?.fieldErrors
        ? Object.entries(data.details.fieldErrors).flatMap(([k, v]) => (v as string[]).map((e) => `${k}: ${e}`)).join(". ")
        : "";
      const serverDetail = typeof data?.details === "string" ? data.details : "";
      setSaveError([msg, fieldErrs, serverDetail].filter(Boolean).join(" "));
    } else {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      if (Array.isArray(data.items)) {
        setItems(
          data.items.map(
            (i: { sort_order: number; description: string; quantity: number; unit?: string; notes?: string; image_url?: string }) => ({
              sort_order: i.sort_order,
              description: i.description ?? "",
              quantity: i.quantity ?? 1,
              unit: i.unit ?? "",
              notes: i.notes ?? "",
              image_url: i.image_url ?? "",
            })
          )
        );
      } else {
        load();
      }
    }
  }

  async function saveAndContinue(e: React.FormEvent) {
    e.preventDefault();
    setSaveError(null);
    const toSave = items.filter((i) => i.description.trim());
    if (toSave.length === 0) {
      setSaveError("Add at least one item with a description before continuing.");
      return;
    }
    setSaving(true);
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}/items`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: buildItemsPayload(toSave) }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) {
      const msg = data?.error ?? "Failed to save items. Please try again.";
      const fieldErrs = data?.details?.fieldErrors
        ? Object.entries(data.details.fieldErrors).flatMap(([k, v]) => (v as string[]).map((e) => `${k}: ${e}`)).join(". ")
        : "";
      const serverDetail = typeof data?.details === "string" ? data.details : "";
      setSaveError([msg, fieldErrs, serverDetail].filter(Boolean).join(" "));
      return;
    }
    setSaveSuccess(true);
    await load();
    router.push(`${base}/step-4`);
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...chosen]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const dropped = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...dropped]);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function onDragLeave() {
    setDragOver(false);
  }

  const navButtons = (
    <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
      <Button
        type="button"
        onClick={() => router.push(`${base}/step-2`)}
        style={{
          background: theme.white,
          border: `1px solid ${theme.grayInputBorder}`,
          borderRadius: 6,
          color: "#374151",
        }}
      >
        ← Back
      </Button>
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
        form="step3-form"
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
  );

  if (loading) {
    return (
      <div style={{ padding: "2rem", color: theme.grayMuted }}>
        Loading…
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", paddingBottom: "4rem" }}>
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
        <span style={{ color: "var(--dashboard-fg, #0a0a0a)" }}>Create Tender</span>
      </nav>

      <div style={{ marginBottom: "1.5rem" }}>
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
          Add items vendors will price. You can attach supporting documents.
        </p>
      </div>
      {saveError && (
        <p style={{ margin: 0, marginBottom: "1rem", color: "#b91c1c", fontSize: "0.875rem" }}>
          {saveError}
        </p>
      )}
      {saveSuccess && (
        <p style={{ margin: 0, marginBottom: "1rem", color: "#15803d", fontSize: "0.875rem", fontWeight: 500 }}>
          Items saved. They will appear on the Review page and on the public tender page.
        </p>
      )}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          flexWrap: "nowrap",
          padding: "0.75rem 1rem",
          marginBottom: "1.5rem",
          background: theme.blueLight,
          borderRadius: 8,
          border: `1px solid ${theme.blueBorder}`,
        }}
      >
        <span style={{ color: theme.blue, flexShrink: 0 }}>
          <DocumentIcon />
        </span>
        <span
          style={{
            fontSize: "0.9375rem",
            fontWeight: 500,
            color: theme.blueTitle,
            flexShrink: 0,
          }}
        >
          {tenderTitle || "Untitled"}
        </span>
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: theme.blue,
            opacity: 0.6,
            flexShrink: 0,
          }}
          aria-hidden
        />
        <span
          style={{
            fontSize: "0.9375rem",
            fontWeight: 500,
            color: theme.blueTitle,
            flexShrink: 0,
          }}
        >
          {referenceId || "—"}
        </span>
        <span
          style={{
            width: 4,
            height: 4,
            borderRadius: "50%",
            background: theme.blue,
            opacity: 0.6,
            flexShrink: 0,
          }}
          aria-hidden
        />
        <span
          style={{
            marginLeft: "auto",
            padding: "0.25rem 0.5rem",
            borderRadius: 9999,
            fontSize: "0.75rem",
            fontWeight: 500,
            background: theme.blueBorder,
            color: theme.blueText,
            flexShrink: 0,
          }}
        >
          Draft
        </span>
      </div>

      <div
        style={{
          display: "flex",
          gap: "0.5rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        {steps.map((s) => {
          const isCurrent = s.path === "step-3";
          const isComplete = s.num < 3;
          return (
            <div
              key={s.path}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "0.875rem",
                color: isCurrent ? "#0a0a0a" : theme.grayMuted,
                fontWeight: isCurrent ? 600 : 400,
              }}
            >
              <span
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: "50%",
                  background: isComplete
                    ? theme.green
                    : isCurrent
                      ? theme.blue
                      : theme.grayInputBorder,
                  color: isComplete || isCurrent ? theme.white : "#374151",
                  border: "none",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                }}
              >
                {isComplete ? "✓" : s.num}
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
          );
        })}
      </div>

      <form id="step3-form" onSubmit={saveAndContinue}>
        <Card
          style={{
            marginBottom: "1.5rem",
            padding: "1.25rem",
            border: `1px solid ${theme.grayInputBorder}`,
            background: theme.white,
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "0.75rem",
              marginBottom: "0.5rem",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  marginBottom: "0.25rem",
                  fontSize: "1rem",
                  fontWeight: 600,
                  color: "#0a0a0a",
                }}
              >
                Items
              </h2>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: theme.grayMuted,
                }}
              >
                Add the items vendors will price. Each row becomes a line item in the bid form.
              </p>
            </div>
            <Button
              type="button"
              onClick={addItem}
              style={{
                background: theme.blue,
                color: theme.white,
                border: "none",
                borderRadius: 6,
                fontWeight: 500,
              }}
            >
              + Add Item
            </Button>
          </div>

          {showEmptyState ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "2.5rem 1.5rem",
                border: `1px dashed ${theme.grayInputBorder}`,
                borderRadius: 8,
                background: theme.grayBg,
                marginTop: "1rem",
              }}
            >
              <ListIcon />
              <p
                style={{
                  margin: "1rem 0 0.25rem",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "#374151",
                }}
              >
                No items added yet
              </p>
              <p
                style={{
                  margin: 0,
                  fontSize: "0.875rem",
                  color: theme.grayMuted,
                }}
              >
                Start by adding your first item to the tender.
              </p>
              <Button
                type="button"
                onClick={addItem}
                style={{
                  marginTop: "1.25rem",
                  background: theme.blue,
                  color: theme.white,
                  border: "none",
                  borderRadius: 6,
                  fontWeight: 500,
                }}
              >
                + Add your first item
              </Button>
            </div>
          ) : (
            <div style={{ marginTop: "1rem" }}>
              <ItemsTable
                items={items}
                onChange={setItems}
                onAdd={addItem}
                onRemove={removeItem}
              />
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              background: theme.blueLight,
              borderRadius: 6,
              border: `1px solid ${theme.blueBorder}`,
            }}
          >
            <span style={{ color: theme.blue, marginTop: 2 }}>
              <InfoIcon />
            </span>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: theme.blueText,
              }}
            >
              These items will appear in the vendor pricing form and in the price comparison view. Click <strong>Save Draft</strong> or <strong>Save & Continue</strong> to save your items so they show on the Review and public tender pages.
            </p>
          </div>
        </Card>

        <Card
          style={{
            marginBottom: "1.5rem",
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
            Attachments (optional)
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: "0.875rem",
              color: theme.grayMuted,
              marginBottom: "1rem",
            }}
          >
            Upload BoQ files, drawings, or specifications to help vendors understand the tender.
          </p>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
              border: `2px dashed ${dragOver ? theme.blue : theme.grayInputBorder}`,
              borderRadius: 8,
              background: dragOver ? theme.blueLight : theme.grayBg,
              cursor: "pointer",
              transition: "border-color 0.15s, background 0.15s",
            }}
          >
            <UploadIcon />
            <p
              style={{
                margin: "0.75rem 0 0.25rem",
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "#374151",
              }}
            >
              Upload files
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "0.875rem",
                color: theme.grayMuted,
              }}
            >
              Drag and drop files here, or click to browse
            </p>
            <p
              style={{
                margin: "0.5rem 0 0",
                fontSize: "0.8125rem",
                color: theme.grayMuted,
              }}
            >
              Supports {ACCEPTED_TYPES_STR}
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_FILE_TYPES}
              multiple
              onChange={onFileChange}
              style={{ display: "none" }}
            />
          </div>
          {files.length > 0 && (
            <ul
              style={{
                margin: "0.75rem 0 0",
                paddingLeft: "1.25rem",
                fontSize: "0.875rem",
                color: theme.grayMuted,
              }}
            >
              {files.map((f, i) => (
                <li key={i}>{f.name}</li>
              ))}
            </ul>
          )}
        </Card>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            flexWrap: "wrap",
            paddingTop: "0.5rem",
          }}
        >
          {navButtons}
        </div>
      </form>

      <div
        style={{
          position: "fixed",
          bottom: "1.5rem",
          right: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.5rem 1rem",
          background: theme.blue,
          color: theme.white,
          borderRadius: 9999,
          boxShadow: "0 2px 8px rgba(37, 99, 235, 0.35)",
          cursor: "pointer",
          fontSize: "0.875rem",
          fontWeight: 500,
        }}
        role="button"
        tabIndex={0}
        onClick={() => {}}
        onKeyDown={(e) => e.key === "Enter" && (() => {})()}
      >
        <HelpIcon />
        Help
      </div>
    </div>
  );
}

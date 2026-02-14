"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function SetupStep5Page() {
  const params = useParams();
  const router = useRouter();
  const orgKey = params.orgKey as string;
  const tenderId = params.tenderId as string;
  const [tender, setTender] = useState<{ title: string; status: string } | null>(null);
  const [publishing, setPublishing] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}`);
    if (!res.ok) return;
    const t = await res.json();
    setTender(t);
  }, [orgKey, tenderId]);

  useEffect(() => {
    load();
  }, [load]);

  async function handlePublish() {
    setPublishing(true);
    const res = await fetch(`/api/o/${orgKey}/tenders/${tenderId}/publish`, {
      method: "POST",
    });
    setPublishing(false);
    if (res.ok) {
      router.push(`/o/${orgKey}/tenders/${tenderId}/manage/submissions`);
    }
  }

  if (!tender) return <p>Loading…</p>;

  return (
    <div>
      <h1>Step 5: Review & Publish</h1>
      <p style={{ marginTop: "1rem" }}>
        Tender: <strong>{tender.title}</strong> ({tender.status})
      </p>
      <p style={{ marginTop: "1rem" }}>
        {tender.status === "published" ? (
          <a href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions`}>
            Go to manage
          </a>
        ) : (
          <button onClick={handlePublish} disabled={publishing}>
            {publishing ? "Publishing…" : "Publish"}
          </button>
        )}
      </p>
    </div>
  );
}

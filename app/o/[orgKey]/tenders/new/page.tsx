"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function NewTenderPage() {
  const router = useRouter();
  const params = useParams();
  const orgKey = params.orgKey as string;
  const [status, setStatus] = useState<"idle" | "creating" | "error">("idle");

  useEffect(() => {
    if (status !== "idle") return;
    setStatus("creating");
    fetch(`/api/o/${orgKey}/tenders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          router.replace(`/o/${orgKey}/tenders/${data.id}/setup/step-1`);
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [orgKey, router, status]);

  if (status === "error") {
    return (
      <div>
        <p>Failed to create tender.</p>
        <a href={`/o/${orgKey}/tenders`}>Back to tenders</a>
      </div>
    );
  }
  return <p>Creating tender…</p>;
}

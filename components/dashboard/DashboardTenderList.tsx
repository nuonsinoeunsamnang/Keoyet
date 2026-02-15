"use client";

import { useRouter } from "next/navigation";
import { TenderListTable } from "@/components/dashboard/TenderListTable";
import { Button } from "@/components/ui/Button";
import { theme } from "@/lib/theme";
import type { TenderWithMeta } from "@/lib/dashboard";

export function DashboardTenderList({
  tenders,
  orgKey,
}: {
  tenders: TenderWithMeta[];
  orgKey: string;
}) {
  const router = useRouter();

  return (
    <section>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "0.75rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: "1rem",
            fontWeight: 600,
          }}
        >
          Tender List
        </h2>
        <Button
          type="button"
          onClick={() => router.refresh()}
          style={{
            background: theme.white,
            border: `1px solid ${theme.grayInputBorder}`,
            borderRadius: 6,
            color: "#374151",
            padding: "0.375rem 0.75rem",
            fontSize: "0.875rem",
          }}
        >
          Refresh
        </Button>
      </div>
      <TenderListTable tenders={tenders} orgKey={orgKey} />
    </section>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from "@/lib/theme";

const TABS: { href: string; label: string }[] = [
  { href: "qa", label: "Q&A" },
  { href: "vendors", label: "Vendors" },
  { href: "submissions", label: "Submissions" },
  { href: "compare", label: "Compare & Award" },
];

export function ManageTabs({
  orgKey,
  tenderId,
}: {
  orgKey: string;
  tenderId: string;
}) {
  const pathname = usePathname();
  const base = `/o/${orgKey}/tenders/${tenderId}/manage`;
  const segment = pathname?.replace(base, "").split("/").filter(Boolean)[0] ?? "";
  const activeTab = segment || "submissions";

  return (
    <nav
      style={{
        display: "flex",
        gap: "0.5rem",
        marginBottom: "1rem",
        borderBottom: `1px solid ${theme.grayBorder}`,
      }}
    >
      {TABS.map(({ href, label }) => {
        const isActive = activeTab === href;
        return (
          <Link
            key={href}
            href={`${base}/${href}`}
            style={{
              padding: "0.625rem 1rem",
              fontSize: "0.875rem",
              fontWeight: 500,
              color: isActive ? theme.blue : theme.grayMuted,
              textDecoration: "none",
              borderBottom: isActive
                ? `2px solid ${theme.blue}`
                : "2px solid transparent",
              marginBottom: -1,
            }}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from "@/lib/theme";

const navItemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  padding: "0.625rem 1rem",
  textDecoration: "none",
  color: "inherit",
  borderRadius: "0 6px 6px 0",
  fontSize: "0.9375rem",
};

const iconStyle: React.CSSProperties = { width: 20, height: 20, flexShrink: 0 };

function DashboardIcon({ active }: { active: boolean }) {
  const color = active ? theme.white : theme.grayMuted;
  return (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function TendersIcon({ active }: { active: boolean }) {
  const color = active ? theme.white : theme.grayMuted;
  return (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function VendorsIcon({ active }: { active: boolean }) {
  const color = active ? theme.white : theme.grayMuted;
  return (
    <svg style={iconStyle} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V2l-9-7-9 7v11z" />
      <path d="M9 22V12h6v10" />
    </svg>
  );
}

export function Sidebar({
  orgKey,
  orgName,
}: {
  orgKey: string;
  orgName: string | null;
}) {
  const pathname = usePathname();
  const base = `/o/${orgKey}`;
  const isDashboard = pathname === base || pathname === `${base}/`;
  const isTenders = pathname?.startsWith(`${base}/tenders`);
  const isVendors = pathname?.startsWith(`${base}/vendors`);

  return (
    <aside
      style={{
        width: 240,
        minHeight: "100vh",
        borderRight: `1px solid ${theme.grayBorder}`,
        padding: "1.25rem 0",
        background: theme.grayBg,
        borderBottomLeftRadius: 8,
      }}
    >
      <div style={{ padding: "0 1rem 1.25rem", borderBottom: `1px solid ${theme.grayBorder}`, marginBottom: "0.5rem" }}>
        <span style={{ fontWeight: 700, fontSize: "1.125rem", color: "#374151" }}>
          {orgName || "Keoyet"}
        </span>
      </div>
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.125rem" }}>
        <Link
          href={base}
          style={{
            ...navItemStyle,
            ...(isDashboard ? { background: theme.blue, color: theme.white, fontWeight: 600 } : { color: "#374151" }),
          }}
        >
          <DashboardIcon active={isDashboard} />
          Dashboard
        </Link>
        <Link
          href={`${base}/tenders`}
          style={{
            ...navItemStyle,
            ...(isTenders && !isVendors ? { background: theme.blue, color: theme.white, fontWeight: 600 } : { color: "#374151" }),
          }}
        >
          <TendersIcon active={isTenders && !isVendors} />
          My Tenders
        </Link>
        <Link
          href={`${base}/vendors`}
          style={{
            ...navItemStyle,
            ...(isVendors ? { background: theme.blue, color: theme.white, fontWeight: 600 } : { color: "#374151" }),
          }}
        >
          <VendorsIcon active={isVendors} />
          Vendors
        </Link>
      </nav>
    </aside>
  );
}

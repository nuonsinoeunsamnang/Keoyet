import Link from "next/link";

export function Sidebar({
  orgKey,
  orgName,
}: {
  orgKey: string;
  orgName: string | null;
}) {
  return (
    <aside
      style={{
        width: 220,
        borderRight: "1px solid #e5e5e5",
        padding: "1rem 0",
        background: "var(--background)",
      }}
    >
      <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <Link
          href={`/o/${orgKey}`}
          style={{ padding: "0.5rem 1rem", textDecoration: "none" }}
        >
          Dashboard
        </Link>
        <Link
          href={`/o/${orgKey}/tenders`}
          style={{ padding: "0.5rem 1rem", textDecoration: "none" }}
        >
          Tenders
        </Link>
      </nav>
    </aside>
  );
}

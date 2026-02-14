import Link from "next/link";

export function TenderHeader({
  title,
  status,
  orgKey,
  tenderId,
}: {
  title: string;
  status: string;
  orgKey: string;
  tenderId: string;
}) {
  return (
    <header
      style={{
        marginBottom: "1rem",
        paddingBottom: "0.75rem",
        borderBottom: "1px solid #e5e5e5",
      }}
    >
      <Link
        href={`/o/${orgKey}/tenders`}
        style={{ fontSize: "0.875rem", textDecoration: "underline" }}
      >
        Tenders
      </Link>
      <span style={{ margin: "0 0.5rem" }}>/</span>
      <span style={{ fontWeight: 600 }}>{title}</span>
      <span style={{ marginLeft: "0.5rem", opacity: 0.8 }}>({status})</span>
    </header>
  );
}

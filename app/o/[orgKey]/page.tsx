import Link from "next/link";
import { getTendersByWorkspace } from "@/lib/tenders";
import { getOrgByKey } from "@/lib/org";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgKey: string }>;
}) {
  const { orgKey } = await params;
  const org = await getOrgByKey(orgKey);
  if (!org) return null;
  const tenders = await getTendersByWorkspace(org.id);

  const withAction = tenders.filter(
    (t) => t.status === "published"
  );

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Dashboard</h1>
      <p style={{ marginBottom: "1.5rem", color: "var(--foreground)" }}>
        Triage: tenders and action items.
      </p>

      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>
          Tenders ({tenders.length})
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tenders.slice(0, 10).map((t) => (
            <li key={t.id} style={{ marginBottom: "0.5rem" }}>
              <Link
                href={`/o/${orgKey}/tenders/${t.id}/manage/submissions`}
                style={{ textDecoration: "underline" }}
              >
                {t.title}
              </Link>
              <span style={{ marginLeft: "0.5rem", opacity: 0.8 }}>
                ({t.status})
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p>
        <Link
          href={`/o/${orgKey}/tenders`}
          style={{ textDecoration: "underline" }}
        >
          View all tenders
        </Link>
        {" · "}
        <Link
          href={`/o/${orgKey}/tenders/new`}
          style={{ textDecoration: "underline" }}
        >
          New tender
        </Link>
      </p>
    </div>
  );
}

import Link from "next/link";
import { getTendersByWorkspace } from "@/lib/tenders";
import { getOrgByKey } from "@/lib/org";

export const dynamic = "force-dynamic";

export default async function TendersListPage({
  params,
}: {
  params: Promise<{ orgKey: string }>;
}) {
  const { orgKey } = await params;
  const org = await getOrgByKey(orgKey);
  if (!org) return null;
  const tenders = await getTendersByWorkspace(org.id);

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Tenders</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        <Link
          href={`/o/${orgKey}/tenders/new`}
          style={{ textDecoration: "underline" }}
        >
          New tender
        </Link>
      </p>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tenders.map((t) => (
          <li
            key={t.id}
            style={{
              padding: "0.75rem",
              border: "1px solid #e5e5e5",
              marginBottom: "0.5rem",
              borderRadius: 4,
            }}
          >
            <Link
              href={`/o/${orgKey}/tenders/${t.id}/setup/step-1`}
              style={{ fontWeight: 500, textDecoration: "underline" }}
            >
              {t.title}
            </Link>
            <span style={{ marginLeft: "0.5rem", opacity: 0.8 }}>
              {t.status}
            </span>
            {t.status === "published" && (
              <>
                {" · "}
                <Link
                  href={`/o/${orgKey}/tenders/${t.id}/manage/submissions`}
                  style={{ textDecoration: "underline" }}
                >
                  Manage
                </Link>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

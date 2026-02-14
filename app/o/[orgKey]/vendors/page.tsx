import Link from "next/link";
import { getVendorsByWorkspace } from "@/lib/vendors";
import { getOrgByKey } from "@/lib/org";
import { getTendersByWorkspace } from "@/lib/tenders";
import { theme } from "@/lib/theme";

export default async function VendorsListPage({
  params,
}: {
  params: Promise<{ orgKey: string }>;
}) {
  const { orgKey } = await params;
  const org = await getOrgByKey(orgKey);
  if (!org) return null;
  const [vendors, tenders] = await Promise.all([
    getVendorsByWorkspace(org.id),
    getTendersByWorkspace(org.id),
  ]);

  return (
    <div>
      <h1 style={{ marginBottom: "0.25rem", fontSize: "1.5rem", fontWeight: 700 }}>
        Vendors
      </h1>
      <p style={{ marginBottom: "1.5rem", color: theme.grayMuted, fontSize: "0.9375rem" }}>
        All vendors in this workspace
      </p>
      {vendors.length === 0 ? (
        <p style={{ color: "var(--foreground)" }}>
          No vendors yet. Vendors appear when they submit to a tender.
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {vendors.map((v) => (
            <li
              key={v.id}
              style={{
                padding: "0.75rem 1rem",
                border: `1px solid ${theme.grayBorder}`,
                marginBottom: "0.5rem",
                borderRadius: 8,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontWeight: 500 }}>{v.name}</span>
                {v.contact_email && (
                  <span style={{ marginLeft: "0.5rem", color: theme.grayMuted, fontSize: "0.875rem" }}>
                    {v.contact_email}
                  </span>
                )}
                <span
                  style={{
                    marginLeft: "0.5rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: 4,
                    fontSize: "0.75rem",
                    background:
                      v.status === "approved"
                        ? theme.greenLighter
                        : v.status === "rejected"
                        ? theme.redLight
                        : theme.amberLight,
                  }}
                >
                  {v.status}
                </span>
              </div>
              {tenders.length > 0 && (
                <Link
                  href={`/o/${orgKey}/tenders/${tenders[0].id}/manage/vendors`}
                  style={{ fontSize: "0.875rem", color: theme.blue, textDecoration: "none" }}
                >
                  View in tender
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

import Link from "next/link";
import { unstable_noStore } from "next/cache";
import {
  getDashboardWorkQueueCounts,
  getTendersWithMeta,
} from "@/lib/dashboard";
import { getOrgByKey } from "@/lib/org";
import { theme } from "@/lib/theme";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TenderListTable } from "@/components/dashboard/TenderListTable";
import { DashboardTenderList } from "@/components/dashboard/DashboardTenderList";

export const dynamic = "force-dynamic";

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgKey: string }>;
}) {
  unstable_noStore();
  const { orgKey } = await params;
  const org = await getOrgByKey(orgKey);
  if (!org) return null;

  const [counts, tenders] = await Promise.all([
    getDashboardWorkQueueCounts(org.id),
    getTendersWithMeta(org.id),
  ]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              marginBottom: "0.25rem",
              fontSize: "1.5rem",
              fontWeight: 700,
            }}
          >
            Dashboard
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: "0.9375rem",
              color: theme.grayMuted,
            }}
          >
            Manage your procurement workflow
          </p>
        </div>
        <Link href={`/o/${orgKey}/tenders/new`}>
          <Button
            style={{
              background: theme.blue,
              color: theme.white,
              border: "none",
              borderRadius: 6,
              padding: "0.5rem 1rem",
              fontWeight: 500,
            }}
          >
            + Create Tender
          </Button>
        </Link>
      </div>

      <section style={{ marginBottom: "1.75rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.75rem",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "1rem",
              fontWeight: 600,
            }}
          >
            My Work Queue
          </h2>
          <span
            style={{
              fontSize: "0.8125rem",
            color: theme.grayMuted,
            }}
            >
            Action Required
          </span>
        </div>
        <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1rem",
            }}
          >
            <Card
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                background: theme.orangeCard,
                borderColor: theme.orangeBorder,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "rgba(234, 88, 12, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.orange}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, marginBottom: "0.25rem", color: theme.orangeTitle }}>
                  Verify vendors
                </div>
                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: theme.orangeText,
                  }}
                >
                  {counts.vendorsPending} vendor
                  {counts.vendorsPending !== 1 ? "s" : ""} pending verification
                </div>
              </div>
              <Link href={`/o/${orgKey}/vendors`}>
                <Button
                  style={{
                    background: theme.orange,
                    color: theme.white,
                    border: "none",
                    borderRadius: 6,
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.875rem",
                  }}
                >
                  Review
                </Button>
              </Link>
            </Card>

            <Card
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                background: theme.blueCard,
                borderColor: theme.blueBorder,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "rgba(37, 99, 235, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.blue}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  <path d="M8 10h.01" />
                  <path d="M12 10h.01" />
                  <path d="M16 10h.01" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, marginBottom: "0.25rem", color: theme.blueTitle }}>
                  Answer questions
                </div>
                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: theme.blueText,
                  }}
                >
                  {counts.questionsPending} question
                  {counts.questionsPending !== 1 ? "s" : ""} pending response
                </div>
              </div>
              <Button
                style={{
                  background: theme.blue,
                  color: theme.white,
                  border: "none",
                  borderRadius: 6,
                  padding: "0.375rem 0.75rem",
                  fontSize: "0.875rem",
                }}
                disabled
              >
                Review
              </Button>
            </Card>

            <Card
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1rem 1.25rem",
                background: theme.greenCard,
                borderColor: theme.greenBorder,
              }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: "rgba(22, 163, 74, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={theme.green}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M12 18v-6" />
                  <path d="M9 15l3 3 3-3" />
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, marginBottom: "0.25rem", color: theme.greenTitle }}>
                  Review submissions
                </div>
                <div
                  style={{
                    fontSize: "0.8125rem",
                    color: theme.greenText,
                  }}
                >
                  {counts.submissionsToReview} new submission
                  {counts.submissionsToReview !== 1 ? "s" : ""} received
                </div>
              </div>
              <Link href={`/o/${orgKey}/tenders`}>
                <Button
                  style={{
                    background: theme.green,
                    color: theme.white,
                    border: "none",
                    borderRadius: 6,
                    padding: "0.375rem 0.75rem",
                    fontSize: "0.875rem",
                  }}
                >
                  Review
                </Button>
              </Link>
            </Card>
          </div>
      </section>

      <DashboardTenderList tenders={tenders} orgKey={orgKey} />
    </div>
  );
}

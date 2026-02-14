import { getTenderBySlug } from "@/lib/tenders";
import { getTenderItems } from "@/lib/tenders";
import { getTenderRequiredDocs } from "@/lib/tenders";
import { notFound } from "next/navigation";

export default async function PublicTenderPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tender = await getTenderBySlug(slug);
  if (!tender || tender.status !== "published") notFound();
  const [items, docs] = await Promise.all([
    getTenderItems(tender.id),
    getTenderRequiredDocs(tender.id),
  ]);

  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ marginBottom: "0.5rem" }}>{tender.title}</h1>
      {tender.description && (
        <p style={{ marginBottom: "1.5rem", color: "var(--foreground)" }}>
          {tender.description}
        </p>
      )}
      {tender.submission_deadline && (
        <p style={{ marginBottom: "1rem" }}>
          Submission deadline:{" "}
          {new Date(tender.submission_deadline).toLocaleString()}
        </p>
      )}
      <section style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>
          Items (BoQ)
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>#</th>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Description</th>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Qty</th>
              <th style={{ textAlign: "left", padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>Unit</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id}>
                <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>{i + 1}</td>
                <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>{item.description}</td>
                <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>{item.quantity}</td>
                <td style={{ padding: "0.5rem", borderBottom: "1px solid #e5e5e5" }}>{item.unit ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 style={{ fontSize: "1.125rem", marginBottom: "0.75rem" }}>
          Required documents
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {docs.map((d) => (
            <li key={d.id} style={{ marginBottom: "0.25rem" }}>
              {d.name} {d.required && "(required)"}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

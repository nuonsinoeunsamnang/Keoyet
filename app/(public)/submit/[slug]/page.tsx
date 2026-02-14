export default function SubmitPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ marginBottom: "1rem" }}>Submit response</h1>
      <p style={{ color: "var(--foreground)" }}>
        Vendor submission page (later). Not implemented in MVP.
      </p>
    </main>
  );
}

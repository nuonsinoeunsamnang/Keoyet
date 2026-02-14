import Link from "next/link";

export default function InvalidWorkspacePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: 480, margin: "0 auto" }}>
      <h1 style={{ marginBottom: "1rem" }}>Workspace not found</h1>
      <p style={{ marginBottom: "1.5rem" }}>
        The workspace link is invalid or the workspace no longer exists.
      </p>
      <Link href="/" style={{ textDecoration: "underline" }}>
        Back to home
      </Link>
    </main>
  );
}

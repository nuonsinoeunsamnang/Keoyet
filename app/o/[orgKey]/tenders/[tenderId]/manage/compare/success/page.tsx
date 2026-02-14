import Link from "next/link";

export default async function AwardSuccessPage({
  params,
}: {
  params: Promise<{ orgKey: string; tenderId: string }>;
}) {
  const { orgKey, tenderId } = await params;

  return (
    <div>
      <h1 style={{ marginBottom: "1rem" }}>Award recorded</h1>
      <p style={{ marginBottom: "1rem" }}>
        The tender has been awarded. You can return to compare or submissions.
      </p>
      <p>
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/compare`}
          style={{ textDecoration: "underline" }}
        >
          Back to compare
        </Link>
        {" · "}
        <Link
          href={`/o/${orgKey}/tenders/${tenderId}/manage/submissions`}
          style={{ textDecoration: "underline" }}
        >
          Submissions
        </Link>
      </p>
    </div>
  );
}

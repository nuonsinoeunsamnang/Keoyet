import { redirect } from "next/navigation";

export default async function ManageTenderPage({
  params,
}: {
  params: Promise<{ orgKey: string; tenderId: string }>;
}) {
  const { orgKey, tenderId } = await params;
  redirect(`/o/${orgKey}/tenders/${tenderId}/manage/submissions`);
}

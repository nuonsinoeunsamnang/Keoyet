import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

/**
 * Tender list lives on Dashboard only (MVP). Redirect so old bookmarks work.
 */
export default async function TendersListPage({
  params,
}: {
  params: Promise<{ orgKey: string }>;
}) {
  const { orgKey } = await params;
  redirect(`/o/${orgKey}`);
}

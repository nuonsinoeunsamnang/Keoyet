import { getSupabase } from "@/lib/db";
import type { Tender } from "@/lib/tenders";

export type WorkQueueCounts = {
  vendorsPending: number;
  questionsPending: number;
  submissionsToReview: number;
};

export type TenderDisplayStatus =
  | "draft"
  | "published"
  | "submission_closed"
  | "evaluation"
  | "awarded";

export type TenderWithMeta = Tender & {
  displayStatus: TenderDisplayStatus;
  nextDeadlineLabel: string;
  nextDeadlineDate: string | null;
  pendingWork: number;
  tenderNumber: string;
};

/**
 * Workspace-level counts for the dashboard work queue.
 */
export async function getDashboardWorkQueueCounts(
  workspaceId: string
): Promise<WorkQueueCounts> {
  const supabase = getSupabase();

  const [vendorsRes, tendersRes] = await Promise.all([
    supabase
      .from("vendors")
      .select("id", { count: "exact", head: true })
      .eq("workspace_id", workspaceId)
      .eq("status", "pending"),
    supabase
      .from("tenders")
      .select("id")
      .eq("workspace_id", workspaceId),
  ]);

  const tenderIds = (tendersRes.data ?? []).map((t) => t.id);
  let submissionsToReview = 0;
  if (tenderIds.length > 0) {
    const { count } = await supabase
      .from("submissions")
      .select("id", { count: "exact", head: true })
      .in("tender_id", tenderIds)
      .in("status", ["submitted", "under_review"]);
    submissionsToReview = count ?? 0;
  }

  return {
    vendorsPending: vendorsRes.count ?? 0,
    questionsPending: 0,
    submissionsToReview,
  };
}

/**
 * Tenders for the workspace with display status, next deadline, and pending work count.
 */
export async function getTendersWithMeta(
  workspaceId: string
): Promise<TenderWithMeta[]> {
  const supabase = getSupabase();

  const { data: tenders, error: tendersError } = await supabase
    .from("tenders")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });

  if (tendersError || !tenders?.length) {
    return [];
  }

  const ids = tenders.map((t) => t.id);

  const [awardsRes, submissionsByTender, vendorsByTender] = await Promise.all([
    supabase.from("awards").select("tender_id").in("tender_id", ids),
    supabase
      .from("submissions")
      .select("tender_id")
      .in("tender_id", ids)
      .in("status", ["submitted", "under_review"]),
    supabase
      .from("submissions")
      .select("tender_id, vendor_id")
      .in("tender_id", ids),
  ]);

  const awardedTenderIds = new Set(
    (awardsRes.data ?? []).map((a) => a.tender_id)
  );

  const submissionCountByTender: Record<string, number> = {};
  (submissionsByTender.data ?? []).forEach((s) => {
    submissionCountByTender[s.tender_id] =
      (submissionCountByTender[s.tender_id] ?? 0) + 1;
  });

  const vendorIdsByTender: Record<string, Set<string>> = {};
  (vendorsByTender.data ?? []).forEach((s) => {
    if (!vendorIdsByTender[s.tender_id])
      vendorIdsByTender[s.tender_id] = new Set();
    vendorIdsByTender[s.tender_id].add(s.vendor_id);
  });

  const pendingVendorIds =
    vendorsByTender.data && vendorsByTender.data.length > 0
      ? (
          await supabase
            .from("vendors")
            .select("id")
            .eq("workspace_id", workspaceId)
            .eq("status", "pending")
        ).data ?? []
      : [];
  const pendingSet = new Set(pendingVendorIds.map((v) => v.id));

  const now = new Date().toISOString();

  return tenders.map((t, index) => {
    const hasAward = awardedTenderIds.has(t.id);
    const submissionDeadline = t.submission_deadline;
    const deadlinePassed =
      !!submissionDeadline && submissionDeadline < now;

    let displayStatus: TenderDisplayStatus = "draft";
    if (hasAward) displayStatus = "awarded";
    else if (t.status === "published" && deadlinePassed)
      displayStatus = "evaluation";
    else if (t.status === "published") displayStatus = "published";
    else displayStatus = "draft";

    let nextDeadlineLabel = "Not published";
    let nextDeadlineDate: string | null = null;
    if (t.status === "published" && submissionDeadline) {
      nextDeadlineLabel = deadlinePassed ? "Evaluation start" : "Submission deadline";
      nextDeadlineDate = submissionDeadline;
    }
    if (hasAward) {
      nextDeadlineLabel = "Contract signing";
      nextDeadlineDate = submissionDeadline;
    }

    const vendorIds = vendorIdsByTender[t.id];
    const pendingVendorsForTender = vendorIds
      ? Array.from(vendorIds).filter((id) => pendingSet.has(id)).length
      : 0;
    const pendingWork =
      (submissionCountByTender[t.id] ?? 0) + pendingVendorsForTender;

    const year = new Date(t.created_at).getFullYear();
    const seq = String(tenders.length - index).padStart(3, "0");
    const tenderNumber = `TND-${year}-${seq}`;

    return {
      ...t,
      displayStatus,
      nextDeadlineLabel,
      nextDeadlineDate,
      pendingWork,
      tenderNumber,
    };
  });
}

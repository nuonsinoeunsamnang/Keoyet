import { getSupabase } from "@/lib/db";

export type ComparisonRow = {
  tender_item_id: string;
  description: string;
  unit: string | null;
  submissions: Array<{ submission_id: string; vendor_name: string; unit_price: number | null; total: number | null }>;
};

export type ComparisonResult = {
  rows: ComparisonRow[];
  submissionIds: string[];
  vendorNames: Record<string, string>;
  totals: Record<string, number>;
};

/**
 * Build comparison matrix for a tender: items x submissions with prices and totals.
 * include: 'compliant' = only submissions with status submitted/under_review; 'all' = all
 */
export async function getComparison(
  tenderId: string,
  include: "compliant" | "all" = "compliant"
): Promise<ComparisonResult> {
  const supabase = getSupabase();

  const [itemsRes, subsRes] = await Promise.all([
    supabase
      .from("tender_items")
      .select("id, description, unit")
      .eq("tender_id", tenderId)
      .order("sort_order"),
    supabase
      .from("submissions")
      .select("id, vendor_id, status")
      .eq("tender_id", tenderId),
  ]);

  const subs = (subsRes.data ?? []) as Array<{ id: string; vendor_id: string; status: string }>;
  const filteredSubs =
    include === "compliant"
      ? subs.filter((s) =>
          ["submitted", "under_review", "awarded"].includes(s.status)
        )
      : subs;
  const submissionIdsForQuery = filteredSubs.map((s) => s.id);
  if (submissionIdsForQuery.length === 0) {
    const items = (itemsRes.data ?? []) as Array<{ id: string; description: string; unit: string | null }>;
    return {
      rows: items.map((item) => ({
        tender_item_id: item.id,
        description: item.description,
        unit: item.unit,
        submissions: [] as ComparisonRow["submissions"],
      })),
      submissionIds: [],
      vendorNames: {},
      totals: {},
    };
  }

  const { data: itemsDataRes } = await supabase
    .from("submission_items")
    .select("submission_id, tender_item_id, unit_price, total")
    .in("submission_id", submissionIdsForQuery);

  const items = (itemsRes.data ?? []) as Array<{
    id: string;
    description: string;
    unit: string | null;
  }>;

  const vendorIds = Array.from(new Set(filteredSubs.map((s) => s.vendor_id)));
  const { data: vendorsData } = await supabase
    .from("vendors")
    .select("id, name")
    .in("id", vendorIds);
  const vendorNames: Record<string, string> = {};
  (vendorsData ?? []).forEach((v: { id: string; name: string }) => {
    vendorNames[v.id] = v.name;
  });

  const itemsData = (itemsDataRes ?? []) as Array<{
    submission_id: string;
    tender_item_id: string;
    unit_price: number | null;
    total: number | null;
  }>;

  const byItem = new Map<
    string,
    Array<{ submission_id: string; unit_price: number | null; total: number | null }>
  >();
  itemsData.forEach((row) => {
    const key = row.tender_item_id;
    if (!byItem.has(key)) byItem.set(key, []);
    byItem.get(key)!.push({
      submission_id: row.submission_id,
      unit_price: row.unit_price,
      total: row.total,
    });
  });

  const submissionIds = filteredSubs.map((s) => s.id);
  const totals: Record<string, number> = {};
  submissionIds.forEach((id) => (totals[id] = 0));

  const rows: ComparisonRow[] = items.map((item) => {
    const subRows = byItem.get(item.id) ?? [];
    const submissionCells = filteredSubs.map((s) => {
      const cell = subRows.find((r) => r.submission_id === s.id);
      const total = cell?.total ?? null;
      if (total != null) totals[s.id] = (totals[s.id] ?? 0) + total;
      return {
        submission_id: s.id,
        vendor_name: vendorNames[s.vendor_id] ?? "",
        unit_price: cell?.unit_price ?? null,
        total,
      };
    });
    return {
      tender_item_id: item.id,
      description: item.description,
      unit: item.unit,
      submissions: submissionCells,
    };
  });

  return { rows, submissionIds, vendorNames, totals };
}

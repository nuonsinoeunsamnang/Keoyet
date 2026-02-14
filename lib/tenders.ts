import { getSupabase } from "@/lib/db";

export type Tender = {
  id: string;
  workspace_id: string;
  slug: string;
  title: string;
  status: string;
  description: string | null;
  submission_deadline: string | null;
  submission_link_note: string | null;
  reference_id: string | null;
  category: string | null;
  delivery_location: string | null;
  created_at: string;
  updated_at: string;
};

export type TenderItem = {
  id: string;
  tender_id: string;
  sort_order: number;
  description: string;
  quantity: number;
  unit: string | null;
  notes: string | null;
  created_at: string;
};

export type TenderRequiredDoc = {
  id: string;
  tender_id: string;
  name: string;
  required: boolean;
  rejection_policy: unknown;
  sort_order: number;
  created_at: string;
};

export async function getTendersByWorkspace(workspaceId: string) {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tenders")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Tender[];
}

export async function getTenderById(
  tenderId: string,
  workspaceId: string
): Promise<Tender | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tenders")
    .select("*")
    .eq("id", tenderId)
    .eq("workspace_id", workspaceId)
    .single();
  if (error || !data) return null;
  return data as Tender;
}

export async function getTenderBySlug(slug: string): Promise<Tender | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tenders")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error || !data) return null;
  return data as Tender;
}

export async function createTender(
  workspaceId: string,
  opts: { title?: string }
): Promise<Tender> {
  const supabase = getSupabase();
  const slug =
    "t-" +
    Math.random().toString(36).slice(2, 10) +
    "-" +
    Date.now().toString(36);
  const { data, error } = await supabase
    .from("tenders")
    .insert({
      workspace_id: workspaceId,
      slug,
      title: opts.title ?? "Untitled Tender",
      status: "draft",
    })
    .select()
    .single();
  if (error) throw error;
  return data as Tender;
}

export async function updateTender(
  tenderId: string,
  workspaceId: string,
  updates: Partial<Pick<Tender, "title" | "description" | "status" | "submission_deadline" | "submission_link_note" | "reference_id" | "category" | "delivery_location">>
): Promise<Tender | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tenders")
    .update(updates)
    .eq("id", tenderId)
    .eq("workspace_id", workspaceId)
    .select()
    .single();
  if (error) return null;
  return data as Tender;
}

export async function publishTender(
  tenderId: string,
  workspaceId: string
): Promise<Tender | null> {
  return updateTender(tenderId, workspaceId, { status: "published" });
}

export async function getTenderItems(tenderId: string): Promise<TenderItem[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tender_items")
    .select("*")
    .eq("tender_id", tenderId)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as TenderItem[];
}

export async function replaceTenderItems(
  tenderId: string,
  items: Array<{
    sort_order: number;
    description: string;
    quantity: number;
    unit?: string | null;
    notes?: string | null;
  }>
): Promise<void> {
  const supabase = getSupabase();
  await supabase.from("tender_items").delete().eq("tender_id", tenderId);
  if (items.length === 0) return;
  const { error } = await supabase.from("tender_items").insert(
    items.map((item, i) => ({
      tender_id: tenderId,
      sort_order: item.sort_order ?? i,
      description: item.description,
      quantity: item.quantity ?? 1,
      unit: item.unit ?? null,
      notes: item.notes ?? null,
    }))
  );
  if (error) throw error;
}

export async function getTenderRequiredDocs(
  tenderId: string
): Promise<TenderRequiredDoc[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("tender_required_docs")
    .select("*")
    .eq("tender_id", tenderId)
    .order("sort_order");
  if (error) throw error;
  return (data ?? []) as TenderRequiredDoc[];
}

export async function replaceTenderRequiredDocs(
  tenderId: string,
  docs: Array<{
    name: string;
    required: boolean;
    rejection_policy?: unknown;
    sort_order?: number;
  }>
): Promise<void> {
  const supabase = getSupabase();
  await supabase
    .from("tender_required_docs")
    .delete()
    .eq("tender_id", tenderId);
  if (docs.length === 0) return;
  const { error } = await supabase.from("tender_required_docs").insert(
    docs.map((d, i) => ({
      tender_id: tenderId,
      name: d.name,
      required: d.required ?? true,
      rejection_policy: d.rejection_policy ?? null,
      sort_order: d.sort_order ?? i,
    }))
  );
  if (error) throw error;
}

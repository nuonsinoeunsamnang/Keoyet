import { getSupabase } from "@/lib/db";

export type Vendor = {
  id: string;
  workspace_id: string;
  name: string;
  contact_email: string | null;
  contact_phone: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export async function getVendorsByWorkspace(
  workspaceId: string,
  opts?: { status?: string }
): Promise<Vendor[]> {
  const supabase = getSupabase();
  let q = supabase
    .from("vendors")
    .select("*")
    .eq("workspace_id", workspaceId)
    .order("created_at", { ascending: false });
  if (opts?.status) q = q.eq("status", opts.status);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Vendor[];
}

export async function getVendorsByTender(
  tenderId: string,
  workspaceId: string
): Promise<Vendor[]> {
  const supabase = getSupabase();
  const { data: subIds } = await supabase
    .from("submissions")
    .select("vendor_id")
    .eq("tender_id", tenderId);
  const ids = Array.from(new Set((subIds ?? []).map((s) => s.vendor_id)));
  if (ids.length === 0) return [];
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("workspace_id", workspaceId)
    .in("id", ids);
  if (error) throw error;
  return (data ?? []) as Vendor[];
}

export async function getVendorById(
  vendorId: string,
  workspaceId: string
): Promise<Vendor | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("vendors")
    .select("*")
    .eq("id", vendorId)
    .eq("workspace_id", workspaceId)
    .single();
  if (error || !data) return null;
  return data as Vendor;
}

export async function approveVendor(
  vendorId: string,
  workspaceId: string
): Promise<Vendor | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("vendors")
    .update({ status: "approved" })
    .eq("id", vendorId)
    .eq("workspace_id", workspaceId)
    .select()
    .single();
  if (error) return null;
  return data as Vendor;
}

export async function rejectVendor(
  vendorId: string,
  workspaceId: string
): Promise<Vendor | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("vendors")
    .update({ status: "rejected" })
    .eq("id", vendorId)
    .eq("workspace_id", workspaceId)
    .select()
    .single();
  if (error) return null;
  return data as Vendor;
}

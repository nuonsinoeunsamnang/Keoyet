import { getSupabase } from "@/lib/db";

export type Submission = {
  id: string;
  tender_id: string;
  vendor_id: string;
  status: string;
  submitted_at: string | null;
  compliance: unknown;
  created_at: string;
  updated_at: string;
};

export type SubmissionWithVendor = Submission & {
  vendors: {
    id: string;
    name: string;
    contact_email: string | null;
    status?: string;
  } | null;
};

export async function getSubmissionsByTender(
  tenderId: string
): Promise<SubmissionWithVendor[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("submissions")
    .select("*, vendors(id, name, contact_email, status)")
    .eq("tender_id", tenderId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as SubmissionWithVendor[];
}

export async function getSubmissionById(
  submissionId: string,
  workspaceId: string
): Promise<SubmissionWithVendor | null> {
  const supabase = getSupabase();
  const { data: sub } = await supabase
    .from("submissions")
    .select("*, vendors(id, name, contact_email, workspace_id)")
    .eq("id", submissionId)
    .single();
  if (!sub || (sub.vendors as { workspace_id?: string } | null)?.workspace_id !== workspaceId)
    return null;
  const { vendors, ...rest } = sub as Submission & {
    vendors: { id: string; name: string; contact_email: string | null; workspace_id?: string } | null;
  };
  return { ...rest, vendors } as SubmissionWithVendor;
}

export async function requestMissingDocs(
  submissionId: string,
  _payload: { message?: string; doc_ids?: string[] }
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase
    .from("submissions")
    .update({ status: "under_review", updated_at: new Date().toISOString() })
    .eq("id", submissionId);
  return !error;
}

import { getSupabase } from "@/lib/db";

export type Org = {
  id: string;
  orgKey: string;
  name: string | null;
};

/**
 * Get workspace by id (for public pages that only have workspace_id, e.g. from tender).
 */
export async function getWorkspaceById(id: string): Promise<{ name: string | null } | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("workspaces")
    .select("name")
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return { name: data.name ?? null };
}

/**
 * Resolve org by orgKey. Returns null if not found.
 */
export async function getOrgByKey(orgKey: string): Promise<Org | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("workspaces")
    .select("id, org_key, name")
    .eq("org_key", orgKey)
    .single();

  if (error || !data) return null;
  return {
    id: data.id,
    orgKey: data.org_key,
    name: data.name ?? null,
  };
}

/**
 * For API handlers: ensure org exists and return it, or return a 404 Response.
 */
export async function requireOrg(
  orgKey: string
): Promise<{ org: Org; response: null } | { org: null; response: Response }> {
  const org = await getOrgByKey(orgKey);
  if (!org) {
    return {
      org: null,
      response: new Response(JSON.stringify({ error: "Workspace not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }
  return { org, response: null };
}

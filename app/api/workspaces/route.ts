import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/db";
import { createWorkspaceBody } from "@/lib/validators";

function generateOrgKey(): string {
  const segment = () =>
    Math.random().toString(36).replace(/[^a-z0-9]/g, "").slice(0, 8);
  return `${segment()}-${segment()}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createWorkspaceBody.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const supabase = getSupabase();
    let orgKey = generateOrgKey();
    let attempts = 0;
    while (attempts < 5) {
      const { data, error } = await supabase
        .from("workspaces")
        .insert({
          org_key: orgKey,
          name: parsed.data.name ?? null,
        })
        .select("id, org_key")
        .single();
      if (!error && data) {
        return NextResponse.json({
          orgId: data.id,
          orgKey: data.org_key,
        });
      }
      if (error?.code === "23505") {
        orgKey = generateOrgKey();
        attempts++;
        continue;
      }
      throw error;
    }
    return NextResponse.json(
      { error: "Failed to create workspace" },
      { status: 500 }
    );
  } catch (err) {
    console.error("POST /api/workspaces", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

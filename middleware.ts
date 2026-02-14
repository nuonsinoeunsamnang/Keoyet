import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

async function isValidOrgKey(orgKey: string): Promise<boolean> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;
  try {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(url, key);
    const { data } = await supabase
      .from("workspaces")
      .select("id")
      .eq("org_key", orgKey)
      .single();
    return !!data;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const segments = pathname.split("/").filter(Boolean);
  if (segments[0] !== "o" || !segments[1]) return NextResponse.next();
  const orgKey = segments[1];
  const valid = await isValidOrgKey(orgKey);
  if (!valid) {
    return NextResponse.redirect(new URL("/invalid-workspace", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/o/(.+)"],
};

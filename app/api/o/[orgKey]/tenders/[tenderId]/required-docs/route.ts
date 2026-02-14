import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import {
  getTenderById,
  getTenderRequiredDocs,
  replaceTenderRequiredDocs,
} from "@/lib/tenders";
import { putRequiredDocsBody } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgKey: string; tenderId: string }> }
) {
  const { orgKey, tenderId } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  const tender = await getTenderById(tenderId, result.org.id);
  if (!tender)
    return NextResponse.json({ error: "Tender not found" }, { status: 404 });
  const docs = await getTenderRequiredDocs(tenderId);
  return NextResponse.json({ docs });
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ orgKey: string; tenderId: string }> }
) {
  const { orgKey, tenderId } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  const tender = await getTenderById(tenderId, result.org.id);
  if (!tender)
    return NextResponse.json({ error: "Tender not found" }, { status: 404 });
  try {
    const body = await request.json();
    const parsed = putRequiredDocsBody.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    await replaceTenderRequiredDocs(tenderId, parsed.data.docs);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("PUT required-docs", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

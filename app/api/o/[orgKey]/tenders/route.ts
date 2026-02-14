import { NextResponse } from "next/server";
import { requireOrg } from "@/lib/org";
import { getTendersByWorkspace, createTender } from "@/lib/tenders";
import { createTenderBody } from "@/lib/validators";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ orgKey: string }> }
) {
  const { orgKey } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  const tenders = await getTendersByWorkspace(result.org.id);
  return NextResponse.json(tenders);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orgKey: string }> }
) {
  const { orgKey } = await params;
  const result = await requireOrg(orgKey);
  if (result.response) return result.response;
  try {
    const body = await request.json();
    const parsed = createTenderBody.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid body", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const tender = await createTender(result.org.id, {
      title: parsed.data.title,
    });
    return NextResponse.json(tender);
  } catch (err) {
    console.error("POST tenders", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";

// Launch reminder sign-ups. TODO: store these (e.g. Vercel KV, a sheet, or a mailing list tool).
export async function POST(req: Request) {
  const { email, product } = await req.json().catch(() => ({}));
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  console.log("[waitlist]", product, email.replace(/(.).+(@.*)/, "$1***$2"));
  return NextResponse.json({ ok: true });
}

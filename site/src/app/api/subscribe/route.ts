import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const Body = z.object({
  email: z.string().email(),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\+?[1-9]\d{7,14}$/i, "E.164 형식의 전화번호여야 합니다"),
  consentMarketing: z.boolean().optional().default(false),
  consentPrivacy: z.boolean().optional().default(false),
});

export async function POST(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown").split(",")[0].trim();
  const { ok, resetAt } = rateLimit(ip, 10, 60_000);
  if (!ok) return NextResponse.json({ ok: false, retryAfter: resetAt }, { status: 429 });
  try {
    const json = await req.json();
    const body = Body.parse(json);

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("subscription_leads").insert({
      email: body.email,
      phone: body.phone || null,
      consent_marketing: body.consentMarketing ?? false,
      consent_privacy: body.consentPrivacy ?? false,
      source: "landing",
    });
    if (error) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}



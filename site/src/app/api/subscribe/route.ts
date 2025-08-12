import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { z } from "zod";

const Body = z.object({
  email: z.string().email(),
  phone: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = Body.parse(json);
    if (!supabase) {
      return NextResponse.json({ ok: true, queued: true }, { status: 202 });
    }
    const { error } = await supabase.from("subscription_leads").insert({
      email: body.email,
      phone: body.phone ?? null,
    });
    if (error) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}



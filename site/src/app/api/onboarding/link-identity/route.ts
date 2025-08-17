import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// 간단한 E.164 형식 검증(+821012345678 등)
const Body = z.object({
  phone: z
    .string()
    .trim()
    .regex(/^\+?[1-9]\d{7,14}$/i, "유효한 E.164 전화번호 형식이 아닙니다"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { phone } = Body.parse(json);

    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user?.id) {
      return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
    }

    // 화이트리스트 상태 확인
    const { data: wl, error: wlErr } = await supabase
      .from("member_whitelist")
      .select("status,is_admin")
      .eq("phone_e164", phone)
      .maybeSingle();
    if (wlErr) {
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    if (!wl || wl.status !== "approved") {
      // 승인 대기 상태 처리 - 클라이언트는 안내 메시지 표시
      return NextResponse.json({ ok: true, pending: true }, { status: 202 });
    }

    // profiles가 없으면 자기 자신으로 insert (role 기본 member, 화이트리스트 is_admin이면 admin)
    await supabase
      .from("profiles")
      .upsert({ user_id: user.id, role: wl.is_admin ? "admin" : "member" }, { onConflict: "user_id" });

    // user_identity_links upsert (RLS: 승인된 화이트리스트일 때 허용)
    const { error: linkErr } = await supabase
      .from("user_identity_links")
      .upsert(
        {
          user_id: user.id,
          phone_e164: phone,
          google_email: user.email ?? null,
          google_linked_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    if (linkErr) {
      // 승인되었는데도 실패 시 서버 오류로 처리
      return NextResponse.json({ ok: false }, { status: 500 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}



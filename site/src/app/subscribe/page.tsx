"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [consentMarketing, setConsentMarketing] = useState(false);
  const [consentPrivacy, setConsentPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setError(null);
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, phone, consentMarketing, consentPrivacy }),
    });
    setLoading(false);
    if (res.ok) setOk("구독 신청이 접수되었습니다.");
    else if (res.status === 429) setError("요청이 많습니다. 잠시 후 다시 시도해 주세요.");
    else if (res.status === 400) setError("입력 형식을 확인해 주세요.");
    else setError("오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
  }

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold">구독</h1>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4 max-w-md">
        <label className="grid gap-2">
          <span>이메일</span>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label className="grid gap-2">
          <span>전화번호(E.164)</span>
          <Input placeholder="+821012345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={consentMarketing} onChange={(e) => setConsentMarketing(e.target.checked)} />
          <span>마케팅 정보 수신 동의(선택)</span>
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" required checked={consentPrivacy} onChange={(e) => setConsentPrivacy(e.target.checked)} />
          <span>개인정보 처리 동의(필수)</span>
        </label>
        <Button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "로딩 중…" : "구독하기"}
        </Button>
        {ok && <p role="status">{ok}</p>}
        {error && <p role="alert" className="text-[color:var(--color-danger)]">{error}</p>}
      </form>
    </main>
  );
}



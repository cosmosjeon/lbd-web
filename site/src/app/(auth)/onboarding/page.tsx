"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function OnboardingPage() {
  const [phone, setPhone] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    setError(null);
    const res = await fetch("/api/onboarding/link-identity", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ phone }),
    });
    setLoading(false);
    if (res.ok) {
      if (res.status === 202) setOk("승인 대기 상태입니다. 운영진 승인 후 다음 세션부터 접근 가능합니다.");
      else setOk("연결 완료되었습니다.");
    } else if (res.status === 401) {
      setError("로그인이 필요합니다. 먼저 로그인해 주세요.");
    } else if (res.status === 400) {
      setError("입력 형식을 확인해 주세요(E.164).");
    } else {
      setError("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    }
  }

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold">온보딩</h1>
      <p className="mt-2 text-[color:var(--color-gray-600)]">화이트리스트에 등록된 전화번호를 입력하세요(E.164).</p>
      <form onSubmit={submit} className="mt-6 max-w-md grid gap-4">
        <label className="grid gap-2">
          <span>전화번호</span>
          <Input placeholder="+821012345678" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </label>
        <Button type="submit" disabled={loading} aria-busy={loading}>{loading ? "로딩 중…" : "연결"}</Button>
        {ok && <p role="status">{ok}</p>}
        {error && <p role="alert" className="text-[color:var(--color-danger)]">{error}</p>}
      </form>
    </main>
  );
}



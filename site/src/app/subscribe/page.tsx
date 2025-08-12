"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setOk(null);
    const res = await fetch("/api/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, phone }),
    });
    setLoading(false);
    setOk(res.ok ? "구독 신청이 접수되었습니다." : "오류가 발생했습니다.");
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
        <Button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "로딩 중…" : "구독하기"}
        </Button>
        {ok && <p role="status">{ok}</p>}
      </form>
    </main>
  );
}



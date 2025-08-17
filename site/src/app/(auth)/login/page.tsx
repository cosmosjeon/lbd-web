"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/hooks/useSession";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const { loading, userId } = useSession();

  async function signInGoogle() {
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: typeof window !== 'undefined' ? window.location.origin : undefined } });
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
  }

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold">로그인</h1>
      {loading ? (
        <p className="mt-4">로딩 중…</p>
      ) : userId ? (
        <div className="mt-4 grid gap-2">
          <p>로그인됨: {userId}</p>
          <Button onClick={signOut}>로그아웃</Button>
        </div>
      ) : (
        <div className="mt-4">
          <Button onClick={signInGoogle}>Google로 로그인</Button>
        </div>
      )}
    </main>
  );
}




import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function MemberLayout({ children }: { children: React.ReactNode }) {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const userId = data.user?.id;
    if (!userId) {
      return (
        <main className="container py-12">
          <h1 className="text-2xl font-bold">멤버 전용</h1>
          <p className="mt-2">접근하려면 로그인하세요.</p>
          <Link href="/login" className="underline mt-4 inline-block">로그인 페이지로 이동</Link>
        </main>
      );
    }
  } catch {
    return (
      <main className="container py-12">
        <h1 className="text-2xl font-bold">멤버 전용</h1>
        <p className="mt-2">접근하려면 로그인하세요.</p>
        <Link href="/login" className="underline mt-4 inline-block">로그인 페이지로 이동</Link>
      </main>
    );
  }
  return <>{children}</>;
}



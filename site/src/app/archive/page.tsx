import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Legacy = { id: number; title: string; cohort: string | null; posted_at: string | null };

export default async function ArchivePage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("legacy_posts")
    .select("id,title,cohort,posted_at")
    .order("posted_at", { ascending: false })
    .limit(20);
  const posts = (data as Legacy[] | null) || [];

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold">아카이브</h1>
      <p className="text-[color:var(--color-gray-600)] mt-2">최근 게시물 20개</p>

      <ul className="mt-6 grid gap-3">
        {posts.map((p) => (
          <li key={p.id} className="flex items-center gap-3">
            <Link href={`/archive/${p.id}`} className="underline underline-offset-4">
              {p.title}
            </Link>
            {p.cohort && <span className="text-xs text-[color:var(--color-gray-600)]">{p.cohort}</span>}
          </li>
        ))}
        {posts.length === 0 && (
          <li className="text-[color:var(--color-gray-600)]">표시할 게시물이 없습니다.</li>
        )}
      </ul>
    </main>
  );
}



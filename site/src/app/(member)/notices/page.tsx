import { createSupabaseServerClient } from "@/lib/supabase/server";

type Notice = { id: number; title: string; content: string; pinned: boolean; published_at: string };

export default async function NoticesPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("notices")
    .select("id,title,content,pinned,published_at")
    .order("pinned", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(50);

  const items = (data as Notice[] | null) || [];

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold">공지</h1>
      <p className="mt-2 text-[color:var(--color-gray-600)]">최근 공지 50개</p>
      {error && <p role="alert" className="mt-4 text-[color:var(--color-danger)]">목록을 불러오지 못했습니다.</p>}
      <ul className="mt-6 grid gap-4">
        {items.map((n) => (
          <li key={n.id} className="rounded-[var(--radius-card)] border p-4">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold">{n.title}</h2>
              {n.pinned && <span className="text-xs text-[color:var(--color-warning)]">핀</span>}
            </div>
            <p className="mt-1 text-sm text-[color:var(--color-gray-600)]">{n.content}</p>
          </li>
        ))}
        {items.length === 0 && <li className="text-[color:var(--color-gray-600)]">표시할 공지가 없습니다.</li>}
      </ul>
    </main>
  );
}



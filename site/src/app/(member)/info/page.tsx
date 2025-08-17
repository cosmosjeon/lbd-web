import { createSupabaseServerClient } from "@/lib/supabase/server";

type Info = { id: number; title: string; content: string; tags: string[] | null; expires_at: string | null };

export default async function InfoPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("info_posts")
    .select("id,title,content,tags,expires_at")
    .order("created_at", { ascending: false })
    .limit(50);

  const items = (data as Info[] | null) || [];

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold">정보 페이지</h1>
      <p className="mt-2 text-[color:var(--color-gray-600)]">최근 게시 50개</p>

      {error && <p role="alert" className="mt-4 text-[color:var(--color-danger)]">목록을 불러오지 못했습니다.</p>}

      <ul className="mt-6 grid gap-4">
        {items.map((item) => (
          <li key={item.id} className="rounded-[var(--radius-card)] border p-4">
            <h2 className="font-semibold">{item.title}</h2>
            <p className="mt-1 text-sm text-[color:var(--color-gray-600)]">{item.content}</p>
            {Array.isArray(item.tags) && item.tags.length > 0 && (
              <div className="mt-1 text-xs text-[color:var(--color-gray-600)]">태그: {item.tags.join(", ")}</div>
            )}
          </li>
        ))}
        {items.length === 0 && <li className="text-[color:var(--color-gray-600)]">표시할 정보가 없습니다.</li>}
      </ul>
    </main>
  );
}



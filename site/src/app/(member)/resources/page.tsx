import { createSupabaseServerClient } from "@/lib/supabase/server";

type Resource = {
  id: number;
  title: string;
  description: string | null;
  url: string | null;
  file_url: string | null;
  cohort: string | null;
  week: number | null;
};

export default async function ResourcesPage() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("resources")
    .select("id,title,description,url,file_url,cohort,week")
    .order("created_at", { ascending: false })
    .limit(50);

  const resources = (data as Resource[] | null) || [];

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold">세션 자료</h1>
      <p className="mt-2 text-[color:var(--color-gray-600)]">최근 자료 50개를 표시합니다.</p>

      {error && (
        <p role="alert" className="mt-4 text-[color:var(--color-danger)]">목록을 불러오지 못했습니다.</p>
      )}

      <ul className="mt-6 grid gap-4">
        {resources.map((r) => {
          const isHttps = (r.url || "").startsWith("https://");
          return (
            <li key={r.id} className="rounded-[var(--radius-card)] border p-4">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-semibold">{r.title}</h2>
                {r.cohort && <span className="text-xs text-[color:var(--color-gray-600)]">{r.cohort}{r.week ? `·${r.week}주차` : ""}</span>}
              </div>
              {r.description && <p className="mt-1 text-sm text-[color:var(--color-gray-600)]">{r.description}</p>}
              <div className="mt-2 flex gap-3 text-sm">
                {isHttps ? (
                  <a href={r.url!} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    외부 링크 열기
                  </a>
                ) : r.url ? (
                  <span className="text-[color:var(--color-gray-600)]">유효하지 않은 링크</span>
                ) : null}
                {r.file_url && (
                  <a href={r.file_url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                    파일 열기
                  </a>
                )}
              </div>
            </li>
          );
        })}
        {resources.length === 0 && (
          <li className="text-[color:var(--color-gray-600)]">표시할 자료가 없습니다.</li>
        )}
      </ul>
    </main>
  );
}



import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type SearchParams = { cohort?: string };

export default async function ProjectsPage({ searchParams }: { searchParams?: SearchParams }) {
  const cohort = searchParams?.cohort || undefined;

  let cohorts: string[] = [];
  let projects: Array<{ id: number; slug: string; name: string; cohort: string | null; summary: string | null }>= [];

  if (supabase) {
    const { data: raw } = await supabase.from("projects").select("cohort").order("cohort", { ascending: true });
    const rawList = (raw as Array<{ cohort: string | null }> | null) || [];
    cohorts = Array.from(new Set(rawList.map((r) => r.cohort).filter((c): c is string => Boolean(c))));

    let query = supabase.from("projects").select("id,slug,name,cohort,summary").order("updated_at", { ascending: false });
    if (cohort) query = query.eq("cohort", cohort);
    const { data: list } = await query;
    projects = (list as Array<{ id: number; slug: string; name: string; cohort: string | null; summary: string | null }> | null) || [];
  }

  return (
    <main className="container py-12">
      <h1 className="text-2xl font-bold">프로젝트</h1>

      <div className="mt-6 flex flex-wrap gap-2 items-center">
        <Link href="/projects" className={!cohort ? "underline" : "hover:underline"}>전체</Link>
        {cohorts.map((c) => (
          <Link key={c} href={`/projects?cohort=${encodeURIComponent(c)}`} className={cohort === c ? "underline" : "hover:underline"}>
            {c}
          </Link>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link key={p.id} href={`/projects/${p.slug}`}>
            <Card>
              <div className="aspect-[16/9] rounded-[var(--radius-card)] bg-[color:var(--color-gray-200)]" />
              <div className="mt-3 flex items-center gap-2">
                <h3 className="font-semibold">{p.name}</h3>
                {p.cohort && <Badge>{p.cohort}</Badge>}
              </div>
              {p.summary && (
                <p className="text-sm text-[color:var(--color-gray-600)]">{p.summary}</p>
              )}
            </Card>
          </Link>
        ))}
        {!supabase && (
          <p className="text-[color:var(--color-gray-600)]">Supabase 환경변수가 설정되면 목록이 표시됩니다.</p>
        )}
      </div>
    </main>
  );
}



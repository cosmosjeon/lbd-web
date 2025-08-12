import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

type Params = { slug: string };

export default async function ProjectDetail({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!supabase) return notFound();
  const { data } = await supabase.from("projects").select("id, name, cohort, summary, cover_url").eq("slug", slug).single();
  if (!data) return notFound();

  return (
    <main className="container py-12">
      <div className="aspect-[16/9] rounded-[var(--radius-card)] bg-[color:var(--color-gray-200)]" />
      <h1 className="mt-4 text-2xl font-bold">{data.name}</h1>
      {data.cohort && <Badge className="mt-2">{data.cohort}</Badge>}
      {data.summary && <p className="mt-4 text-[color:var(--color-gray-600)]">{data.summary}</p>}
    </main>
  );
}



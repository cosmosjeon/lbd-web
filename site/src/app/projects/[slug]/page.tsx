import { notFound } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";
import { Badge } from "@/components/ui/badge";

type Artifact = { id: number; kind: string; url: string | null; title: string | null };
type ProjectDetail = {
  id: number;
  name: string;
  cohort: string | null;
  summary: string | null;
  cover_url: string | null;
  project_artifacts?: Artifact[] | null;
};

type Params = { slug: string };

export default async function ProjectDetail({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!supabase) return notFound();
  const { data } = await supabase
    .from("projects")
    .select("id, name, cohort, summary, cover_url, project_artifacts(id, kind, url, title)")
    .eq("slug", slug)
    .single();
  if (!data) return notFound();

  return (
    <main className="container py-12">
      <div className="aspect-[16/9] rounded-[var(--radius-card)] bg-[color:var(--color-gray-200)] relative overflow-hidden">
        <Image
          src={data.cover_url || `https://picsum.photos/seed/${data.id}/1200/675`}
          alt={`${data.name} 대표 이미지`}
          fill
          sizes="100vw"
          style={{ objectFit: "cover" }}
          priority
        />
      </div>
      <h1 className="mt-4 text-2xl font-bold">{data.name}</h1>
      {data.cohort && <Badge className="mt-2">{data.cohort}</Badge>}
      {data.summary && <p className="mt-4 text-[color:var(--color-gray-600)]">{data.summary}</p>}
      {Array.isArray((data as ProjectDetail).project_artifacts || undefined) && (
        <div className="mt-6 grid sm:grid-cols-2 gap-2">
          {(data as ProjectDetail).project_artifacts!.map((a: Artifact) => {
            const href = a.url || "#";
            return (
              <a key={a.id} href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">
                {a.title || a.kind}
              </a>
            );
          })}
        </div>
      )}
    </main>
  );
}



import { supabase } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";

type Project = {
  id: number;
  name: string;
  summary: string | null;
  cover_url: string | null;
};

export async function FeaturedProjects() {
  if (!supabase) {
    return null;
  }
  const { data } = await supabase
    .from("projects")
    .select("id,name,summary,cover_url")
    .eq("featured", true)
    .order("updated_at", { ascending: false })
    .limit(6);

  if (!data?.length) return null;

  return (
    <section id="projects" className="py-[80px]">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold">Featured 프로젝트</h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((p: Project) => (
            <Card key={p.id}>
              <div className="aspect-[16/9] rounded-[var(--radius-card)] bg-[color:var(--color-gray-200)]" />
              <h3 className="mt-3 font-semibold">{p.name}</h3>
              {p.summary && (
                <p className="text-sm text-[color:var(--color-gray-600)]">{p.summary}</p>
              )}
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}



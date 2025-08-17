"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { AutoSlider } from "@/components/auto-slider";

type Project = {
  id: number;
  name: string;
  summary: string | null;
  cover_url: string | null;
};

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[] | null>(null);

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!supabase) {
        setProjects([]);
        return;
      }
      const { data } = await supabase
        .from("projects")
        .select("id,name,summary,cover_url")
        .eq("featured", true)
        .order("updated_at", { ascending: false })
        .limit(6);
      if (mounted) setProjects((data as Project[]) || []);
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!projects) {
    return (
      <section id="projects" className="py-[80px]">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold">Featured 프로젝트</h2>
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="aspect-[16/9]" />
                <Skeleton className="mt-3 h-5 w-2/3" />
                <Skeleton className="mt-2 h-4 w-1/2" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }
  if (projects.length === 0) return null;

  return (
    <section id="projects" className="py-[80px]">
      <div className="container">
        <h2 className="text-2xl md:text-3xl font-bold">Featured 프로젝트</h2>
        <AutoSlider className="mt-6" ariaLabel="Featured 프로젝트 슬라이더">
          {projects.map((p) => (
            <Card key={p.id}>
              <div className="aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] bg-[color:var(--color-gray-200)] relative">
                <Image
                  src={p.cover_url || `https://picsum.photos/seed/${p.id}/800/450`}
                  alt={p.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                  priority={false}
                />
              </div>
              <h3 className="mt-3 font-semibold">{p.name}</h3>
              {p.summary && (
                <p className="text-sm text-[color:var(--color-gray-600)]">{p.summary}</p>
              )}
            </Card>
          ))}
        </AutoSlider>
      </div>
    </section>
  );
}



"use client";

import React from "react";
import { supabase } from "@/lib/supabase/client";
import { Counter } from "@/components/counter";

export function LandingStats() {
  const [stats, setStats] = React.useState<{ projects: number; events: number } | null>(null);

  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (!supabase) {
        setStats({ projects: 0, events: 0 });
        return;
      }
      const [pc, ec] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
      ]);
      if (mounted) setStats({ projects: pc.count || 0, events: ec.count || 0 });
    }
    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (!stats) return null;

  return (
    <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-6" aria-label="숫자로 보는 LBD">
      <div>
        <div className="text-3xl font-extrabold"><Counter target={stats.projects} /></div>
        <div className="text-sm text-white/80">프로젝트</div>
      </div>
      <div>
        <div className="text-3xl font-extrabold"><Counter target={stats.events} /></div>
        <div className="text-sm text-white/80">이벤트</div>
      </div>
    </div>
  );
}




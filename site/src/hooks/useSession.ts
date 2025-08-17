"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type SessionState = {
  loading: boolean;
  userId?: string;
  role?: "member" | "admin";
};

export function useSession(): SessionState {
  const [state, setState] = useState<SessionState>({ loading: true });

  useEffect(() => {
    let mounted = true;
    async function load() {
      if (!supabase) {
        if (mounted) setState({ loading: false });
        return;
      }
      const { data } = await supabase.auth.getSession();
      const userId = data.session?.user?.id;
      let role: SessionState["role"] | undefined;
      if (userId) {
        const { data: p } = await supabase.from("profiles").select("role").eq("user_id", userId).maybeSingle();
        role = (p?.role as SessionState["role"]) || undefined;
      }
      if (mounted) setState({ loading: false, userId, role });
    }
    load();
    const fallback = { data: { subscription: { unsubscribe() {} } } } as { data: { subscription: { unsubscribe: () => void } } };
    const { data: sub } = supabase?.auth.onAuthStateChange(() => load()) || fallback;
    return () => {
      mounted = false;
      sub?.subscription?.unsubscribe?.();
    };
  }, []);

  return state;
}



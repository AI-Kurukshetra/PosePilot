"use client";

import { clearAllPendingPracticeSessions } from "@/lib/practice-sessions";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";

export default function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isReady, setIsReady] = useState(false);

  const loginHref = useMemo(() => {
    const next = pathname && pathname !== "/" ? pathname : "/dashboard";
    return `/login?next=${encodeURIComponent(next)}`;
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;

    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      if (!user) {
        clearAllPendingPracticeSessions();
        setIsReady(false);
        router.replace(loginHref);
        return;
      }

      setIsReady(true);
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        clearAllPendingPracticeSessions();
        setIsReady(false);
        router.replace(loginHref);
        return;
      }

      setIsReady(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [loginHref, router]);

  if (!isReady) {
    return (
      <div className="page-grid flex min-h-screen items-center justify-center px-6 py-10">
        <div className="rounded-[26px] border border-[#D4AF37]/20 bg-black/35 px-6 py-5 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">PosePilot</p>
          <p className="mt-3 text-sm text-white/66">Checking your active session.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

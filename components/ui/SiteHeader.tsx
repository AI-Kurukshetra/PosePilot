"use client";

import LogoutButton from "@/components/auth/LogoutButton";
import { NavigationLink } from "@/components/ui/navigation-loader";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SiteHeader({
  className,
  hideGuestActions = false,
}: {
  className?: string;
  hideGuestActions?: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [hasUser, setHasUser] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const isLiveSessionRoute = pathname.startsWith("/session/") && pathname.endsWith("/live");

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!isMounted) {
        return;
      }

      setHasUser(Boolean(user));
      setIsReady(true);
    }

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!isMounted) {
        return;
      }

      setHasUser(Boolean(session?.user));
      setIsReady(true);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isReady || !hasUser) {
      return;
    }

    router.prefetch("/dashboard");
    router.prefetch("/session");
  }, [hasUser, isReady, router]);

  function handleHeaderNavigation() {
    if (!isLiveSessionRoute) {
      return;
    }

    window.dispatchEvent(new Event("posepilot:leave-live-session"));
  }

  return (
    <header
      className={
        className ?? ""
      }
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <NavigationLink
          href="/"
          loadingLabel="Opening home"
          onClick={handleHeaderNavigation}
          className="header-brand-pill inline-flex items-center gap-3 self-start rounded-full px-3 py-2 pr-4 sm:px-3.5"
        >
          <span className="header-brand-mark flex h-10 w-10 items-center justify-center rounded-full">
            <span className="header-brand-signal h-2.5 w-2.5 rounded-full bg-[#D4AF37]" />
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="header-brand-wordmark display-font text-[1.15rem] leading-none sm:text-[1.2rem]">
              PosePilot
            </span>
            <span className="mt-1 text-[10px] uppercase tracking-[0.24em] text-white/38">
              Alignment studio
            </span>
          </span>
        </NavigationLink>

        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {isReady && hasUser ? (
            <>
              {pathname !== "/dashboard" ? (
                <NavigationLink
                  href="/dashboard"
                  loadingLabel="Opening your dashboard"
                  onClick={handleHeaderNavigation}
                  className="rounded-full border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/72 hover:border-[#D4AF37]/45 hover:text-[#F5F5F5]"
                >
                  Dashboard
                </NavigationLink>
              ) : null}
              {!pathname.startsWith("/session") ? (
                <NavigationLink
                  href="/session"
                  loadingLabel="Opening session studio"
                  onClick={handleHeaderNavigation}
                  className="rounded-full border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/72 hover:border-[#D4AF37]/45 hover:text-[#F5F5F5]"
                >
                  Practice
                </NavigationLink>
              ) : null}
              <LogoutButton />
            </>
          ) : isReady && !hideGuestActions ? (
            <>
              {pathname !== "/login" ? (
                <NavigationLink
                  href="/login"
                  loadingLabel="Opening login"
                  onClick={handleHeaderNavigation}
                  className="rounded-full border border-white/12 px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/72 hover:border-[#D4AF37]/45 hover:text-[#F5F5F5]"
                >
                  Log in
                </NavigationLink>
              ) : null}
              {pathname !== "/signup" ? (
                <NavigationLink
                  href="/signup"
                  loadingLabel="Opening account setup"
                  onClick={handleHeaderNavigation}
                  className="rounded-full bg-[#D4AF37] px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-black hover:scale-[1.02]"
                >
                  Create account
                </NavigationLink>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

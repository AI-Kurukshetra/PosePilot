"use client";

import { MotionBlock, MotionSection } from "@/components/ui/page-transition";
import { NavigationLink, useNavigationLoader } from "@/components/ui/navigation-loader";
import SiteHeader from "@/components/ui/SiteHeader";
import PasswordField from "@/components/ui/PasswordField";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";

type AuthMode = "login" | "signup";

const authCopy: Record<
  AuthMode,
  {
    eyebrow: string;
    title: string;
    description: string;
    button: string;
    alternateHref: string;
    alternateLabel: string;
    alternateCta: string;
  }
> = {
  login: {
    eyebrow: "Return to your practice",
    title: "Enter quietly. Continue precisely.",
    description:
      "Access posture history, live calibration, and your next guided correction session.",
    button: "Log In",
    alternateHref: "/signup",
    alternateLabel: "New to PosePilot?",
    alternateCta: "Create an account",
  },
  signup: {
    eyebrow: "Begin with calm intent",
    title: "Create your private correction studio.",
    description:
      "Set up your account and start refining each pose with real-time AI guidance.",
    button: "Create account",
    alternateHref: "/login",
    alternateLabel: "Already registered?",
    alternateCta: "Sign in",
  },
};

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const copy = authCopy[mode];
  const router = useRouter();
  const searchParams = useSearchParams();
  const { startLoading } = useNavigationLoader();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsPending(true);

    const response =
      mode === "login"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setIsPending(false);

    if (response.error) {
      setError(response.error.message);
      return;
    }

    const requestedNext = searchParams.get("next");
    const destination =
      requestedNext && requestedNext.startsWith("/") && requestedNext !== "/login"
        ? requestedNext
        : "/dashboard";

    startLoading(destination === "/dashboard" ? "Opening your dashboard" : "Opening your session");
    router.push(destination);
  }

  return (
    <main className="page-grid flex min-h-screen items-center justify-center px-4 py-6 sm:px-8 sm:py-10">
      <MotionSection className="relative z-10 w-full max-w-6xl">
        <SiteHeader
          hideGuestActions
          className="mb-6"
        />
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <MotionBlock className="mx-auto w-full max-w-2xl">
            <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[#D4AF37] sm:text-xs sm:tracking-[0.35em]">
              {copy.eyebrow}
            </p>
            <h1 className="display-font max-w-xl text-4xl leading-[1.02] text-[#F5F5F5] sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-7 text-white/68 sm:mt-5 sm:text-lg">
              {copy.description}
            </p>
            <div className="mt-6 flex items-center gap-3 text-xs text-white/56 sm:mt-8 sm:gap-4 sm:text-sm">
              <span className="h-px w-12 bg-[#D4AF37]/45" />
              Minimal setup. Zero clutter.
            </div>
          </MotionBlock>

          <MotionBlock>
            <motion.form
              onSubmit={handleSubmit}
              whileHover={{ y: -2 }}
              className="auth-panel gold-glow mx-auto w-full max-w-lg rounded-[30px] border border-white/10 p-5 sm:rounded-[32px] sm:p-8"
            >
              <div className="mb-6 sm:mb-7">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                  PosePilot
                </p>
                <h2 className="display-font mt-2 text-[1.75rem] leading-[1.08] text-[#F5F5F5] sm:text-[2rem]">
                  {mode === "login" ? "Welcome back" : "Open your account"}
                </h2>
                <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-white/46">
                  <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-2 text-[#D4AF37]">
                    Live correction
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2">
                    Chair-ready mode
                  </span>
                  <span className="rounded-full border border-[#00E676]/20 bg-[#00E676]/10 px-3 py-2 text-[#00E676]">
                    Session history
                  </span>
                </div>
              </div>

              <label className="mb-4 block">
                <span className="mb-2 block text-sm text-white/70">Email</span>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full min-h-14 rounded-2xl border border-white/14 bg-white/[0.04] px-4 py-3 text-base leading-6 text-[#F5F5F5] outline-none placeholder:text-white/36 focus:border-[#D4AF37]/55 focus:bg-white/[0.06]"
                  required
                />
              </label>

              <PasswordField
                label="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                required
                wrapperClassName="mb-4 block"
              />

              {mode === "login" ? (
                <div className="mb-4 flex justify-end">
                  <NavigationLink
                    href="/forgot-password"
                    loadingLabel="Opening password recovery"
                    className="text-sm text-white/56 underline decoration-transparent underline-offset-4 transition hover:decoration-[#D4AF37] hover:text-[#D4AF37]"
                  >
                    Forgot password?
                  </NavigationLink>
                </div>
              ) : null}

              {error ? (
                <p className="mb-4 rounded-2xl border border-[#ff4c4c]/30 bg-[#ff4c4c]/10 px-4 py-3 text-sm text-[#ff9a9a]">
                  {error}
                </p>
              ) : null}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                disabled={isPending}
                className="w-full rounded-full bg-[#D4AF37] px-5 py-3.5 text-sm font-medium uppercase tracking-[0.14em] text-black disabled:cursor-not-allowed disabled:opacity-70 sm:tracking-[0.18em]"
              >
                {isPending ? "Please wait" : copy.button}
              </motion.button>

              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="flex flex-col items-start gap-3 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                  <span>{copy.alternateLabel}</span>
                  <NavigationLink
                    href={copy.alternateHref}
                    loadingLabel={
                      mode === "login" ? "Opening account setup" : "Opening login"
                    }
                    className="rounded-full border border-[#D4AF37]/25 px-4 py-2 text-[#F5F5F5] hover:border-[#D4AF37]/55 hover:text-[#D4AF37]"
                  >
                    {copy.alternateCta}
                  </NavigationLink>
                </div>
              </div>
            </motion.form>
          </MotionBlock>
        </div>
      </MotionSection>
    </main>
  );
}

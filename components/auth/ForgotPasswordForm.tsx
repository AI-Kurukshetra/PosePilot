"use client";

import { MotionBlock, MotionSection } from "@/components/ui/page-transition";
import SiteHeader from "@/components/ui/SiteHeader";
import { NavigationLink } from "@/components/ui/navigation-loader";
import { formatAuthErrorMessage, getAuthRedirectUrl } from "@/lib/auth-feedback";
import { getSupabaseClient, supabaseConfigErrorMessage } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useState, type FormEvent } from "react";

export default function ForgotPasswordForm() {
  const supabase = getSupabaseClient();
  const authUnavailableMessage = !supabase ? supabaseConfigErrorMessage : null;
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!supabase) {
      setError(supabaseConfigErrorMessage);
      return;
    }

    setIsPending(true);
    const normalizedEmail = email.trim();

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
      redirectTo: getAuthRedirectUrl("/reset-password"),
    });

    setIsPending(false);

    if (resetError) {
      setError(formatAuthErrorMessage(resetError));
      return;
    }

    setSuccess("Password reset link sent. Check your email to continue.");
  }

  return (
    <main className="page-grid flex min-h-screen items-center justify-center px-6 py-10 sm:px-8">
      <MotionSection className="relative z-10 w-full max-w-6xl">
        <SiteHeader
          hideGuestActions
          className="mb-6"
        />
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <MotionBlock className="max-w-2xl">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
              Recover access
            </p>
            <h1 className="display-font max-w-xl text-5xl leading-none text-[#F5F5F5] sm:text-6xl">
              Reset quietly. Return precisely.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/68 sm:text-lg">
              Enter your email and PosePilot will send a secure recovery link so you can
              set a new password.
            </p>
          </MotionBlock>

          <MotionBlock>
            <motion.form
              onSubmit={handleSubmit}
              whileHover={{ y: -2 }}
              className="auth-panel gold-glow mx-auto w-full max-w-md rounded-[32px] p-8 sm:p-10"
            >
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                  PosePilot
                </p>
                <h2 className="display-font mt-3 text-3xl text-[#F5F5F5]">
                  Forgot password
                </h2>
                <div className="mt-5 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em] text-white/46">
                  <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-2 text-[#D4AF37]">
                    Recovery link
                  </span>
                  <span className="rounded-full border border-white/10 bg-black/20 px-3 py-2">
                    Secure redirect
                  </span>
                </div>
              </div>

              <label className="mb-5 block">
                <span className="mb-2 block text-sm text-white/64">Email</span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="w-full rounded-2xl border border-white/10 bg-white/4 px-4 py-3.5 text-[#F5F5F5] outline-none placeholder:text-white/28 focus:border-[#D4AF37]/50 focus:bg-white/6"
                  required
                />
              </label>

              {authUnavailableMessage ? (
                <p className="mb-5 rounded-2xl border border-[#ff4c4c]/30 bg-[#ff4c4c]/10 px-4 py-3 text-sm text-[#ff9a9a]">
                  {authUnavailableMessage}
                </p>
              ) : null}

              {error ? (
                <p className="mb-5 rounded-2xl border border-[#ff4c4c]/30 bg-[#ff4c4c]/10 px-4 py-3 text-sm text-[#ff9a9a]">
                  {error}
                </p>
              ) : null}

              {success ? (
                <p className="mb-5 rounded-2xl border border-[#00E676]/30 bg-[#00E676]/10 px-4 py-3 text-sm text-[#CFFFE4]">
                  {success}
                </p>
              ) : null}

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.99 }}
                disabled={isPending || !supabase}
                className="w-full rounded-full bg-[#D4AF37] px-5 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-black disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Sending link" : "Send reset link"}
              </motion.button>

              <div className="mt-6 flex items-center justify-between gap-4 text-sm text-white/50">
                <span>Remembered it?</span>
                <NavigationLink
                  href="/login"
                  loadingLabel="Opening login"
                  className="rounded-full border border-[#D4AF37]/25 px-4 py-2 text-[#F5F5F5] hover:border-[#D4AF37]/55 hover:text-[#D4AF37]"
                >
                  Back to login
                </NavigationLink>
              </div>
            </motion.form>
          </MotionBlock>
        </div>
      </MotionSection>
    </main>
  );
}

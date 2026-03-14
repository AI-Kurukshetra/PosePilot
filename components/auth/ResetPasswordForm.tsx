"use client";

import { MotionBlock, MotionSection } from "@/components/ui/page-transition";
import SiteHeader from "@/components/ui/SiteHeader";
import { NavigationLink, useNavigationLoader } from "@/components/ui/navigation-loader";
import PasswordField from "@/components/ui/PasswordField";
import { formatAuthErrorMessage } from "@/lib/auth-feedback";
import { getSupabaseClient, supabaseConfigErrorMessage } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";

export default function ResetPasswordForm() {
  const hasSupabaseClient = Boolean(getSupabaseClient());
  const authUnavailableMessage = !hasSupabaseClient ? supabaseConfigErrorMessage : null;
  const router = useRouter();
  const { startLoading } = useNavigationLoader();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isCheckingRecovery, setIsCheckingRecovery] = useState(hasSupabaseClient);

  useEffect(() => {
    let isMounted = true;
    const supabaseClient = getSupabaseClient();

    if (!supabaseClient) {
      return;
    }

    const client = supabaseClient;

    async function checkRecoveryState() {
      const { data } = await client.auth.getSession();

      if (isMounted) {
        setIsReady(Boolean(data.session));
        setIsCheckingRecovery(false);
      }
    }

    void checkRecoveryState();

    const {
      data: { subscription },
    } = client.auth.onAuthStateChange((event, session) => {
      if (!isMounted) {
        return;
      }

      if (event === "PASSWORD_RECOVERY" || Boolean(session)) {
        setIsReady(true);
        setIsCheckingRecovery(false);
        return;
      }

      if (event === "SIGNED_OUT") {
        setIsReady(false);
        setIsCheckingRecovery(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [hasSupabaseClient]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    const supabaseClient = getSupabaseClient();

    if (!supabaseClient) {
      setError(supabaseConfigErrorMessage);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsPending(true);

    const client = supabaseClient;

    const { error: updateError } = await client.auth.updateUser({ password });

    setIsPending(false);

    if (updateError) {
      setError(formatAuthErrorMessage(updateError));
      return;
    }

    setSuccess("Password updated. Redirecting to login.");
    await client.auth.signOut();
    startLoading("Opening login");
    window.setTimeout(() => {
      router.push("/login?reset=success");
    }, 300);
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
              Set new password
            </p>
            <h1 className="display-font max-w-xl text-5xl leading-none text-[#F5F5F5] sm:text-6xl">
              Finish recovery and return to practice.
            </h1>
            <p className="mt-6 max-w-lg text-base leading-7 text-white/68 sm:text-lg">
              Choose a new password to reopen your private correction studio.
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
                  Reset password
                </h2>
              </div>

              {isCheckingRecovery ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/64">
                  Verifying your recovery link.
                </div>
              ) : !isReady ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/64">
                  Open the recovery link from your email to continue resetting your
                  password.
                </div>
              ) : (
                <>
                  <PasswordField
                    label="New password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Minimum 6 characters"
                    required
                    wrapperClassName="mb-4 block"
                  />

                  <PasswordField
                    label="Confirm password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Repeat new password"
                    required
                    wrapperClassName="mb-5 block"
                  />
                </>
              )}

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
                disabled={isPending || !isReady || !hasSupabaseClient}
                className="w-full rounded-full bg-[#D4AF37] px-5 py-3.5 text-sm font-medium uppercase tracking-[0.2em] text-black disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Updating password" : "Update password"}
              </motion.button>

              <div className="mt-6 flex items-center justify-between gap-4 text-sm text-white/50">
                <span>Need a fresh link?</span>
                <NavigationLink
                  href="/forgot-password"
                  loadingLabel="Opening password recovery"
                  className="rounded-full border border-[#D4AF37]/25 px-4 py-2 text-[#F5F5F5] hover:border-[#D4AF37]/55 hover:text-[#D4AF37]"
                >
                  Resend
                </NavigationLink>
              </div>
            </motion.form>
          </MotionBlock>
        </div>
      </MotionSection>
    </main>
  );
}

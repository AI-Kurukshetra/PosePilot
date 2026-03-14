"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import ProductShowcase from "@/components/marketing/ProductShowcase";
import PendingPracticeSessionSync from "@/components/session/PendingPracticeSessionSync";
import SiteHeader from "@/components/ui/SiteHeader";
import { MotionBlock, MotionSection } from "@/components/ui/page-transition";
import { NavigationLink } from "@/components/ui/navigation-loader";
import {
  buildProgressMetrics,
  buildRecommendation,
  buildRegionProgress,
  formatDuration,
  formatRelativeSessionTime,
  type PracticeSessionRow,
} from "@/lib/practice-sessions";
import { getSupabaseClient } from "@/lib/supabase";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [sessions, setSessions] = useState<PracticeSessionRow[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const supabaseClient = getSupabaseClient();

    const client = supabaseClient;

    async function loadDashboard() {
      if (isMounted) {
        setIsLoadingData(true);
      }

      if (!client) {
        if (isMounted) {
          setSessions([]);
          setIsLoadingData(false);
        }
        return;
      }

      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        if (isMounted) {
          setSessions([]);
          setIsLoadingData(false);
        }
        return;
      }

      const { data, error } = await client
        .from("practice_sessions")
        .select(
          "id, pose_key, pose_name, alignment_score, duration_seconds, status, summary, region_feedback, created_at"
        )
        .order("created_at", { ascending: false })
        .limit(12);

      if (isMounted) {
        setSessions(error ? [] : ((data as PracticeSessionRow[] | null) ?? []));
        setIsLoadingData(false);
      }
    }

    void loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const progressMetrics = buildProgressMetrics(sessions);
  const recentSessions = sessions.slice(0, 4);
  const regionProgress = buildRegionProgress(sessions);
  const recommendation = buildRecommendation(sessions);
  const latestSession = recentSessions[0];
  const trendSessions = [...sessions].slice(0, 6).reverse();
  const trendPoints = trendSessions.length
    ? trendSessions
        .map((session, index) => {
          const x = trendSessions.length === 1 ? 50 : (index / (trendSessions.length - 1)) * 100;
          const y = 100 - session.alignment_score;
          return `${x},${y}`;
        })
        .join(" ")
    : "";
  const averageRecentScore = trendSessions.length
    ? Math.round(
        trendSessions.reduce((total, session) => total + session.alignment_score, 0) /
          trendSessions.length
      )
    : 0;
  const durationTrendPoints = trendSessions.length
    ? trendSessions
        .map((session, index) => {
          const x = trendSessions.length === 1 ? 50 : (index / (trendSessions.length - 1)) * 100;
          const durationRatio = Math.min(session.duration_seconds / 1800, 1);
          const y = 100 - durationRatio * 100;
          return `${x},${y}`;
        })
        .join(" ")
    : "";
  const averageRecentDuration = trendSessions.length
    ? Math.round(
        trendSessions.reduce((total, session) => total + session.duration_seconds, 0) /
          trendSessions.length
      )
    : 0;

  return (
    <RequireAuth>
      <main className="page-grid min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.1),transparent_24%),radial-gradient(circle_at_86%_16%,rgba(0,230,118,0.06),transparent_18%)] px-6 py-8 sm:px-8 lg:px-10">
      <PendingPracticeSessionSync onSynced={() => setRefreshKey((value) => value + 1)} />
      <MotionSection className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-8">
        <SiteHeader />
        <ProductShowcase
          eyebrow="Dashboard Story"
          title="A dashboard that feels engineered, not loosely assembled."
          description="The same precise product-reveal language now carries into the dashboard: controlled motion, clear stage transitions, and a preview surface that explains the system fast."
          primaryHref="/session"
          primaryLabel="Start new session"
          primaryLoadingLabel="Opening session studio"
          secondaryLabel="Scroll the system"
        />

        <div className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
          <MotionBlock className="relative overflow-hidden rounded-[34px] border border-[#D4AF37]/14 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.14),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-6 sm:p-7">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-[linear-gradient(90deg,rgba(212,175,55,0),rgba(212,175,55,0.92),rgba(0,230,118,0.4),rgba(212,175,55,0))]" />
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="text-xs uppercase tracking-[0.3em] text-[#D4AF37]">
                  Practice atlas
                </p>
                <h2 className="display-font mt-4 text-4xl leading-tight text-[#F5F5F5]">
                  A calmer summary surface the moment users return from live practice.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/62">
                  The dashboard now foregrounds the latest outcome first, then lets the
                  supporting metrics fall behind it.
                </p>
              </div>

              <NavigationLink
                href="/session"
                loadingLabel="Opening session studio"
                className="inline-flex items-center justify-center rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-5 py-3 text-xs uppercase tracking-[0.22em] text-[#F5F5F5] hover:border-[#D4AF37]/55"
              >
                Practice again
              </NavigationLink>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-[0.88fr_1.12fr]">
              <div className="rounded-[28px] border border-white/8 bg-black/28 p-5">
                <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                  Latest return
                </p>
                {latestSession ? (
                  <>
                    <p className="display-font mt-4 text-3xl text-[#F5F5F5]">
                      {latestSession.pose_name}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.22em]">
                      <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-2 text-[#D4AF37]">
                        {latestSession.alignment_score}% aligned
                      </span>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-white/56">
                        {formatDuration(latestSession.duration_seconds)}
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/62">
                      {latestSession.summary ?? "Stored as the most recent completed practice."}
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-sm leading-7 text-white/60">
                    Finish a live session and the latest return panel will start anchoring
                    the dashboard automatically.
                  </p>
                )}
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                      Alignment trend
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#D4AF37]">
                      {averageRecentScore}% recent average
                    </p>
                  </div>
                  <div className="mt-5 rounded-[22px] border border-white/8 bg-black/24 p-4">
                    {trendPoints ? (
                      <>
                        <svg viewBox="0 0 100 100" className="h-32 w-full">
                          <defs>
                            <linearGradient id="trend-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#D4AF37" />
                              <stop offset="100%" stopColor="#00E676" />
                            </linearGradient>
                          </defs>
                          {[20, 40, 60, 80].map((line) => (
                            <line
                              key={line}
                              x1="0"
                              y1={line}
                              x2="100"
                              y2={line}
                              stroke="rgba(255,255,255,0.08)"
                              strokeWidth="0.8"
                              strokeDasharray="2 4"
                            />
                          ))}
                          <polyline
                            fill="none"
                            stroke="url(#trend-stroke)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={trendPoints}
                          />
                        </svg>
                        <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/34">
                          <span>older sessions</span>
                          <span>latest session</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-32 items-center justify-center text-sm text-white/50">
                        Trend line unlocks after saved live sessions.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                      Session duration
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#00E676]">
                      {formatDuration(averageRecentDuration)} average
                    </p>
                  </div>
                  <div className="mt-5 rounded-[22px] border border-white/8 bg-black/24 p-4">
                    {durationTrendPoints ? (
                      <>
                        <svg viewBox="0 0 100 100" className="h-24 w-full">
                          <defs>
                            <linearGradient id="duration-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#F5F5F5" />
                              <stop offset="100%" stopColor="#00E676" />
                            </linearGradient>
                          </defs>
                          {[25, 50, 75].map((line) => (
                            <line
                              key={line}
                              x1="0"
                              y1={line}
                              x2="100"
                              y2={line}
                              stroke="rgba(255,255,255,0.08)"
                              strokeWidth="0.8"
                              strokeDasharray="2 4"
                            />
                          ))}
                          <polyline
                            fill="none"
                            stroke="url(#duration-stroke)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={durationTrendPoints}
                          />
                        </svg>
                        <div className="mt-3 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/34">
                          <span>shorter holds</span>
                          <span>longer holds</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex h-24 items-center justify-center text-sm text-white/50">
                        Duration trend unlocks after saved live sessions.
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                      Focus map
                    </p>
                    <p className="text-[11px] uppercase tracking-[0.22em] text-white/30">
                      live aggregate
                    </p>
                  </div>
                  <div className="mt-5 grid gap-3 sm:grid-cols-3">
                    {(regionProgress.length
                      ? regionProgress
                      : [
                          { id: "front-knee", label: "Front knee", value: 0 },
                          { id: "back-leg", label: "Back leg", value: 0 },
                          { id: "shoulders", label: "Shoulder stack", value: 0 },
                        ]
                    ).map((item) => (
                      <div
                        key={item.id}
                        className="rounded-[22px] border border-white/8 bg-black/28 px-4 py-4"
                      >
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/38">
                          {item.label}
                        </p>
                        <p className="mt-3 display-font text-3xl text-[#F5F5F5]">
                          {item.value}%
                        </p>
                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                            className="h-full rounded-full bg-[linear-gradient(90deg,#D4AF37,#00E676)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </MotionBlock>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {progressMetrics.map((metric) => (
            <MotionBlock key={metric.id}>
              <motion.article
                whileHover={{
                  y: -6,
                  borderColor: "rgba(212, 175, 55, 0.45)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.22)",
                }}
                className="glass-panel relative h-full overflow-hidden rounded-[28px] border border-[#D4AF37]/12 bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.08),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6"
              >
                <div className="absolute inset-x-0 top-0 h-[2px] bg-[linear-gradient(90deg,rgba(212,175,55,0),rgba(212,175,55,0.7),rgba(255,255,255,0))]" />
                <p className="text-xs uppercase tracking-[0.28em] text-white/42">
                  {metric.label}
                </p>
                <p className="display-font mt-6 text-4xl text-[#F5F5F5]">
                  {metric.value}
                </p>
                <p className="mt-3 text-sm leading-6 text-white/58">
                  {metric.detail}
                </p>
              </motion.article>
            </MotionBlock>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MotionBlock className="glass-panel rounded-[32px] border border-[#D4AF37]/12 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#D4AF37]">
                  Recent Sessions
                </p>
                <h2 className="display-font mt-3 text-3xl text-[#F5F5F5]">
                  Recent calibration notes
                </h2>
              </div>
              <NavigationLink
                href="/session"
                loadingLabel="Opening session studio"
                className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-white/42 hover:border-[#D4AF37]/35 hover:text-[#F5F5F5]"
              >
                New session
              </NavigationLink>
            </div>

            <div className="mt-6 space-y-4">
              {recentSessions.length ? (
                recentSessions.map((session) => (
                  <motion.div
                    key={session.id}
                    whileHover={{ x: 6, borderColor: "rgba(212, 175, 55, 0.4)" }}
                    className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg text-[#F5F5F5]">{session.pose_name}</p>
                        <p className="mt-1 text-sm text-white/46">
                          {formatRelativeSessionTime(session.created_at)}
                        </p>
                      </div>
                      <span className="rounded-full border border-[#D4AF37]/25 px-3 py-1 text-xs uppercase tracking-[0.18em] text-[#D4AF37]">
                        {session.alignment_score}% aligned
                      </span>
                    </div>
                    <p className="mt-4 text-sm leading-6 text-white/58">
                      Session length {formatDuration(session.duration_seconds)}.{" "}
                      {session.summary ?? "Alignment data stored for this practice run."}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="rounded-[24px] border border-white/8 bg-white/[0.03] px-5 py-5 text-sm leading-7 text-white/60">
                  {isLoadingData
                    ? "Loading your stored practice sessions."
                    : "No live sessions have been saved yet. Complete one session and end it to populate this dashboard."}
                </div>
              )}
            </div>
          </MotionBlock>

          <MotionBlock className="glass-panel rounded-[32px] border border-[#D4AF37]/12 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-6 sm:p-7">
            <p className="text-xs uppercase tracking-[0.28em] text-white/42">Progress</p>
            <h2 className="display-font mt-3 text-3xl text-[#F5F5F5]">Weekly poise</h2>

            <div className="mt-8 space-y-5">
              {(regionProgress.length
                ? regionProgress
                : [
                    { id: "front-knee", label: "Front knee", value: 0 },
                    { id: "back-leg", label: "Back leg", value: 0 },
                    { id: "shoulders", label: "Shoulder stack", value: 0 },
                  ]
              ).map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm text-white/62">
                    <span>{item.label}</span>
                    <span>{item.value}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
                      className="h-full rounded-full bg-[#D4AF37]"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-[28px] border border-[#D4AF37]/18 bg-[#D4AF37]/8 p-5">
              <p className="text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
                Quiet recommendation
              </p>
              <p className="mt-3 text-sm leading-6 text-white/72">
                {recommendation}
              </p>
            </div>
          </MotionBlock>
        </div>
      </MotionSection>
      </main>
    </RequireAuth>
  );
}

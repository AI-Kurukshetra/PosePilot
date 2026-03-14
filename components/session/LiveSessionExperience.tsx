"use client";

import PoseDetector from "@/components/PoseDetector";
import type { PoseEvaluationSnapshot, RegionFeedback } from "@/lib/pose-feedback";
import { buildPracticeSessionPayload, queuePracticeSession } from "@/lib/practice-sessions";
import { useNavigationLoader } from "@/components/ui/navigation-loader";
import { MotionBlock, MotionSection } from "@/components/ui/page-transition";
import SiteHeader from "@/components/ui/SiteHeader";
import { poses, type PoseKey } from "@/lib/poses";
import { useEffect, useRef, useState } from "react";

export default function LiveSessionExperience({ poseKey }: { poseKey: PoseKey }) {
  const pose = poses[poseKey];
  const { startLoading, isLoading } = useNavigationLoader();
  const [isActionLocked, setIsActionLocked] = useState(false);
  const [detectorFeedback, setDetectorFeedback] = useState<RegionFeedback[]>([]);
  const [sessionSnapshot, setSessionSnapshot] = useState<PoseEvaluationSnapshot | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const sessionStartedAtRef = useRef<number | null>(null);
  const isBusy = isLoading || isActionLocked;

  useEffect(() => {
    sessionStartedAtRef.current = Date.now();

    const interval = window.setInterval(() => {
      if (!sessionStartedAtRef.current) {
        return;
      }

      setElapsedSeconds(
        Math.max(Math.floor((Date.now() - sessionStartedAtRef.current) / 1000), 0)
      );
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  const showCelebration = sessionSnapshot?.regions.every((region) => region.isCorrect);
  const elapsedLabel = `${Math.floor(elapsedSeconds / 60)
    .toString()
    .padStart(2, "0")}:${(elapsedSeconds % 60).toString().padStart(2, "0")}`;

  const handleExit = (label: string, shouldSaveSession: boolean) => {
    if (isBusy) {
      return;
    }

    if (shouldSaveSession && sessionSnapshot?.regions.length) {
      queuePracticeSession(
        buildPracticeSessionPayload(
          poseKey,
          sessionSnapshot.score,
          Math.max(
            Math.round((Date.now() - (sessionStartedAtRef.current ?? Date.now())) / 1000),
            1
          ),
          sessionSnapshot.detail,
          sessionSnapshot.regions
        )
      );
    }

    setIsActionLocked(true);
    startLoading(label);
    window.location.href = `/session/${poseKey}`;
  };

  return (
    <main className="page-grid live-session-shell min-h-screen px-1 py-1 sm:px-2 sm:py-2">
      <MotionSection className="relative z-10 mx-auto flex min-h-[calc(100vh-0.5rem)] w-full max-w-[1920px] flex-col gap-2 sm:min-h-[calc(100vh-1rem)]">
        <SiteHeader />
        <MotionBlock className="live-session-top rounded-[24px] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),rgba(255,255,255,0.03))] px-4 py-4 backdrop-blur-xl sm:px-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[#D4AF37]">
                  Live Session
                </p>
                <span className="rounded-full border border-[#00E676]/25 bg-[#00E676]/10 px-3 py-1 text-[10px] uppercase tracking-[0.24em] text-[#00E676]">
                  Camera active
                </span>
              </div>
              <h1 className="display-font mt-3 text-2xl text-[#F5F5F5] sm:text-3xl">
                {pose.name}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">
                Keep your full body visible. Green regions are correct right now, red
                regions need adjustment.
              </p>
            </div>

            <div className="grid w-full gap-2 sm:grid-cols-2 xl:w-auto xl:min-w-[360px]">
              <button
                type="button"
                onClick={() => handleExit("Returning to pose setup", false)}
                disabled={isBusy}
                className="inline-flex min-h-12 items-center justify-center rounded-[20px] border border-white/12 bg-white/[0.03] px-4 py-3 text-sm font-medium text-white/76 hover:border-white/24 hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => handleExit("Ending live session", true)}
                disabled={isBusy}
                className="inline-flex min-h-12 items-center justify-center rounded-[20px] border border-[#FF4C4C]/30 bg-[linear-gradient(135deg,rgba(255,76,76,0.2),rgba(255,76,76,0.08))] px-4 py-3 text-sm font-medium uppercase tracking-[0.18em] text-[#F5F5F5] hover:border-[#FF4C4C]/55 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                End session
              </button>
            </div>
          </div>
          {showCelebration && (
            <div className="mt-4 rounded-[18px] border border-[#00E676]/40 bg-[#00E676]/10 px-5 py-3 text-sm font-medium uppercase tracking-[0.3em] text-[#00E676]">
              You are doing great!
            </div>
          )}
          <div className="mt-4 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {(detectorFeedback.length ? detectorFeedback : []).map((region) => (
                <div
                  key={region.id}
                  className={`rounded-full border px-3 py-2 text-[11px] uppercase tracking-[0.22em] transition ${
                    region.isCorrect
                      ? "border-[#00E676]/35 bg-[#00E676]/10 text-[#00E676]"
                      : "border-[#FF4C4C]/30 bg-[#FF4C4C]/10 text-[#FF4C4C]"
                  }`}
                >
                  {region.label}
                </div>
              ))}
              {!detectorFeedback.length && (
                <div className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/42">
                  Awaiting body detection
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/42">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
                Session {elapsedLabel}
              </span>
              <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-3 py-2 text-[#D4AF37]">
                camera kept clear
              </span>
            </div>
          </div>
        </MotionBlock>

        <MotionBlock className="live-session-panels grid gap-2 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[24px] border border-white/10 bg-black/35 px-4 py-4 backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[#D4AF37]">
              Pose cues
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {pose.cues.map((cue) => (
                <div
                  key={cue}
                  className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/68"
                >
                  {cue}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[24px] border border-white/10 bg-black/35 px-4 py-4 backdrop-blur-md">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">
              Live response
            </p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {(detectorFeedback.length ? detectorFeedback : []).map((region) => (
                <div
                  key={region.id}
                  className={`rounded-[18px] border px-4 py-3 text-sm leading-6 ${
                    region.isCorrect
                      ? "border-[#00E676]/25 bg-[#00E676]/10 text-white/82"
                      : "border-[#FF4C4C]/25 bg-[#FF4C4C]/10 text-white/82"
                  }`}
                >
                  <p
                    className={`text-[11px] uppercase tracking-[0.24em] ${
                      region.isCorrect ? "text-[#00E676]" : "text-[#FF4C4C]"
                    }`}
                  >
                    {region.label}
                  </p>
                  <p className="mt-2">{region.detail}</p>
                </div>
              ))}

              {!detectorFeedback.length && (
                <div className="rounded-[18px] border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-6 text-white/60 sm:col-span-2">
                  Step into frame and hold the pose. Live body-part feedback will appear
                  here as soon as the detector sees you.
                </div>
              )}
            </div>
          </div>
        </MotionBlock>

        <MotionBlock className="live-session-camera flex-1 overflow-hidden rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-1 sm:p-2">
          <div className="h-full min-h-[calc(100vh-16rem)] overflow-hidden rounded-[24px]">
            <PoseDetector
              poseType={poseKey}
              onFeedbackChange={setDetectorFeedback}
              onStateChange={setSessionSnapshot}
            />
          </div>
        </MotionBlock>
      </MotionSection>
    </main>
  );
}

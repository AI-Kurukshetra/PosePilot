"use client";

import PendingPracticeSessionSync from "@/components/session/PendingPracticeSessionSync";
import { MotionBlock, MotionSection } from "@/components/ui/page-transition";
import SiteHeader from "@/components/ui/SiteHeader";
import { NavigationLink } from "@/components/ui/navigation-loader";
import { poses, type PoseKey } from "@/lib/poses";
import { motion } from "framer-motion";

export default function SessionExperience({ poseKey }: { poseKey: PoseKey }) {
  const pose = poses[poseKey];

  return (
    <main className="page-grid min-h-screen px-6 py-8 sm:px-8 lg:px-10">
      <PendingPracticeSessionSync />
      <MotionSection className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <SiteHeader />
        <MotionBlock className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
              Live Session
            </p>
            <h1 className="display-font text-5xl text-[#F5F5F5] sm:text-6xl">
              {pose.name}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/66 sm:text-lg">
              {pose.description}
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
            <NavigationLink
              href="/session"
              loadingLabel="Returning to pose library"
              className="inline-flex items-center justify-center rounded-full border border-white/12 px-5 py-3 text-sm text-white/70 hover:border-white/24 hover:text-white"
            >
              Change pose
            </NavigationLink>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.99 }}
              className="flex"
            >
              <NavigationLink
                href={`/session/${poseKey}/live`}
                loadingLabel={`Starting ${pose.name} live session`}
                className="inline-flex w-full items-center justify-center rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-medium uppercase tracking-[0.2em] text-black sm:w-auto"
              >
                Start session
              </NavigationLink>
            </motion.div>
          </div>
        </MotionBlock>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <MotionBlock className="glass-panel overflow-hidden rounded-[32px] p-4 sm:p-5">
            <div
              className="flex items-center justify-center rounded-[28px] border border-dashed border-white/12 bg-white/[0.02]"
              style={{ minHeight: "min(72vh, 760px)" }}
            >
              <div className="max-w-md px-8 text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-white/38">
                  Full-screen live view
                </p>
                <h2 className="display-font mt-4 text-3xl text-[#F5F5F5]">
                  Camera space reserved for the full session.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/58">
                  Starting the session opens a dedicated full-screen detector page so
                  your full body fits on desktop and mobile without the side panels
                  shrinking the camera area.
                </p>
              </div>
            </div>
          </MotionBlock>

          <div className="space-y-6">
            <MotionBlock className="glass-panel rounded-[32px] p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-[#D4AF37]">
                Precision cues
              </p>
              <div className="mt-5 space-y-4">
                {pose.cues.map((cue) => (
                  <div
                    key={cue}
                    className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm leading-6 text-white/68"
                  >
                    {cue}
                  </div>
                ))}
              </div>
            </MotionBlock>

            <MotionBlock className="glass-panel rounded-[32px] p-6 sm:p-7">
              <p className="text-xs uppercase tracking-[0.28em] text-white/45">
                Status palette
              </p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-[#00E676]/25 bg-[#00E676]/10 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#00E676]">
                    Correct
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/76">
                    A vivid green outline marks strong alignment and stable joint angles.
                  </p>
                </div>
                <div className="rounded-3xl border border-[#FF4C4C]/25 bg-[#FF4C4C]/10 p-5">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#FF4C4C]">
                    Incorrect
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/76">
                    A bold red outline indicates a form break that needs immediate adjustment.
                  </p>
                </div>
              </div>
            </MotionBlock>
          </div>
        </div>
      </MotionSection>
    </main>
  );
}

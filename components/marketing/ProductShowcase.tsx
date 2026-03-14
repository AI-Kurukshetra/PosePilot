"use client";

import { NavigationLink } from "@/components/ui/navigation-loader";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

const stages = [
  {
    id: "capture",
    index: "01",
    label: "Capture",
    title: "Full-frame live posture studio",
    body:
      "Users step into a dedicated camera experience where the product clears away UI clutter and keeps attention on the body.",
    tone: "#D4AF37",
  },
  {
    id: "respond",
    index: "02",
    label: "Respond",
    title: "Body-part feedback that updates with intent",
    body:
      "Correct regions lock green. Drifting regions return to red. Feedback stays specific, reversible, and easy to trust.",
    tone: "#00E676",
  },
  {
    id: "return",
    index: "03",
    label: "Return",
    title: "A dashboard that feels composed, not crowded",
    body:
      "Practice ends in a calm reporting surface with progress, streaks, and guided next steps that feel premium.",
    tone: "#F5F5F5",
  },
] as const;

function StageCard({
  stage,
  progress,
  index,
}: {
  stage: (typeof stages)[number];
  progress: ReturnType<typeof useSpring>;
  index: number;
}) {
  const start = index * 0.28;
  const peak = start + 0.12;
  const end = start + 0.32;
  const opacity = useTransform(progress, [start, peak, end], [0.34, 1, 0.34]);
  const y = useTransform(progress, [start, peak, end], [18, 0, -8]);
  const scale = useTransform(progress, [start, peak, end], [0.98, 1, 0.985]);
  const borderColor = useTransform(
    progress,
    [start, peak, end],
    ["rgba(255,255,255,0.08)", stage.tone, "rgba(255,255,255,0.08)"]
  );
  const glowOpacity = useTransform(progress, [start, peak, end], [0.08, 0.2, 0.08]);

  return (
    <motion.article
      style={{ opacity, y, scale, borderColor }}
      className="relative overflow-hidden rounded-[26px] border bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.12),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 backdrop-blur-md"
    >
      <motion.div
        style={{ opacity: glowOpacity }}
        className="absolute inset-y-0 left-0 w-[3px]"
        aria-hidden="true"
      >
        <div className="h-full w-full" style={{ backgroundColor: stage.tone }} />
      </motion.div>
      <div className="flex items-center gap-3">
        <span
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border text-[11px] uppercase tracking-[0.22em]"
          style={{
            borderColor: `${stage.tone}33`,
            color: stage.tone,
            backgroundColor: `${stage.tone}14`,
          }}
        >
          {stage.index}
        </span>
        <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">{stage.label}</p>
      </div>
      <h3 className="display-font mt-4 text-3xl leading-tight text-[#F5F5F5]">
        {stage.title}
      </h3>
      <p className="mt-3 text-sm leading-7 text-white/64">{stage.body}</p>
    </motion.article>
  );
}

export default function ProductShowcase({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  primaryLoadingLabel,
  secondaryLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  primaryHref: string;
  primaryLabel: string;
  primaryLoadingLabel: string;
  secondaryLabel: string;
}) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 28,
    mass: 0.34,
  });

  const previewY = useTransform(progress, [0, 1], [12, -18]);
  const previewRotate = useTransform(progress, [0, 1], [-3, 1.2]);
  const previewScale = useTransform(progress, [0, 0.55, 1], [0.97, 1, 1.02]);
  const warriorOpacity = useTransform(progress, [0, 0.22, 0.42], [1, 1, 0.12]);
  const armpressOpacity = useTransform(progress, [0.3, 0.52, 0.72], [0.08, 1, 0.18]);
  const dashboardOpacity = useTransform(progress, [0.62, 0.82, 1], [0.1, 0.84, 1]);
  const railHeight = useTransform(progress, [0, 1], ["18%", "100%"]);
  const pulseScale = useTransform(progress, [0, 0.45, 1], [0.92, 1, 1.08]);
  const signalOpacity = useTransform(progress, [0, 0.2, 0.5], [0.45, 1, 0.6]);
  const sheenX = useTransform(progress, [0, 1], ["-24%", "118%"]);
  const orbitRotate = useTransform(progress, [0, 1], [0, 140]);
  const captureOpacity = useTransform(progress, [0, 0.24, 0.4], [1, 1, 0.28]);
  const respondOpacity = useTransform(progress, [0.26, 0.5, 0.72], [0.24, 1, 0.28]);
  const returnOpacity = useTransform(progress, [0.56, 0.82, 1], [0.18, 1, 1]);

  return (
    <section ref={sectionRef} className="relative min-h-[240vh]">
      <div className="sticky top-0 flex min-h-screen items-center py-8">
        <div className="grid w-full gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="space-y-5 pt-3">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
                {eyebrow}
              </p>
              <h2 className="display-font text-5xl leading-none text-[#F5F5F5] sm:text-6xl">
                {title}
              </h2>
              <p className="mt-5 max-w-xl text-base leading-7 text-white/64 sm:text-lg">
                {description}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <NavigationLink
                href={primaryHref}
                loadingLabel={primaryLoadingLabel}
                className="rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-black shadow-[0_18px_40px_rgba(212,175,55,0.22)] hover:scale-[1.02]"
              >
                {primaryLabel}
              </NavigationLink>
              <span className="rounded-full border border-white/10 px-5 py-3 text-sm uppercase tracking-[0.18em] text-white/46">
                {secondaryLabel}
              </span>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Studio", value: "camera-first" },
                { label: "Response", value: "green when right" },
                { label: "Return", value: "real session memory" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] px-4 py-4"
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/40">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#F5F5F5]">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4">
              {stages.map((stage, index) => (
                <StageCard key={stage.id} stage={stage} index={index} progress={progress} />
              ))}
            </div>
          </div>

          <div className="relative flex min-h-[74vh] items-center justify-center lg:min-h-[86vh]">
            <motion.div
              style={{ y: previewY, rotate: previewRotate, scale: previewScale }}
              className="relative w-full max-w-[880px]"
            >
              <div className="absolute inset-0 rounded-[42px] bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.22),transparent_42%),radial-gradient(circle_at_80%_20%,rgba(0,230,118,0.12),transparent_28%)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[40px] border border-[#D4AF37]/14 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-3 shadow-[0_28px_120px_rgba(0,0,0,0.48)]">
                <motion.div
                  style={{ x: sheenX }}
                  className="pointer-events-none absolute inset-y-0 top-0 z-10 w-[26%] bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent)] blur-xl"
                />
                <div className="rounded-[32px] border border-white/8 bg-[#050505] p-4">
                  <div className="mb-4 flex items-center justify-between rounded-[24px] border border-white/8 bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                        <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]">
                          PosePilot Studio
                        </p>
                        <p className="mt-2 display-font text-2xl text-[#F5F5F5]">
                          Precision without clutter
                        </p>
                      </div>
                    </div>
                    <div className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/50">
                      guided live system
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-[0.35fr_0.65fr]">
                    <div className="space-y-4">
                      <div className="rounded-[24px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">
                            Scene track
                          </p>
                          <p className="text-[11px] uppercase tracking-[0.22em] text-white/32">
                            scroll guided
                          </p>
                        </div>
                        <div className="mt-4 grid gap-2">
                          <motion.div
                            style={{ opacity: captureOpacity }}
                            className="rounded-[16px] border border-[#D4AF37]/25 bg-[#D4AF37]/10 px-3 py-3 text-sm text-white/78"
                          >
                            Capture posture without interface noise.
                          </motion.div>
                          <motion.div
                            style={{ opacity: respondOpacity }}
                            className="rounded-[16px] border border-[#00E676]/25 bg-[#00E676]/10 px-3 py-3 text-sm text-white/78"
                          >
                            Respond with region-level corrections.
                          </motion.div>
                          <motion.div
                            style={{ opacity: returnOpacity }}
                            className="rounded-[16px] border border-white/10 bg-black/30 px-3 py-3 text-sm text-white/78"
                          >
                            Return to a calm session report.
                          </motion.div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[#D4AF37]/14 bg-[linear-gradient(180deg,rgba(212,175,55,0.08),rgba(255,255,255,0.03))] p-4">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-[#D4AF37]">
                          Pose cues
                        </p>
                        <div className="mt-3 space-y-2 text-sm leading-6 text-white/66">
                          <div className="rounded-[16px] bg-black/30 px-3 py-3">
                            Keep the full body visible.
                          </div>
                          <div className="rounded-[16px] bg-black/30 px-3 py-3">
                            Match each region until the line locks green.
                          </div>
                          <div className="rounded-[16px] bg-black/30 px-3 py-3">
                            Finish inside a calm report view.
                          </div>
                        </div>
                      </div>

                      <div className="rounded-[24px] border border-[#00E676]/12 bg-[linear-gradient(180deg,rgba(0,230,118,0.06),rgba(255,255,255,0.03))] p-4">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">
                          Region response
                        </p>
                        <div className="mt-3 space-y-2 text-sm leading-6">
                          <div className="rounded-[16px] border border-[#00E676]/25 bg-[#00E676]/10 px-3 py-3 text-white/82">
                            Front knee is grounded and aligned.
                          </div>
                          <div className="rounded-[16px] border border-[#FF4C4C]/25 bg-[#FF4C4C]/10 px-3 py-3 text-white/82">
                            Back leg still needs reach and extension.
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="relative min-h-[540px] overflow-hidden rounded-[28px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),rgba(0,0,0,1)_48%)]">
                      <div className="absolute inset-x-0 top-0 z-20 h-[3px] bg-white/8">
                        <motion.div
                          style={{ height: railHeight }}
                          className="absolute left-0 top-0 w-full origin-top rounded-full bg-[linear-gradient(180deg,#D4AF37,#00E676,#FF4C4C)]"
                        />
                      </div>
                      <motion.div
                        style={{ rotate: orbitRotate }}
                        className="pointer-events-none absolute inset-8 z-10 rounded-full border border-white/6"
                      />

                      <motion.div style={{ opacity: warriorOpacity }} className="absolute inset-0">
                        <Image
                          src="/poses/warrior.png"
                          alt="Warrior pose product preview"
                          fill
                          className="object-cover opacity-72"
                          sizes="(max-width: 1024px) 100vw, 55vw"
                          priority
                        />
                      </motion.div>
                      <motion.div style={{ opacity: armpressOpacity }} className="absolute inset-0">
                        <Image
                          src="/poses/armpress.png"
                          alt="Arm press product preview"
                          fill
                          className="object-cover opacity-72"
                          sizes="(max-width: 1024px) 100vw, 55vw"
                        />
                      </motion.div>
                      <motion.div
                        style={{ opacity: dashboardOpacity }}
                        className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.16),transparent_32%),linear-gradient(180deg,rgba(255,255,255,0.05),rgba(0,0,0,0.45))]"
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.58))]" />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(0,230,118,0.08),transparent_16%)]" />

                      <div className="absolute left-4 top-4 rounded-[20px] border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">
                          Alignment
                        </p>
                        <p className="mt-2 text-3xl text-[#F5F5F5]">94%</p>
                      </div>

                      <div className="absolute right-4 top-4 rounded-[20px] border border-white/10 bg-black/45 px-4 py-3 text-right backdrop-blur-md">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">
                          Body in frame
                        </p>
                        <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#00E676]">
                          confirmed
                        </p>
                      </div>

                      <motion.div
                        style={{ opacity: signalOpacity, scale: pulseScale }}
                        className="absolute left-1/2 top-1/2 z-10 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D4AF37]/18"
                      >
                        <div className="absolute inset-[14px] rounded-full border border-white/10" />
                        <div className="absolute inset-[30px] rounded-full border border-[#00E676]/18" />
                        <div className="absolute inset-[56px] rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.2),rgba(0,0,0,0))]" />
                      </motion.div>

                      <motion.div
                        style={{ opacity: dashboardOpacity }}
                        className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-3"
                      >
                        {[
                          {
                            label: "Consistency",
                            value: "14 days",
                            tone: "border-[#D4AF37]/25 bg-[#D4AF37]/10",
                          },
                          {
                            label: "Alignment",
                            value: "91%",
                            tone: "border-[#00E676]/25 bg-[#00E676]/10",
                          },
                          {
                            label: "Focus",
                            value: "3 poses",
                            tone: "border-white/10 bg-black/40",
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className={`rounded-[18px] border px-4 py-3 text-[#F5F5F5] backdrop-blur-md ${item.tone}`}
                          >
                            <p className="text-[11px] uppercase tracking-[0.24em] text-white/56">
                              {item.label}
                            </p>
                            <p className="mt-2 display-font text-2xl">{item.value}</p>
                          </div>
                        ))}
                      </motion.div>

                      <div className="absolute bottom-4 right-4 z-20 hidden gap-2 md:flex">
                        {stages.map((stage, index) => (
                          <motion.div
                            key={stage.id}
                            style={{
                              opacity:
                                index === 0
                                  ? captureOpacity
                                  : index === 1
                                    ? respondOpacity
                                    : returnOpacity,
                            }}
                            className="rounded-full border border-white/10 bg-black/45 px-3 py-2 text-[10px] uppercase tracking-[0.24em] text-white/56 backdrop-blur-md"
                          >
                            {stage.label}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pointer-events-none absolute -right-4 top-[10%] hidden w-60 rounded-[26px] border border-[#D4AF37]/18 bg-[linear-gradient(180deg,rgba(212,175,55,0.12),rgba(255,255,255,0.02))] p-4 backdrop-blur-md xl:block">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#D4AF37]">
                  Live detector
                </p>
                <p className="display-font mt-3 text-2xl text-[#F5F5F5]">
                  Clear camera-first guidance
                </p>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  The camera surface feels intentional instead of cramped by controls.
                </p>
              </div>

              <div className="pointer-events-none absolute -left-8 bottom-[16%] hidden w-64 rounded-[26px] border border-[#00E676]/18 bg-[linear-gradient(180deg,rgba(0,230,118,0.12),rgba(255,255,255,0.02))] p-4 backdrop-blur-md xl:block">
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#00E676]">
                  Dynamic response
                </p>
                <p className="display-font mt-3 text-2xl text-[#F5F5F5]">
                  Correct what matters, exactly when it matters
                </p>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Users understand instantly what improved and what fell out of position.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

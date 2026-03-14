"use client";

import ProductShowcase from "@/components/marketing/ProductShowcase";
import { MotionBlock, MotionSection } from "@/components/ui/page-transition";
import SiteHeader from "@/components/ui/SiteHeader";
import { NavigationLink } from "@/components/ui/navigation-loader";
import { motion } from "framer-motion";
import Image from "next/image";

const livePreviewCards = [
  {
    id: "chair",
    image: "/poses/chair.png",
    badge: "Desk mode",
    title: "Chair-ready guidance",
    body: "A second live path for smaller spaces and workday breaks.",
    shellClassName: "absolute right-4 top-24 hidden w-40 md:block xl:w-44",
    badgeClassName: "border-[#D4AF37]/25 bg-[#D4AF37]/10 text-[#D4AF37]",
    animation: { y: [0, -10, 0], rotate: [0, 1, 0] },
    duration: 6.2,
  },
  {
    id: "armpress",
    image: "/poses/armpress.png",
    badge: "Strength flow",
    title: "Arm-press preview",
    body: "The landing screen now hints at multiple guided routines immediately.",
    shellClassName: "absolute right-4 bottom-24 hidden w-44 lg:block xl:w-48",
    badgeClassName: "border-[#00E676]/25 bg-[#00E676]/10 text-[#00E676]",
    animation: { y: [0, 10, 0], rotate: [0, -1, 0] },
    duration: 7.1,
  },
];

export default function Home() {
  return (
    <main className="page-grid min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(212,175,55,0.12),transparent_24%),radial-gradient(circle_at_82%_18%,rgba(0,230,118,0.08),transparent_20%)] px-6 py-8 sm:px-8 lg:px-10">
      <MotionSection className="relative z-10 mx-auto flex w-full max-w-[1500px] flex-col gap-10">
        <SiteHeader />
        <div className="grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <MotionBlock className="max-w-3xl">
            <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
              Real-time posture studio
            </p>
            <h1 className="display-font text-6xl leading-none text-[#F5F5F5] sm:text-7xl">
              Quiet design. Exact correction. A first screen worth staying on.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/66 sm:text-lg">
              Real-time yoga posture guidance in a cinematic black interface built for
              focus, not distraction. The landing page now behaves like a product reveal
              before the user ever signs in.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <NavigationLink
                href="/signup"
                loadingLabel="Opening account setup"
                className="rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-medium uppercase tracking-[0.2em] text-black hover:scale-[1.02]"
              >
                Get started
              </NavigationLink>
              <NavigationLink
                href="/login"
                loadingLabel="Opening login"
                className="rounded-full border border-white/12 px-6 py-3 text-sm uppercase tracking-[0.2em] text-white/74 hover:border-[#D4AF37]/35 hover:text-[#F5F5F5]"
              >
                Log in
              </NavigationLink>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                { label: "Live studio", value: "camera first" },
                { label: "Feedback", value: "region precise" },
                { label: "Desk mode", value: "chair reach ready" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.015))] px-4 py-4 backdrop-blur-md"
                >
                  <p className="text-[11px] uppercase tracking-[0.24em] text-white/38">
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#F5F5F5]">{item.value}</p>
                </div>
              ))}
            </div>
          </MotionBlock>

          <MotionBlock className="hero-preview-shell overflow-hidden rounded-[40px] border border-[#D4AF37]/14 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-5">
            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[30px] border border-[#D4AF37]/14 bg-[linear-gradient(180deg,rgba(212,175,55,0.08),rgba(255,255,255,0.03))] p-5">
                <p className="text-[11px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  First impression
                </p>
                <h2 className="display-font mt-4 text-4xl text-[#F5F5F5]">
                  Users should understand the product before the first click.
                </h2>
                <p className="mt-4 text-sm leading-7 text-white/62">
                  The new front page previews the live studio, the dynamic correction
                  system, and the calm dashboard return in one immediate surface.
                </p>
                <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  {[
                    "Live body-region correction",
                    "A precise motion-driven reveal",
                    "Premium dashboard reporting preview",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-[18px] border border-white/8 bg-black/25 px-4 py-3 text-sm leading-6 text-white/68"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[420px] overflow-hidden rounded-[30px] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.08),rgba(0,0,0,1)_48%)]">
                <Image
                  src="/poses/warrior.png"
                  alt="PosePilot landing preview"
                  fill
                  className="object-cover opacity-72"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.62))]" />
                <div className="absolute inset-y-10 right-3 hidden w-[34%] rounded-[28px] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.01))] md:block" />
                <div className="absolute left-4 top-4 rounded-[20px] border border-white/10 bg-black/45 px-4 py-3 backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">
                    Live detector
                  </p>
                  <p className="mt-2 text-2xl text-[#F5F5F5]">Dynamic posture studio</p>
                </div>
                <div className="absolute right-4 top-4 rounded-[20px] border border-[#D4AF37]/18 bg-[#D4AF37]/10 px-4 py-3 text-right backdrop-blur-md">
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/42">
                    Experience
                  </p>
                  <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#D4AF37]">
                    designed to hold attention
                  </p>
                </div>
                <div className="absolute bottom-4 left-4 right-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[18px] border border-[#00E676]/25 bg-[#00E676]/10 px-4 py-3 text-white/82 backdrop-blur-md">
                    Front knee turns green once aligned.
                  </div>
                  <div className="rounded-[18px] border border-[#FF4C4C]/25 bg-[#FF4C4C]/10 px-4 py-3 text-white/82 backdrop-blur-md">
                    Back leg stays red until corrected.
                  </div>
                </div>

                {livePreviewCards.map((card) => (
                  <motion.div
                    key={card.id}
                    animate={card.animation}
                    transition={{
                      duration: card.duration,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                    className={card.shellClassName}
                  >
                    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-black/60 shadow-[0_22px_70px_rgba(0,0,0,0.4)] backdrop-blur-md">
                      <div className="relative h-36">
                        <Image
                          src={card.image}
                          alt={card.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1280px) 176px, 192px"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.1),rgba(0,0,0,0.75))]" />
                        <div className="absolute left-3 top-3">
                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] ${card.badgeClassName}`}
                          >
                            {card.badge}
                          </span>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3">
                          <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
                            Live preview
                          </p>
                          <p className="mt-1 text-sm text-[#F5F5F5]">{card.title}</p>
                          <p className="mt-1 text-xs leading-5 text-white/62">{card.body}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </MotionBlock>
        </div>

        <ProductShowcase
          eyebrow="Product Reveal"
          title="This is what users should feel before they create an account."
          description="The landing page now previews the product like a launch page: live studio, dynamic feedback, and premium reporting in one sequence."
          primaryHref="/signup"
          primaryLabel="Create account"
          primaryLoadingLabel="Opening account setup"
          secondaryLabel="Scroll the reveal"
        />
      </MotionSection>
    </main>
  );
}

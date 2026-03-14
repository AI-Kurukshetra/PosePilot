"use client";

import SiteHeader from "@/components/ui/SiteHeader";
import { NavigationLink } from "@/components/ui/navigation-loader";
import { motion } from "framer-motion";

export default function NotFoundExperience() {
  return (
    <main className="page-grid flex min-h-screen items-center justify-center px-6 py-10 sm:px-8">
      <section className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[36px] border border-[#D4AF37]/14 bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_40%),radial-gradient(circle_at_85%_18%,rgba(0,230,118,0.08),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0.02))] p-8 sm:p-12">
        <SiteHeader className="mb-8" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-12 h-56 w-56 rounded-full border border-[#D4AF37]/24"
          animate={{ rotate: 360 }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute -left-12 bottom-10 h-40 w-40 rounded-full border border-dashed border-white/15"
          animate={{ rotate: -360 }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear" }}
        />

        <div className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[#D4AF37]">PosePilot</p>
            <h1 className="display-font mt-4 text-6xl leading-none text-[#F5F5F5] sm:text-7xl">
              404
            </h1>
            <h2 className="display-font mt-4 text-3xl text-[#F5F5F5] sm:text-4xl">
              Route not found.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/66 sm:text-base">
              The page you requested does not exist. Return to the main flow and continue
              your session from a valid route.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <NavigationLink
                href="/"
                loadingLabel="Opening home"
                className="rounded-full bg-[#D4AF37] px-6 py-3 text-xs font-medium uppercase tracking-[0.22em] text-black hover:scale-[1.02]"
              >
                Go home
              </NavigationLink>
              <NavigationLink
                href="/session"
                loadingLabel="Opening session studio"
                className="rounded-full border border-white/12 px-6 py-3 text-xs uppercase tracking-[0.22em] text-white/74 hover:border-[#D4AF37]/35 hover:text-[#F5F5F5]"
              >
                Open session studio
              </NavigationLink>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto w-full max-w-md rounded-[30px] border border-white/10 bg-black/25 p-6"
          >
            <div className="rounded-[24px] border border-[#D4AF37]/20 bg-[#D4AF37]/8 p-5">
              <p className="text-[11px] uppercase tracking-[0.26em] text-[#D4AF37]">
                Navigation hint
              </p>
              <p className="mt-3 text-sm leading-7 text-white/72">
                Check the URL path and ensure it matches an existing route like
                <span className="text-[#F5F5F5]"> /session </span>
                or
                <span className="text-[#F5F5F5]"> /dashboard</span>.
              </p>
            </div>
            <motion.div
              aria-hidden="true"
              className="mt-5 h-[2px] w-full bg-[linear-gradient(90deg,rgba(212,175,55,0),rgba(212,175,55,0.9),rgba(0,230,118,0.45),rgba(212,175,55,0))]"
              animate={{ opacity: [0.35, 1, 0.35] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </section>
    </main>
  );
}

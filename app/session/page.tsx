"use client";

import RequireAuth from "@/components/auth/RequireAuth";
import { MotionBlock, MotionSection } from "@/components/ui/page-transition";
import SiteHeader from "@/components/ui/SiteHeader";
import { NavigationLink } from "@/components/ui/navigation-loader";
import { poses } from "@/lib/poses";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SessionPage() {
  return (
    <RequireAuth>
      <main className="page-grid min-h-screen px-6 py-8 sm:px-8 lg:px-10">
      <MotionSection className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-8">
        <SiteHeader />
        <MotionBlock className="max-w-3xl">
          <p className="mb-4 text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
            Session Studio
          </p>
          <h1 className="display-font text-5xl text-[#F5F5F5] sm:text-6xl">
            Choose the pose. Let the interface disappear.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/66 sm:text-lg">
            Pick a guided posture and enter a focused camera view with live correction
            indicators against a minimal dark overlay.
          </p>
        </MotionBlock>

        <div className="grid gap-6 lg:grid-cols-2">
          {Object.entries(poses).map(([key, pose]) => (
            <MotionBlock key={key}>
              <motion.div whileHover={{ y: -8 }} className="h-full">
                <NavigationLink
                  href={`/session/${key}`}
                  loadingLabel={`Opening ${pose.name}`}
                  className="glass-panel group block h-full overflow-hidden rounded-[32px] p-4"
                >
                  <div className="relative h-72 overflow-hidden rounded-[28px]">
                    <Image
                      src={pose.image}
                      alt={pose.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                    <div className="absolute bottom-5 left-5 rounded-full border border-[#D4AF37]/30 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.24em] text-[#D4AF37]">
                      Live ready
                    </div>
                  </div>

                  <div className="px-2 pb-2 pt-6">
                    <div className="flex items-center justify-between gap-4">
                      <h2 className="display-font text-3xl text-[#F5F5F5]">
                        {pose.name}
                      </h2>
                      <span className="text-sm text-white/42">Open</span>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-white/58">
                      {pose.description}
                    </p>
                  </div>
                </NavigationLink>
              </motion.div>
            </MotionBlock>
          ))}
        </div>
      </MotionSection>
      </main>
    </RequireAuth>
  );
}

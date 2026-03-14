"use client";

import { motion } from "framer-motion";

export default function RouteLoader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <main className="page-grid min-h-screen px-6 py-8 sm:px-8 lg:px-10">
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <div className="glass-panel w-full max-w-2xl rounded-[36px] px-8 py-12 text-center sm:px-12 sm:py-14">
          <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">{eyebrow}</p>
          <h1 className="display-font mt-5 text-4xl text-[#F5F5F5] sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-sm leading-7 text-white/62 sm:text-base">
            {description}
          </p>

          <div className="mt-8 flex items-center justify-center gap-3">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                animate={{ y: [0, -10, 0], opacity: [0.45, 1, 0.45] }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.12,
                }}
                className="h-3 w-3 rounded-full bg-[#D4AF37]"
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

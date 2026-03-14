"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link, { type LinkProps } from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { flushSync } from "react-dom";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from "react";

type NavigationLoaderContextValue = {
  isLoading: boolean;
  startLoading: (label?: string) => void;
  stopLoading: () => void;
  navigate: (href: string, label?: string) => void;
};

const NavigationLoaderContext = createContext<NavigationLoaderContextValue | null>(null);

export function NavigationLoaderProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [label, setLabel] = useState("Opening next screen");
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const elapsed = Date.now() - startedAtRef.current;
    const remaining = Math.max(700 - elapsed, 0);

    const timeout = window.setTimeout(() => {
      setIsLoading(false);
    }, remaining);

    return () => window.clearTimeout(timeout);
  }, [isLoading, pathname]);

  const value = useMemo<NavigationLoaderContextValue>(
    () => ({
      isLoading,
      startLoading(nextLabel = "Opening next screen") {
        startedAtRef.current = Date.now();
        setLabel(nextLabel);
        setIsLoading(true);
      },
      stopLoading() {
        setIsLoading(false);
      },
      navigate(href: string, nextLabel = "Opening next screen") {
        startedAtRef.current = Date.now();
        flushSync(() => {
          setLabel(nextLabel);
          setIsLoading(true);
        });
        router.push(href);
      },
    }),
    [isLoading, router]
  );

  return (
    <NavigationLoaderContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/88 backdrop-blur-xl"
          >
            <div className="glass-panel w-[min(92vw,34rem)] overflow-hidden rounded-[36px] border border-[#D4AF37]/20">
              <div className="bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.18),transparent_42%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] px-8 py-10 text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-[#D4AF37]">
                  PosePilot
                </p>
                <h2 className="display-font mt-4 text-3xl text-[#F5F5F5] sm:text-4xl">
                  Loading
                </h2>
                <p className="mt-3 text-sm leading-7 text-white/64">{label}</p>

                <div className="relative mx-auto mt-8 flex h-28 w-28 items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4.4, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 rounded-full border border-[#D4AF37]/18"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 3.2, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-[8px] rounded-full border border-dashed border-white/16"
                  />
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.08, 1] }}
                    transition={{
                      rotate: { duration: 1.9, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                    }}
                    className="absolute inset-[18px] rounded-full bg-[conic-gradient(from_90deg,rgba(212,175,55,0.95),rgba(212,175,55,0.18),rgba(255,255,255,0.08),rgba(212,175,55,0.95))] p-[1px]"
                  >
                    <div className="h-full w-full rounded-full bg-black/90" />
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.4, 1, 0.4], scale: [0.92, 1.04, 0.92] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#D4AF37]/35 bg-[#D4AF37]/12"
                  >
                    <span className="display-font text-lg text-[#F5F5F5]">P</span>
                  </motion.div>
                </div>

                <div className="mt-8 grid grid-cols-3 gap-2 text-[10px] uppercase tracking-[0.24em] text-white/42">
                  {["Calibrating", "Securing", "Opening"].map((step, index) => (
                    <motion.div
                      key={step}
                      animate={{ opacity: [0.35, 1, 0.35], y: [0, -3, 0] }}
                      transition={{
                        duration: 1.3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.15,
                      }}
                      className="rounded-full border border-white/8 bg-black/25 px-3 py-2"
                    >
                      {step}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </NavigationLoaderContext.Provider>
  );
}

export function useNavigationLoader() {
  const context = useContext(NavigationLoaderContext);

  if (!context) {
    throw new Error("useNavigationLoader must be used within NavigationLoaderProvider.");
  }

  return context;
}

type NavigationLinkProps = LinkProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
    children: ReactNode;
    loadingLabel?: string;
  };

export function NavigationLink({
  href,
  onClick,
  loadingLabel,
  children,
  ...props
}: NavigationLinkProps) {
  const pathname = usePathname();
  const { isLoading, startLoading } = useNavigationLoader();

  const hrefValue = typeof href === "string" ? href : href.pathname ?? "";

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);

    if (
      isLoading ||
      event.defaultPrevented ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank"
    ) {
      return;
    }

    if (hrefValue && hrefValue !== pathname) {
      startLoading(loadingLabel);
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      aria-disabled={isLoading}
      {...props}
    >
      {children}
    </Link>
  );
}

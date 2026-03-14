"use client";

import { performLogout } from "@/lib/logout";
import { useNavigationLoader } from "@/components/ui/navigation-loader";
import { useState } from "react";

export default function LogoutButton({
  className,
}: {
  className?: string;
}) {
  const { startLoading } = useNavigationLoader();
  const [isPending, setIsPending] = useState(false);

  async function handleLogout() {
    if (isPending) {
      return;
    }

    setIsPending(true);
    window.dispatchEvent(new Event("posepilot:leave-live-session"));
    try {
      await performLogout();
    } catch {
      setIsPending(false);
      return;
    }

    startLoading("Signing you out");
    window.location.replace("/login");
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isPending}
      className={
        className ??
        "inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.03] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white/72 hover:border-[#D4AF37]/45 hover:text-[#F5F5F5] disabled:cursor-not-allowed disabled:opacity-70"
      }
    >
      {isPending ? "Logging out..." : "Logout"}
    </button>
  );
}

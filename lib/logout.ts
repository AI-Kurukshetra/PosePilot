import { clearAllPendingPracticeSessions } from "@/lib/practice-sessions";
import { getSupabaseClient } from "@/lib/supabase";

let logoutPromise: Promise<void> | null = null;

export async function performLogout() {
  if (logoutPromise) {
    return logoutPromise;
  }

  logoutPromise = (async () => {
    const supabase = getSupabaseClient();

    if (!supabase) {
      clearAllPendingPracticeSessions();
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        throw error;
      }
    }

    clearAllPendingPracticeSessions();
  })();

  try {
    await logoutPromise;
  } finally {
    logoutPromise = null;
  }
}

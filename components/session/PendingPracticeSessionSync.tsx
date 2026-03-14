"use client";

import { getSupabaseClient } from "@/lib/supabase";
import {
  clearPendingPracticeSessions,
  getPendingPracticeSessions,
} from "@/lib/practice-sessions";
import { useEffect, useRef } from "react";

export default function PendingPracticeSessionSync({
  onSynced,
}: {
  onSynced?: () => void;
}) {
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    if (hasSyncedRef.current) {
      return;
    }

    hasSyncedRef.current = true;
    const supabaseClient = getSupabaseClient();

    if (!supabaseClient) {
      return;
    }

    const client = supabaseClient;

    async function syncPendingSessions() {
      const pendingSessions = getPendingPracticeSessions();

      if (!pendingSessions.length) {
        return;
      }

      const {
        data: { user },
      } = await client.auth.getUser();

      if (!user) {
        return;
      }

      const rows = pendingSessions.map((session) => ({
        user_id: user.id,
        pose_key: session.pose_key,
        pose_name: session.pose_name,
        alignment_score: session.alignment_score,
        duration_seconds: session.duration_seconds,
        status: session.status,
        summary: session.summary,
        region_feedback: session.region_feedback,
        created_at: session.created_at,
      }));

      const { error } = await client.from("practice_sessions").insert(rows);

      if (error) {
        return;
      }

      clearPendingPracticeSessions(pendingSessions.map((session) => session.client_id));
      onSynced?.();
    }

    void syncPendingSessions();
  }, [onSynced]);

  return null;
}

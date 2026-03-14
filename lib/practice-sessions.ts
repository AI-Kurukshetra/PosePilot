"use client";

import { poses, type PoseKey } from "@/lib/poses";
import type { RegionFeedback } from "@/lib/pose-feedback";

const PENDING_SESSIONS_KEY = "posepilot.pending-practice-sessions";

export type PracticeSessionRow = {
  id: number;
  pose_key: PoseKey;
  pose_name: string;
  alignment_score: number;
  duration_seconds: number;
  status: "completed" | "abandoned";
  summary: string | null;
  region_feedback: RegionFeedback[];
  created_at: string;
};

export type PendingPracticeSession = {
  client_id: string;
  created_at: string;
  pose_key: PoseKey;
  pose_name: string;
  alignment_score: number;
  duration_seconds: number;
  status: "completed" | "abandoned";
  summary: string;
  region_feedback: RegionFeedback[];
};

function readStorageValue() {
  if (typeof window === "undefined") {
    return [];
  }

  const storedValue = window.localStorage.getItem(PENDING_SESSIONS_KEY);

  if (!storedValue) {
    return [];
  }

  try {
    return JSON.parse(storedValue) as PendingPracticeSession[];
  } catch {
    window.localStorage.removeItem(PENDING_SESSIONS_KEY);
    return [];
  }
}

function writeStorageValue(value: PendingPracticeSession[]) {
  if (typeof window === "undefined") {
    return;
  }

  if (!value.length) {
    window.localStorage.removeItem(PENDING_SESSIONS_KEY);
    return;
  }

  window.localStorage.setItem(PENDING_SESSIONS_KEY, JSON.stringify(value));
}

export function queuePracticeSession(session: PendingPracticeSession) {
  const pendingSessions = readStorageValue();
  pendingSessions.push(session);
  writeStorageValue(pendingSessions);
}

export function getPendingPracticeSessions() {
  return readStorageValue();
}

export function clearPendingPracticeSessions(clientIds: string[]) {
  if (!clientIds.length) {
    return;
  }

  const remainingSessions = readStorageValue().filter(
    (session) => !clientIds.includes(session.client_id)
  );

  writeStorageValue(remainingSessions);
}

export function clearAllPendingPracticeSessions() {
  writeStorageValue([]);
}

export function buildPracticeSessionPayload(
  poseKey: PoseKey,
  alignmentScore: number,
  durationSeconds: number,
  summary: string,
  regionFeedback: RegionFeedback[]
): PendingPracticeSession {
  return {
    client_id:
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    created_at: new Date().toISOString(),
    pose_key: poseKey,
    pose_name: poses[poseKey].name,
    alignment_score: alignmentScore,
    duration_seconds: durationSeconds,
    status: "completed",
    summary,
    region_feedback: regionFeedback,
  };
}

export function formatDuration(durationSeconds: number) {
  const minutes = Math.floor(durationSeconds / 60);
  const seconds = durationSeconds % 60;

  if (!minutes) {
    return `${Math.max(seconds, 1)} sec`;
  }

  if (!seconds) {
    return `${minutes} min`;
  }

  return `${minutes} min ${seconds} sec`;
}

export function formatRelativeSessionTime(timestamp: string) {
  const now = Date.now();
  const createdAt = new Date(timestamp).getTime();
  const diff = now - createdAt;
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < hour) {
    const minutes = Math.max(1, Math.round(diff / minute));
    return `${minutes} min ago`;
  }

  if (diff < day) {
    const hours = Math.max(1, Math.round(diff / hour));
    return `${hours} hr ago`;
  }

  if (diff < day * 2) {
    return "Yesterday";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(timestamp));
}

export function buildProgressMetrics(sessions: PracticeSessionRow[]) {
  const practicedDays = new Set(
    sessions.map((session) => new Date(session.created_at).toISOString().slice(0, 10))
  );
  const thisWeekSessions = sessions.filter((session) => {
    const createdAt = new Date(session.created_at).getTime();
    return Date.now() - createdAt <= 7 * 24 * 60 * 60 * 1000;
  });
  const averageAlignment = thisWeekSessions.length
    ? Math.round(
        thisWeekSessions.reduce((total, session) => total + session.alignment_score, 0) /
          thisWeekSessions.length
      )
    : 0;
  const practicedPoses = new Set(sessions.map((session) => session.pose_key));

  return [
    {
      id: "consistency",
      label: "Consistency",
      value: `${practicedDays.size} days`,
      detail: "Tracked practice days on record",
    },
    {
      id: "alignment",
      label: "Alignment",
      value: `${averageAlignment}%`,
      detail: "Average precision this week",
    },
    {
      id: "focus",
      label: "Focus",
      value: `${practicedPoses.size} poses`,
      detail: "Unique tracked forms practiced",
    },
  ];
}

export function buildRegionProgress(sessions: PracticeSessionRow[]) {
  const regionMap = new Map<
    string,
    {
      label: string;
      correctCount: number;
      totalCount: number;
    }
  >();

  for (const session of sessions) {
    for (const region of session.region_feedback ?? []) {
      const existingRegion = regionMap.get(region.id) ?? {
        label: region.label,
        correctCount: 0,
        totalCount: 0,
      };

      existingRegion.totalCount += 1;
      existingRegion.correctCount += Number(region.isCorrect);
      regionMap.set(region.id, existingRegion);
    }
  }

  return Array.from(regionMap.entries())
    .map(([id, region]) => ({
      id,
      label: region.label,
      value: Math.round((region.correctCount / region.totalCount) * 100),
    }))
    .sort((left, right) => right.value - left.value)
    .slice(0, 3);
}

export function buildRecommendation(sessions: PracticeSessionRow[]) {
  const weakestRegion = Array.from(
    sessions.reduce<
      Map<
        string,
        {
          label: string;
          totalCount: number;
          correctCount: number;
        }
      >
    >((regionMap, session) => {
      for (const region of session.region_feedback ?? []) {
        const existingRegion = regionMap.get(region.id) ?? {
          label: region.label,
          totalCount: 0,
          correctCount: 0,
        };

        existingRegion.totalCount += 1;
        existingRegion.correctCount += Number(region.isCorrect);
        regionMap.set(region.id, existingRegion);
      }

      return regionMap;
    }, new Map()).values()
  )
    .map((region) => ({
      label: region.label,
      accuracy: region.totalCount ? region.correctCount / region.totalCount : 0,
    }))
    .sort((left, right) => left.accuracy - right.accuracy)[0];

  if (!weakestRegion) {
    return "Complete one live session to start generating correction recommendations.";
  }

  return `Prioritize ${weakestRegion.label.toLowerCase()} next. That region is breaking form most often in your stored sessions.`;
}

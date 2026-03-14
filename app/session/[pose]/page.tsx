import RequireAuth from "@/components/auth/RequireAuth";
import SessionExperience from "@/components/session/SessionExperience";
import { poses, type PoseKey } from "@/lib/poses";
import { notFound } from "next/navigation";

export default async function PosePage({
  params,
}: {
  params: Promise<{ pose: string }>;
}) {
  const { pose } = await params;

  if (!(pose in poses)) {
    notFound();
  }

  return (
    <RequireAuth>
      <SessionExperience poseKey={pose as PoseKey} />
    </RequireAuth>
  );
}

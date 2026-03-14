import RequireAuth from "@/components/auth/RequireAuth";
import LiveSessionExperience from "@/components/session/LiveSessionExperience";
import { poses, type PoseKey } from "@/lib/poses";
import { notFound } from "next/navigation";

export default async function LivePosePage({
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
      <LiveSessionExperience poseKey={pose as PoseKey} />
    </RequireAuth>
  );
}

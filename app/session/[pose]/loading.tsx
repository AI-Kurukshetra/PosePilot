import RouteLoader from "@/components/ui/RouteLoader";

export default function Loading() {
  return (
    <RouteLoader
      eyebrow="Loading Pose"
      title="Preparing your pose details"
      description="Bringing in the reference cues and the live session launch screen."
    />
  );
}

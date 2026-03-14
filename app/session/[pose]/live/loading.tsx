import RouteLoader from "@/components/ui/RouteLoader";

export default function Loading() {
  return (
    <RouteLoader
      eyebrow="Starting Live Session"
      title="Opening the live camera"
      description="Loading the real-time detector and getting your correction overlay ready."
    />
  );
}

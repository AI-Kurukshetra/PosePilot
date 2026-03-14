import RouteLoader from "@/components/ui/RouteLoader";

export default function Loading() {
  return (
    <RouteLoader
      eyebrow="Preparing Session"
      title="Setting up your pose studio"
      description="Loading pose cards, transitions, and the next guided session view."
    />
  );
}

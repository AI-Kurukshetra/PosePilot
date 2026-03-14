import type { Metadata } from "next";
import { NavigationLoaderProvider } from "@/components/ui/navigation-loader";
import "./global.css";
import "./theme-overrides.css";

export const metadata: Metadata = {
  title: {
    default: "PosePilot Studio | Real-Time Yoga Alignment",
    template: "%s | PosePilot Studio",
  },
  description: "AI-powered real-time yoga posture correction.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <NavigationLoaderProvider>{children}</NavigationLoaderProvider>
      </body>
    </html>
  );
}

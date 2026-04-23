import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "ASTRO SYNC",
  description: "ASTRO SYNC is a minimal study planner with stopwatch tracking and a daily focus dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

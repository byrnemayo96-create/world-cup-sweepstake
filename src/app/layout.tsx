import type { Metadata } from "next";
import { SweepstakeProvider } from "@/lib/useSweepstakeState";
import "./globals.css";

export const metadata: Metadata = {
  title: "World Cup 2026 Sweepstake",
  description: "MVP sweepstake site with random draws, leaderboard, and admin stage updates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SweepstakeProvider>{children}</SweepstakeProvider>
      </body>
    </html>
  );
}

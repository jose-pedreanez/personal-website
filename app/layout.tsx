import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import PageTracker from "@/components/PageTracker";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Jose Pedreanez",
  icons: { icon: "/favicon.svg" },
  description:
    "Test & Deployment Engineer specializing in ASRS systems, industrial automation, robotics, and hardware/software integration.",
  keywords: [
    "ASRS",
    "warehouse automation",
    "field engineer",
    "systems engineer",
    "robotics",
    "industrial automation",
    "deployment engineer",
    "BoxBot",
  ],
  authors: [{ name: "Jose Pedreanez" }],
  openGraph: {
    title: "Jose Pedreanez — Field & Systems Engineer",
    description:
      "Test & Deployment Engineer specializing in ASRS systems, industrial automation, robotics, and hardware/software integration.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
        <PageTracker />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

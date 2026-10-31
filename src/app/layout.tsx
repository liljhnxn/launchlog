import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "LaunchLog | Every launch deserves a record",
  description:
    "LaunchLog is a decentralized project showcase where developers and creators publish and verify their launches on Botchain.",
  icons: {
    icon: [
      { url: "/favicon.svg?v=2", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg?v=2",
    apple: "/favicon.svg?v=2",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-charcoal-950 text-charcoal-100 min-h-screen selection:bg-accent-purple selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

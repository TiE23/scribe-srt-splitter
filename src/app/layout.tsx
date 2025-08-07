import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SettingsProvider } from "@contexts/AppContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Subtitle Editor",
  description: "Convert ElevenLabs Scribe JSON to SRT subtitles",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SettingsProvider>
          <div className="min-h-screen bg-gray-50">{children}</div>
        </SettingsProvider>
      </body>
    </html>
  );
}

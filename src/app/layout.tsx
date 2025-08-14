import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import Header from "@/components/Header";
import SocialSidebar from "@/components/SocialSidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LEOVEIO - Streamer",
  description: "Site oficial do streamer LEOVEIO - Lives de Clash Royale, Wild Rift, Cassino e muito mais. Seg-Sex das 17:30 às 22h.",
  keywords: ["LEOVEIO", "streamer", "Clash Royale", "Wild Rift", "gaming", "twitch", "kick", "youtube"],
  authors: [{ name: "LEOVEIO" }],
  creator: "LEOVEIO",
  publisher: "LEOVEIO",
  openGraph: {
    title: "LEOVEIO - Streamer",
    description: "Lives de gaming e entretenimento com LEOVEIO",
    url: "https://leoveio-streamer-site.vercel.app",
    siteName: "LEOVEIO",
    type: "website",
    locale: "pt_BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "LEOVEIO - Streamer",
    description: "Lives de gaming e entretenimento",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon-32x32.png",
    apple: "/favicon-32x32.png",
  },
  manifest: "/site.webmanifest",
  metadataBase: new URL("https://leoveio-streamer-site.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/favicon-32x32.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen overflow-x-hidden`}
      >
        <CustomCursor />
        <Header />
        <SocialSidebar />
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "LEOVEIO - Streamer Profissional | Vanguarda Hextech Wild Rift",
  description: "Site oficial do streamer LEOVEIO - Vanguarda Hextech da Riot Games, Campeão Internacional de Wild Rift. Lives profissionais de Clash Royale, Wild Rift e muito mais. Seg-Sex das 17:30 às 22h.",
  keywords: [
    "LEOVEIO", 
    "streamer profissional", 
    "Vanguarda Hextech", 
    "Wild Rift", 
    "Clash Royale", 
    "Riot Games", 
    "campeão internacional", 
    "gaming", 
    "twitch", 
    "kick", 
    "youtube",
    "streamer brasileiro",
    "eSports",
    "transformação pessoal"
  ],
  authors: [{ name: "LEOVEIO", url: "https://leoveio.com" }],
  creator: "LEOVEIO",
  publisher: "LEOVEIO",
  openGraph: {
    title: "LEOVEIO - Streamer Profissional | Vanguarda Hextech",
    description: "Campeão Internacional de Wild Rift e único representante brasileiro da Vanguarda Hextech da Riot Games. Lives profissionais e conteúdo de qualidade.",
    url: "https://leoveio.com",
    siteName: "LEOVEIO",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/herobanner.png",
        width: 1200,
        height: 630,
        alt: "LEOVEIO - Streamer Profissional",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LEOVEIO - Streamer Profissional",
    description: "Vanguarda Hextech da Riot Games | Campeão Internacional de Wild Rift",
    images: ["/herobanner.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
  metadataBase: new URL("https://leoveio.com"),
  alternates: {
    canonical: "https://leoveio.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" href="/favicon-32x32.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-br from-slate-800 via-blue-900 to-teal-800 min-h-screen overflow-x-hidden professional-fade-in`}
        suppressHydrationWarning={true}
      >
        <Header />
        <SocialSidebar />
        <main className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}

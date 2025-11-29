import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@/lib/env-validation'; // Validate environment on startup

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IELTS EQ - AI-Powered IELTS Speaking Practice",
    template: "%s | IELTS EQ"
  },
  description: "Master IELTS Speaking with AI-powered feedback, vocabulary builder, and pronunciation lab. Get instant band scores and personalized improvement tips.",
  keywords: ["IELTS", "IELTS Speaking", "AI tutor", "speaking practice", "vocabulary", "pronunciation", "band score"],
  authors: [{ name: "IELTS EQ" }],
  creator: "IELTS EQ",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://your-domain.vercel.app",
    siteName: "IELTS EQ",
    title: "IELTS EQ - AI-Powered IELTS Speaking Practice",
    description: "Master IELTS Speaking with AI-powered feedback, vocabulary builder, and pronunciation lab.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "IELTS EQ - AI IELTS Speaking Practice"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "IELTS EQ - AI-Powered IELTS Speaking Practice",
    description: "Master IELTS Speaking with AI-powered feedback and personalized coaching.",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

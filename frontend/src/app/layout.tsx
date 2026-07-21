import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QweryWise-AI | Enterprise Self-Correcting RAG",
  description: "Enterprise Self-Correcting RAG platform. Upload documents and get verifiable, grounded AI answers.",
  keywords: ["AI", "RAG", "Enterprise", "Self-Correcting", "FastAPI", "Next.js"],
  authors: [{ name: "QweryWise-AI Team" }],
  openGraph: {
    title: "QweryWise-AI",
    description: "Enterprise Self-Correcting RAG platform.",
    url: "https://qwerywise-ai.com",
    siteName: "QweryWise-AI",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

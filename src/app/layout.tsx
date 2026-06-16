import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LARPIn — Find Out How Much You're LARPing On LinkedIn",
  description:
    "Measure the gap between your LinkedIn profile and reality. Paste your headline or profile and get your LARP Score.",
  keywords: [
    "LinkedIn",
    "LARP",
    "profile analyzer",
    "buzzword detector",
    "LinkedIn roast",
  ],
  openGraph: {
    title: "LARPIn — Find Out How Much You're LARPing On LinkedIn",
    description:
      "Measure the gap between your LinkedIn profile and reality.",
    type: "website",
    siteName: "LARPIn",
  },
  twitter: {
    card: "summary_large_image",
    title: "LARPIn — LinkedIn LARP Score",
    description:
      "Measure the gap between your LinkedIn profile and reality.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark`}
    >
      <body className="min-h-screen flex flex-col bg-[#0a0a0a] text-neutral-100 antialiased">
        {children}
      </body>
    </html>
  );
}

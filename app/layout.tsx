import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  metadataBase: new URL("https://urlsy.cc"),
  title: {
    default: "urlsy.cc | Shorten, Share, Track",
    template: "%s | urlsy.cc",
  },
  description:
    "urlsy.cc helps you create short links fast with clean analytics and premium features when you grow.",
  alternates: {
    canonical: "https://urlsy.cc",
  },
  openGraph: {
    title: "urlsy.cc | Shorten, Share, Track",
    description:
      "urlsy.cc helps you create short links fast with clean analytics and premium features when you grow.",
    url: "https://urlsy.cc",
    siteName: "urlsy.cc",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "urlsy.cc — Shorten, Share, Track",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "urlsy.cc | Shorten, Share, Track",
    description:
      "urlsy.cc helps you create short links fast with clean analytics and premium features when you grow.",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
      <SpeedInsights/>
    </html>
  );
}

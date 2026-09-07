import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.cornerstonesocialcircle.com"),
  title: {
    default: "Cornerstone Social Circle",
    template: "%s | Cornerstone Social Circle",
  },
  description:
    "Intentional gatherings that create authentic connections and lasting friendships.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Cornerstone Social Circle",
    title: "Cornerstone Social Circle",
    description: "Intentional gatherings that create authentic connections and lasting friendships.",
    url: "/",
    images: [{ url: "/logo/cornerstone-logo-navbar.png", alt: "Cornerstone Social Circle" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cornerstone Social Circle",
    description: "Intentional gatherings that create authentic connections and lasting friendships.",
    images: ["/logo/cornerstone-logo-navbar.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cormorant.variable} bg-cream font-sans text-plum antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

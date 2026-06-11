import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Manrope, Fraunces } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "AFRIKA Admin",
    template: "%s · AFRIKA Admin",
  },
  description: "Operations and intelligence control room for AFRIKA.",
  keywords: ["AFRIKA", "admin", "operations", "intelligence", "Africa"],
  openGraph: {
    title: "AFRIKA Admin",
    description: "Operations and intelligence control room for AFRIKA.",
    type: "website",
    locale: "en_US",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0F0F10",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${manrope.variable} ${fraunces.variable}`}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="overscroll-none bg-[var(--bg-primary)] text-[var(--text-primary)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

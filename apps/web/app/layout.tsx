import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import { SessionProvider } from "../components/session-provider";
import { Sidebar, MobileNav } from "../components/sidebar";
import { PullToRefresh } from "../components/motion/pull-to-refresh";
import "./globals.css";

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
    default: "AFRIKA — Visual Intelligence Layer for African Life",
    template: "%s · AFRIKA",
  },
  description:
    "Discover, understand, and navigate African cities through a cinematic visual intelligence platform. Premium discovery for neighborhoods, culture, trends, and hidden places.",
  keywords: ["Africa", "discovery", "Lagos", "Nairobi", "Accra", "travel", "culture", "neighborhoods"],
  openGraph: {
    title: "AFRIKA — Visual Intelligence Layer for African Life",
    description: "A cinematic intelligence platform for discovering African cities, neighborhoods, and culture.",
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
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0F0F10" },
    { media: "(prefers-color-scheme: light)", color: "#F7F4EE" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${manrope.variable} ${fraunces.variable}`}
      style={{ scrollBehavior: "smooth" }}
    >
      <body className="overscroll-none">
        <ThemeProvider>
          <SessionProvider>
            {/* Desktop sidebar */}
            <Sidebar />

            {/* Main content — offset by sidebar width on desktop */}
            <div
              className="min-h-screen lg:pl-[92px]"
              style={{ transition: "padding 0.35s cubic-bezier(0.16, 1, 0.3, 1)" }}
            >
              <PullToRefresh>{children}</PullToRefresh>
            </div>

            {/* Mobile bottom nav */}
            <MobileNav />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

import type { Metadata, Viewport } from "next";
import dynamic from "next/dynamic";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Navigation from "@/components/ui/navigation";
import "./globals.css";

const VantaBackground = dynamic(
  () => import("@/components/VantaBackground"),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "meshal.portfolio · Mohaiminul Islam Meshal",
  description:
    "Sales professional & photographer from Dhaka, Bangladesh. Building relationships, capturing moments.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  openGraph: {
    title: "meshal.portfolio",
    description: "Sales professional & photographer from Dhaka, Bangladesh.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "meshal.portfolio",
    description: "Sales professional & photographer from Dhaka, Bangladesh.",
  },
  alternates: { canonical: "/" },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Meshal",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#06141B",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <body style={{ fontFamily: "var(--font-geist-sans), -apple-system, 'SF Pro Display', BlinkMacSystemFont, system-ui, sans-serif" }}>
        <ThemeProvider>
          <VantaBackground />
          <div style={{ position: "relative", zIndex: 1 }}>
            {children}
          </div>
          <Navigation />
        </ThemeProvider>
      </body>
    </html>
  );
}

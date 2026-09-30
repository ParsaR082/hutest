import type { Metadata } from "next";
import { Vazirmatn, Great_Vibes, Gulzar } from "next/font/google";
import { AppProviders } from "@/components/providers/AppProviders";
import { getSiteMetadata } from "@/lib/seo";
import "./globals.css";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const greatVibes = Great_Vibes({
  variable: "--font-great-vibes",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const gulzar = Gulzar({
  variable: "--font-gulzar",
  subsets: ["arabic", "latin"],
  weight: "400",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return getSiteMetadata();
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${vazirmatn.variable} ${greatVibes.variable} ${gulzar.variable}`}
    >
      <body className="antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}

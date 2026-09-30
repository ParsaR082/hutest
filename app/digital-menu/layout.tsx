import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SITE_URL } from "@/lib/seo";
import "./digital-menu.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-dm-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "منوی دیجیتال | رستوران هومزد",
  description: "منوی دیجیتال لوکس رستوران هومزد در ارومیه.",
  alternates: { canonical: `${SITE_URL}/digital-menu` },
};

export default function DigitalMenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      dir="ltr"
      lang="en"
      className={`dm-scope ${cormorant.variable} ${inter.variable} antialiased`}
    >
      {children}
    </div>
  );
}

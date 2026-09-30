import type { Metadata } from "next";
import { MockPaymentPage } from "@/components/sections/MockPaymentPage";

export const metadata: Metadata = {
  title: "درگاه پرداخت | Humazd",
  robots: { index: false, follow: false },
};

export default async function MockPaymentRoute({
  params,
}: {
  params: Promise<{ authority: string }>;
}) {
  const { authority } = await params;
  return <MockPaymentPage authority={authority} />;
}

import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { DishDetail } from "@/components/sections/DishDetail";
import { fetchAllMenuSlugs, fetchMenuBySlug } from "@/lib/api/menu";
import { mapApiDetailToDishDetail } from "@/lib/mappers/menu";
import { SITE_URL, resolveAssetUrl } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildBreadcrumbSchema } from "@/lib/structured-data";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await fetchAllMenuSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  try {
    const apiDish = await fetchMenuBySlug(slug);
    const title = `${apiDish.name} | منوی رستوران هومزد`;
    const description = apiDish.description || `${apiDish.name} — بخشی از منوی رستوران هومزد در ارومیه.`;
    const canonical = `${SITE_URL}/menu/${slug}`;
    const image = resolveAssetUrl(apiDish.image);
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title,
        description,
        url: canonical,
        type: "website",
        images: [{ url: image }],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch {
    return { title: "غذا یافت نشد", robots: { index: false } };
  }
}

export default async function DishRoutePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let dish;
  try {
    const apiDish = await fetchMenuBySlug(slug);
    dish = mapApiDetailToDishDetail(apiDish);
  } catch {
    notFound();
  }

  const breadcrumb = buildBreadcrumbSchema([
    { name: "خانه", url: SITE_URL },
    { name: "منو", url: `${SITE_URL}/menu` },
    { name: dish.name, url: `${SITE_URL}/menu/${slug}` },
  ]);

  return (
    <>
      <StructuredData data={breadcrumb} />
      <Header />
      <main className="bg-[#0a0a0a]">
        <DishDetail dish={dish} />
      </main>
      <Footer />
    </>
  );
}

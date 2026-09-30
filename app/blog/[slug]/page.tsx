import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { BlogPostContent } from "@/components/sections/BlogPostContent";
import { fetchBlogPost } from "@/lib/api/blog";
import { SITE_URL, resolveAssetUrl } from "@/lib/seo";
import { StructuredData } from "@/components/seo/StructuredData";
import { buildBlogPostingSchema, buildBreadcrumbSchema } from "@/lib/structured-data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await fetchBlogPost(slug);
    const title = `${post.title} | وبلاگ رستوران هومزد`;
    const description = post.excerpt || post.title;
    const canonical = `${SITE_URL}/blog/${slug}`;
    const image = post.cover_image ? resolveAssetUrl(post.cover_image) : undefined;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: {
        title: post.title,
        description,
        url: canonical,
        type: "article",
        ...(post.published_at ? { publishedTime: post.published_at } : {}),
        ...(image ? { images: [{ url: image }] } : {}),
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        ...(image ? { images: [image] } : {}),
      },
    };
  } catch {
    return { title: "مطلب وبلاگ | رستوران هومزد", robots: { index: false } };
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post;
  try {
    post = await fetchBlogPost(slug);
  } catch {
    notFound();
  }

  const url = `${SITE_URL}/blog/${slug}`;
  const breadcrumb = buildBreadcrumbSchema([
    { name: "خانه", url: SITE_URL },
    { name: "وبلاگ", url: `${SITE_URL}/blog` },
    { name: post.title, url },
  ]);

  return (
    <>
      <StructuredData data={[buildBlogPostingSchema(post, url), breadcrumb]} />
      <Header />
      <BlogPostContent post={post} />
      <Footer />
    </>
  );
}

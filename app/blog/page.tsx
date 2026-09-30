import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/sections/Footer";
import { BlogContent } from "@/components/sections/BlogContent";
import { fetchBlogList } from "@/lib/api/blog";
import type { BlogPostList } from "@/lib/api/types";
import { PageStructuredData } from "@/components/seo/PageStructuredData";

export default async function BlogPage() {
  let posts: BlogPostList[] = [];
  try {
    posts = await fetchBlogList();
  } catch {
    posts = [];
  }

  return (
    <>
      <PageStructuredData pageKey="blog" />
      <Header />
      <BlogContent posts={posts} />
      <Footer />
    </>
  );
}

import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";
import { notFound } from "next/navigation";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import { createMetadata } from "@/lib/metadata";
import { BlogPostHeader } from "@/components/blog/blog-post-header";
import { Button } from "@/components/ui/button";
import { Link } from "next-view-transitions";
import type { Metadata } from "next";

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const reader = createReader(process.cwd(), keystaticConfig);

export async function generateStaticParams() {
  const posts = await reader.collections.posts.all();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await reader.collections.posts.read(slug);

  if (!post) {
    return createMetadata({
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
    });
  }

  return createMetadata({
    title: post.title,
    description: `Read our blog post: ${post.title}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await reader.collections.posts.read(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <BlogPostHeader
        title={post.title}
        excerpt={post.excerpt || undefined}
        heroImage={post.heroImage || undefined}
        publishedDate={post.publishedDate || undefined}
        featured={post.featured}
        tags={post.tags ? [...post.tags] : undefined}
      />

      {/* Article Content */}
      <section className="bg-background py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-4xl">
            <article className="prose prose-base prose-slate dark:prose-invert sm:prose-lg markdoc-content mx-auto max-w-none">
              {Markdoc.renderers.react(
                Markdoc.transform((await post.content()).node),
                React,
              )}
            </article>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="bg-muted/40 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-foreground mb-4 text-xl font-bold sm:text-2xl">
              Thanks for reading!
            </h2>
            <p className="text-muted-foreground mb-6 text-sm sm:mb-8 sm:text-base">
              Want to read more articles? Check out our blog for the latest
              insights and updates.
            </p>
            <Link href="/blog">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              >
                Explore More Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

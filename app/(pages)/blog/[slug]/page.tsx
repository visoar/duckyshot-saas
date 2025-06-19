import { notFound } from "next/navigation";
import { Link } from "next-view-transitions";
import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";
import Markdoc from "@markdoc/markdoc";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Share2,
  Sparkles,
  User,
} from "lucide-react";
import { createMetadata } from "@/lib/metadata";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import Image from "next/image";
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
      {/* Hero Section */}
      <section className="bg-background relative overflow-hidden">
        {!post.heroImage && <BackgroundPattern />}

        {/* Hero Image */}
        {post.heroImage && (
          <div className="relative h-[40vh] overflow-hidden lg:h-[50vh]">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Back button overlay */}
            <div className="absolute top-6 left-6 z-10">
              <Button
                variant="ghost"
                asChild
                className="bg-background/80 hover:bg-background/90 backdrop-blur-sm transition-colors"
              >
                <Link href="/blog">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Blog
                </Link>
              </Button>
            </div>

            {/* Article header overlay */}
            <div className="absolute right-0 bottom-0 left-0 p-6 lg:p-12">
              <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 flex items-center justify-center gap-2">
                  {post.featured ? (
                    <Badge
                      variant="default"
                      className="bg-primary/90 text-primary-foreground border-primary/20 backdrop-blur-sm"
                    >
                      <Sparkles className="mr-1 h-3 w-3" />
                      Featured
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-background/90 text-foreground border-border backdrop-blur-sm"
                    >
                      Article
                    </Badge>
                  )}
                </div>

                <h1 className="mb-6 text-4xl font-bold tracking-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
                  {post.title}
                </h1>

                {post.excerpt && (
                  <p className="mx-auto mb-6 max-w-3xl text-xl leading-relaxed text-white/90 drop-shadow">
                    {post.excerpt}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-center gap-6 text-white/80">
                  <div className="flex items-center gap-6 text-sm">
                    {post.publishedDate && (
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>
                          {new Date(post.publishedDate).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>5 min read</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>Admin</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Non-hero image layout */}
        {!post.heroImage && (
          <div className="py-16">
            <div className="container mx-auto px-6">
              <div className="mx-auto max-w-4xl">
                {/* Back button */}
                <div className="mb-8">
                  <Button
                    variant="ghost"
                    asChild
                    className="hover:bg-background/80 pl-0 transition-colors"
                  >
                    <Link href="/blog">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Blog
                    </Link>
                  </Button>
                </div>

                {/* Article header */}
                <header className="text-center">
                  <div className="mb-6 flex items-center justify-center gap-2">
                    {post.featured ? (
                      <Badge
                        variant="default"
                        className="bg-primary/10 text-primary border-primary/20"
                      >
                        <Sparkles className="mr-1 h-3 w-3" />
                        Featured
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="bg-muted/50 text-muted-foreground border-muted"
                      >
                        Article
                      </Badge>
                    )}
                  </div>

                  <h1 className="text-foreground mb-8 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                    {post.title}
                  </h1>

                  {post.excerpt && (
                    <p className="text-muted-foreground mx-auto mb-8 max-w-3xl text-xl leading-relaxed">
                      {post.excerpt}
                    </p>
                  )}

                  <div className="mb-6 flex flex-wrap items-center justify-center gap-6">
                    <div className="text-muted-foreground flex items-center gap-6 text-sm">
                      {post.publishedDate && (
                        <div className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          <span>
                            {new Date(post.publishedDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>5 min read</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Admin</span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      className="hover:bg-primary/10 transition-colors"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2">
                      {post.tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="hover:bg-primary/10 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </header>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Tags section for hero image layout */}
      {post.heroImage && post.tags && post.tags.length > 0 && (
        <section className="bg-background/50 py-8">
          <div className="container mx-auto px-6">
            <div className="mx-auto max-w-4xl">
              <div className="flex flex-wrap justify-center gap-2">
                {post.tags.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="hover:bg-primary/10 transition-colors"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl">
            <Separator className="mb-12" />

            {/* Article content */}
            <article className="prose prose-lg prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-code:text-foreground prose-pre:bg-muted prose-blockquote:border-primary prose-blockquote:text-muted-foreground max-w-none">
              <div className="markdoc-content">
                {React.createElement(
                  React.Fragment,
                  {},
                  Markdoc.renderers.react(
                    Markdoc.transform((await post.content()).node),
                    React,
                  ),
                )}
              </div>
            </article>

            <Separator className="my-12" />

            {/* Footer */}
            <footer className="text-center">
              <p className="text-muted-foreground mb-4">
                Thank you for reading! We hope you found this article helpful.
              </p>
              <Button asChild>
                <Link href="/blog">Read More Articles</Link>
              </Button>
            </footer>
          </div>
        </div>
      </section>
    </>
  );
}

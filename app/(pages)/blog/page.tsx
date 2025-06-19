import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "@/keystatic.config";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Sparkles, BookOpen, User } from "lucide-react";
import { createMetadata } from "@/lib/metadata";
import { BackgroundPattern } from "@/components/ui/background-pattern";
import Image from "next/image";
import { Link } from "next-view-transitions";
import type { Metadata } from "next";

export const metadata: Metadata = createMetadata({
  title: "Blog",
  description:
    "Read our latest blog posts and insights about technology, development, and industry trends.",
});

const reader = createReader(process.cwd(), keystaticConfig);

export default async function BlogPage() {
  const posts = await reader.collections.posts.all();

  // Sort posts by published date (newest first), then by title
  const sortedPosts = posts.sort((a, b) => {
    const dateA = a.entry.publishedDate
      ? new Date(a.entry.publishedDate)
      : new Date(0);
    const dateB = b.entry.publishedDate
      ? new Date(b.entry.publishedDate)
      : new Date(0);

    if (dateA.getTime() !== dateB.getTime()) {
      return dateB.getTime() - dateA.getTime(); // Newest first
    }

    return a.entry.title.localeCompare(b.entry.title);
  });

  // Separate featured posts
  const featuredPosts = sortedPosts.filter((post) => post.entry.featured);
  const regularPosts = sortedPosts.filter((post) => !post.entry.featured);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-muted/40 relative overflow-hidden py-24">
        <BackgroundPattern />

        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-4xl text-center">
            <div className="border-border bg-background/50 mb-6 inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm">
              <Sparkles className="text-primary mr-2 h-3 w-3" />
              <span className="text-muted-foreground">
                Latest insights and updates
              </span>
            </div>
            <h1 className="text-foreground mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Our Blog
            </h1>
            <p className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed">
              Discover insights, tutorials, and updates from our team. Stay
              informed about the latest trends in technology and development.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="bg-background py-16">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-6xl">
            {sortedPosts.length === 0 ? (
              <div className="py-20 text-center">
                <div className="bg-muted mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full">
                  <BookOpen className="text-muted-foreground h-10 w-10" />
                </div>
                <h2 className="text-foreground mb-4 text-2xl font-semibold">
                  No posts yet
                </h2>
                <p className="text-muted-foreground mx-auto max-w-md">
                  We are working on some great content. Check back soon!
                </p>
              </div>
            ) : (
              <div className="space-y-16">
                {/* Featured Posts */}
                {featuredPosts.length > 0 && (
                  <section>
                    <div className="mb-8 text-center">
                      <h2 className="text-foreground mb-2 text-3xl font-bold tracking-tight">
                        Featured Posts
                      </h2>
                      <p className="text-muted-foreground">
                        Our most popular and insightful articles
                      </p>
                    </div>
                    <div className="grid gap-8 lg:gap-12">
                      {featuredPosts.map((post) => (
                        <Card
                          key={post.slug}
                          className="group bg-background/50 hover:bg-background/80 border-primary/20 overflow-hidden border backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                        >
                          {/* Hero Image */}
                          {post.entry.heroImage && (
                            <div className="relative -mt-6 h-64 overflow-hidden lg:h-80">
                              <Image
                                src={post.entry.heroImage}
                                alt={post.entry.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                              <Badge
                                variant="default"
                                className="bg-primary/90 text-primary-foreground border-primary/20 hover:bg-primary absolute top-4 right-4 backdrop-blur-sm transition-colors"
                              >
                                <Sparkles className="mr-1 h-3 w-3" />
                                Featured
                              </Badge>
                            </div>
                          )}

                          <CardHeader
                            className={post.entry.heroImage ? "pb-4" : "pb-4"}
                          >
                            {!post.entry.heroImage && (
                              <div className="mb-4 flex justify-end">
                                <Badge
                                  variant="default"
                                  className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 transition-colors"
                                >
                                  <Sparkles className="mr-1 h-3 w-3" />
                                  Featured
                                </Badge>
                              </div>
                            )}
                            <div className="space-y-3">
                              <CardTitle className="text-2xl lg:text-3xl">
                                <Link
                                  href={`/blog/${post.slug}`}
                                  className="group-hover:text-primary transition-colors duration-200"
                                >
                                  {post.entry.title}
                                </Link>
                              </CardTitle>
                              <div className="text-muted-foreground flex items-center gap-6 text-sm">
                                {post.entry.publishedDate && (
                                  <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>
                                      {new Date(
                                        post.entry.publishedDate,
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
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
                              {post.entry.tags &&
                                post.entry.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {post.entry.tags.map((tag, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="hover:bg-primary/10 text-xs transition-colors"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <CardDescription className="mb-6 text-base leading-relaxed">
                              {post.entry.excerpt ||
                                "Discover the latest insights and updates in this comprehensive article. Click to read the full content and learn more about this topic."}
                            </CardDescription>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-primary hover:text-primary/80 inline-flex items-center gap-2 font-medium transition-all duration-200 group-hover:gap-3"
                            >
                              Read full article
                              <span className="transition-transform group-hover:translate-x-1">
                                →
                              </span>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}

                {/* Regular Posts */}
                {regularPosts.length > 0 && (
                  <section>
                    {featuredPosts.length > 0 && (
                      <div className="mb-8 text-center">
                        <h2 className="text-foreground mb-2 text-3xl font-bold tracking-tight">
                          All Posts
                        </h2>
                        <p className="text-muted-foreground">
                          Explore our complete collection of articles
                        </p>
                      </div>
                    )}
                    <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                      {regularPosts.map((post) => (
                        <Card
                          key={post.slug}
                          className="group border-border bg-background/50 hover:bg-background/80 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                        >
                          {/* Hero Image */}
                          {post.entry.heroImage && (
                            <div className="relative -mt-6 h-48 overflow-hidden">
                              <Image
                                src={post.entry.heroImage}
                                alt={post.entry.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                              <Badge
                                variant="secondary"
                                className="bg-background/90 text-foreground border-border hover:bg-background absolute top-3 right-3 backdrop-blur-sm transition-colors"
                              >
                                Article
                              </Badge>
                            </div>
                          )}

                          <CardHeader className="pb-4">
                            {!post.entry.heroImage && (
                              <div className="mb-4 flex justify-end">
                                <Badge
                                  variant="secondary"
                                  className="bg-muted/50 text-muted-foreground border-muted hover:bg-muted transition-colors"
                                >
                                  Article
                                </Badge>
                              </div>
                            )}
                            <div className="space-y-3">
                              <CardTitle className="text-xl lg:text-2xl">
                                <Link
                                  href={`/blog/${post.slug}`}
                                  className="group-hover:text-primary transition-colors duration-200"
                                >
                                  {post.entry.title}
                                </Link>
                              </CardTitle>
                              <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                {post.entry.publishedDate && (
                                  <div className="flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" />
                                    <span>
                                      {new Date(
                                        post.entry.publishedDate,
                                      ).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <span>5 min read</span>
                                </div>
                              </div>
                              {post.entry.tags &&
                                post.entry.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-2">
                                    {post.entry.tags.map((tag, index) => (
                                      <Badge
                                        key={index}
                                        variant="outline"
                                        className="hover:bg-primary/10 text-xs transition-colors"
                                      >
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <CardDescription className="mb-4 text-base leading-relaxed">
                              {post.entry.excerpt ||
                                "Discover the latest insights and updates in this comprehensive article. Click to read the full content and learn more about this topic."}
                            </CardDescription>
                            <Link
                              href={`/blog/${post.slug}`}
                              className="text-primary hover:text-primary/80 inline-flex items-center gap-2 font-medium transition-all duration-200 group-hover:gap-3"
                            >
                              Read article
                              <span className="transition-transform group-hover:translate-x-1">
                                →
                              </span>
                            </Link>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

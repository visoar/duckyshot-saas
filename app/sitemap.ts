import { MetadataRoute } from 'next';
import env from '@/env';

// TODO: Dynamically generate sitemap entries from your content sources (e.g., database, CMS)
// For now, we'll add some static common pages.

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Base URL for the site
  const baseUrl = env.NEXT_PUBLIC_APP_URL;

  // Define static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: 'daily', // Or 'weekly', 'monthly' depending on how often the homepage content changes
      priority: 1.0, // Homepage usually has the highest priority
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: 'yearly', // Contact page might not change often
      priority: 0.5,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    // Add other static pages here
    // Example:
    // {
    //   url: `${baseUrl}/blog`,
    //   lastModified,
    //   changeFrequency: 'weekly',
    //   priority: 0.9,
    // },
  ];

  // TODO: Fetch dynamic routes (e.g., blog posts, product pages)
  // const dynamicBlogPosts = await fetchBlogPostsFromDatabase();
  // const blogPostEntries = dynamicBlogPosts.map(post => ({
  //   url: `${baseUrl}/blog/${post.slug}`,
  //   lastModified: post.updatedAt,
  //   changeFrequency: 'weekly',
  //   priority: 0.7,
  // }));

  return [
    ...staticPages,
    // ...blogPostEntries,
  ];
}
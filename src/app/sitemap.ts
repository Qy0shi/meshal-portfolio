import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.meshal.dev";

  return [
    { url: basePath(baseUrl, "/"), lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: basePath(baseUrl, "/about"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: basePath(baseUrl, "/career"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: basePath(baseUrl, "/gallery"), lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: basePath(baseUrl, "/contact"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ];
}

function basePath(base: string, path: string) {
  return `${base}${path}`;
}

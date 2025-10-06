import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "https://example.com";

  const routes = [
    "",
    "/simulate",
    "/auth/login",
    "/auth/signup",
    "/legal/privacy-policy",
    "/legal/terms-of-service",
  ];

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}

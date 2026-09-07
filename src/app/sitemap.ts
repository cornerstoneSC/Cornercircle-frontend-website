import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.cornerstonesocialcircle.com";
  return ["", "/events", "/services", "/contact", "/membership", "/founder", "/event-terms", "/privacy"].map(
    (path) => ({ url: `${base}${path}`, changeFrequency: path === "" || path === "/events" ? "weekly" : "monthly" }),
  );
}

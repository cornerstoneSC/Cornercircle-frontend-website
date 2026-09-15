import type { MetadataRoute } from "next";
import { servicesPublicEnabled } from "@/lib/services-release";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://www.cornerstonesocialcircle.com";
  const paths = ["", "/events", "/contact", "/membership", "/founder", "/event-terms", "/privacy"];
  if (servicesPublicEnabled()) paths.splice(2, 0, "/services", "/services/companionship");
  return paths.map(
    (path) => ({ url: `${base}${path}`, changeFrequency: path === "" || path === "/events" ? "weekly" : "monthly" }),
  );
}

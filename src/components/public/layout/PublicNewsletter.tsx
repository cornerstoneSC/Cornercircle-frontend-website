"use client";

import { usePathname } from "next/navigation";
import NewsletterSection from "@/components/public/Homepage/NewsletterSection";

const excluded = [
  "/membership/success",
  "/newsletter/unsubscribe",
  "/privacy",
  "/event-terms",
];

export default function PublicNewsletter({ imageUrl }: { imageUrl?: string }) {
  const pathname = usePathname();
  const registrationFlow = /^\/events\/[^/]+\/register(?:\/success)?$/.test(pathname);
  if (registrationFlow || excluded.some((route) => pathname.startsWith(route))) return null;
  return <NewsletterSection imageUrl={imageUrl} />;
}

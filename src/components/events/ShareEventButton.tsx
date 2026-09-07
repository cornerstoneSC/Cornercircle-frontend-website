"use client";

import { Share2 } from "lucide-react";
import { useState } from "react";


interface ShareEventButtonProps {
  title: string;
}


export default function ShareEventButton({
  title,
}: ShareEventButtonProps) {
  const [copied, setCopied] =
    useState(false);


  async function handleShare() {
    const url =
      window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title,
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);

    } catch {
      // User may simply cancel native sharing.
    }
  }


  return (
    <button
      type="button"
      onClick={handleShare}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-[#CFAE72] bg-transparent px-5 py-3.5 text-sm font-semibold text-[#9B6F20] transition hover:bg-[#F8F4EC]"
    >
      <Share2 className="h-4 w-4" />

      {copied
        ? "Link Copied"
        : "Share Event"}
    </button>
  );
}

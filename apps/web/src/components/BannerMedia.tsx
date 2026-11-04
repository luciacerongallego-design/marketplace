"use client";

import React, { useState } from "react";
import Image from "next/image";

interface BannerMediaProps {
  url: string;
  alt: string;
  isPdf?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

export function BannerMedia({
  url,
  alt,
  isPdf = false,
  priority = false,
  sizes = "(max-width: 1280px) 100vw, 1280px",
  className = "object-cover object-center",
}: BannerMediaProps) {
  const [loadError, setLoadError] = useState(false);
  const detectedPdf = isPdf || url.toLowerCase().includes(".pdf");

  if (detectedPdf && !loadError) {
    return (
      <div className="relative w-full h-full bg-stone-100 overflow-hidden flex items-center justify-center">
        <object
          data={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          type="application/pdf"
          className="w-full h-full border-0 pointer-events-none"
          title={alt}
          onError={() => setLoadError(true)}
        >
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
            className="w-full h-full border-0 pointer-events-none"
            title={alt}
          />
        </object>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="relative w-full h-full bg-stone-200/60 overflow-hidden flex items-center justify-center">
        <span className="text-xs uppercase tracking-tight font-bold text-stone-400">
          {alt}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      fill
      priority={priority}
      className={className}
      sizes={sizes}
      onError={() => setLoadError(true)}
    />
  );
}

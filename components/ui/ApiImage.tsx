"use client";

import { useMemo, useState } from "react";
import { resolveApiImageUrl } from "@/lib/images";

type ApiImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
};

export function ApiImage({
  src,
  alt,
  className,
  fallbackClassName,
}: ApiImageProps) {
  const [failed, setFailed] = useState(false);

  const resolvedSrc = useMemo(() => {
    if (!src) return null;

    // ✅ Preview image
    if (src.startsWith("blob:")) {
      return src;
    }

    // ✅ Base64 image
    if (src.startsWith("data:")) {
      return src;
    }

    // ✅ Laravel image
    return resolveApiImageUrl(src);
  }, [src]);

  if (!resolvedSrc || failed) {
    return (
      <div
        className={
          fallbackClassName ??
          "flex h-40 w-40 items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-100 text-slate-500"
        }
      >
        Image unavailable
      </div>
    );
  }

  return (
    <img
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
}
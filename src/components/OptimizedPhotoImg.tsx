import { useEffect, useState } from "react";
import {
  PHOTO_IMAGE_SIZES,
  photoWebpSrc,
  photoWebpSrcSet,
} from "../utils/optimizedImages";

type OptimizedPhotoImgProps = {
  src: string;
  alt: string;
  className?: string;
  draggable?: boolean;
  referrerPolicy?: "no-referrer" | "origin" | "same-origin" | "";
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  onError?: () => void;
};

export default function OptimizedPhotoImg({
  src,
  alt,
  className,
  draggable,
  referrerPolicy,
  loading = "lazy",
  fetchPriority = "auto",
  onError,
}: OptimizedPhotoImgProps) {
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    setUseFallback(false);
  }, [src]);

  if (useFallback) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        draggable={draggable}
        referrerPolicy={referrerPolicy}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        onError={onError}
      />
    );
  }

  return (
    <img
      src={photoWebpSrc(src, 800)}
      srcSet={photoWebpSrcSet(src)}
      sizes={PHOTO_IMAGE_SIZES}
      alt={alt}
      className={className}
      draggable={draggable}
      referrerPolicy={referrerPolicy}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={() => setUseFallback(true)}
    />
  );
}

export function zoomPhotoSrc(src: string) {
  if (/\.webp$/i.test(src)) {
    return src.replace(/-800\.webp$/i, "-1200.webp");
  }
  return photoWebpSrc(src, 1200);
}

const PHOTO_WIDTHS = [800, 1200] as const;
const COVER_WIDTHS = [256, 512] as const;

export const PHOTO_IMAGE_SIZES = "(max-width: 768px) 44vw, 30rem";
export const COVER_IMAGE_SIZES = "(max-width: 767px) 120px, 156px";

function stripExt(src: string) {
  return src.replace(/\.(png|jpe?g|webp)$/i, "");
}

export function photoWebpSrcSet(src: string) {
  const stem = stripExt(src);
  return PHOTO_WIDTHS.map((w) => `${stem}-${w}.webp ${w}w`).join(", ");
}

export function photoWebpSrc(src: string, width: (typeof PHOTO_WIDTHS)[number] = 800) {
  return `${stripExt(src)}-${width}.webp`;
}

export function coverWebpSrcSet(projectFileStem: string) {
  return COVER_WIDTHS.map((w) => `/ai-covers/${projectFileStem}-${w}.webp ${w}w`).join(", ");
}

export function coverWebpSrc(projectFileStem: string, width: (typeof COVER_WIDTHS)[number] = 256) {
  return `/ai-covers/${projectFileStem}-${width}.webp`;
}

export function preloadPhoto(src: string) {
  if (!src || src === "") return;
  const img = new Image();
  img.sizes = PHOTO_IMAGE_SIZES;
  img.srcset = photoWebpSrcSet(src);
  img.src = photoWebpSrc(src, 800);
}

export function preloadCover(projectFileStem: string) {
  const img = new Image();
  img.sizes = COVER_IMAGE_SIZES;
  img.srcset = coverWebpSrcSet(projectFileStem);
  img.src = coverWebpSrc(projectFileStem, 256);
}

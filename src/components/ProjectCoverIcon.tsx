import {
  COVER_IMAGE_SIZES,
  coverWebpSrc,
  coverWebpSrcSet,
} from "../utils/optimizedImages";

export const AI_PROJECT_COVERS: Record<string, string> = {
  retro: "/ai-covers/retro.png",
  mix: "/ai-covers/mix.png",
  fetch: "/ai-covers/location.png",
  rag: "/ai-covers/rag.png",
  wander: "/ai-covers/mindmap.png",
};

export function coverFileStem(projectId: string) {
  const pngPath = AI_PROJECT_COVERS[projectId];
  if (!pngPath) return "";
  return pngPath.replace(/^.*\//, "").replace(/\.(png|jpe?g|webp)$/i, "");
}

export default function ProjectCoverIcon({
  projectId,
  isCenter = false,
  loadImage = true,
  fetchPriority = "auto",
}: {
  projectId: string;
  isCenter?: boolean;
  loadImage?: boolean;
  fetchPriority?: "high" | "low" | "auto";
}) {
  const stem = coverFileStem(projectId);
  const pngFallback = AI_PROJECT_COVERS[projectId];

  if (!stem) return null;

  return (
    <div
      className={`cover-art-3d cover-art-3d--${projectId} ${isCenter ? "cover-art-3d--center" : ""}`}
      aria-hidden
    >
      <div className="cover-art-3d__cluster">
        {loadImage ? (
          <img
            src={coverWebpSrc(stem, 256)}
            srcSet={coverWebpSrcSet(stem)}
            sizes={COVER_IMAGE_SIZES}
            alt=""
            className="cover-art-3d__img"
            width={256}
            height={256}
            draggable={false}
            decoding="async"
            fetchPriority={fetchPriority}
            onError={(e) => {
              const img = e.currentTarget;
              if (pngFallback && img.src !== new URL(pngFallback, window.location.origin).href) {
                img.removeAttribute("srcset");
                img.removeAttribute("sizes");
                img.src = pngFallback;
              }
            }}
          />
        ) : (
          <div className="cover-art-3d__img cover-art-3d__img--placeholder" />
        )}
      </div>
    </div>
  );
}

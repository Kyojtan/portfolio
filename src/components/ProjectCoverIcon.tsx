export const AI_PROJECT_COVERS: Record<string, string> = {
  retro: "/ai-covers/retro.png",
  mix: "/ai-covers/mix.png",
  fetch: "/ai-covers/location.png",
  rag: "/ai-covers/rag.png",
  wander: "/ai-covers/mindmap.png",
};

export default function ProjectCoverIcon({
  projectId,
  isCenter = false,
}: {
  projectId: string;
  isCenter?: boolean;
}) {
  const src = AI_PROJECT_COVERS[projectId];
  if (!src) return null;

  return (
    <div
      className={`cover-art-3d cover-art-3d--${projectId} ${isCenter ? "cover-art-3d--center" : ""}`}
      aria-hidden
    >
      <div className="cover-art-3d__cluster">
        <img
          src={src}
          alt=""
          className="cover-art-3d__img"
          width={512}
          height={512}
          draggable={false}
          decoding="sync"
          fetchPriority={isCenter ? "high" : "low"}
        />
      </div>
    </div>
  );
}

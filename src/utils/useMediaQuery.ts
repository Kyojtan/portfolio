import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}

/** Portrait stack; short landscape (e.g. phone sideways) stays vertical. */
const ALBUM_LANDSCAPE_DESKTOP_MQ = "(orientation: landscape) and (min-height: 480px)";

export function useAlbumVerticalLayout(): boolean {
  const isLandscapeDesktop = useMediaQuery(ALBUM_LANDSCAPE_DESKTOP_MQ);
  return !isLandscapeDesktop;
}

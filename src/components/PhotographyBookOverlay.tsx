import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import {
  PHOTO_PLACEHOLDER_MODE,
  PHOTO_PLACEHOLDER_SRC,
  PHOTO_SPREADS,
  type PhotoSpread,
} from "../data/photography";
import { playPageFlipSound } from "../utils/pageFlipSound";
import { useHorizontalSwipe } from "../utils/useHorizontalSwipe";
import { useVerticalSwipe } from "../utils/useVerticalSwipe";
import { useAlbumVerticalLayout } from "../utils/useMediaQuery";

interface PhotographyBookOverlayProps {
  lang: "zh" | "zt" | "en";
  onActiveChange?: (active: boolean) => void;
}

const FLIP_MS = 1020;

const FLIP_TRANSITION = {
  duration: FLIP_MS / 1000,
  ease: [0.22, 1, 0.36, 1] as const,
};

const FLIP_ARC = {
  duration: FLIP_MS / 1000,
  ease: [0.33, 0, 0.2, 1] as const,
};

function flipTotalMs(variant: "default" | "cover-open" | "cover-close") {
  const slideMs = FLIP_MS * 0.16;
  const flipMs = FLIP_MS - slideMs;
  if (variant === "cover-open") return Math.round(FLIP_MS * 0.68);
  if (variant === "cover-close") return slideMs + flipMs;
  return FLIP_MS;
}

const COVER_LABEL = {
  en: "Photography",
  zh: "摄影",
  zt: "攝影",
};

const BACK_HOME_HINT = {
  en: "Back to cover",
  zh: "回到首页",
  zt: "回到首頁",
};

type ViewIndex = number;
type ViewKind = "front" | "content" | "back";

function PhotoSlot() {
  return <div className="muji-page-photo muji-page-photo--slot" aria-hidden />;
}

function SpreadShell({
  left,
  right,
  leftHidden = false,
  rightHidden = false,
}: {
  left: React.ReactNode;
  right: React.ReactNode;
  leftHidden?: boolean;
  rightHidden?: boolean;
}) {
  return (
    <div className="muji-spread">
      <div
        className={`muji-page muji-page--left${
          leftHidden ? " muji-page--invisible" : " muji-page--photo"
        }`}
      >
        {left}
      </div>
      <div className="muji-spine" aria-hidden />
      <div
        className={`muji-page muji-page--right${
          rightHidden ? " muji-page--invisible" : " muji-page--photo"
        }`}
      >
        {right}
      </div>
    </div>
  );
}

function InvisibleFlipFace() {
  return <div className="muji-page muji-page--invisible" aria-hidden />;
}

function BookPhotoLoaded({
  src,
  alt,
  crop = "center",
  onZoom,
}: {
  src: string;
  alt: string;
  crop?: "center" | "top" | "bottom";
  onZoom?: (src: string) => void;
}) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [stage, setStage] = useState(0);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setCurrentSrc(src);
    setStage(0);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    if (stage === 0) {
      setStage(1);
      setCurrentSrc(src.replace(/\.png$/i, ".jpg"));
    } else if (stage === 1) {
      setStage(2);
      setCurrentSrc(src.replace(/\.png$/i, ".jpeg"));
    } else {
      setHasError(true);
    }
  };

  const objectPosition =
    crop === "top" ? "object-top" : crop === "bottom" ? "object-bottom" : "object-center";

  if (hasError) {
    return (
      <div className="muji-page-photo muji-page-photo--empty">
        <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">{alt}</span>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="muji-page-photo"
      onClick={(e) => {
        e.stopPropagation();
        onZoom?.(currentSrc);
      }}
      aria-label={alt}
    >
      <img
        src={currentSrc}
        alt={alt}
        className={`w-full h-full object-contain ${objectPosition}`}
        referrerPolicy="no-referrer"
        onError={handleError}
        draggable={false}
      />
    </button>
  );
}

function BookPhoto(props: {
  src: string;
  alt: string;
  crop?: "center" | "top" | "bottom";
  onZoom?: (src: string) => void;
}) {
  if (PHOTO_PLACEHOLDER_MODE || !props.src || props.src === PHOTO_PLACEHOLDER_SRC) {
    return <PhotoSlot />;
  }
  return <BookPhotoLoaded key={props.src} {...props} />;
}

function MujiFrostedCover({
  side,
  lang,
  previewSrc,
  showLabel = false,
  hint,
  backHomeLabel,
  onBackHome,
}: {
  side: "front" | "back";
  lang: "zh" | "zt" | "en";
  previewSrc?: string;
  showLabel?: boolean;
  hint?: string;
  backHomeLabel?: string;
  onBackHome?: () => void;
}) {
  return (
    <div className={`muji-cover muji-cover--${side}`}>
      <div className="muji-cover-inner">
        {previewSrc && !PHOTO_PLACEHOLDER_MODE && (
          <div className="muji-cover-preview" aria-hidden>
            <img src={previewSrc} alt="" className="muji-cover-preview__img" />
          </div>
        )}
        <div className="muji-cover-frost" aria-hidden />
        <div className="muji-cover-label">
          <div className="muji-cover-spine" aria-hidden />
          {showLabel && <p className="muji-cover-title">{COVER_LABEL[lang]}</p>}
          {hint && <p className="muji-cover-hint">{hint}</p>}
          {backHomeLabel && onBackHome && (
            <button
              type="button"
              className="muji-back-home"
              onClick={(e) => {
                e.stopPropagation();
                onBackHome();
              }}
            >
              {backHomeLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function spreadPageSrc(spread: PhotoSpread, side: "left" | "right") {
  if (side === "left") return spread.leftImage;
  if (spread.rightImage && spread.rightImage !== PHOTO_PLACEHOLDER_SRC) {
    return spread.rightImage;
  }
  return PHOTO_PLACEHOLDER_SRC;
}

function ClosedHalf({
  side,
  lang,
  previewSrc,
  showLabel,
  hint,
  onBackHome,
}: {
  side: "front" | "back";
  lang: "zh" | "zt" | "en";
  previewSrc?: string;
  showLabel?: boolean;
  hint?: string;
  onBackHome?: () => void;
}) {
  return (
    <div className={`muji-closed-half muji-closed-half--${side}`}>
      <MujiFrostedCover
        side={side}
        lang={lang}
        previewSrc={previewSrc}
        showLabel={showLabel}
        hint={hint}
        backHomeLabel={side === "back" ? BACK_HOME_HINT[lang] : undefined}
        onBackHome={side === "back" ? onBackHome : undefined}
      />
    </div>
  );
}

function viewKind(index: ViewIndex, spreadCount: number): ViewKind {
  if (index < 0) return "front";
  if (index >= spreadCount) return "back";
  return "content";
}

function CoverFlyout({
  children,
  onComplete,
  vertical = false,
}: {
  children: React.ReactNode;
  onComplete?: () => void;
  vertical?: boolean;
}) {
  const flyoutMs = flipTotalMs("cover-open");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const id = window.setTimeout(() => onCompleteRef.current?.(), flyoutMs + 32);
    return () => window.clearTimeout(id);
  }, [flyoutMs]);

  return (
    <motion.div
      className={`muji-flip-leaf muji-flip-leaf--cover-flyout${vertical ? " muji-flip-leaf--vertical" : ""}`}
      style={{
        transformOrigin: vertical ? "top center" : "left center",
        transformStyle: "preserve-3d",
      }}
      initial={{ x: 0, y: 0, rotateY: 0, rotateX: 0, z: 0, opacity: 1 }}
      animate={
        vertical
          ? {
              y: ["0%", "-28%", "-115%"],
              rotateX: [0, -48, -165],
              rotateY: [0, -4, 0],
              z: [0, 16, 0],
              opacity: [1, 0.85, 0],
            }
          : {
              x: ["0%", "28%", "115%"],
              rotateY: [0, -48, -165],
              rotateX: [0, -4, 0],
              z: [0, 16, 0],
              opacity: [1, 0.85, 0],
            }
      }
      transition={{
        duration: flyoutMs / 1000,
        ease: [0.22, 1, 0.36, 1] as const,
        times: [0, 0.35, 1],
      }}
    >
      <div className="muji-flip-leaf__face muji-flip-leaf__face--front">{children}</div>
    </motion.div>
  );
}

function FlipLeaf({
  className,
  origin,
  fromRotate,
  toRotate,
  front,
  back,
  onComplete,
  motionVariant = "default",
  vertical = false,
}: {
  className: string;
  origin: string;
  fromRotate: number;
  toRotate: number;
  front: React.ReactNode;
  back: React.ReactNode;
  onComplete?: () => void;
  motionVariant?: "default" | "cover-open" | "cover-close";
  vertical?: boolean;
}) {
  const duration = FLIP_MS / 1000;
  const slideMs = duration * 0.16;
  const flipMs = duration - slideMs;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const id = window.setTimeout(() => onCompleteRef.current?.(), flipTotalMs(motionVariant) + 32);
    return () => window.clearTimeout(id);
  }, [motionVariant]);

  const animate =
    motionVariant === "cover-open"
      ? vertical
        ? {
            y: ["0%", "-118%"],
            rotateX: [fromRotate, toRotate],
            rotateY: [0, -4, -1, 0],
            z: [0, 36, 10, 0],
          }
        : {
            x: ["0%", "118%"],
            rotateY: [fromRotate, toRotate],
            rotateX: [0, -4, -1, 0],
            z: [0, 36, 10, 0],
          }
      : motionVariant === "cover-close"
        ? vertical
          ? {
              y: [0, 0, -28, 0],
              rotateX: [fromRotate, fromRotate, toRotate, toRotate],
              rotateY: [0, -4, -1, 0],
              z: [0, 36, 10, 0],
            }
          : {
              x: [0, 0, 28, 0],
              rotateY: [fromRotate, fromRotate, toRotate, toRotate],
              rotateX: [0, -4, -1, 0],
              z: [0, 36, 10, 0],
            }
        : vertical
          ? {
              rotateX: toRotate,
              rotateY: [0, -4, -1, 0],
              z: [0, 36, 10, 0],
            }
          : {
              rotateY: toRotate,
              rotateX: [0, -4, -1, 0],
              z: [0, 36, 10, 0],
            };

  const transition =
    motionVariant === "cover-open"
      ? vertical
        ? {
            y: { duration: slideMs, ease: [0.22, 1, 0.36, 1] as const, times: [0, 0.55, 1] },
            rotateX: {
              duration: flipMs,
              delay: slideMs * 0.55,
              ease: [0.22, 1, 0.36, 1] as const,
            },
            rotateY: { ...FLIP_ARC, delay: slideMs * 0.55 },
            z: { ...FLIP_ARC, delay: slideMs * 0.55 },
          }
        : {
            x: { duration: slideMs, ease: [0.22, 1, 0.36, 1] as const, times: [0, 0.55, 1] },
            rotateY: {
              duration: flipMs,
              delay: slideMs * 0.55,
              ease: [0.22, 1, 0.36, 1] as const,
            },
            rotateX: { ...FLIP_ARC, delay: slideMs * 0.55 },
            z: { ...FLIP_ARC, delay: slideMs * 0.55 },
          }
      : motionVariant === "cover-close"
        ? vertical
          ? {
              y: { duration: flipMs, delay: slideMs, ease: [0.22, 1, 0.36, 1] as const },
              rotateX: { duration: flipMs, ease: [0.22, 1, 0.36, 1] as const },
              rotateY: FLIP_ARC,
              z: FLIP_ARC,
            }
          : {
              x: { duration: flipMs, delay: slideMs, ease: [0.22, 1, 0.36, 1] as const },
              rotateY: { duration: flipMs, ease: [0.22, 1, 0.36, 1] as const },
              rotateX: FLIP_ARC,
              z: FLIP_ARC,
            }
        : vertical
          ? {
              ...FLIP_TRANSITION,
              rotateY: FLIP_ARC,
              z: FLIP_ARC,
            }
          : {
              ...FLIP_TRANSITION,
              rotateX: FLIP_ARC,
              z: FLIP_ARC,
            };

  return (
    <motion.div
      className={`${className}${vertical ? " muji-flip-leaf--vertical" : ""}`}
      style={{ transformOrigin: origin, transformStyle: "preserve-3d" }}
      initial={{
        x: 0,
        y: 0,
        rotateY: vertical ? 0 : fromRotate,
        rotateX: vertical ? fromRotate : 0,
        z: 0,
      }}
      animate={animate}
      transition={transition}
    >
      <div className="muji-flip-leaf__face muji-flip-leaf__face--front">{front}</div>
      <div className="muji-flip-leaf__face muji-flip-leaf__face--back">{back}</div>
    </motion.div>
  );
}

export default function PhotographyBookOverlay({
  lang,
  onActiveChange,
}: PhotographyBookOverlayProps) {
  const navigate = useNavigate();
  const spreads = PHOTO_SPREADS;
  const spreadCount = spreads.length;
  const maxIndex = spreadCount;

  const [viewIndex, setViewIndex] = useState(-1);
  const [flip, setFlip] = useState<{ from: ViewIndex; to: ViewIndex; dir: 1 | -1 } | null>(null);
  const [zoomSrc, setZoomSrc] = useState<string | null>(null);
  const wheelLock = useRef(false);
  const flipLock = useRef(false);
  const verticalLayout = useAlbumVerticalLayout();
  const pendingFlipTarget = useRef<ViewIndex | null>(null);
  const flipFinishedRef = useRef(false);
  const viewIndexRef = useRef(-1);
  const maxIndexRef = useRef(maxIndex);

  viewIndexRef.current = viewIndex;
  maxIndexRef.current = maxIndex;

  const close = useCallback(() => navigate("/"), [navigate]);

  const coverHint =
    lang === "en" ? "The flavor of life" : lang === "zt" ? "世界愛" : "世界爱";

  useEffect(() => {
    onActiveChange?.(true);
    return () => onActiveChange?.(false);
  }, [onActiveChange]);

  useEffect(() => {
    spreads.forEach((spread) => {
      [spread.leftImage, spread.rightImage].forEach((src) => {
        if (src && src !== PHOTO_PLACEHOLDER_SRC) {
          const img = new Image();
          img.src = src;
        }
      });
    });
  }, [spreads]);

  const finishFlip = useCallback((target: ViewIndex) => {
    if (pendingFlipTarget.current !== target || flipFinishedRef.current) return;
    flipFinishedRef.current = true;
    pendingFlipTarget.current = null;
    viewIndexRef.current = target;
    setViewIndex(target);
    setFlip(null);
    flipLock.current = false;
  }, []);

  const step = useCallback((delta: 1 | -1) => {
    if (flipLock.current) return;
    const current = viewIndexRef.current;
    const max = maxIndexRef.current;
    const next = current + delta;
    if (next < -1 || next > max) return;

    flipLock.current = true;
    flipFinishedRef.current = false;
    pendingFlipTarget.current = next;
    setFlip({ from: current, to: next, dir: delta });
    playPageFlipSound();
  }, []);

  const goTo = useCallback((target: ViewIndex) => {
    if (flipLock.current) return;
    const current = viewIndexRef.current;
    const max = maxIndexRef.current;
    if (target === current || target < -1 || target > max) return;

    if (Math.abs(target - current) !== 1) {
      viewIndexRef.current = target;
      setViewIndex(target);
      return;
    }

    const dir = target > current ? 1 : -1;
    flipLock.current = true;
    flipFinishedRef.current = false;
    pendingFlipTarget.current = target;
    setFlip({ from: current, to: target, dir });
    playPageFlipSound();
  }, []);

  const stepRef = useRef(step);
  stepRef.current = step;

  const goToRef = useRef(goTo);
  goToRef.current = goTo;

  const backToCover = useCallback(() => {
    goToRef.current(-1);
  }, []);

  const openFromCover = useCallback(() => {
    if (flipLock.current) return;
    if (viewIndexRef.current === -1) stepRef.current(1);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (zoomSrc) {
        if (e.key === "Escape") {
          e.preventDefault();
          setZoomSrc(null);
        }
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepRef.current(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepRef.current(-1);
      }
    };
    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [close, zoomSrc]);

  if (!spreadCount) return null;

  const renderClosedLayout = (kind: "front" | "back") => (
    <div className={`muji-book-closed muji-book-closed--${kind}`}>
      <ClosedHalf
        side={kind}
        lang={lang}
        previewSrc={kind === "front" ? spreads[0]?.leftImage : spreads[spreadCount - 1]?.leftImage}
        showLabel={kind === "front"}
        hint={kind === "front" ? coverHint : undefined}
        onBackHome={kind === "back" ? backToCover : undefined}
      />
    </div>
  );

  const renderPhoto = (spreadIndex: number, side: "left" | "right") => {
    const spread = spreads[spreadIndex];
    if (!spread) return <PhotoSlot />;
    return (
      <BookPhoto
        src={spreadPageSrc(spread, side)}
        alt=""
        crop="center"
        onZoom={setZoomSrc}
      />
    );
  };

  const renderSpread = (index: number) => {
    if (!spreads[index]) return null;
    return (
      <SpreadShell
        left={renderPhoto(index, "left")}
        right={renderPhoto(index, "right")}
      />
    );
  };

  const renderPageFace = (spreadIndex: number, side: "left" | "right") => (
    <div className={`muji-page muji-page--${side} muji-page--photo`}>
      {renderPhoto(spreadIndex, side)}
    </div>
  );

  const renderCoverFace = (side: "front" | "back") => (
    <div className="muji-page muji-page--cover">
      <MujiFrostedCover
        side={side}
        lang={lang}
        previewSrc={
          side === "front" ? spreads[0]?.leftImage : spreads[spreadCount - 1]?.leftImage
        }
        showLabel={side === "front"}
        hint={side === "front" ? coverHint : undefined}
        backHomeLabel={side === "back" ? BACK_HOME_HINT[lang] : undefined}
        onBackHome={side === "back" ? backToCover : undefined}
      />
    </div>
  );

  const renderBase = () => {
    if (!flip) {
      const kind = viewKind(viewIndex, spreadCount);
      if (kind === "front") return renderClosedLayout("front");
      if (kind === "back") return renderClosedLayout("back");
      return renderSpread(viewIndex);
    }

    const { from, to, dir } = flip;
    const fromKind = viewKind(from, spreadCount);
    const toKind = viewKind(to, spreadCount);

    if (fromKind === "front" && toKind === "content" && dir > 0) {
      return (
        <SpreadShell
          left={renderPhoto(to, "left")}
          right={renderPhoto(to, "right")}
        />
      );
    }

    if (fromKind === "content" && toKind === "front" && dir < 0) {
      return (
        <SpreadShell
          leftHidden
          left={null}
          right={renderPhoto(from, "right")}
        />
      );
    }

    if (fromKind === "content" && toKind === "back" && dir > 0) {
      return (
        <SpreadShell
          left={renderPhoto(from, "left")}
          rightHidden
          right={null}
        />
      );
    }

    if (fromKind === "back" && toKind === "content" && dir < 0) {
      return (
        <SpreadShell
          left={renderPhoto(to, "left")}
          right={renderPhoto(to, "right")}
        />
      );
    }

    if (fromKind === "content" && toKind === "content") {
      if (dir > 0) {
        return (
          <SpreadShell
            left={renderPhoto(from, "left")}
            right={renderPhoto(to, "right")}
          />
        );
      }
      return (
        <SpreadShell
          left={renderPhoto(to, "left")}
          right={renderPhoto(from, "right")}
        />
      );
    }

    const kind = viewKind(viewIndex, spreadCount);
    if (kind === "front") return renderClosedLayout("front");
    if (kind === "back") return renderClosedLayout("back");
    return renderSpread(viewIndex);
  };

  const renderFlipLeaf = () => {
    if (!flip) return null;

    const { from, to, dir } = flip;
    const fromKind = viewKind(from, spreadCount);
    const toKind = viewKind(to, spreadCount);
    const onComplete = () => finishFlip(to);
    const v = verticalLayout;

    if (fromKind === "front" && toKind === "content" && dir > 0) {
      return (
        <CoverFlyout onComplete={onComplete} vertical={v}>
          {renderCoverFace("front")}
        </CoverFlyout>
      );
    }

    if (fromKind === "content" && toKind === "front" && dir < 0) {
      return (
        <FlipLeaf
          className="muji-flip-leaf muji-flip-leaf--cover-close"
          origin={v ? "bottom center" : "right center"}
          fromRotate={0}
          toRotate={180}
          onComplete={onComplete}
          vertical={v}
          front={renderPageFace(from, "left")}
          back={renderCoverFace("front")}
        />
      );
    }

    if (fromKind === "content" && toKind === "back" && dir > 0) {
      return (
        <FlipLeaf
          className="muji-flip-leaf muji-flip-leaf--cover-close muji-flip-leaf--page-right"
          origin={v ? "top center" : "left center"}
          fromRotate={0}
          toRotate={180}
          onComplete={onComplete}
          vertical={v}
          front={renderPageFace(from, "right")}
          back={renderCoverFace("back")}
        />
      );
    }

    if (fromKind === "back" && toKind === "content" && dir < 0) {
      return (
        <FlipLeaf
          className="muji-flip-leaf muji-flip-leaf--cover-open muji-flip-leaf--page-right"
          origin={v ? "top center" : "right center"}
          fromRotate={180}
          toRotate={0}
          onComplete={onComplete}
          vertical={v}
          front={renderCoverFace("back")}
          back={renderPageFace(to, "right")}
        />
      );
    }

    if (fromKind === "content" && toKind === "content") {
      if (dir > 0) {
        return (
          <FlipLeaf
            className="muji-flip-leaf muji-flip-leaf--page-right"
            origin={v ? "top center" : "left center"}
            fromRotate={0}
            toRotate={-180}
            onComplete={onComplete}
            vertical={v}
            front={renderPageFace(from, "right")}
            back={renderPageFace(to, "left")}
          />
        );
      }
      return (
        <FlipLeaf
          className="muji-flip-leaf muji-flip-leaf--page-left"
          origin={v ? "bottom center" : "right center"}
          fromRotate={0}
          toRotate={180}
          onComplete={onComplete}
          vertical={v}
          front={renderPageFace(from, "left")}
          back={renderPageFace(to, "right")}
        />
      );
    }

    return null;
  };

  const stableKind = viewKind(viewIndex, spreadCount);
  const locationSpread =
    stableKind === "content"
      ? spreads[viewIndex]
      : flip && viewKind(flip.to, spreadCount) === "content"
        ? spreads[flip.to]
        : null;

  const progressSlots: ViewIndex[] = [-1, ...spreads.map((_, i) => i), spreadCount];

  const restingKind = viewKind(viewIndex, spreadCount);
  const isCoverFlip =
    !!flip &&
    (viewKind(flip.from, spreadCount) === "front" ||
      viewKind(flip.to, spreadCount) === "front" ||
      viewKind(flip.from, spreadCount) === "back" ||
      viewKind(flip.to, spreadCount) === "back");

  const frameSpread =
    restingKind === "content" || !!flip || isCoverFlip;
  const atCover = viewIndex <= -1 && !flip;
  const atBack = viewIndex >= spreadCount && !flip;

  const handleTurnPrev = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (flipLock.current || atCover) return;
      stepRef.current(-1);
    },
    [atCover]
  );

  const handleTurnNext = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (flipLock.current || atBack) return;
      if (viewIndexRef.current === -1) {
        openFromCover();
        return;
      }
      stepRef.current(1);
    },
    [atBack, openFromCover]
  );

  const albumSwipeNext = useCallback(() => {
    if (zoomSrc || flipLock.current) return;
    if (viewIndexRef.current >= spreadCount) return;
    if (viewIndexRef.current === -1) {
      openFromCover();
      return;
    }
    stepRef.current(1);
  }, [openFromCover, spreadCount, zoomSrc]);

  const albumSwipePrev = useCallback(() => {
    if (zoomSrc || flipLock.current) return;
    if (viewIndexRef.current <= -1) return;
    stepRef.current(-1);
  }, [zoomSrc]);

  const horizontalSwipe = useHorizontalSwipe(albumSwipeNext, albumSwipePrev);
  const verticalSwipe = useVerticalSwipe(albumSwipeNext, albumSwipePrev);
  const albumSwipeHandlers = verticalLayout ? verticalSwipe : horizontalSwipe;

  useEffect(() => {
    const onDocWheel = (e: WheelEvent) => {
      if (zoomSrc) return;
      e.preventDefault();
      if (wheelLock.current) return;
      wheelLock.current = true;
      stepRef.current(e.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => {
        wheelLock.current = false;
      }, FLIP_MS);
    };
    window.addEventListener("wheel", onDocWheel, { passive: false });
    return () => window.removeEventListener("wheel", onDocWheel);
  }, [zoomSrc]);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".muji-album-interactive, .photo-book-close")) {
        return;
      }
      if (zoomSrc) {
        setZoomSrc(null);
        return;
      }
      close();
    },
    [close, zoomSrc]
  );

  return (
    <AnimatePresence>
      <div
        className="muji-album-overlay fixed inset-0 z-[100] flex items-center justify-center cursor-none"
        onClick={handleOverlayClick}
        role="presentation"
      >
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="muji-album-shell relative z-10 select-none pointer-events-none"
        >
          <div className="muji-album-book muji-album-interactive">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="photo-book-close muji-album-interactive"
              aria-label={lang === "en" ? "Close" : "关闭"}
            >
              <X size={15} strokeWidth={1.75} />
            </button>

            <div className="muji-album-stage">
              <div
                className={`muji-album-viewport ${verticalLayout ? "touch-pan-x" : "touch-pan-y"}`}
                {...albumSwipeHandlers}
              >
                <div className="muji-album-book-inner">
                  <div className="muji-album-shadow" aria-hidden />
                  <div
                    className={`muji-book-frame ${
                      frameSpread ? "muji-book-frame--spread" : "muji-book-frame--closed"
                    }${isCoverFlip ? " muji-book-frame--cover-flip" : ""}${
                      verticalLayout ? " muji-book-frame--vertical" : ""
                    }`}
                  >
                    {renderBase()}
                    {renderFlipLeaf()}
                    <button
                      type="button"
                      className="muji-page-turn muji-page-turn--prev"
                      onClick={handleTurnPrev}
                      disabled={atCover || !!flip}
                      aria-label={lang === "en" ? "Previous page" : "上一页"}
                    />
                    <button
                      type="button"
                      className="muji-page-turn muji-page-turn--next"
                      onClick={handleTurnNext}
                      disabled={atBack || !!flip}
                      aria-label={
                        atCover
                          ? lang === "en"
                            ? "Open album"
                            : "翻開相冊"
                          : lang === "en"
                            ? "Next page"
                            : "下一页"
                      }
                    />
                  </div>
                </div>
              </div>
            </div>

            {locationSpread && (
              <p className="muji-album-location muji-album-interactive">
                {locationSpread.title[lang] || locationSpread.title.en}
              </p>
            )}

            <div className="muji-album-progress muji-album-interactive">
              {progressSlots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goTo(slot);
                  }}
                  className={
                    slot === viewIndex && !flip
                      ? "muji-album-progress__dot muji-album-progress__dot--active"
                      : "muji-album-progress__dot"
                  }
                  aria-label={
                    slot < 0
                      ? lang === "en"
                        ? "Cover"
                        : "封面"
                      : slot >= spreadCount
                        ? lang === "en"
                          ? "Back cover"
                          : "封底"
                        : spreads[slot]?.title[lang] || spreads[slot]?.title.en || ""
                  }
                />
              ))}
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {zoomSrc && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[110] bg-black/92 flex items-center justify-center p-4 cursor-zoom-out pointer-events-auto"
              onClick={() => setZoomSrc(null)}
            >
              <button
                type="button"
                onClick={() => setZoomSrc(null)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-none p-2 bg-white/5 rounded-full backdrop-blur-sm"
                aria-label={lang === "en" ? "Close" : "关闭"}
              >
                <X className="w-5 h-5" />
              </button>
              <motion.img
                initial={{ scale: 0.96 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.96 }}
                transition={{ type: "spring", damping: 26, stiffness: 320 }}
                src={zoomSrc}
                alt=""
                className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AnimatePresence>
  );
}

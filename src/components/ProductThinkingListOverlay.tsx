import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playUiSwitchSound, UI_SWITCH_SOUND_NAV_ID } from "../utils/uiSwitchSound";

export interface ProductArticle {
  title: string;
  subtitle: string;
  date?: string;
  publication: string;
  link: string;
}

interface ProductThinkingListOverlayProps {
  articles: ProductArticle[];
  lang: "zh" | "zt" | "en";
  onActiveChange?: (active: boolean) => void;
}

const VISIBLE_SLOTS = 4;

const PANEL_TITLE = {
  en: "Articles",
  zh: "文章",
  zt: "文章",
};

export default function ProductThinkingListOverlay({
  articles,
  lang,
  onActiveChange,
}: ProductThinkingListOverlayProps) {
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const wheelLock = useRef(false);
  const prevSelectedIndex = useRef(0);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const total = articles.length;
  const active = articles[selectedIndex];

  const close = useCallback(() => navigate("/"), [navigate]);

  useEffect(() => {
    onActiveChange?.(true);
    return () => onActiveChange?.(false);
  }, [onActiveChange]);

  useEffect(() => {
    setSelectedIndex((idx) => Math.min(idx, Math.max(0, total - 1)));
  }, [total]);

  useEffect(() => {
    itemRefs.current[selectedIndex]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedIndex]);

  useEffect(() => {
    if (prevSelectedIndex.current !== selectedIndex) {
      playUiSwitchSound(UI_SWITCH_SOUND_NAV_ID);
      prevSelectedIndex.current = selectedIndex;
    }
  }, [selectedIndex]);

  const openArticle = useCallback(
    (index: number) => {
      const item = articles[index];
      if (item?.link) window.open(item.link, "_blank", "noopener,noreferrer");
    },
    [articles]
  );

  const moveSelection = useCallback(
    (delta: number) => {
      if (!total) return;
      setSelectedIndex((prev) => Math.max(0, Math.min(total - 1, prev + delta)));
    },
    [total]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveSelection(1);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveSelection(-1);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        openArticle(selectedIndex);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, moveSelection, openArticle, selectedIndex]);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      if (wheelLock.current) return;
      wheelLock.current = true;
      moveSelection(e.deltaY > 0 ? 1 : -1);
      window.setTimeout(() => {
        wheelLock.current = false;
      }, 220);
    },
    [moveSelection]
  );

  const scrollRatio = total <= 1 ? 1 : selectedIndex / (total - 1);
  const thumbRatio = Math.min(VISIBLE_SLOTS, total) / Math.max(total, 1);
  const thumbHeightPct = Math.max(14, thumbRatio * 100);
  const thumbTopPct =
    total <= 1 || thumbRatio >= 1 ? 0 : scrollRatio * (100 - thumbHeightPct);

  if (!total || !active) return null;

  return (
    <AnimatePresence>
      <div className="product-list-overlay fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
        <div
          className="absolute inset-0 pointer-events-auto bg-white/55 backdrop-blur-[2px] cursor-none"
          onClick={close}
          aria-hidden
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="product-list-shell relative z-10 pointer-events-auto select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={close}
            className="product-list-close"
            aria-label={lang === "en" ? "Close" : "关闭"}
          >
            <X size={15} strokeWidth={1.75} />
          </button>

          <div className="product-list-panel">
            <h2 className="product-list-heading">{PANEL_TITLE[lang]}</h2>

            <div className="product-list-body">
              <div ref={listRef} className="product-list-viewport" onWheel={onWheel}>
                <ul className="product-list-stack">
                  {articles.map((item, idx) => {
                    const isSelected = idx === selectedIndex;
                    return (
                      <li key={`${item.link}-${idx}`}>
                        <button
                          ref={(el) => {
                            itemRefs.current[idx] = el;
                          }}
                          type="button"
                          onClick={() => openArticle(idx)}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`product-list-row ${isSelected ? "product-list-row--selected" : ""}`}
                        >
                          <span className="product-list-row-title">{item.title}</span>
                          <span className="product-list-row-desc">{item.subtitle}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {total > VISIBLE_SLOTS && (
                <div className="product-list-scrollbar" aria-hidden>
                  <div className="product-list-scrollbar-track">
                    <div
                      className="product-list-scrollbar-thumb"
                      style={{
                        height: `${thumbHeightPct}%`,
                        top: `${thumbTopPct}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

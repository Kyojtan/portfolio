import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ChatPopupWindow from "../clone/ChatPopupWindow";
import { mapPortfolioLang } from "../clone/mapLang";
import AboutMeDetailsWindow from "./AboutMeDetailsWindow";

type Pane = "chat" | "details";

export default function AboutMeChatOverlay({
  lang,
  onClose,
}: {
  lang: "zh" | "zt" | "en";
  onClose: () => void;
}) {
  const [pane, setPane] = useState<Pane>("chat");
  const [isMaximized, setIsMaximized] = useState(false);
  const [hideSideNav, setHideSideNav] = useState(false);
  const hideNavTimer = useRef<ReturnType<typeof setTimeout>>();

  const pauseSideNav = useCallback(() => {
    setHideSideNav(true);
    clearTimeout(hideNavTimer.current);
    hideNavTimer.current = setTimeout(() => setHideSideNav(false), 480);
  }, []);

  const handleClose = useCallback(() => {
    setIsMaximized(false);
    onClose();
  }, [onClose]);

  const goToChat = useCallback(() => {
    setPane("chat");
  }, []);

  const goToDetails = useCallback(() => {
    setIsMaximized(false);
    setPane("details");
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        handleClose();
        return;
      }
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;

      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, [contenteditable="true"]')) return;
      if (e.repeat) return;

      e.preventDefault();
      if (e.key === "ArrowLeft") goToChat();
      else goToDetails();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goToChat, goToDetails, handleClose]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0) pauseSideNav();
    };
    window.addEventListener("pointerdown", onPointerDown);
    return () => window.removeEventListener("pointerdown", onPointerDown);
  }, [pauseSideNav]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(hideNavTimer.current);
    };
  }, []);

  const prevLabel = lang === "en" ? "Chat" : lang === "zt" ? "對話" : "对话";
  const nextLabel = lang === "en" ? "Details" : lang === "zt" ? "詳情" : "详情";

  return (
    <div className="about-me-overlay-scene fixed inset-0 z-[100] pointer-events-none">
      <div
        className="absolute inset-0 bg-white/55 backdrop-blur-[2px] pointer-events-auto cursor-none"
        onClick={handleClose}
        aria-hidden
      />

      {!isMaximized && pane === "details" && !hideSideNav && (
        <button
          type="button"
          onClick={goToChat}
          className="ai-nav-arrow ai-nav-arrow--side fixed left-4 md:left-8 z-[110] pointer-events-auto"
          aria-label={prevLabel}
        >
          <ChevronLeft />
        </button>
      )}
      {!isMaximized && pane === "chat" && !hideSideNav && (
        <button
          type="button"
          onClick={goToDetails}
          className="ai-nav-arrow ai-nav-arrow--side fixed right-4 md:right-8 z-[110] pointer-events-auto"
          aria-label={nextLabel}
        >
          <ChevronRight />
        </button>
      )}

      <div
        className={`relative z-[105] flex min-h-svh items-center justify-center pointer-events-none transition-all duration-300 ${
          isMaximized ? "p-0" : "p-3 sm:p-5 md:p-6"
        }`}
      >
        <AnimatePresence mode="wait">
          {pane === "chat" ? (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className={`pointer-events-none w-full flex justify-center ${
                isMaximized ? "h-full" : ""
              }`}
            >
              {isMaximized ? (
                <div
                  className="pointer-events-auto w-full h-full"
                  onWheel={pauseSideNav}
                >
                  <ChatPopupWindow
                    isOpen
                    onClose={handleClose}
                    lang={mapPortfolioLang(lang)}
                    backdrop="none"
                    onEscape={handleClose}
                    isMaximized={isMaximized}
                    onMaximizedChange={setIsMaximized}
                    onUserScroll={pauseSideNav}
                  />
                </div>
              ) : (
                <div
                  className="pointer-events-auto relative mx-auto w-full max-w-[min(48rem,calc(100vw-1.25rem))]"
                  onClick={(e) => e.stopPropagation()}
                  onWheel={pauseSideNav}
                >
                  <ChatPopupWindow
                    isOpen
                    onClose={handleClose}
                    lang={mapPortfolioLang(lang)}
                    backdrop="none"
                    onEscape={handleClose}
                    isMaximized={isMaximized}
                    onMaximizedChange={setIsMaximized}
                    onUserScroll={pauseSideNav}
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="details"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-none w-full flex justify-center"
            >
              <AboutMeDetailsWindow lang={lang} onClose={handleClose} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

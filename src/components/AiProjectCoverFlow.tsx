import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import ProjectCoverIcon from "./ProjectCoverIcon";
import { playUiSwitchSound, UI_SWITCH_SOUND_NAV_ID } from "../utils/uiSwitchSound";

export interface CoverFlowProject {
  id: string;
  name: { zh: string; zt: string; en: string };
  desc: { zh: string; zt: string; en: string };
}

interface AiProjectCoverFlowProps {
  projects: CoverFlowProject[];
  lang: "zh" | "zt" | "en";
  onSelect: (projectId: string) => void;
}


function getCardStyle(index: number, logicalIndex: number, total: number) {
  const realIndex = ((logicalIndex % total) + total) % total;
  let offset = index - realIndex;
  if (offset > total / 2) offset -= total;
  if (offset < -total / 2) offset += total;

  if (offset === 0) {
    return {
      transform: "translateX(0px) translateZ(300px) rotateY(0deg)",
      zIndex: 100,
      opacity: 1,
    };
  }

  const dir = offset > 0 ? 1 : -1;
  const abs = Math.abs(offset);
  const sideOpacity = abs === 1 ? 0.88 : abs === 2 ? 0.72 : 0;
  const centerGap = 195;
  const sideStep = 98;
  const translateX = centerGap + (abs - 1) * sideStep;
  return {
    transform: `translateX(${dir * translateX}px) translateZ(0px) rotateY(${dir * -48}deg)`,
    zIndex: 100 - abs,
    opacity: abs > 2 ? 0 : sideOpacity,
  };
}

export default function AiProjectCoverFlow({ projects, lang, onSelect }: AiProjectCoverFlowProps) {
  const navigate = useNavigate();
  const [logicalIndex, setLogicalIndex] = useState(0);
  const wheelLock = useRef(false);

  const total = projects.length;
  const realIndex = total ? ((logicalIndex % total) + total) % total : 0;
  const active = projects[realIndex];

  const jumpTo = useCallback(
    (target: number) => {
      if (!total) return;
      const currentReal = ((logicalIndex % total) + total) % total;
      let diff = target - currentReal;
      if (diff > total / 2) diff -= total;
      if (diff < -total / 2) diff += total;
      setLogicalIndex((prev) => prev + diff);
    },
    [logicalIndex, total]
  );

  const enterActive = useCallback(() => {
    if (active) onSelect(active.id);
  }, [active, onSelect]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        navigate("/");
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        playUiSwitchSound(UI_SWITCH_SOUND_NAV_ID);
        setLogicalIndex((prev) => prev + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        playUiSwitchSound(UI_SWITCH_SOUND_NAV_ID);
        setLogicalIndex((prev) => prev - 1);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        enterActive();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [enterActive, navigate]);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    if (wheelLock.current) return;
    wheelLock.current = true;
    playUiSwitchSound(UI_SWITCH_SOUND_NAV_ID);
    setLogicalIndex((prev) => prev + (e.deltaY > 0 ? 1 : -1));
    window.setTimeout(() => {
      wheelLock.current = false;
    }, 280);
  }, []);

  if (!active) return null;

  return (
    <AnimatePresence>
      <div className="ai-coverflow-overlay fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
        <div
          className="ai-coverflow-backdrop absolute inset-0 pointer-events-auto cursor-none"
          onClick={() => navigate("/")}
          aria-label={lang === "en" ? "Back to homepage" : "返回首页"}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              navigate("/");
            }
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="ai-coverflow-shell relative z-10 flex flex-col items-center select-none pointer-events-auto"
          onWheel={onWheel}
        >
          <div className="ai-coverflow-viewport">
            {projects.map((proj, i) => {
              const style = getCardStyle(i, logicalIndex, total);
              const isCenter = i === realIndex;

              return (
                <div
                  key={proj.id}
                  className="ai-coverflow-card-shell"
                  style={{
                    transform: style.transform,
                    zIndex: style.zIndex,
                    opacity: style.opacity,
                  }}
                >
                  <button
                    type="button"
                    className="ai-coverflow-card"
                    onClick={() => {
                      if (isCenter) enterActive();
                      else jumpTo(i);
                    }}
                    aria-label={proj.name[lang]}
                  >
                    <ProjectCoverIcon projectId={proj.id} isCenter={isCenter} />
                  </button>
                </div>
              );
            })}
          </div>

          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="ai-coverflow-info text-center"
          >
            <h3 className="text-[17px] font-semibold text-[#374151] tracking-tight leading-snug">
              {active.name[lang]}
            </h3>
            <p className="mt-1.5 text-[14px] text-[#4B5563] leading-relaxed font-normal w-[33vw] max-w-[520px] min-w-[240px] mx-auto">
              {active.desc[lang]}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

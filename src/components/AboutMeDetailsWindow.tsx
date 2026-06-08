import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import AboutMeDetailsPanel, { type AboutSection } from "./AboutMeDetailsPanel";

type Lang = "zh" | "zt" | "en";

const SECTION_LABELS: Record<AboutSection, Record<Lang, string>> = {
  experience: { zh: "经历", zt: "經歷", en: "Experience" },
  education: { zh: "教育", zt: "教育", en: "Education" },
  skills: { zh: "技能", zt: "技能", en: "Skills" },
};

const SECTIONS: AboutSection[] = ["experience", "education", "skills"];

export default function AboutMeDetailsWindow({
  lang,
  onClose,
}: {
  lang: Lang;
  onClose: () => void;
}) {
  const [section, setSection] = useState<AboutSection>("experience");

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0, y: 30 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 30 }}
      transition={{ type: "spring", stiffness: 350, damping: 26 }}
      className="about-overlay-details-shell pointer-events-auto relative flex flex-col font-sans text-zinc-800 w-full max-w-[min(48rem,calc(100vw-1.25rem))] h-[min(85vh,680px)]"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        type="button"
        onClick={onClose}
        className="photo-book-close pointer-events-auto"
        aria-label={lang === "en" ? "Close" : "关闭"}
      >
        <X size={15} strokeWidth={1.75} />
      </button>

      <nav className="about-folder-tabs" aria-label={lang === "en" ? "Sections" : "章节"}>
        {SECTIONS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSection(key)}
            className={`about-folder-tab${
              section === key ? " about-folder-tab--active" : ""
            }`}
          >
            {SECTION_LABELS[key][lang]}
          </button>
        ))}
      </nav>

      <div className="about-folder-panel window-glass flex-1 min-h-0 flex flex-col">
        <AboutMeDetailsPanel lang={lang} section={section} />
      </div>
    </motion.div>
  );
}

import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Github, Mail, Linkedin } from "lucide-react";
import Folder from "./Folder";
import AboutMeChatOverlay from "./AboutMeChatOverlay";
import { TRANSLATIONS, PROJECTS } from "../constants";

export default function HomePageContent({
  lang,
  setLang,
}: {
  lang: "zh" | "zt" | "en";
  setLang: (l: "zh" | "zt" | "en") => void;
}) {
  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.zh, [lang]);
  const [aboutChatOpen, setAboutChatOpen] = useState(false);

  const openAboutChat = () => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setAboutChatOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col p-8 md:p-12 font-sans relative overflow-x-hidden bg-[#FAFAFA]">
      {aboutChatOpen && <AboutMeChatOverlay lang={lang} onClose={() => setAboutChatOpen(false)} />}
      <div
        className={`flex flex-col flex-grow w-full ${
          aboutChatOpen ? "pointer-events-none select-none" : ""
        }`}
        aria-hidden={aboutChatOpen}
      >
      <header className="flex justify-between items-center mb-0 px-4 w-full max-w-7xl mx-auto">
        <div className="flex flex-col">
          <h1 className="text-[24px] font-bold text-[#1A1A1A] tracking-tight font-mono">{t.name}</h1>
          <p className="text-sm md:text-base text-accent font-bold font-mono uppercase tracking-widest">Portfolio</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="bg-gray-100/40 backdrop-blur-md p-1 rounded-full flex items-center gap-0.5 border border-gray-100/50 shadow-xs">
            <button
              onClick={() => setLang("zh")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-none ${
                lang === "zh" ? "bg-black text-white shadow-sm" : "text-gray-400 hover:text-gray-700"
              }`}
              type="button"
            >
              简
            </button>
            <button
              onClick={() => setLang("zt")}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-none ${
                lang === "zt" ? "bg-black text-white shadow-sm" : "text-gray-400 hover:text-gray-700"
              }`}
              type="button"
            >
              繁
            </button>
            <button
              onClick={() => setLang("en")}
              className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-none ${
                lang === "en" ? "bg-black text-white shadow-sm" : "text-gray-400 hover:text-gray-700"
              }`}
              type="button"
            >
              EN
            </button>
          </div>
        </div>
      </header>

      <div className="flex-grow w-full max-w-6xl mx-auto flex flex-col items-center justify-center my-auto py-8">
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-10 md:gap-20 items-start justify-items-center w-full">
          {PROJECTS.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <Folder
                color={project.color}
                label={t[project.labelKey as keyof typeof t]}
                to={project.path}
                onOpen={project.id === "about" ? openAboutChat : undefined}
              />
            </motion.div>
          ))}
        </section>
      </div>

      <footer className="flex items-center justify-center gap-8 mt-auto pb-4">
        <motion.a
          href="https://github.com/Kyojtan"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4, scale: 1.1 }}
          className="text-gray-400 hover:text-[#1A1A1A] transition-all cursor-none"
        >
          <Github className="w-6 h-6" />
        </motion.a>
        <motion.a
          href="https://www.linkedin.com/in/xujun-tan"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ y: -4, scale: 1.1 }}
          className="text-gray-400 hover:text-[#0077B5] transition-all cursor-none"
        >
          <Linkedin className="w-6 h-6" />
        </motion.a>
        <motion.a
          href="mailto:tanxujun895@gmail.com"
          whileHover={{ y: -4, scale: 1.1 }}
          className="text-gray-400 hover:text-accent transition-all cursor-none"
        >
          <Mail className="w-6 h-6" />
        </motion.a>
      </footer>
      </div>
    </main>
  );
}

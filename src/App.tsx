import { useState, useMemo, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from "motion/react";
import { Github, Mail, Linkedin } from "lucide-react";
import Folder from './components/Folder';
import CategoryPage from './pages/CategoryPage';
import CursorTrail from './components/CursorTrail';
import { TRANSLATIONS, PROJECTS } from './constants';

function playClickSound() {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Warm wooden switch click
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(1000, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.04);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(180, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.06);

    gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.065);
    osc2.start(ctx.currentTime);
    osc2.stop(ctx.currentTime + 0.075);
  } catch (err) {
    // Autoplay browser policy may defer context start, will resume automatically.
  }
}

function Home({ lang, setLang }: { lang: 'zh' | 'zt' | 'en', setLang: (l: 'zh' | 'zt' | 'en') => void }) {
  const t = useMemo(() => TRANSLATIONS[lang] || TRANSLATIONS.zh, [lang]);

  return (
    <main className="min-h-screen flex flex-col p-8 md:p-12 font-sans relative overflow-x-hidden">
      {/* Header Section (Minimalist Notion-like) */}
      <header className="flex justify-between items-center mb-0 px-4 w-full max-w-7xl mx-auto">
        <div className="flex flex-col">
          <h1 className="text-[24px] font-bold text-[#1A1A1A] tracking-tight font-mono">
            {t.name}
          </h1>
          <p className="text-sm md:text-base text-accent font-bold font-mono uppercase tracking-widest">
            Portfolio
          </p>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-6">
          <div className="bg-gray-100/40 backdrop-blur-md p-1 rounded-full flex items-center gap-0.5 border border-gray-100/50 shadow-xs">
            <button
              onClick={() => setLang('zh')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-none ${
                lang === 'zh' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              简
            </button>
            <button
              onClick={() => setLang('zt')}
              className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-none ${
                lang === 'zt' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              繁
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-3.5 py-1 text-xs font-bold rounded-full transition-all cursor-none ${
                lang === 'en' ? 'bg-black text-white shadow-sm' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Content: Glassy Folder Grid */}
      <div className="flex-grow w-full max-w-6xl mx-auto flex flex-col items-center justify-center my-auto py-8">
        {/* Folders Grid */}
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
              />
            </motion.div>
          ))}
        </section>
      </div>

      {/* Footer Social Icons (Minimalist Integrated Style) */}
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
    </main>
  );
}

const CatCursorSVG = ({ isHovering }: { isHovering: boolean }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full drop-shadow-sm"
  >
    {/* Cat Face Outline */}
    <path 
      d="M8 12 L6 18 C6 22, 10 24, 16 24 C22 24, 26 22, 26 18 L24 12 L20 14 L12 14 L8 12Z" 
      fill="white" 
      stroke="black" 
      strokeWidth="1.5" 
      strokeLinejoin="round" 
    />
    
    {/* Ears */}
    <path d="M8 12 L10 6 L14 14" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M24 12 L22 6 L18 14" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    
    {/* Eyes */}
    <circle cx="12" cy="18" r="1.2" fill="black" />
    <circle cx="20" cy="18" r="1.2" fill="black" />
    
    {/* Mouth */}
    <path d="M15 21 Q16 22 17 21" stroke="black" strokeWidth="1" strokeLinecap="round" />

    {/* The "?" or Squiggle */}
    <motion.path 
      d="M24 6 C26 4, 28 6, 26 8 L25 10" 
      stroke="black" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      animate={isHovering ? { pathLength: [0, 1], opacity: [0, 1] } : { opacity: 0.5 }}
    />
    <motion.circle 
      cx="25" cy="12" r="0.8" 
      fill="black"
      animate={isHovering ? { scale: [0, 1] } : { opacity: 0.5 }}
    />
  </svg>
);

function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .cursor-pointer, .group')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseover', onMouseOver);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return (
    <motion.div
      className="fixed top-0 left-0 w-10 h-10 pointer-events-none z-[9999] hidden md:block"
      animate={{
        x: position.x - 20,
        y: position.y - 20,
        scale: isHovering ? 1.5 : 1,
        rotate: isHovering ? [0, -5, 5, -5, 0] : 0
      }}
      transition={{ 
        x: { type: "spring", stiffness: 1000, damping: 50, mass: 0.1 },
        y: { type: "spring", stiffness: 1000, damping: 50, mass: 0.1 },
        scale: { duration: 0.2 },
        rotate: { duration: 0.4, repeat: isHovering ? Infinity : 0 }
      }}
    >
      <CatCursorSVG isHovering={isHovering} />
    </motion.div>
  );
}

export default function App() {
  const [lang, setLang] = useState<'zh' | 'zt' | 'en'>('en');

  // Intercept all physical click behaviors on interactive elements to trigger sound synthesis
  useEffect(() => {
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, [role="button"], .cursor-pointer, input[type="range"]')) {
        playClickSound();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <BrowserRouter>
      <CursorTrail />
      <CustomCursor />
      <Routes>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Home lang={lang} setLang={setLang} />
          </motion.div>
        } />
        <Route path="/category/:id" element={
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <CategoryPage lang={lang} setLang={setLang} />
          </motion.div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

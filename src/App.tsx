import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { motion } from "motion/react";
import CategoryPage from './pages/CategoryPage';
import AiProjectDetailPage from './pages/AiProjectDetailPage';
import HomePageContent from './components/HomePageContent';
import { playUiSwitchSound } from './utils/uiSwitchSound';

function Home({ lang, setLang }: { lang: 'zh' | 'zt' | 'en', setLang: (l: 'zh' | 'zt' | 'en') => void }) {
  return <HomePageContent lang={lang} setLang={setLang} />;
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
        playUiSwitchSound();
      }
    };
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  return (
    <BrowserRouter>
      <CustomCursor />
      <Routes>
        <Route path="/" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Home lang={lang} setLang={setLang} />
          </motion.div>
        } />
        <Route path="/category/ai/:projectId" element={
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <AiProjectDetailPage lang={lang} setLang={setLang} />
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

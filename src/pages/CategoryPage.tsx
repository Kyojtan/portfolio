import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ArrowLeft, Bookmark, MoreHorizontal, X, Camera } from "lucide-react";
import { CATEGORY_CONTENT, TRANSLATIONS } from "../constants";
import AiProjectShowcase from "../components/AiProjectShowcase";

// Photography locations — images from /public/photography (sourced from Documents/photography)
const PHOTO_LOCATIONS = [
  {
    id: "scotland",
    title: {
      zh: "高地，苏格兰",
      zt: "高地，蘇格蘭",
      en: "Highland, Scotland"
    },
    images: [{ id: "scotland", primary: "/photography/scotland.png" }]
  },
  {
    id: "bangkok",
    title: {
      zh: "曼谷，泰国",
      zt: "曼谷，泰國",
      en: "Bangkok, Thailand"
    },
    images: [{ id: "bangkok", primary: "/photography/bangkok.png" }]
  },
  {
    id: "brussels",
    title: {
      zh: "布鲁塞尔，比利时",
      zt: "布魯塞爾，比利時",
      en: "Brussels, Belgium"
    },
    images: [{ id: "brussels", primary: "/photography/brussels.png" }]
  },
  {
    id: "hongkong",
    title: {
      zh: "香港",
      zt: "香港",
      en: "Hong Kong"
    },
    images: [{ id: "hongkong", primary: "/photography/hongkong.png" }]
  },
  {
    id: "melbourne",
    title: {
      zh: "墨尔本，澳大利亚",
      zt: "墨爾本，澳大利亞",
      en: "Melbourne, Australia"
    },
    images: [{ id: "melbourne", primary: "/photography/melbourne.png" }]
  },
  {
    id: "lisbon",
    title: {
      zh: "里斯本，葡萄牙",
      zt: "里斯本，葡萄牙",
      en: "Lisbon, Portugal"
    },
    images: [{ id: "lisbon", primary: "/photography/lisbon.png" }]
  },
  {
    id: "barcelona",
    title: {
      zh: "巴塞罗那，西班牙",
      zt: "巴塞羅那，西班牙",
      en: "Barcelona, Spain"
    },
    images: [{ id: "barcelona", primary: "/photography/barcelona.png" }]
  }
];

// Handles dual primary/fallback images along with .png -> .jpg -> .jpeg sequence check
function PhotographyImage({ 
  primarySrc, 
  fallbackSrc, 
  alt, 
  id, 
  onZoom 
}: { 
  key?: string;
  primarySrc: string; 
  fallbackSrc?: string; 
  alt: string; 
  id: string;
  onZoom: (src: string) => void;
}) {
  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  const [stage, setStage] = useState(0); // 0: primary png, 1: fallback png, 2: primary jpg, 3: fallback jpg, 4: primary jpeg, 5: fallback jpeg, 6: error
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (stage === 0) {
      if (fallbackSrc) {
        setStage(1);
        setCurrentSrc(fallbackSrc);
      } else {
        setStage(2);
        setCurrentSrc(primarySrc.replace(/\.png$/i, '.jpg'));
      }
    } else if (stage === 1) {
      setStage(2);
      setCurrentSrc(primarySrc.replace(/\.png$/i, '.jpg'));
    } else if (stage === 2) {
      if (fallbackSrc) {
        setStage(3);
        setCurrentSrc(fallbackSrc.replace(/\.png$/i, '.jpg'));
      } else {
        setStage(4);
        setCurrentSrc(primarySrc.replace(/\.png$/i, '.jpeg'));
      }
    } else if (stage === 3) {
      setStage(4);
      setCurrentSrc(primarySrc.replace(/\.png$/i, '.jpeg'));
    } else if (stage === 4) {
      if (fallbackSrc) {
        setStage(5);
        setCurrentSrc(fallbackSrc.replace(/\.png$/i, '.jpeg'));
      } else {
        setStage(6);
        setHasError(true);
      }
    } else {
      setStage(6);
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className="w-full aspect-[16/9] bg-[#FAF8F6] border border-dashed border-[#E3DFDA] rounded-2xl flex flex-col items-center justify-center text-[#9c9184] p-8 text-center transition-all duration-300">
        <Bookmark className="w-5 h-5 mb-3 stroke-[1.2] opacity-35" />
        <span className="text-[11px] font-mono tracking-widest uppercase mb-1">{id}.png</span>
        <span className="text-[11px] font-sans text-gray-400 italic">Waiting for photo upload</span>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-2xl md:rounded-3xl border border-gray-100 shadow-sm bg-[#fafafa] w-full mx-auto">
      <img
        src={currentSrc}
        alt={alt}
        className="w-full h-auto block mx-auto object-contain cursor-zoom-in transition-all duration-700 ease-out hover:scale-[1.005]"
        referrerPolicy="no-referrer"
        onError={handleError}
        onClick={() => onZoom(currentSrc)}
      />
    </div>
  );
}

export default function CategoryPage({ lang, setLang }: { lang: "zh" | "zt" | "en", setLang: (l: "zh" | "zt" | "en") => void }) {
  const { id } = useParams<{ id: string }>();
  // Use any here to handle the varied structure of different categories
  const content = (CATEGORY_CONTENT as any)[id as string];

  const [activeZoomImage, setActiveZoomImage] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveZoomImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!content) return <div>Category not found</div>;

  const data = content[lang] || content['zh'] || content['en'];
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  return (
    <div className="min-h-screen text-[#1A1A1A] font-sans overflow-x-hidden selection:bg-black selection:text-white">
      {/* Header - Refined Minimalist Style */}
      <header className="max-w-[1600px] mx-auto flex items-center justify-between px-8 md:px-12 py-8 md:py-12 border-b border-gray-100">
        <Link 
          to="/" 
          className="text-[30px] font-mono font-bold text-accent hover:opacity-80 transition-opacity cursor-none"
        >
          {lang === 'en' ? 'Xujun Tan' : (lang === 'zt' ? '譚旭君' : '谭旭君')}
        </Link>
        
        <nav className="hidden lg:flex items-center gap-10 text-[11px] font-bold tracking-[0.2em] uppercase font-mono">
          <Link 
            to="/category/ai" 
            className={`cursor-none hover:text-accent transition-colors ${id === 'ai' ? 'text-accent' : 'text-gray-400'}`}
          >
            {t.aiProjects}
          </Link>
          <Link 
            to="/category/product" 
            className={`cursor-none hover:text-accent transition-colors ${id === 'product' ? 'text-accent' : 'text-gray-400'}`}
          >
            {t.productThinking}
          </Link>
          <Link 
            to="/category/photo" 
            className={`cursor-none hover:text-accent transition-colors ${id === 'photo' ? 'text-accent' : 'text-gray-400'}`}
          >
            {t.photography}
          </Link>
          <Link 
            to="/category/about" 
            className={`cursor-none hover:text-accent transition-colors ${id === 'about' ? 'text-accent' : 'text-gray-400'}`}
          >
            {t.aboutMe}
          </Link>
        </nav>

        {/* Language Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setLang('zh')}
            className={`text-[11px] font-bold font-mono transition-colors cursor-none ${lang === 'zh' ? 'text-accent font-black' : 'text-gray-300 hover:text-gray-600'}`}
          >
            简
          </button>
          <span className="text-gray-200 text-[10px]">/</span>
          <button
            onClick={() => setLang('zt')}
            className={`text-[11px] font-bold font-mono transition-colors cursor-none ${lang === 'zt' ? 'text-accent font-black' : 'text-gray-300 hover:text-gray-600'}`}
          >
            繁
          </button>
          <span className="text-gray-200 text-[10px]">/</span>
          <button
            onClick={() => setLang('en')}
            className={`text-[11.5px] font-bold font-mono transition-colors cursor-none ${lang === 'en' ? 'text-accent font-black' : 'text-gray-300 hover:text-gray-600'}`}
          >
            EN
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-8 md:px-12 py-16 md:py-20 font-sans">
        <motion.div
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
           className="mb-16 border-l-2 border-accent pl-10"
        >
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-accent mb-2 font-mono">
            {id} / {data.title}
          </h2>
          <p className="text-[14px] text-gray-400 font-normal max-w-3xl">
            {data.subtitle}
          </p>
        </motion.div>

        {/* Conditional Layout: AI Projects Split vs Product Thinking List vs Grid */}
        {id === "ai" ? (
          <AiProjectShowcase lang={lang} />
        ) : id === "product" ? (
          <div className="flex flex-col gap-16 max-w-5xl">
            {data.items?.map((item: any, idx: number) => {
              const Wrapper = 'a';
              const extraProps = {
                href: item.link,
                target: "_blank",
                rel: "noopener noreferrer",
                className: "group flex flex-col md:flex-row gap-8 items-start cursor-none no-underline"
              };

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="group border-b border-gray-100 pb-12 last:border-0"
                >
                  <Wrapper {...(extraProps as any)}>
                    <div className="flex-1 flex flex-col items-start gap-4 text-left">
                      <div className="flex items-center gap-3 text-[10px] font-bold text-gray-400 font-mono tracking-widest uppercase">
                         {idx === 0 && (
                           <span className="flex items-center gap-1 text-black">
                              <span className="text-xs">📌</span> PINNED
                           </span>
                         )}
                         <span>PUBLISHED IN {item.publication}</span>
                         <span>·</span>
                         <span>{item.date}</span>
                      </div>
                      
                      <h3 
                        className="text-2xl font-bold tracking-tight text-gray-900 group-hover:text-black transition-colors leading-snug font-sans"
                      >
                        {item.title}
                      </h3>
                      
                      <p 
                        className="text-[14px] text-gray-500 font-sans line-clamp-2 leading-relaxed font-normal"
                      >
                        {item.subtitle}
                      </p>
                    </div>
                  </Wrapper>
                </motion.div>
              );
            })}
          </div>
        ) : id === "photo" ? (
          <div className="w-full flex flex-col items-center">
            <div className="w-full flex flex-col gap-16 md:gap-24">
              {PHOTO_LOCATIONS.map((loc, idx) => (
                <motion.div
                  key={loc.id}
                  id={loc.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="scroll-mt-28 w-full flex flex-col items-center gap-6 md:gap-8 border-b border-gray-100/50 last:border-0 pb-16 md:pb-20"
                >
                  <div className="w-full flex flex-col items-start border-l-2 border-accent pl-6">
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-800 font-sans">
                      {loc.title[lang] || loc.title['en']}
                    </h3>
                  </div>

                  <div className="flex flex-col items-center gap-12 md:gap-16 w-full">
                    {loc.images.map((img) => (
                      <PhotographyImage
                        key={img.id}
                        id={img.id}
                        primarySrc={img.primary}
                        fallbackSrc={(img as any).fallback}
                        alt={`${loc.title[lang] || loc.title['en']} Photo`}
                        onZoom={setActiveZoomImage}
                      />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Lightbox Modal */}
            <AnimatePresence>
              {activeZoomImage && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out"
                  onClick={() => setActiveZoomImage(null)}
                >
                  <button 
                    onClick={() => setActiveZoomImage(null)}
                    className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors cursor-none p-2 bg-white/5 rounded-full backdrop-blur-sm"
                  >
                    <X className="w-5 h-5 focus:outline-none" />
                  </button>
                  <motion.img 
                    initial={{ scale: 0.95 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.95 }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    src={activeZoomImage} 
                    alt="Zoomed Photo" 
                    className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className={`grid gap-x-8 gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`}>
          {data.items?.map((item: any, idx: number) => {
            const Wrapper = item.link ? 'a' : motion.div;
            const extraProps = item.link ? { 
              href: item.link, 
              target: "_blank", 
              rel: "noopener noreferrer",
              className: "group flex flex-col cursor-none no-underline"
            } : {
              className: "group flex flex-col cursor-none"
            };

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Wrapper {...(extraProps as any)}>
                  <div className="overflow-hidden relative shadow-sm border border-gray-100/50">
                    {item.src ? (
                      <img 
                        src={item.src} 
                        alt={item.title} 
                        className="w-full aspect-[4/3] object-cover grayscale group-hover:grayscale-0 transition-all duration-700 ease-in-out group-hover:scale-105"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://placehold.co/800x600?text=${item.title}`;
                        }}
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] bg-gray-50 flex items-center justify-center text-gray-300 font-mono text-[10px] text-center px-4 uppercase tracking-tighter group-hover:bg-accent/5 transition-colors">
                        {item.imagePrompt}
                      </div>
                    )}
                    {/* Thin overlay line on hover */}
                    <div className="absolute inset-0 border-[0px] group-hover:border-[12px] border-white/10 transition-all duration-300 pointer-events-none" />
                  </div>
                  
                  <div className="mt-4 text-center">
                    <h3 className="text-xs font-light tracking-[0.1em] text-gray-500 uppercase font-mono group-hover:text-black transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </Wrapper>
              </motion.div>
            );
          })}
        </div>
      )}

          {/* About Me Details */}
          {id === "about" && (
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
               className="col-span-full mt-6 flex flex-col gap-24 border-t border-gray-100 pt-12"
            >
               <div className="max-w-5xl">
                   <h4 className="text-sm font-bold tracking-[0.4em] uppercase text-accent mb-12 font-mono">Experience</h4>
                   <div className="flex flex-col gap-20">
                    {data.experience.map((exp: any, idx: number) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col group border-b border-gray-100 pb-16 text-[16px]"
                      >
                        {/* Title Row */}
                        <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-4">
                          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                            <h5 className="text-lg font-bold tracking-tight text-black font-sans">
                              {exp.role}
                            </h5>
                            <span className="hidden md:block text-gray-300 font-mono">/</span>
                            <span className="text-[14px] font-bold text-accent uppercase tracking-widest font-mono">
                              {exp.company}
                            </span>
                          </div>
                          <div className="text-[11px] font-bold tracking-[0.2em] text-gray-400 uppercase font-mono">
                            {exp.period}
                          </div>
                        </div>
                        
                        {/* Details Section */}
                        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8">
                          <ul className="space-y-6">
                            {exp.details.map((detail: string, dIdx: number) => (
                              <li key={dIdx} className="text-[14px] font-normal text-gray-700 font-sans leading-relaxed relative pl-6">
                                <span className="absolute left-0 top-0 text-accent font-bold">»</span>
                                {detail}
                              </li>
                            ))}
                          </ul>
                          
                          <div className="text-[14px] font-bold tracking-[0.2em] text-gray-300 font-mono uppercase md:text-right">
                            [ {exp.location} ]
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {data.education && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: data.experience.length * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="mt-20"
                    >
                      <h4 className="text-sm font-bold tracking-[0.3em] uppercase text-accent mb-12 font-mono">Education</h4>
                      <div className="flex flex-col gap-8">
                        {data.education.map((edu: any, idx: number) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: data.experience.length * 0.1 + idx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col md:flex-row md:items-baseline justify-between border-b border-gray-50 pb-6 group"
                          >
                            <h5 className="text-[16px] font-normal tracking-wide text-gray-800 font-sans uppercase">
                              {edu.degree}
                            </h5>
                            <span className="text-[14px] font-bold tracking-[0.2em] text-gray-400 font-mono uppercase mt-2 md:mt-0">
                              {edu.period}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {data.skills && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: (data.experience.length + (data.education?.length ?? 0)) * 0.08 + 0.1,
                        duration: 0.6,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="mt-20 grid grid-cols-1 sm:grid-cols-2 gap-16"
                    >
                      <div>
                        <h4 className="text-sm font-bold tracking-[0.2em] uppercase text-accent mb-8 font-mono">Tools</h4>
                        <div className="flex flex-wrap gap-4">
                          {data.skills.tools.map((tool: string, idx: number) => (
                            <span key={idx} className="text-[14px] font-mono border border-gray-200 px-3 py-1.5 rounded-sm text-gray-500 hover:border-accent hover:text-accent transition-colors">
                              {tool}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold tracking-[0.2em] uppercase text-accent mb-8 font-mono">Languages</h4>
                        <div className="flex flex-col gap-4">
                          {data.skills.languages.map((lang: string, idx: number) => (
                            <span key={idx} className="text-[14px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-3">
                              <span className="w-1.5 h-1.5 bg-accent/30 rounded-full" />
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
               </div>
            </motion.div>
          )}
      </main>

      {/* Styled Footer Navigation */}
      <footer className="max-w-[1600px] mx-auto px-12 py-12 flex items-center justify-center gap-8 text-gray-400">
        <button onClick={() => window.history.back()} className="hover:text-black transition-colors cursor-none">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <Link to="/" className="hover:text-black transition-colors cursor-none">
           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </Link>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-black transition-colors cursor-none">
           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
        </button>
      </footer>
    </div>
  );
}

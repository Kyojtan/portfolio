import { useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { CATEGORY_CONTENT, TRANSLATIONS } from "../constants";
import AiProjectShowcase from "../components/AiProjectShowcase";
import ProductThinkingListOverlay from "../components/ProductThinkingListOverlay";
import PhotographyBookOverlay from "../components/PhotographyBookOverlay";
import DigitalCloneEntry from "../components/DigitalCloneEntry";
import HomePageContent from "../components/HomePageContent";

export default function CategoryPage({ lang, setLang }: { lang: "zh" | "zt" | "en", setLang: (l: "zh" | "zt" | "en") => void }) {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  // Use any here to handle the varied structure of different categories
  const content = (CATEGORY_CONTENT as any)[id as string];

  const fromAboutDetails = id === "about" && searchParams.get("from") === "details";

  const [aiCoverFlowActive, setAiCoverFlowActive] = useState(true);
  const [productListActive, setProductListActive] = useState(true);
  const [photoBookActive, setPhotoBookActive] = useState(true);

  const hideAiChrome = id === "ai" && aiCoverFlowActive;
  const hideProductChrome = id === "product" && productListActive;
  const hidePhotoChrome = id === "photo" && photoBookActive;
  const hideCategoryChrome = hideAiChrome || hideProductChrome || hidePhotoChrome;

  if (!content) return <div>Category not found</div>;

  const data = content[lang] || content['zh'] || content['en'];
  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  return (
    <div className="min-h-screen text-[#1A1A1A] font-sans overflow-x-hidden selection:bg-black selection:text-white">
      {hideCategoryChrome && (
        <div className="fixed inset-0 z-[85] pointer-events-none" aria-hidden>
          <HomePageContent lang={lang} setLang={setLang} />
        </div>
      )}

      {!hideCategoryChrome && (
      <header className={`max-w-[1600px] mx-auto flex items-center px-8 md:px-12 py-8 md:py-12 border-b border-gray-100 ${fromAboutDetails ? "justify-between" : "justify-between"}`}>
        <Link 
          to="/" 
          className="text-[30px] font-mono font-bold text-accent hover:opacity-80 transition-opacity cursor-none shrink-0"
        >
          {lang === 'en' ? 'Xujun Tan' : (lang === 'zt' ? '譚旭君' : '谭旭君')}
        </Link>
        
        {!fromAboutDetails && (
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
        )}

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
      )}

      <main className={`max-w-[1400px] mx-auto font-sans ${hideCategoryChrome ? "p-0" : "px-8 md:px-12 py-16 md:py-20"}`}>
        {!hideCategoryChrome && !fromAboutDetails && (
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
          {id === "about" && <DigitalCloneEntry lang={lang} />}
        </motion.div>
        )}

        {/* Conditional Layout: AI Projects Split vs Product Thinking List vs Grid */}
        {id === "ai" ? (
          <AiProjectShowcase lang={lang} onCoverFlowActiveChange={setAiCoverFlowActive} />
        ) : id === "product" ? (
          <ProductThinkingListOverlay
            articles={data.items ?? []}
            lang={lang}
            onActiveChange={setProductListActive}
          />
        ) : id === "photo" ? (
          <PhotographyBookOverlay lang={lang} onActiveChange={setPhotoBookActive} />
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
               className={`col-span-full flex flex-col gap-24 ${
                 fromAboutDetails ? "" : "mt-10 border-t border-gray-100 pt-12"
               }`}
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
                      <div className="flex flex-col gap-6">
                        {data.education.map((edu: any, idx: number) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: data.experience.length * 0.1 + idx * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            className="flex flex-col md:flex-row md:items-baseline justify-between group"
                          >
                            <h5 className="text-[14px] font-normal text-gray-700 font-sans leading-relaxed">
                              {edu.degree}
                            </h5>
                            <span className="text-[11px] font-bold tracking-[0.2em] text-gray-400 font-mono uppercase mt-2 md:mt-0 shrink-0">
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

      {/* Styled Footer Navigation — hidden on AI / Product overlays */}
      {!hideCategoryChrome && (
      <footer className="max-w-[1600px] mx-auto px-12 py-12 flex items-center justify-center gap-8 text-gray-400">
        {!fromAboutDetails && (
        <button onClick={() => window.history.back()} className="hover:text-black transition-colors cursor-none">
          <ArrowLeft className="w-4 h-4" />
        </button>
        )}
        <Link to="/" className="hover:text-black transition-colors cursor-none">
           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
        </Link>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-black transition-colors cursor-none">
           <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
        </button>
      </footer>
      )}
    </div>
  );
}

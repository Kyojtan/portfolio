import { useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Play, Pause, Volume2, VolumeX, RefreshCw,
  MapPin, Database, Network, Music, HelpCircle,
  Sliders, ArrowLeft, ChevronLeft, ChevronRight, Send, CheckCircle, FileText, Smartphone, Laptop
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { AI_PROJECTS, DEMO_VIDEOS } from "../data/aiProjects";

interface AiProjectDetailViewProps {
  projectId: string;
  lang: "zh" | "zt" | "en";
}

function ProjectDemoVideo({ src }: { src: string }) {
  return (
    <div className="w-full relative aspect-[16/10] bg-black rounded-xl overflow-hidden shadow-2xl border border-black/80">
      <video
        className="absolute inset-0 w-full h-full object-contain"
        src={src}
        autoPlay
        loop
        muted
        playsInline
        controls
      />
    </div>
  );
}

function EtherealBubbleText({ text }: { text: string }) {
  const tokens = useMemo(() => {
    const list: { type: "word" | "cjk" | "space" | "newline"; text: string; globalIndex: number }[] = [];
    let currentWord = "";
    let globalCharCount = 0;

    const pushWord = () => {
      if (currentWord) {
        list.push({
          type: "word",
          text: currentWord,
          globalIndex: globalCharCount
        });
        globalCharCount += currentWord.length;
        currentWord = "";
      }
    };

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const code = char.charCodeAt(0);
      const isCJK = (code >= 0x4e00 && code <= 0x9fff) || (code >= 0x3400 && code <= 0x4dbf) || (code >= 0xf900 && code <= 0xfaff);
      
      if (isCJK) {
        pushWord();
        list.push({
          type: "cjk",
          text: char,
          globalIndex: globalCharCount
        });
        globalCharCount += 1;
      } else if (char === " ") {
        pushWord();
        list.push({
          type: "space",
          text: " ",
          globalIndex: globalCharCount
        });
        globalCharCount += 1;
      } else if (char === "\n") {
        pushWord();
        list.push({
          type: "newline",
          text: "\n",
          globalIndex: globalCharCount
        });
        globalCharCount += 1;
      } else {
        currentWord += char;
      }
    }
    pushWord();
    return list;
  }, [text]);

  return (
    <>
      {tokens.map((token, tIdx) => {
        if (token.type === "newline") {
          return <br key={tIdx} />;
        }
        if (token.type === "space") {
          return <span key={tIdx} dangerouslySetInnerHTML={{ __html: "&nbsp;" }} />;
        }
        
        if (token.type === "cjk") {
          const delay = token.globalIndex * 0.008;
          return (
            <span
              key={tIdx}
              className="char"
              style={{ animationDelay: `${delay}s` }}
            >
              {token.text}
            </span>
          );
        }

        // word token
        const chars = token.text.split('');
        return (
          <span key={tIdx} className="inline-block" style={{ whiteSpace: "nowrap" }}>
            {chars.map((char, charIdx) => {
              const delay = (token.globalIndex + charIdx) * 0.008;
              return (
                <span
                  key={charIdx}
                  className="char"
                  style={{ animationDelay: `${delay}s` }}
                >
                  {char}
                </span>
              );
            })}
          </span>
        );
      })}
    </>
  );
}

export default function AiProjectDetailView({ projectId, lang }: AiProjectDetailViewProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"demo" | "live" | "none">("demo");

  // Chat typing simulator state
  const [visibleCount, setVisibleCount] = useState(0);

  const activeProj = useMemo(() => {
    return AI_PROJECTS.find(p => p.id === projectId) || null;
  }, [projectId]);

  const currentLangDialogue = useMemo(() => {
    if (!activeProj) return [];
    return activeProj.dialogue[lang] || activeProj.dialogue.zh || activeProj.dialogue.en;
  }, [activeProj, lang]);

  const renderedMessages = useMemo(() => {
    return currentLangDialogue.slice(0, visibleCount);
  }, [currentLangDialogue, visibleCount]);

  const activeProjIndex = useMemo(
    () => AI_PROJECTS.findIndex((p) => p.id === projectId),
    [projectId]
  );

  const goToProject = useCallback((index: number) => {
    const proj = AI_PROJECTS[index];
    if (proj) navigate(`/category/ai/${proj.id}`);
  }, [navigate]);

  const goPrevProject = useCallback(() => {
    if (activeProjIndex < 0) return;
    goToProject((activeProjIndex - 1 + AI_PROJECTS.length) % AI_PROJECTS.length);
  }, [activeProjIndex, goToProject]);

  const goNextProject = useCallback(() => {
    if (activeProjIndex < 0) return;
    goToProject((activeProjIndex + 1) % AI_PROJECTS.length);
  }, [activeProjIndex, goToProject]);

  const backToList = useCallback(() => {
    navigate("/category/ai");
  }, [navigate]);

  useEffect(() => {
    if (!projectId) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrevProject();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goNextProject();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [projectId, goPrevProject, goNextProject]);

  // Restart chat simulation when project or language changes
  useEffect(() => {
    setVisibleCount(0);
  }, [projectId, lang]);

  useEffect(() => {
    if (projectId && visibleCount < currentLangDialogue.length) {
      const isFirst = visibleCount === 0;
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, isFirst ? 50 : 800);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, projectId, currentLangDialogue]);

  // Handle Tab Switch default based on what is available
  useEffect(() => {
    if (projectId) {
      setActiveTab("demo");
    }
  }, [projectId]);

  // Slider controls states for Interactive Sandbox Modules
  // 1. Retro
  const [retroSpeed, setRetroSpeed] = useState(95);
  const [retroNoise, setRetroNoise] = useState(58);
  const [retroWobble, setRetroWobble] = useState(72);
  const [retroSatur, setRetroSatur] = useState(84);
  const [retroOn, setRetroOn] = useState(true);

  // 2. Mix Studio Synthesizer State
  const [mixRain, setMixRain] = useState(65);
  const [mixLofi, setMixLofi] = useState(80);
  const [mixRainLevel, setMixRainLevel] = useState<"drizzle" | "shower" | "thunder">("shower");
  const [mixTrackIdx, setMixTrackIdx] = useState(0);
  const [mixPlaying, setMixPlaying] = useState(true);

  const lofiTracks = [
    { title: "Nostalgic Rain Drops", duration: "180s", bpm: "76" },
    { title: "Slowing Coffee Aromas", duration: "240s", bpm: "68" },
    { title: "Midnight Solitude Study", duration: "210s", bpm: "72" }
  ];

  // 3. Fetch Location Mock iPhone Playback
  const [fetchStep, setFetchStep] = useState(1);
  const fetchPresets = [
    {
      id: "may67",
      title: "May67 coffee ☕️",
      note: "老城区咖啡厅的出品永远是顶级 ☕️...\n藏在海珠旧社区里的咖啡厅...\n在纺织路附近，就在珠江边上...\n极具质感的May67...",
      location: "May67 coffee",
      address: "广州市海珠区纺织路2号",
      reasoning: "关键字“海珠旧社区”、“纺织路”、“滨江边”。经地理大模型深度融合比对店名及地标，锚定‘May67 coffee’精准坐标。"
    },
    {
      id: "toohigh",
      title: "信德信瑞丽酒店 TOO High 酒吧 🍷",
      note: "你可以永远相信信德瑞丽酒店的出品 🍷...\n赤醉 brick lane 没位，去了楼上的高空酒吧...\nToo High 高级酒吧...",
      location: "TOO High 酒吧",
      address: "广州市信德瑞丽酒店天台高空酒吧",
      reasoning: "提取到“信德瑞丽酒店”、“楼上高空”。匹配商业网格数据，快速计算出该地天台TOO High酒吧，解析度100%。"
    }
  ];
  const [selectedFetchPreset, setSelectedFetchPreset] = useState(fetchPresets[0]);

  // 4. RAG Chatbot Emulator
  const [ragQuery, setRagQuery] = useState("");
  const [ragStatus, setRagStatus] = useState<"idle" | "searching" | "synthesizing" | "done">("idle");
  const [ragAnswer, setRagAnswer] = useState<any>(null);

  const ragQuestions = [
    {
      q: "What is the key impact of lease capitalization on interest coverage ratios?",
      retrieved: [
        { doc: "CFA Curriculum Vol 3, Reading 15, Sec 3.2", chunk: "Lease capitalization raises debt liabilities on balance sheet and records asset values. Depreciation is recognized alongside interest expenses, decreasing overall reported EBIT margins.", score: 0.94 },
        { doc: "Schweser Notes Vol 1, Page 142", chunk: "Interest Coverage Ratio (EBIT / Interest Expense) typically drops because of added Lease interest structures.", score: 0.88 }
      ],
      synthesis: "Lease capitalization results in reclassifying operating expenses as interest and depreciation. Thus, reported Interest Coverage (EBIT / Interest) decreases, because the incremental interest expense in the denominator surpasses any marginal growth in EBIT."
    },
    {
      q: "Explain DuPont Analysis structure differences between 3-step and 5-step models.",
      retrieved: [
        { doc: "CFA Curriculum Reading 18, Sec 4.2", chunk: "The 3-step DuPont represents ROE = Profit Margin x Asset Turnover x Leverage Ratio. Formulating basic profit components.", score: 0.95 },
        { doc: "Schweser Notes Vol 2, Page 88", chunk: "The 5-step decomposes profit margin to tax burden, interest burden, EBIT margin. ROE = Tax Burden x Interest Burden x EBIT Margin x Asset Turn x Leverage.", score: 0.91 }
      ],
      synthesis: "The 5-step model isolates tax impacts and financial leverage costs independently. This lets analysts separate underlying operational profitability (EBIT Margin) from tax-planning strategies and debt-burden financing burdens."
    }
  ];

  const triggerRag = (pre: any) => {
    setRagQuery(pre.q);
    setRagStatus("searching");
    setTimeout(() => {
      setRagStatus("synthesizing");
      setTimeout(() => {
        setRagStatus("done");
        setRagAnswer(pre);
      }, 1000);
    }, 1000);
  };

  // 5. Wander Astromap dynamic Canvas simulation
  const [wanderSelectedStar, setWanderSelectedStar] = useState<any>(null);
  const wanderStars = [
    { id: "vhs", name: "VHS Filters Analog", desc: "复古颗粒与网格折射叠加，提升暖调质感与人文体验。", depth: "Connection: HIGH", score: "0.95 Affinity" },
    { id: "rag", name: "RAG Semantic Model", desc: "分块算法语义保留机制，确保复杂公式符号在向量数据库中解析不失真。", depth: "Connection: STRONG", score: "0.89 Affinity" },
    { id: "sound", name: "Binaural Noise Rain", desc: "环境气候发生器。雨量、雷击颗粒控制，通过 WebAudio 形成低压物理底噪。", depth: "Connection: MEDIUM", score: "0.82 Affinity" },
    { id: "maps", name: "Locational Intelligence", desc: "地理特工指令。智能搜索及IP聚类，手机两下背击瞬间直达地图坐标。", depth: "Connection: STRONG", score: "0.91 Affinity" }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [projectId]);

  return (
    <motion.div
      key={projectId}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="ai-detail-page min-h-screen flex flex-col text-[#1A1A1A] relative"
    >
              <button
                type="button"
                onClick={goPrevProject}
                className="ai-nav-arrow ai-nav-arrow--side fixed left-4 md:left-8 top-1/2 -translate-y-1/2 z-30"
                aria-label={lang === "en" ? "Previous project" : "上一个作品"}
              >
                <ChevronLeft />
              </button>
              <button
                type="button"
                onClick={goNextProject}
                className="ai-nav-arrow ai-nav-arrow--side fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-30"
                aria-label={lang === "en" ? "Next project" : "下一个作品"}
              >
                <ChevronRight />
              </button>

              <div className="shrink-0 px-8 md:px-12 pt-12 md:pt-16 w-full">
                <button
                  type="button"
                  onClick={backToList}
                  className="group inline-flex items-center gap-2 text-[13px] font-medium text-zinc-500 hover:text-zinc-800 transition-colors cursor-none"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
                  {lang === "en" ? "Back to list" : lang === "zt" ? "返回列表" : "返回列表"}
                </button>
              </div>

              <div className="flex-1 min-h-0 overflow-y-auto px-8 md:px-16 lg:px-24 pt-4 pb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start max-w-7xl mx-auto w-full">
              
              {/* Left Column — dialogue */}
              <div className="lg:col-span-4 flex flex-col bg-gray-50/[0.3] rounded-2xl border border-gray-100 p-6 md:p-8 relative overflow-hidden min-h-[420px]">
                {/* Micro Ambient Grid Noise */}
                <div className="absolute inset-0 bg-[radial-gradient(#e1f0ff_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
                
                <div className="border-b border-gray-100 pb-4 mb-6 z-10">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-[#1A1A1A] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent animate-spin-slow" />
                    {lang === "en" ? "PROJECT INSPIRATION" : "项目灵感"}
                  </span>
                </div>

                {/* Messages view */}
                <div className="flex-1 flex flex-col gap-6 overflow-y-auto max-h-[500px] pt-8 pb-4 pr-2 z-10 dialogue-container">
                  <style>{`
                    .dialogue-container {
                      --apple-gray: rgba(245, 245, 247, 0.60);  
                      --apple-blue: rgba(0, 122, 255, 0.12);   
                      --text-main: rgba(60, 60, 67, 0.85);
                      --text-blue: rgba(0, 86, 179, 0.85);
                    }
                    
                    .ethereal-bubble {
                      position: relative;
                      padding: 13px 20px;
                      font-size: 13.5px;
                      font-weight: 450;
                      letter-spacing: 0.05em; 
                      line-height: 1.6;
                      border-radius: 24px;
                      transition: all 0.8s cubic-bezier(0.23, 1, 0.32, 1);
                      backdrop-filter: blur(50px) saturate(160%);
                      -webkit-backdrop-filter: blur(50px) saturate(160%);
                      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02), inset 0 0 0 1px rgba(255, 255, 255, 0.4); 
                      max-width: 82%;
                      animation: gentleFloat 8s ease-in-out infinite;
                    }

                    .ethereal-bubble:hover {
                      transform: scale(1.03) translateY(-3px) !important;
                      box-shadow: 0 20px 50px rgba(0, 80, 255, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.8);
                    }

                    @keyframes gentleFloat { 
                      0%, 100% { transform: translateY(0px); } 
                      50% { transform: translateY(-5px); } 
                    }

                    .msg-row-ai { justify-content: flex-start; }
                    .msg-row-user { justify-content: flex-end; }

                    .bubble-ai { 
                      background: var(--apple-gray) !important; 
                      color: var(--text-main) !important; 
                      border-bottom-left-radius: 6px !important; 
                    }
                    
                    .bubble-user { 
                      background: var(--apple-blue) !important; 
                      color: var(--text-blue) !important; 
                      border-bottom-right-radius: 6px !important; 
                      animation-delay: 2s; 
                    }

                    .char { 
                      display: inline-block; 
                      opacity: 0; 
                      filter: blur(8px); 
                      transform: translateY(1px); 
                      animation: mistReveal 0.2s ease-out forwards; 
                    }
                    
                    @keyframes mistReveal { 
                      to { 
                        opacity: 1; 
                        filter: blur(0px); 
                        transform: translateY(0px); 
                      } 
                    }
                  `}</style>
                  <AnimatePresence initial={false}>
                    {renderedMessages.map((msg, mIdx) => {
                       const isUser = msg.role === "user";
                       return (
                         <motion.div
                           key={`${projectId}-${lang}-${mIdx}`}
                           initial={{ opacity: 0, y: 12, scale: 0.98 }}
                           animate={{ opacity: 1, y: 0, scale: 1 }}
                           transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                           className={`flex flex-col ${isUser ? "items-end" : "items-start"} w-full`}
                         >
                           <span 
                             className={`text-[9px] font-mono tracking-widest font-bold uppercase mb-1 px-2.5 opacity-60 ${
                               isUser ? "text-[#007AFF]" : "text-gray-400"
                             }`}
                           >
                             {isUser
                               ? lang === "en"
                                 ? "Xujun"
                                 : "🗨️ 我"
                               : lang === "en"
                                 ? "Digital Twin"
                                 : lang === "zt"
                                   ? "數位分身"
                                   : "数字分身"}
                           </span>
                           
                           <div
                             className={`ethereal-bubble ${
                               isUser ? "bubble-user" : "bubble-ai"
                             }`}
                           >
                             <EtherealBubbleText text={msg.text} />
                           </div>
                         </motion.div>
                       );
                     })}
                  </AnimatePresence>

                  {visibleCount < currentLangDialogue.length && (
                    <div className="flex justify-start pt-1">
                      <div className="bg-white/80 px-4 py-2.5 rounded-2xl flex items-center gap-1 shadow-xs border border-gray-100/40">
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: 3/5 portion - Interactive Demo Video & Application Playgrounds */}
              <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden min-h-[480px] shadow-xs">
                {/* Toolbar */}
                <div className="flex justify-between items-center bg-gray-50/70 border-b border-gray-100 px-6 py-4">
                  <span className="text-xs font-bold font-mono tracking-tight text-gray-600 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeProj?.color }} />
                    {lang === "en" ? "DEMO PLAYBACK" : "演示视频"}
                  </span>
                </div>

                {/* Dynamic Workspace based on Active Project */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-center relative bg-[#FCFCFD]">

                  {/* TAB 1: 演示视频 (demo) */}
                  {activeTab === "demo" && (
                    <div className="w-full flex flex-col justify-center items-center">
                      {projectId === "retro" ? (
                        <ProjectDemoVideo src={DEMO_VIDEOS.retro} />
                      ) : projectId === "mix" ? (
                        <ProjectDemoVideo src={DEMO_VIDEOS.mix} />
                      ) : projectId === "fetch" ? (
                        <ProjectDemoVideo src={DEMO_VIDEOS.fetch} />
                      ) : projectId === "rag" ? (
                        /* RAG AI chatbot PDF extraction pipeline display diagram */
                        <div className="w-full flex flex-col gap-4 text-center">
                          <div className="bg-gray-50 border p-6 rounded-xl flex flex-col gap-3 font-mono">
                            <h5 className="text-xs font-bold text-gray-600 flex items-center justify-center gap-1.5">
                              <Database className="w-3.5 h-3.5 text-[#32D74B]" />
                              CFA RAG EXTRACTION STREAM
                            </h5>

                            <p className="text-[11px] text-gray-400 px-6 font-sans leading-relaxed">
                              Through comparative tests determine optimal chunk sizes, improving contextual semantics. Avoid forcing parser mappings on formulas to avoid data losses.
                            </p>

                            <div className="grid grid-cols-3 gap-3 text-[10px] text-left mt-2">
                              <div className="bg-white border rounded p-2.5 flex flex-col gap-1.5">
                                <span className="text-[8px] text-accent font-bold uppercase">Phase 1</span>
                                <span className="font-bold">PDF CHUNK</span>
                                <p className="text-[9px] text-gray-400">Fixed overlap buffer sizes avoiding sentence cuts.</p>
                              </div>

                              <div className="bg-white border rounded p-2.5 flex flex-col gap-1.5">
                                <span className="text-[8px] text-[#32D74B] font-bold uppercase">Phase 2</span>
                                <span className="font-bold">EMBEDDINGS</span>
                                <p className="text-[9px] text-gray-400">Mathematical symbol representations in vector lists.</p>
                              </div>

                              <div className="bg-white border rounded p-2.5 flex flex-col gap-1.5">
                                <span className="text-[8px] text-purple-400 font-bold uppercase">Phase 3</span>
                                <span className="font-bold">RETRIEVAL</span>
                                <p className="text-[9px] text-gray-400">Anchor points connecting directly to textbook footnotes.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : projectId === "wander" ? (
                        <ProjectDemoVideo src={DEMO_VIDEOS.wander} />
                      ) : null}
                    </div>
                  )}

                  {/* TAB 2: 应用场景 (live) */}
                  {activeTab === "live" && (
                    <div className="w-full h-full flex flex-col gap-6">
                      
                      {projectId === "retro" ? (
                        /* Retro Player Interactive Sandbox Workspace */
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col gap-1 text-left">
                            <span className="text-[10px] text-accent tracking-widest font-mono uppercase">INTERACTIVE CUSTOMIZER</span>
                            <h4 className="text-sm font-bold text-gray-900.5">VHS Overlay Settings</h4>
                          </div>

                          <div className="bg-white border p-4.5 rounded-xl flex flex-col gap-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="flex flex-col gap-1 w-full text-left">
                                <label className="text-[9px] font-bold tracking-wider font-mono text-gray-400">
                                  CHROMATIC FILTER TINT (折射)
                                </label>
                                <input 
                                  type="range" 
                                  className="w-full accent-black h-1 bg-gray-100 rounded appearance-none cursor-none" 
                                  value={retroSatur} 
                                  onChange={(e) => setRetroSatur(Number(e.target.value))} 
                                />
                              </div>

                              <div className="flex flex-col gap-1 w-full text-left">
                                <label className="text-[9px] font-bold tracking-wider font-mono text-gray-400">
                                  TAPE NOISE FLOOR (磁带底噪)
                                </label>
                                <input 
                                  type="range" 
                                  className="w-full accent-black h-1 bg-gray-100 rounded appearance-none cursor-none" 
                                  value={retroNoise} 
                                  onChange={(e) => setRetroNoise(Number(e.target.value))} 
                                />
                              </div>
                            </div>

                            <div className="p-3 bg-gray-50 rounded-lg text-left text-[11px] font-mono leading-relaxed text-gray-500">
                              <span className="font-bold text-gray-800 uppercase block mb-1">🔧 Extension Injected Outputs:</span>
                              &gt; Intercepting active YouTube audio streams... inject tape flutter (flutterFreq: 4.8Hz). Applying CSS mix-blend-mode parameters.
                            </div>
                          </div>
                        </div>
                      ) : projectId === "mix" ? (
                        /* AI Mix Studio Interactive Synthesizer Workspace with sliders */
                        <div className="flex flex-col gap-4 text-left">
                          <div className="flex justify-between items-center bg-purple-50 p-4 border border-purple-100 rounded-xl">
                            <div className="flex items-center gap-3">
                              <Play className="w-4 h-4 text-[#BF5AF2] fill-[#BF5AF2]" />
                              <div>
                                <h6 className="text-[11px] font-mono leading-none font-bold text-[#BF5AF2]">LOFI SYNTH WEATHER STATION</h6>
                                <p className="text-[10px] text-gray-500 font-mono mt-1">Status: Seamless Blending Active</p>
                              </div>
                            </div>
                            
                            {/* Weather Catalyst trigger controls */}
                            <div className="flex gap-1">
                              {["drizzle", "shower", "thunder"].map((lvl) => (
                                <button
                                  key={lvl}
                                  onClick={() => setMixRainLevel(lvl as any)}
                                  className={`px-2 py-1 text-[8px] font-mono font-bold uppercase rounded-sm cursor-none transition-all ${
                                    mixRainLevel === lvl ? "bg-[#BF5AF2] text-white" : "bg-white border text-gray-400"
                                  }`}
                                >
                                  {lvl}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1 text-left">
                              <label className="text-[9px] font-bold tracking-wider font-mono text-gray-400 uppercase">
                                Rain Sound Volume (雨量大小)
                              </label>
                              <input 
                                type="range" 
                                className="w-full accent-black h-1 bg-gray-100 rounded appearance-none cursor-none" 
                                value={mixRain} 
                                onChange={(e) => setMixRain(Number(e.target.value))} 
                              />
                            </div>

                            <div className="flex flex-col gap-1 text-left">
                              <label className="text-[9px] font-bold tracking-wider font-mono text-gray-400 uppercase">
                                Lofi music output (音乐底噪)
                              </label>
                              <input 
                                type="range" 
                                className="w-full accent-black h-1 bg-gray-100 rounded appearance-none cursor-none" 
                                value={mixLofi} 
                                onChange={(e) => setMixLofi(Number(e.target.value))} 
                              />
                            </div>
                          </div>

                          <p className="text-[10px] text-gray-400 text-center font-mono italic">
                            Synthesizer mixes rain intensity with ambient low frequencies seamlessly.
                          </p>
                        </div>
                      ) : projectId === "fetch" ? (
                        /* Fetch Location NLP Sandbox: User clicks note, system returns resolve maps info */
                        <div className="flex flex-col gap-4 text-left">
                          <span className="text-[9px] font-bold font-mono text-gray-400 tracking-widest uppercase">Select Sample Note to Geolocate</span>
                          
                          <div className="grid grid-cols-2 gap-3.5">
                            {fetchPresets.map((pre) => (
                              <button
                                key={pre.id}
                                onClick={() => setSelectedFetchPreset(pre)}
                                className={`p-3.5 rounded-xl border text-left cursor-none transition-all flex flex-col gap-1.5 ${
                                  selectedFetchPreset.id === pre.id 
                                    ? "bg-[#30B0C7]/5 border-[#30B0C7] shadow-xs" 
                                    : "bg-white hover:bg-gray-50"
                                }`}
                              >
                                <span className="text-xs font-bold font-mono text-black">{pre.title}</span>
                                <p className="text-[10px] text-gray-400 line-clamp-2 leading-relaxed whitespace-pre-line">{pre.note}</p>
                              </button>
                            ))}
                          </div>

                          {/* DeepSeek parsed response layout */}
                          <div className="p-4 bg-gray-50 rounded-xl border flex flex-col gap-2 font-mono">
                            <div className="flex justify-between items-center text-[9px] text-gray-400 pb-1.5 border-b">
                              <span>DEEPSEEK AI GEOGRAPHICAL COGNIZANCE</span>
                              <span className="text-[#30B0C7] font-bold">CONFIDENCE: 98%</span>
                            </div>

                            <div className="text-[10px] text-gray-600 flex flex-col gap-1.5 leading-relaxed pt-1.5">
                              <p>📌 <b>Store Location:</b> {selectedFetchPreset.location}</p>
                              <p>🗺️ <b>Resolved Address:</b> {selectedFetchPreset.address}</p>
                              <p className="text-gray-400 leading-normal font-sans italic"><b>Reasoning Analysis:</b> {selectedFetchPreset.reasoning}</p>
                            </div>
                          </div>
                        </div>
                      ) : projectId === "rag" ? (
                        /* RAG Interactive Q&A. select preset query, watch retrieval logs, read answer with footnotes */
                        <div className="flex flex-col gap-4 text-left">
                          <span className="text-[9px] font-bold font-mono text-gray-400 tracking-widest uppercase">Click Study Question to Query RAG bot</span>
                          
                          <div className="flex flex-col gap-2">
                            {ragQuestions.map((qObj, index) => (
                              <button
                                key={index}
                                onClick={() => triggerRag(qObj)}
                                className="px-4 py-3 border rounded-xl text-left bg-white hover:bg-gray-50 cursor-none transition-colors text-xs font-bold flex items-center gap-2"
                              >
                                <HelpCircle className="w-4 h-4 text-[#32D74B]" />
                                {qObj.q}
                              </button>
                            ))}
                          </div>

                          <AnimatePresence mode="wait">
                            {ragStatus !== "idle" && (
                              <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="p-4 bg-gray-50 border rounded-xl font-mono text-[10px]"
                              >
                                {ragStatus === "searching" && (
                                  <div className="flex items-center gap-2.5 text-gray-400 py-4 justify-center">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                                    Scanning high-dimensional vector index for semantic matches...
                                  </div>
                                )}

                                {ragStatus === "synthesizing" && (
                                  <div className="flex items-center gap-2.5 text-gray-400 py-4 justify-center">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
                                    Parsing contexts & formulating structured answer with DeepSeek-V3...
                                  </div>
                                )}

                                {ragStatus === "done" && ragAnswer && (
                                  <div className="flex flex-col gap-3 font-mono">
                                    <div className="border-b pb-2">
                                      <span className="text-[9px] text-gray-400 font-bold uppercase uppercase">Retrieved semantic evidence chunks:</span>
                                      <div className="flex flex-col gap-2 mt-2">
                                        {ragAnswer.retrieved.map((ret: any, rIdx: number) => (
                                          <div key={rIdx} className="bg-white border rounded p-2.5 leading-relaxed">
                                            <div className="flex justify-between font-bold text-[#32D74B] text-[8px] mb-1">
                                              <span>{ret.doc}</span>
                                              <span>SIMILARITY: {Math.floor(ret.score * 100)}%</span>
                                            </div>
                                            <p className="text-gray-500 leading-normal font-sans text-[9px]">{ret.chunk}</p>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div>
                                      <span className="text-[9px] text-gray-400 font-bold uppercase block mb-1">Synthesized RAG Response:</span>
                                      <p className="bg-white p-3 border rounded-lg text-gray-800 font-sans leading-relaxed text-xs">
                                        {ragAnswer.synthesis}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ) : (
                        /* Wander 知识星图 Starry force interactive chart */
                        <div className="flex flex-col gap-4 text-left">
                          <span className="text-[9px] font-bold font-mono text-gray-400 tracking-widest uppercase">Click Solar Star to Expand Mind Fragment</span>
                          
                          <div className="grid grid-cols-2 gap-3.5">
                            {wanderStars.map((star) => (
                              <button
                                key={star.id}
                                onClick={() => setWanderSelectedStar(star)}
                                className={`p-4 rounded-xl border text-left cursor-none transition-all flex flex-col justify-between h-28 ${
                                  wanderSelectedStar?.id === star.id 
                                    ? "bg-yellow-500/[0.04] border-yellow-400 shadow-sm" 
                                    : "bg-white hover:bg-gray-50"
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <span className="text-xs font-bold text-black">{star.name}</span>
                                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-black/5 text-yellow-600 font-bold uppercase tracking-tight">{star.score}</span>
                                </div>
                                <span className="text-[9px] text-gray-400 tracking-wide font-mono mt-auto">{star.depth} &gt;</span>
                              </button>
                            ))}
                          </div>

                          <AnimatePresence mode="wait">
                            {wanderSelectedStar && (
                              <motion.div
                                key={wanderSelectedStar.id}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="bg-gray-50 p-4 rounded-xl border font-mono text-xs flex flex-col gap-2"
                              >
                                <div className="flex justify-between border-b pb-1.5 items-center">
                                  <span className="font-bold text-black text-[11px] uppercase tracking-wide">💡 {wanderSelectedStar.name}</span>
                                  <span className="text-[9px] font-bold text-gray-400">{wanderSelectedStar.score}</span>
                                </div>
                                <p className="text-gray-500 leading-relaxed font-sans mt-1 text-[11px]">{wanderSelectedStar.desc}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}

                    </div>
                  )}

                </div>
              </div>

            </div>
              </div>

              <footer className="shrink-0 px-8 md:px-12 py-12 flex items-center justify-center text-gray-400">
                <Link to="/" className="hover:text-black transition-colors cursor-none" aria-label={lang === "en" ? "Home" : "主页"}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                </Link>
              </footer>
    </motion.div>
  );
}

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Trash2, 
  HelpCircle, 
  CheckCircle,
  MessageSquare,
  Info
} from "lucide-react";
import { CosmicNode, ChatMessage } from "./types";
import { INITIAL_TOPICS_DATA } from "./data";
import { ConstellationGraph } from "./components/ConstellationGraph";
import { EN_TRANSLATIONS, UI_TEXTS } from "./translations";

export default function App() {
  // Nodes state loaded from LocalStorage or fallback to default dataset
  const [nodes, setNodes] = useState<CosmicNode[]>(() => {
    const saved = localStorage.getItem("wander_nodes");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn("Failed to parse saved nodes from localStorage, resetting", e);
      }
    }
    return INITIAL_TOPICS_DATA;
  });

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null);
  const [lang, setLang] = useState<'cn' | 'en'>('cn');

  // Map original selectedNode fields dynamically to EN/CN translation equivalents
  const rawSelectedNode = selectedId ? nodes.find(n => n.id === selectedId) : null;
  const selectedNode = React.useMemo(() => {
    if (!rawSelectedNode) return null;
    if (lang === "en" && EN_TRANSLATIONS[rawSelectedNode.id]) {
      const translation = EN_TRANSLATIONS[rawSelectedNode.id];
      return {
        ...rawSelectedNode,
        label: translation.label,
        question: translation.question,
        conclusions: translation.conclusions,
        open_questions: translation.open_questions,
        keywords: translation.keywords,
        chat_snapshot: translation.chat_snapshot || rawSelectedNode.chat_snapshot,
      };
    } else {
      const cnNode = INITIAL_TOPICS_DATA.find(n => n.id === rawSelectedNode.id);
      if (cnNode) {
        return {
          ...rawSelectedNode,
          label: cnNode.label,
          question: cnNode.question,
          conclusions: cnNode.conclusions,
          open_questions: cnNode.open_questions,
          keywords: cnNode.keywords,
          chat_snapshot: rawSelectedNode.chat_snapshot,
        };
      }
    }
    return rawSelectedNode;
  }, [rawSelectedNode, lang]);

  // Dynamically translate all nodes to the active language for perfect graph and list sync
  const translatedNodes = React.useMemo(() => {
    return nodes.map((node) => {
      if (lang === "en" && EN_TRANSLATIONS[node.id]) {
        const tr = EN_TRANSLATIONS[node.id];
        return {
          ...node,
          label: tr.label,
          question: tr.question,
          keywords: tr.keywords,
          conclusions: tr.conclusions,
          open_questions: tr.open_questions,
        };
      } else {
        const cnNode = INITIAL_TOPICS_DATA.find(n => n.id === node.id);
        if (cnNode) {
          return {
            ...node,
            label: cnNode.label,
            question: cnNode.question,
            keywords: cnNode.keywords,
            conclusions: cnNode.conclusions,
            open_questions: cnNode.open_questions,
          };
        }
      }
      return node;
    });
  }, [nodes, lang]);
  
  // Custom dialog or notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Custom chat lines in detail panel
  const [customReply, setCustomReply] = useState("");
  const [chatLines, setChatLines] = useState<ChatMessage[]>([]);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Time clock display
  const [utcClock, setUtcClock] = useState("");

  // Grid Split State percentage (width of left graph panel)
  const [splitPercent, setSplitPercent] = useState<number>(60);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Sync state mutations to LocalStorage
  useEffect(() => {
    localStorage.setItem("wander_nodes", JSON.stringify(nodes));
  }, [nodes]);

  // Keep live UTC clock updated
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setUtcClock(d.toISOString().replace("Z", " UTC"));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Show a mini toast overlay
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Keep chat scrolls to bottom of panel
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatLines]);

  // Synergetic chat lines logic when nodes are selected
  useEffect(() => {
    if (selectedNode) {
      setChatLines(selectedNode.chat_snapshot || []);
    } else {
      setChatLines([]);
    }
  }, [selectedNode]);

  // Reset to original constellations
  const handleResetToDefault = () => {
    const confirmMsg = lang === 'cn' 
      ? "确定要恢复默认脑图星座吗？这会覆盖你当前的修改。" 
      : "Are you sure you want to restore the default constellation map? This will overwrite your current changes.";
    if (window.confirm(confirmMsg)) {
      setNodes(INITIAL_TOPICS_DATA);
      setSelectedId(null);
      setIsCreating(false);
      showToast(lang === 'cn' ? "已恢复大厂/AI核心思维初始星系" : "Restored default corporate and AI logic constellations.");
    }
  };

  // Add highly customizable new star
  const handleAddNode = (newNode: CosmicNode) => {
    // If some nodes are connected, synchronize their linked_to fields so links are mutual/two-way!
    let updatedNodes = [...nodes, newNode];
    if (newNode.linked_to) {
      updatedNodes = updatedNodes.map(existingNode => {
        if (newNode.linked_to?.includes(existingNode.id)) {
          const links = existingNode.linked_to || [];
          if (!links.includes(newNode.id)) {
            return {
              ...existingNode,
              linked_to: [...links, newNode.id]
            };
          }
        }
        return existingNode;
      });
    }

    setNodes(updatedNodes);
    setSelectedId(newNode.id);
    setIsCreating(false);
    showToast(`🌌 点亮星曜: ${newNode.label}`);
  };

  // Remove a constellation node
  const handleDeleteNode = (id: string) => {
    // Filter node list
    let updated = nodes.filter(n => n.id !== id);
    // Cleanup links referring to deleted node ID
    updated = updated.map(n => ({
      ...n,
      linked_to: n.linked_to ? n.linked_to.filter(linkId => linkId !== id) : undefined
    }));

    setNodes(updated);
    setSelectedId(null);
    setShowConfirmDelete(null);
    showToast("星曜轨迹已抹去");
  };

  // Add custom conversation response
  const handleSendCustomChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customReply.trim() || !selectedId) return;

    const userLine: ChatMessage = { who: "你", text: customReply.trim() };
    
    // Fun simulated responses by yuk (lobster/companion) reflecting spatial topics!
    const activeNode = nodes.find(n => n.id === selectedId);
    let yukResp = "已纳入意识网。这为我们的星群碰撞出了新的关联引力。";
    
    const responses = [
      `确实如此。站在宇宙视角看，${activeNode?.label || "这个话题"}的限制确实在于边界条件。我们可以考虑增加两层安全环，做二次声频检测。`,
      `有趣的想法。如果不把这当成一个单向工程，而是让普通用户的每一次选择都转化成隐形的权重，整个网络的收敛速度会快上十倍。`,
      `这正是我们要探究的信息差！在更深层次上，光模块的供应不仅受到产能限制，更受限于微电子制造中的材料摩擦力。`,
      "收到信号，正在为你计算该关联下的发散分支……已捕捉到两个暗物质级别的漏洞：1. 缺乏即时反馈；2. 开发投入产出比低于 1.5。",
      `这个结论让我们的「${activeNode?.label || "探索星曜"}」星系变得更加稳固。你要不要再选一根能量连线，把它与周围的恒星进一步绑定？`
    ];

    const randomYukLine: ChatMessage = {
      who: "yuk",
      text: responses[Math.floor(Math.random() * responses.length)]
    };

    const updatedLines = [...chatLines, userLine, randomYukLine];
    setChatLines(updatedLines);

    // Persist chat snapshots inside nodes
    setNodes(nodes.map(n => {
      if (n.id === selectedId) {
        return {
          ...n,
          chat_snapshot: updatedLines,
          rounds: (n.rounds || 0) + 1,
          last_active: new Date().toISOString().split("T")[0]
        };
      }
      return n;
    }));

    setCustomReply("");
  };

  // Toggle quick connection between stars
  const handleToggleLink = (targetId: string) => {
    if (!selectedId || selectedId === targetId) return;

    setNodes(prev => prev.map(node => {
      if (node.id === selectedId) {
        const links = node.linked_to || [];
        const updatedLinks = links.includes(targetId) 
          ? links.filter(id => id !== targetId) 
          : [...links, targetId];
        return { ...node, linked_to: updatedLinks };
      }
      if (node.id === targetId) {
        const links = node.linked_to || [];
        const updatedLinks = links.includes(selectedId) 
          ? links.filter(id => id !== selectedId) 
          : [...links, selectedId];
        return { ...node, linked_to: updatedLinks };
      }
      return node;
    }));

    showToast("星曜引力连线已重构");
  };

  // Mouse drag handler for split layout
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      
      const containerWidth = window.innerWidth;
      const computedPercent = (e.clientX / containerWidth) * 100;
      
      // Clamp values between 25% and 80% to keep side panels readable
      if (computedPercent > 20 && computedPercent < 80) {
        setSplitPercent(computedPercent);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div className="sophisticated-bg relative min-h-screen flex flex-col font-sans text-zinc-300 overflow-hidden text-sm selection:bg-yellow-900/10">
      
      {/* 1. Header Navigation Bar (Super minimalist layout matching user feedback) */}
      <header className="relative z-20 flex items-center justify-between gap-4 px-8 h-14 border-b border-zinc-900 bg-[#030308] backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center">
            <Search size={11} className="absolute left-3 text-zinc-500" />
            <input
              type="text"
              placeholder={UI_TEXTS[lang].searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 sm:w-64 pl-9 pr-3.5 py-1 rounded bg-[#0a0a0f] border border-zinc-900 focus:border-yellow-655/40 text-xs text-zinc-300 placeholder-zinc-700 font-mono focus:outline-none transition-all focus:w-72"
            />
          </div>

          {/* Minimalist Tech-forward Translation Toggle Button */}
          <button
            onClick={() => {
              const nextLang = lang === 'cn' ? 'en' : 'cn';
              setLang(nextLang);
              showToast(nextLang === 'en' ? "TRANSLATED TO ENGLISH" : "已切换为中文视图");
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded border border-zinc-900 bg-[#06060c] text-[10.5px] font-mono tracking-wider text-zinc-400 hover:text-white transition hover:border-zinc-800 focus:outline-none active:scale-95"
            title="Toggle Chinese / English translation"
          >
            <span className={lang === 'cn' ? "text-yellow-500 font-semibold" : "text-zinc-500"}>中</span>
            <span className="text-zinc-700 text-[9px]">/</span>
            <span className={lang === 'en' ? "text-yellow-500 font-semibold" : "text-zinc-500"}>EN</span>
          </button>

          {/* Reset database button */}
          <button
            onClick={handleResetToDefault}
            className="px-2.5 py-1 rounded border border-zinc-900 bg-[#06060c] font-mono text-[9.5px] uppercase tracking-wider text-zinc-550 hover:text-zinc-300 transition hover:border-zinc-800 active:scale-95"
            title={lang === 'cn' ? "重置为初始星系" : "Reset constellations to default"}
          >
            {lang === 'cn' ? "重置" : "RESET"}
          </button>
        </div>
      </header>

      {/* 2. Main Interface split-pane-layout */}
      <main className="relative flex-1 flex flex-col md:flex-row overflow-hidden z-10 bg-[#030308]">
        
        {/* Left pane: Pure D3 Force Web Constellation */}
        <div 
          className="relative h-[50vh] md:h-auto overflow-hidden border-b border-zinc-900 md:border-b-0"
          style={{ width: window.innerWidth > 768 ? `${splitPercent}%` : "100%" }}
        >
          {/* Interactive D3 logic graph container with solid dark back */}
          <div className="absolute inset-0 z-10 bg-[#030308]">
            <ConstellationGraph 
              nodes={translatedNodes}
              selectedId={selectedId}
              onSelectNode={(id) => {
                setSelectedId(id);
                setIsCreating(false);
              }}
              searchQuery={searchQuery}
              lang={lang}
            />
          </div>


        </div>

        {/* Intermediate Drag Divider */}
        <div 
          ref={resizerRef}
          onMouseDown={handleMouseDown}
          className="hidden md:block w-1 hover:w-1.5 bg-zinc-900 cursor-col-resize z-20 transition-all border-l border-zinc-950 active:bg-yellow-600/50"
          title="Drag to resize panels"
        />

        {/* Right pane: Detail star console / metadata inspector panel */}
        <div 
          className="flex-1 flex flex-col bg-[#07070a] border-l border-zinc-900 relative z-10 overflow-hidden"
          style={{ width: window.innerWidth > 768 ? `${100 - splitPercent}%` : "100%" }}
        >
          {selectedNode ? (
            /* Selected active node detail pane console layout */
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Star Detail Header */}
              <div className="p-6 border-b border-zinc-900 bg-zinc-950/40 relative">
                
                {/* Delete button action */}
                <button
                  onClick={() => setShowConfirmDelete(selectedNode.id)}
                  className="absolute top-6 right-6 p-2 rounded hover:bg-red-950/20 text-zinc-500 hover:text-red-400 transition"
                  title="Mute/Delete this thought star"
                >
                  <Trash2 size={13} />
                </button>

                <div className="flex items-center gap-1 text-[9px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-2">
                  <span className="text-yellow-500 font-bold">● ACTIVE STUDY NODE</span>
                </div>

                <h2 className="font-mono font-bold text-base text-zinc-100 tracking-wide leading-tight mb-2 uppercase">
                  {selectedNode.label}
                </h2>

                <p className="font-sans text-xs italic text-zinc-400 leading-relaxed pl-3 border-l border-zinc-805">
                  「 {selectedNode.question} 」
                </p>

                {/* Categories and keywords */}
                {selectedNode.keywords && selectedNode.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {selectedNode.keywords.map((k) => (
                      <span 
                        key={k} 
                        className="text-[9px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-850/60"
                      >
                        #{k.toUpperCase()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Detail Main Scroll Section */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Related Chat Snaps / Scientific Discussion History log */}
                {chatLines && chatLines.length > 0 && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 tracking-wider uppercase">
                      <MessageSquare size={11} className="text-yellow-500" />
                      <span>{UI_TEXTS[lang].discussionRecord}</span>
                    </div>

                    <div className="p-4 rounded bg-[#0a0a0f] border border-zinc-900 space-y-3 max-h-72 overflow-y-auto">
                      {chatLines.map((chat, idx) => (
                        <div 
                          key={idx} 
                          className={`flex gap-2 text-xs ${(chat.who === "你" || chat.who === "You") ? "" : "bg-zinc-900/30 p-2 py-1 select-none border-b border-zinc-900/30"}`}
                        >
                          <span className={`font-mono font-semibold shrink-0 ${(chat.who === "你" || chat.who === "You") ? "text-yellow-500" : "text-zinc-400"}`}>
                            {(chat.who === "你" || chat.who === "You") ? (lang === 'cn' ? "你:" : "You:") : "YUK companion:"}
                          </span>
                          <div className="text-zinc-300 leading-relaxed whitespace-pre-line text-xs font-sans">
                            {chat.text.startsWith("<pre>") ? (
                              <pre className="font-mono text-[10px] text-zinc-400 bg-black/40 p-2 rounded overflow-x-auto my-1.5 border border-zinc-900">
                                {chat.text.replace(/<\/?pre>/g, "")}
                              </pre>
                            ) : (
                              chat.text
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={chatBottomRef} />
                    </div>
                  </div>
                )}
                
                {/* Substantive Research points or conclusions */}
                {selectedNode.conclusions && selectedNode.conclusions.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 tracking-wider uppercase">
                      <CheckCircle size={11} className="text-emerald-500" />
                      <span>{UI_TEXTS[lang].resolvedConclusions}</span>
                    </div>
                    <ul className="space-y-2 pl-1">
                      {selectedNode.conclusions.map((pt, idx) => (
                        <li 
                          key={idx} 
                          className="text-xs text-zinc-300 leading-relaxed flex items-start gap-2 bg-[#0a0a0f] p-2.5 rounded border border-zinc-900"
                        >
                          <span className="text-emerald-500 font-mono text-[9px] mt-0.5">▶</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Continuous Open Questions */}
                {selectedNode.open_questions && (
                  <div className="space-y-2 p-3.5 rounded bg-zinc-950 border border-zinc-900">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500 tracking-wider uppercase">
                      <HelpCircle size={11} className="text-yellow-600" />
                      <span>{UI_TEXTS[lang].forwardConcerns}</span>
                    </div>
                    <p className="text-xs text-zinc-300 pl-3 border-l border-zinc-800 font-sans leading-relaxed">
                      {selectedNode.open_questions}
                    </p>
                  </div>
                )}

              </div>

              {/* Navigation Back Footer */}
              <div className="p-4 border-t border-zinc-900 bg-zinc-950/40 flex items-center justify-start">
                <button
                  onClick={() => setSelectedId(null)}
                  className="px-3.5 py-1.5 rounded bg-zinc-900/40 w-auto hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-805 text-zinc-400 hover:text-zinc-200 text-xs transition font-mono"
                >
                  ← {UI_TEXTS[lang].deselect}
                </button>
              </div>

            </div>
          ) : (
            /* Home Cosmic Grid list / Curiosity Explorer when no selection */
            <div className="flex-1 flex flex-col overflow-hidden p-6 space-y-6 bg-[#07070a]">

              {/* Curiosity Grid */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">
                  {UI_TEXTS[lang].activeNodes}
                </div>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {translatedNodes
                    .filter((node) => {
                      if (!searchQuery) return true;
                      const q = searchQuery.toLowerCase().trim();
                      return (
                        node.label.toLowerCase().includes(q) ||
                        node.question.toLowerCase().includes(q) ||
                        node.keywords?.some(k => k.toLowerCase().includes(q))
                      );
                    })
                    .map((node) => {
                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedId(node.id)}
                          className="group relative p-3.5 rounded bg-zinc-950/40 border border-zinc-900/80 hover:border-yellow-600/30 hover:bg-zinc-950/90 cursor-pointer transition-all"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5 font-mono">
                            <span className="text-[9.5px] text-zinc-550 uppercase tracking-wider font-semibold">
                              {UI_TEXTS[lang].thinkBase}
                            </span>
                          </div>

                          <h4 className="font-mono font-medium text-xs text-zinc-300 group-hover:text-yellow-500 transition-colors uppercase tracking-wide">
                            {node.label}
                          </h4>
                          <p className="text-[11px] text-zinc-500 line-clamp-1 mt-1 font-sans font-light">
                            {node.question}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Grid actions button */}
              <div className="pt-3 border-t border-zinc-900 flex items-center justify-start">
                <div className="text-[10px] font-mono text-zinc-650 flex items-center gap-1.5">
                  <Info size={11} />
                  <span>
                    {lang === 'cn' ? `节点总数: ${nodes.length} 个` : `Total Nodes: ${nodes.length}`}
                  </span>
                </div>
              </div>

            </div>
          )}
        </div>

      </main>

      {/* 3. Delete Confirmation Overlay Modal */}
      {showConfirmDelete && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm">
          <div className="max-w-xs p-6 bg-zinc-950 border border-zinc-900 rounded-xl shadow-2xl text-center space-y-4">
            <p className="text-xs text-zinc-300 leading-relaxed font-sans">
              {lang === 'cn' 
                ? "确定要永久抹去该思想节点的连线和记录吗？此操作无法撤销。" 
                : "Are you sure you want to permanently erase this thought node and its logs? This operation cannot be undone."}
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="px-4 py-1.5 rounded bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-mono transition"
              >
                {lang === 'cn' ? "保留" : "Keep"}
              </button>
              <button
                onClick={() => handleDeleteNode(showConfirmDelete)}
                className="px-4 py-1.5 rounded bg-red-655 hover:bg-red-500 text-xs text-white font-mono transition"
              >
                {lang === 'cn' ? "确定删除" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Tiny Floating Global Alert Toast notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded bg-zinc-950 border border-yellow-700/30 text-zinc-100 text-xs shadow-xl backdrop-blur-md">
          <span className="text-yellow-500 font-bold mr-0.5 font-mono text-[9px]">●</span>
          <span className="font-mono text-[11px]">{toastMessage.toUpperCase()}</span>
        </div>
      )}

    </div>
  );
}

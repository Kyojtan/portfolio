import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, Play, Pause, Volume2, VolumeX, RefreshCw, 
  MapPin, Database, Network, Music, HelpCircle, 
  Sliders, ArrowLeft, Send, CheckCircle, FileText, Smartphone, Laptop
} from "lucide-react";

const DEMO_VIDEOS = {
  retro: "/demo_video/retro-player.mp4",
  mix: "/demo_video/ai-mix-studio.mov",
  fetch: "/demo_video/fetch-location.mp4",
  wander: "/demo_video/wander.mov",
} as const;

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

interface Message {
  role: "user" | "ai";
  text: string;
}

interface ProjectData {
  id: string;
  icon: any;
  color: string;
  badge: { zh: string; zt: string; en: string };
  cover?: string;
  name: { zh: string; zt: string; en: string };
  desc: { zh: string; zt: string; en: string };
  dialogue: {
    zh: Message[];
    zt: Message[];
    en: Message[];
  };
}

const AI_PROJECTS: ProjectData[] = [
  {
    id: "retro",
    icon: Music,
    color: "#FF9F0A",
    badge: { zh: "网页氛围延伸", zt: "網頁氛圍延伸", en: "Aesthetic Extension" },
    name: {
      zh: "Retro Player",
      zt: "Retro Player",
      en: "Retro Player"
    },
    desc: {
      zh: "一个在 YouTube 和 B 站上叠加复古滤镜、模拟磁带底噪与音高波动的 Chrome 插件。",
      zt: "一個在 YouTube 和 B 站上疊加復古濾鏡、模擬磁帶底噪與音高波動的 Chrome 插件。",
      en: "A Chrome extension overlaying vintage filters and generating analog tape hiss and pitch wow/flutter on YouTube/Bilibili."
    },
    dialogue: {
      zh: [
        { role: "user", text: "我最近在想，为什么我喜欢的歌和我想要的感觉之间，总是差一点什么。" },
        { role: "ai", text: "你是想说，现有的歌单没有办法完全匹配你内心的氛围感？" },
        { role: "user", text: "差不多。我一般在 YouTube 或 B 站上听 playlist，但画面和声音总是分开的。" },
        { role: "ai", text: "那如果加一层视觉的\"调味料\"呢？" },
        { role: "user", text: "对！我想能不能在视频上加一层滤镜，让它不只是视频，而是一种氛围——旧 VHS 的质感、磁带底噪，让整个观看体验更有感觉。" },
        { role: "ai", text: "于是你就做了 Retro Player。" },
        { role: "user", text: "一个 Chrome 插件，可以在 YouTube 和 B 站上叠加复古滤镜，调节滑条模拟磁带底噪、音高波动，按下开关就进入那个旧时代。" }
      ],
      zt: [
        { role: "user", text: "我最近在想，為什麼我喜歡的歌和我想要的感覺之間，總是差一點什麼。" },
        { role: "ai", text: "你是想說，現有的歌單沒有辦法完全匹配你內心的氛圍感？" },
        { role: "user", text: "差不多。我一般在 YouTube 或 B 站上聽 playlist，但畫面和聲音總是分開的。" },
        { role: "ai", text: "那如果加一層視覺的\"調味料\"呢？" },
        { role: "user", text: "對！我想能不能在視頻上加一層濾鏡，讓它不只是視頻，而是一種氛圍——舊 VHS 的質感、磁帶底噪，讓整個觀看體驗更有感覺。" },
        { role: "ai", text: "於是你就做了 Retro Player。" },
        { role: "user", text: "一個 Chrome 插件，可以在 YouTube 和 B 站上疊加復古濾鏡，調節滑條模擬磁帶底噪、音高波動，按下開關就進入那個舊時代。" }
      ],
      en: [
        { role: "user", text: "Lately I've been wondering why there is always a disconnect between the songs I love and the mood I really want." },
        { role: "ai", text: "Are you saying existing playlists fail to capture the subtle ambient atmospheres you feel inside?" },
        { role: "user", text: "Exactly. I usually play playlists on YouTube or Bilibili, but the visuals and the sounds always feel disjointed." },
        { role: "ai", text: "What if we add a sensory layer of 'visual seasoning'?" },
        { role: "user", text: "Yes! I thought, what if we overlay an atmospheric filter over the video so it becomes a complete scene—adding a warm dusty VHS texture, analog cassette tape hiss, making the entire listening experience so much deeper." },
        { role: "ai", text: "And that's how you created Retro Player." },
        { role: "user", text: "A Chrome extension that overlays vintage retro filters on YouTube and Bilibili. You adjust sliders simulating tape deck hiss and pitch wobbles; with one physical toggle, you step back into that golden old era." }
      ]
    }
  },
  {
    id: "mix",
    icon: Sparkles,
    color: "#BF5AF2",
    badge: { zh: "环境发生器", zt: "環境發生器", en: "Acoustic Generator" },
    name: {
      zh: "AI Mix Studio",
      zt: "AI Mix Studio",
      en: "AI Mix Studio"
    },
    desc: {
      zh: "把風格相近的 AI 音樂無縫拼接，配上雨聲環境音，調配出完美的沉浸氛围。",
      zt: "把風格相近的 AI 音樂無縫拼接，配上雨聲環境音，調配出完美的沉浸氛圍。",
      en: "Synthesizing highly cohesive AI-generated tracks into an un-fragmented listening stream paired with dynamic rain controls."
    },
    dialogue: {
      zh: [
        { role: "user", text: "最近在试 AI 生成音乐的工具，感觉挺好听的。" },
        { role: "ai", text: "说说看，哪里让你觉得有意思？" },
        { role: "user", text: "它们生成的音乐很有氛围感，但都是各自独立的，听完一首要手动切下一首，中间的断开让我很出戏。" },
        { role: "ai", text: "你想要的不是一个一个独立的片段，而是一个完整的、能一直播放的氛围。" },
        { role: "user", text: "对，而且我发现，同一个 prompt 生成出来的很多首歌风格都很像——既然风格相近，为什么不能把它们无缝串在一起，变成一个完整的 listening experience？" },
        { role: "ai", text: "所以你做了一个自己的播放器，把这些风格相似的歌接在一起，中间没有断层。" },
        { role: "user", text: "嗯，而且还做了一个比较有氛围感的下雨场景播放器，配上 AI 生成的音乐，就是我理想中的那个「感觉」。" }
      ],
      zt: [
        { role: "user", text: "最近在試 AI 生成音樂的工具，感覺挺好聽的。" },
        { role: "ai", text: "說說看，哪裡讓你覺得有意思？" },
        { role: "user", text: "它們生成的音樂很有氛圍感，但它們均為各自獨立的，聽完一首要手動切下一首，中間的斷開讓我很出戲。" },
        { role: "ai", text: "你想要的不是一個一個獨立的片段，而是一個完整的、能一直播放的氛圍。" },
        { role: "user", text: "對，而且我發現，同一個 prompt 生成出來的很多首歌風格都很像——既然風格相近，為什麼不能把它們無縫串在一起，變成一個完整的 listening experience？" },
        { role: "ai", text: "所以你做了一個自己的播放器，把這些風格相似的歌接在一起，中間沒有斷層。" },
        { role: "user", text: "嗯，而且還做了一個比較有氛圍感的下雨場景播放器，配上 AI 生成的音樂，就是我理想中的那個「感覺」。" }
      ],
      en: [
        { role: "user", text: "I've been experimenting with music generated by AI lately, and the tracks actually sound quite beautiful." },
        { role: "ai", text: "Tell me, what part of it is capturing your interest?" },
        { role: "user", text: "The AI music has an incredible atmosphere, but they are all isolated audio tracks. You finish one and have to manually click the next; that brief silence breaks the spell." },
        { role: "ai", text: "You didn't want isolated fragments; you wanted an uninterrupted, evolving ambient stream." },
        { role: "user", text: "Yes! And I noticed that many songs generated by the same prompt share highly similar acoustics. Since they are so close in style, why not blend them seamlessly into a unified listening journey?" },
        { role: "ai", text: "So you built a custom player to stitch these similar songs together organically, eliminating all dead space." },
        { role: "user", text: "Precisely. I also designed an atmospheric rain scenery visualizer; paired with the continuous AI tracks, it becomes exactly the 'feeling' I sought." }
      ]
    }
  },
  {
    id: "fetch",
    icon: MapPin,
    color: "#30B0C7",
    badge: { zh: "地理特工", zt: "地理特工", en: "Locational Intelligence" },
    name: {
      zh: "Fetch Location",
      zt: "Fetch Location",
      en: "Fetch Location"
    },
    desc: {
      zh: "基于大模型的地理推断专家。一键解析笔记，自动搜索拼凑地址，手机背部轻点直达导航。",
      zt: "基於大模型的地理推斷專家。一鍵解析筆記，自動搜索拼湊地址，手機背部輕點直達導航。",
      en: "An NLP geolocator analyzing photos, IP, and context clues on Xiaohongshu to navigate with a back double-tap."
    },
    dialogue: {
      zh: [
        { role: "user", text: "我每次在小红书被种草咖啡厅，想导航过去还要手动搜索，太麻烦了。" },
        { role: "ai", text: "所以你想把这些步骤自动化？" },
        { role: "user", text: "但我发现一个问题——很多笔记里根本没有写清楚具体地址，全靠图片、IP 或者文字里的隐藏线索。" },
        { role: "ai", text: "那怎么定位？" },
        { role: "user", text: "我给 DeepSeek 喂了一个 prompt，让它当我的地理专家——分析图片环境、博主的 IP、甚至语气，判断这家店大概在哪。然后背部轻点两下，直接跳地图打开。" },
        { role: "ai", text: "懒人必备。" },
        { role: "user", text: "真的，写完这个 prompt 之后我觉得，以后再也不用手动搜了。" }
      ],
      zt: [
        { role: "user", text: "我每次在小紅書被種草咖啡廳，想導航過去還要手動搜索，太麻煩了。" },
        { role: "ai", text: "所以你想把這些步驟自動化？" },
        { role: "user", text: "但我發現一個問題——很多筆記裡根本沒有寫清楚具體地址，全靠圖片、IP 或者文字裡的隱藏線索。" },
        { role: "ai", text: "那怎麼定位？" },
        { role: "user", text: "我給 DeepSeek 餵了一個 prompt，讓它當我的地理專家——分析圖片環境、博主的 IP、甚至語氣，判斷這家店大概在哪。然後背部輕點兩下，直接跳地圖打開。" },
        { role: "ai", text: "懶人必備。" },
        { role: "user", text: "真的，寫完這個 prompt 之後我覺得，以後再也不用手動搜了。" }
      ],
      en: [
        { role: "user", text: "Every time I bookmark a cool cafe on Xiaohongshu, having to manually search the name in maps to navigate feels incredibly tedious." },
        { role: "ai", text: "So you wanted to automate this entire sequence?" },
        { role: "user", text: "But I hit a wall—many posts don't specify an exact store address; you only get photos, an approximate IP region, or abstract hints buried in captions." },
        { role: "ai", text: "How on earth do you locate it then?" },
        { role: "user", text: "I engineered a prompt for DeepSeek to act as my visual-geography specialist—analyzing surrounding storefront styles, blogger IP metadata, and narrative clues to deduce the exact shop location. Then, by double-tapping the back of the phone, maps open instantly centered on the spot." },
        { role: "ai", text: "The ultimate hack for laziness." },
        { role: "user", text: "Unmatched convenience. Honestly, after refining this prompt, I realized I will never have to manually search locations again." }
      ]
    }
  },
  {
    id: "rag",
    icon: Database,
    color: "#32D74B",
    badge: { zh: "溯源知识库", zt: "溯源知識庫", en: "Traceable Syllabus Database" },
    name: {
      zh: "RAG AI chatbot",
      zt: "RAG AI chatbot",
      en: "RAG AI chatbot"
    },
    desc: {
      zh: "基于 RAG 架构搭建的 CFA 考试知识库，优化分块算法，杜绝特殊公式的损耗。",
      zt: "基於 RAG 架構搭建的 CFA 考試知識庫，優化分塊算法，杜絕特殊公式的損耗。",
      en: "CFA examination RAG system optimized with custom semantic chunking structures to preserve symbols and formulae."
    },
    dialogue: {
      zh: [
        { role: "user", text: "网上 CFA 的备考资料太多了，质量参差不齐，我自己的笔记又散在各处。" },
        { role: "ai", text: "所以你想把这些材料整合成一个可溯源的知识库？" },
        { role: "user", text: "对。网上的信息太杂，我自己整理的笔记又没有体系。我就想，能不能基于自己的资料建一个问答系统——它回答的知识都能直接指向教材的某一部分，我一看就知道哪个知识点还薄弱、需要补充什么。" },
        { role: "ai", text: "于是你做了这个 RAG 知识库。" },
        { role: "user", text: "嗯，基于 RAG 架构搭建的 CFA 考试知识库。通过对比测试确定了最佳 chunk size，改善了上下文语义完整性。针对公式 and 特殊字符，用语义搜索直接依赖上下文推断的策略，避免强制解析导致的信息损耗。" }
      ],
      zt: [
        { role: "user", text: "網上 CFA 的備考資料太多了，質量參差不齊，我自己認真整理的筆記又散在各處。" },
        { role: "ai", text: "所以你想把這些材料整合為一個可溯源的知識庫？" },
        { role: "user", text: "對。網上的信息太雜，我自己整理的筆記又沒有體系。我就想，能不能基於自己的資料建一個問答系統——它回答的知識都能直接指向教材的某一部分，我一看就知道哪個知識點還薄弱、需要補充什麼。" },
        { role: "ai", text: "於是你做了這個 RAG 知識庫。" },
        { role: "user", text: "嗯，基於 RAG 架構搭建的 CFA 考試知識庫。通過對比測試確定了最佳 chunk size，改善了上下文語義完整性。針對公式與特殊字符，語義搜索直接依賴上下文推斷的策略，避免強制解析導致的信息損耗。" }
      ],
      en: [
        { role: "user", text: "There are too many CFA prep resources scattered online of variable quality, and my own structured study notes are dispersed everywhere." },
        { role: "ai", text: "So your goal was to aggregate these materials into a unified, highly traceable knowledge hub?" },
        { role: "user", text: "Correct. Public articles can be chaotic, and my notes lack global coherence. I wondered: can I construct a Q&A engine over my personal study vault, where every answer directly roots itself in verified textbook passages, letting me spot my knowledge gaps instantly?" },
        { role: "ai", text: "Hence you built this dynamic RAG catalog." },
        { role: "user", text: "Yes, a customized CFA prep wizard under RAG architecture. Through empirical cross-testing, I identified the optimal chunk sizes to maintain conversational semantics. For complex equations and symbols, I deployed safe context inference mapping to avoid parsing losses." }
      ]
    }
  },
  {
    id: "wander",
    icon: Network,
    color: "#FFD60A",
    badge: { zh: "力导知识网", zt: "力導知識網", en: "Semantic Astromap" },
    name: {
      zh: "Wander 知识星图",
      zt: "Wander 知識星圖",
      en: "Wander Semantic Astromap"
    },
    desc: {
      zh: "交互式 D3 知识网。将对话洞察转化为璀璨星图，星星连线象征语义关联，触击读取知识沉淀。",
      zt: "交互式 D3 知識網。將對話洞察轉化為璀璨星圖，星星連線象徵語義關聯，觸擊讀取知識沉澱。",
      en: "A D3 force-directed galaxy model visualizing AI dialogues as stars with gravity cords to retain key intellectual insights."
    },
    dialogue: {
      zh: [
        { role: "user", text: "和 AI 对话时经常有很好的洞察，但聊完就散了，过几天完全想不起来当时讨论了什么。" },
        { role: "ai", text: "你想把对话里的知识点沉淀下来。" },
        { role: "user", text: "对，而且我希望这些知识点之间是有联系的——不是一个个孤立的笔记，而是一张能让我看到「这个问题和那个问题其实是相关的」的网。" },
        { role: "ai", text: "所以你做了一个知识星图。" },
        { role: "user", text: "一个 D3.js 力导向图，把对话里的关键知识点做成星星，节点之间的连线代表它们在语义上是相关的。点击星星可以看到当时的讨论摘要，还可以让 AI 推荐「这个话题和哪个现有话题有关联」。" }
      ],
      zt: [
        { role: "user", text: "和 AI 對話時經常有很好的洞察，但聊完就散了，過幾天完全想不起來當時討論了什麼。" },
        { role: "ai", text: "你想把對話裡的知識點沉澱下來。" },
        { role: "user", text: "對，而且我希望這些知識點之間是有聯絡的——不是一個個孤立的筆記，而是一張能讓我看到「這個問題和那個問題其實是相關的」的網。" },
        { role: "ai", text: "所以你做了這個知識星圖。" },
        { role: "user", text: "一個 D3.js 力導向圖，把對話裡的關鍵知識點做成星星，節點之間的連線代表它們在語義上是相關的。點擊星星可以看見當時的討論摘要，還可以讓 AI 推薦「這個話題和哪個現有話題有關聯」。" }
      ],
      en: [
        { role: "user", text: "Conversations with AI yield brilliant breakthroughs, but once the chat ends, they dissolve—it is almost impossible to recall what we brainstormed a few days later." },
        { role: "ai", text: "You wanted a tactile medium to retain and consolidate those cerebral highlights." },
        { role: "user", text: "Right! And I wanted these concepts to remain interconnected—not isolated folders of static documents, but an organic web which signals 'look, this inquiry actually shares a deep root with that subject'." },
        { role: "ai", text: "Which led you to design this semantic Starry Astro-graph." },
        { role: "user", text: "Exactly. An interactive network using a D3.js force-directed map. Key ideas crystallize as shining stars, connected by gravity lines indicating semantic relationships. Tapping an astro-node offers the dialogue recap and summons AI connections pointing to adjacencies." }
      ]
    }
  }
];

interface AiProjectShowcaseProps {
  lang: "zh" | "zt" | "en";
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

export default function AiProjectShowcase({ lang }: AiProjectShowcaseProps) {
  const [activeProjId, setActiveProjId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"demo" | "live" | "none">("demo");

  // Chat typing simulator state
  const [visibleCount, setVisibleCount] = useState(0);

  const activeProj = useMemo(() => {
    return AI_PROJECTS.find(p => p.id === activeProjId) || null;
  }, [activeProjId]);

  const currentLangDialogue = useMemo(() => {
    if (!activeProj) return [];
    return activeProj.dialogue[lang] || activeProj.dialogue.zh || activeProj.dialogue.en;
  }, [activeProj, lang]);

  const renderedMessages = useMemo(() => {
    return currentLangDialogue.slice(0, visibleCount);
  }, [currentLangDialogue, visibleCount]);

  // Restart chat simulation when project or language changes
  useEffect(() => {
    setVisibleCount(0);
  }, [activeProjId, lang]);

  useEffect(() => {
    if (activeProjId && visibleCount < currentLangDialogue.length) {
      const isFirst = visibleCount === 0;
      const timer = setTimeout(() => {
        setVisibleCount(prev => prev + 1);
      }, isFirst ? 50 : 800);
      return () => clearTimeout(timer);
    }
  }, [visibleCount, activeProjId, currentLangDialogue]);

  // Handle Tab Switch default based on what is available
  useEffect(() => {
    if (activeProjId) {
      setActiveTab("demo");
    }
  }, [activeProjId]);

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

  return (
    <div className="flex flex-col gap-10 w-full max-w-7xl mx-auto my-6 text-[#1A1A1A]">
      <AnimatePresence mode="wait">
        {/* Stage 1: Grid list of Projects (ai projects -> project list) */}
        {!activeProjId ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-8 w-full"
          >
 
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
              {AI_PROJECTS.map((proj, idx) => {
                const IconComponent = proj.icon;
                return (
                  <motion.div
                    key={proj.id}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="group relative bg-[#FDFBF7]/40 backdrop-blur-md rounded-xl border p-5 flex flex-col justify-between items-start cursor-none shadow-xs hover:shadow-md transition-all animate-fade-in"
                    onClick={() => {
                      setActiveProjId(proj.id);
                    }}
                    style={{ borderColor: `${proj.color}15` }}
                  >
                    {/* Delicate Accent Border Line */}
                    <div 
                      className="absolute top-0 left-0 w-full h-[3px] rounded-t-xl opacity-10 group-hover:opacity-30 transition-opacity"
                      style={{ backgroundColor: `${proj.color}bb` }}
                    />
                    
                    <div className="flex flex-col gap-3.5 w-full">

                      <div className="flex items-center justify-between w-full mt-1.5">
                        {/* Badge in top corner */}
                        <span className="text-[10px] font-bold font-mono text-gray-400 tracking-wider bg-gray-50 uppercase px-2.5 py-1 rounded-sm w-fit">
                          {proj.badge[lang]}
                        </span>

                        {/* Icon Container */}
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-gray-100/60 bg-white shadow-xs group-hover:scale-105 transition-transform">
                          <IconComponent className="w-4 h-4" style={{ color: proj.color }} />
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-gray-900 tracking-tight flex items-center gap-1.5 mt-1">
                        {proj.name[lang]}
                        <span className="text-xs text-accent">➔</span>
                      </h4>

                      <p className="text-xs text-gray-500 font-sans leading-relaxed tracking-wide min-h-[44px]">
                        {proj.desc[lang]}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          /* Stage 2: Selected Project detailed view */
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-6 w-full"
          >
            {/* Monospace back-button / breadcrumbs */}
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-4">
              <button
                onClick={() => setActiveProjId(null)}
                className="group flex items-center gap-2 text-xs font-bold font-mono tracking-wide text-gray-400 hover:text-black transition-colors cursor-none"
              >
                <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:transform group-hover:-translate-x-1 transition-transform" />
                {lang === "en" ? "BACK TO PROJECT LIST" : "返回项目列表"}
              </button>

              <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
                <span>AI PROJECTS</span>
                <span>/</span>
                <span className="text-black font-bold uppercase">{activeProj?.name[lang]}</span>
              </div>
            </div>

            {/* Main Split details block */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
              
              {/* Left Column: 2/5 portion - Dialogue ("项目灵感" previously "与AI协同对话摘要") */}
              <div className="lg:col-span-2 flex flex-col bg-gray-50/[0.3] rounded-2xl border border-gray-100 p-6 md:p-8 relative overflow-hidden min-h-[480px]">
                {/* Micro Ambient Grid Noise */}
                <div className="absolute inset-0 bg-[radial-gradient(#e1f0ff_1px,transparent_1px)] [background-size:16px_16px] opacity-25 pointer-events-none" />
                
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6 z-10">
                  <span className="text-[10px] font-bold font-mono tracking-widest text-[#1A1A1A] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent animate-spin-slow" />
                    {lang === "en" ? "PROJECT INSPIRATION" : "项目灵感"}
                  </span>
                  <div className="flex items-center gap-1 text-[9px] font-bold font-mono text-gray-400 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    COLLABORATIVE LOG
                  </div>
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
                           key={`${activeProjId}-${lang}-${mIdx}`}
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
                             {isUser ? (lang === "en" ? "Xujun" : "🗨️ 我") : (lang === "en" ? "Gemini" : "🦞 AI")}
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
              <div className="lg:col-span-3 flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden min-h-[480px] shadow-xs">
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
                      {activeProjId === "retro" ? (
                        <ProjectDemoVideo src={DEMO_VIDEOS.retro} />
                      ) : activeProjId === "mix" ? (
                        <ProjectDemoVideo src={DEMO_VIDEOS.mix} />
                      ) : activeProjId === "fetch" ? (
                        <ProjectDemoVideo src={DEMO_VIDEOS.fetch} />
                      ) : activeProjId === "rag" ? (
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
                      ) : activeProjId === "wander" ? (
                        <ProjectDemoVideo src={DEMO_VIDEOS.wander} />
                      ) : null}
                    </div>
                  )}

                  {/* TAB 2: 应用场景 (live) */}
                  {activeTab === "live" && (
                    <div className="w-full h-full flex flex-col gap-6">
                      
                      {activeProjId === "retro" ? (
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
                      ) : activeProjId === "mix" ? (
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
                      ) : activeProjId === "fetch" ? (
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
                      ) : activeProjId === "rag" ? (
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

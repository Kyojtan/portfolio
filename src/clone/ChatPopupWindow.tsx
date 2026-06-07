import { useState, useEffect, useRef, useCallback, type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import * as LucideIcons from "lucide-react";
import { Message, Language } from "./types";
import { LOCALES } from "./data";
import { DIGITAL_CLONE_SYSTEM_PROMPT } from "../utils/digitalClonePrompt";
import { onAr7778CharReveal, preloadAr7778Sounds, resetAr7778CharThrottle } from "../utils/ar7778Sounds";
import { clearChatSession, loadChatSession, saveChatSession } from "./chatSession";

interface ChatPopupWindowProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  /** When "none", parent supplies the overlay backdrop (e.g. About Me on homepage). */
  backdrop?: "default" | "none";
  onEscape?: () => void;
  /** Rendered beside the chat panel bottom edge; hidden when maximized. */
  footerAction?: ReactNode;
}

function normalizeCloneResponse(text: string, lang: Language): string {
  const trimmed = (text || "").trim();
  if (!trimmed) return trimmed;

  // Force numbered points into separate paragraphs for CN/TW readability.
  if (lang === "CN" || lang === "TW") {
    return trimmed
      // Support 1. 1) 1、 styles and split them into new paragraphs.
      .replace(/\s*(\d+[\.\)、)])\s*/g, "\n\n$1 ")
      // If model emits markdown bullets, also force paragraph breaks.
      .replace(/\s*-\s+/g, "\n\n- ")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return trimmed;
}

function renderInlineFormatting(text: string): ReactNode[] {
  const result: ReactNode[] = [];
  const boldRegex = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null = null;

  while ((match = boldRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      result.push(text.slice(lastIndex, match.index));
    }
    result.push(
      <strong key={`b-${match.index}`} className="font-semibold">
        {match[1]}
      </strong>
    );
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    result.push(text.slice(lastIndex));
  }
  return result;
}

/** Close dangling markdown so partial typewriter output can render bold/lists safely. */
function preparePartialFormattedText(text: string): string {
  const openBold = (text.match(/\*\*/g) || []).length % 2 === 1;
  return openBold ? `${text}**` : text;
}

const NUMBERED_LINE_RE = /^\d+[\.\)、)]\s+/;

type MessageSegment =
  | { type: "paragraph"; text: string }
  | { type: "numbered-list"; items: string[] };

/** Merge consecutive numbered paragraphs into one list while keeping each point on its own line. */
function parseMessageSegments(text: string): MessageSegment[] {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  const blocks = normalized.split(/\n\s*\n/);
  const segments: MessageSegment[] = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) continue;

    if (lines.every((line) => NUMBERED_LINE_RE.test(line))) {
      const items = lines.map((line) => line.replace(/^\d+[\.\)、)]\s+/, ""));
      const prev = segments[segments.length - 1];
      if (prev?.type === "numbered-list") {
        prev.items.push(...items);
      } else {
        segments.push({ type: "numbered-list", items });
      }
      continue;
    }

    segments.push({ type: "paragraph", text: lines.join(" ") });
  }

  return segments;
}

function FormattedMessage({ text }: { text: string }) {
  const segments = parseMessageSegments(text);
  if (segments.length === 0) return null;

  return (
    <div className="space-y-3">
      {segments.map((segment, segmentIdx) => {
        if (segment.type === "numbered-list") {
          return (
            <ol key={`ol-${segmentIdx}`} className="list-decimal pl-5 space-y-2">
              {segment.items.map((item, itemIdx) => (
                <li key={`li-${segmentIdx}-${itemIdx}`} className="leading-relaxed">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ol>
          );
        }

        return (
          <p key={`p-${segmentIdx}`} className="leading-relaxed">
            {renderInlineFormatting(segment.text)}
          </p>
        );
      })}
    </div>
  );
}

function MistTypewriter({
  text,
  onCharReveal,
  freezeSignal = 0,
  onComplete,
}: {
  text: string;
  onCharReveal?: () => void;
  freezeSignal?: number;
  onComplete?: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);
  const frozenCountRef = useRef<number | null>(null);
  const freezeBaselineRef = useRef(freezeSignal);
  const visibleCountRef = useRef(0);
  visibleCountRef.current = visibleCount;

  useEffect(() => {
    setVisibleCount(0);
    frozenCountRef.current = null;
    freezeBaselineRef.current = freezeSignal;
  }, [text]);

  useEffect(() => {
    if (freezeSignal > freezeBaselineRef.current) {
      frozenCountRef.current = visibleCountRef.current;
    }
  }, [freezeSignal]);

  useEffect(() => {
    if (frozenCountRef.current !== null) return;
    if (visibleCount >= text.length) {
      onComplete?.();
      return;
    }
    const timer = window.setTimeout(() => {
      setVisibleCount((c) => c + 1);
      onCharReveal?.();
    }, 8);
    return () => window.clearTimeout(timer);
  }, [visibleCount, text, freezeSignal, onCharReveal, onComplete]);

  const displayCount = frozenCountRef.current ?? visibleCount;
  const visibleText = text.slice(0, displayCount);

  return (
    <div className="min-w-0 break-words [overflow-wrap:anywhere] overflow-hidden">
      <FormattedMessage text={preparePartialFormattedText(visibleText)} />
    </div>
  );
}

export default function ChatPopupWindow({
  isOpen,
  onClose,
  lang,
  backdrop = "default",
  onEscape,
  footerAction,
}: ChatPopupWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typewriterFreeze, setTypewriterFreeze] = useState(0);
  const [isMaximized, setIsMaximized] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [shaking, setShaking] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);
  const [errorText, setErrorText] = useState<string>("");

  const [isPlayingAudioId, setIsPlayingAudioId] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingUserMessageIdRef = useRef<string | null>(null);
  const stopClickGuardRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const chatHydratedRef = useRef(false);

  const isAnimatingReply = messages.some((m) => m.role === "ai" && m.isTyping);
  const isBusy = isTyping || isAnimatingReply;

  const words = LOCALES[lang];
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY as string | undefined;
  const deepseekModel = (import.meta.env.VITE_DEEPSEEK_MODEL as string | undefined) || "deepseek-chat";

  const mapLanguageLabel = (l: Language) => (l === "EN" ? "English" : "Traditional Chinese");

  const makeWelcomeMessage = useCallback(
    (): Message => ({
      id: `welcome-${Date.now()}`,
      role: "ai",
      senderName: "Xujun",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: words.chatWelcome,
      isTyping: true,
    }),
    [words.chatWelcome]
  );

  useEffect(() => {
    if (chatHydratedRef.current) return;
    chatHydratedRef.current = true;
    const stored = loadChatSession();
    setMessages(stored ?? [makeWelcomeMessage()]);
  }, [makeWelcomeMessage]);

  useEffect(() => {
    if (messages.length > 0) {
      saveChatSession(messages);
    }
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.code === "Space" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") {
        onClose();
        setIsMaximized(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isOpen) return;
    void preloadAr7778Sounds();
  }, [isOpen]);

  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === "ai" && last.isTyping) {
      resetAr7778CharThrottle();
    }
  }, [messages]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const isScrolledUp = container.scrollHeight - container.scrollTop - container.clientHeight > 140;
    setShowScrollBottom(isScrolledUp);
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const triggerNudge = () => {
    setShaking(true);
    window.setTimeout(() => setShaking(false), 560);
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(msgId);
    window.setTimeout(() => setCopiedMessageId((prev) => (prev === msgId ? null : prev)), 3000);
  };

  const togglePlayback = (msgId: string, audioUrl?: string) => {
    if (isPlayingAudioId === msgId) {
      audioElement?.pause();
      setIsPlayingAudioId(null);
      return;
    }

    if (audioElement) audioElement.pause();
    if (audioUrl && audioUrl !== "simulated-voice-note-waveform") {
      const audio = new Audio(audioUrl);
      audio.play();
      audio.onended = () => setIsPlayingAudioId(null);
      setAudioElement(audio);
      setIsPlayingAudioId(msgId);
    } else {
      setIsPlayingAudioId(msgId);
      window.setTimeout(() => setIsPlayingAudioId(null), 5000);
    }
  };

  const handleStop = useCallback((e?: { preventDefault?: () => void; stopPropagation?: () => void }) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    stopClickGuardRef.current = true;
    window.setTimeout(() => {
      stopClickGuardRef.current = false;
    }, 400);

    const waitingForApi = isTyping;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }

    setIsTyping(false);
    setTypewriterFreeze((k) => k + 1);

    setMessages((prev) => {
      let next = prev.map((m) => (m.isTyping ? { ...m, isTyping: false } : m));

      if (waitingForApi && pendingUserMessageIdRef.current) {
        const pendingId = pendingUserMessageIdRef.current;
        const pendingIdx = next.findIndex((m) => m.id === pendingId);
        if (pendingIdx >= 0 && !next.slice(pendingIdx + 1).some((m) => m.role === "ai")) {
          next = next.filter((m) => m.id !== pendingId);
        }
      }

      return next;
    });

    pendingUserMessageIdRef.current = null;
  }, [isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    const effectiveText = textToSend.trim();
    if (!effectiveText) return;
    if (isBusy || stopClickGuardRef.current) return;

    if (!apiKey) {
      setErrorText("Missing VITE_DEEPSEEK_API_KEY in .env.local");
      return;
    }

    setErrorText("");
    const lowerText = effectiveText.toLowerCase().trim();
    const isNudge = /^(hi+|hello+|hey+|yo+|wave hello! 👋|打个招呼吧！👋|👋)[!.]*$/.test(lowerText);

    const userMessage: Message = {
      id: `usr-${Date.now()}`,
      role: "user",
      senderName: "Visitor",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: isNudge ? (lang === "EN" ? "👋 nudge sent" : "👋 你已發送一個窗口抖動") : effectiveText,
      isNudge: isNudge || undefined,
    };

    pendingUserMessageIdRef.current = userMessage.id;
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInputText("");
    setIsTyping(true);
    if (isNudge) triggerNudge();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const historyPayload = nextMessages.map((m) => ({
        role: m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("https://api.deepseek.com/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: deepseekModel,
          temperature: 0.7,
          messages: [
            { role: "system", content: `${DIGITAL_CLONE_SYSTEM_PROMPT}\n\nLanguage preference: ${mapLanguageLabel(lang)}` },
            ...historyPayload,
            { role: "user", content: effectiveText },
          ],
        }),
      });

      if (!res.ok) {
        const detail = await res.text();
        throw new Error(`DeepSeek request failed ${res.status}: ${detail}`);
      }

      const data = await res.json();
      const aiReply: Message = {
        id: `clone-${Date.now()}`,
        role: "ai",
        senderName: "Xujun",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: normalizeCloneResponse(
          data?.choices?.[0]?.message?.content ||
            (lang === "EN" ? "I am still syncing  try one more time" : "我還在同步中  你再試一次"),
          lang
        ),
        isTyping: true,
      };
      pendingUserMessageIdRef.current = null;
      setTypewriterFreeze(0);
      setMessages((prev) => [...prev, aiReply]);
      if (isNudge) window.setTimeout(() => triggerNudge(), 500);
    } catch (err: any) {
      if (err.name === "AbortError") {
        pendingUserMessageIdRef.current = null;
        return;
      }
      const detail = err?.message || "Request failed";
      setErrorText(detail);
      const errorMessage: Message = {
        id: `err-${Date.now()}`,
        role: "ai",
        senderName: "Xujun",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text: "I need a second to reconnect  ask me again",
        isTyping: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      if (abortControllerRef.current === controller) abortControllerRef.current = null;
      setIsTyping(false);
    }
  };

  const handleClearChat = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsTyping(false);
    clearChatSession();
    setMessages([makeWelcomeMessage()]);
  };

  const handleDismissChat = () => {
    onClose();
    setIsMaximized(false);
  };

  const handleCloseAndClearChat = () => {
    handleClearChat();
    handleDismissChat();
  };

  if (!isOpen) return null;

  const shell = (
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: "spring", stiffness: 350, damping: 26 }}
          className={`w-full overflow-hidden window-glass flex flex-col font-sans text-zinc-800 relative transition-all duration-300 ease-in-out ${shaking ? "animate-shake-nudge" : ""} ${isMaximized ? "w-screen h-screen max-w-none max-h-none rounded-none" : "w-full max-w-[min(48rem,calc(100vw-1.25rem))] h-[min(85vh,680px)] rounded-2xl"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-12 bg-white/25 backdrop-blur-md flex items-center justify-between px-4 border-b border-white/40 shrink-0 select-none relative">
            <div className="flex items-center gap-2 z-10 group/macdots">
              <button
                type="button"
                onClick={handleCloseAndClearChat}
                className="w-3 h-3 rounded-full dot-red flex items-center justify-center relative transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="text-[10px] text-[#4c0000] font-bold opacity-0 group-hover/macdots:opacity-100 transition-opacity duration-150 absolute select-none leading-none -mt-0.5 pointer-events-none">×</span>
              </button>
              <button
                type="button"
                onClick={handleDismissChat}
                className="w-3 h-3 rounded-full dot-yellow flex items-center justify-center relative transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span className="text-[10px] text-[#5c3c00] font-black opacity-0 group-hover/macdots:opacity-100 transition-opacity duration-150 absolute select-none leading-none -mt-[3px] pointer-events-none">−</span>
              </button>
              <button
                type="button"
                onClick={() => setIsMaximized(!isMaximized)}
                className="w-3 h-3 rounded-full dot-green flex items-center justify-center relative transition-transform duration-200 hover:scale-105 active:scale-95 cursor-pointer"
              >
                <svg viewBox="0 0 12 12" className="w-[7px] h-[7px] text-[#003c00] opacity-0 group-hover/macdots:opacity-100 transition-opacity duration-150 absolute select-none pointer-events-none">
                  <path d="M2.5 9.5 L9.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  <polygon points="2.5,9.5 2.5,5.5 6.5,9.5" fill="currentColor" />
                  <polygon points="9.5,2.5 9.5,6.5 5.5,2.5" fill="currentColor" />
                </svg>
              </button>
            </div>
            <span className="absolute left-1/2 -translate-x-1/2 font-mono text-xs font-bold tracking-widest text-zinc-500">@xujun</span>
            <div className="w-14 h-4 shrink-0 z-10" />
          </div>

          <div className="flex flex-1 overflow-hidden">
            <div className="flex-1 flex flex-col justify-between bg-transparent relative">
              <div className="h-11 ryo-header-pinstripe flex items-center justify-between px-5 select-none shrink-0">
                <div className="flex items-center gap-1.5 cursor-default">
                  <span className="font-sans text-[13px] font-normal text-zinc-800">@xujun</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1 animate-pulse" />
                  <span className="text-[10px] text-zinc-450 font-sans font-normal">{words.onlineStatus}</span>
                </div>
                <button onClick={handleClearChat} className="font-sans text-[11.5px] text-zinc-400 font-light hover:text-zinc-700 hover:font-bold transition-all tracking-wide cursor-pointer">
                  {words.clearBtn}
                </button>
              </div>

              <div ref={scrollContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-5 py-6 space-y-6 relative">
                {messages.map((msg) => {
                  const isAi = msg.role === "ai";
                  return (
                    <div key={msg.id} className={`flex flex-col ${isAi ? "items-start" : "items-end"} group`}>
                      <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] text-zinc-400 select-none">
                        {isAi ? (
                          <>
                            <span className="text-zinc-500 font-medium">{msg.senderName}</span>
                            <span>{msg.time}</span>
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              className={`p-0.5 rounded-sm hover:bg-zinc-100 cursor-pointer flex items-center justify-center transition-opacity duration-150 ${copiedMessageId === msg.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            >
                              {copiedMessageId === msg.id ? <LucideIcons.Check size={11} className="text-emerald-500" /> : <LucideIcons.Copy size={11} className="text-zinc-400 hover:text-zinc-600" />}
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleCopyMessage(msg.id, msg.text)}
                              className={`p-0.5 rounded-sm hover:bg-zinc-100 cursor-pointer flex items-center justify-center transition-opacity duration-150 ${copiedMessageId === msg.id ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                            >
                              {copiedMessageId === msg.id ? <LucideIcons.Check size={11} className="text-emerald-500" /> : <LucideIcons.Copy size={11} className="text-zinc-400 hover:text-zinc-600" />}
                            </button>
                            <span className="text-zinc-500">{msg.senderName}</span>
                            <span>{msg.time}</span>
                          </>
                        )}
                      </div>

                      {msg.isNudge ? (
                        <div className={`flex items-center gap-2 rounded-2xl px-5 py-2.5 font-sans font-normal select-none text-sm ${isAi ? "bubble-glass text-[#3f3f46] rounded-tl-sm" : "bubble-glass-user text-[#3f3f46] rounded-tr-sm"}`}>
                          <span className="text-sm select-none">👋</span>
                          <span className="font-sans font-normal text-sm">{lang === "EN" ? "nudge sent" : "你已發送一個窗口抖動"}</span>
                        </div>
                      ) : (
                        <div className={`max-w-[85%] min-w-0 rounded-2xl px-5 py-3.5 text-sm leading-relaxed font-normal flex flex-col gap-2.5 break-words [overflow-wrap:anywhere] overflow-hidden ${isAi ? "bubble-glass text-[#3f3f46] rounded-tl-sm" : "bubble-glass-user text-[#3f3f46] rounded-tr-sm"}`}>
                          {msg.image && (
                            <div className="rounded-lg overflow-hidden border border-pink-100 max-w-xs relative bg-white select-none">
                              <img src={msg.image} alt="Attached visual upload" className="max-h-48 object-cover rounded-md cursor-zoom-in transition-transform duration-200 hover:scale-[1.02]" referrerPolicy="no-referrer" />
                            </div>
                          )}
                          {msg.audio && (
                            <div className="flex items-center gap-3 bg-pink-100/30 border border-pink-200/40 py-2 px-3.5 rounded-xl text-xs font-mono font-bold text-[#4b5563] max-w-xs select-none">
                              <button type="button" onClick={() => togglePlayback(msg.id, msg.audio)} className="w-8 h-8 rounded-full bg-[#ffb6c1] text-white flex items-center justify-center shadow-md active:scale-90 hover:scale-105 transition-all shrink-0">
                                {isPlayingAudioId === msg.id ? <LucideIcons.Pause size={13} fill="currentColor" /> : <LucideIcons.Play className="ml-0.5" size={13} fill="currentColor" />}
                              </button>
                              <div className="flex-1 flex flex-col min-w-0">
                                <span className="truncate">{msg.audio.startsWith("blob:") ? "Recorded Audio Note" : msg.audio}</span>
                              </div>
                            </div>
                          )}
                          {isAi && msg.isTyping ? (
                            <MistTypewriter
                              text={msg.text}
                              freezeSignal={typewriterFreeze}
                              onCharReveal={() => {
                                onAr7778CharReveal();
                              }}
                              onComplete={() => {
                                setMessages((prev) =>
                                  prev.map((m) => (m.id === msg.id ? { ...m, isTyping: false } : m))
                                );
                              }}
                            />
                          ) : (
                            <div className="min-w-0 break-words [overflow-wrap:anywhere] overflow-hidden">
                              <FormattedMessage text={msg.text} />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {isTyping && (
                  <div className="flex flex-col items-start">
                    <div className="flex items-center gap-2 mb-1.5 font-mono text-[10px] text-zinc-400 select-none">
                      <span className="text-zinc-500 font-medium">Xujun</span>
                      <span>{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <div className="bubble-glass rounded-2xl rounded-tl-sm px-5 py-3.5 flex items-center">
                      <div className="flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
                {errorText && <p className="text-xs text-red-500">{errorText}</p>}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white/30 backdrop-blur-md border-t border-white/40 shrink-0 relative">
                <AnimatePresence>
                  {showScrollBottom && (
                    <motion.button initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} onClick={scrollToBottom} className="absolute bottom-full mb-3.5 right-6 z-20 btn-aqua-scroll" type="button">
                      <LucideIcons.ChevronDown size={18} className="text-zinc-600 stroke-[2.5] translate-y-[0.5px]" />
                    </motion.button>
                  )}
                </AnimatePresence>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (stopClickGuardRef.current || isBusy) return;
                    void handleSendMessage(inputText);
                  }}
                  className="flex items-center w-full"
                >
                  <div className="flex-1 relative flex items-center bg-white/45 backdrop-blur-sm rounded-full border border-white/60 px-5 h-10.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.015] hover:border-white/80 focus-within:border-white/90 focus-within:ring-4 focus-within:ring-white/30 transition-all duration-350 ease-out">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder={isTyping ? "" : words.chatPromptPlaceholder}
                      className="flex-1 bg-transparent border-none outline-none text-sm text-zinc-800 placeholder-zinc-400 pr-18 font-sans focus:ring-0"
                    />
                    <div className="absolute right-4 flex items-center text-zinc-400">
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => {
                          if (isBusy) return;
                          void handleSendMessage(lang === "EN" ? "Wave hello! 👋" : "打个招呼吧！👋");
                        }}
                        className="p-1 hover:text-zinc-600 transition-colors hover:scale-115 active:scale-90 duration-150 cursor-pointer disabled:opacity-40"
                      >
                        <LucideIcons.HandMetal size={15} />
                      </button>
                    </div>
                  </div>

                  {isBusy ? (
                    <button
                      type="button"
                      onPointerDown={(e) => handleStop(e)}
                      className="btn-liquid-glass-pink ml-3 shrink-0 select-none animate-pulse-breathy"
                      style={{ animationDuration: "3s" }}
                      aria-label={lang === "EN" ? "Stop" : "停止"}
                    >
                      <div className="w-3.5 h-3.5 bg-[#691c28] rounded-[3px] shadow-sm" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!inputText.trim()}
                      className="btn-liquid-glass-green ml-3 shrink-0 disabled:opacity-40 disabled:scale-100 disabled:cursor-not-allowed select-none"
                      aria-label={lang === "EN" ? "Send" : "發送"}
                    >
                      <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-neutral-800" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="19" x2="12" y2="5" />
                        <polyline points="5 12 12 5 19 12" />
                      </svg>
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </motion.div>
  );

  if (backdrop === "none") {
    return (
      <AnimatePresence>
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none transition-all duration-300 ${isMaximized ? "p-0" : "p-3 sm:p-6"}`}
        >
          {isMaximized ? (
            <div className="pointer-events-auto w-full h-full">{shell}</div>
          ) : (
            <div
              className="pointer-events-auto relative mx-auto w-full max-w-[min(48rem,calc(100vw-1.25rem))]"
              onClick={(e) => e.stopPropagation()}
            >
              {shell}
              {footerAction && (
                <div className="chat-footer-action-slot">
                  {footerAction}
                </div>
              )}
            </div>
          )}
        </div>
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs transition-all duration-300 ${isMaximized ? "p-0" : "p-3 sm:p-6"}`}
        onClick={() => (onEscape ?? onClose)()}
      >
        <div
          className={`pointer-events-auto ${isMaximized ? "w-full h-full" : "w-full max-w-[min(48rem,calc(100vw-1.25rem))]"}`}
          onClick={(e) => e.stopPropagation()}
        >
          {shell}
        </div>
      </div>
    </AnimatePresence>
  );
}

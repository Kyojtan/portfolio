import * as React from "react";
import { useState } from "react";
import { CosmicNode } from "../types";
import { Plus, Trash2, X, Sparkles, Send } from "lucide-react";

interface StarCreatorProps {
  existingNodes: CosmicNode[];
  onAddNode: (newNode: CosmicNode) => void;
  onClose: () => void;
}

export function StarCreator({ existingNodes, onAddNode, onClose }: StarCreatorProps) {
  const [label, setLabel] = useState("");
  const [question, setQuestion] = useState("");
  const [openQuestion, setOpenQuestion] = useState("");
  const [conclusions, setConclusions] = useState<string[]>([""]);
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [selectedLinks, setSelectedLinks] = useState<string[]>([]);
  const [rounds, setRounds] = useState<number>(1);
  const [hasConclusion, setHasConclusion] = useState(false);

  const handleAddConclusionLine = () => {
    setConclusions([...conclusions, ""]);
  };

  const handleRemoveConclusionLine = (index: number) => {
    const updated = conclusions.filter((_, i) => i !== index);
    setConclusions(updated.length ? updated : [""]);
  };

  const handleConclusionChange = (index: number, val: string) => {
    const updated = [...conclusions];
    updated[index] = val;
    setConclusions(updated);
  };

  const handleAddKeyword = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = keywordInput.trim().replace(/,$/, "");
      if (tag && !keywords.includes(tag)) {
        setKeywords([...keywords, tag]);
        setKeywordInput("");
      }
    }
  };

  const handleRemoveKeyword = (tag: string) => {
    setKeywords(keywords.filter(k => k !== tag));
  };

  const toggleLinkNode = (id: string) => {
    if (selectedLinks.includes(id)) {
      setSelectedLinks(selectedLinks.filter(linkedId => linkedId !== id));
    } else {
      setSelectedLinks([...selectedLinks, id]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim() || !question.trim()) return;

    const filteredConclusions = conclusions.filter(c => c.trim() !== "");

    // Create a unique node ID based on pinyin or translated label
    const safeId = label.toLowerCase().trim()
      .replace(/[^\w\s-]/g, "") // remove special characters
      .replace(/\s+/g, "-") + "-" + Date.now().toString().slice(-4);

    const newNode: CosmicNode = {
      id: safeId,
      label: label.trim(),
      question: question.trim(),
      conclusions: filteredConclusions,
      open_questions: openQuestion.trim() || undefined,
      keywords: keywords.length ? keywords : undefined,
      linked_to: selectedLinks.length ? selectedLinks : undefined,
      last_active: new Date().toISOString().split("T")[0],
      rounds: rounds,
      has_conclusion: hasConclusion,
      chat_snapshot: [
        { who: "你", text: `我想开启关于「${label.trim()}」的星座。` },
        { who: "yuk", text: `正在连接繁星意识。已锚定核心疑问：「${question.trim()}」` }
      ],
    };

    onAddNode(newNode);
  };

  return (
    <div className="flex flex-col h-full overflow-hidden text-zinc-100 bg-[#0d0d10] border border-zinc-900 rounded-xl shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-950/40">
        <div className="flex items-center gap-2">
          <Sparkles size={13} className="text-yellow-500" />
          <h3 className="font-mono font-medium text-xs tracking-wider text-zinc-300">
            点亮新思想星曜 / CREATE NEW NODE
          </h3>
        </div>
        <button 
          onClick={onClose}
          className="p-1.5 rounded hover:bg-zinc-900 text-zinc-400 hover:text-white transition"
        >
          <X size={14} />
        </button>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
        
        {/* Name / Label */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
            星曜代称 / CONCEPT NAME <span className="text-star-gold">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="例如: 智能体的自我意识, 光子晶体..."
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 focus:border-star-gold focus:outline-none focus:ring-1 focus:ring-star-gold/50 text-xs font-sans transition placeholder-zinc-600"
          />
        </div>

        {/* Base Question */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
            核心探问 / CORE INVESTIGATION <span className="text-star-gold">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="用户想要探究的基本疑惑是什么？"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-zinc-900/60 border border-zinc-800 focus:border-star-gold focus:outline-none focus:ring-1 focus:ring-star-gold/50 text-xs transition placeholder-zinc-600"
          />
        </div>

        {/* Conclusions lines */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
              关键论断与收敛点 / CORE RECOMMENDATIONS
            </label>
            <button
              type="button"
              onClick={handleAddConclusionLine}
              className="flex items-center gap-1 text-[9px] font-sans text-star-gold hover:text-yellow-400 transition"
            >
              <Plus size={10} /> 新增一条
            </button>
          </div>
          
          <div className="space-y-2">
            {conclusions.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-zinc-600 w-3">{idx + 1}.</span>
                <input
                  type="text"
                  placeholder="输入论断/研究结论..."
                  value={line}
                  onChange={(e) => handleConclusionChange(idx, e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded bg-zinc-900/40 border border-zinc-800 text-xs transition focus:border-zinc-700 focus:outline-none placeholder-zinc-700"
                />
                {conclusions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveConclusionLine(idx)}
                    className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-zinc-900/50 transition"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Next Unsolved / Open Questions */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
            未定断/悬而未决的问题 / OPEN EXPLORATIONS
          </label>
          <input
            type="text"
            placeholder="例如: 该架构的横向适配性验证？"
            value={openQuestion}
            onChange={(e) => setOpenQuestion(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-zinc-900/40 border border-zinc-800 focus:border-star-gold/60 focus:outline-none text-xs transition placeholder-zinc-700"
          />
        </div>

        {/* Keywords */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase">
            信号频率标签 / SPARK LABELS
          </label>
          <div className="flex flex-col gap-2 p-2.5 rounded-lg bg-zinc-950/60 border border-zinc-800/80">
            <div className="flex flex-wrap gap-1.5">
              {keywords.map((tag) => (
                <span 
                  key={tag}
                  className="inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-purple-400"
                >
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveKeyword(tag)} 
                    className="text-zinc-500 hover:text-zinc-300"
                  >
                    ×
                  </button>
                </span>
              ))}
              {keywords.length === 0 && (
                <span className="text-[10px] text-zinc-600 font-sans">暂无标签 (回车或逗号保存新标签)</span>
              )}
            </div>
            <input
              type="text"
              placeholder="添加标签..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleAddKeyword}
              className="bg-transparent border-none text-xs focus:outline-none placeholder-zinc-700 text-zinc-200"
            />
          </div>
        </div>

        {/* Star Connections links */}
        <div className="space-y-2">
          <label className="text-[10px] font-mono text-zinc-400 tracking-widest uppercase block">
            能量纠缠连线 / INTERSTELLAR BARS & LINKS
          </label>
          <p className="text-[9px] text-zinc-500">选择该星曜所链接与对应的周围其他思想星系:</p>
          <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-zinc-950/40 border border-zinc-800/60 rounded-lg">
            {existingNodes.map((node) => (
              <label 
                key={node.id} 
                className={`flex items-start gap-2 p-1.5 rounded border text-[10px] cursor-pointer transition select-none ${
                  selectedLinks.includes(node.id) 
                    ? "bg-purple-950/30 border-purple-800 text-purple-300" 
                    : "bg-zinc-900/30 border-zinc-900/80 text-zinc-400 hover:border-zinc-800"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedLinks.includes(node.id)}
                  onChange={() => toggleLinkNode(node.id)}
                  className="mt-0.5 accent-purple-500"
                />
                <span className="truncate">{node.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Switches */}
        <div className="flex items-center justify-between pt-2">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-zinc-300 uppercase block">
              是否收敛定论 / HAS SOLID CONCLUSION
            </span>
            <span className="text-[9px] text-zinc-500">此星曜是否已具备稳定共识</span>
          </div>
          <button
            type="button"
            onClick={() => setHasConclusion(!hasConclusion)}
            className={`w-11 h-6 rounded-full p-0.5 transition ${hasConclusion ? "bg-emerald-500" : "bg-zinc-800"}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white transition transform ${hasConclusion ? "translate-x-5" : "translate-x-0"}`} />
          </button>
        </div>
      </form>

      {/* Footer Submission */}
      <div className="p-4 border-t border-zinc-900 bg-zinc-950/40 flex items-center justify-between">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-1.5 rounded hover:bg-zinc-900 text-zinc-400 text-xs transition"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-1.5 px-4.5 py-1.5 rounded bg-yellow-500 hover:bg-yellow-400 text-zinc-950 font-mono font-medium text-xs transition active:scale-95"
        >
          <Send size={11} />
          点亮新星 / CREATE NODE
        </button>
      </div>
    </div>
  );
}

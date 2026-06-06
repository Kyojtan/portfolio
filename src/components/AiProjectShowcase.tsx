import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AiProjectCoverFlow from "./AiProjectCoverFlow";
import { AI_PROJECTS } from "../data/aiProjects";

interface AiProjectShowcaseProps {
  lang: "zh" | "zt" | "en";
  onCoverFlowActiveChange?: (active: boolean) => void;
}

export default function AiProjectShowcase({ lang, onCoverFlowActiveChange }: AiProjectShowcaseProps) {
  const navigate = useNavigate();

  useEffect(() => {
    onCoverFlowActiveChange?.(true);
    return () => onCoverFlowActiveChange?.(false);
  }, [onCoverFlowActiveChange]);

  return (
    <AiProjectCoverFlow
      projects={AI_PROJECTS}
      lang={lang}
      onSelect={(id) => navigate(`/category/ai/${id}`)}
    />
  );
}

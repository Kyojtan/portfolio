import { useNavigate } from "react-router-dom";
import AiProjectCoverFlow from "./AiProjectCoverFlow";
import { AI_PROJECTS } from "../data/aiProjects";

export default function AiProjectShowcase({ lang }: { lang: "zh" | "zt" | "en" }) {
  const navigate = useNavigate();

  return (
    <AiProjectCoverFlow
      projects={AI_PROJECTS}
      lang={lang}
      onSelect={(id) => navigate(`/category/ai/${id}`)}
    />
  );
}

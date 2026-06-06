import { Navigate, useParams } from "react-router-dom";
import AiProjectDetailView from "../components/AiProjectDetailView";
import { getProjectById } from "../data/aiProjects";

export default function AiProjectDetailPage({
  lang,
}: {
  lang: "zh" | "zt" | "en";
  setLang: (l: "zh" | "zt" | "en") => void;
}) {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId || !getProjectById(projectId)) {
    return <Navigate to="/category/ai" replace />;
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] font-sans selection:bg-black selection:text-white">
      <AiProjectDetailView projectId={projectId} lang={lang} />
    </div>
  );
}

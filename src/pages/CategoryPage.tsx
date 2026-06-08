import { useParams, Navigate } from "react-router-dom";
import { CATEGORY_CONTENT } from "../constants";
import AiProjectShowcase from "../components/AiProjectShowcase";
import ProductThinkingListOverlay from "../components/ProductThinkingListOverlay";
import PhotographyBookOverlay from "../components/PhotographyBookOverlay";
import HomePageContent from "../components/HomePageContent";

type CategoryId = "ai" | "product" | "photo";

function isCategoryId(id: string | undefined): id is CategoryId {
  return id === "ai" || id === "product" || id === "photo";
}

export default function CategoryPage({
  lang,
  setLang,
}: {
  lang: "zh" | "zt" | "en";
  setLang: (l: "zh" | "zt" | "en") => void;
}) {
  const { id } = useParams<{ id: string }>();

  if (id === "about") {
    return <Navigate to="/" replace />;
  }

  if (!isCategoryId(id)) {
    return <Navigate to="/" replace />;
  }

  const data = CATEGORY_CONTENT[id][lang] ?? CATEGORY_CONTENT[id].en;

  return (
    <div className="min-h-screen text-[#1A1A1A] font-sans overflow-x-hidden selection:bg-black selection:text-white">
      <div className="fixed inset-0 z-[85] pointer-events-none" aria-hidden>
        <HomePageContent lang={lang} setLang={setLang} />
      </div>

      {id === "ai" && <AiProjectShowcase lang={lang} />}
      {id === "product" && (
        <ProductThinkingListOverlay articles={data.items ?? []} lang={lang} />
      )}
      {id === "photo" && <PhotographyBookOverlay lang={lang} />}
    </div>
  );
}

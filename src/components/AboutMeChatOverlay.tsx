import { Link } from "react-router-dom";
import ChatPopupWindow from "../clone/ChatPopupWindow";
import { mapPortfolioLang } from "../clone/mapLang";

export default function AboutMeChatOverlay({
  lang,
  onClose,
}: {
  lang: "zh" | "zt" | "en";
  onClose: () => void;
}) {
  const detailsLabel = lang === "en" ? "View details" : lang === "zt" ? "查看詳情" : "查看详情";

  const detailsLink = (
    <Link
      to="/category/about?from=details"
      className="btn-liquid-glass-green-pill btn-liquid-glass-green-pill--toolbar pointer-events-auto cursor-none select-none hover:scale-[1.03] active:scale-[0.98] transition-transform whitespace-nowrap"
    >
      {detailsLabel}
    </Link>
  );

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px] pointer-events-auto" aria-hidden />

      <div className="relative z-10 pointer-events-auto">
        <ChatPopupWindow
          isOpen
          onClose={onClose}
          lang={mapPortfolioLang(lang)}
          backdrop="none"
          onEscape={onClose}
          footerAction={detailsLink}
        />
      </div>
    </div>
  );
}

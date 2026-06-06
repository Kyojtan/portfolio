import { useState } from "react";
import { motion } from "motion/react";
import ChatPopupWindow from "../clone/ChatPopupWindow";
import { mapPortfolioLang } from "../clone/mapLang";

export default function DigitalCloneEntry({ lang }: { lang: "zh" | "zt" | "en" }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <section className="w-full flex flex-col items-start">
      <div className="ask-me-glow-ring mt-8">
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          onClick={() => setIsChatOpen(true)}
          className="btn-skeuo-grey cursor-none select-none hover:scale-105 transition-transform duration-200"
          type="button"
        >
          <span className="font-sans text-[13.5px] sm:text-[14.5px] font-normal text-zinc-500 tracking-wide translate-y-[-0.5px]">
            Ask me anything ？꒰ᐢ˶•༝•˵ᐢ꒱
          </span>
        </motion.button>
      </div>

      <ChatPopupWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        lang={mapPortfolioLang(lang)}
      />
    </section>
  );
}

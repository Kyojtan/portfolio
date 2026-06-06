import type { Language } from "./types";

export function mapPortfolioLang(lang: "zh" | "zt" | "en"): Language {
  if (lang === "en") return "EN";
  if (lang === "zt") return "TW";
  return "CN";
}

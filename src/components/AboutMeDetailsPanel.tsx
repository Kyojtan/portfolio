import { CATEGORY_CONTENT } from "../constants";

type Lang = "zh" | "zt" | "en";
export type AboutSection = "experience" | "education" | "skills";

const TOOLS_LABEL: Record<Lang, string> = { zh: "工具", zt: "工具", en: "Tools" };
const LANGS_LABEL: Record<Lang, string> = { zh: "语言", zt: "語言", en: "Languages" };

export default function AboutMeDetailsPanel({
  lang,
  section,
}: {
  lang: Lang;
  section: AboutSection;
}) {
  const data = (CATEGORY_CONTENT as Record<string, Record<Lang, any>>).about?.[lang]
    ?? (CATEGORY_CONTENT as any).about.en;

  return (
    <div
      className={`about-overlay-details__body${
        section === "education" ? " about-overlay-details__body--education" : ""
      }`}
    >
      {section === "experience" && (
        <div className="about-overlay-details__stack">
          {data.experience?.map((exp: any, idx: number) => (
            <article
              key={`${exp.company}-${idx}`}
              className={
                idx > 0
                  ? "about-overlay-details__block about-overlay-details__block--sep"
                  : "about-overlay-details__block"
              }
            >
              <h3 className="about-overlay-details__role">{exp.role}</h3>
              <div className="about-overlay-details__subrow">
                <span className="about-overlay-details__submeta about-overlay-details__submeta--company">
                  {exp.company}
                </span>
                <span className="about-overlay-details__submeta about-overlay-details__submeta--date">
                  {exp.period}
                  {exp.location ? ` · ${exp.location}` : ""}
                </span>
              </div>
              <ul className="about-overlay-details__list">
                {exp.details?.map((detail: string, dIdx: number) => (
                  <li key={dIdx}>{detail}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}

      {section === "education" && (
        <div className="about-overlay-details__stack">
          {data.education?.map((edu: any, idx: number) => (
            <div
              key={idx}
              className={
                idx > 0
                  ? "about-overlay-details__block about-overlay-details__block--sep"
                  : "about-overlay-details__block"
              }
            >
              <div className="about-overlay-details__subrow about-overlay-details__subrow--edu">
                <span className="about-overlay-details__edu-text">{edu.degree}</span>
                <span className="about-overlay-details__submeta about-overlay-details__submeta--date">
                  {edu.period}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {section === "skills" && data.skills && (
        <div className="about-overlay-details__stack about-overlay-details__skills">
          <div>
            <p className="about-overlay-details__sub-label">{TOOLS_LABEL[lang]}</p>
            <div className="about-overlay-details__tags">
              {data.skills.tools?.map((tool: string) => (
                <span key={tool} className="about-overlay-details__tag">
                  {tool}
                </span>
              ))}
            </div>
          </div>
          <div className="about-overlay-details__skills-lang">
            <p className="about-overlay-details__sub-label">{LANGS_LABEL[lang]}</p>
            <ul className="about-overlay-details__langs">
              {data.skills.languages?.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}


export const TRANSLATIONS = {
  zh: {
    name: "谭旭君",
    title: "产品设计师 & 开发者的个人主页",
    aiProjects: "AI 项目",
    productThinking: "产品思考",
    photography: "摄影作品",
    aboutMe: "关于我",
    contact: "联系我",
    softLife: "Soft Life System"
  },
  zt: {
    name: "譚旭君",
    title: "產品設計師 & 開發者的個人主頁",
    aiProjects: "AI 項目",
    productThinking: "產品思考",
    photography: "攝影作品",
    aboutMe: "關於我",
    contact: "聯絡我",
    softLife: "Soft Life System"
  },
  en: {
    name: "Xujun Tan",
    title: "Product Designer & Developer Personal Portfolio",
    aiProjects: "AI Projects",
    productThinking: "Product Thinking",
    photography: "Photography",
    aboutMe: "About Me",
    contact: "Contact",
    softLife: "Soft Life System"
  }
};

export const PROJECTS = [
  {
    id: "ai",
    color: "#BEE1FF", // Soft Blue
    labelKey: "aiProjects",
    path: "/category/ai"
  },
  {
    id: "product",
    color: "#FFE28A", // Soft Yellow
    labelKey: "productThinking",
    path: "/category/product"
  },
  {
    id: "photo",
    color: "#FFC6D9", // Soft Pink
    labelKey: "photography",
    path: "/category/photo"
  },
  {
    id: "about",
    color: "#E0C3FC", // Soft Purple/Lavender
    labelKey: "aboutMe",
    path: "/category/about"
  }
];

export const CATEGORY_CONTENT = {
  ai: {
    zh: {
      title: "周末项目",
      subtitle: "探索人工智能在产品设计中的应用",
      items: [
        { title: "AI 写作助手", description: "基于大模型的智能写作工具，帮助创作者克服空白页恐慌。", imagePrompt: "Minimalist futuristic AI assistant interface, glowing soft blue nodes, frosted glass card" },
        { title: "智能推荐引擎", description: "个性化内容分发系统，提升用户参与度与留存。", imagePrompt: "Abstract data flow visualization, soft gradients, liquid shapes" }
      ]
    },
    zt: {
      title: "週末項目",
      subtitle: "探索人工智慧在產品設計中的應用",
      items: [
        { title: "AI 寫作助手", description: "基於大模型的智慧寫作工具，幫助創作者克服空白頁恐慌。", imagePrompt: "Minimalist futuristic AI assistant interface, glowing soft blue nodes, frosted glass card" },
        { title: "智慧推薦引擎", description: "個性化內容分發系統，提升使用者參與度與留存。", imagePrompt: "Abstract data flow visualization, soft gradients, liquid shapes" }
      ]
    },
    en: {
      title: "Friday night Projects",
      subtitle: "Exploring AI applications in product design",
      items: [
        { title: "AI Writing Assistant", description: "LLM-powered intelligent writing tool helping creators overcome blank page syndrome.", imagePrompt: "Minimalist futuristic AI assistant interface, glowing soft blue nodes, frosted glass card" },
        { title: "Smart Recommendation Engine", description: "Personalized content delivery system increasing user engagement and retention.", imagePrompt: "Abstract data flow visualization, soft gradients, liquid shapes" }
      ]
    }
  },
  product: {
    zh: {
      title: "产品思考",
      subtitle: "探讨交互设计、商业逻辑与人文思考。",
      items: [
        { 
          title: "平衡信噪比与效率：Spotify 播客的一种改进方式", 
          subtitle: "解决在播客频道中频繁切换标签页的繁琐体验。",
          date: "2023年11月4日",
          publication: "Design Bootcamp",
          link: "https://medium.com/design-bootcamp/balancing-signal-to-noise-ratio-and-efficiency-an-improved-approach-for-spotify-podcast-9c7dcf49b858"
        },
        { 
          title: "当成功让我们变得机械：数据驱动时代的工匠精神丧失", 
          subtitle: "探讨在效率极致的今天，我们是否丢失了设计的灵魂。",
          date: "2023年9月15日",
          publication: "Personal Journal",
          link: "https://medium.com/@tanxujun895/when-success-makes-us-robotic-the-loss-of-craftsmanship-in-the-data-driven-age-4a19200f3082"
        },
        { 
          title: "我对 Spotify 新 AI 歌单功能的看法", 
          subtitle: "AI 时代的个性化推荐：是进化还是妥协？",
          date: "2024年4月10日",
          publication: "Personal Journal",
          link: "https://medium.com/@tanxujun895/my-take-on-spotifys-new-ai-playlist-feature-ec566f98d268"
        },
        { 
          title: "理解职场中的“为什么”", 
          subtitle: "如何通过深度思考找到工作的核心动力。",
          date: "2023年12月20日",
          publication: "Career Advice",
          link: "https://medium.com/@tanxujun895/understanding-the-why-in-the-workplace-14d8066b5ba8"
        },
        { 
          title: "为什么 Instagram 改变了网格发布尺寸？", 
          subtitle: "从交互逻辑分析社交平台视觉变革背后的意图。",
          date: "2024年2月5日",
          publication: "Product Logic",
          link: "https://medium.com/@tanxujun895/why-did-instagram-change-the-grid-post-size-ec7b91f15cc3"
        },
        { 
          title: "准备 3 个月 PM 面试后的心得体会", 
          subtitle: "产品经理面试背后的逻辑与能力模型重构。",
          date: "2023年8月15日",
          publication: "Career Growth",
          link: "https://medium.com/@tanxujun895/after-spending-3-months-of-preparing-for-pm-interviews-here-is-what-i-learned-38ecdbf67525"
        },
        { 
          title: "ADPList 如何成长为全球导师网络", 
          subtitle: "解构全球化社区的增长密码与社交连接模型。",
          date: "2024年1月22日",
          publication: "Growth Case Study",
          link: "https://medium.com/@tanxujun895/how-adplist-grows-into-a-global-mentorship-network-08bb0f0def81"
        }
      ]
    },
    zt: {
      title: "產品思考",
      subtitle: "探討交互設計、商業邏輯與人文思考。",
      items: [
        { 
          title: "平衡信噪比與效率：Spotify 播客的一種改進方式", 
          subtitle: "解決在播客頻道中頻繁切換標籤頁的繁瑣體驗。",
          date: "2023年11月4日",
          publication: "Design Bootcamp",
          link: "https://medium.com/design-bootcamp/balancing-signal-to-noise-ratio-and-efficiency-an-improved-approach-for-spotify-podcast-9c7dcf49b858"
        },
        { 
          title: "當成功讓我們變得機械：數據驅動時代的工匠精神喪失", 
          subtitle: "探討在效率極致的今天，我們是否丟失了設計的靈魂。",
          date: "2023年9月15日",
          publication: "Personal Journal",
          link: "https://medium.com/@tanxujun895/when-success-makes-us-robotic-the-loss-of-craftsmanship-in-the-data-driven-age-4a19200f3082"
        },
        { 
          title: "我對 Spotify 新 AI 歌單功能的看法", 
          subtitle: "AI 時代的個性化推薦：是進化還是妥協？",
          date: "2024年4月10日",
          publication: "Personal Journal",
          link: "https://medium.com/@tanxujun895/my-take-on-spotifys-new-ai-playlist-feature-ec566f98d268"
        },
        { 
          title: "理解職場中的“為什麼”", 
          subtitle: "如何通過深度思考找到工作的核心動力。",
          date: "2023年12月20日",
          publication: "Career Advice",
          link: "https://medium.com/@tanxujun895/understanding-the-why-in-the-workplace-14d8066b5ba8"
        },
        { 
          title: "為什麼 Instagram 改變了網格發布尺寸？", 
          subtitle: "從交互邏輯分析社交平台視覺變革背後的意圖。",
          date: "2024年2月5日",
          publication: "Product Logic",
          link: "https://medium.com/@tanxujun895/why-did-instagram-change-the-grid-post-size-ec7b91f15cc3"
        },
        { 
          title: "準備 3 個月 PM 面試後的心得體會", 
          subtitle: "產品經理面試背後的邏輯與能力模型重構。",
          date: "2023年8月15日",
          publication: "Career Growth",
          link: "https://medium.com/@tanxujun895/after-spending-3-months-of-preparing-for-pm-interviews-here-is-what-i-learned-38ecdbf67525"
        },
        { 
          title: "ADPList 如何成長為全球導師網絡", 
          subtitle: "解構全球化社區的增長密碼與社交連接模型。",
          date: "2024年1月22日",
          publication: "Growth Case Study",
          link: "https://medium.com/@tanxujun895/how-adplist-grows-into-a-global-mentorship-network-08bb0f0def81"
        }
      ]
    },
    en: {
      title: "Product Thinking",
      subtitle: "Personal reflections on design, business, and humanity.",
      items: [
        { 
          title: "Balancing SNR and Efficiency: Improved approach for Spotify Podcast", 
          subtitle: "Solving the friction of constant tab switching in podcast channels.",
          date: "Nov 4, 2023",
          publication: "Design Bootcamp",
          link: "https://medium.com/design-bootcamp/balancing-signal-to-noise-ratio-and-efficiency-an-improved-approach-for-spotify-podcast-9c7dcf49b858"
        },
        { 
          title: "When Success Makes Us Robotic: Loss of Craftsmanship in Data-Driven Age", 
          subtitle: "Questioning if we've lost the soul of craft in an era of hyper-efficiency.",
          date: "Sep 15, 2023",
          publication: "Personal Journal",
          link: "https://medium.com/@tanxujun895/when-success-makes-us-robotic-the-loss-of-craftsmanship-in-the-data-driven-age-4a19200f3082"
        },
        { 
          title: "My Take on Spotify’s New AI Playlist Feature", 
          subtitle: "Personalization in the AI age: Evolution or compromise?",
          date: "Apr 10, 2024",
          publication: "Personal Journal",
          link: "https://medium.com/@tanxujun895/my-take-on-spotifys-new-ai-playlist-feature-ec566f98d268"
        },
        { 
          title: "Understanding the 'Why' in the Workplace", 
          subtitle: "Finding the core purpose through deep critical thinking.",
          date: "Dec 20, 2023",
          publication: "Career Advice",
          link: "https://medium.com/@tanxujun895/understanding-the-why-in-the-workplace-14d8066b5ba8"
        },
        { 
          title: "Why Did Instagram Change the Grid Post Size?", 
          subtitle: "Analyzing the intent behind visual changes in social platforms.",
          date: "Feb 5, 2024",
          publication: "Product Logic",
          link: "https://medium.com/@tanxujun895/why-did-instagram-change-the-grid-post-size-ec7b91f15cc3"
        },
        { 
          title: "3 Months of PM interview prep: Key Learning Points", 
          subtitle: "The logic behind PM interviews and ability model reconstruction.",
          date: "Aug 15, 2023",
          publication: "Career Growth",
          link: "https://medium.com/@tanxujun895/after-spending-3-months-of-preparing-for-pm-interviews-here-is-what-i-learned-38ecdbf67525"
        },
        { 
          title: "How ADPList Grows into a Global Mentorship Network", 
          subtitle: "Deconstructing growth codes and social connection models.",
          date: "Jan 22, 2024",
          publication: "Growth Case Study",
          link: "https://medium.com/@tanxujun895/how-adplist-grows-into-a-global-mentorship-network-08bb0f0def81"
        }
      ]
    }
  },
  photo: {
    zh: {
      title: "摄影作品",
      subtitle: "捕捉爱。",
      items: []
    },
    zt: {
      title: "攝影作品",
      subtitle: "捕捉愛。",
      items: []
    },
    en: {
      title: "Photography",
      subtitle: "Capturing love.",
      items: []
    }
  },
  about: {
    zh: {
      title: "关于我",
      subtitle: "Hi，我是谭旭君。一名热爱设计与技术的 AI 产品人。",
      experience: [
        {
          period: "2025年9月 - 2026年1月",
          role: "AI 产品负责人",
          company: "牛津大学出版社",
          location: "香港",
          details: [
            "AI 评分策略：评估多种 LLM 针对文理科作业的自动批改效果，建立多维度评分标准。推动混合模型评分引擎集成，平衡评分精度与token成本。",
            "AI 教学设计：针对教学场景设计Prompt策略，优化文言文助教对话质量；建立多维度标签系统，提供学生行为数据洞察与干预报告。",
            "利益相关者与数据策略：引导学术团队上线，设计 xAPI 数据架构分析用户行为分析。"
          ]
        },
        {
          period: "2024年7月 - 2025年8月",
          role: "项目经理",
          company: "津桥教育集团有限公司",
          location: "香港",
          details: [
            "业务流程再造：为财务监控设计自定义模块，构建基于 Airtable 的 ERP 原型。",
            "CRM 优化：将学生追踪流程分解为 4 个状态模块，查询响应时间缩短 60%。",
            "干系人管理：通过多维度仪表盘解决需求冲突，并举办培训工作坊确保用户采纳上手。"
          ]
        },
        {
          period: "2022年8月 - 2024年4月",
          role: "产品设计师",
          company: "NHS Scotland & 圣安德鲁斯大学",
          location: "英国",
          details: [
            "需求与数据伦理：开展焦点小组进行差距分析；管理医疗数据集的脱敏合规。",
            "服务优化：通过 Near Me 视频咨询重新设计用户路径，患者留存率提高 30%。"
          ]
        },
        {
          period: "2026年2月 - 至今",
          role: "AI 技术项目",
          company: "个人",
          location: "远程",
          details: [
            "AI 聊天机器人 (RAG)：使用 Supabase/Cursor 构建 CFA 考试助教；优化检索精度。",
            "自动化流 (n8n)：设计 n8n 管道进行多源数据聚合与 AI 内容合成。",
            "Retro Player（Chrome扩展）：为 YouTube 和 Bilibili 视频添加实时 VHS 滤镜与音频失真效果；获得小红书 20k+ 浏览、1k+ 点赞收藏；入选 Chrome 应用商店精选推荐。",
            "AI Mix Studio: 基于 DeepSeek prompts 与 MiniMax Music 2.6 开发了一款文字转混音工具；通过 pydub crossfade 将生成曲目无缝衔接为完整曲目单；内置自定义p5js雨景生成，打造沉浸式听觉体验。"
          ]
        }
      ],
      education: [
        { degree: "信息技术与管理 硕士 ｜ 圣安德鲁斯大学", period: "2021年9月 - 2022年9月" },
        { degree: "生物医学工程 学士 ｜ 深圳大学", period: "2017年9月 - 2021年6月" }
      ],
      skills: {
        certifications: ["PMP", "PSM", "ABRSM 8 (Violin)", "CFA I Candidate"],
        tools: ["Python", "SQL", "RAG", "AI Agents", "AIGC", "Cursor", "Jira", "Figma", "n8n", "Tableau", "Notion"],
        languages: ["粤语（母语）", "国语（母语）", "英语", "韩语 & 日语 (初级)"]
      }
    },
    zt: {
      title: "關於我",
      subtitle: "Hi，我是譚旭君。一名熱愛設計與技術的 AI 產品負責人。",
      experience: [
        {
          period: "2025年9月 - 2026年1月",
          role: "Associate Product Owner",
          company: "牛津大學出版社",
          location: "香港",
          details: [
                "AI 評分策略：評估多種 LLM 針對文理科作業的自動批改效果，建立多維度評分標準。推動混合模型評分引擎集成，平衡評分精度與token成本。",
                "AI 教學設計：針對教學場景設計Prompt策略，優化文言文助教對話品質；建立多維度標籤系統，提供學生行為資料洞察與介入報告。",
                "利益相關方與數據策略：引導學術團隊上線，設計 xAPI 資料架構分析使用者行為分析。"
          ]
        },
        {
          period: "2024年7月 - 2025年8月",
          role: "項目經理",
          company: "津橋教育集團有限公司",
          location: "香港",
          details: [
            "業務流程再造：為財務監控設計自定義模塊，構建基於 Airtable 的 ERP 原型。",
            "CRM 優化：將學生追蹤流程分解為 4 個狀態模塊，查詢響應時間縮短 60%。",
            "干系人管理：通過多維度儀表盤解決需求衝突，並舉辦公開課確保用戶採納。"
          ]
        },
        {
          period: "2022年8月 - 2024年4月",
          role: "產品設計師",
          company: "NHS Scotland & 聖安德魯斯大學",
          location: "英國",
          details: [
            "需求與數據倫理：開展焦點小組進行差距分析；管理醫療數據集的脫敏合規。",
            "服務優化：通過 Near Me 視頻諮詢重新設計用戶路徑，患者留存率提高 30%。"
          ]
        },
        {
          period: "2026年2月 - 至今",
          role: "AI 技術項目",
          company: "個人",
          location: "遠程",
          details: [
            "AI 聊天機器人 (RAG)：使用 Supabase/Cursor 構建 CFA 考試助教；優化檢索精度。",
            "自動化流 (n8n)：設計 n8n 管道進行多源數據聚合與 AI 內容合成。"
          ]
        }
      ],
      education: [
        { degree: "信息技術與管理 碩士 ｜ 聖安德魯斯大學", period: "2021年9月 - 2022年9月" },
        { degree: "生物醫學工程 學士 ｜ 深圳大學", period: "2017年9月 - 2021年6月" }
      ],
      skills: {
        certifications: ["PMP", "PSM", "ABRSM 8 (Violin)", "CFA I Candidate"],
        tools: ["Python", "SQL", "RAG", "AI Agents", "AIGC", "Cursor", "Jira", "Figma", "n8n", "Tableau", "Notion"],
        languages: ["粵語（母語）", "國語（母語）", "英語", "韓語 & 日語 (初級)"]
      }
    },
    en: {
      title: "About Me",
      subtitle: "Hi, I'm Xujun Tan. A product designer passionate about design and technology.",
      bio: "A product designer passionate about design and technology. I strive to connect people and technology through minimalist and warm designs. With an MSc in IT with Management, I have navigated product and design roles across education, healthcare, and enterprise automation.",
      experience: [
        {
          period: "Sep 2025 - Jan 2026",
          role: "AI Product Owner",
          company: "Oxford University Press",
          location: "Hong Kong",
          details: [
                "AI Marking Strategy: Evaluate the effectiveness of various LLM (Label Learning Model) systems for automated grading of assignments in both arts and sciences, and establish multi-dimensional grading standards. Promote the integration of hybrid model grading engines to balance grading accuracy and token costs.",
                "AI Tutoring chatbot Design: Design a Prompt strategy for teaching scenarios to optimize the quality of teaching assistant dialogues for classical Chinese texts; establish a multi-dimensional tagging system to provide student behavior data insights and intervention reports.",
                "Stakeholder and Data Strategy: Guide academic teams to go live and design an xAPI data architecture for user behavior analysis."
          ]
        },
        {
          period: "Jul 2024 - Aug 2025",
          role: "Project Manager",
          company: "Oxbridge Education Group Limited",
          location: "Hong Kong",
          details: [
            "Business Process Re-engineering: Designed custom modules for financial monitoring; built Airtable ERP prototype.",
            "CRM Optimization: Deconstructed student tracking into status modules, reducing query time by 60%.",
            "Stakeholder Management: Resolved conflicting requirements via multi-dimensional dashboards and user workshops."
          ]
        },
        {
          period: "Aug 2022 - Apr 2024",
          role: "Product Designer",
          company: "NHS Scotland & University of St Andrews",
          location: "United Kingdom",
          details: [
            "Requirements & Data Ethics: Conducted focus groups for gap analysis; managed medical dataset de-identification.",
            "Service Optimization: Redesigned user journeys via Near Me video consulting, improving retention by 30%."
          ]
        },
        {
          period: "Feb 2026 - Present",
          role: "AI Technical Projects",
          company: "Personal",
          location: "Remote",
          details: [
            "AI Chatbot (RAG): Architected RAG chatbot using Supabase/Cursor; optimized retrieval via structured chunking.",
            "Automation Workflow (n8n): Engineered n8n pipelines for multi-source data aggregation and LLM synthesis."
          ]
        }
      ],
      education: [
        { degree: "MSc IT with Management ｜ University of St Andrews", period: "Sep 2021 - Sep 2022" },
        { degree: "BEng Biomedical Engineering | Shenzhen University", period: "Sep 2017 - Jun 2021" }
      ],
      skills: {
        certifications: ["PMP", "Professional Scrum Master (PSM)", "ABRSM 8 (Violin)", "CFA I candidate"],
        tools: ["Python", "SQL", "RAG", "AI Agents", "AIGC", "Cursor", "Jira", "Figma", "n8n", "Tableau", "Notion"],
        languages: ["Cantonese (Native)", "Mandarin (Native)", "English (Fluent)", "Korean & Japanese (Elementary)"]
      }
    }
  }
};

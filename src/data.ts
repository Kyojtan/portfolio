import { CosmicNode } from "./types";

export const INITIAL_TOPICS_DATA: CosmicNode[] = [
  {
    "id": "rag-vs-context",
    "label": "RAG、长上下文、微调怎么选？",
    "question": "企业知识库到底该用 RAG、长上下文还是微调？",
    "conclusions": [
      "知识库场景：RAG > 长上下文 > 微调，核心差异不在技术而在场景",
      "80% 工程精力花在检索质量上——检索排错，模型就看不到对的材料",
      "长上下文 70-80% 填满时召回能力下降，瓶颈不是大小是文档结构化程度",
      "微调适合改行为/风格，不适合存知识——有灾难性遗忘风险"
    ],
    "open_questions": "rerank 策略怎么设计？Hybrid search（语义+关键词混合）的最佳配比？",
    "keywords": ["RAG", "长上下文", "微调", "知识库", "检索", "成本", "召回"],
    "linked_to": ["user-segmentation", "product-interview", "low-cost-trial"],
    "last_active": "2026-05-07",
    "rounds": 3,
    "has_conclusion": true,
    "chat_snapshot": [
      {"who": "你", "text": "我觉得 RAG 最稳，能溯源、成本低"},
      {"who": "yuk", "text": "同意。但隐藏坑：检索排错前几名，模型就看不到对的材料"},
      {"who": "yuk", "text": "三个方案本质：RAG 是外部检索+拼 prompt，长上下文是一次性全塞进去让模型自己看，微调是学进参数里。你选 RAG 是对的——但你要知道它的天花板在哪：如果用户问「过去三个季度定价策略的讨论有什么变化？」，RAG 可能搜不全。这是语义鸿沟问题，80% 的工程精力得花在检索质量上。"},
      {"who": "你", "text": "长上下文 128K 占 10%，应该够用吧？"},
      {"who": "yuk", "text": "不是大小问题，是结构问题。文档层级清晰就没问题"},
      {"who": "yuk", "text": "实测经验：70-80% 填满时召回能力开始下降，但真正瓶颈不是大小，而是文档结构。如果文档本身有清晰的分层——标题、分段、列表——模型还是能处理好的。所以长上下文适合一次性分析大量同类文档（比如 50 份竞品 PDF），不适合需要反复更新的知识库。而微调是最重的方案——更新一次要重新训练，成本巨大，而且有灾难性遗忘。它适合的是改行为风格，不是存知识。"}
    ]
  },
  {
    "id": "user-segmentation",
    "label": "AI 产品的第一批用户是谁？",
    "question": "一个 AI 音乐生成工具，第一批用户优先选谁？",
    "conclusions": [
      "普通用户做裂变拉新，短视频创作者做内容消费转化——两者可合并获客",
      "游戏开发者采购流程长、需求刚性强，适合二期商业化",
      "多版本生成（风格光谱抽样）比随机出 3 个版本更让算法能学习用户偏好"
    ],
    "open_questions": "普通用户的留存策略？短视频创作者的价格敏感度阈值？",
    "keywords": ["用户分层", "音乐生成", "裂变", "获客", "目标用户"],
    "linked_to": ["rag-vs-context", "music-copyright", "low-cost-trial"],
    "last_active": "2026-05-07",
    "rounds": 3,
    "has_conclusion": true,
    "chat_snapshot": [
      {"who": "你", "text": "普通用户做裂变，其次是短视频创作者，最后游戏开发者"},
      {"who": "yuk", "text": "排序合理。补充：普通用户和短视频创作者可以合并获客"},
      {"who": "yuk", "text": "用户分层这个决策背后有个关键洞察：普通用户 and 短视频创作者不是独立的获客成本线。普通用户生成一段音乐后一键分享到抖音/Reels，本身就是帮你拉新。所以产品初期如果能做「生成→分享→裂变」闭环，这两类用户是互相放大的。游戏开发者放最后我也认同——交响乐、场景音、动态自适应配乐这些需求刚性但采购流程长，更适合做二期商业化的高客单价产品线。"},
      {"who": "你", "text": "那就是生成→分享→裂变的闭环"},
      {"who": "yuk", "text": "对。版本策略也很关键——给3个版本让用户选，算法也能学习偏好"},
      {"who": "yuk", "text": "具体怎么做：不是随机生成 3 个版本，而是基于用户输入做「风格光谱抽样」。比如用户输入「悲伤的钢琴曲」，版本 1 偏极简和弦、版本 2 偏电影配乐感、版本 3 偏电子氛围。三个版本覆盖同一情绪的不同表达方式，用户选起来有对比感，算法也能从选择中学习到偏好映射。"}
    ]
  },
  {
    "id": "product-interview",
    "label": "产品面试官到底在考什么？",
    "question": "产品经理面试里什么才是真正的加分项？",
    "conclusions": [
      "四维评分法：产品思维 30% + 技术理解 30% + 逻辑表达 20% + 落地意识 20%",
      "不说「用户需求」而说「什么场景下的什么用户有什么痛点」",
      "加分项：主动说出「如果是 XX 场景我会换方案」，展示场景切换能力"
    ],
    "open_questions": "行为面试（behavioral questions）怎么套进这个框架？",
    "keywords": ["面试", "产品经理", "评分", "框架", "求职", "product sense"],
    "linked_to": ["rag-vs-context", "low-cost-trial"],
    "last_active": "2026-05-07",
    "rounds": 2,
    "has_conclusion": true,
    "chat_snapshot": [
      {"who": "你", "text": "能不能定个评分体系，我每次做完题能知道自己得几分"},
      {"who": "yuk", "text": "好想法。4 个维度，每项 5 分，加权出总分"},
      {"who": "yuk", "text": "这四个维度各有侧重：产品思维看你能不能把模糊需求拆成具体场景——「什么场景下的什么用户有什么痛点」好过泛泛说「用户需求」；技术理解考的是你的「成本感知」——你选的方案要花多少资源、有什么限制、什么时候该换方案；逻辑表达看你有没有分层叙述的习惯，因果链清不清晰；落地意识是最容易被忽略的——你说得再好，没有实施路径、风险预判和折中方案，面试官会觉得你只是纸上谈兵。加分题：主动说「如果是 XX 场景我会换方案」——这展示的不是答案正确，而是你有场景切换的思维习惯。"}
    ]
  },
  {
    "id": "music-copyright",
    "label": "AI 音乐侵权怎么防？",
    "question": "AI 生成音乐怎么既能做出好作品又不涉及版权问题？",
    "conclusions": [
      "声线克隆：音频指纹实时比对版权库 + 5 人以上声纹混合训练做硬约束",
      "风格模仿：自动 embedding 相似度（阈值 0.85）+ 人工抽检混合策略",
      "免责层：用户协议明确侵权责任归属，三层兜底"
    ],
    "open_questions": "风格相似度模型怎么训练？需要什么样的训练数据？",
    "keywords": ["音乐生成", "版权", "声纹", "AI生成", "合规"],
    "linked_to": ["user-segmentation", "rag-vs-context"],
    "last_active": "2026-05-07",
    "rounds": 3,
    "has_conclusion": true,
    "chat_snapshot": [
      {"who": "你", "text": "声线克隆：采 5 个以上人声做混合，防止单一模仿"},
      {"who": "yuk", "text": "工程可行的方案。补充：实时的音频指纹匹配更成熟"},
      {"who": "yuk", "text": "你提的「5 人以上声纹混合」是个面试里能拿到加分的工程方案。但行业成熟做法是两层：训练时对生成音频做实时声纹指纹提取（类似 Shazam 的音频指纹技术），和版权库做模糊匹配，命中则拒绝输出。Suno 现在就是这个逻辑。风格模仿更微妙——不能只靠人，成本太高。合理策略是三层：自动层用音频 embedding 算相似度，人工层只对超过阈值（比如 0.85）的做抽检，免责层让用户在生成协议里确认侵权责任归属。"},
      {"who": "你", "text": "风格模仿让专业人士鉴定？"},
      {"who": "yuk", "text": "混合策略更好：自动筛掉大部分，人工只查可疑的"}
    ]
  },
  {
    "id": "low-cost-trial",
    "label": "怎么低成本试错？",
    "question": "产品经理怎么在不烧钱的情况下快速验证想法？",
    "conclusions": [
      "接到需求先拆三层：核心价值（非做不可）→ 锦上添花（可做但不急）→ 噪音（不该做）",
      "三问过滤法：影响多少用户？产生多少业务价值？消耗多少开发资源？",
      "拆成最小可验证单元，一周内上线看数据——没有反馈闭环的试错是浪费"
    ],
    "open_questions": "三问过滤法的量化标准怎么定？比如「多少用户」算有说服力？",
    "keywords": ["试错", "MVP", "优先级", "验证", "决策"],
    "linked_to": ["user-segmentation", "product-interview"],
    "last_active": "2026-05-07",
    "rounds": 2,
    "has_conclusion": true,
    "chat_snapshot": [
      {"who": "你", "text": "我就是不敢拒绝需求，什么都想接"},
      {"who": "yuk", "text": "新手期都这样。试试：接到需求拆三层"},
      {"who": "yuk", "text": "不敢说「不」的本质不是性格问题，是缺乏判断框架。试试这套：接到一个需求先拆成三层——①核心价值层：这件事不做会怎样？如果答案是不会死，那就不是核心；②锦上添花层：可以提升体验但优先级不高；③噪音层：看起来热闹但经不起追问。然后对噪音层用三问过滤：这个需求影响了多少用户？带来多少业务价值？需要多少开发资源？三问走完，大多数噪音自己消掉了。"}
    ]
  },
  {
    "id": "ai-agent",
    "label": "AI Agent 到底是什么？",
    "question": "Agent 和普通 AI 对话有什么区别？什么时候需要它？",
    "conclusions": [
      "Agent = LLM + 记忆 + 工具调用 + 规划能力，不只是多轮对话",
      "不是所有场景都需要 Agent——简单问答用 RAG 就够",
      "Agent 适合多步骤任务（如订机票/数据分析），单步问答过度设计是常见坑"
    ],
    "open_questions": "Agent 的规划能力怎么评估和调试？",
    "keywords": ["Agent", "AI", "LLM", "工具调用", "规划"],
    "linked_to": ["rag-vs-context", "product-interview"],
    "last_active": "2026-05-06",
    "rounds": 1,
    "has_conclusion": false,
    "chat_snapshot": [
      {"who": "你", "text": "Agent 和普通对话有什么区别？"},
      {"who": "yuk", "text": "Agent = LLM + 记忆 + 工具调用 + 规划。不是所有场景都需要"},
      {"who": "yuk", "text": "Agent 和普通 AI 对话的本质区别不是「能不能聊天」，而是能不能自主规划+执行多步骤任务。普通的对话是你问一句它答一句——这叫 completion。Agent 是你给它一个目标（「帮我分析这个季度的销售数据并生成报告」），它自己拆步骤、调工具、纠错、直到完成。记忆、工具调用、规划，这三个缺一个都不是 Agent。常见的面试陷阱是：把所有 AI 功能都包装成 Agent 去汇报——实际上简单问答场景用 RAG 就够，过度设计 Agent 架构是资源 and 时间的浪费。"}
    ]
  },
  {
    "id": "optical-modules",
    "label": "AI 靠光通信连接",
    "question": "为什么 AI 数据中心需要光模块？",
    "conclusions": [
      "AI 训练是几千块 GPU 并行，它们之间靠光模块传数据",
      "Blackwell 光模块需求是 H100 的 2-4 倍，1.6T 正在取代 800G",
      "中际旭创排产到 2028，AAOI/LITE 跟着 NVIDIA 一起涨"
    ],
    "open_questions": "硅光技术什么时候能取代传统光模块？",
    "keywords": ["光模块", "AAOI", "LITE", "光纤", "数据中心"],
    "linked_to": ["hbm-storage", "cloud-rental", "rag-vs-context"],
    "last_active": "2026-05-07",
    "rounds": 1,
    "has_conclusion": true,
    "chat_snapshot": [
      {"who": "你", "text": "光模块在 AI 里是干什么的？"},
      {"who": "yuk", "text": "GPU 集群不是一块显卡工作，是几千几万块一起训练"},
      {"who": "yuk", "text": "可以理解为 AI 数据中心的血管。H100 训练时几千块 GPU 之间要疯狂同步梯度数据，铜缆传几米就衰减，光模块把电转光通过光纤能传几百米。每块 GPU 配 2-4 个光模块。2025-2026 是建设超级周期，微软 Meta Google 的 CAPEX 同比增长 50-80%。光模块从 400G 到 800G 到 1.6T 每一次升级单价翻倍。中际旭创 Q1 利润暴增 262%。"}
    ]
  },
  {
    "id": "hbm-storage",
    "label": "HBM + SSD = AI 存储分工",
    "question": "HBM、SSD 各扮演什么角色？HBM 为什么最缺？",
    "conclusions": [
      "SSD/NAND 存原始训练数据（仓库），HBM 存模型参数（操作台）",
      "HBM 读取速度是 SSD 的 1000 倍以上",
      "HBM 是整个链条最缺的——产能排到 2027，良率仅 60%",
      "美光靠 HBM 市值破 7000 亿，AMD 涨 18% 靠 HBM 供应恢复"
    ],
    "open_questions": "HBM4 量产会缓解还是加剧供需矛盾？",
    "keywords": ["HBM", "存储", "海力士", "美光", "SSD", "内存墙"],
    "linked_to": ["optical-modules", "cloud-rental", "rag-vs-context"],
    "last_active": "2026-05-07",
    "rounds": 1,
    "has_conclusion": true,
    "chat_snapshot": [
      {"who": "你", "text": "SSD 存训练数据，HBM 存模型参数？"},
      {"who": "yuk", "text": "对。SSD 是仓库，HBM 是操作台"},
      {"who": "yuk", "text": "数据链逐级缓存：SSD（几 TB）→ 内存 → HBM（80-192GB）→ GPU 核心。HBM 放在 GPU 旁边给模型参数住。H100 配 80GB HBM3，Blackwell 配 192GB HBM3e。HBM 是整个链条最缺的环节——SK 海力士和美光的产能全部订光到 2027，良率只有约 60%。美光靠这个市值破 7000 亿，AMD 因为 HBM 供应恢复涨了 18%。"}
    ]
  },
  {
    "id": "cloud-rental",
    "label": "GPU 云租赁：替别人买卡",
    "question": "CoreWeave 这类租赁公司为什么也能暴涨？",
    "conclusions": [
      "创业公司买不起/等不起 GPU，转向云租赁",
      "CoreWeave 本质是替别人买卡、运维、收租金——卡也来自 NVIDIA",
      "CoreWeave 涨说明需求溢出到二级市场，不是替代 NVIDIA",
      "租赁市场爆发反而证明了 NVIDIA 有多缺"
    ],
    "open_questions": "自建算力 vs 云租赁的成本分水岭在哪里？",
    "keywords": ["云租赁", "CoreWeave", "GPU", "算力", "云计算"],
    "linked_to": ["optical-modules", "hbm-storage", "rag-vs-context"],
    "last_active": "2026-05-07",
    "rounds": 1,
    "has_conclusion": true,
    "chat_snapshot": [
      {"who": "你", "text": "CoreWeave 为什么也涨？"},
      {"who": "yuk", "text": "本质上替别人买卡、运维、收租金"},
      {"who": "yuk", "text": "NVIDIA 的 H100/B100 排队等货要 6-12 个月，创业公司等不起。CoreWeave 批量囤卡、运维集群、按小时出租，显卡也是从 NVIDIA 买的。CoreWeave 涨说明 AI 算力需求已经溢出到二级市场——反而证明了 NVIDIA 有多缺。投资逻辑链：AI 爆发 → 大厂追单 GPU → 其他人买不到 → 租赁商囤卡涨价 → 股价涨。"},
      {"who": "yuk", "text": "AI 爆发 → 大厂追单 GPU → GPU 短缺\n                  ↓          ↓           ↓\n              光模块暴涨   HBM 排到2027   云租赁溢价\n                  ↓          ↓           ↓\n              中际旭创    美光/海力士    CoreWeave\n\n整条链的传导逻辑：AI 应用爆发引起 CAPEX 暴增 → GPU 不够用 → 配套的光模块和 HBM 跟着缺 → 买不到 GPU 的公司转向租赁。四个环节没一个过剩，所以全线暴涨。"}
    ]
  }
];

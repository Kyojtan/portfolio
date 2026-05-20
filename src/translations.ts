import { ChatMessage } from "./types";

export interface TranslatedTopic {
  label: string;
  question: string;
  conclusions: string[];
  open_questions: string;
  keywords: string[];
  chat_snapshot?: ChatMessage[];
}

export const EN_TRANSLATIONS: Record<string, TranslatedTopic> = {
  "rag-vs-context": {
    label: "RAG vs. Long Context vs. Fine-Tuning",
    question: "How should enterprise knowledge bases choose between RAG, Large Context, and Fine-Tuning?",
    conclusions: [
      "Knowledge Base: RAG > Long Context > Fine-Tuning. The core difference lies in usage scenarios, not technical superiority.",
      "80% of engineering effort goes into retrieval quality—if retrieval is faulty, the model never sees the right materials.",
      "Recall capacity drops significantly when Long Context is 70-80% full. The real bottleneck is document structure, not size.",
      "Fine-Tuning is for modifying behavior/style, not storing factual knowledge—risk of catastrophic forgetting is high."
    ],
    open_questions: "How to design optimal reranking strategies? What is the ideal mix ratio for Hybrid Search (semantic + keyword)?",
    keywords: ["RAG", "Long Context", "Fine-Tuning", "Knowledge", "Retrieval", "Recall", "Cost"],
    chat_snapshot: [
      { "who": "You", "text": "I think RAG is the most reliable, traceable, and cost-effective option." },
      { "who": "YUK", "text": "Agreed. But a hidden pitfall: if top search results are incorrect, the model never sees the right material." },
      { "who": "YUK", "text": "Essentially, RAG is external search + prepending to prompt; Long Context is pushing everything in and letting the model find it; Fine-Tuning is teaching facts inside parameters. Selection of RAG is correct, but be aware of its ceiling: if a user asks about pricing policy changes over the past 3 quarters, RAG might miss things. It's a semantic gap—80% of engineering goes to search quality." },
      { "who": "You", "text": "Isn't a 128K context window only 10% occupied enough?" },
      { "who": "YUK", "text": "It's not about size, but structure. If the document has a clear hierarchy, it handles it well." },
      { "who": "YUK", "text": "Empirically, recall drops when context is 70-80% full. The bottleneck is document structure. If documents have clear layers—headers, paragraphs, lists—indexers work fine. Thus, Long Context is perfect for one-off analyses (e.g. 50 competitor PDFs), but unfit for active knowledge bases. Fine-tuning is heaviest—requires training on every update, massive cost, and catastrophic forgetting risk. It's for style/behavior, not for factual storage." }
    ]
  },
  "user-segmentation": {
    label: "AI Product's First Cohort of Users?",
    question: "For an AI music generation tool, who should be targeted first?",
    conclusions: [
      "Normal users drive viral growth; short-video creators drive content consumption/conversion—these can be combined.",
      "Game developers have long cycles but high rigidity; suitable for Phase 2 monetization.",
      "Multi-version generation (style spectrum sampling) helps algorithms learn user preferences better than 3 random versions."
    ],
    open_questions: "Retention strategies for normal users? Price sensitivity threshold for short-video creators?",
    keywords: ["User Segments", "Music Gen", "Viral Growth", "Acquisition", "Target Audience"],
    chat_snapshot: [
      { "who": "You", "text": "Normal users first for virality, then short-video creators, then game developers." },
      { "who": "YUK", "text": "Reasonable order. Note that normal users and video creators can share a common acquisition strategy." },
      { "who": "YUK", "text": "Normal users and video creators are not separate CAC lines. Standard users sharing generated music to TikTok/Reels is virally drawing video creators. So creating a loop of 'generate -> share -> viral' expands both. I agree with putting game devs last—orchestral/adaptive audio needs are rigid but sales cycles are long; better for Phase 2 monetization." },
      { "who": "You", "text": "So it is a feedback loop of Generation -> Sharing -> Virality." },
      { "who": "YUK", "text": "Exactly. Version strategy is also key—giving 3 distinct choices helps the algorithm learn user preference mappings." },
      { "who": "YUK", "text": "Exactly: don't just random draw. Use style spectrum sampling. If they input 'sad piano', version 1 is minimalist, version 2 is cinematic, version 3 is ambient electronic. This covers different angles of the same emotion, providing clear contrast for the user and learning vector alignments." }
    ]
  },
  "product-interview": {
    label: "What do interviewers look for?",
    question: "What is the genuine bonus point in a Product Manager interview?",
    conclusions: [
      "4D Scoring model: Product Sense 30% + Tech Understanding 30% + Logical Expression 20% + Delivery Awareness 20%",
      "Formulate 'user pain points' precisely as 'who has what pain point in which specific scenario' rather than broad statements.",
      "Bonus item: Proactively state 'If in XX scenario, I would change the solution' to demonstrate adaptive context switching."
    ],
    open_questions: "How to fit behavioral questions (STAR method) elegantly into this structured framework?",
    keywords: ["Interview", "Product Manager", "Scoring", "Framework", "Job Search", "Product Sense"],
    chat_snapshot: [
      { "who": "You", "text": "Can we establish a precise scoring system? I'd like to score myself after every mock question." },
      { "who": "YUK", "text": "Excellent idea. 4 key dimensions, 5 points each, weighted sum out of 100%." },
      { "who": "YUK", "text": "Each dimension carries substantial weight: Product Sense measures how you dissect fuzzy needs into logical user-problem-context scenarios; Tech Understanding checks cost perception—what resources it drinks, constraints, and toggles; Expression looks for structured bullet narratives; and Delivery is about roadmap realism, risks, and trade-offs. Special bonus: proactively explaining what trigger changes your whole architecture shows true professional flexibility." }
    ]
  },
  "music-copyright": {
    label: "Preventing AI Music Infringement?",
    question: "How to make great AI music without infringing on copyrights?",
    conclusions: [
      "Voice Cloning: Real-time audio fingerprint matching with database + 5+ voice print mixed training as a hard constraint.",
      "Style Imitation: Hybrid strategy of automatic embedding similarity (threshold 0.85) + manual sampling.",
      "Disclaimer layer: User agreements clearly allocate infringement responsibility, acting as a triple safety net."
    ],
    open_questions: "How to train the style similarity model? What training data is required?",
    keywords: ["Music Gen", "Copyright", "Voiceprint", "AI Generation", "Compliance"],
    chat_snapshot: [
      { "who": "You", "text": "Voice cloning: sample 5+ voices for mixing to prevent explicit mimicry." },
      { "who": "YUK", "text": "An engineering viable solution! Note that real-time fingerprint hashing is also standard practice now." },
      { "who": "YUK", "text": "Your 5-person voice print blend is highly viable. Mature ecosystems use two layers: index generation hashes (similar to Shazam's fingerprinter) to fuzzily match catalog files, blocking outputs exceeding threshold. Style imitation is more delicate—automate embedding distance metrics first, then route borderline cases (e.g. >0.85 similarity) to humans." },
      { "who": "You", "text": "So style imitation is assessed by professionals?" },
      { "who": "YUK", "text": "A hybrid flow works best: automated pruning eliminates clear passes/fails, humans inspect questionable cases." }
    ]
  },
  "low-cost-trial": {
    label: "Low-cost Trial & Error?",
    question: "How can product managers validate ideas quickly without burning money?",
    conclusions: [
      "Deconstruct requirements into 3 layers: Core Value (must do) -> Nice to Have (non-urgent) -> Noise (should avoid).",
      "Three-Question Filtering: How many users does it affect? What business value does it yield? How much dev resources?",
      "Deconstruct into a Minimum Viable Unit (MVP), launch within a week—trial without feedback loops is wasted."
    ],
    open_questions: "How to define quantitative standards for the 3 questions? e.g., how many users is convincing?",
    keywords: ["Trial & Error", "MVP", "Priority", "Validation", "Decision"],
    chat_snapshot: [
      { "who": "You", "text": "I struggle to say no to requests. I end up accepting everything." },
      { "who": "YUK", "text": "Very common for beginners. Tackle it by categorizing every intake into three distinct value segments." },
      { "who": "YUK", "text": "Saying yes to everything is usually not a willpower issue but the absence of an operating filter. Implement this: place everything in Core Value, Nice-to-Have, or pure Ambient Noise. For Ambient Noise, ask: how many active cohorts see this? What metric does this move? How many sprint cycles does it burn? Usually, the noise filters itself out once forced to speak in metrics." }
    ]
  },
  "ai-agent": {
    label: "What is an AI Agent exactly?",
    question: "What is the difference between an Agent and standard LLM chat? When do we need it?",
    conclusions: [
      "Agent = LLM + Memory + Tool Use + Planning, not just multi-turn chat.",
      "Not all scenarios need Agents—simple Q&A using RAG is sufficient.",
      "Agents are suited for multi-step tasks (e.g. flight booking/data analysis). Single-step Q&A Agent is a common pitfall."
    ],
    open_questions: "How to evaluate and debug the planning capability of an Agent?",
    keywords: ["Agent", "AI", "LLM", "Tool Call", "Planning"],
    chat_snapshot: [
      { "who": "You", "text": "What is the key difference between an Agent and traditional prompts?" },
      { "who": "YUK", "text": "Agent = LLM + Memory + Tool Use + Planning. It resolves multi-tier workflows autonomously." },
      { "who": "YUK", "text": "The core of an Agent is autonomous planning and tool execution. Prompts are completion tasks (one feedback loop). Agents accept high-level goals ('analyze Q2 sales logs and file a slide'), parse sub-actions, fetch python/SQL tools, check results, and keep looping. Memory, tools, and planners are non-negotiable. Over-designing standard QA into an Agent is a classic pitfall." }
    ]
  },
  "optical-modules": {
    label: "AI Connected by Optical Modules",
    question: "Why do AI data centers require optical transceiver modules?",
    conclusions: [
      "AI training requires thousands of GPUs working in parallel, transmitting huge gradients via optical modules.",
      "Blackwell requires 2-4x more optical modules than H100; 1.6T is replacing 800G.",
      "Innolight is scheduled to 2028; AAOI/LITE stocks surging along with NVIDIA."
    ],
    open_questions: "When will silicon photonics technology replace traditional optical modules?",
    keywords: ["Optical Module", "AAOI", "LITE", "Fiber", "Data Center"],
    chat_snapshot: [
      { "who": "You", "text": "What is the exact function of optical modules in AI clusters?" },
      { "who": "YUK", "text": "GPU clusters don't train in isolation—they need to synchronize gradients across thousands of nodes constantly." },
      { "who": "YUK", "text": "Think of them as the blood vessels of AI. GPUs need extremely high-speed interconnects. Copper degrades over meters, whereas optical converts electric signals into light to travel over fiber without latency and degradation. With Microsoft, Meta, and Google CAPEX soaring, 800G is rapidly upgrading to 1.6T, doubling average unit pricing." }
    ]
  },
  "hbm-storage": {
    label: "HBM + SSD = AI Storage Division",
    question: "What roles do HBM and SSD play? Why is HBM in shortest supply?",
    conclusions: [
      "SSD/NAND stores raw training data (warehouse); HBM stores model parameters (operating table).",
      "HBM read speed is over 1000 times faster than SSD.",
      "HBM is the most critical bottleneck—capacity booked to 2027, with only 60% yields.",
      "Micron's market cap surged past 700B due to HBM; AMD gained 18% as HBM supply recovered."
    ],
    open_questions: "Will HBM4 mass production ease or exacerbate the supply-demand bottleneck?",
    keywords: ["HBM", "Storage", "Hynix", "Micron", "SSD", "Memory Wall"],
    chat_snapshot: [
      { "who": "You", "text": "So SSD acts as the offline warehouse, while HBM is the high-speed operating memory closest to GPU cores?" },
      { "who": "YUK", "text": "Yes, exactly. Raw dataset goes to SSD, active neural network parameters go to HBM." },
      { "who": "YUK", "text": "Correct. Transfer goes SSD (TBs) -> RAM -> HBM (to feed GPU cores). H100 clusters utilize 80GB HBM3 while Blackwell uses 192GB HBM3e. Booking schedules are capped through 2027 by SK Hynix and Micron. It is the absolute highest leverage point of AI hardware scarcity." }
    ]
  },
  "cloud-rental": {
    label: "GPU Cloud Rental: Buying for Others",
    question: "Why are rental companies like CoreWeave also booming?",
    conclusions: [
      "Startups can neither afford nor wait for GPUs, so they lease from cloud rental providers.",
      "CoreWeave conceptually purchases GPUs, operates clusters, and rents them—cards still sourced from NVIDIA.",
      "CoreWeave's success proves GPU demand is spilling over, not replacing NVIDIA.",
      "Leasing boom is the ultimate proof of how scarce GPU chips are."
    ],
    open_questions: "Where is the cost-benefit inflection point between self-built compute and GPU cloud lease?",
    keywords: ["Cloud Lease", "CoreWeave", "GPU", "Compute", "Cloud Cooking"],
    chat_snapshot: [
      { "who": "You", "text": "What drives the insane valuation of CoreWeave and GPU hosters?" },
      { "who": "YUK", "text": "Because they buy, optimize, rack, power up, and rent GPUs to teams unable to wait 12 months for direct sales." },
      { "who": "YUK", "text": "NVIDIA lead times are massive. Startups rent on-demand instead. This doesn't replace NVIDIA, it amplifies NVIDIA's downstream control because rental teams pay higher premium rates, validating the structural scarcity across the hardware landscape." }
    ]
  }
};

export const UI_TEXTS = {
  cn: {
    searchPlaceholder: "搜索思维、信号或标签...",
    nodesHeadline: "核心思想基座",
    activeNodeTag: "思考基座",
    noNodeSelected: "选择节点展开剖析",
    discussionRecord: "学术思维记录",
    addYourInsight: "追加你对此想法的理解或提问...",
    recordButton: "记录",
    resolvedConclusions: "核心收敛决策成果",
    forwardConcerns: "未竟课题与方向",
    deselect: "清除选择",
    totalNodes: "节点总数",
    units: "个",
    thinkBase: "思考基座",
    yourPrefix: "你:",
    yukPrefix: "YUK companion:"
  },
  en: {
    searchPlaceholder: "Search thoughts, signals, or tags...",
    nodesHeadline: "Core Insights",
    activeNodeTag: "Thought Core",
    noNodeSelected: "Select a node to inspect",
    discussionRecord: "Discussion Record",
    addYourInsight: "Add your follow-up ideas or inputs here...",
    recordButton: "Record",
    resolvedConclusions: "Resolved Conclusions",
    forwardConcerns: "Forward Concerns",
    deselect: "Deselect",
    totalNodes: "Total Nodes",
    units: "units",
    thinkBase: "THOUGHT NODE",
    yourPrefix: "You:",
    yukPrefix: "YUK companion:"
  }
};

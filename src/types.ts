export interface ChatMessage {
  who: '你' | 'yuk' | string;
  text: string;
}

export interface CosmicNode {
  id: string;
  label: string;
  question: string;
  conclusions: string[];
  open_questions?: string;
  keywords?: string[];
  linked_to?: string[];
  last_active: string;
  rounds?: number;
  has_conclusion?: boolean;
  chat_snapshot?: ChatMessage[];
  
  // D3 force simulation coordinates (optional for safety check)
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface CosmicLink {
  source: string | CosmicNode;
  target: string | CosmicNode;
}

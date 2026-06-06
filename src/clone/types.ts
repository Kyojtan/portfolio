export type Language = "CN" | "TW" | "EN";

export interface Message {
  id: string;
  role: "ai" | "user";
  senderName: string;
  time: string;
  text: string;
  isTyping?: boolean;
  image?: string;
  audio?: string;
  isNudge?: boolean;
}

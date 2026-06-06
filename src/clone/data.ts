import { Language } from "./types";

export const LOCALES: Record<
  Language,
  {
    onlineStatus: string;
    chatPromptPlaceholder: string;
    chatWelcome: string;
    clearBtn: string;
    nowConnecting: string;
  }
> = {
  EN: {
    onlineStatus: "online",
    chatPromptPlaceholder: "Type a message...",
    chatWelcome:
      "Hello and welcome! What are you up to these days?",
    clearBtn: "Clear",
    nowConnecting: "Thinking slowly...",
  },
  CN: {
    onlineStatus: "在线",
    chatPromptPlaceholder: "输入消息...",
    chatWelcome: "你好呀 歡迎你來～ 最近在忙什麼呀？～",
    clearBtn: "清空",
    nowConnecting: "慢速思考中...",
  },
  TW: {
    onlineStatus: "在線",
    chatPromptPlaceholder: "輸入訊息...",
    chatWelcome: "你好呀 歡迎你來 最近在忙什麼呀？～",
    clearBtn: "清空",
    nowConnecting: "慢速思考中...",
  },
};

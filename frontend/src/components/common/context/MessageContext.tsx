"use client";

import { createContext, useState, useContext, ReactNode } from "react";

// コンテキストの型定義
type MessageContextType = {
  message: string | null;
  setMessage: (message: string | null) => void;
};

// コンテキストの作成
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// コンテキストプロバイダーコンポーネント
export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <MessageContext.Provider value={{ message, setMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

// カスタムフック
export const useMessage = (): MessageContextType => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessage must be used within a MessageProvider");
  }
  return context;
};

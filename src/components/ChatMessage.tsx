
import React from "react";
import { cn } from "@/lib/utils";
import UserAvatar from "./UserAvatar";
import AIAvatar from "./AIAvatar";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatMessage({ message, isUser, timestamp }: ChatMessageProps) {
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "numeric",
  }).format(timestamp);

  return (
    <div
      className={cn(
        "flex w-full gap-3 py-4",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && <AIAvatar />}
      <div
        className={cn(
          "flex flex-col max-w-[80%] md:max-w-[70%]",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2",
            isUser
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          <p className="text-sm md:text-base whitespace-pre-wrap break-words">{message}</p>
        </div>
        <span className="text-xs text-muted-foreground mt-1 px-1">
          {formattedTime}
        </span>
      </div>
      {isUser && <UserAvatar />}
    </div>
  );
}

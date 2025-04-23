
import React, { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatMessage from "./ChatMessage";
import LoadingMessage from "./LoadingMessage";
import { Message } from "@/types/chat";

interface ChatContainerProps {
  messages: Message[];
  isLoading: boolean;
}

export default function ChatContainer({ messages, isLoading }: ChatContainerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <ScrollArea ref={scrollRef} className="flex-1 chat-container p-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold text-gemini-purple mb-4">Welcome to Gemini</h2>
            <p className="text-muted-foreground mb-2">
              Ask me anything or try these examples:
            </p>
            <div className="flex flex-col gap-2">
              <ExamplePrompt text="Write a story about a robot learning to feel emotions" />
              <ExamplePrompt text="Explain quantum computing like I'm 10 years old" />
              <ExamplePrompt text="Help me plan a 7-day trip to Japan" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              isUser={message.role === "user"}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && <LoadingMessage />}
        </div>
      )}
    </ScrollArea>
  );
}

function ExamplePrompt({ text }: { text: string }) {
  return (
    <div className="bg-secondary text-secondary-foreground px-4 py-2 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors text-sm text-left">
      {text}
    </div>
  );
}

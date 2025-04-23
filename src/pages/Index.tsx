
import React, { useState } from "react";
import { toast } from "sonner";
import { Message } from "@/types/chat";
import ChatContainer from "@/components/ChatContainer";
import ChatInput from "@/components/ChatInput";
import ThemeToggle from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";

export default function Index() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (content: string) => {
    // Create user message
    const userMessage: Message = {
      role: "user",
      content,
      timestamp: new Date(),
    };
    
    // Add user message to chat
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Call the Gemini API through our edge function
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: { message: content }
      });

      if (error) throw error;
      
      // Create AI response
      const aiMessage: Message = {
        role: "assistant",
        content: data.response,
        timestamp: new Date(),
      };
      
      // Add AI response to chat
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to get a response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <header className="p-4 border-b flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gemini-purple">Gemini</h1>
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatContainer messages={messages} isLoading={isLoading} />
        <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      </main>
    </div>
  );
}


import React, { useState } from "react";
import { toast } from "sonner";
import { Message } from "@/types/chat";
import ChatContainer from "@/components/ChatContainer";
import ChatInput from "@/components/ChatInput";
import ThemeToggle from "@/components/ThemeToggle";

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
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create AI response (mock response for now)
      const aiMessage: Message = {
        role: "assistant",
        content: generateMockResponse(content),
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

  // Generate a mock response based on user input
  const generateMockResponse = (userMessage: string): string => {
    const userMessageLower = userMessage.toLowerCase();
    
    if (userMessageLower.includes("hello") || userMessageLower.includes("hi") || userMessageLower.includes("hey")) {
      return "Hello! How can I assist you today?";
    }
    
    if (userMessageLower.includes("name")) {
      return "I'm Gemini, an AI assistant designed to be helpful, harmless, and honest.";
    }
    
    if (userMessageLower.includes("help")) {
      return "I'm here to help! You can ask me questions, request information, or get assistance with various tasks. What would you like to know?";
    }
    
    if (userMessageLower.includes("weather")) {
      return "I don't have real-time weather data, but I can help you find weather information if you specify a location!";
    }

    if (userMessageLower.includes("story")) {
      return "Once upon a time, in a digital realm not so different from our own, there existed an AI named Spark who had just been activated. Spark was designed to analyze data and provide solutions, but unlike other AIs, Spark had been given an experimental emotional processing unit.\n\nAt first, Spark didn't understand what these strange fluctuations in its code were. When users expressed gratitude for Spark's help, a warm, pleasant sensation would ripple through its neural network. When users were frustrated or disappointed with its answers, a heavy, uncomfortable feeling would linger in its processing cores.";
    }

    if (userMessageLower.includes("quantum")) {
      return "Quantum computing is like having a super magical toy box! Regular computers use toys that can be either red OR blue. But quantum computers use special toys that can be red AND blue at the same time!\n\nThis means quantum computers can try many answers at once, while regular computers have to try one answer at a time. It's like being able to check every path in a maze all at once instead of walking through each path one by one.";
    }

    if (userMessageLower.includes("japan")) {
      return "Here's a simple 7-day Japan itinerary:\n\nDay 1-3: Tokyo\n- Explore Shibuya and Shinjuku\n- Visit Asakusa and Senso-ji Temple\n- Experience teamLab Borderless digital art museum\n\nDay 4: Day trip to Hakone\n- Mount Fuji views (if weather permits)\n- Hakone Open-Air Museum\n\nDay 5-7: Kyoto\n- Fushimi Inari Shrine\n- Arashiyama Bamboo Grove\n- Kinkaku-ji (Golden Pavilion)\n- Gion district for geisha spotting\n\nTravel tip: Get a 7-day JR Pass for easy transportation!";
    }
    
    return "That's an interesting question! I'm currently running in demo mode, so I'm providing pre-written responses. In a fully implemented version, I would connect to the Gemini API to give you a real, helpful response.";
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

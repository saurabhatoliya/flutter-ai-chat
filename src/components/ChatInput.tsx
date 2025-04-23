
import React, { useState, FormEvent, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import VoiceRecorder from "./VoiceRecorder";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export default function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = message.trim();
    if (trimmedMessage && !isLoading) {
      onSendMessage(trimmedMessage);
      setMessage("");
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTranscription = (text: string) => {
    if (text && text.trim()) {
      setMessage(prev => {
        // If there's already text, append with a space
        return prev.trim() ? `${prev.trim()} ${text}` : text;
      });
      
      if (textareaRef.current) {
        // Focus the textarea after receiving transcription
        setTimeout(() => textareaRef.current?.focus(), 100);
      }
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [message]);

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 bg-background p-4 border-t"
    >
      <div className="relative flex items-center">
        <Textarea
          ref={textareaRef}
          placeholder="Message Gemini..."
          className="pr-24 resize-none min-h-12 max-h-36"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          aria-label="Chat input"
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
          <VoiceRecorder onTranscription={handleTranscription} isLoading={isLoading} />
          <Button
            type="submit"
            size="icon"
            disabled={!message.trim() || isLoading}
            aria-label="Send message"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className="text-xs text-muted-foreground text-center">
        Gemini may display inaccurate info, including about people, places, or facts
      </div>
    </form>
  );
}

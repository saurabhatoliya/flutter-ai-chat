
import React from "react";
import AIAvatar from "./AIAvatar";

export default function LoadingMessage() {
  return (
    <div className="flex w-full gap-3 py-4">
      <AIAvatar />
      <div className="flex items-center gap-1 mt-2">
        <div className="w-2 h-2 rounded-full bg-gemini-purple animate-bounce-gentle" style={{ animationDelay: "0ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-gemini-purple animate-bounce-gentle" style={{ animationDelay: "200ms" }}></div>
        <div className="w-2 h-2 rounded-full bg-gemini-purple animate-bounce-gentle" style={{ animationDelay: "400ms" }}></div>
      </div>
    </div>
  );
}

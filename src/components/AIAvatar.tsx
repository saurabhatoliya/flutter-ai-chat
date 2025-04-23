
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function AIAvatar() {
  return (
    <Avatar className="h-8 w-8 md:h-10 md:w-10">
      <AvatarFallback className="bg-gemini-purple text-white">AI</AvatarFallback>
    </Avatar>
  );
}

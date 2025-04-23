
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function UserAvatar() {
  return (
    <Avatar className="h-8 w-8 md:h-10 md:w-10">
      <AvatarImage src="" alt="User" />
      <AvatarFallback className="bg-primary text-primary-foreground">U</AvatarFallback>
    </Avatar>
  );
}

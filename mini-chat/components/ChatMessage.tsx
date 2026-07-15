import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Scale, UserRound } from "lucide-react";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export default function ChatMessage({ content, role }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={`mb-3 flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <Avatar className="mt-2 h-9 w-9 border border-slate-100 bg-white shadow-sm">
        {isUser && (
          <AvatarImage
            src="/user-avatar.jpg"
            alt="User Avatar"
            className="object-cover"
          />
        )}
        <AvatarFallback
          className={
            isUser ? "bg-slate-100 text-slate-600" : "bg-blue-600 text-white"
          }
        >
          {isUser ? (
            <UserRound className="size-4" />
          ) : (
            <Scale className="size-4" />
          )}
        </AvatarFallback>
      </Avatar>

      <div
        className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-6 shadow-sm md:max-w-[58%] ${
          isUser
            ? "bg-[#f3f5f9] text-slate-800"
            : "border border-slate-200 bg-white text-slate-800"
        }`}
      >
        {content}
      </div>
    </div>
  );
}

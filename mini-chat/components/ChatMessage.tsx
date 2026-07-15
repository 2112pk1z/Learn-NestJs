import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  content: string;
  role: "user" | "assistant";
}

export default function ChatMessage({ content, role }: ChatMessageProps) {
  const isUser = role === "user";
  return (
    <div
      className={`flex gap-3 mb-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
    >
      <Avatar className="w-8 h-8">
        <AvatarFallback
          className={
            isUser ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
          }
        >
          {isUser ? "U" : "AI"}
        </AvatarFallback>
      </Avatar>
      <div
        className={`rounded-lg px-4 py-2 max-w-[75%] md:max-w-[55%] ${isUser ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"}`}
      >
        {content}
      </div>
    </div>
  );
}

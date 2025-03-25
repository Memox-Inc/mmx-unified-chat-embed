"use client";
import Home from "@/components/chat/chat-widget/ChatWidget";

interface EmbedParams {
  chatflowid: string;
  // Add other expected query params here
}

export default function EmbedChatPage({
  searchParams,
}: {
  searchParams: EmbedParams;
}) {
  return (
    <div className="h-screen w-full bg-transparent">
      <Home chatflowId={searchParams.chatflowid} embedMode={true} />
    </div>
  );
}

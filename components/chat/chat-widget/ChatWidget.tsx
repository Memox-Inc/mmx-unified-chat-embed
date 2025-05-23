import React, { useState, useEffect } from "react";
import ChatButtonComponent from "@/components/chat/button/ChatButtonComponent";
import ChatWindowComponent from "@/components/chat/chat-window/ChatWindowComponent";
export default function Home() {
  //State Management for Chat Window
  const [chatOpen, setChatOpen] = useState(false);

  // Open and close chat window
  const openChat = () => {
    setChatOpen(true);
    console.log('Open Chat');
  };

  const closeChat = () => {
    setChatOpen(false);
    console.log('Close Chat');
  };

   // Use useEffect to handle the Escape key event
   useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeChat();
      }
    };

    // Add event listener when chatOpen is true
    if (chatOpen) {
      window.addEventListener('keydown', handleEscapeKey);
    } else {
      window.removeEventListener('keydown', handleEscapeKey);
    }

    // Cleanup event listener on unmount or when chatOpen changes
    return () => {
      window.removeEventListener('keydown', handleEscapeKey);
    };
  }, [chatOpen]);

  return (
    <>
      <ChatButtonComponent
        position="right-5"
        bottomMargin="bottom-5"
        onClick={openChat}
      />
      

      {/* Always render the Chat Window */}
      <ChatWindowComponent 
        chatTitleTextColor="text-slate-900"
        chatOpen={chatOpen} 
        companyName="Company Name"
        
        closeChat={closeChat} 
        userMessageColor="bg-gray-300" 
        aiMessageColor="bg-black" 
        aiTextColor="text-white" 
        userTextColor="text-black" />
    </>
  );
}

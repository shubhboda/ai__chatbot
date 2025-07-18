import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ChatHeader from '../../components/ui/ChatHeader';
import ConversationSwitcher from '../../components/ui/ConversationSwitcher';
import ChatContainer from './components/ChatContainer';

const ChatInterface = () => {
  const [searchParams] = useSearchParams();
  const [currentConversation, setCurrentConversation] = useState(null);
  const conversationId = searchParams.get('id');

  useEffect(() => {
    if (conversationId) {
      // Load conversation from localStorage
      const savedConversation = localStorage.getItem(`conversation_${conversationId}`);
      if (savedConversation) {
        setCurrentConversation(JSON.parse(savedConversation));
      }
    }
  }, [conversationId]);

  const handleConversationUpdate = (conversation) => {
    setCurrentConversation(conversation);
  };

  const handleConversationChange = (conversation) => {
    setCurrentConversation(conversation);
    if (conversation) {
      window.history.pushState({}, '', `/chat-interface?id=${conversation.id}`);
    } else {
      window.history.pushState({}, '', '/chat-interface');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <ChatHeader />

      {/* Main Content */}
      <div className="pt-16 h-screen flex flex-col">
        {/* Conversation Switcher */}
        <div className="border-b border-border bg-background px-4 py-3">
          <div className="flex items-center justify-between">
            <ConversationSwitcher
              currentConversation={currentConversation}
              onConversationChange={handleConversationChange}
            />
            
            {/* Conversation Info */}
            {currentConversation && (
              <div className="hidden sm:flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Last active: {new Date(currentConversation.lastActivity).toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Chat Container */}
        <div className="flex-1 overflow-hidden">
          <ChatContainer
            conversationId={conversationId}
            onConversationUpdate={handleConversationUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
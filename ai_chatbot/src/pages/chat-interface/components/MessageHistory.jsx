import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const MessageHistory = ({ 
  messages, 
  isTyping, 
  onCopyMessage, 
  onReactToMessage,
  autoScroll = true 
}) => {
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);

  const scrollToBottom = () => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'end'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleCopy = (messageId) => {
    if (onCopyMessage) {
      onCopyMessage(messageId);
    }
  };

  const handleReaction = (messageId, reaction) => {
    if (onReactToMessage) {
      onReactToMessage(messageId, reaction);
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth"
      style={{ 
        scrollbarWidth: 'thin',
        scrollbarColor: 'var(--color-muted) transparent'
      }}
    >
      {/* Welcome Message */}
      {messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">AI</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              Welcome to AI Chatbot
            </h3>
            <p className="text-muted-foreground max-w-md">
              I'm here to help you with questions, provide information, and assist with various tasks. 
              Start a conversation by typing a message below.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 max-w-md">
            <div className="p-3 bg-card border border-border rounded-lg text-sm">
              <div className="font-medium text-foreground mb-1">💡 Ask questions</div>
              <div className="text-muted-foreground text-xs">Get answers on any topic</div>
            </div>
            <div className="p-3 bg-card border border-border rounded-lg text-sm">
              <div className="font-medium text-foreground mb-1">🔧 Get help</div>
              <div className="text-muted-foreground text-xs">Assistance with tasks</div>
            </div>
            <div className="p-3 bg-card border border-border rounded-lg text-sm">
              <div className="font-medium text-foreground mb-1">💬 Chat naturally</div>
              <div className="text-muted-foreground text-xs">Conversational interface</div>
            </div>
            <div className="p-3 bg-card border border-border rounded-lg text-sm">
              <div className="font-medium text-foreground mb-1">📚 Learn together</div>
              <div className="text-muted-foreground text-xs">Explore topics in depth</div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      {messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          onCopy={handleCopy}
          onReaction={handleReaction}
        />
      ))}

      {/* Typing Indicator */}
      <TypingIndicator isVisible={isTyping} />

      {/* Scroll Anchor */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageHistory;
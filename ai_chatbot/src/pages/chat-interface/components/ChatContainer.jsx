import React, { useState, useEffect, useCallback } from 'react';
import MessageHistory from './MessageHistory';
import MessageInput from './MessageInput';
import QuickActions from '../../../components/ui/QuickActions';

const ChatContainer = ({ conversationId, onConversationUpdate }) => {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentConversation, setCurrentConversation] = useState(null);

  // Mock AI responses for demonstration
  const mockAIResponses = [
    "I understand your question. Let me help you with that.",
    "That\'s an interesting point. Here\'s what I think about it...",
    "Based on the information you've provided, I can suggest the following approach:",
    "Great question! This is a common topic that many people ask about.",
    "I\'d be happy to explain that concept in more detail for you.",
    "Let me break this down into simpler terms to make it easier to understand.",
    "That's a complex topic, but I'll do my best to provide a clear explanation.",
    "I can see why that might be confusing. Let me clarify that for you.",
    "Here\'s a step-by-step approach you can follow:",
    "That\'s a valid concern. Here are some ways to address it:"
  ];

  // Initialize conversation
  useEffect(() => {
    if (conversationId) {
      // Load existing conversation
      const savedConversation = localStorage.getItem(`conversation_${conversationId}`);
      if (savedConversation) {
        const parsed = JSON.parse(savedConversation);
        setMessages(parsed.messages || []);
        setCurrentConversation(parsed);
      }
    } else {
      // Start new conversation
      setMessages([]);
      setCurrentConversation(null);
    }
  }, [conversationId]);

  // Save conversation to localStorage
  const saveConversation = useCallback((updatedMessages) => {
    const conversation = {
      id: conversationId || `conv_${Date.now()}`,
      title: updatedMessages.length > 0 ? 
        updatedMessages[0].content.substring(0, 50) + '...' : 'New Conversation',
      messages: updatedMessages,
      timestamp: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };

    localStorage.setItem(`conversation_${conversation.id}`, JSON.stringify(conversation));
    setCurrentConversation(conversation);
    
    if (onConversationUpdate) {
      onConversationUpdate(conversation);
    }
  }, [conversationId, onConversationUpdate]);

  // Simulate AI response
  const generateAIResponse = useCallback(async (userMessage) => {
    setIsTyping(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000));
    
    const randomResponse = mockAIResponses[Math.floor(Math.random() * mockAIResponses.length)];
    
    const aiMessage = {
      id: `msg_${Date.now()}_ai`,
      sender: 'ai',
      content: randomResponse,
      timestamp: new Date(),
      status: 'delivered'
    };

    setMessages(prev => {
      const updated = [...prev, aiMessage];
      saveConversation(updated);
      return updated;
    });
    
    setIsTyping(false);
  }, [saveConversation]);

  // Handle sending message
  const handleSendMessage = useCallback(async (content) => {
    const userMessage = {
      id: `msg_${Date.now()}_user`,
      sender: 'user',
      content,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => {
      const updated = [...prev, userMessage];
      saveConversation(updated);
      return updated;
    });

    // Generate AI response
    await generateAIResponse(content);
  }, [generateAIResponse, saveConversation]);

  // Handle copying message
  const handleCopyMessage = useCallback((messageId) => {
    const message = messages.find(msg => msg.id === messageId);
    if (message) {
      navigator.clipboard.writeText(message.content);
      // You could show a toast notification here
    }
  }, [messages]);

  // Handle message reaction
  const handleReactToMessage = useCallback((messageId, reaction) => {
    setMessages(prev => {
      const updated = prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, reaction }
          : msg
      );
      saveConversation(updated);
      return updated;
    });
  }, [saveConversation]);

  // Handle clearing chat
  const handleClearChat = useCallback(() => {
    setMessages([]);
    if (conversationId) {
      localStorage.removeItem(`conversation_${conversationId}`);
    }
    setCurrentConversation(null);
    if (onConversationUpdate) {
      onConversationUpdate(null);
    }
  }, [conversationId, onConversationUpdate]);

  // Handle exporting chat
  const handleExportChat = useCallback(() => {
    if (messages.length === 0) return;

    const exportData = {
      conversation: currentConversation,
      messages: messages.map(msg => ({
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp
      })),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [messages, currentConversation]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Quick Actions */}
      <QuickActions
        onClearChat={handleClearChat}
        onExportChat={handleExportChat}
        conversationId={currentConversation?.id}
      />

      {/* Message History */}
      <MessageHistory
        messages={messages}
        isTyping={isTyping}
        onCopyMessage={handleCopyMessage}
        onReactToMessage={handleReactToMessage}
      />

      {/* Message Input */}
      <MessageInput
        onSendMessage={handleSendMessage}
        disabled={isTyping}
        placeholder="Type your message..."
      />
    </div>
  );
};

export default ChatContainer;
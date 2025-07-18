import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';


const ConversationSwitcher = ({ currentConversation, onConversationChange }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const recentConversations = [
    {
      id: '1',
      title: 'React Best Practices',
      timestamp: '2 hours ago',
      preview: 'How to optimize React components...'
    },
    {
      id: '2',
      title: 'API Integration Help',
      timestamp: '1 day ago',
      preview: 'Need help with REST API calls...'
    },
    {
      id: '3',
      title: 'Database Design',
      timestamp: '3 days ago',
      preview: 'What\'s the best approach for...'
    }
  ];

  const handleConversationSelect = (conversation) => {
    if (onConversationChange) {
      onConversationChange(conversation);
    }
    setIsDropdownOpen(false);
    if (location.pathname !== '/chat-interface') {
      navigate('/chat-interface');
    }
  };

  const handleViewAllHistory = () => {
    navigate('/chat-history');
    setIsDropdownOpen(false);
  };

  const handleNewConversation = () => {
    if (onConversationChange) {
      onConversationChange(null);
    }
    navigate('/chat-interface');
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        iconName="ChevronDown"
        iconPosition="right"
        iconSize={16}
        className="text-muted-foreground hover:text-foreground"
      >
        {currentConversation ? currentConversation.title : 'Select Conversation'}
      </Button>

      {isDropdownOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsDropdownOpen(false)}
          />
          
          {/* Dropdown Menu */}
          <div className="absolute top-full left-0 mt-1 w-80 bg-popover border border-border rounded-lg chat-shadow z-50 animate-fade-in">
            <div className="p-2">
              {/* New Conversation */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewConversation}
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
                fullWidth
                className="justify-start mb-2 text-primary hover:text-primary-foreground hover:bg-primary"
              >
                Start New Conversation
              </Button>

              {/* Recent Conversations */}
              <div className="border-t border-border pt-2">
                <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Recent Conversations
                </div>
                <div className="space-y-1">
                  {recentConversations.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => handleConversationSelect(conversation)}
                      className="w-full text-left p-2 rounded-md hover:bg-muted micro-feedback group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">
                            {conversation.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate mt-1">
                            {conversation.preview}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                          {conversation.timestamp}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* View All History */}
              <div className="border-t border-border pt-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleViewAllHistory}
                  iconName="History"
                  iconPosition="left"
                  iconSize={16}
                  fullWidth
                  className="justify-start text-muted-foreground hover:text-foreground"
                >
                  View All History
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationSwitcher;
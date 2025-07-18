import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import Icon from '../AppIcon';

const QuickActions = ({ onClearChat, onExportChat, onSearchToggle, conversationId }) => {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  const isOnChatInterface = location.pathname === '/chat-interface';
  const isOnChatHistory = location.pathname === '/chat-history';

  const handleClearChat = () => {
    if (showConfirmClear) {
      if (onClearChat) {
        onClearChat();
      }
      setShowConfirmClear(false);
      setIsExpanded(false);
    } else {
      setShowConfirmClear(true);
    }
  };

  const handleExportChat = () => {
    if (onExportChat) {
      onExportChat();
    }
    setIsExpanded(false);
  };

  const handleSearchToggle = () => {
    if (onSearchToggle) {
      onSearchToggle();
    }
    setIsExpanded(false);
  };

  const chatInterfaceActions = [
    {
      id: 'clear',
      label: showConfirmClear ? 'Confirm Clear' : 'Clear Chat',
      icon: showConfirmClear ? 'AlertTriangle' : 'Trash2',
      onClick: handleClearChat,
      variant: showConfirmClear ? 'destructive' : 'ghost',
      disabled: !conversationId
    },
    {
      id: 'export',
      label: 'Export Chat',
      icon: 'Download',
      onClick: handleExportChat,
      variant: 'ghost',
      disabled: !conversationId
    }
  ];

  const historyActions = [
    {
      id: 'search',
      label: 'Search History',
      icon: 'Search',
      onClick: handleSearchToggle,
      variant: 'ghost'
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: 'Download',
      onClick: handleExportChat,
      variant: 'ghost'
    }
  ];

  const currentActions = isOnChatInterface ? chatInterfaceActions : 
                        isOnChatHistory ? historyActions : [];

  if (currentActions.length === 0) return null;

  return (
    <>
      {/* Desktop Version - Integrated Toolbar */}
      <div className="hidden md:flex items-center space-x-1">
        {currentActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            size="sm"
            onClick={action.onClick}
            iconName={action.icon}
            iconSize={16}
            disabled={action.disabled}
            className="micro-feedback"
          >
            {action.label}
          </Button>
        ))}
      </div>

      {/* Mobile Version - Floating Action Button */}
      <div className="md:hidden fixed bottom-6 right-6 z-40">
        {isExpanded && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/20 -z-10" 
              onClick={() => {
                setIsExpanded(false);
                setShowConfirmClear(false);
              }}
            />
            
            {/* Action Menu */}
            <div className="absolute bottom-16 right-0 bg-popover border border-border rounded-lg chat-shadow p-2 min-w-48 animate-slide-up">
              <div className="space-y-1">
                {currentActions.map((action) => (
                  <Button
                    key={action.id}
                    variant={action.variant}
                    size="sm"
                    onClick={action.onClick}
                    iconName={action.icon}
                    iconPosition="left"
                    iconSize={16}
                    disabled={action.disabled}
                    fullWidth
                    className="justify-start micro-feedback"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Main FAB */}
        <Button
          variant="default"
          size="icon"
          onClick={() => setIsExpanded(!isExpanded)}
          iconName={isExpanded ? "X" : "MoreVertical"}
          iconSize={20}
          className="w-12 h-12 rounded-full floating-shadow micro-feedback"
        />
      </div>

      {/* Confirmation Toast for Clear Action */}
      {showConfirmClear && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-warning text-warning-foreground px-4 py-2 rounded-lg chat-shadow z-50 animate-fade-in md:bottom-6">
          <div className="flex items-center space-x-2 text-sm">
            <Icon name="AlertTriangle" size={16} />
            <span>Click again to confirm clearing chat</span>
          </div>
        </div>
      )}
    </>
  );
};

export default QuickActions;
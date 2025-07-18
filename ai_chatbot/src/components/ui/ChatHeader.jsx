import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../ui/Button';
import Icon from '../AppIcon';

const ChatHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    {
      label: 'Chat Interface',
      path: '/chat-interface',
      icon: 'MessageCircle',
      tooltip: 'Start or continue conversation'
    },
    {
      label: 'Chat History',
      path: '/chat-history',
      icon: 'History',
      tooltip: 'View past conversations'
    }
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleNewChat = () => {
    navigate('/chat-interface');
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border chat-shadow">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Bot" size={20} color="white" />
            </div>
            <span className="text-xl font-semibold text-foreground">AI Chatbot</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Button
              key={item.path}
              variant={isActivePath(item.path) ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item.path)}
              iconName={item.icon}
              iconPosition="left"
              iconSize={16}
              className="text-sm"
            >
              {item.label}
            </Button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            iconName="Plus"
            iconPosition="left"
            iconSize={16}
          >
            New Chat
          </Button>
          <Button
            variant="ghost"
            size="icon"
            iconName="Settings"
            iconSize={18}
          />
        </div>

        {/* Mobile Actions */}
        <div className="flex md:hidden items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            iconName="Plus"
            iconSize={16}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            iconSize={18}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border">
          <nav className="px-4 py-2 space-y-1">
            {navigationItems.map((item) => (
              <Button
                key={item.path}
                variant={isActivePath(item.path) ? "default" : "ghost"}
                size="sm"
                onClick={() => handleNavigation(item.path)}
                iconName={item.icon}
                iconPosition="left"
                iconSize={16}
                fullWidth
                className="justify-start"
              >
                {item.label}
              </Button>
            ))}
            <div className="pt-2 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                iconName="Settings"
                iconPosition="left"
                iconSize={16}
                fullWidth
                className="justify-start"
              >
                Settings
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ChatHeader;
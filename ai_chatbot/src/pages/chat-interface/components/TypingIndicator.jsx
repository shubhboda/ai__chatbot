import React from 'react';
import Icon from '../../../components/AppIcon';

const TypingIndicator = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="flex justify-start mb-4">
      <div className="flex items-start space-x-2 max-w-xs">
        {/* AI Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <Icon name="Bot" size={16} color="white" />
          </div>
        </div>

        {/* Typing Animation */}
        <div className="bg-card border border-border rounded-lg px-4 py-3">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-muted-foreground rounded-full typing-indicator animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs text-muted-foreground ml-2">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
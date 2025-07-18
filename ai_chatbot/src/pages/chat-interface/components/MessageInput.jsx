import React, { useState, useRef, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const MessageInput = ({ onSendMessage, disabled, placeholder = "Type your message..." }) => {
  const [message, setMessage] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);
  const maxLength = 2000;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 120; // Approximately 5 lines
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
      
      setIsExpanded(scrollHeight > 44); // Single line height
    }
  }, [message]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handlePaste = (e) => {
    const pastedText = e.clipboardData.getData('text');
    const newText = message + pastedText;
    if (newText.length > maxLength) {
      e.preventDefault();
      setMessage(newText.substring(0, maxLength));
    }
  };

  const remainingChars = maxLength - message.length;
  const isNearLimit = remainingChars < 100;

  return (
    <div className="border-t border-border bg-background">
      <div className="p-4">
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          {/* Message Input Container */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full resize-none rounded-lg border border-border bg-input px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              } ${isExpanded ? 'rounded-b-none' : ''}`}
              style={{ minHeight: '44px' }}
              maxLength={maxLength}
            />
            
            {/* Character Counter */}
            {(isNearLimit || isExpanded) && (
              <div className={`absolute bottom-1 right-2 text-xs ${
                remainingChars < 50 ? 'text-error' : 'text-muted-foreground'
              }`}>
                {remainingChars}
              </div>
            )}
          </div>

          {/* Send Button */}
          <Button
            type="submit"
            variant="default"
            size="icon"
            disabled={!message.trim() || disabled}
            iconName="Send"
            iconSize={18}
            className="h-11 w-11 flex-shrink-0 micro-feedback"
          />
        </form>

        {/* Quick Actions */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center space-x-2">
            {/* Attachment Button */}
            <Button
              variant="ghost"
              size="xs"
              disabled={disabled}
              iconName="Paperclip"
              iconSize={14}
              className="text-muted-foreground hover:text-foreground"
            >
              Attach
            </Button>

            {/* Voice Input Button */}
            <Button
              variant="ghost"
              size="xs"
              disabled={disabled}
              iconName="Mic"
              iconSize={14}
              className="text-muted-foreground hover:text-foreground"
            >
              Voice
            </Button>
          </div>

          {/* Input Status */}
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            {disabled && (
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={12} />
                <span>Processing...</span>
              </div>
            )}
            {!disabled && message.length > 0 && (
              <div className="flex items-center space-x-1">
                <Icon name="Edit3" size={12} />
                <span>Press Enter to send</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
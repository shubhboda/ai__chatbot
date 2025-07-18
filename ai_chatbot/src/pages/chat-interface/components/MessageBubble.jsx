import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const MessageBubble = ({ message, onCopy, onReaction }) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return messageTime.toLocaleDateString();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    if (onCopy) onCopy(message.id);
  };

  const handleReaction = (reaction) => {
    if (onReaction) onReaction(message.id, reaction);
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 group`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start space-x-2 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isUser ? 'ml-2' : 'mr-2'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            isUser ? 'bg-primary' : 'bg-secondary'
          }`}>
            <Icon 
              name={isUser ? 'User' : 'Bot'} 
              size={16} 
              color="white" 
            />
          </div>
        </div>

        {/* Message Content */}
        <div className={`message-bubble ${
          isUser 
            ? 'bg-primary text-primary-foreground' 
            : 'bg-card text-card-foreground border border-border'
        }`}>
          {/* Message Text */}
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>

          {/* Timestamp */}
          <div className={`text-xs mt-2 ${
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          }`}>
            {formatTimestamp(message.timestamp)}
          </div>

          {/* Message Actions */}
          <div className={`flex items-center justify-between mt-2 pt-2 border-t ${
            isUser ? 'border-primary-foreground/20' : 'border-border'
          } opacity-0 group-hover:opacity-100 transition-opacity`}>
            <div className="flex items-center space-x-1">
              {/* Copy Button */}
              <Button
                variant="ghost"
                size="xs"
                onClick={handleCopy}
                iconName="Copy"
                iconSize={12}
                className={`h-6 px-2 ${
                  isUser 
                    ? 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              />

              {/* Reaction Buttons for AI messages */}
              {isAI && (
                <>
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleReaction('like')}
                    iconName="ThumbsUp"
                    iconSize={12}
                    className="h-6 px-2 text-muted-foreground hover:text-success"
                  />
                  <Button
                    variant="ghost"
                    size="xs"
                    onClick={() => handleReaction('dislike')}
                    iconName="ThumbsDown"
                    iconSize={12}
                    className="h-6 px-2 text-muted-foreground hover:text-error"
                  />
                </>
              )}
            </div>

            {/* Message Status for User Messages */}
            {isUser && message.status && (
              <div className="flex items-center space-x-1">
                <Icon 
                  name={message.status === 'sent' ? 'Check' : message.status === 'delivered' ? 'CheckCheck' : 'Clock'} 
                  size={12} 
                  color="currentColor"
                  className="text-primary-foreground/70"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
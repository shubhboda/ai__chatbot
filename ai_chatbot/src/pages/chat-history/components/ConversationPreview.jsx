import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConversationPreview = ({ conversation, onClose }) => {
  const navigate = useNavigate();

  if (!conversation) {
    return (
      <div className="hidden lg:flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="MessageCircle" size={32} className="text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">
          Select a conversation
        </h3>
        <p className="text-muted-foreground">
          Choose a conversation from the list to see its preview
        </p>
      </div>
    );
  }

  const handleResumeChat = () => {
    navigate('/chat-interface', { state: { conversationId: conversation.id } });
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} hour${hours > 1 ? 's' : ''} ${mins} minutes`;
  };

  return (
    <div className="h-full flex flex-col bg-card border border-border rounded-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-semibold text-foreground truncate">
            {conversation.title}
          </h2>
          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
            <span>{formatTimestamp(conversation.timestamp)}</span>
            <span>•</span>
            <span>{conversation.messageCount} messages</span>
            <span>•</span>
            <span>{formatDuration(conversation.duration)}</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 ml-4">
          <Button
            variant="default"
            size="sm"
            onClick={handleResumeChat}
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
          >
            Resume Chat
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={18}
            className="lg:hidden"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Conversation Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="MessageSquare" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Messages</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {conversation.messageCount}
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Clock" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Duration</span>
            </div>
            <div className="text-2xl font-bold text-foreground">
              {Math.floor(conversation.duration / 60)}h {conversation.duration % 60}m
            </div>
          </div>
        </div>

        {/* Tags */}
        {(conversation.hasAttachments || conversation.isBookmarked) && (
          <div className="flex flex-wrap gap-2 mb-6">
            {conversation.hasAttachments && (
              <div className="flex items-center space-x-1 text-xs bg-muted px-3 py-1 rounded-full">
                <Icon name="Paperclip" size={12} />
                <span>Has Attachments</span>
              </div>
            )}
            
            {conversation.isBookmarked && (
              <div className="flex items-center space-x-1 text-xs bg-warning/10 text-warning px-3 py-1 rounded-full">
                <Icon name="Bookmark" size={12} />
                <span>Bookmarked</span>
              </div>
            )}
          </div>
        )}

        {/* Preview Content */}
        <div>
          <h3 className="text-lg font-medium text-foreground mb-4">
            Conversation Preview
          </h3>
          
          <div className="space-y-4">
            {/* First Message */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="User" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">You</span>
                <span className="text-xs text-muted-foreground">
                  {formatTimestamp(conversation.timestamp)}
                </span>
              </div>
              <p className="text-sm text-foreground">
                {conversation.firstMessage}
              </p>
            </div>

            {/* AI Response Preview */}
            <div className="bg-primary/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Icon name="Bot" size={16} className="text-primary" />
                <span className="text-sm font-medium text-foreground">AI Assistant</span>
              </div>
              <p className="text-sm text-foreground">
                {conversation.preview}
              </p>
            </div>

            {/* More Messages Indicator */}
            {conversation.messageCount > 2 && (
              <div className="text-center py-4">
                <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
                  <Icon name="MoreHorizontal" size={16} />
                  <span>
                    {conversation.messageCount - 2} more messages in this conversation
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-border p-6">
        <div className="flex space-x-3">
          <Button
            variant="default"
            onClick={handleResumeChat}
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
            className="flex-1"
          >
            Resume Conversation
          </Button>
          
          <Button
            variant="outline"
            iconName="Download"
            iconSize={16}
          >
            Export
          </Button>
          
          <Button
            variant="outline"
            iconName="Share"
            iconSize={16}
          >
            Share
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPreview;
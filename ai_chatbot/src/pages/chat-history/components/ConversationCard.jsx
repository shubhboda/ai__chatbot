import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';

const ConversationCard = ({ 
  conversation, 
  isSelected, 
  onSelect, 
  onDelete, 
  onExport,
  selectionMode 
}) => {
  const navigate = useNavigate();
  const [showActions, setShowActions] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleResumeChat = () => {
    navigate('/chat-interface', { state: { conversationId: conversation.id } });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(conversation.id);
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExport = () => {
    onExport(conversation.id);
  };

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', { 
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  return (
    <div className={`relative bg-card border border-border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${
      isSelected ? 'ring-2 ring-primary border-primary' : ''
    }`}>
      {/* Selection Checkbox */}
      {selectionMode && (
        <div className="absolute top-3 left-3 z-10">
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelect(conversation.id, e.target.checked)}
            size="sm"
          />
        </div>
      )}

      {/* Main Content */}
      <div className={`${selectionMode ? 'ml-8' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-foreground truncate">
              {conversation.title}
            </h3>
            <div className="flex items-center space-x-3 mt-1 text-sm text-muted-foreground">
              <span>{formatTimestamp(conversation.timestamp)}</span>
              <span>•</span>
              <span>{conversation.messageCount} messages</span>
              <span>•</span>
              <span>{formatDuration(conversation.duration)}</span>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-1 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResumeChat}
              iconName="MessageCircle"
              iconSize={16}
            >
              Resume
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleExport}
              iconName="Download"
              iconSize={16}
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              iconName="Trash2"
              iconSize={16}
              loading={isDeleting}
              className="text-destructive hover:text-destructive-foreground hover:bg-destructive"
            />
          </div>

          {/* Mobile Actions Toggle */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowActions(!showActions)}
              iconName="MoreVertical"
              iconSize={16}
            />
          </div>
        </div>

        {/* Preview */}
        <div className="mb-3">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {conversation.preview}
          </p>
        </div>

        {/* Tags/Indicators */}
        <div className="flex items-center space-x-2">
          {conversation.hasAttachments && (
            <div className="flex items-center space-x-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              <Icon name="Paperclip" size={12} />
              <span>Attachments</span>
            </div>
          )}
          
          {conversation.isBookmarked && (
            <div className="flex items-center space-x-1 text-xs text-warning bg-warning/10 px-2 py-1 rounded">
              <Icon name="Bookmark" size={12} />
              <span>Bookmarked</span>
            </div>
          )}

          {conversation.messageCount > 50 && (
            <div className="flex items-center space-x-1 text-xs text-success bg-success/10 px-2 py-1 rounded">
              <Icon name="MessageSquare" size={12} />
              <span>Long conversation</span>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Actions Menu */}
      {showActions && (
        <>
          <div 
            className="fixed inset-0 z-30 md:hidden" 
            onClick={() => setShowActions(false)}
          />
          <div className="absolute top-12 right-4 bg-popover border border-border rounded-lg shadow-lg z-40 p-2 min-w-40 md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleResumeChat}
              iconName="MessageCircle"
              iconPosition="left"
              iconSize={16}
              fullWidth
              className="justify-start"
            >
              Resume Chat
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExport}
              iconName="Download"
              iconPosition="left"
              iconSize={16}
              fullWidth
              className="justify-start"
            >
              Export
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              iconName="Trash2"
              iconPosition="left"
              iconSize={16}
              loading={isDeleting}
              fullWidth
              className="justify-start text-destructive hover:text-destructive-foreground hover:bg-destructive"
            >
              Delete
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationCard;
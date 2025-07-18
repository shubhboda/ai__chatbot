import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const EmptyState = ({ hasSearchQuery, searchQuery, onClearSearch }) => {
  const navigate = useNavigate();

  const handleStartChat = () => {
    navigate('/chat-interface');
  };

  if (hasSearchQuery) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
          <Icon name="Search" size={32} className="text-muted-foreground" />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-2">
          No conversations found
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md">
          We couldn't find any conversations matching "{searchQuery}". Try adjusting your search terms or filters.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={onClearSearch}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear Search
          </Button>
          
          <Button
            variant="default"
            onClick={handleStartChat}
            iconName="MessageCircle"
            iconPosition="left"
            iconSize={16}
          >
            Start New Chat
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        <Icon name="MessageCircle" size={40} className="text-primary" />
      </div>
      
      <h3 className="text-2xl font-semibold text-foreground mb-2">
        No conversations yet
      </h3>
      
      <p className="text-muted-foreground mb-8 max-w-md">
        Start your first conversation with our AI assistant. Ask questions, get help, or just have a friendly chat!
      </p>
      
      <Button
        variant="default"
        size="lg"
        onClick={handleStartChat}
        iconName="Plus"
        iconPosition="left"
        iconSize={20}
      >
        Start Your First Chat
      </Button>
      
      {/* Quick Tips */}
      <div className="mt-12 max-w-2xl">
        <h4 className="text-lg font-medium text-foreground mb-4">
          What you can do:
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start space-x-3 p-4 bg-card border border-border rounded-lg">
            <Icon name="HelpCircle" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-foreground">Ask Questions</div>
              <div className="text-muted-foreground">Get instant answers to your queries</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-card border border-border rounded-lg">
            <Icon name="Lightbulb" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-foreground">Get Ideas</div>
              <div className="text-muted-foreground">Brainstorm and explore new concepts</div>
            </div>
          </div>
          
          <div className="flex items-start space-x-3 p-4 bg-card border border-border rounded-lg">
            <Icon name="BookOpen" size={20} className="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-foreground">Learn Together</div>
              <div className="text-muted-foreground">Explore topics in depth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
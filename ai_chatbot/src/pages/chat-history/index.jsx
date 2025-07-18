import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatHeader from '../../components/ui/ChatHeader';
import SearchBar from './components/SearchBar';
import FilterPanel from './components/FilterPanel';
import ConversationCard from './components/ConversationCard';
import BulkActions from './components/BulkActions';
import EmptyState from './components/EmptyState';
import ConversationPreview from './components/ConversationPreview';
import Button from '../../components/ui/Button';


const ChatHistory = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversations, setSelectedConversations] = useState(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    messageCount: 'all',
    duration: 'all',
    hasAttachments: false
  });

  // Mock conversation data
  const mockConversations = [
    {
      id: '1',
      title: 'React Best Practices Discussion',
      preview: `I'd be happy to help you with React best practices! Here are some key recommendations:\n\n1. Use functional components with hooks instead of class components\n2. Implement proper state management with useState and useReducer\n3. Optimize performance with useMemo and useCallback when needed`,
      firstMessage: 'Can you help me understand the best practices for React development? I want to make sure I\'m following modern patterns.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      messageCount: 15,
      duration: 25,
      hasAttachments: false,
      isBookmarked: true
    },
    {
      id: '2',
      title: 'API Integration Help',
      preview: `For API integration in React, I recommend using axios or the built-in fetch API. Here's a comprehensive approach:\n\n1. Create custom hooks for API calls\n2. Implement proper error handling\n3. Use loading states for better UX`,
      firstMessage: 'I need help integrating REST APIs into my React application. What\'s the best approach?',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      messageCount: 8,
      duration: 18,
      hasAttachments: true,
      isBookmarked: false
    },
    {
      id: '3',
      title: 'Database Design Consultation',
      preview: `Great question about database design! For your e-commerce application, I'd suggest a normalized approach:\n\n1. Users table for customer information\n2. Products table with categories\n3. Orders table linking users and products\n4. Consider indexing for performance`,
      firstMessage: 'What\'s the best approach for designing a database schema for an e-commerce application?',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      messageCount: 22,
      duration: 45,
      hasAttachments: false,
      isBookmarked: false
    },
    {
      id: '4',
      title: 'JavaScript Performance Optimization',
      preview: `Performance optimization in JavaScript is crucial for user experience. Here are key strategies:\n\n1. Minimize DOM manipulations\n2. Use efficient algorithms and data structures\n3. Implement lazy loading for large datasets\n4. Optimize bundle size with tree shaking`,
      firstMessage: 'How can I optimize the performance of my JavaScript application? It\'s running slowly with large datasets.',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      messageCount: 12,
      duration: 30,
      hasAttachments: true,
      isBookmarked: true
    },
    {
      id: '5',
      title: 'CSS Grid vs Flexbox',
      preview: `Both CSS Grid and Flexbox are powerful layout systems, but they serve different purposes:\n\nFlexbox is ideal for:\n- One-dimensional layouts\n- Component-level layouts\n- Distributing space among items\n\nCSS Grid is perfect for:\n- Two-dimensional layouts\n- Page-level layouts\n- Complex grid systems`,
      firstMessage: 'When should I use CSS Grid versus Flexbox? I\'m confused about which one to choose for different layouts.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      messageCount: 6,
      duration: 15,
      hasAttachments: false,
      isBookmarked: false
    },
    {
      id: '6',
      title: 'Node.js Authentication Setup',
      preview: `Setting up authentication in Node.js requires careful consideration of security. Here's a robust approach:\n\n1. Use bcrypt for password hashing\n2. Implement JWT tokens for session management\n3. Add rate limiting to prevent brute force attacks\n4. Use HTTPS in production`,
      firstMessage: 'I need to implement user authentication in my Node.js application. What\'s the most secure approach?',
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      messageCount: 18,
      duration: 35,
      hasAttachments: true,
      isBookmarked: false
    }
  ];

  // Initialize conversations
  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConversations(mockConversations);
      setFilteredConversations(mockConversations);
      setIsLoading(false);
    };

    loadConversations();
  }, []);

  // Filter conversations based on search and filters
  const filterConversations = useCallback((conversations, query, activeFilters) => {
    let filtered = conversations;

    // Search filter
    if (query.trim()) {
      const searchLower = query.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.title.toLowerCase().includes(searchLower) ||
        conv.preview.toLowerCase().includes(searchLower) ||
        conv.firstMessage.toLowerCase().includes(searchLower)
      );
    }

    // Date range filter
    if (activeFilters.dateRange !== 'all') {
      const now = new Date();
      filtered = filtered.filter(conv => {
        const convDate = new Date(conv.timestamp);
        const diffInHours = (now - convDate) / (1000 * 60 * 60);
        
        switch (activeFilters.dateRange) {
          case 'today':
            return diffInHours <= 24;
          case 'week':
            return diffInHours <= 168; // 7 days
          case 'month':
            return diffInHours <= 720; // 30 days
          case 'quarter':
            return diffInHours <= 2160; // 90 days
          default:
            return true;
        }
      });
    }

    // Message count filter
    if (activeFilters.messageCount !== 'all') {
      filtered = filtered.filter(conv => {
        switch (activeFilters.messageCount) {
          case 'short':
            return conv.messageCount <= 5;
          case 'medium':
            return conv.messageCount > 5 && conv.messageCount <= 20;
          case 'long':
            return conv.messageCount > 20;
          default:
            return true;
        }
      });
    }

    // Duration filter
    if (activeFilters.duration !== 'all') {
      filtered = filtered.filter(conv => {
        switch (activeFilters.duration) {
          case 'quick':
            return conv.duration < 5;
          case 'normal':
            return conv.duration >= 5 && conv.duration <= 30;
          case 'extended':
            return conv.duration > 30;
          default:
            return true;
        }
      });
    }

    // Attachments filter
    if (activeFilters.hasAttachments) {
      filtered = filtered.filter(conv => conv.hasAttachments);
    }

    return filtered;
  }, []);

  // Apply filters when search or filters change
  useEffect(() => {
    const filtered = filterConversations(conversations, searchQuery, filters);
    setFilteredConversations(filtered);
  }, [conversations, searchQuery, filters, filterConversations]);

  // Handle search
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  // Handle filter toggle
  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  // Handle apply filters
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  // Handle conversation selection
  const handleConversationSelect = (conversationId, isSelected) => {
    const newSelected = new Set(selectedConversations);
    if (isSelected) {
      newSelected.add(conversationId);
    } else {
      newSelected.delete(conversationId);
    }
    setSelectedConversations(newSelected);
    
    // Auto-enable selection mode if any conversation is selected
    if (newSelected.size > 0 && !selectionMode) {
      setSelectionMode(true);
    } else if (newSelected.size === 0 && selectionMode) {
      setSelectionMode(false);
    }
  };

  // Handle select all
  const handleSelectAll = () => {
    const allIds = new Set(filteredConversations.map(conv => conv.id));
    setSelectedConversations(allIds);
    setSelectionMode(true);
  };

  // Handle deselect all
  const handleDeselectAll = () => {
    setSelectedConversations(new Set());
    setSelectionMode(false);
  };

  // Handle conversation deletion
  const handleDeleteConversation = async (conversationId) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      setSelectedConversations(prev => {
        const newSelected = new Set(prev);
        newSelected.delete(conversationId);
        return newSelected;
      });
      
      // Close preview if deleted conversation was selected
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setConversations(prev => 
        prev.filter(conv => !selectedConversations.has(conv.id))
      );
      setSelectedConversations(new Set());
      setSelectionMode(false);
      setSelectedConversation(null);
    } catch (error) {
      console.error('Failed to delete conversations:', error);
    }
  };

  // Handle export
  const handleExportConversation = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      // Simulate export functionality
      const exportData = {
        title: conversation.title,
        timestamp: conversation.timestamp,
        messageCount: conversation.messageCount,
        duration: conversation.duration,
        preview: conversation.preview
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-${conversation.id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Handle bulk export
  const handleBulkExport = () => {
    const selectedConvs = conversations.filter(conv => 
      selectedConversations.has(conv.id)
    );
    
    const exportData = selectedConvs.map(conv => ({
      title: conv.title,
      timestamp: conv.timestamp,
      messageCount: conv.messageCount,
      duration: conv.duration,
      preview: conv.preview
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `conversations-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle clear search
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Handle conversation preview (desktop)
  const handleConversationPreview = (conversation) => {
    setSelectedConversation(conversation);
  };

  const isAllSelected = selectedConversations.size === filteredConversations.length && filteredConversations.length > 0;
  const hasSearchQuery = searchQuery.trim().length > 0;
  const showEmptyState = filteredConversations.length === 0 && !isLoading;

  return (
    <div className="min-h-screen bg-background">
      <ChatHeader />
      
      <div className="pt-16">
        <SearchBar
          onSearch={handleSearch}
          onFilterToggle={handleFilterToggle}
          isFilterOpen={isFilterOpen}
        />

        {/* Filter Panel */}
        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />

        {/* Bulk Actions */}
        <BulkActions
          selectedCount={selectedConversations.size}
          totalCount={filteredConversations.length}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
          onBulkDelete={handleBulkDelete}
          onBulkExport={handleBulkExport}
          isAllSelected={isAllSelected}
        />

        {/* Main Content */}
        <div className="flex">
          {/* Conversations List */}
          <div className={`flex-1 ${selectedConversation ? 'lg:w-1/2' : ''}`}>
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="text-muted-foreground">Loading conversations...</span>
                </div>
              </div>
            ) : showEmptyState ? (
              <EmptyState
                hasSearchQuery={hasSearchQuery}
                searchQuery={searchQuery}
                onClearSearch={handleClearSearch}
              />
            ) : (
              <div className="p-4 space-y-4">
                {/* Results Summary */}
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    {filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''} found
                  </div>
                  
                  {!selectionMode && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectionMode(true)}
                      iconName="CheckSquare"
                      iconPosition="left"
                      iconSize={16}
                    >
                      Select
                    </Button>
                  )}
                </div>

                {/* Conversations Grid */}
                <div className="grid grid-cols-1 gap-4">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => !selectionMode && handleConversationPreview(conversation)}
                      className={`cursor-pointer ${!selectionMode ? 'hover:shadow-lg transition-shadow' : ''}`}
                    >
                      <ConversationCard
                        conversation={conversation}
                        isSelected={selectedConversations.has(conversation.id)}
                        onSelect={handleConversationSelect}
                        onDelete={handleDeleteConversation}
                        onExport={handleExportConversation}
                        selectionMode={selectionMode}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Conversation Preview (Desktop) */}
          {selectedConversation && (
            <div className="hidden lg:block w-1/2 p-4">
              <ConversationPreview
                conversation={selectedConversation}
                onClose={() => setSelectedConversation(null)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Conversation Preview Modal */}
      {selectedConversation && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background">
          <div className="h-full">
            <ConversationPreview
              conversation={selectedConversation}
              onClose={() => setSelectedConversation(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHistory;
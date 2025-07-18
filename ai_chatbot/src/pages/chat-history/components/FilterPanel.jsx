import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';


const FilterPanel = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState({
    dateRange: currentFilters.dateRange || 'all',
    messageCount: currentFilters.messageCount || 'all',
    duration: currentFilters.duration || 'all',
    hasAttachments: currentFilters.hasAttachments || false,
    ...currentFilters
  });

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'Last 3 Months' }
  ];

  const messageCountOptions = [
    { value: 'all', label: 'Any Length' },
    { value: 'short', label: 'Short (1-5 messages)' },
    { value: 'medium', label: 'Medium (6-20 messages)' },
    { value: 'long', label: 'Long (20+ messages)' }
  ];

  const durationOptions = [
    { value: 'all', label: 'Any Duration' },
    { value: 'quick', label: 'Quick (&lt; 5 min)' },
    { value: 'normal', label: 'Normal (5-30 min)' },
    { value: 'extended', label: 'Extended (&gt; 30 min)' }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      dateRange: 'all',
      messageCount: 'all',
      duration: 'all',
      hasAttachments: false
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    value !== 'all' && value !== false
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={onClose} />
      
      {/* Filter Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-background border-l border-border z-50 transform transition-transform duration-300 md:relative md:w-full md:h-auto md:border-l-0 md:border md:rounded-lg md:shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-border md:border-b-0">
          <h3 className="text-lg font-semibold text-foreground">Filter Conversations</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            iconName="X"
            iconSize={18}
            className="md:hidden"
          />
        </div>

        <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-none">
          {/* Date Range Filter */}
          <div>
            <Select
              label="Date Range"
              options={dateRangeOptions}
              value={filters.dateRange}
              onChange={(value) => handleFilterChange('dateRange', value)}
            />
          </div>

          {/* Message Count Filter */}
          <div>
            <Select
              label="Conversation Length"
              options={messageCountOptions}
              value={filters.messageCount}
              onChange={(value) => handleFilterChange('messageCount', value)}
            />
          </div>

          {/* Duration Filter */}
          <div>
            <Select
              label="Duration"
              options={durationOptions}
              value={filters.duration}
              onChange={(value) => handleFilterChange('duration', value)}
            />
          </div>

          {/* Additional Filters */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-foreground">Additional Filters</h4>
            
            <Checkbox
              label="Has Attachments"
              checked={filters.hasAttachments}
              onChange={(e) => handleFilterChange('hasAttachments', e.target.checked)}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background border-t border-border md:relative md:border-t-0">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleResetFilters}
              disabled={!hasActiveFilters}
              className="flex-1"
            >
              Reset
            </Button>
            <Button
              variant="default"
              onClick={handleApplyFilters}
              className="flex-1"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
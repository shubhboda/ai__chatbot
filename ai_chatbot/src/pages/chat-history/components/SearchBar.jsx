import React, { useState, useEffect } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SearchBar = ({ onSearch, onFilterToggle, isFilterOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      onSearch(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, onSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className="sticky top-16 z-30 bg-background border-b border-border p-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
            <Icon name="Search" size={18} />
          </div>
          <Input
            type="search"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
        
        <Button
          variant={isFilterOpen ? "default" : "outline"}
          size="icon"
          onClick={onFilterToggle}
          iconName="Filter"
          iconSize={18}
          className="flex-shrink-0"
        />
      </div>

      {isSearchFocused && searchQuery && (
        <div className="mt-2 text-sm text-muted-foreground">
          <Icon name="Info" size={14} className="inline mr-1" />
          Search in conversation titles and messages
        </div>
      )}
    </div>
  );
};

export default SearchBar;
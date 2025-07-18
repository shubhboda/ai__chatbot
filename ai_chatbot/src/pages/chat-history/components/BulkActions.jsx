import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BulkActions = ({ 
  selectedCount, 
  totalCount, 
  onSelectAll, 
  onDeselectAll, 
  onBulkDelete, 
  onBulkExport,
  isAllSelected 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="sticky top-32 z-20 bg-primary text-primary-foreground p-4 mx-4 rounded-lg shadow-lg animate-slide-down">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon name="CheckCircle" size={20} />
          <span className="font-medium">
            {selectedCount} of {totalCount} selected
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {/* Select/Deselect All */}
          <Button
            variant="ghost"
            size="sm"
            onClick={isAllSelected ? onDeselectAll : onSelectAll}
            className="text-primary-foreground hover:bg-primary-foreground/20"
          >
            {isAllSelected ? 'Deselect All' : 'Select All'}
          </Button>

          {/* Bulk Actions */}
          <div className="flex items-center space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkExport}
              iconName="Download"
              iconSize={16}
              className="text-primary-foreground hover:bg-primary-foreground/20"
            >
              Export
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={onBulkDelete}
              iconName="Trash2"
              iconSize={16}
              className="text-primary-foreground hover:bg-destructive hover:text-destructive-foreground"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;
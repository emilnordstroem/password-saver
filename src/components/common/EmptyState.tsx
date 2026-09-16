import React from 'react';
import { Button } from '@nextui-org/react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

/**
 * EmptyState - Placeholder component for empty lists or no results
 * Shows an icon, title, description, and optional action button
 */
export function EmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state-icon-container">{icon}</div>}
      
      <h3 className="empty-state-title">{title}</h3>
      
      <p className="empty-state-description">{description}</p>
      
      {actionText && onAction && (
        <Button
          onPress={onAction}
          color="primary"
          className="empty-state-button"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
}

export default EmptyState;

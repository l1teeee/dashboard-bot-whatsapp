import React from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
    {description && <p className="text-sm text-ink-soft mb-4">{description}</p>}
    {action && <div>{action}</div>}
  </div>
);

EmptyState.displayName = 'EmptyState';

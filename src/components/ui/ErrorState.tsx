import React from 'react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ title = 'Error', message, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <h3 className="text-lg font-semibold text-cancelled mb-2">{title}</h3>
    <p className="text-sm text-ink-soft mb-4">{message}</p>
    {onRetry && <Button variant="secondary" onClick={onRetry}>Reintentar</Button>}
  </div>
);

ErrorState.displayName = 'ErrorState';

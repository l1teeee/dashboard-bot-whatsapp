import React from 'react';
import { cn } from '@/lib/cn';
import { Card } from './Card';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn(
      'bg-border rounded-card animate-pulse',
      className,
    )}
  />
);

Skeleton.displayName = 'Skeleton';

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className }) => (
  <Card className={cn('p-4 space-y-3', className)}>
    <Skeleton className="h-8 w-1/3" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-4 w-2/3" />
  </Card>
);

SkeletonCard.displayName = 'SkeletonCard';

import React from 'react'; import { cn } from '@/lib/cn'; import { Card } from './Card';
export const Skeleton: React.FC<{className?: string}> = ({ className }) => <div className={cn('animate-pulse rounded-xl bg-border/70', className)}/>; Skeleton.displayName = 'Skeleton';
export const SkeletonCard: React.FC<{className?: string}> = ({ className }) => <Card className={cn('space-y-3 p-5', className)}><Skeleton className="h-7 w-1/3"/><Skeleton className="h-4 w-2/3"/><Skeleton className="h-4 w-full"/></Card>; SkeletonCard.displayName = 'SkeletonCard';

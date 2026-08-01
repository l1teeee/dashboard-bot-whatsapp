import React from 'react';
import { cn } from '@/lib/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> { as?: React.ElementType; interactive?: boolean; accent?: string; }

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, as: Component = 'div', interactive, accent, ...props }, ref) => <Component ref={ref} className={cn('rounded-[24px] border border-border bg-surface text-ink', accent, interactive && 'transition-transform hover:-translate-y-0.5', className)} {...props} />);
Card.displayName = 'Card';
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn('border-b border-border px-5 py-4', className)} {...props} />);
CardHeader.displayName = 'CardHeader';
export const CardBody = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn('p-5', className)} {...props} />);
CardBody.displayName = 'CardBody';
export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => <div ref={ref} className={cn('border-t border-border px-5 py-4', className)} {...props} />);
CardFooter.displayName = 'CardFooter';

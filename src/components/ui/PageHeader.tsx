import React from 'react';
import { cn } from '@/lib/cn';

interface PageHeaderProps {
  kicker: string;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
  className,
  titleClassName,
}: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between', className)}>
      <div>
        <p className="kicker text-yellow">{kicker}</p>
        <h1 className={cn('display-title mt-2 text-[clamp(2.35rem,4vw,4rem)]', titleClassName)}>
          {title}
        </h1>
        {description && <div className="mt-2 text-sm text-ink-soft">{description}</div>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

import React from 'react'; import { cn } from '@/lib/cn';
export function SectionCard({children,className}:{children:React.ReactNode;className?:string}) { return <section className={cn('rounded-[28px] border border-border bg-surface p-5 neo-shadow',className)}>{children}</section>; }

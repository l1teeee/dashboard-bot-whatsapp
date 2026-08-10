import React from 'react';
import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';
import { Tooltip } from './Tooltip';

export interface NavItemData { id:string; title:string; icon:LucideIcon; to?:string; badge?:number|string; shortcut?:string; onSelect?:()=>void; end?:boolean; children?:NavItemData[]; }
export interface NavGroupData { heading?:string; items:NavItemData[]; }
export interface SidebarNavProps { groups:NavGroupData[];bottomItems?:NavItemData[];header?:React.ReactNode;isCollapsed?:boolean;className?:string; }

function Item({ item, collapsed }: { item: NavItemData; collapsed?: boolean }) {
  const Icon = item.icon;
  const content = <>
    <span className="relative z-10 grid h-5 w-5 shrink-0 place-items-center" aria-hidden="true">
      <Icon className="h-5 w-5" strokeWidth={2.25} />
      {item.badge !== undefined && <span className={cn('absolute -right-3 -top-3 grid min-w-4 place-items-center rounded-full bg-coral px-1 text-[9px] font-extrabold leading-4 text-ink-dark transition-all duration-300 motion-reduce:transition-none', !collapsed && 'translate-x-2 opacity-0')}>{item.badge}</span>}
    </span>
    <span className={cn('min-w-0 flex-1 truncate whitespace-nowrap transition-[max-width,opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none', collapsed ? 'max-w-0 -translate-x-2 opacity-0' : 'max-w-36 opacity-100')}>{item.title}</span>
    {item.badge !== undefined && <span className={cn('rounded-full bg-coral px-2 py-0.5 text-[10px] font-extrabold text-ink-dark transition-[width,max-width,opacity,transform,padding,margin] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none', collapsed ? 'ml-0 w-0 max-w-0 translate-x-2 overflow-hidden px-0 opacity-0' : 'ml-auto w-auto max-w-12 opacity-100')}>{item.badge}</span>}
  </>;
  const styles = cn(
    'group relative flex min-h-11 w-full items-center gap-3 overflow-hidden rounded-2xl px-3 text-sm font-bold text-ink-soft transition-[background-color,color,padding,gap] duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:bg-surface-raised hover:text-ink focus-ring motion-reduce:transition-none',
    // The icon keeps a dedicated hit-area and a high-contrast colour in the rail.
    // Labels animate independently, so they cannot clip or cover the icon.
    collapsed && 'justify-center gap-0 px-0 text-ink hover:text-ink',
  );
  if (item.to) {
    // Radix Tooltip clones its trigger and merges className as a string. Keeping
    // NavLink's className static prevents the collapsed tooltip trigger from
    // stringifying the former callback and dropping every visual utility.
    const nav = <NavLink aria-label={collapsed ? item.title : undefined} to={item.to} end={item.end} className={cn(styles, 'aria-[current=page]:bg-mint aria-[current=page]:text-ink-dark aria-[current=page]:shadow-[0_3px_0_#081C1E]')}>{content}</NavLink>;
    return collapsed ? <Tooltip content={item.title}>{nav}</Tooltip> : nav;
  }
  const button = <button type="button" aria-label={collapsed ? item.title : undefined} onClick={item.onSelect} className={cn(styles, 'w-full')}>{content}</button>;
  return collapsed ? <Tooltip content={item.title}>{button}</Tooltip> : button;
}

export const SidebarNav = React.forwardRef<HTMLDivElement, SidebarNavProps>(({ groups, bottomItems, header, isCollapsed, className }, ref) => <nav ref={ref} data-collapsed={isCollapsed || undefined} className={cn('flex h-full w-full flex-col overflow-hidden bg-shell p-3', className)}><div className="mb-6 flex h-11 min-h-11 items-center overflow-hidden"><div className={cn('shrink-0 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none', isCollapsed && 'translate-x-1')}>{header}</div></div><div className="scrollbar-subtle flex-1 space-y-5 overflow-x-hidden overflow-y-auto">{groups.map((group, i) => <div key={i}><p className={cn('kicker mb-2 whitespace-nowrap px-3 text-ink-soft transition-[max-height,opacity,margin] duration-300 motion-reduce:transition-none', isCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-6 opacity-100')}>{group.heading}</p><div className="space-y-1">{group.items.map((item) => <Item key={item.id} item={item} collapsed={isCollapsed} />)}</div></div>)}</div>{bottomItems && <div className="border-t border-border pt-3">{bottomItems.map((item) => <Item key={item.id} item={item} collapsed={isCollapsed} />)}</div>}</nav>);
SidebarNav.displayName = 'SidebarNav';

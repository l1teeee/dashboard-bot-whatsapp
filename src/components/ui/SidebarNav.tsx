import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/cn';

export interface NavItemData {
  id: string;
  title: string;
  icon: LucideIcon;
  to?: string;
  badge?: number | string;
  shortcut?: string;
  onSelect?: () => void;
  end?: boolean;
  children?: NavItemData[];
}

export interface NavGroupData {
  heading?: string;
  items: NavItemData[];
}

export interface SidebarNavProps {
  groups: NavGroupData[];
  bottomItems?: NavItemData[];
  header?: React.ReactNode;
  isCollapsed?: boolean;
  className?: string;
}

const NavItemButton: React.FC<{
  item: NavItemData;
  level: number;
  isCollapsed?: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}> = ({ item, level, isCollapsed, isExpanded, onToggle }) => {
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const showBadge = item.badge !== undefined && item.badge !== 0 && item.badge !== '';

  if (item.to) {
    return (
      <NavLink
        to={item.to}
        end={item.end}
        title={isCollapsed ? item.title : undefined}
        className={({ isActive }) =>
          cn(
            'group flex items-center justify-between rounded-lg px-2.5 transition-colors select-none min-h-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
            isActive
              ? 'bg-brand-soft text-brand font-semibold'
              : 'text-ink-soft hover:bg-canvas hover:text-ink',
            isCollapsed && 'justify-center',
          )
        }
        style={{ paddingLeft: isCollapsed ? undefined : `${level * 12 + 10}px` }}
      >
        <div className="flex items-center gap-3">
          <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
          {!isCollapsed && <span className="truncate">{item.title}</span>}
        </div>
        {!isCollapsed && showBadge && (
          <span className="text-xs font-medium bg-brand text-surface rounded-full px-2 py-0.5 shrink-0">
            {item.badge}
          </span>
        )}
        {isCollapsed && showBadge && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand" />
        )}
        {!isCollapsed && item.shortcut && (
          <kbd className="hidden group-hover:inline-flex text-xs text-ink-soft font-mono px-2 py-1 rounded-sm bg-canvas">
            {item.shortcut}
          </kbd>
        )}
      </NavLink>
    );
  }

  if (hasChildren && !isCollapsed) {
    return (
      <>
        <button
          type="button"
          onClick={onToggle}
          title={isCollapsed ? item.title : undefined}
          className={cn(
            'group flex items-center justify-between rounded-lg px-2.5 transition-colors select-none min-h-10 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
            'text-ink-soft hover:bg-canvas hover:text-ink',
          )}
          style={{ paddingLeft: `${level * 12 + 10}px` }}
        >
          <div className="flex items-center gap-3">
            <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
            <span className="truncate">{item.title}</span>
          </div>
          <ChevronRight
            className={cn(
              'w-[18px] h-[18px] shrink-0 transition-transform',
              isExpanded && 'rotate-90',
            )}
            strokeWidth={1.75}
          />
        </button>
        <div
          className={cn(
            'grid transition-[grid-template-rows,opacity] duration-300 ease-in-out border-l border-border ml-6',
            isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
          )}
        >
          <div className="overflow-hidden min-h-0">
            {item.children?.map((child) => (
              <NavItemButton
                key={child.id}
                item={child}
                level={level + 1}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (hasChildren && isCollapsed) {
    return (
      <button
        type="button"
        title={item.title}
        className={cn(
          'flex items-center justify-center rounded-lg px-2.5 transition-colors select-none min-h-10 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
          'text-ink-soft hover:bg-canvas hover:text-ink',
        )}
      >
        <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
        {showBadge && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand" />
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={item.onSelect}
      title={isCollapsed ? item.title : undefined}
      className={cn(
        'group flex items-center justify-between rounded-lg px-2.5 transition-colors select-none min-h-10 w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand',
        'text-ink-soft hover:bg-canvas hover:text-ink',
        isCollapsed && 'justify-center',
      )}
      style={{ paddingLeft: isCollapsed ? undefined : `${level * 12 + 10}px` }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={1.75} />
        {!isCollapsed && <span className="truncate">{item.title}</span>}
      </div>
      {!isCollapsed && showBadge && (
        <span className="text-xs font-medium bg-brand text-surface rounded-full px-2 py-0.5 shrink-0">
          {item.badge}
        </span>
      )}
      {isCollapsed && showBadge && (
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand" />
      )}
      {!isCollapsed && item.shortcut && (
        <kbd className="hidden group-hover:inline-flex text-xs text-ink-soft font-mono px-2 py-1 rounded-sm bg-canvas">
          {item.shortcut}
        </kbd>
      )}
    </button>
  );
};

const NavGroup: React.FC<{
  group: NavGroupData;
  isCollapsed?: boolean;
}> = ({ group, isCollapsed }) => {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  return (
    <div className="space-y-1">
      {group.heading && !isCollapsed && (
        <div className="text-[11px] font-semibold tracking-wider uppercase text-ink-soft/60 px-2.5 py-2">
          {group.heading}
        </div>
      )}
      {group.items.map((item) => (
        <div key={item.id} className="relative">
          <NavItemButton
            item={item}
            level={0}
            isCollapsed={isCollapsed}
            isExpanded={expandedItems[item.id]}
            onToggle={() => toggleItem(item.id)}
          />
        </div>
      ))}
    </div>
  );
};

export const SidebarNav = React.forwardRef<HTMLDivElement, SidebarNavProps>(
  ({ groups, bottomItems, header, isCollapsed, className }, ref) => {
    return (
      <nav
        ref={ref}
        className={cn(
          'flex flex-col h-full bg-surface border-r border-border p-3 transition-[width] duration-300 ease-in-out',
          isCollapsed ? 'w-16' : 'w-60',
          className,
        )}
      >
        {header && (
          <div className={cn('mb-4', isCollapsed && 'hidden')}>
            {header}
          </div>
        )}

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] space-y-2">
          {groups.map((group, index) => (
            <div key={index}>
              <NavGroup group={group} isCollapsed={isCollapsed} />
            </div>
          ))}
        </div>

        {bottomItems && bottomItems.length > 0 && (
          <div className="mt-auto pt-3 border-t border-border space-y-1">
            {bottomItems.map((item) => (
              <div key={item.id} className="relative">
                <NavItemButton
                  item={item}
                  level={0}
                  isCollapsed={isCollapsed}
                />
              </div>
            ))}
          </div>
        )}
      </nav>
    );
  },
);

SidebarNav.displayName = 'SidebarNav';

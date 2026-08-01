import { SkeletonCard } from '@/components/ui';
import { MenuItemCard } from './MenuItemCard';
import type { MenuItem } from '@/types/menu';

interface MenuListProps {
  items: MenuItem[];
  isLoading: boolean;
  onEdit: (item: MenuItem) => void;
}

export function MenuList({ items, isLoading, onEdit }: MenuListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const grouped = new Map<string, MenuItem[]>();

  items.forEach((item) => {
    const category = item.category ?? 'Sin categoria';
    if (!grouped.has(category)) {
      grouped.set(category, []);
    }
    grouped.get(category)!.push(item);
  });

  const sortedCategories = Array.from(grouped.keys()).sort((a, b) => {
    if (a === 'Sin categoria') return 1;
    if (b === 'Sin categoria') return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="space-y-6">
      {sortedCategories.map((category) => (
        <div key={category}>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft mb-3">
            {category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {grouped.get(category)!.map((item) => (
              <MenuItemCard
                key={item.id}
                item={item}
                onEdit={onEdit}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

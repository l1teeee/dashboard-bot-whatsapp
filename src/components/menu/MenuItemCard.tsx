import { Card, CardBody, Badge, Button, Toggle } from '@/components/ui';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/format';
import { useToggleMenuItem } from '@/hooks/useMenuMutations';
import type { MenuItem } from '@/types/menu';

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
}

export function MenuItemCard({ item, onEdit }: MenuItemCardProps) {
  const toggleMutation = useToggleMenuItem();

  const handleToggle = (available: boolean) => {
    toggleMutation.mutate({ item, available });
  };

  return (
    <Card className={cn(!item.available && 'opacity-60')}>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-ink line-clamp-1">
              {item.name}
            </h3>
            {item.description && (
              <p className="text-sm text-ink-soft line-clamp-2 mt-1">
                {item.description}
              </p>
            )}
          </div>
          <Toggle
            checked={item.available}
            onChange={(e) => handleToggle(e.currentTarget.checked)}
            disabled={toggleMutation.isPending}
            aria-label={`Disponibilidad de ${item.name}`}
          />
        </div>

        <div className="flex items-center justify-between gap-2 pt-2">
          <div className="flex items-center gap-2">
            {item.category && (
              <Badge tone="neutral" size="sm">
                {item.category}
              </Badge>
            )}
            {!item.available && (
              <Badge tone="neutral" size="sm">
                No disponible
              </Badge>
            )}
          </div>
          <p className="text-lg font-semibold text-ink">
            {formatCurrency(item.price)}
          </p>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(item)}
          >
            Editar
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

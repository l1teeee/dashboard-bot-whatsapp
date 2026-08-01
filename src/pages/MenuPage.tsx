import { useState, useMemo } from 'react';
import { Button, Input, EmptyState, ErrorState } from '@/components/ui';
import { MenuItemForm } from '@/components/menu/MenuItemForm';
import { MenuList } from '@/components/menu/MenuList';
import { useMenu } from '@/hooks/useMenu';
import type { MenuItem } from '@/types/menu';

export function MenuPage() {
  const { items, isLoading, isError, error, refetch } = useMenu();
  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const query = searchQuery.toLowerCase();
    return items.filter((item) =>
      item.name.toLowerCase().includes(query) ||
      item.description?.toLowerCase().includes(query) ||
      item.category?.toLowerCase().includes(query)
    );
  }, [items, searchQuery]);

  const handleOpenCreate = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingItem(null);
  };

  if (isError && error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-semibold text-ink">Menu</h1>
        <ErrorState
          title="Error al cargar el menu"
          message={error.message}
          onRetry={() => refetch()}
        />
      </div>
    );
  }

  const isEmpty = !isLoading && items.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Menu</h1>
        <Button variant="primary" onClick={handleOpenCreate}>
          Nuevo item
        </Button>
      </div>

      <div className="bg-brand-soft border border-border rounded-card p-3">
        <p className="text-sm text-ink-soft">
          Los items desactivados solo permanecen visibles durante esta sesion. Al recargar la pagina
          el servidor deja de listarlos.
        </p>
      </div>

      {!isEmpty && (
        <Input
          placeholder="Buscar por nombre, descripcion o categoria..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      )}

      {isEmpty ? (
        <EmptyState
          title="Menu vacio"
          description="Comienza agregando el primer item del menu"
          action={<Button variant="primary" onClick={handleOpenCreate}>Crear primer item</Button>}
        />
      ) : (
        <MenuList
          items={filteredItems}
          isLoading={isLoading}
          onEdit={handleOpenEdit}
        />
      )}

      <MenuItemForm
        open={formOpen}
        item={editingItem}
        onClose={handleCloseForm}
      />
    </div>
  );
}

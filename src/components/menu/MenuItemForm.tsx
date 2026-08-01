import { useEffect, useState, useMemo } from 'react';
import {
  Modal,
  Button,
  Input,
  Textarea,
  Toggle,
} from '@/components/ui';
import { useCreateMenuItem, useUpdateMenuItem } from '@/hooks/useMenuMutations';
import { useMenu } from '@/hooks/useMenu';
import type { MenuItem, CreateMenuItemInput, UpdateMenuItemInput } from '@/types/menu';

interface MenuItemFormProps {
  open: boolean;
  item?: MenuItem | null;
  onClose: () => void;
}

interface FormData {
  name: string;
  description: string;
  price: string;
  category: string;
  available: boolean;
}

interface FormErrors {
  name?: string;
  price?: string;
}

export function MenuItemForm({ open, item, onClose }: MenuItemFormProps) {
  const isEditing = !!item;
  const { items: menuItems } = useMenu();
  const createMutation = useCreateMenuItem();
  const updateMutation = useUpdateMenuItem();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    description: '',
    price: '',
    category: '',
    available: true,
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const suggestedCategories = useMemo(() => {
    const categories = menuItems
      .map((item) => item.category)
      .filter((cat): cat is string => cat !== null && cat !== '');
    return Array.from(new Set(categories)).sort();
  }, [menuItems]);

  useEffect(() => {
    if (open) {
      if (item) {
        setFormData({
          name: item.name,
          description: item.description ?? '',
          price: item.price.toString(),
          category: item.category ?? '',
          available: item.available,
        });
      } else {
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          available: true,
        });
      }
      setErrors({});
    }
  }, [open, item]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }

    const price = parseFloat(formData.price);
    if (!formData.price.trim()) {
      newErrors.price = 'El precio es obligatorio';
    } else if (isNaN(price) || price <= 0) {
      newErrors.price = 'El precio debe ser un numero positivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    const price = parseFloat(formData.price);
    const baseInput = {
      name: formData.name.trim(),
      price,
      available: formData.available,
    };

    const input = {
      ...baseInput,
      ...(formData.description.trim() && { description: formData.description.trim() }),
      ...(formData.category.trim() && { category: formData.category.trim() }),
    };

    if (isEditing && item) {
      await updateMutation.mutateAsync({
        id: item.id,
        input: input as UpdateMenuItemInput,
      });
    } else {
      await createMutation.mutateAsync(input as CreateMenuItemInput);
    }

    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? 'Editar item' : 'Nuevo item del menu'}
      size="lg"
      footer={
        <div className="flex gap-2 justify-end">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Guardar
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <Input
          label="Nombre"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: undefined });
          }}
          error={errors.name}
          placeholder="Ej: Hamburguesa clasica"
          disabled={isLoading}
        />

        <Textarea
          label="Descripcion"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Ingredientes y detalles del item"
          rows={3}
          disabled={isLoading}
        />

        <Input
          label="Precio"
          type="number"
          step="0.01"
          min="0.01"
          value={formData.price}
          onChange={(e) => {
            setFormData({ ...formData, price: e.target.value });
            if (errors.price) setErrors({ ...errors, price: undefined });
          }}
          error={errors.price}
          prefix="$"
          disabled={isLoading}
        />

        <div>
          <label className="text-sm font-medium text-ink block mb-2">Categoria</label>
          <div className="relative">
            <input
              type="text"
              list="categories"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Selecciona o escribe una categoria"
              disabled={isLoading}
              className="h-10 rounded-lg border border-border bg-surface px-3 text-ink w-full focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            />
            <datalist id="categories">
              {suggestedCategories.map((cat) => (
                <option key={cat} value={cat} />
              ))}
            </datalist>
          </div>
        </div>

        <Toggle
          checked={formData.available}
          onChange={(e) => setFormData({ ...formData, available: e.currentTarget.checked })}
          label="Disponible"
          disabled={isLoading}
        />
      </div>
    </Modal>
  );
}

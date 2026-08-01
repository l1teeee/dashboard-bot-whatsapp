import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getMenu } from '@/api/menu';
import { queryKeys } from '@/lib/queryKeys';
import { useMenuOverlayStore } from '@/store/menuOverlay';
import type { MenuItem } from '@/types/menu';

interface UseMenuReturn {
  items: MenuItem[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useMenu(): UseMenuReturn {
  const query = useQuery({
    queryKey: queryKeys.menu(),
    queryFn: getMenu,
  });

  const hiddenItems = useMenuOverlayStore((s) => s.hiddenItems);

  const items = useMemo(() => {
    const server = query.data ?? [];
    const serverIds = new Set(server.map((i) => i.id));
    const onlyHidden = Object.values(hiddenItems).filter((i) => !serverIds.has(i.id));
    const combined = [...server, ...onlyHidden];

    return combined.sort((a, b) => {
      const categoryA = a.category ?? '';
      const categoryB = b.category ?? '';
      const categoryCompare = categoryA.localeCompare(categoryB);
      if (categoryCompare !== 0) return categoryCompare;
      return a.name.localeCompare(b.name);
    });
  }, [query.data, hiddenItems]);

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

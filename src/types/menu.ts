export interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  available: boolean;
  created_at: string;
}

export interface CreateMenuItemInput {
  name: string;
  description?: string;
  price: number;
  category?: string;
  available?: boolean;
}

export interface UpdateMenuItemInput {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  available?: boolean;
}

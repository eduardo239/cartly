import { createContext, useContext } from 'react';
import type { ColorKey } from '../data/types';

export interface CartLine {
  key: string;
  productId: string;
  color: ColorKey;
  size?: string;
  qty: number;
}

export interface AddOptions {
  color?: ColorKey;
  size?: string;
  qty?: number;
}

export interface StoreValue {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (productId: string, options?: AddOptions) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  favorites: string[];
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;
  bagOpen: boolean;
  openBag: () => void;
  closeBag: () => void;
}

export const StoreContext = createContext<StoreValue | null>(null);

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error('useStore deve ser usado dentro de <StoreProvider>');
  return value;
}

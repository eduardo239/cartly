import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { getProduct } from '../data/products';
import { FAVORITES_SEED } from '../data/user';
import { StoreContext, type AddOptions, type CartLine, type StoreValue } from './store-context';

const SEED_LINES: CartLine[] = [
  { key: 'tenis-volt|violet|40', productId: 'tenis-volt', color: 'violet', size: '40', qty: 1 },
  { key: 'oculos-prisma|ink|', productId: 'oculos-prisma', color: 'ink', qty: 1 },
];

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(SEED_LINES);
  const [favorites, setFavorites] = useState<string[]>(FAVORITES_SEED);
  const [bagOpen, setBagOpen] = useState(false);

  const add = useCallback((productId: string, options: AddOptions = {}) => {
    const product = getProduct(productId);
    if (!product) return;
    const color = options.color ?? product.color;
    const size = options.size ?? product.defaultSize;
    const qty = Math.max(1, options.qty ?? 1);
    const key = `${productId}|${color}|${size ?? ''}`;
    setLines((current) => {
      const found = current.find((l) => l.key === key);
      if (found) return current.map((l) => (l.key === key ? { ...l, qty: l.qty + qty } : l));
      return [...current, { key, productId, color, size, qty }];
    });
  }, []);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((current) =>
      qty <= 0 ? current.filter((l) => l.key !== key) : current.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => setLines((c) => c.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const toggleFavorite = useCallback((id: string) => {
    setFavorites((c) => (c.includes(id) ? c.filter((f) => f !== id) : [...c, id]));
  }, []);

  const value = useMemo<StoreValue>(() => {
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    const subtotal = lines.reduce((sum, l) => sum + (getProduct(l.productId)?.price ?? 0) * l.qty, 0);
    return {
      lines,
      count,
      subtotal,
      add,
      setQty,
      remove,
      clear,
      favorites,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      bagOpen,
      openBag: () => setBagOpen(true),
      closeBag: () => setBagOpen(false),
    };
  }, [lines, favorites, bagOpen, add, setQty, remove, clear, toggleFavorite]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

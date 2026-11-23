import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { COLORS, PRODUCTS_SEED, SURFACES } from '../data/products';
import { REVIEWS_SEED } from '../data/reviews';
import type { ActiveOrder, OrderItem, Product, PurchaseStatus, Review } from '../data/types';
import { ACTIVE_ORDERS, FAVORITES_SEED, PAST_ORDERS, USER } from '../data/user';
import { slugify } from '../lib/format';
import { StoreContext, type AddOptions, type CartLine, type StoreValue } from './store-context';

const SEED_LINES: CartLine[] = [
  { key: 'tenis-volt|violet|40', productId: 'tenis-volt', color: 'violet', size: '40', qty: 1 },
  { key: 'oculos-prisma|ink|', productId: 'oculos-prisma', color: 'ink', qty: 1 },
];

const CATALOG_KEY = 'carlty:catalog:v1';

function isProduct(v: unknown): v is Product {
  if (typeof v !== 'object' || v === null) return false;
  const p = v as Partial<Product>;
  return (
    typeof p.id === 'string' &&
    typeof p.name === 'string' &&
    typeof p.price === 'number' &&
    typeof p.stock === 'number' &&
    typeof p.published === 'boolean' &&
    typeof p.shape === 'object' &&
    p.shape !== null &&
    Array.isArray(p.colors) &&
    Array.isArray(p.related) &&
    p.surface !== undefined &&
    p.surface in SURFACES &&
    p.color !== undefined &&
    p.color in COLORS
  );
}

/** Catálogo salvo pelo admin neste navegador, ou o inicial. */
function loadCatalog(): Product[] {
  try {
    const raw = localStorage.getItem(CATALOG_KEY);
    if (raw) {
      const data: unknown = JSON.parse(raw);
      if (Array.isArray(data) && data.every(isProduct)) return data;
    }
  } catch {
    /* armazenamento indisponível ou corrompido: usa o catálogo inicial */
  }
  return PRODUCTS_SEED;
}

export default function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(loadCatalog);
  const [lines, setLines] = useState<CartLine[]>(SEED_LINES);
  const [favorites, setFavorites] = useState<string[]>(FAVORITES_SEED);
  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>(ACTIVE_ORDERS);
  const [lastOrder, setLastOrder] = useState<ActiveOrder | null>(null);
  const [reviews, setReviews] = useState<Review[]>(REVIEWS_SEED);
  const [bagOpen, setBagOpen] = useState(false);

  useEffect(() => {
    try {
      if (products === PRODUCTS_SEED) localStorage.removeItem(CATALOG_KEY);
      else localStorage.setItem(CATALOG_KEY, JSON.stringify(products));
    } catch {
      /* sem persistência: as mudanças valem só nesta sessão */
    }
  }, [products]);

  /* Catálogo */
  const getProduct = useCallback((id: string | undefined) => products.find((p) => p.id === id), [products]);

  const saveProduct = useCallback((product: Product) => {
    setProducts((current) =>
      current.some((p) => p.id === product.id)
        ? current.map((p) => (p.id === product.id ? product : p))
        : [...current, product],
    );
  }, []);

  const deleteProduct = useCallback((id: string) => {
    setProducts((current) =>
      current.filter((p) => p.id !== id).map((p) => (p.related.includes(id) ? { ...p, related: p.related.filter((r) => r !== id) } : p)),
    );
    setLines((current) => current.filter((l) => l.productId !== id));
    setFavorites((current) => current.filter((f) => f !== id));
    setReviews((current) => current.filter((r) => r.productId !== id));
  }, []);

  const duplicateProduct = useCallback(
    (id: string) => {
      const source = products.find((p) => p.id === id);
      if (!source) return undefined;
      const base = slugify(`${source.name} copia`);
      let newId = base;
      for (let n = 2; products.some((p) => p.id === newId); n++) newId = `${base}-${n}`;
      const copy: Product = {
        ...source,
        id: newId,
        name: `${source.name} (cópia)`,
        number: Math.max(...products.map((p) => p.number)) + 1,
        published: false,
      };
      setProducts((current) => [...current, copy]);
      return newId;
    },
    [products],
  );

  const resetCatalog = useCallback(() => setProducts(PRODUCTS_SEED), []);

  /* Sacola */
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
  }, [getProduct]);

  const setQty = useCallback((key: string, qty: number) => {
    setLines((current) =>
      qty <= 0 ? current.filter((l) => l.key !== key) : current.map((l) => (l.key === key ? { ...l, qty } : l)),
    );
  }, []);

  const remove = useCallback((key: string) => setLines((c) => c.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  /* Favoritos */
  const toggleFavorite = useCallback((id: string) => {
    setFavorites((c) => (c.includes(id) ? c.filter((f) => f !== id) : [...c, id]));
  }, []);

  /* Interface */
  const openBag = useCallback(() => {
    setLastOrder(null);
    setBagOpen(true);
  }, []);
  const closeBag = useCallback(() => setBagOpen(false), []);

  /* Pedidos */
  const checkout = useCallback(() => {
    if (lines.length === 0) return;
    const items: OrderItem[] = [];
    for (const line of lines) {
      const existing = items.find((i) => i.productId === line.productId);
      if (existing) existing.qty += line.qty;
      else items.push({ productId: line.productId, qty: line.qty });
    }
    const nextId = Math.max(...activeOrders.map((o) => o.id), ...PAST_ORDERS.map((o) => o.id)) + 1;
    const order: ActiveOrder = {
      id: nextId,
      items,
      eta: 'Previsão: 2 a 5 dias úteis',
      step: 1,
      status: 'Confirmado',
      events: [{ label: 'Pagamento confirmado', when: 'Agora' }],
    };
    setActiveOrders((current) => [order, ...current]);
    setLastOrder(order);
    setLines([]);
  }, [lines, activeOrders]);

  const buyAgain = useCallback(
    (items: OrderItem[]) => {
      items.forEach((item) => add(item.productId, { qty: item.qty }));
      openBag();
    },
    [add, openBag],
  );

  /* Avaliações */
  const purchaseStatus = useCallback(
    (productId: string): PurchaseStatus => {
      const has = (items: OrderItem[]) => items.some((i) => i.productId === productId);
      if (PAST_ORDERS.some((o) => o.status === 'Entregue' && has(o.items))) return 'delivered';
      if (activeOrders.some((o) => has(o.items))) return 'in-progress';
      return 'none';
    },
    [activeOrders],
  );

  const addReview = useCallback(
    (productId: string, rating: number, text: string) => {
      const body = text.trim();
      const exists = reviews.some((r) => r.mine && r.productId === productId);
      if (purchaseStatus(productId) !== 'delivered' || exists || rating < 1 || rating > 5 || !body) return false;
      const review: Review = {
        id: `mine-${Date.now()}`,
        productId,
        author: `${USER.firstName} ${USER.name.split(' ').at(-1)?.[0] ?? ''}.`,
        rating,
        text: body,
        date: new Date().toLocaleDateString('pt-BR'),
        mine: true,
      };
      setReviews((current) => [review, ...current]);
      return true;
    },
    [reviews, purchaseStatus],
  );

  const removeReview = useCallback((id: string) => {
    setReviews((current) => current.filter((r) => !(r.id === id && r.mine)));
  }, []);

  const value = useMemo<StoreValue>(
    () => ({
      user: USER,
      products,
      catalog: products.filter((p) => p.published),
      getProduct,
      saveProduct,
      deleteProduct,
      duplicateProduct,
      resetCatalog,
      lines,
      count: lines.reduce((sum, l) => sum + l.qty, 0),
      subtotal: lines.reduce((sum, l) => sum + (getProduct(l.productId)?.price ?? 0) * l.qty, 0),
      add,
      setQty,
      remove,
      clear,
      favorites,
      favoriteProducts: favorites.map(getProduct).filter((p): p is Product => Boolean(p?.published)),
      favoritesTotal: USER.savedBefore + favorites.length,
      isFavorite: (id) => favorites.includes(id),
      toggleFavorite,
      activeOrders,
      pastOrders: PAST_ORDERS,
      ordersTotal: USER.orders + activeOrders.length - ACTIVE_ORDERS.length,
      checkout,
      lastOrder,
      buyAgain,
      reviews,
      reviewsFor: (productId) => reviews.filter((r) => r.productId === productId),
      purchaseStatus,
      addReview,
      removeReview,
      bagOpen,
      openBag,
      closeBag,
    }),
    [products, getProduct, saveProduct, deleteProduct, duplicateProduct, resetCatalog, lines, favorites, activeOrders, lastOrder, reviews, purchaseStatus, addReview, removeReview, bagOpen, add, setQty, remove, clear, toggleFavorite, checkout, buyAgain, openBag, closeBag],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

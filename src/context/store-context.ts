import { createContext, useContext } from 'react';
import type { ActiveOrder, ColorKey, OrderItem, PastOrder, Product, PurchaseStatus, Review } from '../data/types';
import type { User } from '../data/user';

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

/**
 * Estado global da aplicação.
 *
 * Fica de fora de propósito o que deve viver na URL (busca `?q=` e categoria `?c=`)
 * e o que é local a uma tela (aba do perfil, variação escolhida no produto).
 */
export interface StoreValue {
  /* Cliente */
  user: User;

  /* Catálogo */
  /** Todos os produtos, inclusive os ocultos (uso do admin). */
  products: Product[];
  /** Só os publicados: o que a loja exibe. */
  catalog: Product[];
  /** Busca qualquer produto, publicado ou não. */
  getProduct: (id: string | undefined) => Product | undefined;
  /** Cria o produto ou, se o `id` já existir, atualiza. */
  saveProduct: (product: Product) => void;
  /** Remove o produto e limpa sacola, favoritos, avaliações e relacionados que o citam. */
  deleteProduct: (id: string) => void;
  /** Cria uma cópia oculta e devolve o id novo. */
  duplicateProduct: (id: string) => string | undefined;
  /** Volta ao catálogo inicial. */
  resetCatalog: () => void;

  /* Sacola */
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (productId: string, options?: AddOptions) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;

  /* Favoritos */
  favorites: string[];
  /** Favoritos que existem e estão publicados. */
  favoriteProducts: Product[];
  /** Favoritos desta sessão somados aos antigos do cliente. */
  favoritesTotal: number;
  isFavorite: (productId: string) => boolean;
  toggleFavorite: (productId: string) => void;

  /* Pedidos */
  activeOrders: ActiveOrder[];
  pastOrders: PastOrder[];
  ordersTotal: number;
  /** Transforma a sacola em um pedido em andamento e esvazia a sacola. */
  checkout: () => void;
  /** Pedido recém-criado, exibido como confirmação na sacola. */
  lastOrder: ActiveOrder | null;
  /** Coloca os itens de um pedido antigo na sacola e abre a sacola. */
  buyAgain: (items: OrderItem[]) => void;

  /* Avaliações */
  reviews: Review[];
  reviewsFor: (productId: string) => Review[];
  /** 'delivered' libera avaliar; 'in-progress' = comprou, mas ainda não recebeu. */
  purchaseStatus: (productId: string) => PurchaseStatus;
  /** Publica a avaliação do cliente (uma por produto, apenas após a entrega). */
  addReview: (productId: string, rating: number, text: string) => boolean;
  removeReview: (id: string) => void;

  /* Interface */
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

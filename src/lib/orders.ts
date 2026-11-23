import type { OrderItem, Product } from '../data/types';

/** Busca de produto (vem do contexto, já que o catálogo é editável). */
export type Lookup = (id: string) => Product | undefined;

const REMOVED = 'Produto removido';

export function orderTotal(items: OrderItem[], find: Lookup): number {
  return items.reduce((sum, i) => sum + (find(i.productId)?.price ?? 0) * i.qty, 0);
}

export function itemCount(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

/** "Tênis Volt + Óculos Prisma" */
export function orderTitle(items: OrderItem[], find: Lookup): string {
  return items.map((i) => find(i.productId)?.name ?? REMOVED).join(' + ');
}

/** "Caneca Bloco ×2, Vaso Duna" */
export function orderSummary(items: OrderItem[], find: Lookup): string {
  return items.map((i) => `${find(i.productId)?.name ?? REMOVED}${i.qty > 1 ? ` ×${i.qty}` : ''}`).join(', ');
}

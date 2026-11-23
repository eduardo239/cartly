import { getProduct } from '../data/products';
import type { OrderItem } from '../data/types';

export function orderTotal(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + (getProduct(i.productId)?.price ?? 0) * i.qty, 0);
}

export function itemCount(items: OrderItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

/** "Tênis Volt + Óculos Prisma" */
export function orderTitle(items: OrderItem[]): string {
  return items.map((i) => getProduct(i.productId)?.name ?? '').join(' + ');
}

/** "Caneca Bloco ×2, Vaso Duna" */
export function orderSummary(items: OrderItem[]): string {
  return items
    .map((i) => `${getProduct(i.productId)?.name ?? ''}${i.qty > 1 ? ` ×${i.qty}` : ''}`)
    .join(', ');
}

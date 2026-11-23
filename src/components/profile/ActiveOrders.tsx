import { useState } from 'react';
import CardPlate from '../CardPlate';
import { COLORS, getProduct } from '../../data/products';
import type { ActiveOrder } from '../../data/types';
import { ACTIVE_ORDERS, ORDER_STEPS } from '../../data/user';
import { formatPrice } from '../../lib/format';
import { itemCount, orderTitle } from '../../lib/orders';
import StatusPill from './StatusPill';

type Panel = 'track' | 'details' | null;

function OrderCard({ order }: { order: ActiveOrder }) {
  const [panel, setPanel] = useState<Panel>(null);
  const first = getProduct(order.items[0]?.productId);
  const count = itemCount(order.items);
  const toggle = (next: Exclude<Panel, null>) => setPanel((p) => (p === next ? null : next));

  return (
    <article className="flex flex-col gap-4 rounded-3xl bg-white p-4 md:p-5">
      <div className="flex items-start gap-3">
        {first && (
          <div className="w-[52px] shrink-0">
            <CardPlate surface={first.surface} color={COLORS[first.color].hex} shape={first.shape} variant="thumb" ratio={0.8} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-xs text-ink-soft">
            Pedido #{order.id} · {count} {count === 1 ? 'item' : 'itens'}
          </p>
          <h3 className="font-display text-lg font-semibold leading-snug">{orderTitle(order.items)}</h3>
          <p className="text-sm text-ink-soft">{order.eta}</p>
        </div>
        <StatusPill status={order.status} />
      </div>

      <ol className="grid grid-cols-4 gap-1.5" aria-label="Etapas do pedido">
        {ORDER_STEPS.map((label, i) => (
          <li key={label} aria-current={i === order.step - 1 ? 'step' : undefined}>
            <div className={`h-1 rounded-full ${i < order.step ? 'bg-accent' : 'bg-line'}`} />
            <span
              className={`mt-1.5 block text-[11px] ${
                i === order.step - 1 ? 'font-bold text-ink' : i < order.step ? 'text-ink' : 'text-ink-soft'
              }`}
            >
              {label}
            </span>
          </li>
        ))}
      </ol>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => toggle('track')}
          aria-expanded={panel === 'track'}
          className="h-10 rounded-full bg-ink px-5 text-sm font-semibold text-white transition hover:bg-accent"
        >
          Rastrear entrega
        </button>
        <button
          type="button"
          onClick={() => toggle('details')}
          aria-expanded={panel === 'details'}
          className="h-10 rounded-full border border-line px-5 text-sm font-medium transition hover:border-ink"
        >
          Detalhes
        </button>
      </div>

      {panel === 'track' && (
        <ol className="space-y-3 border-t border-line pt-4">
          {order.events.map((e, i) => (
            <li key={e.label} className="flex gap-3 text-sm">
              <span className={`mt-1.5 size-2 shrink-0 rounded-full ${i === 0 ? 'bg-accent' : 'bg-line'}`} />
              <div>
                <p className={i === 0 ? 'font-semibold' : ''}>{e.label}</p>
                <p className="text-xs text-ink-soft">{e.when}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
      {panel === 'details' && (
        <ul className="space-y-2 border-t border-line pt-4 text-sm">
          {order.items.map((item) => {
            const p = getProduct(item.productId);
            return (
              <li key={item.productId} className="flex justify-between gap-3">
                <span>
                  {p?.name} {item.qty > 1 && `×${item.qty}`}
                </span>
                <span className="font-medium">{formatPrice((p?.price ?? 0) * item.qty)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}

export default function ActiveOrders() {
  return (
    <section aria-labelledby="active-orders">
      <h2 id="active-orders" className="mb-4 text-2xl font-semibold md:text-[22px]">
        <span className="md:hidden">Em andamento</span>
        <span className="hidden md:inline">Pedidos em andamento</span>
      </h2>
      <div className="grid items-start gap-4 lg:grid-cols-2">
        {ACTIVE_ORDERS.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </section>
  );
}

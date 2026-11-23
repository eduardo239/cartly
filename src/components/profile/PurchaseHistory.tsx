import { useState } from 'react';
import { useStore } from '../../context/store-context';
import type { PastOrder } from '../../data/types';
import { formatPrice } from '../../lib/format';
import { orderSummary, orderTotal } from '../../lib/orders';
import StatusPill from './StatusPill';

const FILTERS = ['Todos', 'Entregues', 'Devolvidos'] as const;
type Filter = (typeof FILTERS)[number];

const MATCH: Record<Filter, (o: PastOrder) => boolean> = {
  Todos: () => true,
  Entregues: (o) => o.status === 'Entregue',
  Devolvidos: (o) => o.status === 'Devolvido',
};

export default function PurchaseHistory() {
  const { pastOrders, buyAgain } = useStore();
  const [filter, setFilter] = useState<Filter>('Todos');
  const rows = pastOrders.filter(MATCH[filter]);

  const link = 'text-sm text-accent underline underline-offset-2';

  return (
    <section aria-labelledby="history-title">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 id="history-title" className="text-2xl font-semibold md:text-[22px]">
          Histórico de compras
        </h2>
        <div className="flex rounded-full bg-white p-1" role="group" aria-label="Filtrar pedidos">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`h-9 rounded-full px-4 text-sm font-medium transition ${
                filter === f ? 'bg-ink text-white' : 'hover:bg-canvas'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-3xl bg-white p-8 text-center text-sm text-ink-soft">Nenhum pedido nesta categoria.</p>
      ) : (
        <>
          {/* Tabela (md+) */}
          <div className="hidden overflow-hidden rounded-3xl bg-white md:block">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-ink-soft">
                  {['Pedido', 'Data', 'Itens', 'Total', 'Status'].map((h) => (
                    <th key={h} scope="col" className="px-5 pb-3 pt-5 font-medium">
                      {h}
                    </th>
                  ))}
                  <th scope="col" className="sr-only">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => (
                  <tr key={o.id} className="border-t border-line">
                    <td className="px-5 py-4 font-semibold">#{o.id}</td>
                    <td className="px-5 py-4 text-ink-soft">{o.date}</td>
                    <td className="px-5 py-4">{orderSummary(o.items)}</td>
                    <td className="px-5 py-4 font-semibold">{formatPrice(orderTotal(o.items))}</td>
                    <td className="px-5 py-4">
                      <StatusPill status={o.status} />
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button type="button" onClick={() => buyAgain(o.items)} className={link}>
                        Comprar de novo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lista (mobile) */}
          <ul className="space-y-3 md:hidden">
            {rows.map((o) => (
              <li key={o.id} className="rounded-2xl bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">#{o.id}</span>
                  <StatusPill status={o.status} />
                </div>
                <p className="mt-2 text-sm">{orderSummary(o.items)}</p>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-ink-soft">
                    {o.date} · <span className="font-semibold text-ink">{formatPrice(orderTotal(o.items))}</span>
                  </span>
                  <button type="button" onClick={() => buyAgain(o.items)} className={link}>
                    Comprar de novo
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

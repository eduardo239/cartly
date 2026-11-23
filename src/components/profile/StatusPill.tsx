import type { OrderStatus } from '../../data/types';

const STYLES: Record<OrderStatus, string> = {
  Confirmado: 'bg-accent-soft text-ink',
  Enviado: 'bg-lime text-ink',
  Separando: 'bg-accent-soft text-ink',
  Entregue: 'bg-mint text-mint-ink',
  Devolvido: 'bg-peach text-peach-ink',
};

export default function StatusPill({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${STYLES[status]}`}>{status}</span>
  );
}

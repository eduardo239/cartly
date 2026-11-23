import { useStore } from '../../context/store-context';

/** Cartão escuro do cliente, com moldura interna como as cartas da loja. */
export default function ProfileCard() {
  const { user, ordersTotal, favoritesTotal } = useStore();
  const stats = [
    { value: ordersTotal, label: 'pedidos' },
    { value: favoritesTotal, label: 'favoritos' },
    { value: user.coupons, label: 'cupons' },
  ];

  return (
    <div className="rounded-[28px] bg-ink p-2 text-white">
      <div className="relative rounded-[22px] border border-white/15 p-4 md:p-5">
        {user.vip && <span className="absolute right-4 top-3 font-display text-xs font-bold text-lime">VIP</span>}
        <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
          <span className="grid size-16 shrink-0 place-items-center rounded-full bg-accent font-display text-xl font-bold md:size-[46px] md:text-base">
            {user.initials}
          </span>
          <div>
            <p className="font-display text-2xl font-semibold leading-tight md:text-lg">{user.name}</p>
            <p className="text-sm text-white/65 md:text-[11px]">Cliente desde {user.since}</p>
          </div>
        </div>
        <dl className="mt-4 flex gap-8 md:gap-5">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="font-display text-2xl font-bold leading-none md:text-base">{s.value}</dd>
              <dt className="mt-1 text-sm text-white/65 md:text-[11px]">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

import type { ActiveOrder, PastOrder } from './types';

export const USER = {
  name: 'Marina Alves',
  firstName: 'Marina',
  initials: 'MA',
  since: 'mar. 2024',
  vip: true,
  orders: 14,
  coupons: 2,
  /** Favoritos antigos, fora desta sessão — somados aos que o usuário marca agora. */
  savedBefore: 18,
};

export type User = typeof USER;

export const FAVORITES_SEED = ['fone-halo', 'relogio-orbita', 'garrafa-fluxo', 'camera-foco', 'vaso-duna'];

export const ORDER_STEPS = ['Confirmado', 'Separado', 'Enviado', 'Entregue'];

export const ACTIVE_ORDERS: ActiveOrder[] = [
  {
    id: 4821,
    items: [
      { productId: 'tenis-volt', qty: 1 },
      { productId: 'oculos-prisma', qty: 1 },
    ],
    eta: 'Chega quinta, 27 de nov.',
    step: 3,
    status: 'Enviado',
    events: [
      { label: 'Pedido em trânsito — centro de distribuição São Paulo', when: 'Hoje, 07:40' },
      { label: 'Pedido enviado pela transportadora', when: 'Ontem, 18:12' },
      { label: 'Itens separados no estoque', when: 'Ontem, 11:05' },
      { label: 'Pagamento confirmado', when: '20/11, 21:30' },
    ],
  },
  {
    id: 4836,
    items: [{ productId: 'luminaria-arco', qty: 1 }],
    eta: 'Previsão: 2 a 4 dias úteis',
    step: 2,
    status: 'Separando',
    events: [
      { label: 'Separando itens no estoque', when: 'Hoje, 09:15' },
      { label: 'Pagamento confirmado', when: 'Hoje, 08:52' },
    ],
  },
];

export const PAST_ORDERS: PastOrder[] = [
  { id: 4790, date: '02/11/2026', items: [{ productId: 'caneca-bloco', qty: 2 }], status: 'Entregue' },
  { id: 4712, date: '18/10/2026', items: [{ productId: 'mochila-trama', qty: 1 }], status: 'Entregue' },
  { id: 4655, date: '30/09/2026', items: [{ productId: 'teclado-tecla', qty: 1 }], status: 'Devolvido' },
  { id: 4581, date: '12/09/2026', items: [{ productId: 'jaqueta-norte', qty: 1 }], status: 'Entregue' },
  {
    id: 4502,
    date: '21/08/2026',
    items: [
      { productId: 'garrafa-fluxo', qty: 1 },
      { productId: 'vaso-duna', qty: 1 },
    ],
    status: 'Entregue',
  },
];

export const ADDRESSES = [
  { label: 'Casa', lines: ['Rua das Acácias, 214 — apto 62', 'Vila Mariana, São Paulo – SP', 'CEP 04101-000'], main: true },
  { label: 'Trabalho', lines: ['Av. Paulista, 1500 — 9º andar', 'Bela Vista, São Paulo – SP', 'CEP 01310-200'], main: false },
];

export const PAYMENTS = [
  { label: 'Cartão Nubank', detail: 'Mastercard final 4821 · vence 08/29', main: true },
  { label: 'Pix', detail: 'Chave cadastrada: e-mail', main: false },
];

export const SETTINGS = [
  { id: 'status', label: 'Avisos de status do pedido', hint: 'Receba atualizações por e-mail e push.', on: true },
  { id: 'promos', label: 'Ofertas e novas cartas', hint: 'Lançamentos e cupons exclusivos VIP.', on: true },
  { id: 'news', label: 'Newsletter semanal', hint: 'Uma curadoria por semana, sem spam.', on: false },
];

export type Category = 'Moda' | 'Áudio' | 'Casa' | 'Acessórios' | 'Tech';

/** Fundo e cor do texto da carta. */
export type SurfaceKey = 'violet' | 'night' | 'peach' | 'mint' | 'mist' | 'lime' | 'cloud';

/** Cor da forma (a "variação" do produto). */
export type ColorKey = 'violet' | 'ink' | 'coral' | 'green' | 'lime' | 'white';

export interface Surface {
  bg: string;
  ink: string;
}

export interface ColorOption {
  name: string;
  hex: string;
}

/** Forma desenhada no centro da carta. `width` é % da largura da moldura. */
export interface Shape {
  width: number;
  ratio: number;
  radius: string;
}

export interface Product {
  id: string;
  number: number;
  name: string;
  category: Category;
  price: number;
  oldPrice?: number;
  description: string;
  material: string;
  weight: string;
  delivery: string;
  returns: string;
  surface: SurfaceKey;
  /** Cor padrão da forma. */
  color: ColorKey;
  /** Cores disponíveis (inclui a padrão). */
  colors: ColorKey[];
  shape: Shape;
  /** largura / altura da moldura interna na grade. */
  frameRatio: number;
  sizeLabel?: string;
  sizes?: string[];
  defaultSize?: string;
  related: string[];
}

export interface OrderItem {
  productId: string;
  qty: number;
}

export type OrderStatus = 'Enviado' | 'Separando' | 'Entregue' | 'Devolvido';

export interface TrackingEvent {
  label: string;
  when: string;
}

export interface ActiveOrder {
  id: number;
  items: OrderItem[];
  eta: string;
  /** Quantas etapas já foram concluídas (1–4). */
  step: number;
  status: OrderStatus;
  events: TrackingEvent[];
}

export interface PastOrder {
  id: number;
  date: string;
  items: OrderItem[];
  status: OrderStatus;
}

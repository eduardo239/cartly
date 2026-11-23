import type { CSSProperties, ReactNode } from 'react';
import { SURFACES } from '../data/products';
import type { Shape, SurfaceKey } from '../data/types';
import { pad } from '../lib/format';
import { DiamondIcon } from './icons';

type Variant = 'card' | 'hero' | 'thumb';

interface CardPlateProps {
  surface: SurfaceKey;
  /** Cor da forma (hex). */
  color: string;
  shape: Shape;
  number?: number;
  variant?: Variant;
  /** largura / altura da moldura. Para `hero`, use `frameClassName`. */
  ratio?: number;
  frameClassName?: string;
  /** Conteúdo posicionado dentro da moldura (ex.: etiqueta da vista). */
  frameChildren?: ReactNode;
  /** Conteúdo posicionado sobre a carta inteira (ex.: botões flutuantes). */
  overlay?: ReactNode;
  /** Conteúdo abaixo da moldura (nome e preço). */
  footer?: ReactNode;
  /** Muda para reiniciar a animação da forma. */
  shapeKey?: string;
  className?: string;
}

const PLATE: Record<Variant, string> = {
  card: 'rounded-[20px] p-2',
  hero: 'rounded-[28px] p-3 md:rounded-[32px] md:p-4',
  thumb: 'rounded-xl p-1.5',
};

const FRAME: Record<Variant, string> = {
  card: 'rounded-[14px]',
  hero: 'rounded-[20px] md:rounded-[24px]',
  thumb: 'rounded-lg',
};

const CORNER: Record<Variant, string> = {
  card: 'text-[13px] gap-0.5',
  hero: 'text-xl md:text-2xl gap-1',
  thumb: 'hidden',
};

/**
 * A "carta": placa colorida com moldura interna, cantos numerados (estilo baralho)
 * e uma forma geométrica no centro que representa o produto.
 */
export default function CardPlate({
  surface,
  color,
  shape,
  number,
  variant = 'card',
  ratio,
  frameClassName = '',
  frameChildren,
  overlay,
  footer,
  shapeKey,
  className = '',
}: CardPlateProps) {
  const { bg, ink } = SURFACES[surface];
  const frameStyle: CSSProperties = {
    borderColor: `color-mix(in srgb, ${ink} 14%, transparent)`,
    ...(ratio ? { aspectRatio: ratio } : {}),
  };
  const corner = `absolute flex flex-col items-start font-display font-bold leading-none ${CORNER[variant]}`;
  const heroPos = variant === 'hero' ? 'left-5 top-[76px] md:left-6 md:top-6' : 'left-3 top-2.5';
  const heroPosEnd = variant === 'hero' ? 'bottom-5 right-5 md:bottom-6 md:right-6' : 'bottom-2.5 right-3';

  return (
    <div className={`relative ${PLATE[variant]} ${className}`} style={{ background: bg, color: ink }}>
      <div className={`relative w-full overflow-hidden border ${FRAME[variant]} ${frameClassName}`} style={frameStyle}>
        {number !== undefined && variant !== 'thumb' && (
          <>
            <span className={`${corner} ${heroPos}`}>
              {pad(number)}
              <DiamondIcon />
            </span>
            <span className={`${corner} ${heroPosEnd} rotate-180`}>
              {pad(number)}
              <DiamondIcon />
            </span>
          </>
        )}
        <div className="absolute inset-0 grid place-items-center">
          <div
            key={shapeKey}
            className="pop"
            style={{
              width: `${shape.width}%`,
              aspectRatio: shape.ratio,
              borderRadius: shape.radius,
              background: color,
            }}
          />
        </div>
        {frameChildren}
      </div>
      {footer}
      {overlay}
    </div>
  );
}

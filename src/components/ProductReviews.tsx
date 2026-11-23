import { useState, type FormEvent } from 'react';
import { useStore } from '../context/store-context';
import type { Review } from '../data/types';
import { formatAverage, REVIEW_MAX, REVIEW_MIN, summarize } from '../lib/reviews';
import { StarIcon } from './icons';

/** Estrelas somente leitura. */
export function Stars({ value, size = 16 }: { value: number; size?: number }) {
  const rounded = Math.round(value);
  return (
    <span className="inline-flex gap-0.5 text-accent" role="img" aria-label={`Nota ${formatAverage(value)} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} width={size} height={size} fill={n <= rounded ? 'currentColor' : 'none'} />
      ))}
    </span>
  );
}

function ReviewForm({ productId }: { productId: string }) {
  const { addReview } = useStore();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [touched, setTouched] = useState(false);

  const tooShort = text.trim().length < REVIEW_MIN;
  const invalid = rating === 0 || tooShort;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!invalid) addReview(productId, rating, text);
  };

  return (
    <form onSubmit={submit} className="rounded-3xl bg-white p-5" noValidate>
      <h3 className="font-display text-lg font-semibold">Conte como foi</h3>
      <p className="mt-0.5 text-sm text-ink-soft">Você recebeu este produto, então sua opinião ajuda outras pessoas.</p>

      <div className="mt-4" role="radiogroup" aria-label="Sua nota">
        <div className="flex gap-1 text-accent" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} ${n === 1 ? 'estrela' : 'estrelas'}`}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              className="rounded p-0.5 transition-transform hover:scale-110"
            >
              <StarIcon width={30} height={30} fill={n <= (hover || rating) ? 'currentColor' : 'none'} />
            </button>
          ))}
        </div>
        {touched && rating === 0 && <p className="mt-1 text-xs text-peach-ink">Escolha uma nota de 1 a 5.</p>}
      </div>

      <label className="mt-4 block">
        <span className="text-xs font-semibold uppercase tracking-wide">Comentário</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={REVIEW_MAX}
          rows={4}
          placeholder="O que você achou do produto? Qualidade, caimento, entrega..."
          className="mt-2 w-full resize-y rounded-2xl border border-line bg-canvas px-4 py-3 text-[15px] outline-none placeholder:text-ink-soft focus:border-accent"
        />
      </label>
      <div className="mt-1 flex justify-between text-xs">
        <span className={touched && tooShort ? 'text-peach-ink' : 'text-ink-soft'}>Mínimo de {REVIEW_MIN} caracteres.</span>
        <span className="text-ink-soft tabular-nums">
          {text.length}/{REVIEW_MAX}
        </span>
      </div>

      <button
        type="submit"
        className="mt-4 h-11 rounded-full bg-accent px-6 text-sm font-semibold text-white transition hover:bg-accent-ink"
      >
        Publicar avaliação
      </button>
    </form>
  );
}

function ReviewItem({ review }: { review: Review }) {
  const { removeReview } = useStore();
  return (
    <li className="rounded-3xl bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft font-display text-sm font-bold">
            {review.author[0]}
          </span>
          <div>
            <p className="text-sm font-semibold">
              {review.author}
              {review.mine && <span className="ml-2 rounded-full bg-lime px-2 py-0.5 text-[11px] font-bold">Você</span>}
            </p>
            <p className="flex items-center gap-1 text-xs text-mint-ink">
              <span aria-hidden="true">●</span> Compra verificada
            </p>
          </div>
        </div>
        <time className="shrink-0 text-xs text-ink-soft">{review.date}</time>
      </div>
      <div className="mt-3">
        <Stars value={review.rating} />
      </div>
      <p className="mt-2 whitespace-pre-line break-words text-[15px] leading-relaxed text-ink-soft">{review.text}</p>
      {review.mine && (
        <button
          type="button"
          onClick={() => removeReview(review.id)}
          className="mt-3 text-sm text-peach-ink underline underline-offset-2"
        >
          Excluir minha avaliação
        </button>
      )}
    </li>
  );
}

export default function ProductReviews({ productId }: { productId: string }) {
  const { reviewsFor, purchaseStatus } = useStore();
  const reviews = reviewsFor(productId);
  const { count, average, distribution } = summarize(reviews);
  const status = purchaseStatus(productId);
  const hasMine = reviews.some((r) => r.mine);

  return (
    <section id="avaliacoes" className="mt-14 scroll-mt-24 md:mt-16" aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="mb-5 text-[28px] font-semibold">
        Avaliações{count > 0 && <span className="ml-2 text-lg font-medium text-ink-soft">({count})</span>}
      </h2>

      <div className="grid gap-6 md:grid-cols-[260px_minmax(0,1fr)] md:gap-8">
        <div className="space-y-4 md:sticky md:top-24 md:self-start">
          <div className="rounded-3xl bg-white p-5">
            {count === 0 ? (
              <p className="text-sm text-ink-soft">Ainda sem avaliações.</p>
            ) : (
              <>
                <div className="flex items-end gap-3">
                  <span className="font-display text-5xl font-bold leading-none">{formatAverage(average)}</span>
                  <div className="pb-1">
                    <Stars value={average} />
                    <p className="mt-1 text-xs text-ink-soft">
                      {count} {count === 1 ? 'avaliação' : 'avaliações'}
                    </p>
                  </div>
                </div>
                <ul className="mt-4 space-y-1.5" aria-label="Distribuição das notas">
                  {distribution.map(({ stars, count: n }) => (
                    <li key={stars} className="flex items-center gap-2 text-xs">
                      <span className="w-3 tabular-nums">{stars}</span>
                      <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-line">
                        <span className="block h-full rounded-full bg-accent" style={{ width: `${(n / count) * 100}%` }} />
                      </span>
                      <span className="w-4 text-right tabular-nums text-ink-soft">{n}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-4">
          {status === 'delivered' && !hasMine && <ReviewForm productId={productId} />}
          {status === 'delivered' && hasMine && (
            <p className="rounded-2xl bg-mint px-4 py-3 text-sm text-mint-ink">Obrigado! Sua avaliação já está publicada.</p>
          )}
          {status === 'in-progress' && (
            <p className="rounded-2xl bg-accent-soft px-4 py-3 text-sm">
              Você já comprou este produto. Poderá avaliar assim que o pedido for entregue.
            </p>
          )}
          {status === 'none' && (
            <p className="rounded-2xl bg-white px-4 py-3 text-sm text-ink-soft">
              Só quem comprou este produto pode avaliar.
            </p>
          )}

          {count === 0 ? (
            <p className="rounded-3xl bg-white p-8 text-center text-sm text-ink-soft">
              Seja a primeira pessoa a contar como foi.
            </p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((r) => (
                <ReviewItem key={r.id} review={r} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}

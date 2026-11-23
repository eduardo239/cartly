import type { Review } from '../data/types';

export interface ReviewSummary {
  count: number;
  average: number;
  /** Quantidade de avaliações por nota, de 5 a 1. */
  distribution: { stars: number; count: number }[];
}

export function summarize(reviews: Review[]): ReviewSummary {
  const count = reviews.length;
  const average = count ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({ stars, count: reviews.filter((r) => r.rating === stars).length }));
  return { count, average, distribution };
}

export function formatAverage(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export const REVIEW_MIN = 10;
export const REVIEW_MAX = 500;

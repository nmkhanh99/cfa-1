/**
 * Spaced Repetition (SM-2) — thuật toán lặp lại ngắt quãng cho flashcard.
 * Thuần & nhận `now` (ms) làm tham số để test tất định (không gọi Date.now trong engine).
 */

export const DAY_MS = 86_400_000;

export interface SrsCard {
  id: string;
  repetitions: number; // số lần nhớ đúng liên tiếp
  easeFactor: number; // hệ số dễ (≥ 1.3)
  intervalDays: number; // khoảng cách tới lần ôn kế (ngày)
  dueAt: number; // thời điểm đến hạn ôn (ms)
  lastReviewedAt: number | null;
}

/** Tạo thẻ mới, đến hạn ngay (dueAt = now). */
export function initCard(id: string, now = 0): SrsCard {
  return { id, repetitions: 0, easeFactor: 2.5, intervalDays: 0, dueAt: now, lastReviewedAt: null };
}

/**
 * Cập nhật thẻ sau một lần ôn theo SM-2.
 * quality 0–5: <3 = quên (reset), ≥3 = nhớ. Trả thẻ mới (immutable).
 */
export function reviewCard(card: SrsCard, quality: number, now: number): SrsCard {
  if (!Number.isFinite(quality) || quality < 0 || quality > 5) throw new Error("quality phải là số trong [0, 5]");

  let { repetitions, intervalDays } = card;
  if (quality < 3) {
    repetitions = 0;
    intervalDays = 1;
  } else {
    if (repetitions === 0) intervalDays = 1;
    else if (repetitions === 1) intervalDays = 6;
    else intervalDays = Math.round(intervalDays * card.easeFactor);
    repetitions += 1;
  }

  const easeFactor = Math.max(1.3, card.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  return {
    ...card,
    repetitions,
    intervalDays,
    easeFactor,
    dueAt: now + intervalDays * DAY_MS,
    lastReviewedAt: now,
  };
}

/** Thẻ đến hạn ôn nếu dueAt ≤ now. */
export function isDue(card: SrsCard, now: number): boolean {
  return card.dueAt <= now;
}

/**
 * LM4 — Probability Trees and Conditional Expectations. Engine thuần (không phụ thuộc UI).
 * Mọi hàm kiểm thử đối chiếu Example trong 2024 L1V1.pdf, LM4 (xem probability.test.ts).
 */

function checkPairs(values: number[], probs: number[], probsSumToOne: boolean): void {
  if (values.length !== probs.length) throw new Error("values và probs phải cùng độ dài");
  if (values.length === 0) throw new Error("Cần ít nhất 1 outcome");
  if (probs.some((p) => p < 0 || p > 1)) throw new Error("Xác suất phải trong [0, 1]");
  if (probsSumToOne) {
    const sum = probs.reduce((a, b) => a + b, 0);
    if (Math.abs(sum - 1) > 1e-3) throw new Error("Tổng xác suất phải bằng 1");
  }
}

/** Expected value (Eq. 1): E(X) = Σ P(Xi)·Xi. Cũng dùng cho total probability rule for expected value (Eq. 6). */
export function expectedValue(values: number[], probs: number[]): number {
  checkPairs(values, probs, true);
  return values.reduce((acc, x, i) => acc + probs[i] * x, 0);
}

/** Variance (Eq. 3): σ²(X) = Σ P(Xi)·[Xi − E(X)]². */
export function variance(values: number[], probs: number[]): number {
  checkPairs(values, probs, true);
  const ev = expectedValue(values, probs);
  return values.reduce((acc, x, i) => acc + probs[i] * (x - ev) ** 2, 0);
}

/** Standard deviation = √variance. */
export function standardDeviation(values: number[], probs: number[]): number {
  return Math.sqrt(variance(values, probs));
}

/**
 * Xác suất không điều kiện của thông tin (total probability rule, Eq. 7):
 * P(info) = Σ P(info | event_i)·P(event_i) = Σ likelihood_i·prior_i.
 */
export function bayesUnconditional(priors: number[], likelihoods: number[]): number {
  if (priors.length !== likelihoods.length) throw new Error("priors và likelihoods phải cùng độ dài");
  checkPairs(priors, priors, true); // priors phải tổng = 1
  if (likelihoods.some((l) => l < 0 || l > 1)) throw new Error("Likelihood phải trong [0, 1]");
  return priors.reduce((acc, p, i) => acc + p * likelihoods[i], 0);
}

/**
 * Posterior probabilities theo Bayes (Eq. 8):
 * P(event_i | info) = likelihood_i·prior_i / Σ(likelihood_j·prior_j).
 * Trả mảng posterior tương ứng từng event.
 */
export function bayesPosteriors(priors: number[], likelihoods: number[]): number[] {
  const denom = bayesUnconditional(priors, likelihoods);
  if (denom === 0) throw new Error("P(info) = 0, không cập nhật được");
  return priors.map((p, i) => (likelihoods[i] * p) / denom);
}

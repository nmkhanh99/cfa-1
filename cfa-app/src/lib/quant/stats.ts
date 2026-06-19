/**
 * LM3 — Statistical Measures of Asset Returns. Engine thuần (không phụ thuộc UI).
 * Mọi hàm kiểm thử đối chiếu Example trong 2024 L1V1.pdf, LM3 (xem stats.test.ts).
 */

function requireNonEmpty(xs: number[]): void {
  if (xs.length === 0) throw new Error("Cần ít nhất 1 quan sát");
}

/** Trung bình mẫu (arithmetic mean), Eq. 1. */
export function mean(xs: number[]): number {
  requireNonEmpty(xs);
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

/** Trung vị (median): giá trị giữa khi sắp xếp; số chẵn → trung bình 2 giá trị giữa. */
export function median(xs: number[]): number {
  requireNonEmpty(xs);
  const s = [...xs].sort((a, b) => a - b);
  const n = s.length;
  const mid = Math.floor(n / 2);
  return n % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/** Mode: giá trị xuất hiện nhiều nhất. Trả mảng (có thể đa mode); rỗng nếu mọi giá trị khác nhau. */
export function mode(xs: number[]): number[] {
  requireNonEmpty(xs);
  const freq = new Map<number, number>();
  for (const x of xs) freq.set(x, (freq.get(x) ?? 0) + 1);
  const maxFreq = Math.max(...freq.values());
  if (maxFreq === 1) return [];
  return [...freq.entries()].filter(([, f]) => f === maxFreq).map(([v]) => v).sort((a, b) => a - b);
}

/** Range = max − min (Eq. 2). */
export function range(xs: number[]): number {
  requireNonEmpty(xs);
  return Math.max(...xs) - Math.min(...xs);
}

/** Mean absolute deviation (Eq. 3). */
export function meanAbsoluteDeviation(xs: number[]): number {
  requireNonEmpty(xs);
  const m = mean(xs);
  return xs.reduce((acc, x) => acc + Math.abs(x - m), 0) / xs.length;
}

/** Phương sai mẫu s² (chia n−1), Eq. 4. */
export function sampleVariance(xs: number[]): number {
  if (xs.length < 2) throw new Error("Cần ít nhất 2 quan sát");
  const m = mean(xs);
  return xs.reduce((acc, x) => acc + (x - m) ** 2, 0) / (xs.length - 1);
}

/** Độ lệch chuẩn mẫu s (Eq. 5). */
export function sampleStdDev(xs: number[]): number {
  return Math.sqrt(sampleVariance(xs));
}

/** Target downside deviation (target semideviation), Eq. 6 — chỉ tính các quan sát ≤ target. */
export function targetSemideviation(xs: number[], target: number): number {
  if (xs.length < 2) throw new Error("Cần ít nhất 2 quan sát");
  const sumSq = xs.filter((x) => x <= target).reduce((acc, x) => acc + (x - target) ** 2, 0);
  return Math.sqrt(sumSq / (xs.length - 1));
}

/** Coefficient of variation = s / mean (Eq. 7). */
export function coefficientOfVariation(xs: number[]): number {
  const m = mean(xs);
  if (m === 0) throw new Error("CV không xác định khi mean = 0");
  return sampleStdDev(xs) / m;
}

/** Skewness mẫu (large-sample approx, Eq. 8): (1/n)Σ(Xi−X̄)³ / s³. */
export function skewness(xs: number[]): number {
  if (xs.length < 2) throw new Error("Cần ít nhất 2 quan sát");
  const m = mean(xs);
  const s = sampleStdDev(xs);
  const sum = xs.reduce((acc, x) => acc + (x - m) ** 3, 0);
  return sum / xs.length / s ** 3;
}

/** Excess kurtosis mẫu (large-sample approx, Eq. 9): (1/n)Σ(Xi−X̄)⁴ / s⁴ − 3. */
export function excessKurtosis(xs: number[]): number {
  if (xs.length < 2) throw new Error("Cần ít nhất 2 quan sát");
  const m = mean(xs);
  const s = sampleStdDev(xs);
  const sum = xs.reduce((acc, x) => acc + (x - m) ** 4, 0);
  return sum / xs.length / s ** 4 - 3;
}

/** Hiệp phương sai mẫu (Eq. 10, chia n−1). */
export function covariance(xs: number[], ys: number[]): number {
  if (xs.length !== ys.length) throw new Error("Hai chuỗi phải cùng độ dài");
  if (xs.length < 2) throw new Error("Cần ít nhất 2 quan sát");
  const mx = mean(xs);
  const my = mean(ys);
  let sum = 0;
  for (let i = 0; i < xs.length; i++) sum += (xs[i] - mx) * (ys[i] - my);
  return sum / (xs.length - 1);
}

/** Hệ số tương quan mẫu = covariance / (sX·sY), Eq. 11. */
export function correlation(xs: number[], ys: number[]): number {
  const denom = sampleStdDev(xs) * sampleStdDev(ys);
  if (denom === 0) throw new Error("Độ lệch chuẩn bằng 0");
  return covariance(xs, ys) / denom;
}

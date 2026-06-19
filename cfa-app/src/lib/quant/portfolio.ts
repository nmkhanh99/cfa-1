/**
 * LM5 — Portfolio Mathematics. Engine thuần (không phụ thuộc UI).
 * Mọi hàm kiểm thử đối chiếu Example trong 2024 L1V1.pdf, LM5 (xem portfolio.test.ts).
 */

/** Lợi suất kỳ vọng danh mục: Σ wi·E(Ri) (Eq. 1). */
export function portfolioExpectedReturn(weights: number[], expectedReturns: number[]): number {
  if (weights.length !== expectedReturns.length) throw new Error("weights và returns phải cùng độ dài");
  if (weights.length === 0) throw new Error("Cần ít nhất 1 tài sản");
  return weights.reduce((acc, w, i) => acc + w * expectedReturns[i], 0);
}

/** Covariance từ correlation: Cov = ρ·σ1·σ2 (Eq. 7 đảo). */
export function covarianceFromCorrelation(correlation: number, sd1: number, sd2: number): number {
  if (correlation < -1 || correlation > 1) throw new Error("Correlation phải trong [-1, 1]");
  if (sd1 < 0 || sd2 < 0) throw new Error("Độ lệch chuẩn phải ≥ 0");
  return correlation * sd1 * sd2;
}

/** Lấy căn bậc hai cho variance, kẹp roundoff âm cực nhỏ về 0, vẫn chặn variance âm thực sự. */
function safeSqrtVariance(v: number): number {
  if (v < -1e-9) throw new Error("Phương sai âm — đầu vào không hợp lệ");
  return Math.sqrt(Math.max(v, 0));
}

/** Correlation từ covariance: ρ = Cov/(σ1·σ2) (Eq. 7). */
export function correlationFromCovariance(cov: number, sd1: number, sd2: number): number {
  if (sd1 <= 0 || sd2 <= 0) throw new Error("Độ lệch chuẩn phải > 0");
  return cov / (sd1 * sd2);
}

/** Phương sai danh mục từ ma trận hiệp phương sai: ΣiΣj wi·wj·Cov(Ri,Rj) (Eq. 6). */
export function portfolioVariance(weights: number[], covMatrix: number[][]): number {
  const n = weights.length;
  if (covMatrix.length !== n || covMatrix.some((row) => row.length !== n))
    throw new Error("Ma trận hiệp phương sai phải vuông và khớp số tài sản");
  let v = 0;
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) v += weights[i] * weights[j] * covMatrix[i][j];
  return v;
}

/** Độ lệch chuẩn danh mục = √variance. */
export function portfolioStdDev(weights: number[], covMatrix: number[][]): number {
  return safeSqrtVariance(portfolioVariance(weights, covMatrix));
}

/** Std danh mục 2 tài sản dùng correlation (tiện cho input thường gặp). */
export function twoAssetStdDev(w1: number, sd1: number, w2: number, sd2: number, correlation: number): number {
  const cov = covarianceFromCorrelation(correlation, sd1, sd2);
  const v = w1 ** 2 * sd1 ** 2 + w2 ** 2 * sd2 ** 2 + 2 * w1 * w2 * cov;
  return safeSqrtVariance(v);
}

/**
 * Covariance từ hàm xác suất đồng thời (Eq. 8):
 * Cov = Σ P(RA,RB)·(RA − E[RA])·(RB − E[RB]) trên các ô (cell).
 * raValues/rbValues/probs là các ô đồng thời tương ứng.
 */
export function covarianceFromJointProbability(raValues: number[], rbValues: number[], probs: number[]): number {
  const n = raValues.length;
  if (rbValues.length !== n || probs.length !== n) throw new Error("Ba mảng phải cùng độ dài");
  if (probs.some((p) => p < 0 || p > 1)) throw new Error("Xác suất phải trong [0, 1]");
  if (Math.abs(probs.reduce((a, b) => a + b, 0) - 1) > 1e-3) throw new Error("Tổng xác suất phải bằng 1");
  const era = raValues.reduce((acc, ra, i) => acc + probs[i] * ra, 0);
  const erb = rbValues.reduce((acc, rb, i) => acc + probs[i] * rb, 0);
  let cov = 0;
  for (let i = 0; i < n; i++) cov += probs[i] * (raValues[i] - era) * (rbValues[i] - erb);
  return cov;
}

/** Safety-first ratio: [E(Rp) − RL]/σp (Eq. 9). */
export function safetyFirstRatio(expectedReturn: number, threshold: number, sd: number): number {
  if (sd <= 0) throw new Error("Độ lệch chuẩn phải > 0");
  return (expectedReturn - threshold) / sd;
}

/** CDF phân phối chuẩn chuẩn hoá (xấp xỉ Abramowitz–Stegun). */
export function normalCdf(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014337 * Math.exp((-z * z) / 2);
  const p =
    d * t * (0.319381530 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z >= 0 ? 1 - p : p;
}

/** Xác suất shortfall (return < RL) theo Roy's safety-first: N(−SFRatio). */
export function shortfallProbability(sfRatio: number): number {
  return normalCdf(-sfRatio);
}

/**
 * LM6 — Simulation Methods. Engine thuần (không phụ thuộc UI).
 * Mọi hàm kiểm thử đối chiếu Example trong 2024 L1V1.pdf, LM6 (xem simulation.test.ts).
 * Mô phỏng dùng PRNG có seed để kết quả tái lập được (không dùng Math.random trực tiếp).
 */
import { sampleStdDev } from "./stats";

/** Mean của biến lognormal: exp(μ + 0.5σ²), với μ, σ là tham số của phân phối chuẩn liên kết. */
export function lognormalMean(mu: number, sigma: number): number {
  return Math.exp(mu + 0.5 * sigma * sigma);
}

/** Variance của biến lognormal: exp(2μ + σ²)·[exp(σ²) − 1]. */
export function lognormalVariance(mu: number, sigma: number): number {
  const s2 = sigma * sigma;
  return Math.exp(2 * mu + s2) * (Math.exp(s2) - 1);
}

/** Chuỗi lợi suất ghép liên tục từ chuỗi giá: r_t = ln(P_t / P_{t-1}). */
export function continuouslyCompoundedReturns(prices: number[]): number[] {
  if (prices.length < 2) throw new Error("Cần ít nhất 2 mức giá");
  const out: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    if (prices[i] <= 0 || prices[i - 1] <= 0) throw new Error("Giá phải > 0");
    out.push(Math.log(prices[i] / prices[i - 1]));
  }
  return out;
}

/** Annualize volatility: σ_annual = σ_period · √(periodsPerYear) (Eq. 3). */
export function annualizeVolatility(periodVol: number, periodsPerYear = 250): number {
  return periodVol * Math.sqrt(periodsPerYear);
}

/** Volatility năm hoá từ chuỗi giá: std(cc returns) · √(periodsPerYear). */
export function annualizedVolatilityFromPrices(prices: number[], periodsPerYear = 250): number {
  return annualizeVolatility(sampleStdDev(continuouslyCompoundedReturns(prices)), periodsPerYear);
}

/** Giá tương lai từ cc return: P_T = P_0 · exp(r). */
export function futurePrice(p0: number, ccReturn: number): number {
  return p0 * Math.exp(ccReturn);
}

/** PRNG mulberry32 có seed → hàm trả số trong [0, 1). */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Mẫu chuẩn N(0,1) qua Box–Muller, dùng RNG cho trước. */
export function gaussian(rng: () => number): number {
  let u = 0;
  let v = 0;
  while (u === 0) u = rng();
  while (v === 0) v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

/**
 * Monte Carlo: mô phỏng giá cuối kỳ. Mỗi trial gồm `steps` bước,
 * mỗi bước cc return ~ Normal(muStep, sigmaStep); giá cuối = p0·exp(Σ return).
 */
export function simulateTerminalPrices(
  p0: number,
  muStep: number,
  sigmaStep: number,
  steps: number,
  trials: number,
  seed: number
): number[] {
  if (p0 <= 0) throw new Error("Giá đầu (p0) phải > 0");
  if (steps < 1 || trials < 1) throw new Error("steps và trials phải ≥ 1");
  const rng = mulberry32(seed);
  const out: number[] = [];
  for (let t = 0; t < trials; t++) {
    let r = 0;
    for (let s = 0; s < steps; s++) r += muStep + sigmaStep * gaussian(rng);
    out.push(p0 * Math.exp(r));
  }
  return out;
}

/** Một lần bootstrap resample (rút có hoàn lại, cùng kích thước) từ dữ liệu quan sát. */
export function bootstrapResample(data: number[], rng: () => number): number[] {
  if (data.length === 0) throw new Error("Cần dữ liệu");
  return data.map(() => data[Math.floor(rng() * data.length)]);
}

/**
 * Bootstrap một thống kê: lặp lại resample, áp dụng statFn, trả mảng giá trị thống kê.
 * Dùng để ước lượng phân phối mẫu (vd standard error của trung bình).
 */
export function bootstrapStatistic(
  data: number[],
  statFn: (sample: number[]) => number,
  trials: number,
  seed: number
): number[] {
  const rng = mulberry32(seed);
  const out: number[] = [];
  for (let t = 0; t < trials; t++) out.push(statFn(bootstrapResample(data, rng)));
  return out;
}

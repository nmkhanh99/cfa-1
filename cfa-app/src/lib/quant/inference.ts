/**
 * LM7 — Estimation and Inference. Engine thuần (không phụ thuộc UI).
 * Mọi hàm kiểm thử đối chiếu Example/Question Set trong 2024 L1V1.pdf, LM7 (xem inference.test.ts).
 */
import { mean, sampleStdDev } from "./stats";
import { mulberry32 } from "./simulation";

/** Standard error của trung bình mẫu: SE = sd/√n (sd là σ nếu biết, hoặc s mẫu) (Eq. 1, 2). */
export function standardError(sd: number, n: number): number {
  if (n < 1) throw new Error("n phải ≥ 1");
  if (sd < 0) throw new Error("Độ lệch chuẩn phải ≥ 0");
  return sd / Math.sqrt(n);
}

/** Standard error từ dữ liệu: s/√n (s = sample std dev). */
export function standardErrorFromData(data: number[]): number {
  if (data.length < 2) throw new Error("Cần ít nhất 2 quan sát");
  return standardError(sampleStdDev(data), data.length);
}

/** Phương sai của phân phối trung bình mẫu (CLT): σ²/n. */
export function samplingVarianceOfMean(sigma: number, n: number): number {
  if (n < 1) throw new Error("n phải ≥ 1");
  if (sigma < 0) throw new Error("σ phải ≥ 0");
  return (sigma * sigma) / n;
}

/** Cỡ mẫu cần để đạt standard error mục tiêu: n = (σ/SE_target)², làm tròn lên. */
export function requiredSampleSizeForSE(sigma: number, targetSE: number): number {
  if (targetSE <= 0) throw new Error("Standard error mục tiêu phải > 0");
  if (sigma < 0) throw new Error("σ phải ≥ 0");
  return Math.ceil((sigma / targetSE) ** 2);
}

/**
 * Mô phỏng CLT: từ một tổng thể quan sát, rút `numSamples` mẫu (mỗi mẫu cỡ n, có hoàn lại),
 * trả về mảng trung bình của từng mẫu. Std của mảng này xấp xỉ σ_tổng_thể/√n khi n lớn.
 */
export function samplingDistributionOfMean(
  population: number[],
  n: number,
  numSamples: number,
  seed: number
): number[] {
  if (population.length === 0) throw new Error("Cần dữ liệu tổng thể");
  if (n < 1 || numSamples < 1) throw new Error("n và numSamples phải ≥ 1");
  const rng = mulberry32(seed);
  const means: number[] = [];
  for (let s = 0; s < numSamples; s++) {
    const sample: number[] = [];
    for (let i = 0; i < n; i++) sample.push(population[Math.floor(rng() * population.length)]);
    means.push(mean(sample));
  }
  return means;
}

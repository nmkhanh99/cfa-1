/**
 * LM8 — Hypothesis Testing for Finance. Engine thuần (không phụ thuộc UI).
 * Mọi hàm kiểm thử đối chiếu Example trong 2024 L1V1.pdf, LM8 (xem hypothesis.test.ts).
 */
import { normalCdf } from "./portfolio";

/** t-statistic, kiểm định một trung bình: t = (X̄ − μ0)/(s/√n). df = n − 1. */
export function tStatSingleMean(xbar: number, mu0: number, s: number, n: number): number {
  if (n < 2) throw new Error("n phải ≥ 2");
  if (s <= 0) throw new Error("Độ lệch chuẩn phải > 0");
  return (xbar - mu0) / (s / Math.sqrt(n));
}

/** chi-square, kiểm định một phương sai: χ² = (n−1)·s²/σ0². df = n − 1. */
export function chiSquareSingleVariance(sampleVar: number, hypothesizedVar: number, n: number): number {
  if (n < 2) throw new Error("n phải ≥ 2");
  if (hypothesizedVar <= 0) throw new Error("Phương sai giả định phải > 0");
  if (sampleVar < 0) throw new Error("Phương sai mẫu phải ≥ 0");
  return ((n - 1) * sampleVar) / hypothesizedVar;
}

/** Phương sai gộp (pooled) cho 2 mẫu độc lập, phương sai bằng nhau. */
export function pooledVariance(var1: number, n1: number, var2: number, n2: number): number {
  if (n1 < 2 || n2 < 2) throw new Error("Mỗi mẫu cần n ≥ 2");
  return ((n1 - 1) * var1 + (n2 - 1) * var2) / (n1 + n2 - 2);
}

/** t-statistic 2 mẫu độc lập (pooled): t = (X̄1 − X̄2)/√(sp²/n1 + sp²/n2). df = n1 + n2 − 2. */
export function tStatTwoSamplePooled(
  xbar1: number,
  xbar2: number,
  var1: number,
  n1: number,
  var2: number,
  n2: number
): number {
  const sp2 = pooledVariance(var1, n1, var2, n2);
  if (sp2 <= 0) throw new Error("Phương sai gộp phải > 0");
  return (xbar1 - xbar2) / Math.sqrt(sp2 / n1 + sp2 / n2);
}

/** t-statistic mẫu phụ thuộc (paired): t = (d̄ − μd0)/(sd/√n). df = n − 1. */
export function tStatPairedMean(dbar: number, mu_d0: number, sdDiff: number, n: number): number {
  if (n < 2) throw new Error("n phải ≥ 2");
  if (sdDiff <= 0) throw new Error("Độ lệch chuẩn phải > 0");
  return (dbar - mu_d0) / (sdDiff / Math.sqrt(n));
}

/** F-statistic kiểm định bằng nhau của 2 phương sai: F = s1²/s2². df = (n1−1, n2−1). */
export function fStatTwoVariances(var1: number, var2: number): number {
  if (var1 < 0 || var2 <= 0) throw new Error("Phương sai phải > 0");
  return var1 / var2;
}

/** Quyết định hai phía theo giá trị tới hạn: reject nếu |stat| > |critical|. */
export function twoTailedDecision(stat: number, criticalAbs: number): "reject" | "fail to reject" {
  if (criticalAbs < 0) throw new Error("Giá trị tới hạn phải ≥ 0");
  return Math.abs(stat) > criticalAbs ? "reject" : "fail to reject";
}

/**
 * p-value hai phía theo XẤP XỈ phân phối chuẩn (mẫu lớn): 2·[1 − Φ(|stat|)].
 * Lưu ý: chính xác cho mẫu lớn; mẫu nhỏ cần tra bảng t/χ²/F.
 */
export function twoTailedPValueNormal(stat: number): number {
  return 2 * (1 - normalCdf(Math.abs(stat)));
}

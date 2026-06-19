/**
 * LM9 — Parametric and Non-Parametric Tests of Independence. Engine thuần.
 * Mọi hàm kiểm thử đối chiếu Example trong 2024 L1V1.pdf, LM9 (xem independence.test.ts).
 */

/** t-statistic kiểm định tương quan (parametric): t = r·√(n−2)/√(1−r²). df = n − 2. */
export function correlationTTest(r: number, n: number): number {
  if (n < 3) throw new Error("n phải ≥ 3");
  if (r <= -1 || r >= 1) throw new Error("r phải trong (−1, 1)");
  return (r * Math.sqrt(n - 2)) / Math.sqrt(1 - r * r);
}

/** Spearman rank correlation từ Σd² và n: rs = 1 − 6·Σd²/(n(n²−1)). */
export function spearmanFromSumD2(sumD2: number, n: number): number {
  if (n < 2) throw new Error("n phải ≥ 2");
  return 1 - (6 * sumD2) / (n * (n * n - 1));
}

/** Hạng (rank) tăng dần với hạng trung bình cho giá trị trùng (ties). 1 = nhỏ nhất. */
export function averageRanks(values: number[]): number[] {
  const n = values.length;
  const idx = values.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const ranks = new Array<number>(n);
  let i = 0;
  while (i < n) {
    let j = i;
    while (j + 1 < n && idx[j + 1].v === idx[i].v) j++;
    const avg = (i + j) / 2 + 1; // hạng trung bình (1-based)
    for (let k = i; k <= j; k++) ranks[idx[k].i] = avg;
    i = j + 1;
  }
  return ranks;
}

/** Spearman rank correlation từ 2 chuỗi dữ liệu (xếp hạng + công thức Σd²). */
export function spearmanRankCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length) throw new Error("Hai chuỗi phải cùng độ dài");
  if (x.length < 2) throw new Error("Cần ít nhất 2 quan sát");
  const rx = averageRanks(x);
  const ry = averageRanks(y);
  const sumD2 = rx.reduce((acc, r, i) => acc + (r - ry[i]) ** 2, 0);
  return spearmanFromSumD2(sumD2, x.length);
}

export interface ChiSquareIndependenceResult {
  chiSquare: number;
  df: number;
  expected: number[][];
}

/** Test độc lập χ² trên bảng contingency: χ² = Σ(O−E)²/E, E = (tổng hàng·tổng cột)/tổng. df = (r−1)(c−1). */
export function chiSquareIndependence(observed: number[][]): ChiSquareIndependenceResult {
  const r = observed.length;
  if (r < 2) throw new Error("Cần ít nhất 2 hàng");
  const c = observed[0].length;
  if (c < 2 || observed.some((row) => row.length !== c)) throw new Error("Bảng phải chữ nhật, ≥ 2 cột");
  if (observed.some((row) => row.some((v) => v < 0))) throw new Error("Tần số phải ≥ 0");

  const rowTotals = observed.map((row) => row.reduce((a, b) => a + b, 0));
  const colTotals = Array.from({ length: c }, (_, j) => observed.reduce((a, row) => a + row[j], 0));
  const grand = rowTotals.reduce((a, b) => a + b, 0);
  if (grand <= 0) throw new Error("Tổng tần số phải > 0");
  if (rowTotals.some((t) => t === 0) || colTotals.some((t) => t === 0))
    throw new Error("Mỗi hàng và cột phải có tổng > 0 (bỏ nhóm rỗng)");

  const expected = observed.map((_, i) => Array.from({ length: c }, (_, j) => (rowTotals[i] * colTotals[j]) / grand));
  let chiSquare = 0;
  for (let i = 0; i < r; i++)
    for (let j = 0; j < c; j++) chiSquare += (observed[i][j] - expected[i][j]) ** 2 / expected[i][j];

  return { chiSquare, df: (r - 1) * (c - 1), expected };
}

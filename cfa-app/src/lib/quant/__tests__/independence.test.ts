import { describe, it, expect } from "vitest";
import {
  correlationTTest,
  spearmanFromSumD2,
  spearmanRankCorrelation,
  chiSquareIndependence,
} from "../independence";

/** Ground truth = Example trong 2024 L1V1.pdf, Learning Module 9. */
const near = (a: number, b: number, tol: number) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe("correlationTTest (parametric)", () => {
  it("Example 1: r=0.43051, n=33 → t = 2.65568", () => near(correlationTTest(0.43051, 33), 2.65568, 1e-4));
  it("rs=-0.20416, n=9 → t = -0.55177", () => near(correlationTTest(-0.20416, 9), -0.55177, 1e-3));
});

describe("spearmanFromSumD2", () => {
  it("Σd²=2202, n=35 → 0.6916", () => near(spearmanFromSumD2(2202, 35), 0.6916, 1e-4));
  it("Σd²=144.5, n=9 → -0.20416", () => near(spearmanFromSumD2(144.5, 9), -0.20416, 1e-4));
});

describe("spearmanRankCorrelation (xếp hạng + ties)", () => {
  // Alpha vs Expense Ratio (Example với 1 tie ở Expense=1.50) → -0.20416
  const alpha = [-0.52, -0.13, -0.5, -1.01, -0.26, -0.89, -0.42, -0.23, -0.6];
  const expense = [1.34, 0.4, 1.9, 1.5, 1.35, 0.5, 1.0, 1.5, 1.45];
  it("→ -0.20416 (khớp công thức Σd² của sách)", () => near(spearmanRankCorrelation(alpha, expense), -0.20416, 1e-4));
  it("tương quan hạng hoàn hảo: monotonic → 1", () => near(spearmanRankCorrelation([1, 2, 3, 4], [10, 20, 30, 40]), 1, 1e-9));
});

describe("chiSquareIndependence (contingency table — ETF Example)", () => {
  const observed = [
    [50, 110, 343],
    [42, 122, 202],
    [56, 149, 520],
  ];
  const res = chiSquareIndependence(observed);
  it("χ² = 32.08025", () => near(res.chiSquare, 32.08025, 1e-3));
  it("df = (3−1)(3−1) = 4", () => expect(res.df).toBe(4));
  it("expected small-cap value = 46.703", () => near(res.expected[0][0], 46.703, 1e-3));
  it("từ chối bảng có hàng/cột tổng = 0 (Codex review)", () =>
    expect(() => chiSquareIndependence([[0, 0], [1, 2]])).toThrow());
});

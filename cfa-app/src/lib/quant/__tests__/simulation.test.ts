import { describe, it, expect } from "vitest";
import {
  lognormalMean,
  lognormalVariance,
  continuouslyCompoundedReturns,
  annualizeVolatility,
  annualizedVolatilityFromPrices,
  futurePrice,
  simulateTerminalPrices,
  bootstrapResample,
  bootstrapStatistic,
  mulberry32,
} from "../simulation";
import { mean } from "../stats";

const near = (a: number, b: number, tol: number) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe("lognormal mean / variance", () => {
  it("μ=0, σ=1 → mean = e^0.5 = 1.6487", () => near(lognormalMean(0, 1), 1.64872, 1e-4));
  it("μ=0, σ=1 → variance = e·(e−1) = 4.6708", () => near(lognormalVariance(0, 1), 4.67077, 1e-4));
  it("μ=0.07, σ=0.12 → mean = exp(μ+0.5σ²)", () => near(lognormalMean(0.07, 0.12), Math.exp(0.07 + 0.5 * 0.0144), 1e-9));
});

describe("continuously compounded returns (Example 1 — Astra)", () => {
  const prices = [6950, 7000, 6850, 6600, 6350];
  it("cc returns khớp sách", () => {
    const r = continuouslyCompoundedReturns(prices);
    near(r[0], 0.007168, 1e-5);
    near(r[1], -0.021661, 1e-5);
    near(r[2], -0.037179, 1e-5);
    near(r[3], -0.038615, 1e-5);
  });
  it("annualized volatility = 33.6% (√250)", () => near(annualizedVolatilityFromPrices(prices, 250), 0.336165, 1e-4));
});

describe("annualizeVolatility", () => {
  it("daily 0.01, 250 ngày → 0.1581", () => near(annualizeVolatility(0.01, 250), 0.15811, 1e-4));
});

describe("futurePrice", () => {
  it("P0=1, r=0.07 → exp(0.07) = 1.0725", () => near(futurePrice(1, 0.07), Math.exp(0.07), 1e-9));
});

describe("mulberry32 / simulateTerminalPrices (tái lập + sanity)", () => {
  it("cùng seed → cùng dãy số", () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    expect([a(), a(), a()]).toEqual([b(), b(), b()]);
  });
  it("cùng seed → cùng kết quả mô phỏng; mọi giá > 0", () => {
    const r1 = simulateTerminalPrices(100, 0.07 / 12, 0.12 / Math.sqrt(12), 12, 500, 7);
    const r2 = simulateTerminalPrices(100, 0.07 / 12, 0.12 / Math.sqrt(12), 12, 500, 7);
    expect(r1).toEqual(r2);
    expect(r1.length).toBe(500);
    expect(r1.every((p) => p > 0)).toBe(true);
  });
  it("từ chối p0 ≤ 0 (Codex review)", () => {
    expect(() => simulateTerminalPrices(0, 0.01, 0.03, 12, 100, 1)).toThrow();
    expect(() => simulateTerminalPrices(-5, 0.01, 0.03, 12, 100, 1)).toThrow();
  });
  it("mean giá cuối xấp xỉ P0·exp(μ+0.5σ²) với nhiều trial", () => {
    const mu = 0.07;
    const sigma = 0.12;
    const prices = simulateTerminalPrices(100, mu / 12, sigma / Math.sqrt(12), 12, 20000, 123);
    near(mean(prices) / 100, lognormalMean(mu, sigma), 0.02);
  });
});

describe("bootstrap", () => {
  const data = [1, 2, 3, 4, 5];
  it("resample cùng kích thước, phần tử thuộc dữ liệu gốc", () => {
    const s = bootstrapResample(data, mulberry32(1));
    expect(s.length).toBe(data.length);
    expect(s.every((x) => data.includes(x))).toBe(true);
  });
  it("bootstrap mean: tái lập + trung bình các mean ≈ mean gốc", () => {
    const stats1 = bootstrapStatistic(data, mean, 1000, 9);
    const stats2 = bootstrapStatistic(data, mean, 1000, 9);
    expect(stats1).toEqual(stats2);
    near(mean(stats1), mean(data), 0.1);
  });
});

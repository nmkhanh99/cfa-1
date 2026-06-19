import { describe, it, expect } from "vitest";
import {
  linearRegression,
  predict,
  standardErrorOfForecast,
  predictionInterval,
  logTransform,
} from "../regression";

/** Ground truth = Example ROA~CAPEX trong 2024 L1V1.pdf, Learning Module 10. */
const near = (a: number, b: number, tol: number) => expect(Math.abs(a - b)).toBeLessThan(tol);

const X = [0.7, 0.4, 5.0, 10.0, 8.0, 12.5]; // CAPEX
const Y = [6.0, 4.0, 15.0, 20.0, 10.0, 20.0]; // ROA
const reg = linearRegression(X, Y);

describe("linearRegression — hệ số & ANOVA (ROA~CAPEX)", () => {
  it("slope = 1.25", () => near(reg.slope, 1.25, 1e-4));
  it("intercept = 4.875", () => near(reg.intercept, 4.875, 1e-4));
  it("SST = 239.50", () => near(reg.sst, 239.5, 1e-3));
  it("SSR = 191.625", () => near(reg.ssr, 191.625, 1e-3));
  it("SSE = 47.875", () => near(reg.sse, 47.875, 1e-3));
  it("R² = 0.8001", () => near(reg.rSquared, 0.8001, 1e-4));
  it("SEE = 3.459588", () => near(reg.see, 3.459588, 1e-4));
  it("F = 16.0104", () => near(reg.fStat, 16.0104, 1e-2));
  it("slope std error = 0.312398", () => near(reg.slopeStdError, 0.312398, 1e-4));
  it("slope t-stat = 4.00131", () => near(reg.slopeTStat, 4.00131, 1e-3));
});

describe("prediction (Xf = 6)", () => {
  it("Ŷ = 12.375", () => near(predict(reg, 6), 12.375, 1e-3));
  it("standard error of forecast = 3.736912", () => near(standardErrorOfForecast(reg, 6), 3.736912, 1e-4));
  it("95% prediction interval ≈ {2.0013, 22.7487} với t=2.776", () => {
    const pi = predictionInterval(reg, 6, 2.776);
    near(pi.lower, 2.0013, 1e-2);
    near(pi.upper, 22.7487, 1e-2);
  });
});

describe("logTransform & functional forms", () => {
  it("log-log: regress ln(y) ~ ln(x) chạy được", () => {
    const r = linearRegression(logTransform(X), logTransform(Y));
    expect(Number.isFinite(r.slope)).toBe(true);
  });
  it("từ chối log của giá trị ≤ 0", () => expect(() => logTransform([1, 0, 2])).toThrow());
  it("từ chối biến độc lập hằng số", () => expect(() => linearRegression([3, 3, 3], [1, 2, 3])).toThrow());
});

describe("trường hợp suy biến (Codex review)", () => {
  it("Y hằng số → throw", () => expect(() => linearRegression([1, 2, 3], [5, 5, 5])).toThrow());
  it("fit âm hoàn hảo → slope t-stat = −∞ (giữ dấu), F = +∞", () => {
    const r = linearRegression([1, 2, 3], [6, 4, 2]); // slope = -2, fit hoàn hảo
    expect(r.slope).toBeLessThan(0);
    expect(r.slopeTStat).toBe(-Infinity);
    expect(r.fStat).toBe(Infinity);
  });
});

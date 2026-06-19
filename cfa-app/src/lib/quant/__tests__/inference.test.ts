import { describe, it, expect } from "vitest";
import {
  standardError,
  standardErrorFromData,
  samplingVarianceOfMean,
  requiredSampleSizeForSE,
  samplingDistributionOfMean,
} from "../inference";
import { mean, sampleStdDev } from "../stats";

const near = (a: number, b: number, tol: number) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe("standardError", () => {
  it("σ=6, n=36 → SE = 1 (Biggs)", () => near(standardError(6, 36), 1, 1e-9));
  it("σ=6, n=576 → SE = 0.25 (Biggs)", () => near(standardError(6, 576), 0.25, 1e-9));
  it("standardErrorFromData = s/√n", () => {
    const d = [4.5, 6.0, 1.5, -2.0, 0.0, 4.5, 3.5, 2.5, 5.5, 4.0];
    near(standardErrorFromData(d), sampleStdDev(d) / Math.sqrt(d.length), 1e-12);
  });
});

describe("samplingVarianceOfMean", () => {
  it("σ=6, n=36 → variance = 1", () => near(samplingVarianceOfMean(6, 36), 1, 1e-9));
  it("từ chối σ âm (Codex review)", () => expect(() => samplingVarianceOfMean(-6, 36)).toThrow());
});

describe("requiredSampleSizeForSE (Question Set — Biggs)", () => {
  it("σ=6%, SE target 1% → n = 36", () => expect(requiredSampleSizeForSE(6, 1)).toBe(36));
  it("σ=6%, SE target 0.25% → n = 576", () => expect(requiredSampleSizeForSE(6, 0.25)).toBe(576));
});

describe("samplingDistributionOfMean (CLT, tái lập)", () => {
  const population = [-10, -5, -2, 0, 1, 3, 4, 7, 9, 12];
  it("cùng seed → cùng kết quả", () => {
    const a = samplingDistributionOfMean(population, 30, 500, 5);
    const b = samplingDistributionOfMean(population, 30, 500, 5);
    expect(a).toEqual(b);
  });
  it("std của trung bình mẫu ≈ σ_tổng_thể/√n", () => {
    const n = 30;
    const popMean = mean(population);
    const popStd = Math.sqrt(mean(population.map((x) => (x - popMean) ** 2))); // σ tổng thể (chia N)
    const means = samplingDistributionOfMean(population, n, 8000, 123);
    near(sampleStdDev(means), popStd / Math.sqrt(n), 0.15);
  });
});

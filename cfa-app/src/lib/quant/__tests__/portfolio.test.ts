import { describe, it, expect } from "vitest";
import {
  portfolioExpectedReturn,
  covarianceFromCorrelation,
  correlationFromCovariance,
  portfolioVariance,
  portfolioStdDev,
  twoAssetStdDev,
  covarianceFromJointProbability,
  safetyFirstRatio,
  normalCdf,
  shortfallProbability,
} from "../portfolio";

/** Ground truth = Example/Question Set trong 2024 L1V1.pdf, Learning Module 5. */
const near = (a: number, b: number, tol: number) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe("portfolioExpectedReturn", () => {
  it("Exhibit 1: [0.5,0.25,0.25]·[13,6,15] = 11.75%", () =>
    near(portfolioExpectedReturn([0.5, 0.25, 0.25], [13, 6, 15]), 11.75, 1e-9));
});

describe("portfolio variance / std (covariance matrix)", () => {
  const w = [0.5, 0.25, 0.25];
  const cov = [
    [400, 45, 189],
    [45, 81, 38],
    [189, 38, 441],
  ];
  it("Exhibit 3: variance = 195.875", () => near(portfolioVariance(w, cov), 195.875, 1e-6));
  it("Exhibit 3: std ≈ 14% (sách làm tròn)", () => near(portfolioStdDev(w, cov), 14, 0.01));

  it("Question Set Q9: 3-asset → std 14.62%", () => {
    const w9 = [0.2, 0.3, 0.5];
    const cov9 = [
      [196, 105, 140],
      [105, 225, 150],
      [140, 150, 400],
    ];
    near(portfolioVariance(w9, cov9), 213.69, 1e-6);
    near(portfolioStdDev(w9, cov9), 14.62, 0.01);
  });
});

describe("covariance / correlation conversion", () => {
  it("Example 1: Cov = 0.30·6·15 = 27", () => near(covarianceFromCorrelation(0.3, 6, 15), 27, 1e-9));
  it("Q1: Cov = 0.64·0.56·0.24 = 0.086", () => near(covarianceFromCorrelation(0.24, 0.64, 0.56), 0.086, 1e-4));
  it("Q4: corr = 110/(16·9) = 0.764", () => near(correlationFromCovariance(110, 16, 9), 0.764, 1e-3));
});

describe("twoAssetStdDev", () => {
  it("Example 1: 40/60, σ 6/15, ρ 0.30 → var 99.72", () =>
    near(twoAssetStdDev(0.4, 6, 0.6, 15, 0.3) ** 2, 99.72, 0.01));
  it("Q8: 30/70, σ 12/25, ρ 0.20 → std 18.56%", () =>
    near(twoAssetStdDev(0.3, 12, 0.7, 25, 0.2), 18.56, 0.01));
});

describe("covarianceFromJointProbability", () => {
  it("Exhibit 6/7: BankCorp & NewBank → Cov = 16", () =>
    near(covarianceFromJointProbability([25, 12, 10], [20, 16, 10], [0.2, 0.5, 0.3]), 16, 1e-9));
});

describe("validation & roundoff (Codex review)", () => {
  it("từ chối correlation ngoài [-1,1]", () => {
    expect(() => covarianceFromCorrelation(2, 6, 15)).toThrow();
    expect(() => twoAssetStdDev(0.5, 6, 0.5, 15, 2)).toThrow();
  });
  it("từ chối độ lệch chuẩn âm", () => expect(() => covarianceFromCorrelation(0.3, -6, 15)).toThrow());
  it("danh mục hedge hoàn hảo: variance ~0 do roundoff → trả 0, không throw", () => {
    expect(portfolioStdDev([0.99, 0.01], [[1, -99], [-99, 9801]])).toBeCloseTo(0, 6);
    expect(twoAssetStdDev(0.5, 10, 0.5, 10, -1)).toBeCloseTo(0, 6);
  });
});

describe("safety-first / normal", () => {
  it("normalCdf(0) = 0.5", () => near(normalCdf(0), 0.5, 1e-6));
  it("normalCdf(0.75) = 0.7734", () => near(normalCdf(0.75), 0.7734, 1e-4));
  it("SFRatio P1 = (12−2)/15 = 0.667", () => near(safetyFirstRatio(12, 2, 15), 0.667, 1e-3));
  it("SFRatio P2 = (14−2)/16 = 0.75", () => near(safetyFirstRatio(14, 2, 16), 0.75, 1e-9));
  it("shortfall P2 = N(−0.75) = 0.227", () => near(shortfallProbability(0.75), 0.227, 1e-3));
});

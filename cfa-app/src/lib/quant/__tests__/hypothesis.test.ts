import { describe, it, expect } from "vitest";
import {
  tStatSingleMean,
  chiSquareSingleVariance,
  pooledVariance,
  tStatTwoSamplePooled,
  tStatPairedMean,
  fStatTwoVariances,
  twoTailedDecision,
  twoTailedPValueNormal,
} from "../hypothesis";

/** Ground truth = Example/Question Set trong 2024 L1V1.pdf, Learning Module 8. */
const near = (a: number, b: number, tol: number) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe("tStatSingleMean", () => {
  it("Sendar: (1.5−1.1)/(3.6/√24) = 0.54433", () => near(tStatSingleMean(1.5, 1.1, 3.6, 24), 0.54433, 1e-4));
  it("Willco: (30−24)/(10/√6) = 1.4697", () => near(tStatSingleMean(30, 24, 10, 6), 1.4697, 1e-3));
});

describe("chiSquareSingleVariance", () => {
  it("Sendar: (24−1)·12.96/16 = 18.63", () => near(chiSquareSingleVariance(12.96, 16, 24), 18.63, 1e-2));
});

describe("pooled variance & two-sample t (Example 1)", () => {
  const v1 = 0.3158 ** 2; // 0.09973
  const v2 = 0.3876 ** 2; // 0.15023
  it("pooled variance ≈ 0.1330", () => near(pooledVariance(v1, 445, v2, 859), 0.133, 1e-3));
  it("two-sample t ≈ 0.3009", () => near(tStatTwoSamplePooled(0.01775, 0.01134, v1, 445, v2, 859), 0.3009, 1e-3));
});

describe("tStatPairedMean (Example 2)", () => {
  it("(−0.0021−0)/(0.3622/√1304) = −0.20937", () => near(tStatPairedMean(-0.0021, 0, 0.3622, 1304), -0.20937, 1e-3));
});

describe("fStatTwoVariances (Example 3)", () => {
  it("4.644/3.919 = 1.18500", () => near(fStatTwoVariances(4.644, 3.919), 1.185, 1e-3));
});

describe("chặn mẫu số 0 (Codex review)", () => {
  it("single-mean s=0 → throw", () => expect(() => tStatSingleMean(1.5, 1.1, 0, 24)).toThrow());
  it("paired sd=0 → throw", () => expect(() => tStatPairedMean(-0.0021, 0, 0, 1304)).toThrow());
  it("two-sample cả hai phương sai = 0 → throw", () => expect(() => tStatTwoSamplePooled(1, 2, 0, 10, 0, 10)).toThrow());
});

describe("twoTailedDecision", () => {
  it("|2.05| > 1.984 → reject", () => expect(twoTailedDecision(2.05, 1.984)).toBe("reject"));
  it("|0.544| < 2.069 → fail to reject", () => expect(twoTailedDecision(0.54433, 2.069)).toBe("fail to reject"));
});

describe("twoTailedPValueNormal (xấp xỉ chuẩn)", () => {
  it("stat 0 → p = 1", () => near(twoTailedPValueNormal(0), 1, 1e-6));
  it("|stat| lớn → p nhỏ; ~2.05 ≈ 4.0%", () => near(twoTailedPValueNormal(2.05), 0.0404, 5e-3));
});

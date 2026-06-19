import { describe, it, expect } from "vitest";
import {
  presentValueSingle,
  presentValueCouponBond,
  presentValuePerpetuity,
  annuityPayment,
  impliedReturnSingle,
  presentValueConstantDividend,
  gordonGrowthValue,
  impliedReturnEquity,
  impliedGrowthEquity,
  twoStageDDM,
  presentValueCashFlows,
  impliedForwardRate,
  forwardFxContinuous,
  binomialCall,
  binomialPut,
} from "../tvm";

/** Ground truth = Example trong 2024 L1V1.pdf, Learning Module 2. */
const near = (a: number, b: number, tol: number) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe("presentValueSingle (discount bond)", () => {
  it("Example 1: 100/(1.067)^20 = 27.33", () => near(presentValueSingle(100, 0.067, 20), 27.33, 0.01));
  it("Example 1: t=17 → 33.21", () => near(presentValueSingle(100, 0.067, 17), 33.21, 0.01));
  it("Example 1: lãi suất âm −0.05%, t=10 → 100.50", () => near(presentValueSingle(100, -0.0005, 10), 100.5, 0.01));
});

describe("presentValueCouponBond", () => {
  it("Example 2: coupon 2, r 2%, 7 năm, FV100 → 100", () => near(presentValueCouponBond(2, 0.02, 7, 100), 100, 0.01));
  it("Example 2: r 3.532%, 5 năm → 93.091", () => near(presentValueCouponBond(2, 0.03532, 5, 100), 93.091, 0.05));
});

describe("presentValuePerpetuity / constant dividend", () => {
  it("Example 6: cổ tức 1.50, r 15% → 10", () => near(presentValueConstantDividend(1.5, 0.15), 10, 1e-6));
  it("perpetuity PMT/r", () => near(presentValuePerpetuity(1.5, 0.15), 10, 1e-6));
});

describe("annuityPayment (mortgage)", () => {
  it("Example 5: PV 800000, r 0.4375%/tháng, 360 kỳ → 4417.63", () =>
    near(annuityPayment(800000, 0.004375, 360), 4417.63, 0.5));
});

describe("impliedReturnSingle (discount bond)", () => {
  it("Example 8: (95.72/100.5)^(1/6) − 1 = −0.81%", () => near(impliedReturnSingle(100.5, 95.72, 6), -0.0081, 1e-4));
  it("Example 8: (100/95.72)^(1/4) − 1 = 1.10%", () => near(impliedReturnSingle(95.72, 100, 4), 0.011, 1e-4));
  it("Example 13: (100/93.937)^(1/2) − 1 = 3.177%", () => near(impliedReturnSingle(93.937, 100, 2), 0.03177, 1e-4));
});

describe("gordonGrowthValue", () => {
  it("Example 7: D0 1.50, g 6%, r 15% → 17.67", () => near(gordonGrowthValue(1.5, 0.06, 0.15), 17.67, 0.01));
});

describe("twoStageDDM", () => {
  it("Example 7: D0 1.5, gs 6% (3 năm), gl 2%, r 15% → 13.05", () =>
    near(twoStageDDM(1.5, 0.06, 3, 0.02, 0.15), 13.05, 0.02));
  it("Example 7: sensitivity gl 0% → 11.66", () => near(twoStageDDM(1.5, 0.06, 3, 0.0, 0.15), 11.66, 0.05));
});

describe("impliedReturnEquity / impliedGrowthEquity", () => {
  it("Example 10: Coca-Cola r = 1.76/63 + 0.04 = 6.79%", () => near(impliedReturnEquity(1.76, 63, 0.04), 0.0679, 1e-4));
  it("Example 10: g = 0.07 − 1.76/63 = 4.21%", () => near(impliedGrowthEquity(1.76, 63, 0.07), 0.0421, 1e-4));
});

describe("presentValueCashFlows (cash flow additivity)", () => {
  it("Example 12 Strategy 1: −100,45,45,45 @10% → 11.91", () =>
    near(presentValueCashFlows([-100, 45, 45, 45], 0.1), 11.91, 0.01));
  it("Example 12 Strategy 2: −100,60,40,32.35 @10% → 11.91", () =>
    near(presentValueCashFlows([-100, 60, 40, 32.35], 0.1), 11.91, 0.01));
  it("Example 12 net (2−1): 0,15,−5,−12.65 @10% → 0", () =>
    near(presentValueCashFlows([0, 15, -5, -12.65], 0.1), 0, 0.01));
});

describe("impliedForwardRate", () => {
  it("r1 2.5% (1y), r2 3.5% (2y) → F1,1 4.51%", () => near(impliedForwardRate(0.025, 1, 0.035, 2), 0.0451, 1e-4));
  it("Example 13 (31 May): r1 2.012%, r2 2.539% → 3.069%", () =>
    near(impliedForwardRate(0.02012, 1, 0.02539, 2), 0.03069, 1e-4));
  it("Example 13 (15 Jun): r1 2.667%, r2 3.177% → 3.689%", () =>
    near(impliedForwardRate(0.02667, 1, 0.03177, 2), 0.03689, 1e-4));
});

describe("forwardFxContinuous", () => {
  it("JPY/USD: spot 134.40, rJPY 0.05%, rUSD 2%, t 0.5 → 133.096", () =>
    near(forwardFxContinuous(134.4, 0.0005, 0.02, 0.5), 133.096, 0.01));
  it("USD/GBP (31 May): spot 1.2602, rUSD 2.012%, rGBP 1.291%, t 1 → 1.2693", () =>
    near(forwardFxContinuous(1.2602, 0.02012, 0.01291, 1), 1.2693, 1e-3));
});

describe("binomial option (one-period)", () => {
  it("Call: S0 40, su 56, sd 32, X 50, r 5% → 2.38", () => near(binomialCall(40, 56, 32, 50, 0.05), 2.38, 0.01));
  it("Put: S0 40, su 56, sd 32, X 50, r 5% → 10.00", () => near(binomialPut(40, 56, 32, 50, 0.05), 10.0, 0.01));
});

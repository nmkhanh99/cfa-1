import { describe, it, expect } from "vitest";
import {
  mean,
  median,
  mode,
  range,
  meanAbsoluteDeviation,
  sampleStdDev,
  targetSemideviation,
  coefficientOfVariation,
  skewness,
  excessKurtosis,
  correlation,
  covariance,
} from "../stats";

/** Ground truth = Example/Question Set trong 2024 L1V1.pdf, Learning Module 3. */
const near = (a: number, b: number, tol: number) => expect(Math.abs(a - b)).toBeLessThan(tol);

const PORT_RETURNS = [5, 3, -1, -4, 4, 2, 0, 4, 3, 0, 6, 5]; // Example 3/4 (monthly %)

describe("mean / median / mode", () => {
  it("Example 4: mean của 12 monthly returns = 2.25%", () => near(mean(PORT_RETURNS), 2.25, 1e-9));
  it("Question Set: median Portfolio P [-3,4,5,3,7] = 4.0", () => near(median([-3, 4, 5, 3, 7]), 4.0, 1e-9));
  it("Question Set: median Portfolio Q [-3,6,4,8] = 5.0", () => near(median([-3, 6, 4, 8]), 5.0, 1e-9));
  it("Question Set: mode Portfolio R [1,-1,4,4,3] = 4.0", () => expect(mode([1, -1, 4, 4, 3])).toEqual([4]));
});

describe("range", () => {
  it("range của PORT_RETURNS = 10 (6 − (−4))", () => near(range(PORT_RETURNS), 10, 1e-9));
});

describe("meanAbsoluteDeviation", () => {
  it("Q.Set: MSCI Years 6–10 [30.79,12.34,−5.02,16.54,27.37] → 10.20%", () =>
    near(meanAbsoluteDeviation([30.79, 12.34, -5.02, 16.54, 27.37]), 10.2, 0.01));
  it("Q.Set: Fund ABC [−20,23,−14,5,−14] → 14.4%", () =>
    near(meanAbsoluteDeviation([-20, 23, -14, 5, -14]), 14.4, 0.05));
  it("Q.Set: Fund XYZ [−33,−12,−12,−8,11] → 9.8%", () =>
    near(meanAbsoluteDeviation([-33, -12, -12, -8, 11]), 9.8, 0.05));
  it("Q.Set: Fund PQR [−14,−18,6,−2,3] → 8.8%", () =>
    near(meanAbsoluteDeviation([-14, -18, 6, -2, 3]), 8.8, 0.05));
});

describe("sampleStdDev", () => {
  it("Example 4: std của 12 monthly returns = 2.958%", () => near(sampleStdDev(PORT_RETURNS), 2.958, 0.001));
});

describe("targetSemideviation", () => {
  it("Example 3: target 3% → 2.7634%", () => near(targetSemideviation(PORT_RETURNS, 3), 2.7634, 0.001));
  it("Example 4: target 2% → 2.195%", () => near(targetSemideviation(PORT_RETURNS, 2), 2.195, 0.001));
});

describe("coefficientOfVariation", () => {
  it("Example 5: Industry A mean 4, std 5.60 → CV 1.40", () =>
    near(coefficientOfVariation([-5, -3, -1, 2, 4, 6, 7, 9, 10, 11]), 1.4, 0.01));
  it("Example 5: Industry B → CV 3.03", () =>
    near(coefficientOfVariation([-10, -9, -7, -3, 1, 3, 5, 18, 20, 22]), 3.03, 0.01));
});

describe("skewness / excessKurtosis", () => {
  it("dữ liệu đối xứng [-2,-1,0,1,2] → skewness 0", () => near(skewness([-2, -1, 0, 1, 2]), 0, 1e-9));
  it("[-2,-1,0,1,2] → excess kurtosis ≈ −1.912 (thin-tailed)", () =>
    near(excessKurtosis([-2, -1, 0, 1, 2]), -1.912, 0.01));
});

describe("covariance / correlation", () => {
  // Anscombe Quartet dataset I (Example 7): correlation = 0.82
  const X = [10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5];
  const Y = [8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68];
  it("Anscombe I: correlation ≈ 0.82", () => near(correlation(X, Y), 0.82, 0.01));
  it("tương quan hoàn hảo dương: [1,2,3] & [2,4,6] = 1", () => near(correlation([1, 2, 3], [2, 4, 6]), 1, 1e-9));
  it("tương quan hoàn hảo âm: [1,2,3] & [6,4,2] = −1", () => near(correlation([1, 2, 3], [6, 4, 2]), -1, 1e-9));
  it("covariance dương khi cùng chiều", () => expect(covariance([1, 2, 3], [2, 4, 6])).toBeGreaterThan(0));
});

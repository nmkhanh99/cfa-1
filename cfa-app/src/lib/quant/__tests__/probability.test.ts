import { describe, it, expect } from "vitest";
import {
  expectedValue,
  variance,
  standardDeviation,
  bayesUnconditional,
  bayesPosteriors,
} from "../probability";

/** Ground truth = Example/Question Set trong 2024 L1V1.pdf, Learning Module 4. */
const near = (a: number, b: number, tol: number) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe("expectedValue / variance / standardDeviation", () => {
  const eps = [2.6, 2.45, 2.2, 2.0];
  const probs = [0.15, 0.45, 0.24, 0.16];
  it("Example 1: E(EPS) = 2.3405", () => near(expectedValue(eps, probs), 2.3405, 1e-4));
  it("Example 1: variance = 0.038785", () => near(variance(eps, probs), 0.038785, 1e-5));
  it("Example 1: std ≈ 0.196939", () => near(standardDeviation(eps, probs), 0.196939, 1e-5));
});

describe("total probability rule for expected value", () => {
  it("Example 2: E(EPS|declining)=2.4875", () => near(expectedValue([2.6, 2.45], [0.25, 0.75]), 2.4875, 1e-4));
  it("Example 2: E(EPS|stable)=2.12", () => near(expectedValue([2.2, 2.0], [0.6, 0.4]), 2.12, 1e-4));
  it("Example 2: E(EPS) = 2.4875·0.6 + 2.12·0.4 = 2.3405", () =>
    near(expectedValue([2.4875, 2.12], [0.6, 0.4]), 2.3405, 1e-4));
});

describe("bond recovery (Question Set)", () => {
  it("E(recovery|S1)=0.845", () => near(expectedValue([0.9, 0.8], [0.45, 0.55]), 0.845, 1e-4));
  it("E(recovery|S2)=0.485", () => near(expectedValue([0.5, 0.4], [0.85, 0.15]), 0.485, 1e-4));
  it("E(recovery)=0.755", () => near(expectedValue([0.845, 0.485], [0.75, 0.25]), 0.755, 1e-4));
});

describe("Bayes — tech firm example", () => {
  const priors = [0.2, 0.8]; // P(tech), P(non-tech)
  const likelihoods = [0.6, 0.25]; // P(R>10% | tech), P(R>10% | non-tech)
  it("P(R>10%) = 0.32", () => near(bayesUnconditional(priors, likelihoods), 0.32, 1e-6));
  it("P(tech | R>10%) = 0.375", () => near(bayesPosteriors(priors, likelihoods)[0], 0.375, 1e-6));
});

describe("Bayes — DriveMed example", () => {
  const priors = [0.45, 0.3, 0.25]; // exceeded, met, fell short
  const likelihoods = [0.75, 0.2, 0.05]; // P(expands | each)
  it("P(DriveMed expands) = 0.41", () => near(bayesUnconditional(priors, likelihoods), 0.41, 1e-6));
  it("P(exceeded | expands) = 0.8232", () => near(bayesPosteriors(priors, likelihoods)[0], 0.823171, 1e-5));
  it("posterior tổng = 1", () =>
    near(bayesPosteriors(priors, likelihoods).reduce((a, b) => a + b, 0), 1, 1e-9));
  it("từ chối likelihood ngoài [0,1]", () => {
    expect(() => bayesUnconditional([0.5, 0.5], [-0.2, 0.4])).toThrow();
    expect(() => bayesPosteriors([0.5, 0.5], [1.2, 0.4])).toThrow();
  });
});

import { describe, it, expect } from "vitest";
import { initCard, reviewCard, isDue, DAY_MS } from "../srs";

const near = (a: number, b: number, tol = 1e-9) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe("SM-2 reviewCard", () => {
  it("nhớ tốt (q=5) lần 1: interval 1 ngày, EF 2.6, repetitions 1", () => {
    const c = reviewCard(initCard("x", 0), 5, 0);
    expect(c.repetitions).toBe(1);
    expect(c.intervalDays).toBe(1);
    near(c.easeFactor, 2.6);
    expect(c.dueAt).toBe(DAY_MS);
  });

  it("chuỗi q=5: interval 1 → 6 → round(6·EF)", () => {
    let c = initCard("x", 0);
    c = reviewCard(c, 5, 0); // interval 1, EF 2.6
    c = reviewCard(c, 5, DAY_MS); // interval 6, EF 2.7
    expect(c.intervalDays).toBe(6);
    near(c.easeFactor, 2.7);
    c = reviewCard(c, 5, 0); // interval round(6*2.7)=16, EF 2.8
    expect(c.intervalDays).toBe(16);
    near(c.easeFactor, 2.8);
    expect(c.repetitions).toBe(3);
  });

  it("quên (q<3) reset repetitions=0, interval=1, EF vẫn cập nhật", () => {
    let c = initCard("x", 0);
    c = reviewCard(c, 5, 0); // EF 2.6
    c = reviewCard(c, 2, DAY_MS);
    expect(c.repetitions).toBe(0);
    expect(c.intervalDays).toBe(1);
    near(c.easeFactor, 2.6 + (0.1 - 3 * (0.08 + 3 * 0.02))); // 2.28
  });

  it("EF không xuống dưới 1.3", () => {
    let c = initCard("x", 0);
    for (let i = 0; i < 10; i++) c = reviewCard(c, 0, 0);
    expect(c.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it("EF theo quality: q=4 giữ 2.5; q=3 → 2.36", () => {
    near(reviewCard(initCard("a", 0), 4, 0).easeFactor, 2.5);
    near(reviewCard(initCard("b", 0), 3, 0).easeFactor, 2.36);
  });

  it("quality ngoài [0,5] hoặc NaN → throw", () => {
    expect(() => reviewCard(initCard("x", 0), 6, 0)).toThrow();
    expect(() => reviewCard(initCard("x", 0), -1, 0)).toThrow();
    expect(() => reviewCard(initCard("x", 0), NaN, 0)).toThrow();
  });

  it("isDue: thẻ mới đến hạn ngay", () => {
    expect(isDue(initCard("x", 100), 100)).toBe(true);
    expect(isDue(reviewCard(initCard("x", 0), 5, 0), 0)).toBe(false);
  });
});

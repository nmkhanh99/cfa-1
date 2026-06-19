import { describe, it, expect } from "vitest";
import {
  interestRateFromComponents,
  holdingPeriodReturn,
  linkReturns,
  arithmeticMean,
  geometricMean,
  harmonicMean,
  moneyWeightedReturn,
  timeWeightedReturn,
  annualize,
  annualizeFromDays,
  continuouslyCompounded,
  ccFromPrices,
  realReturn,
  afterTaxReturn,
  leveragedReturn,
} from "../returns";

/**
 * Ground truth = ví dụ/đáp án trong 2024 L1V1.pdf, Learning Module 1 (Rates and Returns).
 * Tham chiếu Example được ghi trong mô tả từng test.
 */

const near = (a: number, b: number, tol = 5e-4) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe("interestRateFromComponents", () => {
  it("real risk-free + inflation + default + liquidity + maturity premiums", () => {
    near(
      interestRateFromComponents({ realRiskFree: 0.005, inflation: 0.02, defaultRisk: 0.02, liquidity: 0.005, maturity: 0.01 }),
      0.06
    );
  });
  it("chỉ real risk-free + inflation", () => {
    near(interestRateFromComponents({ realRiskFree: 0.005, inflation: 0.02 }), 0.025);
  });
});

describe("holdingPeriodReturn", () => {
  it("Example 2: mua 3450, bán 3050, cổ tức 51.55 → -10.1%", () => {
    near(holdingPeriodReturn(3450, 3050, 51.55), -0.101);
  });
  it("ví dụ mở đầu: 100 → 105, income 2 → 7%", () => {
    near(holdingPeriodReturn(100, 105, 2), 0.07);
  });
});

describe("linkReturns (HPR nhiều kỳ)", () => {
  it("Example 3: 14%, -10%, -2% → 0.55%", () => {
    near(linkReturns([0.14, -0.1, -0.02]), 0.0055);
  });
  it("Example 8: 15%,-5%,10%,15%,3% → 42.35%", () => {
    near(linkReturns([0.15, -0.05, 0.1, 0.15, 0.03]), 0.4235);
  });
});

describe("arithmeticMean", () => {
  it("-50%,35%,27% → 4.00%", () => {
    near(arithmeticMean([-0.5, 0.35, 0.27]), 0.04);
  });
  it("Example 8: 15%,-5%,10%,15%,3% → 7.60%", () => {
    near(arithmeticMean([0.15, -0.05, 0.1, 0.15, 0.03]), 0.076);
  });
  it("Question Set (10 năm) → 3.00%", () => {
    near(arithmeticMean([0.045, 0.06, 0.015, -0.02, 0, 0.045, 0.035, 0.025, 0.055, 0.04]), 0.03);
  });
});

describe("geometricMean", () => {
  it("-50%,35%,27% → -5.00%", () => {
    near(geometricMean([-0.5, 0.35, 0.27]), -0.05);
  });
  it("Example 4: 22%,-25%,11% → 0.52%", () => {
    near(geometricMean([0.22, -0.25, 0.11]), 0.0052);
  });
  it("Example 8: → 7.32%", () => {
    near(geometricMean([0.15, -0.05, 0.1, 0.15, 0.03]), 0.0732);
  });
  it("Question Set (10 năm) → 2.9717%", () => {
    near(geometricMean([0.045, 0.06, 0.015, -0.02, 0, 0.045, 0.035, 0.025, 0.055, 0.04]), 0.029717);
  });
});

describe("harmonicMean", () => {
  it("Example 6: giá 10 & 15 → 12 (cost averaging)", () => {
    near(harmonicMean([10, 15]), 12);
  });
  it("P/E 45,15,15 → 19.29", () => {
    near(harmonicMean([45, 15, 15]), 19.2857, 1e-3);
  });
  it("Example 7: 10 P/E → 10.8142", () => {
    near(harmonicMean([22.29, 15.54, 9.38, 15.12, 10.72, 14.57, 7.2, 7.97, 10.34, 8.35]), 10.8142, 5e-3);
  });
});

describe("moneyWeightedReturn (IRR)", () => {
  it("Exhibit 10: [-100,-950,350,1270] → 26.11%", () => {
    near(moneyWeightedReturn([-100, -950, 350, 1270]), 0.2611, 1e-3);
  });
  it("cổ phiếu trả cổ tức: [-200,-220,480] → 9.39%", () => {
    near(moneyWeightedReturn([-200, -220, 480]), 0.0939, 1e-3);
  });
  it("Example 8: [-30,-10.5,22.75,-3,-6.25,36.05] → 5.86%", () => {
    near(moneyWeightedReturn([-30, -10.5, 22.75, -3, -6.25, 36.05]), 0.0586, 1e-3);
  });
});

describe("timeWeightedReturn", () => {
  it("Example 9 In-House: HPR 20%,5%,12%,-10% → 27.01%", () => {
    near(timeWeightedReturn([0.2, 0.05, 0.12, -0.1]), 0.2701);
  });
  it("Example 9 Super Trust: 10%,2%,8%,4% → 26.02%", () => {
    near(timeWeightedReturn([0.1, 0.02, 0.08, 0.04]), 0.2602);
  });
  it("Example 10 Walbright: 12% & 8.06% → 21.03%", () => {
    near(timeWeightedReturn([0.12, 0.0806]), 0.2103, 1e-3);
  });
});

describe("annualize", () => {
  it("weekly 0.2% → 10.95%", () => {
    near(annualize(0.002, 52), 0.1095);
  });
  it("18-month 20% → 12.92%", () => {
    near(annualize(0.2, 2 / 3), 0.1292);
  });
  it("Example 12 Security C: quý 5% → 21.55%", () => {
    near(annualize(0.05, 4), 0.2155);
  });
});

describe("annualizeFromDays", () => {
  it("Example 12 Security A: 6.2% trong 100 ngày → 24.55%", () => {
    near(annualizeFromDays(0.062, 100), 0.2455);
  });
  it("0.4% trong 15 ngày → 10.20%", () => {
    near(annualizeFromDays(0.004, 15), 0.102);
  });
});

describe("continuouslyCompounded", () => {
  it("ln(1.04) = 0.039221", () => {
    near(continuouslyCompounded(0.04), 0.039221, 1e-5);
  });
  it("ln(1.15) = 0.139762", () => {
    near(continuouslyCompounded(0.15), 0.139762, 1e-5);
  });
  it("ccFromPrices(30, 34.50) = 0.139762", () => {
    near(ccFromPrices(30, 34.5), 0.139762, 1e-5);
  });
});

describe("realReturn", () => {
  it("Example 15: equities 8% / inflation 2.1% → 5.8%", () => {
    near(realReturn(0.08, 0.021), 0.058, 1e-3);
  });
  it("Example 15: corp bonds 6.5% / 2.1% → 4.3%", () => {
    near(realReturn(0.065, 0.021), 0.043, 1e-3);
  });
});

describe("afterTaxReturn", () => {
  it("15% với thuế 20% → 12%", () => {
    near(afterTaxReturn(0.15, 0.2), 0.12);
  });
});

describe("leveragedReturn", () => {
  it("Rp 8%, rD 5%, nợ 3tr/vốn 7tr → 9.29%", () => {
    near(leveragedReturn(0.08, 0.05, 3, 7), 0.0929, 1e-4);
  });
});

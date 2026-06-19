/**
 * LM1 — Rates and Returns. Engine thuần (không phụ thuộc UI).
 * Mọi hàm được kiểm thử đối chiếu ví dụ/đáp án trong 2024 L1V1.pdf (xem returns.test.ts).
 */

/**
 * Lãi suất (required rate of return) = real risk-free rate + tổng các premium.
 * Theo "Determinants of Interest Rates": inflation, default, liquidity, maturity premium.
 */
export function interestRateFromComponents(parts: {
  realRiskFree: number;
  inflation?: number;
  defaultRisk?: number;
  liquidity?: number;
  maturity?: number;
}): number {
  const { realRiskFree, inflation = 0, defaultRisk = 0, liquidity = 0, maturity = 0 } = parts;
  return realRiskFree + inflation + defaultRisk + liquidity + maturity;
}

/** Holding period return: R = (P1 - P0 + I1) / P0 */
export function holdingPeriodReturn(p0: number, p1: number, income = 0): number {
  if (p0 === 0) throw new Error("P0 không được bằng 0");
  return (p1 - p0 + income) / p0;
}

/** Liên kết (compound) nhiều HPR thành tổng HPR: Π(1+Ri) - 1 */
export function linkReturns(returns: number[]): number {
  return returns.reduce((acc, r) => acc * (1 + r), 1) - 1;
}

/** Trung bình cộng (arithmetic mean) */
export function arithmeticMean(returns: number[]): number {
  if (returns.length === 0) throw new Error("Cần ít nhất 1 quan sát");
  return returns.reduce((a, b) => a + b, 0) / returns.length;
}

/** Trung bình nhân (geometric mean) của các return: [Π(1+Ri)]^(1/n) - 1 */
export function geometricMean(returns: number[]): number {
  if (returns.length === 0) throw new Error("Cần ít nhất 1 quan sát");
  const product = returns.reduce((acc, r) => acc * (1 + r), 1);
  if (product < 0) throw new Error("Tích (1+R) âm — không tính được căn bậc n");
  return Math.pow(product, 1 / returns.length) - 1;
}

/** Trung bình điều hòa (harmonic mean) — dùng cho giá/tỷ số khi cost averaging: n / Σ(1/Xi) */
export function harmonicMean(values: number[]): number {
  if (values.length === 0) throw new Error("Cần ít nhất 1 quan sát");
  if (values.some((v) => v <= 0)) throw new Error("Harmonic mean yêu cầu mọi giá trị > 0");
  const sumReciprocals = values.reduce((acc, v) => acc + 1 / v, 0);
  return values.length / sumReciprocals;
}

/**
 * Money-weighted return (IRR): nghiệm r của Σ CFt/(1+r)^t = 0.
 * cashFlows[t] tại thời điểm t = 0,1,2,... (cùng đơn vị kỳ với output).
 */
export function moneyWeightedReturn(cashFlows: number[]): number {
  const npv = (rate: number) =>
    cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + rate, t), 0);

  // Quét tìm khoảng đổi dấu rồi bisection (ổn định cho dòng tiền thông thường).
  let lo = -0.9999;
  let hi = lo;
  let fLo = npv(lo);
  let found = false;
  for (let r = -0.99; r <= 100; r += 0.01) {
    const f = npv(r);
    if (fLo === 0) return lo;
    if ((fLo < 0 && f > 0) || (fLo > 0 && f < 0)) {
      lo = r - 0.01;
      hi = r;
      fLo = npv(lo);
      found = true;
      break;
    }
    lo = r;
    fLo = f;
  }
  if (!found) throw new Error("Không tìm được IRR (dòng tiền không đổi dấu hợp lệ)");

  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    const fMid = npv(mid);
    if (Math.abs(fMid) < 1e-10) return mid;
    if ((fLo < 0 && fMid < 0) || (fLo > 0 && fMid > 0)) {
      lo = mid;
      fLo = fMid;
    } else {
      hi = mid;
    }
  }
  return (lo + hi) / 2;
}

/**
 * Time-weighted return: liên kết các HPR của từng kỳ con.
 * Nếu các kỳ con hợp thành đúng 1 khoảng đo → đây là TWR cho khoảng đó.
 * Để annualize qua N năm, dùng annualizeReturns trên các return năm.
 */
export function timeWeightedReturn(subPeriodReturns: number[]): number {
  return linkReturns(subPeriodReturns);
}

/** Annualize: (1 + Rperiod)^periodsPerYear - 1. periodsPerYear có thể là phân số (vd 365/100, 2/3). */
export function annualize(periodReturn: number, periodsPerYear: number): number {
  return Math.pow(1 + periodReturn, periodsPerYear) - 1;
}

/** Annualize từ return của một số ngày: (1+R)^(365/days) - 1 */
export function annualizeFromDays(periodReturn: number, days: number, daysPerYear = 365): number {
  return Math.pow(1 + periodReturn, daysPerYear / days) - 1;
}

/** Continuously compounded return từ một HPR: ln(1 + R) */
export function continuouslyCompounded(hpr: number): number {
  return Math.log(1 + hpr);
}

/** Continuously compounded return từ giá: ln(P1/P0) */
export function ccFromPrices(p0: number, p1: number): number {
  if (p0 <= 0) throw new Error("P0 phải > 0");
  return Math.log(p1 / p0);
}

/** Real return: (1 + nominal)/(1 + inflation) - 1 */
export function realReturn(nominal: number, inflation: number): number {
  return (1 + nominal) / (1 + inflation) - 1;
}

/** After-tax nominal return: pretax * (1 - taxRate) */
export function afterTaxReturn(pretaxReturn: number, taxRate: number): number {
  return pretaxReturn * (1 - taxRate);
}

/** Leveraged return: RL = Rp + (VB/VE)(Rp - rD) */
export function leveragedReturn(rp: number, rd: number, debt: number, equity: number): number {
  if (equity <= 0) throw new Error("Vốn chủ (equity) phải > 0");
  return rp + (debt / equity) * (rp - rd);
}

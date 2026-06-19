/**
 * LM2 — The Time Value of Money in Finance. Engine thuần (không phụ thuộc UI).
 * Mọi hàm kiểm thử đối chiếu Example trong 2024 L1V1.pdf, LM2 (xem tvm.test.ts).
 */

/** PV của một dòng tiền đơn: PV = FV / (1+r)^t (Eq. 5). Dùng cho discount/zero-coupon bond. */
export function presentValueSingle(fv: number, r: number, t: number): number {
  return fv / Math.pow(1 + r, t);
}

/** PV trái phiếu coupon: Σ PMT/(1+r)^i + FV/(1+r)^n (Eq. 6). */
export function presentValueCouponBond(coupon: number, r: number, n: number, fv: number): number {
  let pv = 0;
  for (let i = 1; i <= n; i++) pv += coupon / Math.pow(1 + r, i);
  pv += fv / Math.pow(1 + r, n);
  return pv;
}

/** PV perpetuity (trái phiếu vĩnh viễn / cổ tức cố định): PMT / r (Eq. 7, 10). */
export function presentValuePerpetuity(pmt: number, r: number): number {
  if (r <= 0) throw new Error("r phải > 0");
  return pmt / r;
}

/** Khoản trả đều của annuity/mortgage: A = r·PV / (1 − (1+r)^−t) (Eq. 8). */
export function annuityPayment(pv: number, r: number, t: number): number {
  if (r === 0) return pv / t;
  return (r * pv) / (1 - Math.pow(1 + r, -t));
}

/** Implied return của dòng tiền đơn: (FV/PV)^(1/t) − 1 (Eq. 18). */
export function impliedReturnSingle(pv: number, fv: number, t: number): number {
  if (pv <= 0) throw new Error("PV phải > 0");
  return Math.pow(fv / pv, 1 / t) - 1;
}

/** Giá cổ phiếu trả cổ tức không đổi: D / r (Eq. 10). */
export function presentValueConstantDividend(dividend: number, r: number): number {
  if (r <= 0) throw new Error("r phải > 0");
  return dividend / r;
}

/** Gordon (constant growth) DDM: PV = D0·(1+g)/(r−g) (Eq. 14). D0 = cổ tức hiện tại. */
export function gordonGrowthValue(d0: number, g: number, r: number): number {
  if (r - g <= 0) throw new Error("Cần r − g > 0");
  return (d0 * (1 + g)) / (r - g);
}

/** Implied required return từ giá & cổ tức kỳ tới: r = D(1)/PV + g (Eq. 21). */
export function impliedReturnEquity(dividendNext: number, price: number, g: number): number {
  return dividendNext / price + g;
}

/** Implied dividend growth: g = r − D(1)/PV (Eq. 22). */
export function impliedGrowthEquity(dividendNext: number, price: number, r: number): number {
  return r - dividendNext / price;
}

/**
 * Two-stage DDM (Eq. 15–17): tăng trưởng gShort trong nShort kỳ, sau đó gLong vĩnh viễn.
 * d0 = cổ tức hiện tại.
 */
export function twoStageDDM(d0: number, gShort: number, nShort: number, gLong: number, r: number): number {
  if (r - gLong <= 0) throw new Error("Cần r − gLong > 0");
  let pv = 0;
  let d = d0;
  for (let i = 1; i <= nShort; i++) {
    d = d * (1 + gShort);
    pv += d / Math.pow(1 + r, i);
  }
  // Terminal value tại cuối kỳ nShort dựa trên cổ tức kỳ kế tăng theo gLong
  const dNextAfter = d * (1 + gLong);
  const terminal = dNextAfter / (r - gLong);
  pv += terminal / Math.pow(1 + r, nShort);
  return pv;
}

/** PV của một chuỗi dòng tiền (index t = 0,1,2,…) tại discount rate r. */
export function presentValueCashFlows(cashFlows: number[], r: number): number {
  return cashFlows.reduce((acc, cf, t) => acc + cf / Math.pow(1 + r, t), 0);
}

/**
 * Implied forward rate giữa hai kỳ hạn (cash flow additivity, Eq. 25):
 * ((1+r2)^t2 / (1+r1)^t1)^(1/(t2−t1)) − 1.
 */
export function impliedForwardRate(r1: number, t1: number, r2: number, t2: number): number {
  if (t2 <= t1) throw new Error("Cần t2 > t1");
  return Math.pow(Math.pow(1 + r2, t2) / Math.pow(1 + r1, t1), 1 / (t2 - t1)) - 1;
}

/**
 * Forward FX không-chênh-lệch-giá (continuous compounding):
 * F = S · e^((rPrice − rBase)·t), với tỷ giá yết = priceCurrency / baseCurrency.
 */
export function forwardFxContinuous(spot: number, rPrice: number, rBase: number, t: number): number {
  return spot * Math.exp((rPrice - rBase) * t);
}

/** Định giá call một kỳ (binomial / cash flow additivity, risk-neutral). */
export function binomialCall(s0: number, su: number, sd: number, strike: number, r: number): number {
  if (su === sd) throw new Error("su phải khác sd");
  const u = su / s0;
  const d = sd / s0;
  const cu = Math.max(0, su - strike);
  const cd = Math.max(0, sd - strike);
  const pi = (1 + r - d) / (u - d); // xác suất risk-neutral
  return (pi * cu + (1 - pi) * cd) / (1 + r);
}

/** Định giá put một kỳ (binomial / cash flow additivity, risk-neutral). */
export function binomialPut(s0: number, su: number, sd: number, strike: number, r: number): number {
  if (su === sd) throw new Error("su phải khác sd");
  const u = su / s0;
  const d = sd / s0;
  const pu = Math.max(0, strike - su);
  const pd = Math.max(0, strike - sd);
  const pi = (1 + r - d) / (u - d);
  return (pi * pu + (1 - pi) * pd) / (1 + r);
}

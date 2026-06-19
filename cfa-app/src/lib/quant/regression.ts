/**
 * LM10 — Simple Linear Regression. Engine thuần (không phụ thuộc UI).
 * Mọi hàm kiểm thử đối chiếu Example ROA~CAPEX trong 2024 L1V1.pdf, LM10 (xem regression.test.ts).
 */

export interface RegressionResult {
  n: number;
  slope: number;
  intercept: number;
  xbar: number;
  ybar: number;
  sumXdev2: number; // Σ(Xi − X̄)²
  sst: number; // Σ(Yi − Ȳ)²
  ssr: number; // explained
  sse: number; // residual
  rSquared: number;
  see: number; // standard error of estimate
  fStat: number;
  slopeStdError: number;
  slopeTStat: number; // kiểm định b1 = 0
}

/** OLS hồi quy tuyến tính đơn của y theo x; trả toàn bộ thống kê fit & ANOVA. */
export function linearRegression(x: number[], y: number[]): RegressionResult {
  const n = x.length;
  if (y.length !== n) throw new Error("x và y phải cùng độ dài");
  if (n < 3) throw new Error("Cần ít nhất 3 quan sát");

  const xbar = x.reduce((a, b) => a + b, 0) / n;
  const ybar = y.reduce((a, b) => a + b, 0) / n;

  let sumXdev2 = 0;
  let sumXYdev = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    sumXdev2 += (x[i] - xbar) ** 2;
    sumXYdev += (x[i] - xbar) * (y[i] - ybar);
    sst += (y[i] - ybar) ** 2;
  }
  if (sumXdev2 === 0) throw new Error("Biến độc lập không được hằng số");
  if (sst === 0) throw new Error("Biến phụ thuộc Y không được hằng số (không hồi quy được)");

  const slope = sumXYdev / sumXdev2;
  const intercept = ybar - slope * xbar;

  let sse = 0;
  for (let i = 0; i < n; i++) sse += (y[i] - (intercept + slope * x[i])) ** 2;
  const ssr = sst - sse;
  const rSquared = ssr / sst;
  const mse = sse / (n - 2);
  const see = Math.sqrt(Math.max(mse, 0));
  // Fit hoàn hảo (SSE = 0): F vô hạn (dương); t giữ dấu của slope (slope ≠ 0 vì SST > 0).
  const fStat = mse === 0 ? Infinity : ssr / 1 / mse;
  const slopeStdError = see / Math.sqrt(sumXdev2);
  const slopeTStat = slopeStdError === 0 ? Math.sign(slope) * Infinity : slope / slopeStdError;

  return { n, slope, intercept, xbar, ybar, sumXdev2, sst, ssr, sse, rSquared, see, fStat, slopeStdError, slopeTStat };
}

/** Giá trị dự báo Ŷ = b0 + b1·Xf. */
export function predict(reg: RegressionResult, xf: number): number {
  return reg.intercept + reg.slope * xf;
}

/** Standard error of forecast: se·√(1 + 1/n + (Xf−X̄)²/Σ(Xi−X̄)²). */
export function standardErrorOfForecast(reg: RegressionResult, xf: number): number {
  return reg.see * Math.sqrt(1 + 1 / reg.n + (xf - reg.xbar) ** 2 / reg.sumXdev2);
}

export interface PredictionInterval {
  yhat: number;
  sf: number;
  lower: number;
  upper: number;
}

/** Khoảng dự báo: Ŷf ± t_critical · sf (t tra bảng với df = n − 2). */
export function predictionInterval(reg: RegressionResult, xf: number, tCritical: number): PredictionInterval {
  if (tCritical < 0) throw new Error("Giá trị tới hạn phải ≥ 0");
  const yhat = predict(reg, xf);
  const sf = standardErrorOfForecast(reg, xf);
  return { yhat, sf, lower: yhat - tCritical * sf, upper: yhat + tCritical * sf };
}

/** Biến đổi log cho các dạng hàm (log-lin, lin-log, log-log). Yêu cầu giá trị > 0 khi lấy log. */
export function logTransform(values: number[]): number[] {
  if (values.some((v) => v <= 0)) throw new Error("Log yêu cầu mọi giá trị > 0");
  return values.map((v) => Math.log(v));
}

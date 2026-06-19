export const pct = (x: number, dp = 2) =>
  Number.isFinite(x) ? `${(x * 100).toFixed(dp)}%` : "—";

export const num = (x: number, dp = 4) =>
  Number.isFinite(x) ? x.toFixed(dp) : "—";

import { useState } from "react";
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
  realReturn,
  afterTaxReturn,
  leveragedReturn,
} from "../lib/quant/returns";
import { pct, num } from "../lib/format";
import type { Section } from "../data/curriculum";

/** Parse danh sách số ngăn cách bởi dấu phẩy / khoảng trắng / xuống dòng. */
function parseNums(s: string): number[] {
  return s
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 border-b border-slate-100 last:border-0">
      <span className="text-slate-600">{label}</span>
      <span className="font-mono font-medium text-slate-900">{value}</span>
    </div>
  );
}

function Tool({ title, los, children }: { title: string; los?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="font-semibold text-slate-800">{title}</h4>
      {los && <p className="mt-0.5 text-xs text-indigo-600">{los}</p>}
      <div className="mt-3 space-y-3">{children}</div>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none";

function SectionHeader({ n, title }: { n: number; title: string }) {
  return (
    <h3 className="mt-8 mb-3 border-l-4 border-indigo-500 pl-3 text-lg font-bold text-slate-800">
      {n}. {title}
    </h3>
  );
}

const safe = <T,>(fn: () => T): T | null => {
  try {
    return fn();
  } catch {
    return null;
  }
};

/**
 * Công cụ LM1 — Rates and Returns.
 * Section được render theo đúng `sections` khai báo trong curriculum.ts
 * (nguồn cấu trúc duy nhất) — không hardcode tiêu đề/số thứ tự.
 */
export default function ReturnAnalyzer({ sections }: { sections: Section[] }) {
  // Interest Rates and Time Value of Money
  const [rrf, setRrf] = useState("0.005");
  const [infl, setInfl] = useState("0.02");
  const [def, setDef] = useState("0.02");
  const [liq, setLiq] = useState("0.005");
  const [mat, setMat] = useState("0.01");

  // Rates of Return
  const [p0, setP0] = useState("3450");
  const [p1, setP1] = useState("3050");
  const [income, setIncome] = useState("51.55");
  const [series, setSeries] = useState("0.15, -0.05, 0.10, 0.15, 0.03");
  const [prices, setPrices] = useState("10, 15");

  // MWR / TWR
  const [cfs, setCfs] = useState("-100, -950, 350, 1270");
  const [subHpr, setSubHpr] = useState("0.20, 0.05, 0.12, -0.10");

  // Annualized
  const [periodRet, setPeriodRet] = useState("0.05");
  const [periodsPerYear, setPeriodsPerYear] = useState("4");
  const [dayRet, setDayRet] = useState("0.062");
  const [days, setDays] = useState("100");
  const [ccHpr, setCcHpr] = useState("0.15");

  // Other measures
  const [nominal, setNominal] = useState("0.08");
  const [inflation, setInflation] = useState("0.021");
  const [pretax, setPretax] = useState("0.15");
  const [tax, setTax] = useState("0.20");
  const [rp, setRp] = useState("0.08");
  const [rd, setRd] = useState("0.05");
  const [debt, setDebt] = useState("3");
  const [equity, setEquity] = useState("7");

  const ret = parseNums(series);
  const priceArr = parseNums(prices);
  const cfArr = parseNums(cfs);
  const subArr = parseNums(subHpr);

  // Tool theo từng section id (khớp curriculum.ts). Section không có tool → bỏ qua.
  const toolsBySection: Record<string, React.ReactNode> = {
    "interest-rates": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Interest Rate Builder"
          los="LOS: interest rate = real risk-free rate + các premium"
        >
          <label className="block text-xs text-slate-500">Real risk-free rate</label>
          <input className={inputCls} value={rrf} onChange={(e) => setRrf(e.target.value)} />
          <label className="block text-xs text-slate-500">Inflation premium</label>
          <input className={inputCls} value={infl} onChange={(e) => setInfl(e.target.value)} />
          <label className="block text-xs text-slate-500">Default risk premium</label>
          <input className={inputCls} value={def} onChange={(e) => setDef(e.target.value)} />
          <label className="block text-xs text-slate-500">Liquidity premium</label>
          <input className={inputCls} value={liq} onChange={(e) => setLiq(e.target.value)} />
          <label className="block text-xs text-slate-500">Maturity premium</label>
          <input className={inputCls} value={mat} onChange={(e) => setMat(e.target.value)} />
          <Row
            label="Required interest rate"
            value={pct(
              interestRateFromComponents({
                realRiskFree: +rrf,
                inflation: +infl,
                defaultRisk: +def,
                liquidity: +liq,
                maturity: +mat,
              })
            )}
          />
        </Tool>
      </div>
    ),
    "rates-of-return": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool title="Holding Period Return" los="LOS: calculate major return measures">
          <label className="block text-xs text-slate-500">Giá đầu (P₀)</label>
          <input className={inputCls} value={p0} onChange={(e) => setP0(e.target.value)} />
          <label className="block text-xs text-slate-500">Giá cuối (P₁)</label>
          <input className={inputCls} value={p1} onChange={(e) => setP1(e.target.value)} />
          <label className="block text-xs text-slate-500">Thu nhập (I₁)</label>
          <input className={inputCls} value={income} onChange={(e) => setIncome(e.target.value)} />
          <Row label="HPR" value={pct(holdingPeriodReturn(+p0, +p1, +income))} />
        </Tool>

        <Tool title="Mean Returns (Arithmetic / Geometric)" los="single-period vs multi-period">
          <label className="block text-xs text-slate-500">Chuỗi return (vd 0.15, -0.05, …)</label>
          <textarea className={inputCls} rows={2} value={series} onChange={(e) => setSeries(e.target.value)} />
          <Row label="Arithmetic mean" value={ret.length ? pct(arithmeticMean(ret)) : "—"} />
          <Row label="Geometric mean" value={safe(() => geometricMean(ret)) !== null ? pct(geometricMean(ret)) : "—"} />
          <Row label="Linked HPR (cả kỳ)" value={ret.length ? pct(linkReturns(ret)) : "—"} />
        </Tool>

        <Tool title="Harmonic Mean (cost averaging)" los="giá mua trung bình khi đầu tư định kỳ">
          <label className="block text-xs text-slate-500">Giá mua các kỳ (vd 10, 15)</label>
          <textarea className={inputCls} rows={2} value={prices} onChange={(e) => setPrices(e.target.value)} />
          <Row label="Harmonic mean" value={safe(() => harmonicMean(priceArr)) !== null ? num(harmonicMean(priceArr)) : "—"} />
          <Row label="Arithmetic mean (so sánh)" value={priceArr.length ? num(arithmeticMean(priceArr)) : "—"} />
        </Tool>
      </div>
    ),
    "mwr-twr": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool title="Money-Weighted Return (IRR)" los="LOS: compare MWR & TWR">
          <label className="block text-xs text-slate-500">Dòng tiền theo kỳ t=0,1,2,… (âm = chi ra)</label>
          <textarea className={inputCls} rows={2} value={cfs} onChange={(e) => setCfs(e.target.value)} />
          <Row label="MWR (IRR)" value={safe(() => moneyWeightedReturn(cfArr)) !== null ? pct(moneyWeightedReturn(cfArr)) : "—"} />
        </Tool>

        <Tool title="Time-Weighted Return" los="liên kết HPR từng kỳ con">
          <label className="block text-xs text-slate-500">HPR từng kỳ con (vd 0.20, 0.05, …)</label>
          <textarea className={inputCls} rows={2} value={subHpr} onChange={(e) => setSubHpr(e.target.value)} />
          <Row label="TWR (linked)" value={subArr.length ? pct(timeWeightedReturn(subArr)) : "—"} />
        </Tool>
      </div>
    ),
    annualized: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool title="Annualize theo số kỳ/năm" los="LOS: annualized return measures">
          <label className="block text-xs text-slate-500">Return của kỳ</label>
          <input className={inputCls} value={periodRet} onChange={(e) => setPeriodRet(e.target.value)} />
          <label className="block text-xs text-slate-500">Số kỳ trong năm (vd 4, 52, 2/3 → 0.6667)</label>
          <input className={inputCls} value={periodsPerYear} onChange={(e) => setPeriodsPerYear(e.target.value)} />
          <Row label="Annualized" value={pct(annualize(+periodRet, +periodsPerYear))} />
        </Tool>

        <Tool title="Annualize theo số ngày">
          <label className="block text-xs text-slate-500">Return của giai đoạn</label>
          <input className={inputCls} value={dayRet} onChange={(e) => setDayRet(e.target.value)} />
          <label className="block text-xs text-slate-500">Số ngày</label>
          <input className={inputCls} value={days} onChange={(e) => setDays(e.target.value)} />
          <Row label="Annualized" value={pct(annualizeFromDays(+dayRet, +days))} />
        </Tool>

        <Tool title="Continuously Compounded Return" los="ln(1 + HPR)">
          <label className="block text-xs text-slate-500">HPR</label>
          <input className={inputCls} value={ccHpr} onChange={(e) => setCcHpr(e.target.value)} />
          <Row label="Continuously compounded" value={pct(continuouslyCompounded(+ccHpr))} />
        </Tool>
      </div>
    ),
    "other-measures": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool title="Real Return" los="(1+nominal)/(1+inflation) − 1">
          <label className="block text-xs text-slate-500">Nominal return</label>
          <input className={inputCls} value={nominal} onChange={(e) => setNominal(e.target.value)} />
          <label className="block text-xs text-slate-500">Inflation</label>
          <input className={inputCls} value={inflation} onChange={(e) => setInflation(e.target.value)} />
          <Row label="Real return" value={pct(realReturn(+nominal, +inflation))} />
        </Tool>

        <Tool title="After-Tax Nominal Return" los="pretax × (1 − tax)">
          <label className="block text-xs text-slate-500">Pre-tax return</label>
          <input className={inputCls} value={pretax} onChange={(e) => setPretax(e.target.value)} />
          <label className="block text-xs text-slate-500">Thuế suất</label>
          <input className={inputCls} value={tax} onChange={(e) => setTax(e.target.value)} />
          <Row label="After-tax" value={pct(afterTaxReturn(+pretax, +tax))} />
        </Tool>

        <Tool title="Leveraged Return" los="Rp + (VB/VE)(Rp − rD)">
          <label className="block text-xs text-slate-500">Return danh mục (Rp)</label>
          <input className={inputCls} value={rp} onChange={(e) => setRp(e.target.value)} />
          <label className="block text-xs text-slate-500">Lãi vay (rD)</label>
          <input className={inputCls} value={rd} onChange={(e) => setRd(e.target.value)} />
          <label className="block text-xs text-slate-500">Nợ (VB)</label>
          <input className={inputCls} value={debt} onChange={(e) => setDebt(e.target.value)} />
          <label className="block text-xs text-slate-500">Vốn chủ (VE)</label>
          <input className={inputCls} value={equity} onChange={(e) => setEquity(e.target.value)} />
          <Row label="Leveraged return" value={safe(() => leveragedReturn(+rp, +rd, +debt, +equity)) !== null ? pct(leveragedReturn(+rp, +rd, +debt, +equity)) : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Công cụ phân tích lợi suất danh mục — section & thứ tự lấy đúng từ mục lục sách (LM1).
      </p>
      {sections.map((s, i) => {
        const tools = toolsBySection[s.id];
        if (!tools) return null; // section lý thuyết (vd Introduction) → xem ở sách
        return (
          <div key={s.id}>
            <SectionHeader n={i + 1} title={s.title} />
            {tools}
          </div>
        );
      })}
    </div>
  );
}

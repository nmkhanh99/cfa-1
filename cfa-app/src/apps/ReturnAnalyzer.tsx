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

/**
 * Khung công cụ chuẩn theo rule in-app-guidance:
 * - note: giải thích công cụ tính gì + liên hệ thực tế
 * - steps: hướng dẫn các bước dùng ngay trên app
 * - book: trỏ đúng mục trong sách (đã đối chiếu PDF)
 */
function Tool({
  title,
  note,
  steps,
  book,
  children,
}: {
  title: string;
  note: string;
  steps: string[];
  book: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="font-semibold text-slate-800">{title}</h4>
      <p className="mt-1 rounded bg-amber-50 px-2 py-1 text-xs leading-snug text-amber-800">{note}</p>
      <div className="mt-2">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Cách dùng</div>
        <ol className="mt-0.5 list-decimal space-y-0.5 pl-4 text-xs text-slate-500">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>
      <div className="mt-3 space-y-3">{children}</div>
      <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-indigo-600">📖 {book}</p>
    </div>
  );
}

const inputCls =
  "w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none";

function Field({ label, value, onChange, area }: { label: string; value: string; onChange: (v: string) => void; area?: boolean }) {
  return (
    <>
      <label className="block text-xs text-slate-500">{label}</label>
      {area ? (
        <textarea className={inputCls} rows={2} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </>
  );
}

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
 * Section render theo đúng `sections` của curriculum.ts (nguồn cấu trúc duy nhất).
 * Mỗi công cụ có ghi chú + hướng dẫn + trỏ mục sách (rule in-app-guidance).
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

  const toolsBySection: Record<string, React.ReactNode> = {
    "interest-rates": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Interest Rate Builder"
          note="Lãi suất yêu cầu = real risk-free rate cộng các phần bù rủi ro. Thực tế: trái phiếu rủi ro cao hơn hoặc kỳ hạn dài hơn đòi lãi suất cao hơn."
          steps={[
            "Nhập real risk-free rate ở dạng thập phân (0.005 = 0.5%).",
            "Nhập từng phần bù: inflation, default, liquidity, maturity.",
            "Đọc 'Required interest rate' = tổng tất cả thành phần.",
          ]}
          book="L1V1 · LM1 · Interest Rates and Time Value of Money → Determinants of Interest Rates"
        >
          <Field label="Real risk-free rate" value={rrf} onChange={setRrf} />
          <Field label="Inflation premium" value={infl} onChange={setInfl} />
          <Field label="Default risk premium" value={def} onChange={setDef} />
          <Field label="Liquidity premium" value={liq} onChange={setLiq} />
          <Field label="Maturity premium" value={mat} onChange={setMat} />
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
        <Tool
          title="Holding Period Return"
          note="Lợi suất nắm giữ 1 kỳ, gồm lãi vốn (chênh giá) và thu nhập (cổ tức/lãi). Đây là viên gạch cơ bản của mọi đo lường lợi suất."
          steps={[
            "Nhập giá đầu kỳ P₀ và giá cuối kỳ P₁.",
            "Nhập thu nhập I₁ nhận trong kỳ (0 nếu không có).",
            "Kết quả HPR = (P₁ − P₀ + I₁) / P₀.",
          ]}
          book="L1V1 · LM1 · Rates of Return → Holding Period Return (Example 2)"
        >
          <Field label="Giá đầu (P₀)" value={p0} onChange={setP0} />
          <Field label="Giá cuối (P₁)" value={p1} onChange={setP1} />
          <Field label="Thu nhập (I₁)" value={income} onChange={setIncome} />
          <Row label="HPR" value={pct(holdingPeriodReturn(+p0, +p1, +income))} />
        </Tool>

        <Tool
          title="Mean Returns (Arithmetic / Geometric)"
          note="Arithmetic mean ước tính lợi suất 1 kỳ điển hình; geometric mean phản ánh tăng trưởng kép thực tế nhiều kỳ (luôn ≤ arithmetic). Linked HPR là tổng lợi suất cả giai đoạn."
          steps={[
            "Nhập chuỗi return theo kỳ, cách nhau bởi dấu phẩy (vd 0.15, -0.05).",
            "Số dương = lãi, số âm = lỗ.",
            "So sánh arithmetic vs geometric để thấy ảnh hưởng của biến động.",
          ]}
          book="L1V1 · LM1 · Rates of Return → Arithmetic / Geometric Mean Return (Examples 4, 5, 8)"
        >
          <Field label="Chuỗi return (vd 0.15, -0.05, …)" value={series} onChange={setSeries} area />
          <Row label="Arithmetic mean" value={ret.length ? pct(arithmeticMean(ret)) : "—"} />
          <Row label="Geometric mean" value={safe(() => geometricMean(ret)) !== null ? pct(geometricMean(ret)) : "—"} />
          <Row label="Linked HPR (cả kỳ)" value={ret.length ? pct(linkReturns(ret)) : "—"} />
        </Tool>

        <Tool
          title="Harmonic Mean (cost averaging)"
          note="Giá mua trung bình thực tế khi đầu tư một số tiền cố định mỗi kỳ. Harmonic mean < arithmetic vì giảm ảnh hưởng của các mức giá cao."
          steps={[
            "Nhập giá mua ở mỗi kỳ, cách nhau bởi dấu phẩy (vd 10, 15).",
            "Đọc 'Harmonic mean' = giá trung bình thực trả mỗi đơn vị.",
            "So với arithmetic mean để thấy lợi ích của cost averaging.",
          ]}
          book="L1V1 · LM1 · Rates of Return → The Harmonic Mean (Examples 6, 7)"
        >
          <Field label="Giá mua các kỳ (vd 10, 15)" value={prices} onChange={setPrices} area />
          <Row label="Harmonic mean" value={safe(() => harmonicMean(priceArr)) !== null ? num(harmonicMean(priceArr)) : "—"} />
          <Row label="Arithmetic mean (so sánh)" value={priceArr.length ? num(arithmeticMean(priceArr)) : "—"} />
        </Tool>
      </div>
    ),
    "mwr-twr": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Money-Weighted Return (IRR)"
          note="Chính là IRR của dòng tiền nhà đầu tư; nhạy với thời điểm & quy mô nạp/rút tiền. Đo đúng cái nhà đầu tư thực sự kiếm được trên số tiền đã bỏ ra."
          steps={[
            "Liệt kê dòng tiền theo kỳ t = 0, 1, 2, … cách nhau bởi dấu phẩy.",
            "Tiền bỏ ra (mua/nạp) = số ÂM; tiền nhận (bán/rút/giá trị cuối) = số DƯƠNG.",
            "Kết quả MWR là IRR cho mỗi kỳ.",
          ]}
          book="L1V1 · LM1 · Money-Weighted and Time-Weighted Return (Examples 8, 10)"
        >
          <Field label="Dòng tiền t=0,1,2,… (âm = chi ra)" value={cfs} onChange={setCfs} area />
          <Row label="MWR (IRR)" value={safe(() => moneyWeightedReturn(cfArr)) !== null ? pct(moneyWeightedReturn(cfArr)) : "—"} />
        </Tool>

        <Tool
          title="Time-Weighted Return"
          note="Loại bỏ ảnh hưởng của nạp/rút tiền — chuẩn để đánh giá nhà quản lý quỹ. Tính bằng cách liên kết HPR của từng kỳ con."
          steps={[
            "Chia giai đoạn thành các kỳ con tại mỗi lần nạp/rút, tính HPR mỗi kỳ con.",
            "Nhập các HPR đó, cách nhau bởi dấu phẩy (vd 0.20, 0.05).",
            "Kết quả = tích (1 + HPR) − 1 cho cả giai đoạn.",
          ]}
          book="L1V1 · LM1 · Money-Weighted and Time-Weighted Return → Time-Weighted Returns (Example 9)"
        >
          <Field label="HPR từng kỳ con (vd 0.20, 0.05, …)" value={subHpr} onChange={setSubHpr} area />
          <Row label="TWR (linked)" value={subArr.length ? pct(timeWeightedReturn(subArr)) : "—"} />
        </Tool>
      </div>
    ),
    annualized: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Annualize theo số kỳ/năm"
          note="Quy lợi suất một kỳ về lợi suất năm để so sánh. Giả định tái đầu tư cùng mức — cẩn thận khi suy ra từ kỳ rất ngắn (dễ phóng đại)."
          steps={[
            "Nhập return của kỳ.",
            "Nhập số kỳ trong năm: 4 = quý, 12 = tháng, 52 = tuần; 18 tháng → 2/3 ≈ 0.6667.",
            "Kết quả = (1 + R)^(số kỳ) − 1.",
          ]}
          book="L1V1 · LM1 · Annualized Return → Annualizing Returns (Examples 12, 13)"
        >
          <Field label="Return của kỳ" value={periodRet} onChange={setPeriodRet} />
          <Field label="Số kỳ trong năm (vd 4, 52, 0.6667)" value={periodsPerYear} onChange={setPeriodsPerYear} />
          <Row label="Annualized" value={pct(annualize(+periodRet, +periodsPerYear))} />
        </Tool>

        <Tool
          title="Annualize theo số ngày"
          note="Quy lợi suất theo số ngày nắm giữ về lợi suất năm (cơ sở 365 ngày)."
          steps={["Nhập return của giai đoạn.", "Nhập số ngày nắm giữ.", "Kết quả = (1 + R)^(365/ngày) − 1."]}
          book="L1V1 · LM1 · Annualized Return → Annualizing Returns"
        >
          <Field label="Return của giai đoạn" value={dayRet} onChange={setDayRet} />
          <Field label="Số ngày" value={days} onChange={setDays} />
          <Row label="Annualized" value={pct(annualizeFromDays(+dayRet, +days))} />
        </Tool>

        <Tool
          title="Continuously Compounded Return"
          note="Lợi suất ghép liên tục = ln(1 + HPR); cộng dồn được qua thời gian nên hay dùng trong định giá (vd Black–Scholes). Luôn nhỏ hơn HPR tương ứng."
          steps={["Nhập HPR của kỳ.", "Kết quả = ln(1 + HPR)."]}
          book="L1V1 · LM1 · Annualized Return → Continuously Compounded Returns"
        >
          <Field label="HPR" value={ccHpr} onChange={setCcHpr} />
          <Row label="Continuously compounded" value={pct(continuouslyCompounded(+ccHpr))} />
        </Tool>
      </div>
    ),
    "other-measures": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Real Return"
          note="Lợi suất sau khi loại lạm phát — phản ánh sức mua thực tăng thêm. Quan trọng khi so sánh qua các thời kỳ/quốc gia có lạm phát khác nhau."
          steps={["Nhập nominal return.", "Nhập tỷ lệ lạm phát.", "Kết quả = (1 + nominal)/(1 + inflation) − 1."]}
          book="L1V1 · LM1 · Other Major Return Measures → Real Returns (Example 15)"
        >
          <Field label="Nominal return" value={nominal} onChange={setNominal} />
          <Field label="Inflation" value={inflation} onChange={setInflation} />
          <Row label="Real return" value={pct(realReturn(+nominal, +inflation))} />
        </Tool>

        <Tool
          title="After-Tax Nominal Return"
          note="Lợi suất danh nghĩa sau thuế — phần nhà đầu tư chịu thuế thực giữ lại. Lưu ý: thuế được tính trước khi điều chỉnh lạm phát."
          steps={["Nhập pre-tax return.", "Nhập thuế suất (0.20 = 20%).", "Kết quả = pretax × (1 − thuế)."]}
          book="L1V1 · LM1 · Other Major Return Measures → Pre-Tax and After-Tax Nominal Return (Example 14)"
        >
          <Field label="Pre-tax return" value={pretax} onChange={setPretax} />
          <Field label="Thuế suất" value={tax} onChange={setTax} />
          <Row label="After-tax" value={pct(afterTaxReturn(+pretax, +tax))} />
        </Tool>

        <Tool
          title="Leveraged Return"
          note="Lợi suất trên vốn chủ khi vay nợ để khuếch đại vị thế. Nếu return danh mục > lãi vay thì đòn bẩy làm tăng lợi suất; ngược lại sẽ giảm."
          steps={[
            "Nhập return danh mục Rp và lãi vay rD.",
            "Nhập nợ VB và vốn chủ VE (cùng đơn vị tiền).",
            "Kết quả = Rp + (VB/VE)(Rp − rD).",
          ]}
          book="L1V1 · LM1 · Other Major Return Measures → Leveraged Return"
        >
          <Field label="Return danh mục (Rp)" value={rp} onChange={setRp} />
          <Field label="Lãi vay (rD)" value={rd} onChange={setRd} />
          <Field label="Nợ (VB)" value={debt} onChange={setDebt} />
          <Field label="Vốn chủ (VE)" value={equity} onChange={setEquity} />
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
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        💡 Các ô đã điền sẵn số liệu lấy từ ví dụ trong sách (LM1) để bạn đối chiếu kết quả với đáp án. Nhập số ở dạng thập phân (0.15 = 15%).
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

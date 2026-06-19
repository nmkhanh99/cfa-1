import { useState } from "react";
import {
  presentValueSingle,
  presentValueCouponBond,
  presentValueConstantDividend,
  annuityPayment,
  gordonGrowthValue,
  twoStageDDM,
  impliedReturnSingle,
  impliedReturnEquity,
  impliedGrowthEquity,
  presentValueCashFlows,
  impliedForwardRate,
  forwardFxContinuous,
  binomialCall,
  binomialPut,
} from "../lib/quant/tvm";
import { pct, num } from "../lib/format";
import type { Section } from "../data/curriculum";
import { Tool, Field, Row, SectionHeader, parseNums, safe } from "../components/ToolKit";

/**
 * Công cụ LM2 — The Time Value of Money in Finance.
 * Section render theo đúng `sections` của curriculum.ts (nguồn cấu trúc duy nhất);
 * mỗi công cụ có ghi chú + hướng dẫn + trỏ mục sách (rule in-app-guidance).
 */
export default function ValuationWorkbench({ sections }: { sections: Section[] }) {
  // Discount bond
  const [dbFv, setDbFv] = useState("100");
  const [dbR, setDbR] = useState("0.067");
  const [dbT, setDbT] = useState("20");
  // Coupon bond
  const [cpn, setCpn] = useState("2");
  const [cpR, setCpR] = useState("0.02");
  const [cpN, setCpN] = useState("7");
  const [cpFv, setCpFv] = useState("100");
  // Perpetuity / constant dividend
  const [div, setDiv] = useState("1.5");
  const [divR, setDivR] = useState("0.15");
  // Annuity
  const [anPv, setAnPv] = useState("800000");
  const [anR, setAnR] = useState("0.004375");
  const [anT, setAnT] = useState("360");
  // Gordon
  const [g0, setG0] = useState("1.5");
  const [gG, setGG] = useState("0.06");
  const [gR, setGR] = useState("0.15");
  // Two-stage
  const [tsD0, setTsD0] = useState("1.5");
  const [tsGs, setTsGs] = useState("0.06");
  const [tsN, setTsN] = useState("3");
  const [tsGl, setTsGl] = useState("0.02");
  const [tsR, setTsR] = useState("0.15");

  // Implied return — discount bond
  const [irPv, setIrPv] = useState("100.5");
  const [irFv, setIrFv] = useState("95.72");
  const [irT, setIrT] = useState("6");
  // Implied return/growth — equity
  const [eqD, setEqD] = useState("1.76");
  const [eqP, setEqP] = useState("63");
  const [eqG, setEqG] = useState("0.04");
  const [eqR, setEqR] = useState("0.07");

  // Cash flow additivity
  const [cfStream, setCfStream] = useState("-100, 45, 45, 45");
  const [cfR, setCfR] = useState("0.10");
  // Forward rate
  const [fR1, setFR1] = useState("0.025");
  const [fT1, setFT1] = useState("1");
  const [fR2, setFR2] = useState("0.035");
  const [fT2, setFT2] = useState("2");
  // Forward FX
  const [fxSpot, setFxSpot] = useState("134.40");
  const [fxRp, setFxRp] = useState("0.0005");
  const [fxRb, setFxRb] = useState("0.02");
  const [fxT, setFxT] = useState("0.5");
  // Binomial option
  const [s0, setS0] = useState("40");
  const [su, setSu] = useState("56");
  const [sd, setSd] = useState("32");
  const [strike, setStrike] = useState("50");
  const [optR, setOptR] = useState("0.05");

  const cfArr = parseNums(cfStream);

  const toolsBySection: Record<string, React.ReactNode> = {
    "tvm-fi-equity": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Discount Bond — Present Value"
          note="Giá hôm nay của trái phiếu chỉ trả gốc khi đáo hạn (zero-coupon). Lãi suất tăng → giá giảm (quan hệ nghịch)."
          steps={["Nhập mệnh giá FV, lãi suất r/kỳ, số kỳ t.", "Kết quả PV = FV / (1+r)^t."]}
          book="L1V1 · LM2 · Time Value of Money in Fixed Income and Equity (Example 1)"
        >
          <Field label="Mệnh giá (FV)" value={dbFv} onChange={setDbFv} />
          <Field label="Lãi suất r / kỳ" value={dbR} onChange={setDbR} />
          <Field label="Số kỳ (t)" value={dbT} onChange={setDbT} />
          <Row label="PV" value={num(presentValueSingle(+dbFv, +dbR, +dbT), 2)} />
        </Tool>

        <Tool
          title="Coupon Bond — Present Value"
          note="Giá trái phiếu trả lãi định kỳ + gốc khi đáo hạn. Khi coupon = YTM thì giá = mệnh giá."
          steps={["Nhập coupon mỗi kỳ, YTM r/kỳ, số kỳ N, mệnh giá FV.", "Kết quả = Σ coupon/(1+r)^i + FV/(1+r)^N."]}
          book="L1V1 · LM2 · Time Value of Money in Fixed Income and Equity (Example 2)"
        >
          <Field label="Coupon / kỳ" value={cpn} onChange={setCpn} />
          <Field label="YTM r / kỳ" value={cpR} onChange={setCpR} />
          <Field label="Số kỳ (N)" value={cpN} onChange={setCpN} />
          <Field label="Mệnh giá (FV)" value={cpFv} onChange={setCpFv} />
          <Row label="PV" value={num(presentValueCouponBond(+cpn, +cpR, +cpN, +cpFv), 3)} />
        </Tool>

        <Tool
          title="Perpetuity / Constant Dividend"
          note="Giá của dòng tiền cố định mãi mãi (trái phiếu vĩnh viễn hoặc cổ phiếu cổ tức không đổi): PMT / r."
          steps={["Nhập dòng tiền/cổ tức mỗi kỳ và lãi suất yêu cầu r.", "Kết quả = PMT / r."]}
          book="L1V1 · LM2 · Time Value of Money in Fixed Income and Equity (Example 6)"
        >
          <Field label="Cổ tức / dòng tiền (D)" value={div} onChange={setDiv} />
          <Field label="Lãi suất yêu cầu (r)" value={divR} onChange={setDivR} />
          <Row label="PV" value={safe(() => presentValueConstantDividend(+div, +divR)) !== null ? num(presentValueConstantDividend(+div, +divR), 2) : "—"} />
        </Tool>

        <Tool
          title="Annuity / Mortgage Payment"
          note="Khoản trả đều mỗi kỳ cho khoản vay trả góp (vd mortgage), gồm cả gốc và lãi."
          steps={["Nhập gốc vay PV, lãi suất r/kỳ, số kỳ t.", "Kết quả A = r·PV / (1 − (1+r)^−t)."]}
          book="L1V1 · LM2 · Time Value of Money in Fixed Income and Equity (Example 5)"
        >
          <Field label="Gốc vay (PV)" value={anPv} onChange={setAnPv} />
          <Field label="Lãi suất r / kỳ" value={anR} onChange={setAnR} />
          <Field label="Số kỳ (t)" value={anT} onChange={setAnT} />
          <Row label="Khoản trả đều (A)" value={num(annuityPayment(+anPv, +anR, +anT), 2)} />
        </Tool>

        <Tool
          title="Gordon Growth (Constant Growth DDM)"
          note="Định giá cổ phiếu khi cổ tức tăng đều mãi mãi: PV = D0(1+g)/(r−g). Cần r > g."
          steps={["Nhập cổ tức hiện tại D0, tốc độ tăng g, lãi suất yêu cầu r.", "Kết quả = D0(1+g)/(r−g)."]}
          book="L1V1 · LM2 · Time Value of Money in Fixed Income and Equity (Example 7)"
        >
          <Field label="Cổ tức hiện tại (D0)" value={g0} onChange={setG0} />
          <Field label="Tăng trưởng (g)" value={gG} onChange={setGG} />
          <Field label="Lãi suất yêu cầu (r)" value={gR} onChange={setGR} />
          <Row label="Giá cổ phiếu" value={safe(() => gordonGrowthValue(+g0, +gG, +gR)) !== null ? num(gordonGrowthValue(+g0, +gG, +gR), 2) : "— (cần r > g)"} />
        </Tool>

        <Tool
          title="Two-Stage Dividend Discount Model"
          note="Cổ tức tăng nhanh gs trong n kỳ đầu, rồi tăng chậm gl mãi mãi. Phù hợp công ty đang tăng trưởng nhanh sẽ chậm lại."
          steps={["Nhập D0, tăng trưởng ngắn hạn gs & số kỳ n, tăng trưởng dài hạn gl, lãi suất r.", "Kết quả = PV cổ tức kỳ đầu + terminal value."]}
          book="L1V1 · LM2 · Time Value of Money in Fixed Income and Equity (Example 7)"
        >
          <Field label="Cổ tức hiện tại (D0)" value={tsD0} onChange={setTsD0} />
          <Field label="Tăng trưởng ngắn hạn (gs)" value={tsGs} onChange={setTsGs} />
          <Field label="Số kỳ tăng nhanh (n)" value={tsN} onChange={setTsN} />
          <Field label="Tăng trưởng dài hạn (gl)" value={tsGl} onChange={setTsGl} />
          <Field label="Lãi suất yêu cầu (r)" value={tsR} onChange={setTsR} />
          <Row label="Giá cổ phiếu" value={safe(() => twoStageDDM(+tsD0, +tsGs, +tsN, +tsGl, +tsR)) !== null ? num(twoStageDDM(+tsD0, +tsGs, +tsN, +tsGl, +tsR), 2) : "— (cần r > gl)"} />
        </Tool>
      </div>
    ),
    "implied-return-growth": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Implied Return — Discount Bond"
          note="Khi biết giá (PV) và mệnh giá (FV), suy ra lợi suất ẩn (YTM) của trái phiếu chiết khấu."
          steps={["Nhập giá hiện tại PV, mệnh giá FV, số kỳ t.", "Kết quả r = (FV/PV)^(1/t) − 1."]}
          book="L1V1 · LM2 · Implied Return and Growth (Example 8)"
        >
          <Field label="Giá hiện tại (PV)" value={irPv} onChange={setIrPv} />
          <Field label="Mệnh giá (FV)" value={irFv} onChange={setIrFv} />
          <Field label="Số kỳ (t)" value={irT} onChange={setIrT} />
          <Row label="Implied return" value={safe(() => impliedReturnSingle(+irPv, +irFv, +irT)) !== null ? pct(impliedReturnSingle(+irPv, +irFv, +irT)) : "—"} />
        </Tool>

        <Tool
          title="Implied Return & Growth — Equity"
          note="Từ giá cổ phiếu và cổ tức kỳ tới: required return = dividend yield + g; ngược lại suy ra implied growth = r − dividend yield."
          steps={[
            "Nhập cổ tức kỳ tới D(1) và giá hiện tại.",
            "Nhập g để tính required return; hoặc nhập r để tính implied growth.",
          ]}
          book="L1V1 · LM2 · Implied Return and Growth (Example 10)"
        >
          <Field label="Cổ tức kỳ tới D(1)" value={eqD} onChange={setEqD} />
          <Field label="Giá hiện tại (PV)" value={eqP} onChange={setEqP} />
          <Field label="Tăng trưởng g (để tính r)" value={eqG} onChange={setEqG} />
          <Row label="Required return (r)" value={pct(impliedReturnEquity(+eqD, +eqP, +eqG))} />
          <Field label="Required return r (để tính g)" value={eqR} onChange={setEqR} />
          <Row label="Implied growth (g)" value={pct(impliedGrowthEquity(+eqD, +eqP, +eqR))} />
        </Tool>
      </div>
    ),
    "cash-flow-additivity": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Present Value of Cash Flow Stream"
          note="Cộng dồn PV của từng dòng tiền theo nguyên lý cash flow additivity. Dùng so sánh 2 chiến lược có dòng tiền khác nhau."
          steps={["Nhập dòng tiền theo kỳ t=0,1,2,… (âm = chi ra).", "Nhập discount rate r.", "Kết quả = Σ CF_t / (1+r)^t."]}
          book="L1V1 · LM2 · Cash Flow Additivity (Example 12)"
        >
          <Field label="Dòng tiền t=0,1,2,…" value={cfStream} onChange={setCfStream} area />
          <Field label="Discount rate (r)" value={cfR} onChange={setCfR} />
          <Row label="PV (NPV)" value={cfArr.length ? num(presentValueCashFlows(cfArr, +cfR), 2) : "—"} />
        </Tool>

        <Tool
          title="Implied Forward Rate"
          note="Lãi suất kỳ hạn hoà vốn suy từ hai lãi suất giao ngay khác kỳ hạn — đảm bảo không có arbitrage."
          steps={["Nhập (r1, t1) và (r2, t2) với t2 > t1.", "Kết quả = ((1+r2)^t2/(1+r1)^t1)^(1/(t2−t1)) − 1."]}
          book="L1V1 · LM2 · Cash Flow Additivity → Implied Forward Rates (Example 13)"
        >
          <Field label="r1 (lãi suất kỳ ngắn)" value={fR1} onChange={setFR1} />
          <Field label="t1 (số kỳ)" value={fT1} onChange={setFT1} />
          <Field label="r2 (lãi suất kỳ dài)" value={fR2} onChange={setFR2} />
          <Field label="t2 (số kỳ)" value={fT2} onChange={setFT2} />
          <Row label="Forward rate" value={safe(() => impliedForwardRate(+fR1, +fT1, +fR2, +fT2)) !== null ? pct(impliedForwardRate(+fR1, +fT1, +fR2, +fT2)) : "—"} />
        </Tool>

        <Tool
          title="Forward FX (No-Arbitrage)"
          note="Tỷ giá kỳ hạn không-chênh-lệch-giá (ghép lãi liên tục). Tỷ giá yết = giá đồng định giá / đồng cơ sở."
          steps={[
            "Nhập tỷ giá giao ngay (spot).",
            "Nhập lãi suất đồng định giá (rPrice) và đồng cơ sở (rBase), kỳ hạn t (năm).",
            "Kết quả = spot · e^((rPrice − rBase)·t).",
          ]}
          book="L1V1 · LM2 · Cash Flow Additivity → Forward Exchange Rates (Example 14)"
        >
          <Field label="Spot (price/base)" value={fxSpot} onChange={setFxSpot} />
          <Field label="rPrice (đồng định giá)" value={fxRp} onChange={setFxRp} />
          <Field label="rBase (đồng cơ sở)" value={fxRb} onChange={setFxRb} />
          <Field label="Kỳ hạn t (năm)" value={fxT} onChange={setFxT} />
          <Row label="Forward FX" value={num(forwardFxContinuous(+fxSpot, +fxRp, +fxRb, +fxT), 4)} />
        </Tool>

        <Tool
          title="One-Period Binomial Option"
          note="Định giá call/put bằng danh mục sao chép không rủi ro (cash flow additivity). Giá hôm nay = giá trị risk-neutral chiết khấu."
          steps={[
            "Nhập giá hiện tại S0, giá tăng Su, giá giảm Sd.",
            "Nhập giá thực hiện (strike) và lãi suất phi rủi ro r.",
            "Đọc giá call & put.",
          ]}
          book="L1V1 · LM2 · Cash Flow Additivity → Option Pricing (Examples 14, 15)"
        >
          <Field label="Giá hiện tại (S0)" value={s0} onChange={setS0} />
          <Field label="Giá tăng (Su)" value={su} onChange={setSu} />
          <Field label="Giá giảm (Sd)" value={sd} onChange={setSd} />
          <Field label="Strike (X)" value={strike} onChange={setStrike} />
          <Field label="Lãi suất phi rủi ro (r)" value={optR} onChange={setOptR} />
          <Row label="Call" value={safe(() => binomialCall(+s0, +su, +sd, +strike, +optR)) !== null ? num(binomialCall(+s0, +su, +sd, +strike, +optR), 2) : "—"} />
          <Row label="Put" value={safe(() => binomialPut(+s0, +su, +sd, +strike, +optR)) !== null ? num(binomialPut(+s0, +su, +sd, +strike, +optR), 2) : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Định giá & no-arbitrage — section & thứ tự lấy đúng từ mục lục sách (LM2).
      </p>
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        💡 Các ô đã điền sẵn số liệu từ ví dụ trong sách (LM2) để bạn đối chiếu kết quả. Lãi suất/tăng trưởng nhập ở dạng thập phân (0.15 = 15%).
      </p>
      {sections.map((s, i) => {
        const tools = toolsBySection[s.id];
        if (!tools) return null; // section lý thuyết (vd Introduction)
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

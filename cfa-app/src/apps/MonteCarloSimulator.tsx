import { useState } from "react";
import {
  lognormalMean,
  lognormalVariance,
  annualizedVolatilityFromPrices,
  annualizeVolatility,
  simulateTerminalPrices,
  bootstrapStatistic,
} from "../lib/quant/simulation";
import { mean, sampleStdDev } from "../lib/quant/stats";
import { num, pct } from "../lib/format";
import type { Section } from "../data/curriculum";
import { Tool, Field, Row, SectionHeader, parseNums, safe } from "../components/ToolKit";

function percentile(sorted: number[], p: number): number {
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.round(p * (sorted.length - 1))));
  return sorted[idx];
}

/**
 * Công cụ LM6 — Simulation Methods.
 * Section render theo đúng `sections` của curriculum.ts; mỗi công cụ có ghi chú + hướng dẫn + trỏ mục sách.
 */
export default function MonteCarloSimulator({ sections }: { sections: Section[] }) {
  // Lognormal & cc
  const [lnMu, setLnMu] = useState("0.07");
  const [lnSigma, setLnSigma] = useState("0.12");
  const [prices, setPrices] = useState("6950, 7000, 6850, 6600, 6350");
  const [ppy, setPpy] = useState("250");
  // Monte Carlo
  const [mcP0, setMcP0] = useState("100");
  const [mcMu, setMcMu] = useState("0.07");
  const [mcSigma, setMcSigma] = useState("0.12");
  const [mcSteps, setMcSteps] = useState("12");
  const [mcTrials, setMcTrials] = useState("5000");
  const [mcSeed, setMcSeed] = useState("7");
  // Bootstrap
  const [bsData, setBsData] = useState("4.5, 6.0, 1.5, -2.0, 0.0, 4.5, 3.5, 2.5, 5.5, 4.0");
  const [bsTrials, setBsTrials] = useState("2000");
  const [bsSeed, setBsSeed] = useState("9");

  const priceArr = parseNums(prices);
  const bsArr = parseNums(bsData);

  const mc = safe(() => {
    const steps = Math.max(1, Math.floor(+mcSteps));
    const trials = Math.max(1, Math.floor(+mcTrials));
    const terminal = simulateTerminalPrices(+mcP0, +mcMu / steps, +mcSigma / Math.sqrt(steps), steps, trials, +mcSeed);
    const sorted = [...terminal].sort((a, b) => a - b);
    const lossProb = terminal.filter((p) => p < +mcP0).length / terminal.length;
    return { meanPrice: mean(terminal), p5: percentile(sorted, 0.05), p95: percentile(sorted, 0.95), lossProb };
  });

  const bs = safe(() => {
    const trials = Math.max(1, Math.floor(+bsTrials));
    const means = bootstrapStatistic(bsArr, mean, trials, +bsSeed);
    return { bootMean: mean(means), stdError: sampleStdDev(means) };
  });

  const toolsBySection: Record<string, React.ReactNode> = {
    "lognormal-cc": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Lognormal Mean & Variance"
          note="Nếu lợi suất ghép liên tục theo phân phối chuẩn thì GIÁ tài sản theo phân phối lognormal (bị chặn dưới ở 0, lệch phải). Đây là nền tảng mô hình giá (vd Black–Scholes)."
          steps={[
            "Nhập μ và σ của phân phối chuẩn liên kết (của ln giá).",
            "Mean lognormal = exp(μ + 0.5σ²); Variance = exp(2μ+σ²)·(exp(σ²)−1).",
          ]}
          book="L1V1 · LM6 · Lognormal Distribution and Continuous Compounding"
        >
          <Field label="μ (normal liên kết)" value={lnMu} onChange={setLnMu} />
          <Field label="σ (normal liên kết)" value={lnSigma} onChange={setLnSigma} />
          <Row label="Lognormal mean" value={num(lognormalMean(+lnMu, +lnSigma), 6)} />
          <Row label="Lognormal variance" value={num(lognormalVariance(+lnMu, +lnSigma), 6)} />
        </Tool>

        <Tool
          title="Annualized Volatility từ giá"
          note="Volatility = độ lệch chuẩn của lợi suất ghép liên tục, năm hoá bằng √(số phiên/năm). Thực tế thường dùng 250 phiên giao dịch/năm."
          steps={[
            "Nhập chuỗi giá đóng cửa (theo phiên).",
            "Nhập số phiên/năm (mặc định 250).",
            "Kết quả = std(cc returns) · √(phiên/năm).",
          ]}
          book="L1V1 · LM6 · Continuously Compounded Rates of Return (Example 1)"
        >
          <Field label="Chuỗi giá" value={prices} onChange={setPrices} area />
          <Field label="Số phiên/năm" value={ppy} onChange={setPpy} />
          <Row label="Annualized volatility" value={safe(() => annualizedVolatilityFromPrices(priceArr, +ppy)) !== null ? pct(annualizedVolatilityFromPrices(priceArr, +ppy)) : "— (cần ≥ 2 mức giá > 0)"} />
          <Row label="(Kiểm tra) daily 0.01 → năm" value={pct(annualizeVolatility(0.01, +ppy))} />
        </Tool>
      </div>
    ),
    "monte-carlo": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Monte Carlo — Giá cuối kỳ"
          note="Mô phỏng hàng nghìn kịch bản giá để ước lượng phân phối kết quả (rủi ro & lợi suất) khi không có công thức đóng. Mỗi bước rút lợi suất ngẫu nhiên từ phân phối chuẩn."
          steps={[
            "Nhập giá đầu P0, lợi suất kỳ vọng năm μ, volatility năm σ.",
            "Nhập số bước/năm (vd 12 = theo tháng), số kịch bản, và seed (để tái lập).",
            "Đọc giá trung bình, khoảng 5%–95%, và xác suất lỗ (giá cuối < P0).",
          ]}
          book="L1V1 · LM6 · Monte Carlo Simulation"
        >
          <Field label="Giá đầu (P0)" value={mcP0} onChange={setMcP0} />
          <Field label="μ năm" value={mcMu} onChange={setMcMu} />
          <Field label="σ năm (volatility)" value={mcSigma} onChange={setMcSigma} />
          <Field label="Số bước/năm" value={mcSteps} onChange={setMcSteps} />
          <Field label="Số kịch bản" value={mcTrials} onChange={setMcTrials} />
          <Field label="Seed" value={mcSeed} onChange={setMcSeed} />
          <Row label="Giá cuối trung bình" value={mc ? num(mc.meanPrice, 2) : "—"} />
          <Row label="Khoảng 5%–95%" value={mc ? `${num(mc.p5, 2)} – ${num(mc.p95, 2)}` : "—"} />
          <Row label="P(lỗ: giá < P0)" value={mc ? pct(mc.lossProb) : "—"} />
        </Tool>
      </div>
    ),
    bootstrapping: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Bootstrap — Sai số chuẩn của trung bình"
          note="Coi mẫu quan sát như tổng thể, rút lại có hoàn lại nhiều lần để dựng phân phối mẫu của một thống kê (vd trung bình) mà không cần giả định phân phối."
          steps={[
            "Nhập chuỗi dữ liệu quan sát (vd lợi suất theo năm).",
            "Nhập số lần bootstrap và seed.",
            "Đọc trung bình bootstrap và standard error (độ lệch chuẩn của các trung bình).",
          ]}
          book="L1V1 · LM6 · Bootstrapping"
        >
          <Field label="Dữ liệu quan sát" value={bsData} onChange={setBsData} area />
          <Field label="Số lần bootstrap" value={bsTrials} onChange={setBsTrials} />
          <Field label="Seed" value={bsSeed} onChange={setBsSeed} />
          <Row label="Bootstrap mean" value={bs ? num(bs.bootMean, 4) : "—"} />
          <Row label="Standard error (của mean)" value={bs ? num(bs.stdError, 4) : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Mô phỏng & lognormal — section & thứ tự lấy đúng từ mục lục sách (LM6).
      </p>
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        💡 Ô giá điền sẵn dữ liệu Astra (Example 1, annualized vol ≈ 33.6%). Mô phỏng dùng seed nên kết quả tái lập được — đổi seed để xem kịch bản khác.
      </p>
      {sections.map((s, i) => {
        const tools = toolsBySection[s.id];
        if (!tools) return null;
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

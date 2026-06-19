import { useState } from "react";
import {
  standardError,
  samplingVarianceOfMean,
  requiredSampleSizeForSE,
  samplingDistributionOfMean,
} from "../lib/quant/inference";
import { bootstrapStatistic } from "../lib/quant/simulation";
import { mean, sampleStdDev } from "../lib/quant/stats";
import { num } from "../lib/format";
import type { Section } from "../data/curriculum";
import { Tool, Field, Row, SectionHeader, parseNums, safe } from "../components/ToolKit";

/**
 * Công cụ LM7 — Estimation and Inference.
 * Section render theo đúng `sections` của curriculum.ts; mỗi công cụ có ghi chú + hướng dẫn + trỏ mục sách.
 */
export default function SamplingStudio({ sections }: { sections: Section[] }) {
  // Standard error
  const [seSd, setSeSd] = useState("6");
  const [seN, setSeN] = useState("36");
  // Required sample size
  const [ssSigma, setSsSigma] = useState("6");
  const [ssTarget, setSsTarget] = useState("1");
  // CLT simulator
  const [pop, setPop] = useState("-10, -5, -2, 0, 1, 3, 4, 7, 9, 12");
  const [cltN, setCltN] = useState("30");
  const [cltSamples, setCltSamples] = useState("3000");
  const [cltSeed, setCltSeed] = useState("123");
  // Bootstrap empirical SE
  const [bsData, setBsData] = useState("4.5, 6.0, 1.5, -2.0, 0.0, 4.5, 3.5, 2.5, 5.5, 4.0");
  const [bsTrials, setBsTrials] = useState("2000");
  const [bsSeed, setBsSeed] = useState("9");

  const popArr = parseNums(pop);
  const bsArr = parseNums(bsData);

  const clt = safe(() => {
    const n = Math.max(1, Math.floor(+cltN));
    const means = samplingDistributionOfMean(popArr, n, Math.max(1, Math.floor(+cltSamples)), +cltSeed);
    const popMean = mean(popArr);
    const popStd = Math.sqrt(mean(popArr.map((x) => (x - popMean) ** 2)));
    return { meanOfMeans: mean(means), stdOfMeans: sampleStdDev(means), analytic: popStd / Math.sqrt(n), popMean };
  });

  const bs = safe(() => {
    const means = bootstrapStatistic(bsArr, mean, Math.max(1, Math.floor(+bsTrials)), +bsSeed);
    return { bootSE: sampleStdDev(means), analyticSE: sampleStdDev(bsArr) / Math.sqrt(bsArr.length) };
  });

  const toolsBySection: Record<string, React.ReactNode> = {
    "clt-inference": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Standard Error of the Sample Mean"
          note="Đo độ chính xác của ước lượng trung bình từ mẫu: SE = sd/√n. Mẫu càng lớn → ước lượng càng chính xác (SE càng nhỏ). Khác với độ lệch chuẩn (đo phân tán dữ liệu)."
          steps={[
            "Nhập độ lệch chuẩn (σ nếu biết, hoặc s mẫu) và cỡ mẫu n.",
            "SE = sd/√n; variance của trung bình mẫu = σ²/n.",
          ]}
          book="L1V1 · LM7 · Central Limit Theorem and Inference → Standard Error of the Sample Mean"
        >
          <Field label="Độ lệch chuẩn (σ hoặc s)" value={seSd} onChange={setSeSd} />
          <Field label="Cỡ mẫu (n)" value={seN} onChange={setSeN} />
          <Row label="Standard error" value={safe(() => standardError(+seSd, +seN)) !== null ? num(standardError(+seSd, +seN), 6) : "—"} />
          <Row label="Variance của trung bình mẫu" value={safe(() => samplingVarianceOfMean(+seSd, +seN)) !== null ? num(samplingVarianceOfMean(+seSd, +seN), 6) : "—"} />
        </Tool>

        <Tool
          title="Required Sample Size"
          note="Tìm cỡ mẫu tối thiểu để đạt độ chính xác mong muốn: n = (σ/SE_mục_tiêu)². Vd Biggs: σ=6%, muốn SE=1% → cần n=36."
          steps={["Nhập σ (độ lệch chuẩn tổng thể).", "Nhập standard error mục tiêu.", "Kết quả n làm tròn lên."]}
          book="L1V1 · LM7 · Central Limit Theorem and Inference (Question Set — Biggs)"
        >
          <Field label="σ tổng thể" value={ssSigma} onChange={setSsSigma} />
          <Field label="Standard error mục tiêu" value={ssTarget} onChange={setSsTarget} />
          <Row label="Cỡ mẫu cần (n)" value={safe(() => requiredSampleSizeForSE(+ssSigma, +ssTarget)) !== null ? String(requiredSampleSizeForSE(+ssSigma, +ssTarget)) : "—"} />
        </Tool>

        <Tool
          title="CLT Simulator"
          note="Minh hoạ Định lý giới hạn trung tâm: rút nhiều mẫu cỡ n từ một tổng thể (bất kỳ hình dạng), trung bình mẫu sẽ ~ chuẩn, tâm ở μ tổng thể, độ phân tán ≈ σ/√n."
          steps={[
            "Nhập tổng thể quan sát, cỡ mẫu n, số lần lấy mẫu, seed.",
            "So 'Std của trung bình mẫu' (mô phỏng) với 'σ/√n' (lý thuyết) — chúng khớp nhau.",
            "Tăng n → std của trung bình mẫu giảm.",
          ]}
          book="L1V1 · LM7 · Central Limit Theorem and Inference → The Central Limit Theorem"
        >
          <Field label="Tổng thể" value={pop} onChange={setPop} area />
          <Field label="Cỡ mẫu (n)" value={cltN} onChange={setCltN} />
          <Field label="Số lần lấy mẫu" value={cltSamples} onChange={setCltSamples} />
          <Field label="Seed" value={cltSeed} onChange={setCltSeed} />
          <Row label="μ tổng thể / TB của các TB mẫu" value={clt ? `${num(clt.popMean, 3)} / ${num(clt.meanOfMeans, 3)}` : "—"} />
          <Row label="Std của TB mẫu (mô phỏng)" value={clt ? num(clt.stdOfMeans, 4) : "—"} />
          <Row label="σ/√n (lý thuyết)" value={clt ? num(clt.analytic, 4) : "—"} />
        </Tool>
      </div>
    ),
    bootstrapping: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Empirical Standard Error via Bootstrap"
          note="Ước lượng standard error bằng mô phỏng (rút lại có hoàn lại) thay vì công thức — hữu ích khi không có công thức giải tích. So sánh với s/√n để thấy chúng tương đương."
          steps={[
            "Nhập chuỗi dữ liệu quan sát.",
            "Nhập số lần bootstrap và seed.",
            "So 'Bootstrap SE' (mô phỏng) với 's/√n' (giải tích).",
          ]}
          book="L1V1 · LM7 · Bootstrapping and Empirical Sampling Distributions"
        >
          <Field label="Dữ liệu quan sát" value={bsData} onChange={setBsData} area />
          <Field label="Số lần bootstrap" value={bsTrials} onChange={setBsTrials} />
          <Field label="Seed" value={bsSeed} onChange={setBsSeed} />
          <Row label="Bootstrap SE (mô phỏng)" value={bs ? num(bs.bootSE, 4) : "—"} />
          <Row label="s/√n (giải tích)" value={bs ? num(bs.analyticSE, 4) : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Lấy mẫu, CLT & sai số chuẩn — section & thứ tự lấy đúng từ mục lục sách (LM7).
      </p>
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        💡 Ô điền sẵn ví dụ Biggs (σ=6%, SE=1% → n=36). Mô phỏng dùng seed nên tái lập được. (Mục "Sampling Methods" là lý thuyết — xem trong sách.)
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

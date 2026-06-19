import { useState } from "react";
import {
  expectedValue,
  variance,
  standardDeviation,
  bayesUnconditional,
  bayesPosteriors,
} from "../lib/quant/probability";
import { num, pct } from "../lib/format";
import type { Section } from "../data/curriculum";
import { Tool, Field, Row, SectionHeader, parseNums, safe } from "../components/ToolKit";

/**
 * Công cụ LM4 — Probability Trees and Conditional Expectations.
 * Section render theo đúng `sections` của curriculum.ts; mỗi công cụ có ghi chú + hướng dẫn + trỏ mục sách.
 */
export default function DecisionTree({ sections }: { sections: Section[] }) {
  // Expected value & variance
  const [outcomes, setOutcomes] = useState("2.60, 2.45, 2.20, 2.00");
  const [probs, setProbs] = useState("0.15, 0.45, 0.24, 0.16");
  // Total probability rule for expected value
  const [condEv, setCondEv] = useState("2.4875, 2.12");
  const [scenProbs, setScenProbs] = useState("0.60, 0.40");
  // Bayes
  const [priors, setPriors] = useState("0.45, 0.30, 0.25");
  const [likelihoods, setLikelihoods] = useState("0.75, 0.20, 0.05");

  const o = parseNums(outcomes);
  const p = parseNums(probs);
  const ce = parseNums(condEv);
  const sp = parseNums(scenProbs);
  const pr = parseNums(priors);
  const lk = parseNums(likelihoods);
  const posteriors = safe(() => bayesPosteriors(pr, lk));

  const toolsBySection: Record<string, React.ReactNode> = {
    "ev-variance": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Expected Value, Variance & Std"
          note="E(X) là bình quân các kết quả theo trọng số xác suất — chính là dự báo (vd EPS kỳ vọng). Variance/std đo rủi ro quanh dự báo đó."
          steps={[
            "Nhập các kết quả (outcomes) cách nhau bởi dấu phẩy.",
            "Nhập xác suất tương ứng (tổng phải = 1), cùng thứ tự.",
            "Đọc E(X), variance, std.",
          ]}
          book="L1V1 · LM4 · Expected Value and Variance (Example 1)"
        >
          <Field label="Outcomes (Xi)" value={outcomes} onChange={setOutcomes} area />
          <Field label="Probabilities P(Xi)" value={probs} onChange={setProbs} area />
          <Row label="Σ xác suất" value={p.length ? num(p.reduce((a, b) => a + b, 0), 4) : "—"} />
          <Row label="Expected value E(X)" value={safe(() => expectedValue(o, p)) !== null ? num(expectedValue(o, p), 4) : "— (tổng xác suất phải = 1)"} />
          <Row label="Variance" value={safe(() => variance(o, p)) !== null ? num(variance(o, p), 6) : "—"} />
          <Row label="Std deviation" value={safe(() => standardDeviation(o, p)) !== null ? num(standardDeviation(o, p), 6) : "—"} />
        </Tool>
      </div>
    ),
    "prob-trees": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Total Probability — Expected Value"
          note="Ghép kỳ vọng theo từng kịch bản (vd lãi suất giảm/ổn định) thành kỳ vọng tổng: E(X)=Σ E(X|Si)·P(Si). Đây là cách 'đi ngược' cây xác suất về hôm nay."
          steps={[
            "Nhập kỳ vọng có điều kiện E(X|Si) cho từng kịch bản.",
            "Nhập xác suất từng kịch bản P(Si) (tổng = 1), cùng thứ tự.",
            "Kết quả = Σ E(X|Si)·P(Si).",
          ]}
          book="L1V1 · LM4 · Probability Trees and Conditional Expectations (Example 2)"
        >
          <Field label="E(X | Si) từng kịch bản" value={condEv} onChange={setCondEv} area />
          <Field label="P(Si) từng kịch bản" value={scenProbs} onChange={setScenProbs} area />
          <Row label="E(X) tổng" value={safe(() => expectedValue(ce, sp)) !== null ? num(expectedValue(ce, sp), 4) : "— (tổng xác suất phải = 1)"} />
        </Tool>
      </div>
    ),
    bayes: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Bayes' Updater"
          note="Cập nhật niềm tin khi có thông tin mới: posterior = likelihood·prior / P(thông tin). Vd: thấy công ty mở rộng nhà máy → tăng xác suất EPS vượt kỳ vọng."
          steps={[
            "Nhập prior (xác suất ban đầu của từng sự kiện, tổng = 1).",
            "Nhập likelihood P(thông tin | sự kiện) cho từng sự kiện, cùng thứ tự.",
            "Đọc P(thông tin) và posterior (xác suất cập nhật) cho từng sự kiện.",
          ]}
          book="L1V1 · LM4 · Bayes' Formula and Updating Probability Estimates (Example 4)"
        >
          <Field label="Prior P(event)" value={priors} onChange={setPriors} area />
          <Field label="Likelihood P(info | event)" value={likelihoods} onChange={setLikelihoods} area />
          <Row label="P(thông tin)" value={safe(() => bayesUnconditional(pr, lk)) !== null ? num(bayesUnconditional(pr, lk), 4) : "— (prior phải tổng = 1)"} />
          <Row label="Posterior từng event" value={posteriors ? posteriors.map((x) => pct(x)).join(", ") : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Cây kịch bản & cập nhật Bayes — section & thứ tự lấy đúng từ mục lục sách (LM4).
      </p>
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        💡 Ô điền sẵn dữ liệu Example BankCorp & DriveMed (LM4) để bạn đối chiếu kết quả. Xác suất nhập dạng thập phân.
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

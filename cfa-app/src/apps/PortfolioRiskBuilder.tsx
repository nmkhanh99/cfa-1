import { useState } from "react";
import {
  portfolioExpectedReturn,
  covarianceFromCorrelation,
  correlationFromCovariance,
  twoAssetStdDev,
  covarianceFromJointProbability,
  safetyFirstRatio,
  shortfallProbability,
} from "../lib/quant/portfolio";
import { num, pct } from "../lib/format";
import type { Section } from "../data/curriculum";
import { Tool, Field, Row, SectionHeader, parseNums, safe } from "../components/ToolKit";

/**
 * Công cụ LM5 — Portfolio Mathematics.
 * Section render theo đúng `sections` của curriculum.ts; mỗi công cụ có ghi chú + hướng dẫn + trỏ mục sách.
 */
export default function PortfolioRiskBuilder({ sections }: { sections: Section[] }) {
  // Expected return
  const [weights, setWeights] = useState("0.50, 0.25, 0.25");
  const [rets, setRets] = useState("13, 6, 15");
  // Two-asset risk
  const [w1, setW1] = useState("0.40");
  const [sd1, setSd1] = useState("6");
  const [w2, setW2] = useState("0.60");
  const [sd2, setSd2] = useState("15");
  const [corr, setCorr] = useState("0.30");
  // Cov <-> Corr converter
  const [cvCorr, setCvCorr] = useState("0.24");
  const [cvSd1, setCvSd1] = useState("0.64");
  const [cvSd2, setCvSd2] = useState("0.56");
  // Joint probability covariance
  const [ra, setRa] = useState("25, 12, 10");
  const [rb, setRb] = useState("20, 16, 10");
  const [jp, setJp] = useState("0.20, 0.50, 0.30");
  // Safety-first
  const [sfE, setSfE] = useState("14");
  const [sfRL, setSfRL] = useState("2");
  const [sfSd, setSfSd] = useState("16");

  const w = parseNums(weights);
  const r = parseNums(rets);
  const raA = parseNums(ra);
  const rbA = parseNums(rb);
  const jpA = parseNums(jp);
  const sfr = safe(() => safetyFirstRatio(+sfE, +sfRL, +sfSd));

  const toolsBySection: Record<string, React.ReactNode> = {
    "return-variance": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Portfolio Expected Return"
          note="Bình quân lợi suất kỳ vọng theo trọng số tỷ trọng vốn: E(Rp)=Σ wi·E(Ri)."
          steps={[
            "Nhập trọng số (weights) cách nhau bởi dấu phẩy (tổng nên = 1).",
            "Nhập lợi suất kỳ vọng từng tài sản, cùng thứ tự.",
            "Đọc E(Rp).",
          ]}
          book="L1V1 · LM5 · Portfolio Expected Return and Variance of Return (Exhibit 1)"
        >
          <Field label="Weights" value={weights} onChange={setWeights} area />
          <Field label="Expected returns (%)" value={rets} onChange={setRets} area />
          <Row label="Σ weights" value={w.length ? num(w.reduce((a, b) => a + b, 0), 4) : "—"} />
          <Row label="E(Rp)" value={safe(() => portfolioExpectedReturn(w, r)) !== null ? num(portfolioExpectedReturn(w, r), 4) + "%" : "— (weights & returns cùng độ dài)"} />
        </Tool>

        <Tool
          title="Two-Asset Portfolio Risk"
          note="Rủi ro danh mục 2 tài sản phụ thuộc tỷ trọng, độ lệch chuẩn từng tài sản, và tương quan. Tương quan càng thấp → đa dạng hoá càng giảm rủi ro."
          steps={[
            "Nhập trọng số & độ lệch chuẩn (cùng đơn vị %) của 2 tài sản.",
            "Nhập tương quan ρ giữa 2 tài sản.",
            "Đọc covariance và độ lệch chuẩn danh mục.",
          ]}
          book="L1V1 · LM5 · Portfolio Expected Return and Variance of Return (Example 1)"
        >
          <Field label="w1" value={w1} onChange={setW1} />
          <Field label="σ1 (%)" value={sd1} onChange={setSd1} />
          <Field label="w2" value={w2} onChange={setW2} />
          <Field label="σ2 (%)" value={sd2} onChange={setSd2} />
          <Field label="Correlation ρ" value={corr} onChange={setCorr} />
          <Row label="Covariance" value={num(covarianceFromCorrelation(+corr, +sd1, +sd2), 4)} />
          <Row label="Portfolio σ" value={num(twoAssetStdDev(+w1, +sd1, +w2, +sd2, +corr), 4) + "%"} />
        </Tool>

        <Tool
          title="Covariance ↔ Correlation"
          note="Chuyển đổi qua lại: Cov = ρ·σ1·σ2; ρ = Cov/(σ1·σ2). Correlation chuẩn hoá covariance về [−1, 1]."
          steps={["Nhập ρ, σ1, σ2 để ra covariance.", "(Hoặc dùng covariance + σ để suy ngược ρ.)"]}
          book="L1V1 · LM5 · Portfolio Expected Return and Variance of Return → Correlation"
        >
          <Field label="Correlation ρ" value={cvCorr} onChange={setCvCorr} />
          <Field label="σ1" value={cvSd1} onChange={setCvSd1} />
          <Field label="σ2" value={cvSd2} onChange={setCvSd2} />
          <Row label="Covariance" value={num(covarianceFromCorrelation(+cvCorr, +cvSd1, +cvSd2), 4)} />
          <Row label="Correlation (ngược lại từ Cov)" value={safe(() => correlationFromCovariance(covarianceFromCorrelation(+cvCorr, +cvSd1, +cvSd2), +cvSd1, +cvSd2)) !== null ? num(correlationFromCovariance(covarianceFromCorrelation(+cvCorr, +cvSd1, +cvSd2), +cvSd1, +cvSd2), 4) : "—"} />
        </Tool>
      </div>
    ),
    "joint-probability": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Covariance from Joint Probability"
          note="Ước lượng covariance khi biết hàm xác suất đồng thời của lợi suất 2 tài sản theo các kịch bản (vd điều kiện ngành tốt/trung bình/xấu)."
          steps={[
            "Nhập lợi suất tài sản A và B cho từng kịch bản (cùng thứ tự).",
            "Nhập xác suất đồng thời của từng kịch bản (tổng = 1).",
            "Kết quả = Σ P·(RA−E[RA])·(RB−E[RB]).",
          ]}
          book="L1V1 · LM5 · Forecasting Correlation of Returns: Covariance Given a Joint Probability Function"
        >
          <Field label="RA từng kịch bản (%)" value={ra} onChange={setRa} area />
          <Field label="RB từng kịch bản (%)" value={rb} onChange={setRb} area />
          <Field label="Xác suất đồng thời" value={jp} onChange={setJp} area />
          <Row label="Covariance(RA, RB)" value={safe(() => covarianceFromJointProbability(raA, rbA, jpA)) !== null ? num(covarianceFromJointProbability(raA, rbA, jpA), 4) : "— (cùng độ dài, tổng xác suất = 1)"} />
        </Tool>
      </div>
    ),
    "risk-measures": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Safety-First (Roy's Criterion)"
          note="Đo rủi ro sụt giảm: SFRatio = (E(Rp) − RL)/σp. Danh mục có SFRatio cao nhất là tối ưu; xác suất return < RL = N(−SFRatio). (RL = lãi suất phi rủi ro → SFRatio = Sharpe ratio.)"
          steps={[
            "Nhập lợi suất kỳ vọng E(Rp), ngưỡng tối thiểu RL, độ lệch chuẩn σp (cùng đơn vị %).",
            "Đọc SFRatio và xác suất shortfall (return rơi dưới RL).",
            "So nhiều danh mục → chọn SFRatio cao nhất.",
          ]}
          book="L1V1 · LM5 · Portfolio Risk Measures: Applications of the Normal Distribution"
        >
          <Field label="E(Rp) (%)" value={sfE} onChange={setSfE} />
          <Field label="Ngưỡng RL (%)" value={sfRL} onChange={setSfRL} />
          <Field label="σp (%)" value={sfSd} onChange={setSfSd} />
          <Row label="Safety-first ratio" value={sfr !== null ? num(sfr, 4) : "—"} />
          <Row label="P(return < RL)" value={sfr !== null ? pct(shortfallProbability(sfr)) : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Lợi suất, rủi ro & đa dạng hoá danh mục — section & thứ tự lấy đúng từ mục lục sách (LM5).
      </p>
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        💡 Ô điền sẵn dữ liệu Example LM5 (danh mục 3 tài sản, BankCorp/NewBank, safety-first) để đối chiếu. Nhập % ở dạng số (vd 13 = 13%).
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

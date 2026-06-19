import { useState } from "react";
import {
  tStatSingleMean,
  chiSquareSingleVariance,
  pooledVariance,
  tStatTwoSamplePooled,
  tStatPairedMean,
  fStatTwoVariances,
  twoTailedDecision,
  twoTailedPValueNormal,
} from "../lib/quant/hypothesis";
import { num, pct } from "../lib/format";
import type { Section } from "../data/curriculum";
import { Tool, Field, Row, SectionHeader, safe } from "../components/ToolKit";

/**
 * Công cụ LM8 — Hypothesis Testing for Finance.
 * Section render theo đúng `sections` của curriculum.ts; mỗi công cụ có ghi chú + hướng dẫn + trỏ mục sách.
 */
export default function HypothesisTestRunner({ sections }: { sections: Section[] }) {
  // Decision & p-value
  const [stat, setStat] = useState("2.05");
  const [crit, setCrit] = useState("1.984");
  const [alpha, setAlpha] = useState("0.05");
  // Single mean t
  const [xbar, setXbar] = useState("1.5");
  const [mu0, setMu0] = useState("1.1");
  const [smS, setSmS] = useState("3.6");
  const [smN, setSmN] = useState("24");
  // Single variance chi-square
  const [svVar, setSvVar] = useState("12.96");
  const [svHyp, setSvHyp] = useState("16");
  const [svN, setSvN] = useState("24");
  // Two-sample pooled t
  const [x1, setX1] = useState("0.01775");
  const [v1, setV1] = useState("0.09973");
  const [n1, setN1] = useState("445");
  const [x2, setX2] = useState("0.01134");
  const [v2, setV2] = useState("0.15023");
  const [n2, setN2] = useState("859");
  // Paired t
  const [dbar, setDbar] = useState("-0.0021");
  const [mud0, setMud0] = useState("0");
  const [sdDiff, setSdDiff] = useState("0.3622");
  const [pN, setPN] = useState("1304");
  // F-test
  const [fV1, setFV1] = useState("4.644");
  const [fV2, setFV2] = useState("3.919");

  const toolsBySection: Record<string, React.ReactNode> = {
    "hypothesis-process": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Test Decision & p-value"
          note="Quyết định bác bỏ H0 theo 2 cách tương đương: (1) |test statistic| > giá trị tới hạn, hoặc (2) p-value < mức ý nghĩa α. p-value ở đây là xấp xỉ chuẩn (mẫu lớn) — mẫu nhỏ cần tra bảng t/χ²/F."
          steps={[
            "Nhập test statistic đã tính, giá trị tới hạn (giá trị tuyệt đối), và α.",
            "Đọc quyết định theo giá trị tới hạn và theo p-value.",
          ]}
          book="L1V1 · LM8 · Hypothesis Tests for Finance → The Process of Hypothesis Testing"
        >
          <Field label="Test statistic" value={stat} onChange={setStat} />
          <Field label="Giá trị tới hạn (|critical|)" value={crit} onChange={setCrit} />
          <Field label="Mức ý nghĩa α" value={alpha} onChange={setAlpha} />
          <Row label="Quyết định (critical value)" value={safe(() => twoTailedDecision(+stat, +crit)) ?? "—"} />
          <Row label="p-value (xấp xỉ chuẩn, 2 phía)" value={pct(twoTailedPValueNormal(+stat))} />
          <Row label="Quyết định (p-value vs α)" value={twoTailedPValueNormal(+stat) < +alpha ? "reject" : "fail to reject"} />
        </Tool>
      </div>
    ),
    "tests-return-risk": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Single-Mean t-test"
          note="Kiểm định trung bình tổng thể (phương sai chưa biết): t = (X̄ − μ0)/(s/√n), df = n−1. Vd Sendar Fund: lợi suất TB có khác mức kỳ vọng từ mô hình định giá?"
          steps={["Nhập trung bình mẫu X̄, giá trị giả định μ0, s mẫu, n.", "So |t| với giá trị tới hạn t (df = n−1)."]}
          book="L1V1 · LM8 · Tests of Return and Risk in Finance → Test of a Single Mean"
        >
          <Field label="Trung bình mẫu (X̄)" value={xbar} onChange={setXbar} />
          <Field label="Giả định (μ0)" value={mu0} onChange={setMu0} />
          <Field label="s mẫu" value={smS} onChange={setSmS} />
          <Field label="n" value={smN} onChange={setSmN} />
          <Row label="t-statistic" value={safe(() => tStatSingleMean(+xbar, +mu0, +smS, +smN)) !== null ? num(tStatSingleMean(+xbar, +mu0, +smS, +smN), 5) : "—"} />
          <Row label="df" value={String(Math.max(0, Math.floor(+smN) - 1))} />
        </Tool>

        <Tool
          title="Single-Variance χ²-test"
          note="Kiểm định phương sai tổng thể: χ² = (n−1)·s²/σ0², df = n−1. Vd: độ biến động quỹ có dưới mức ngưỡng không?"
          steps={["Nhập phương sai mẫu s², phương sai giả định σ0², n.", "So χ² với giá trị tới hạn χ² (df = n−1)."]}
          book="L1V1 · LM8 · Tests of Return and Risk in Finance → Test of a Single Variance"
        >
          <Field label="Phương sai mẫu (s²)" value={svVar} onChange={setSvVar} />
          <Field label="Phương sai giả định (σ0²)" value={svHyp} onChange={setSvHyp} />
          <Field label="n" value={svN} onChange={setSvN} />
          <Row label="χ²-statistic" value={safe(() => chiSquareSingleVariance(+svVar, +svHyp, +svN)) !== null ? num(chiSquareSingleVariance(+svVar, +svHyp, +svN), 5) : "—"} />
          <Row label="df" value={String(Math.max(0, Math.floor(+svN) - 1))} />
        </Tool>

        <Tool
          title="Two-Sample (Independent) t-test"
          note="So 2 trung bình từ 2 mẫu ĐỘC LẬP (phương sai bằng nhau, gộp): df = n1+n2−2. Vd: lợi suất chỉ số ở 2 giai đoạn có khác nhau?"
          steps={[
            "Nhập trung bình & phương sai & cỡ mẫu của 2 nhóm.",
            "Đọc pooled variance và t-statistic; so với t tới hạn.",
          ]}
          book="L1V1 · LM8 · Tests of Return and Risk in Finance → Differences between Means (Independent) — Example 1"
        >
          <Field label="X̄1" value={x1} onChange={setX1} />
          <Field label="s²1" value={v1} onChange={setV1} />
          <Field label="n1" value={n1} onChange={setN1} />
          <Field label="X̄2" value={x2} onChange={setX2} />
          <Field label="s²2" value={v2} onChange={setV2} />
          <Field label="n2" value={n2} onChange={setN2} />
          <Row label="Pooled variance" value={safe(() => pooledVariance(+v1, +n1, +v2, +n2)) !== null ? num(pooledVariance(+v1, +n1, +v2, +n2), 5) : "—"} />
          <Row label="t-statistic" value={safe(() => tStatTwoSamplePooled(+x1, +x2, +v1, +n1, +v2, +n2)) !== null ? num(tStatTwoSamplePooled(+x1, +x2, +v1, +n1, +v2, +n2), 5) : "—"} />
          <Row label="df" value={String(Math.max(0, Math.floor(+n1) + Math.floor(+n2) - 2))} />
        </Tool>

        <Tool
          title="Paired (Dependent) t-test"
          note="So 2 trung bình từ mẫu PHỤ THUỘC (cùng kỳ/công ty) qua chênh lệch từng cặp: t = (d̄ − μd0)/(sd/√n), df = n−1. Mạnh hơn test độc lập vì loại biến động chung."
          steps={["Nhập trung bình chênh lệch d̄, giả định μd0, độ lệch chuẩn của chênh lệch sd, n.", "So |t| với t tới hạn (df = n−1)."]}
          book="L1V1 · LM8 · Tests of Return and Risk in Finance → Dependent Samples — Example 2"
        >
          <Field label="Trung bình chênh lệch (d̄)" value={dbar} onChange={setDbar} />
          <Field label="Giả định (μd0)" value={mud0} onChange={setMud0} />
          <Field label="sd (của chênh lệch)" value={sdDiff} onChange={setSdDiff} />
          <Field label="n (số cặp)" value={pN} onChange={setPN} />
          <Row label="t-statistic" value={safe(() => tStatPairedMean(+dbar, +mud0, +sdDiff, +pN)) !== null ? num(tStatPairedMean(+dbar, +mud0, +sdDiff, +pN), 5) : "—"} />
          <Row label="df" value={String(Math.max(0, Math.floor(+pN) - 1))} />
        </Tool>

        <Tool
          title="F-test (Equality of Two Variances)"
          note="So độ biến động của 2 mẫu độc lập: F = s1²/s2², df = (n1−1, n2−1). Vd: phương sai lợi suất có đổi sau thay đổi quy định thị trường?"
          steps={["Nhập phương sai mẫu của 2 nhóm (đặt lớn hơn ở tử để F ≥ 1).", "So F với giá trị tới hạn F."]}
          book="L1V1 · LM8 · Tests of Return and Risk in Finance → Equality of Two Variances — Example 3"
        >
          <Field label="s²1 (tử)" value={fV1} onChange={setFV1} />
          <Field label="s²2 (mẫu)" value={fV2} onChange={setFV2} />
          <Row label="F-statistic" value={safe(() => fStatTwoVariances(+fV1, +fV2)) !== null ? num(fStatTwoVariances(+fV1, +fV2), 5) : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Kiểm định giả thuyết — section & thứ tự lấy đúng từ mục lục sách (LM8).
      </p>
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        💡 Ô điền sẵn dữ liệu Example LM8 (Sendar, ACE indexes, regulation change). App tính test statistic; giá trị tới hạn tra bảng t/χ²/F (đã ghi df). Mục "Parametric vs Nonparametric" là lý thuyết — xem trong sách.
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

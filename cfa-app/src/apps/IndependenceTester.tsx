import { useState } from "react";
import {
  correlationTTest,
  spearmanRankCorrelation,
  chiSquareIndependence,
} from "../lib/quant/independence";
import { num } from "../lib/format";
import type { Section } from "../data/curriculum";
import { Tool, Field, Row, SectionHeader, parseNums, safe } from "../components/ToolKit";

/** Parse bảng số: mỗi dòng = một hàng, giá trị cách nhau bởi dấu phẩy/khoảng trắng. */
function parseMatrix(s: string): number[][] {
  return s
    .split(/\n+/)
    .map((line) => parseNums(line))
    .filter((row) => row.length > 0);
}

/**
 * Công cụ LM9 — Parametric and Non-Parametric Tests of Independence.
 * Section render theo đúng `sections` của curriculum.ts; mỗi công cụ có ghi chú + hướng dẫn + trỏ mục sách.
 */
export default function IndependenceTester({ sections }: { sections: Section[] }) {
  // Parametric correlation t-test
  const [corr, setCorr] = useState("0.43051");
  const [corrN, setCorrN] = useState("33");
  // Spearman
  const [spX, setSpX] = useState("-0.52, -0.13, -0.50, -1.01, -0.26, -0.89, -0.42, -0.23, -0.60");
  const [spY, setSpY] = useState("1.34, 0.40, 1.90, 1.50, 1.35, 0.50, 1.00, 1.50, 1.45");
  // Contingency table
  const [table, setTable] = useState("50, 110, 343\n42, 122, 202\n56, 149, 520");

  const X = parseNums(spX);
  const Y = parseNums(spY);
  const matrix = parseMatrix(table);
  const chi = safe(() => chiSquareIndependence(matrix));
  const rs = safe(() => spearmanRankCorrelation(X, Y));

  const toolsBySection: Record<string, React.ReactNode> = {
    "correlation-tests": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Parametric Correlation t-test"
          note="Kiểm định hệ số tương quan Pearson có khác 0 không (giả định 2 biến phân phối chuẩn): t = r·√(n−2)/√(1−r²), df = n−2. n càng lớn → dễ đạt ý nghĩa thống kê."
          steps={["Nhập hệ số tương quan mẫu r và cỡ mẫu n.", "So |t| với giá trị tới hạn t (df = n−2)."]}
          book="L1V1 · LM9 · Tests Concerning Correlation → Parametric Test of a Correlation (Example 1)"
        >
          <Field label="Hệ số tương quan (r)" value={corr} onChange={setCorr} />
          <Field label="Cỡ mẫu (n)" value={corrN} onChange={setCorrN} />
          <Row label="t-statistic" value={safe(() => correlationTTest(+corr, +corrN)) !== null ? num(correlationTTest(+corr, +corrN), 5) : "— (cần n≥3, |r|<1)"} />
          <Row label="df" value={String(Math.max(0, Math.floor(+corrN) - 2))} />
        </Tool>

        <Tool
          title="Spearman Rank Correlation (non-parametric)"
          note="Dùng khi dữ liệu lệch chuẩn/có ngoại lai: tính tương quan trên HẠNG thay vì giá trị. rs = 1 − 6Σd²/(n(n²−1)); kiểm định bằng t-test (df = n−2) cho mẫu lớn."
          steps={[
            "Nhập 2 chuỗi X và Y cùng độ dài (từng cặp tương ứng).",
            "App xếp hạng (xử lý giá trị trùng) và tính rs.",
            "Đọc rs và t-statistic tương ứng.",
          ]}
          book="L1V1 · LM9 · Tests Concerning Correlation → Spearman Rank Correlation Coefficient"
        >
          <Field label="Chuỗi X" value={spX} onChange={setSpX} area />
          <Field label="Chuỗi Y" value={spY} onChange={setSpY} area />
          <Row label="Độ dài X / Y" value={`${X.length} / ${Y.length}`} />
          <Row label="Spearman rs" value={rs !== null ? num(rs, 5) : "— (X, Y cùng độ dài)"} />
          <Row label="t-statistic (df = n−2)" value={rs !== null && X.length >= 3 && Math.abs(rs) < 1 ? num(correlationTTest(rs, X.length), 5) : "—"} />
        </Tool>
      </div>
    ),
    contingency: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Chi-Square Test of Independence"
          note="Dùng cho dữ liệu phân loại (vd quy mô × loại hình đầu tư): so tần số quan sát với tần số kỳ vọng nếu hai biến độc lập. χ² = Σ(O−E)²/E, df = (hàng−1)(cột−1). Chỉ bác bỏ ở đuôi phải."
          steps={[
            "Nhập bảng tần số: mỗi DÒNG là một hàng, giá trị cách nhau bởi dấu phẩy.",
            "App tự tính tần số kỳ vọng E = (tổng hàng·tổng cột)/tổng.",
            "Đọc χ², df; so với giá trị tới hạn χ².",
          ]}
          book="L1V1 · LM9 · Tests of Independence Using Contingency Table Data (ETF Example)"
        >
          <Field label="Bảng tần số (mỗi dòng = 1 hàng)" value={table} onChange={setTable} area />
          <Row label="χ²-statistic" value={chi ? num(chi.chiSquare, 5) : "— (bảng ≥ 2×2)"} />
          <Row label="df" value={chi ? String(chi.df) : "—"} />
          <Row label="E[hàng 1, cột 1]" value={chi ? num(chi.expected[0][0], 3) : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Kiểm định độc lập (tham số & phi tham số) — section & thứ tự lấy đúng từ mục lục sách (LM9).
      </p>
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        💡 Ô điền sẵn dữ liệu Example LM9 (r=0.43051/n=33 → t=2.656; bảng ETF → χ²=32.08). Giá trị tới hạn tra bảng t/χ² (đã ghi df).
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

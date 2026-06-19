import { useState } from "react";
import {
  mean,
  median,
  mode,
  range,
  meanAbsoluteDeviation,
  sampleVariance,
  sampleStdDev,
  targetSemideviation,
  coefficientOfVariation,
  skewness,
  excessKurtosis,
  covariance,
  correlation,
} from "../lib/quant/stats";
import { num } from "../lib/format";
import type { Section } from "../data/curriculum";
import { Tool, Field, Row, SectionHeader, parseNums, safe } from "../components/ToolKit";

/**
 * Công cụ LM3 — Statistical Measures of Asset Returns.
 * Section render theo đúng `sections` của curriculum.ts; mỗi công cụ có ghi chú + hướng dẫn + trỏ mục sách.
 */
export default function DistributionLab({ sections }: { sections: Section[] }) {
  const [series, setSeries] = useState("5, 3, -1, -4, 4, 2, 0, 4, 3, 0, 6, 5");
  const [target, setTarget] = useState("3");
  const [seriesX, setSeriesX] = useState("10, 8, 13, 9, 11, 14, 6, 4, 12, 7, 5");
  const [seriesY, setSeriesY] = useState("8.04, 6.95, 7.58, 8.81, 8.33, 9.96, 7.24, 4.26, 10.84, 4.82, 5.68");

  const xs = parseNums(series);
  const X = parseNums(seriesX);
  const Y = parseNums(seriesY);
  const modes = safe(() => mode(xs));

  const toolsBySection: Record<string, React.ReactNode> = {
    "central-location": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Central Tendency (Mean / Median / Mode)"
          note="Nơi dữ liệu hội tụ. Median ít bị ảnh hưởng bởi giá trị cực đoan (outlier) hơn mean; mode là giá trị xuất hiện nhiều nhất."
          steps={[
            "Nhập chuỗi lợi suất, cách nhau bởi dấu phẩy.",
            "Đọc mean, median, mode.",
            "Mean ≠ median nhiều → phân phối có thể bị lệch (skew).",
          ]}
          book="L1V1 · LM3 · Measures of Central Tendency and Location"
        >
          <Field label="Chuỗi lợi suất" value={series} onChange={setSeries} area />
          <Row label="Mean" value={xs.length ? num(mean(xs), 4) : "—"} />
          <Row label="Median" value={xs.length ? num(median(xs), 4) : "—"} />
          <Row label="Mode" value={modes && modes.length ? modes.map((m) => num(m, 2)).join(", ") : "Không có mode (mọi giá trị khác nhau)"} />
        </Tool>
      </div>
    ),
    dispersion: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Dispersion (Range / MAD / Variance / Std / CV)"
          note="Độ phân tán quanh mean — đo rủi ro/biến động. CV = std/mean cho phép so sánh rủi ro giữa các tập có quy mô khác nhau (không thứ nguyên)."
          steps={[
            "Dùng chuỗi lợi suất ở trên (ô Central Tendency).",
            "Đọc range, MAD, variance, std (mẫu, chia n−1), CV.",
            "CV chỉ có nghĩa khi mean > 0.",
          ]}
          book="L1V1 · LM3 · Measures of Dispersion (Examples 4, 5)"
        >
          <Field label="Chuỗi lợi suất" value={series} onChange={setSeries} area />
          <Row label="Range" value={xs.length ? num(range(xs), 4) : "—"} />
          <Row label="MAD" value={xs.length ? num(meanAbsoluteDeviation(xs), 4) : "—"} />
          <Row label="Sample variance" value={safe(() => sampleVariance(xs)) !== null ? num(sampleVariance(xs), 4) : "—"} />
          <Row label="Sample std dev" value={safe(() => sampleStdDev(xs)) !== null ? num(sampleStdDev(xs), 4) : "—"} />
          <Row label="Coefficient of variation" value={safe(() => coefficientOfVariation(xs)) !== null ? num(coefficientOfVariation(xs), 4) : "—"} />
        </Tool>

        <Tool
          title="Target Downside Deviation"
          note="Chỉ đo độ phân tán của các lợi suất DƯỚI một mức mục tiêu — phản ánh rủi ro sụt giảm (downside risk) mà nhà đầu tư thực sự lo ngại."
          steps={[
            "Dùng chuỗi lợi suất ở trên.",
            "Nhập mức mục tiêu (target).",
            "Kết quả = √(Σ(Xi−B)² cho Xi≤B / (n−1)).",
          ]}
          book="L1V1 · LM3 · Measures of Dispersion → Downside Deviation (Example 3)"
        >
          <Field label="Mức mục tiêu (target)" value={target} onChange={setTarget} />
          <Row label="Target semideviation" value={safe(() => targetSemideviation(xs, +target)) !== null ? num(targetSemideviation(xs, +target), 4) : "—"} />
        </Tool>
      </div>
    ),
    shape: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Skewness & Excess Kurtosis"
          note="Skewness > 0 (lệch phải): nhiều lỗ nhỏ + vài lãi lớn; < 0 (lệch trái): nhiều lãi nhỏ + vài lỗ lớn. Excess kurtosis > 0 = đuôi béo (fat tail), nhiều biến động cực đoan hơn phân phối chuẩn."
          steps={[
            "Dùng chuỗi lợi suất ở trên.",
            "Đọc skewness và excess kurtosis (so với phân phối chuẩn = 0).",
            "Lưu ý: công thức là xấp xỉ mẫu lớn (n ≥ 100); mẫu nhỏ chỉ mang tính minh hoạ.",
          ]}
          book="L1V1 · LM3 · Measures of Shape of a Distribution (Example 6)"
        >
          <Field label="Chuỗi lợi suất" value={series} onChange={setSeries} area />
          <Row label="Skewness" value={safe(() => skewness(xs)) !== null ? num(skewness(xs), 4) : "—"} />
          <Row label="Excess kurtosis" value={safe(() => excessKurtosis(xs)) !== null ? num(excessKurtosis(xs), 4) : "—"} />
        </Tool>
      </div>
    ),
    correlation: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Covariance & Correlation"
          note="Đo mức độ hai biến cùng biến động. Correlation ∈ [−1, 1]: gần +1 cùng chiều mạnh, gần −1 ngược chiều mạnh, 0 = không có quan hệ tuyến tính. Lưu ý: tương quan KHÔNG hàm ý nhân quả."
          steps={[
            "Nhập 2 chuỗi X và Y CÙNG độ dài, từng cặp tương ứng.",
            "Đọc covariance và correlation.",
            "Correlation chuẩn hoá covariance về [−1, 1] để dễ diễn giải.",
          ]}
          book="L1V1 · LM3 · Correlation between Two Variables (Example 7)"
        >
          <Field label="Chuỗi X" value={seriesX} onChange={setSeriesX} area />
          <Field label="Chuỗi Y" value={seriesY} onChange={setSeriesY} area />
          <Row label="Độ dài X / Y" value={`${X.length} / ${Y.length}`} />
          <Row label="Covariance" value={safe(() => covariance(X, Y)) !== null ? num(covariance(X, Y), 4) : "— (X, Y phải cùng độ dài)"} />
          <Row label="Correlation" value={safe(() => correlation(X, Y)) !== null ? num(correlation(X, Y), 4) : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Phân tích phân phối lợi suất — section & thứ tự lấy đúng từ mục lục sách (LM3).
      </p>
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        💡 Ô lợi suất điền sẵn dữ liệu Example 3/4 (LM3); ô X/Y điền sẵn Anscombe Quartet (correlation ≈ 0.82) để bạn đối chiếu.
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

import { useState } from "react";
import {
  minMaxNormalize,
  zScoreStandardize,
  wordFrequencies,
  sentimentScore,
  kMeans,
} from "../lib/quant/bigdata";
import { num } from "../lib/format";
import type { Section } from "../data/curriculum";
import { Tool, Field, Row, SectionHeader, parseNums, safe } from "../components/ToolKit";

const STOPWORDS = ["the", "a", "an", "and", "or", "but", "of", "to", "in", "is", "are", "for", "on", "with", "as", "by", "it", "this", "that"];
const POSITIVE = ["growth", "profit", "gain", "strong", "beat", "up", "good", "great", "positive", "outperform", "surge", "rise"];
const NEGATIVE = ["loss", "decline", "weak", "miss", "down", "bad", "risk", "negative", "underperform", "fall", "drop", "fraud"];

/** Parse các điểm: mỗi dòng không trống phải có ≥ 2 số, nếu không thì coi như dữ liệu lỗi (throw). */
function parsePoints(s: string): number[][] {
  const rows: number[][] = [];
  for (const line of s.split(/\n+/)) {
    if (line.trim().length === 0) continue;
    const nums = parseNums(line);
    if (nums.length < 2) throw new Error(`Dòng không hợp lệ (cần ≥ 2 số): "${line.trim()}"`);
    rows.push(nums);
  }
  return rows;
}

/**
 * Công cụ LM11 — Introduction to Big Data Techniques (module khái niệm).
 * Demo data-science chuẩn minh hoạ khái niệm; section render theo curriculum.ts.
 */
export default function BigDataLab({ sections }: { sections: Section[] }) {
  // k-means
  const [pts, setPts] = useState("0,0\n0.2,0.1\n5,5\n5.1,4.8\n0.1,0.3\n4.9,5.2");
  const [k, setK] = useState("2");
  const [seed, setSeed] = useState("7");
  // feature scaling
  const [scaleData, setScaleData] = useState("6.0, 4.0, 15.0, 20.0, 10.0, 20.0");
  // text analytics
  const [text, setText] = useState(
    "Revenue growth was strong and profit beat estimates, but rising risk and a decline in margins remain a concern."
  );

  const scaleArr = parseNums(scaleData);
  const km = safe(() => kMeans(parsePoints(pts), Math.max(1, Math.floor(+k)), +seed));
  const freqs = safe(() => wordFrequencies(text, STOPWORDS));
  const sentiment = safe(() => sentimentScore(text, POSITIVE, NEGATIVE));

  const toolsBySection: Record<string, React.ReactNode> = {
    "ai-ml": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="k-Means Clustering (Unsupervised ML)"
          note="Học không giám sát 'tìm pattern': nhóm các điểm tương tự thành k cụm mà không cần nhãn. Ứng dụng đầu tư: phân nhóm cổ phiếu/khách hàng theo đặc trưng. Có seed nên tái lập được."
          steps={[
            "Nhập các điểm: mỗi DÒNG là một điểm 'x, y'.",
            "Nhập số cụm k và seed.",
            "Đọc số điểm mỗi cụm, tâm cụm (centroid), và cụm của từng điểm.",
          ]}
          book="L1V1 · LM11 · Advanced Analytical Tools: Artificial Intelligence and Machine Learning"
        >
          <Field label="Điểm dữ liệu (mỗi dòng 'x, y')" value={pts} onChange={setPts} area />
          <Field label="Số cụm (k)" value={k} onChange={setK} />
          <Field label="Seed" value={seed} onChange={setSeed} />
          <Row label="Số vòng lặp" value={km ? String(km.iterations) : "— (mỗi dòng cần ≥ 2 số, và số điểm ≥ k)"} />
          <Row label="Tâm cụm (centroids)" value={km ? km.centroids.map((c) => `(${c.map((v) => num(v, 2)).join(", ")})`).join("  ") : "—"} />
          <Row label="Cụm của từng điểm" value={km ? km.assignments.join(", ") : "—"} />
        </Tool>
      </div>
    ),
    "data-science": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Feature Scaling (Data Processing)"
          note="Chuẩn hoá dữ liệu trước khi đưa vào mô hình: min-max đưa về [0,1]; z-score (standardization) đưa về trung bình 0, độ lệch chuẩn 1. Giúp các đặc trưng cùng thang đo."
          steps={["Nhập chuỗi số.", "Đọc kết quả normalization (min-max) và standardization (z-score)."]}
          book="L1V1 · LM11 · Tackling Big Data with Data Science → Data Processing Methods"
        >
          <Field label="Dữ liệu" value={scaleData} onChange={setScaleData} area />
          <Row label="Min-max [0,1]" value={safe(() => minMaxNormalize(scaleArr)) !== null ? minMaxNormalize(scaleArr).map((v) => num(v, 3)).join(", ") : "— (cần max≠min)"} />
          <Row label="Z-score" value={safe(() => zScoreStandardize(scaleArr)) !== null ? zScoreStandardize(scaleArr).map((v) => num(v, 3)).join(", ") : "—"} />
        </Tool>

        <Tool
          title="Text Analytics & NLP"
          note="Phân tích văn bản: tách từ → đếm tần suất (bag-of-words, loại stopwords) và chấm cảm xúc theo từ điển (đếm từ tích cực/tiêu cực). Ứng dụng: phân tích báo cáo, earnings calls, tin tức."
          steps={[
            "Dán đoạn văn bản (vd trích báo cáo/tin tức).",
            "Đọc các từ xuất hiện nhiều nhất và điểm cảm xúc (net = tích cực − tiêu cực).",
          ]}
          book="L1V1 · LM11 · Tackling Big Data with Data Science → Text Analytics and Natural Language Processing"
        >
          <Field label="Văn bản" value={text} onChange={setText} area />
          <Row label="Top từ (tần suất)" value={freqs && freqs.length ? freqs.slice(0, 6).map((f) => `${f.word}:${f.count}`).join(", ") : "—"} />
          <Row label="Cảm xúc (pos / neg / net)" value={sentiment ? `${sentiment.positive} / ${sentiment.negative} / ${sentiment.net}` : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Big Data, AI/ML & NLP — section & thứ tự lấy đúng từ mục lục sách (LM11).
      </p>
      <p className="mt-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
        ⚠️ LM11 là module khái niệm (sách không có ví dụ số). Các công cụ dưới là demo thuật toán data-science chuẩn để bạn trải nghiệm khái niệm, không phải ví dụ trong sách. Mục "Fintech / Big Data" là lý thuyết — xem trong sách.
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

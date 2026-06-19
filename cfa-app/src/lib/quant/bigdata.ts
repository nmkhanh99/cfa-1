/**
 * LM11 — Introduction to Big Data Techniques. Engine thuần (không phụ thuộc UI).
 * LM11 là module khái niệm (fintech, Big Data, AI/ML, NLP) — sách không có ví dụ số.
 * Các hàm dưới là demo thuật toán data-science CHUẨN minh hoạ khái niệm (data processing,
 * text analytics/NLP, unsupervised ML), kiểm thử theo đầu ra tất định (xem bigdata.test.ts).
 */
import { mean, sampleStdDev } from "./stats";
import { mulberry32 } from "./simulation";

/** Data processing — chuẩn hoá min-max về [0, 1]: (x − min)/(max − min). */
export function minMaxNormalize(values: number[]): number[] {
  if (values.length === 0) throw new Error("Cần dữ liệu");
  const min = Math.min(...values);
  const max = Math.max(...values);
  if (max === min) throw new Error("max = min, không chuẩn hoá được");
  return values.map((v) => (v - min) / (max - min));
}

/** Data processing — chuẩn hoá z-score: (x − mean)/s. */
export function zScoreStandardize(values: number[]): number[] {
  if (values.length < 2) throw new Error("Cần ít nhất 2 quan sát");
  const m = mean(values);
  const s = sampleStdDev(values);
  if (s === 0) throw new Error("Độ lệch chuẩn = 0");
  return values.map((v) => (v - m) / s);
}

/** Tách từ (tokenize): chữ thường, bỏ dấu câu, tách theo khoảng trắng. */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-zà-ỹ0-9\s]/giu, " ")
    .split(/\s+/)
    .filter((t) => t.length > 0);
}

export interface WordCount {
  word: string;
  count: number;
}

/** Text analytics — đếm tần suất từ (bag-of-words), loại stopwords, sắp xếp giảm dần. */
export function wordFrequencies(text: string, stopwords: string[] = []): WordCount[] {
  const stop = new Set(stopwords.map((w) => w.toLowerCase()));
  const freq = new Map<string, number>();
  for (const tok of tokenize(text)) {
    if (stop.has(tok)) continue;
    freq.set(tok, (freq.get(tok) ?? 0) + 1);
  }
  return [...freq.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
}

export interface SentimentResult {
  positive: number;
  negative: number;
  net: number;
}

/** NLP — chấm điểm cảm xúc đơn giản theo từ điển (đếm từ tích cực/tiêu cực). */
export function sentimentScore(text: string, positiveWords: string[], negativeWords: string[]): SentimentResult {
  const pos = new Set(positiveWords.map((w) => w.toLowerCase()));
  const neg = new Set(negativeWords.map((w) => w.toLowerCase()));
  let positive = 0;
  let negative = 0;
  for (const tok of tokenize(text)) {
    if (pos.has(tok)) positive++;
    if (neg.has(tok)) negative++;
  }
  return { positive, negative, net: positive - negative };
}

export interface KMeansResult {
  assignments: number[]; // cụm của từng điểm
  centroids: number[][];
  iterations: number;
}

function dist2(a: number[], b: number[]): number {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += (a[i] - b[i]) ** 2;
  return s;
}

/**
 * Unsupervised ML — k-means clustering (Lloyd's), khởi tạo có seed → tái lập được.
 * points: mảng các điểm cùng số chiều; k: số cụm.
 */
export function kMeans(points: number[][], k: number, seed: number, maxIter = 50): KMeansResult {
  const n = points.length;
  if (k < 1) throw new Error("k phải ≥ 1");
  if (n < k) throw new Error("Số điểm phải ≥ k");
  const dim = points[0].length;
  if (points.some((p) => p.length !== dim)) throw new Error("Các điểm phải cùng số chiều");

  // Khởi tạo: chọn k điểm khác nhau làm tâm (xáo trộn chỉ số bằng PRNG seed).
  const rng = mulberry32(seed);
  const idx = points.map((_, i) => i);
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [idx[i], idx[j]] = [idx[j], idx[i]];
  }
  let centroids = idx.slice(0, k).map((i) => [...points[i]]);
  const assignments = new Array<number>(n).fill(-1);

  let iterations = 0;
  for (; iterations < maxIter; iterations++) {
    let changed = false;
    // Gán mỗi điểm vào tâm gần nhất
    for (let p = 0; p < n; p++) {
      let best = 0;
      let bestD = Infinity;
      for (let c = 0; c < k; c++) {
        const d = dist2(points[p], centroids[c]);
        if (d < bestD) {
          bestD = d;
          best = c;
        }
      }
      if (assignments[p] !== best) {
        assignments[p] = best;
        changed = true;
      }
    }
    // Cập nhật tâm
    const sums = Array.from({ length: k }, () => new Array<number>(dim).fill(0));
    const counts = new Array<number>(k).fill(0);
    for (let p = 0; p < n; p++) {
      counts[assignments[p]]++;
      for (let d = 0; d < dim; d++) sums[assignments[p]][d] += points[p][d];
    }
    centroids = centroids.map((old, c) =>
      counts[c] === 0 ? old : sums[c].map((s) => s / counts[c])
    );
    if (!changed) {
      iterations++;
      break;
    }
  }
  return { assignments, centroids, iterations };
}

import { describe, it, expect } from "vitest";
import {
  minMaxNormalize,
  zScoreStandardize,
  tokenize,
  wordFrequencies,
  sentimentScore,
  kMeans,
} from "../bigdata";

/**
 * LM11 là module khái niệm — sách không có ví dụ số. Các test dưới xác minh
 * tính đúng đắn của thuật toán data-science chuẩn theo đầu ra tất định.
 */
const near = (a: number, b: number, tol: number) => expect(Math.abs(a - b)).toBeLessThan(tol);

describe("minMaxNormalize", () => {
  it("[10,20,30] → [0,0.5,1]", () => expect(minMaxNormalize([10, 20, 30])).toEqual([0, 0.5, 1]));
  it("từ chối max = min", () => expect(() => minMaxNormalize([5, 5, 5])).toThrow());
});

describe("zScoreStandardize", () => {
  it("[1,2,3] → [-1,0,1] (sample sd)", () => {
    const z = zScoreStandardize([1, 2, 3]);
    near(z[0], -1, 1e-9);
    near(z[1], 0, 1e-9);
    near(z[2], 1, 1e-9);
  });
});

describe("tokenize / wordFrequencies", () => {
  it("tokenize bỏ dấu câu + chữ thường", () => expect(tokenize("Hello, world! Hello.")).toEqual(["hello", "world", "hello"]));
  it("word frequencies + stopwords", () => {
    const f = wordFrequencies("the cat the dog the cat", ["the"]);
    expect(f).toEqual([
      { word: "cat", count: 2 },
      { word: "dog", count: 1 },
    ]);
  });
});

describe("sentimentScore", () => {
  it("đếm từ tích cực/tiêu cực → net", () => {
    expect(sentimentScore("good great growth but bad risk", ["good", "great", "growth"], ["bad", "risk"])).toEqual({
      positive: 3,
      negative: 2,
      net: 1,
    });
  });
});

describe("kMeans (unsupervised, seeded)", () => {
  const points = [
    [0, 0],
    [0.1, 0.1],
    [5, 5],
    [5.1, 4.9],
  ];
  it("2 cụm tách biệt → nhóm đúng {0,1} và {2,3}", () => {
    const r = kMeans(points, 2, 7);
    expect(r.assignments[0]).toBe(r.assignments[1]);
    expect(r.assignments[2]).toBe(r.assignments[3]);
    expect(r.assignments[0]).not.toBe(r.assignments[2]);
  });
  it("cùng seed → cùng kết quả (tái lập)", () => {
    expect(kMeans(points, 2, 7).assignments).toEqual(kMeans(points, 2, 7).assignments);
  });
  it("từ chối k > số điểm", () => expect(() => kMeans(points, 5, 1)).toThrow());
});

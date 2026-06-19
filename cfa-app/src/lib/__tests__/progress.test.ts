import { describe, it, expect } from "vitest";
import { moduleProgress, topicProgress, dueCardCount } from "../progress";
import { emptyData, setProgress, sectionKey } from "../store";
import { initCard, reviewCard, DAY_MS } from "../srs";
import { L1V1 } from "../../data/curriculum";

const quant = L1V1.topics.find((t) => t.id === "quant")!;
const lm1 = quant.modules.find((m) => m.id === 1)!;

describe("moduleProgress", () => {
  it("0 section học → pct 0", () => {
    const mp = moduleProgress("quant", lm1, emptyData());
    expect(mp.done).toBe(0);
    expect(mp.total).toBe(lm1.sections.length);
    expect(mp.pct).toBe(0);
  });
  it("đánh dấu 1 section → done 1", () => {
    const d = setProgress(emptyData(), sectionKey("quant", 1, lm1.sections[0].id), true);
    expect(moduleProgress("quant", lm1, d).done).toBe(1);
  });
});

describe("topicProgress", () => {
  it("chỉ tính module available; tổng section khớp", () => {
    const tp = topicProgress(quant, emptyData());
    const expectedTotal = quant.modules
      .filter((m) => m.status === "available")
      .reduce((a, m) => a + m.sections.length, 0);
    expect(tp.total).toBe(expectedTotal);
    expect(tp.done).toBe(0);
  });
});

describe("dueCardCount", () => {
  it("thẻ mới đến hạn; thẻ vừa ôn thì chưa", () => {
    const fresh = initCard("a", 0);
    const reviewed = reviewCard(initCard("b", 0), 5, 0); // due sau 1 ngày
    expect(dueCardCount([fresh, reviewed], 0)).toBe(1);
    expect(dueCardCount([fresh, reviewed], DAY_MS)).toBe(2);
  });
});

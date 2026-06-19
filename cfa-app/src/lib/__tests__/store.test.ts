import { describe, it, expect } from "vitest";
import {
  emptyData,
  sectionKey,
  setProgress,
  setNote,
  upsertCard,
  serialize,
  deserialize,
  SCHEMA_VERSION,
} from "../store";
import { initCard } from "../srs";

describe("reducers (immutable)", () => {
  it("setProgress thêm/xoá khoá", () => {
    const k = sectionKey("quant", 1, "rates-of-return");
    const a = setProgress(emptyData(), k, true);
    expect(a.progress[k]).toBe(true);
    const b = setProgress(a, k, false);
    expect(b.progress[k]).toBeUndefined();
  });
  it("setNote: text rỗng thì xoá", () => {
    const k = sectionKey("quant", 1, "intro");
    const a = setNote(emptyData(), k, "ghi chú");
    expect(a.notes[k]).toBe("ghi chú");
    expect(setNote(a, k, "   ").notes[k]).toBeUndefined();
  });
  it("upsertCard lưu theo id", () => {
    const card = initCard("c1", 0);
    expect(upsertCard(emptyData(), card).srs["c1"]).toEqual(card);
  });
  it("không mutate dữ liệu gốc", () => {
    const d = emptyData();
    setProgress(d, "k", true);
    expect(d.progress).toEqual({});
  });
});

describe("serialize / deserialize (versioned)", () => {
  it("round-trip giữ nguyên dữ liệu", () => {
    let d = emptyData();
    d = setProgress(d, "quant.1.x", true);
    d = setNote(d, "quant.1.x", "note");
    d = upsertCard(d, initCard("c1", 0));
    expect(deserialize(serialize(d))).toEqual(d);
  });
  it("JSON hỏng → throw", () => expect(() => deserialize("{not json")).toThrow());
  it("thiếu schemaVersion → throw", () => expect(() => deserialize('{"progress":{}}')).toThrow());
  it("schemaVersion mới hơn → throw", () =>
    expect(() => deserialize(JSON.stringify({ schemaVersion: SCHEMA_VERSION + 1 }))).toThrow());
  it("trường thiếu được lấp an toàn", () => {
    const d = deserialize(JSON.stringify({ schemaVersion: SCHEMA_VERSION }));
    expect(d).toEqual(emptyData());
  });
});

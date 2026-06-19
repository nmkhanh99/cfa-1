/**
 * Lưu trữ tiến độ học (local-first): tiến độ section, ghi chú, trạng thái flashcard SRS.
 * State có `schemaVersion` + serialize/deserialize (migration) + export/import.
 * Phần thuần (model/reducers/serialize) test được; binding localStorage là lớp mỏng.
 */
import type { SrsCard } from "./srs";

export const SCHEMA_VERSION = 1;
const STORAGE_KEY = "cfa-app-data";

export interface AppData {
  schemaVersion: number;
  progress: Record<string, boolean>; // key "topic.module.section" → đã học
  notes: Record<string, string>; // key "topic.module.section" → ghi chú
  srs: Record<string, SrsCard>; // key = card id
}

/** Khoá tiến độ/ghi chú theo section. */
export function sectionKey(topicId: string, moduleId: number, sectionId: string): string {
  return `${topicId}.${moduleId}.${sectionId}`;
}

export function emptyData(): AppData {
  return { schemaVersion: SCHEMA_VERSION, progress: {}, notes: {}, srs: {} };
}

/** Reducers immutable (trả AppData mới). */
export function setProgress(data: AppData, key: string, done: boolean): AppData {
  const progress = { ...data.progress };
  if (done) progress[key] = true;
  else delete progress[key];
  return { ...data, progress };
}

export function setNote(data: AppData, key: string, text: string): AppData {
  const notes = { ...data.notes };
  if (text.trim().length > 0) notes[key] = text;
  else delete notes[key];
  return { ...data, notes };
}

export function upsertCard(data: AppData, card: SrsCard): AppData {
  return { ...data, srs: { ...data.srs, [card.id]: card } };
}

export function serialize(data: AppData): string {
  return JSON.stringify(data, null, 2);
}

/** Parse + migrate JSON về AppData hợp lệ. Ném lỗi nếu không hợp lệ (dùng cho import). */
export function deserialize(json: string): AppData {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("JSON không hợp lệ");
  }
  if (typeof parsed !== "object" || parsed === null) throw new Error("Dữ liệu không hợp lệ");
  const obj = parsed as Record<string, unknown>;
  if (typeof obj.schemaVersion !== "number") throw new Error("Thiếu schemaVersion");
  if (obj.schemaVersion > SCHEMA_VERSION) throw new Error("schemaVersion mới hơn phiên bản app");

  // Migration: hiện chỉ có v1; lấp các trường thiếu một cách an toàn.
  return {
    schemaVersion: SCHEMA_VERSION,
    progress: isStringBoolMap(obj.progress) ? (obj.progress as Record<string, boolean>) : {},
    notes: isStringMap(obj.notes) ? (obj.notes as Record<string, string>) : {},
    srs: isObject(obj.srs) ? (obj.srs as Record<string, SrsCard>) : {},
  };
}

function isObject(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
function isStringMap(v: unknown): boolean {
  return isObject(v) && Object.values(v).every((x) => typeof x === "string");
}
function isStringBoolMap(v: unknown): boolean {
  return isObject(v) && Object.values(v).every((x) => typeof x === "boolean");
}

/** Đọc dữ liệu từ localStorage; mọi lỗi → trả dữ liệu rỗng (không làm vỡ app). */
export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyData();
    return deserialize(raw);
  } catch {
    return emptyData();
  }
}

export function saveData(data: AppData): void {
  try {
    localStorage.setItem(STORAGE_KEY, serialize(data));
  } catch {
    // bỏ qua (vd hết quota / không có localStorage)
  }
}

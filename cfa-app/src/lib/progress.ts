/**
 * Thống kê tiến độ học (thuần, test được) từ cấu trúc curriculum + AppData.
 */
import type { AppData } from "./store";
import { sectionKey } from "./store";
import { isDue, type SrsCard } from "./srs";
import type { Topic, Volume } from "../data/curriculum";

export interface ModuleProgress {
  moduleId: number;
  title: string;
  done: number;
  total: number;
  pct: number;
}

export interface TopicProgress {
  topicId: string;
  name: string;
  modules: ModuleProgress[];
  done: number;
  total: number;
  pct: number;
}

/** Tiến độ một module = số section đã đánh dấu học / tổng section. Chỉ tính module "available". */
export function moduleProgress(topicId: string, module: Topic["modules"][number], data: AppData): ModuleProgress {
  const total = module.sections.length;
  const done = module.sections.filter((s) => data.progress[sectionKey(topicId, module.id, s.id)]).length;
  return { moduleId: module.id, title: module.title, done, total, pct: total === 0 ? 0 : done / total };
}

export function topicProgress(topic: Topic, data: AppData): TopicProgress {
  const modules = topic.modules.filter((m) => m.status === "available").map((m) => moduleProgress(topic.id, m, data));
  const done = modules.reduce((a, m) => a + m.done, 0);
  const total = modules.reduce((a, m) => a + m.total, 0);
  return { topicId: topic.id, name: topic.name, modules, done, total, pct: total === 0 ? 0 : done / total };
}

export function volumeProgress(volume: Volume, data: AppData): TopicProgress[] {
  return volume.topics.map((t) => topicProgress(t, data));
}

/** Số thẻ flashcard đến hạn ôn tại thời điểm now. */
export function dueCardCount(cards: SrsCard[], now: number): number {
  return cards.filter((c) => isDue(c, now)).length;
}

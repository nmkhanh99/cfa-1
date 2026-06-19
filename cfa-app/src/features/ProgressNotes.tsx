import type { AppData } from "../lib/store";
import { sectionKey } from "../lib/store";
import type { Module } from "../data/curriculum";

/** Tiến độ theo section (đánh dấu đã học) + ghi chú cá nhân từng section, lưu local. */
export default function ProgressNotes({
  topicId,
  module,
  data,
  onToggle,
  onNote,
}: {
  topicId: string;
  module: Module;
  data: AppData;
  onToggle: (key: string, done: boolean) => void;
  onNote: (key: string, text: string) => void;
}) {
  if (module.sections.length === 0) return null;

  return (
    <div className="mt-10 rounded-lg border border-slate-200 bg-white p-4">
      <h3 className="font-semibold text-slate-800">Tiến độ & Ghi chú</h3>
      <p className="mt-0.5 text-xs text-slate-500">Đánh dấu section đã học và ghi chú cá nhân (lưu trong trình duyệt).</p>
      <ul className="mt-3 space-y-3">
        {module.sections.map((s) => {
          const key = sectionKey(topicId, module.id, s.id);
          const done = !!data.progress[key];
          return (
            <li key={s.id} className="border-b border-slate-100 pb-3 last:border-0 last:pb-0">
              <label className="flex items-start gap-2">
                <input type="checkbox" checked={done} onChange={(e) => onToggle(key, e.target.checked)} className="mt-1" />
                <span className={`text-sm ${done ? "text-slate-400 line-through" : "text-slate-700"}`}>{s.title}</span>
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-slate-200 px-2 py-1 text-xs focus:border-indigo-500 focus:outline-none"
                rows={1}
                placeholder="Ghi chú…"
                value={data.notes[key] ?? ""}
                onChange={(e) => onNote(key, e.target.value)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

import { useState } from "react";
import type { AppData } from "../lib/store";
import { serialize, deserialize } from "../lib/store";
import { volumeProgress, dueCardCount } from "../lib/progress";
import { initCard } from "../lib/srs";
import { pct } from "../lib/format";
import { L1V1 } from "../data/curriculum";
import { QUANT_FLASHCARDS } from "../data/flashcards";

function Bar({ value }: { value: number }) {
  return (
    <div className="h-2 w-32 overflow-hidden rounded bg-slate-200">
      <div className="h-full bg-indigo-500" style={{ width: `${Math.round(value * 100)}%` }} />
    </div>
  );
}

/** Dashboard tiến độ học + đến hạn flashcard + export/import dữ liệu. */
export default function Dashboard({ data, now, onImport }: { data: AppData; now: number; onImport: (d: AppData) => void }) {
  const [importError, setImportError] = useState<string | null>(null);
  const topics = volumeProgress(L1V1, data);
  const cards = QUANT_FLASHCARDS.map((fc) => data.srs[fc.id] ?? initCard(fc.id, now));
  const due = dueCardCount(cards, now);

  const handleExport = () => {
    const blob = new Blob([serialize(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cfa-app-data.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file: File) => {
    setImportError(null);
    file
      .text()
      .then((text) => onImport(deserialize(text)))
      .catch((e) => setImportError(e instanceof Error ? e.message : "Lỗi import"));
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold">Dashboard tiến độ</h1>
      <p className="mt-1 text-sm text-slate-500">Theo dõi % section đã học và số flashcard đến hạn ôn.</p>

      <div className="mt-4 flex gap-4">
        <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
          <div className="text-xs text-slate-500">Flashcard đến hạn</div>
          <div className="text-2xl font-bold text-indigo-600">{due}</div>
        </div>
      </div>

      {topics.map((t) => (
        <div key={t.topicId} className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">{t.name}</h2>
            <span className="text-sm text-slate-500">
              {t.done}/{t.total} section · {pct(t.pct, 0)}
            </span>
          </div>
          {t.modules.length === 0 ? (
            <p className="mt-1 text-xs text-slate-400">Chưa có module nào sẵn sàng.</p>
          ) : (
            <ul className="mt-2 space-y-1">
              {t.modules.map((m) => (
                <li key={m.moduleId} className="flex items-center justify-between gap-4 text-sm">
                  <span className="flex-1 text-slate-700">
                    LM{m.moduleId}: {m.title}
                  </span>
                  <Bar value={m.pct} />
                  <span className="w-16 text-right font-mono text-slate-500">
                    {m.done}/{m.total}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-4">
        <h3 className="font-semibold text-slate-800">Sao lưu dữ liệu (export / import)</h3>
        <p className="mt-0.5 text-xs text-slate-500">Tiến độ, ghi chú và flashcard được lưu trong trình duyệt. Export để sao lưu / chuyển máy.</p>
        <div className="mt-3 flex items-center gap-3">
          <button onClick={handleExport} className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700">
            Export JSON
          </button>
          <label className="cursor-pointer rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-100">
            Import JSON
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleImport(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {importError && <p className="mt-2 text-xs text-rose-600">Import lỗi: {importError}</p>}
      </div>
    </div>
  );
}

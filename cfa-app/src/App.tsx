import { useState } from "react";
import { VOLUMES, type Module } from "./data/curriculum";
import ReturnAnalyzer from "./apps/ReturnAnalyzer";

export default function App() {
  const volume = VOLUMES[0]; // đang dựng L1V1 — menu tách riêng
  const [selected, setSelected] = useState<{ topic: string; module: number } | null>({
    topic: "quant",
    module: 1,
  });

  const activeTopic = volume.topics.find((t) => t.id === selected?.topic);
  const activeModule: Module | undefined = activeTopic?.modules.find((m) => m.id === selected?.module);

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Sidebar: Volume → Topic → Learning Module (đúng thứ tự sách) */}
      <aside className="w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-indigo-600">Volume</div>
          <div className="text-sm font-bold">{volume.name}</div>
        </div>
        {volume.topics.map((topic) => (
          <div key={topic.id} className="px-2 py-2">
            <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              {topic.name}
            </div>
            <ul>
              {topic.modules.map((m) => {
                const isActive = selected?.topic === topic.id && selected?.module === m.id;
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => setSelected({ topic: topic.id, module: m.id })}
                      className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm ${
                        isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-100"
                      }`}
                    >
                      <span className="mt-0.5 w-5 shrink-0 text-right text-xs text-slate-400">{m.id}</span>
                      <span className="flex-1">
                        {m.title}
                        {m.status === "planned" && (
                          <span className="ml-1 text-[10px] text-slate-400">(sắp có)</span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto px-8 py-6">
        {activeModule ? (
          <>
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              {volume.name} · {activeTopic?.name}
            </div>
            <h1 className="text-2xl font-bold">
              Learning Module {activeModule.id}: {activeModule.title}
            </h1>
            {activeModule.app && (
              <div className="mt-1 inline-block rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                Ứng dụng: {activeModule.app}
              </div>
            )}

            {/* Section map đúng heading sách */}
            {activeModule.sections.length > 0 && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Mục lục theo sách
                </div>
                <ol className="mt-1 list-inside list-decimal text-sm text-slate-700">
                  {activeModule.sections.map((s) => (
                    <li key={s.id}>{s.title}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="mt-6">
              {activeModule.status === "available" && activeModule.id === 1 ? (
                <ReturnAnalyzer />
              ) : (
                <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
                  Ứng dụng cho module này sẽ được dựng theo đúng thứ tự tài liệu.
                </div>
              )}
            </div>
          </>
        ) : (
          <p className="text-slate-500">Chọn một Learning Module ở menu bên trái.</p>
        )}
      </main>
    </div>
  );
}

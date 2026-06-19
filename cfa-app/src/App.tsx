import { useState } from "react";
import { VOLUMES, type Module, type Section } from "./data/curriculum";
import { loadData, saveData, setProgress, setNote, upsertCard, type AppData } from "./lib/store";
import type { SrsCard } from "./lib/srs";
import ReturnAnalyzer from "./apps/ReturnAnalyzer";
import ValuationWorkbench from "./apps/ValuationWorkbench";
import DistributionLab from "./apps/DistributionLab";
import DecisionTree from "./apps/DecisionTree";
import PortfolioRiskBuilder from "./apps/PortfolioRiskBuilder";
import MonteCarloSimulator from "./apps/MonteCarloSimulator";
import SamplingStudio from "./apps/SamplingStudio";
import HypothesisTestRunner from "./apps/HypothesisTestRunner";
import IndependenceTester from "./apps/IndependenceTester";
import RegressionWorkbench from "./apps/RegressionWorkbench";
import BigDataLab from "./apps/BigDataLab";
import ProgressNotes from "./features/ProgressNotes";
import Dashboard from "./features/Dashboard";
import Flashcards from "./features/Flashcards";

type View = "study" | "dashboard" | "flashcards";

/** App của module Quant: render đúng ứng dụng theo id (chỉ topic quant). */
function ModuleApp({ topicId, module }: { topicId: string; module: Module }) {
  const sections: Section[] = module.sections;
  if (topicId !== "quant")
    return <Placeholder />;
  switch (module.id) {
    case 1: return <ReturnAnalyzer sections={sections} />;
    case 2: return <ValuationWorkbench sections={sections} />;
    case 3: return <DistributionLab sections={sections} />;
    case 4: return <DecisionTree sections={sections} />;
    case 5: return <PortfolioRiskBuilder sections={sections} />;
    case 6: return <MonteCarloSimulator sections={sections} />;
    case 7: return <SamplingStudio sections={sections} />;
    case 8: return <HypothesisTestRunner sections={sections} />;
    case 9: return <IndependenceTester sections={sections} />;
    case 10: return <RegressionWorkbench sections={sections} />;
    case 11: return <BigDataLab sections={sections} />;
    default: return <Placeholder />;
  }
}

function Placeholder() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
      Ứng dụng cho module này sẽ được dựng theo đúng thứ tự tài liệu.
    </div>
  );
}

export default function App() {
  const volume = VOLUMES[0]; // đang dựng L1V1 — menu tách riêng
  const [data, setData] = useState<AppData>(() => loadData());
  const [view, setView] = useState<View>("study");
  const [selected, setSelected] = useState<{ topic: string; module: number }>({ topic: "quant", module: 1 });

  const now = Date.now();
  const activeTopic = volume.topics.find((t) => t.id === selected.topic);
  const activeModule = activeTopic?.modules.find((m) => m.id === selected.module);

  // Cập nhật + lưu local.
  const update = (fn: (d: AppData) => AppData) =>
    setData((prev) => {
      const next = fn(prev);
      saveData(next);
      return next;
    });
  const replaceData = (d: AppData) => {
    saveData(d);
    setData(d);
  };

  const navBtn = (v: View) =>
    `block w-full rounded-md px-3 py-1.5 text-left text-sm font-medium ${view === v ? "bg-indigo-600 text-white" : "hover:bg-slate-100"}`;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      <aside className="w-72 shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-4 py-3">
          <div className="text-xs font-medium uppercase tracking-wide text-indigo-600">Volume</div>
          <div className="text-sm font-bold">{volume.name}</div>
        </div>

        {/* Điều hướng chế độ */}
        <div className="space-y-1 border-b border-slate-200 p-2">
          <button className={navBtn("dashboard")} onClick={() => setView("dashboard")}>📊 Dashboard</button>
          <button className={navBtn("flashcards")} onClick={() => setView("flashcards")}>🗂️ Flashcards</button>
        </div>

        {volume.topics.map((topic) => (
          <div key={topic.id} className="px-2 py-2">
            <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{topic.name}</div>
            <ul>
              {topic.modules.map((m) => {
                const isActive = view === "study" && selected.topic === topic.id && selected.module === m.id;
                return (
                  <li key={m.id}>
                    <button
                      onClick={() => {
                        setSelected({ topic: topic.id, module: m.id });
                        setView("study");
                      }}
                      className={`flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-sm ${
                        isActive ? "bg-indigo-50 text-indigo-700" : "hover:bg-slate-100"
                      }`}
                    >
                      <span className="mt-0.5 w-5 shrink-0 text-right text-xs text-slate-400">{m.id}</span>
                      <span className="flex-1">
                        {m.title}
                        {m.status === "planned" && <span className="ml-1 text-[10px] text-slate-400">(sắp có)</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </aside>

      <main className="flex-1 overflow-y-auto px-8 py-6">
        {view === "dashboard" ? (
          <Dashboard data={data} now={now} onImport={replaceData} />
        ) : view === "flashcards" ? (
          <Flashcards data={data} now={now} onReview={(card: SrsCard) => update((d) => upsertCard(d, card))} />
        ) : activeModule && activeTopic ? (
          <>
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
              {volume.name} · {activeTopic.name}
            </div>
            <h1 className="text-2xl font-bold">
              Learning Module {activeModule.id}: {activeModule.title}
            </h1>
            {activeModule.app && (
              <div className="mt-1 inline-block rounded bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700">
                Ứng dụng: {activeModule.app}
              </div>
            )}

            {activeModule.sections.length > 0 && (
              <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mục lục theo sách</div>
                <ol className="mt-1 list-inside list-decimal text-sm text-slate-700">
                  {activeModule.sections.map((s) => (
                    <li key={s.id}>{s.title}</li>
                  ))}
                </ol>
              </div>
            )}

            <div className="mt-6">
              {activeModule.status === "available" ? (
                <ModuleApp topicId={activeTopic.id} module={activeModule} />
              ) : (
                <Placeholder />
              )}
            </div>

            <ProgressNotes
              topicId={activeTopic.id}
              module={activeModule}
              data={data}
              onToggle={(key, done) => update((d) => setProgress(d, key, done))}
              onNote={(key, text) => update((d) => setNote(d, key, text))}
            />
          </>
        ) : (
          <p className="text-slate-500">Chọn một Learning Module ở menu bên trái.</p>
        )}
      </main>
    </div>
  );
}

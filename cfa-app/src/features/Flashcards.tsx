import { useState } from "react";
import type { AppData } from "../lib/store";
import { initCard, reviewCard, isDue, type SrsCard } from "../lib/srs";
import { QUANT_FLASHCARDS } from "../data/flashcards";

const RATINGS: { label: string; quality: number; cls: string }[] = [
  { label: "Quên (Again)", quality: 1, cls: "bg-rose-100 text-rose-700 hover:bg-rose-200" },
  { label: "Khó (Hard)", quality: 3, cls: "bg-amber-100 text-amber-700 hover:bg-amber-200" },
  { label: "Được (Good)", quality: 4, cls: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" },
  { label: "Dễ (Easy)", quality: 5, cls: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200" },
];

/** Màn ôn flashcard theo SRS: ôn các thẻ đến hạn, chấm chất lượng → cập nhật lịch ôn. */
export default function Flashcards({ data, now, onReview }: { data: AppData; now: number; onReview: (card: SrsCard) => void }) {
  const [revealed, setRevealed] = useState(false);

  // Hàng đợi thẻ đến hạn — ĐÓNG BĂNG một lần khi vào phiên (không tính lại khi `now` đổi
  // lúc chấm), nếu không sẽ nhảy cách thẻ. Ôn lần lượt bằng cách tăng idx.
  const [queue] = useState(() =>
    QUANT_FLASHCARDS.map((fc) => ({ fc, card: data.srs[fc.id] ?? initCard(fc.id, now) })).filter((x) => isDue(x.card, now))
  );

  const [idx, setIdx] = useState(0);
  const current = queue[idx];

  const rate = (quality: number) => {
    if (!current) return;
    onReview(reviewCard(current.card, quality, now));
    setRevealed(false);
    setIdx((i) => i + 1);
  };

  if (queue.length === 0) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          🎉 Không còn thẻ đến hạn ôn. Quay lại sau hoặc tiếp tục học module mới.
        </p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <p className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          ✅ Đã ôn xong {queue.length} thẻ đến hạn trong phiên này. Lịch ôn đã được cập nhật.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <span className="text-sm text-slate-500">
          {idx + 1} / {queue.length} đến hạn · LM{current.fc.moduleId}
        </span>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Câu hỏi</div>
        <p className="mt-2 text-lg font-semibold text-slate-900">{current.fc.front}</p>
        {revealed ? (
          <>
            <div className="my-4 border-t border-slate-100" />
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Đáp án</div>
            <p className="mt-2 font-mono text-slate-800">{current.fc.back}</p>
          </>
        ) : (
          <button
            onClick={() => setRevealed(true)}
            className="mt-6 rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-900"
          >
            Hiện đáp án
          </button>
        )}
      </div>

      {revealed && (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {RATINGS.map((r) => (
            <button key={r.quality} onClick={() => rate(r.quality)} className={`rounded-md px-3 py-2 text-sm font-medium ${r.cls}`}>
              {r.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

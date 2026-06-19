/** UI dùng chung cho mọi công cụ — đảm bảo ghi chú/hướng dẫn trình bày nhất quán (rule in-app-guidance). */

export const inputCls =
  "w-full rounded-md border border-slate-300 px-2 py-1 text-sm focus:border-indigo-500 focus:outline-none";

/** Parse danh sách số ngăn cách bởi dấu phẩy / khoảng trắng / xuống dòng. */
export function parseNums(s: string): number[] {
  return s
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map(Number)
    .filter((n) => !Number.isNaN(n));
}

export const safe = <T,>(fn: () => T): T | null => {
  try {
    return fn();
  } catch {
    return null;
  }
};

export function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 py-1 border-b border-slate-100 last:border-0">
      <span className="text-slate-600">{label}</span>
      <span className="font-mono font-medium text-slate-900">{value}</span>
    </div>
  );
}

export function Field({
  label,
  value,
  onChange,
  area,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
}) {
  return (
    <>
      <label className="block text-xs text-slate-500">{label}</label>
      {area ? (
        <textarea className={inputCls} rows={2} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </>
  );
}

/**
 * Khung công cụ chuẩn theo rule in-app-guidance:
 * - note: giải thích công cụ tính gì + liên hệ thực tế
 * - steps: hướng dẫn các bước dùng ngay trên app
 * - book: trỏ đúng mục trong sách (đã đối chiếu PDF)
 */
export function Tool({
  title,
  note,
  steps,
  book,
  children,
}: {
  title: string;
  note: string;
  steps: string[];
  book: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <h4 className="font-semibold text-slate-800">{title}</h4>
      <p className="mt-1 rounded bg-amber-50 px-2 py-1 text-xs leading-snug text-amber-800">{note}</p>
      <div className="mt-2">
        <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Cách dùng</div>
        <ol className="mt-0.5 list-decimal space-y-0.5 pl-4 text-xs text-slate-500">
          {steps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ol>
      </div>
      <div className="mt-3 space-y-3">{children}</div>
      <p className="mt-3 border-t border-slate-100 pt-2 text-[11px] text-indigo-600">📖 {book}</p>
    </div>
  );
}

export function SectionHeader({ n, title }: { n: number; title: string }) {
  return (
    <h3 className="mt-8 mb-3 border-l-4 border-indigo-500 pl-3 text-lg font-bold text-slate-800">
      {n}. {title}
    </h3>
  );
}

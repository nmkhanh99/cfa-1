# ROADMAP

Theo PLAN.md (v2) — application-first, đúng thứ tự sách, làm Quant (L1V1) trước.

## Done
- P0 — Scaffold app + engine test harness (Vite/React/TS/Tailwind/Vitest).
- P1 — Slice 1: **Portfolio Return Analyzer (LM1 — Rates and Returns)**: engine + UI + 32 test đối chiếu sách.
- Menu điều hướng theo cấu trúc sách (Volume L1V1 → Topic → Module → Section).
- 4 tài liệu dự án khởi tạo.

## In Progress
- (trống)

## Next
- P2 — Slice 2: **Valuation & No-Arbitrage Workbench (LM2 — The Time Value of Money in Finance)**: định giá bond/equity, implied return/growth, implied forward rates, forward FX, option qua cash flow additivity. Bổ sung section đúng heading LM2 vào `curriculum.ts`.

## Later
- P3 — Return Distribution Lab (LM3).
- P4 — Khung học chung: tiến độ theo LOS, flashcard SRS (SM-2), dashboard, export/import JSON có version (IndexedDB).
- P5–P11 — Các slice LM4–LM11.
- Pipeline bóc nội dung reader/quiz từ PDF (hỗ trợ, làm dần theo slice).
- Mở rộng sang các Volume/Topic khác (Economics, FSA, ...).

## Technical Debt
- `npm audit` còn vulnerability ở devDependency — rà soát sau.
- Chưa có test cho lớp UI (mới test engine).
- Engine mới phủ LM1; cần thêm `lib/quant/*` cho các module sau.

# ROADMAP

Theo PLAN.md (v2) — application-first, đúng thứ tự sách, làm Quant (L1V1) trước.

## Done
- P0 — Scaffold app + engine test harness (Vite/React/TS/Tailwind/Vitest).
- P1 — Slice 1: **Portfolio Return Analyzer (LM1 — Rates and Returns)**: engine + UI + 34 test đối chiếu sách.
- P2 — Slice 2: **Valuation & No-Arbitrage Workbench (LM2 — The Time Value of Money in Finance)**: engine `tvm.ts` + UI + 26 test; tách `components/ToolKit.tsx` dùng chung.
- Menu điều hướng theo cấu trúc sách (Volume L1V1 → Topic → Module → Section).
- Tuân thủ rule Curriculum-Ordered Development: section render theo `curriculum.ts`, thêm tool section "Interest Rates", thêm nhóm Prerequisite trong L1V1.
- 4 tài liệu dự án khởi tạo.

## In Progress
- (trống)

## Next
- P3 — Slice 3: **Return Distribution Lab (LM3 — Statistical Measures of Asset Returns)**: central tendency/location, dispersion, downside deviation, CV, skew/kurtosis, correlation 2 tài sản. Đọc lại mục lục LM3 trong PDF rồi khai báo section vào `curriculum.ts`.

## Later
- P4 — Khung học chung: tiến độ theo LOS, flashcard SRS (SM-2), dashboard, export/import JSON có version (IndexedDB).
- P5–P11 — Các slice LM4–LM11.
- Pipeline bóc nội dung reader/quiz từ PDF (hỗ trợ, làm dần theo slice).
- Mở rộng sang các Volume/Topic khác (Economics, FSA, ...).

## Technical Debt
- `npm audit` còn vulnerability ở devDependency — rà soát sau.
- Chưa có test cho lớp UI (mới test engine).
- Engine mới phủ LM1; cần thêm `lib/quant/*` cho các module sau.

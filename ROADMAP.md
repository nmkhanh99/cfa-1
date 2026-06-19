# ROADMAP

Theo PLAN.md (v2) — application-first, đúng thứ tự sách, làm Quant (L1V1) trước.

## Done
- P0 — Scaffold app + engine test harness (Vite/React/TS/Tailwind/Vitest).
- P1 — Slice 1: **Portfolio Return Analyzer (LM1 — Rates and Returns)**: engine + UI + 34 test đối chiếu sách.
- P2 — Slice 2: **Valuation & No-Arbitrage Workbench (LM2 — The Time Value of Money in Finance)**: engine `tvm.ts` + UI + 26 test; tách `components/ToolKit.tsx` dùng chung.
- P3 — Slice 3: **Return Distribution Lab (LM3 — Statistical Measures of Asset Returns)**: engine `stats.ts` + UI + 20 test.
- P4 — Slice 4: **Scenario & Bayes Decision Tree (LM4 — Probability Trees and Conditional Expectations)**: engine `probability.ts` + UI + 15 test.
- P5 — Slice 5: **Portfolio Risk Builder (LM5 — Portfolio Mathematics)**: engine `portfolio.ts` + UI + 21 test.
- P6 — Slice 6: **Monte Carlo & Bootstrap Simulator (LM6 — Simulation Methods)**: engine `simulation.ts` + UI + 13 test.
- P7 — Slice 7: **Sampling & Confidence Interval Studio (LM7 — Estimation and Inference)**: engine `inference.ts` + UI + 9 test.
- P8 — Slice 8: **Hypothesis Test Runner (LM8 — Hypothesis Testing for Finance)**: engine `hypothesis.ts` + UI + 15 test.
- P9 — Slice 9: **Independence Tester (LM9 — Parametric and Non-Parametric Tests of Independence)**: engine `independence.ts` + UI + 13 test.
- P10 — Slice 10: **Regression Workbench (LM10 — Simple Linear Regression)**: engine `regression.ts` + UI + 16 test (tổng 175 test pass).
- Menu điều hướng theo cấu trúc sách (Volume L1V1 → Topic → Module → Section).
- Tuân thủ rule Curriculum-Ordered Development: section render theo `curriculum.ts`, thêm tool section "Interest Rates", thêm nhóm Prerequisite trong L1V1.
- 4 tài liệu dự án khởi tạo.

## In Progress
- (trống)

## Next
- P11 — Slice 11: **Fintech / Big Data Concepts (LM11 — Introduction to Big Data Techniques)**: mô tả fintech, AI/ML, Big Data (nhẹ tính toán). Đọc lại mục lục LM11 trong PDF rồi khai báo section vào `curriculum.ts`. Đây là module cuối của Quant.

## Later
- Khung học chung: tiến độ theo LOS, flashcard SRS (SM-2), dashboard, export/import JSON có version (IndexedDB).
- P5–P11 — Các slice LM5–LM11.
- Pipeline bóc nội dung reader/quiz từ PDF (hỗ trợ, làm dần theo slice).
- Mở rộng sang các Volume/Topic khác (Economics, FSA, ...).

## Technical Debt
- `npm audit` còn vulnerability ở devDependency — rà soát sau.
- Chưa có test cho lớp UI (mới test engine).
- Engine đã phủ LM1–LM3 (`returns.ts`, `tvm.ts`, `stats.ts`); cần thêm cho các module sau.

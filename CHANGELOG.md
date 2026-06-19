# CHANGELOG

## 2026-06-20 (b) — Tuân thủ rule Curriculum-Ordered Development

### Added
- Section "Interest Rates and Time Value of Money" trong LM1 có công cụ **Interest Rate Builder** (lãi suất = real risk-free + các premium) + 2 test.
- Thêm "Introduction" vào mục lục LM1 (đúng heading sách).
- Menu L1V1 thêm nhóm **Prerequisite — Ôn nền (Quant)** gồm 6 module (planned), đúng tinh thần "prerequisite là bổ trợ của Volume, không tách riêng".

### Changed
- `ReturnAnalyzer` render section **theo `curriculum.ts`** (id/tiêu đề/số thứ tự tự động), bỏ hardcode → hết lệch số thứ tự với mục lục.

### Fixed
- Guard hiển thị ReturnAnalyzer theo đúng topic (quant) + module 1, tránh nhầm với module trùng id ở topic khác.

### Technical
- Thêm `interestRateFromComponents` vào engine; test tăng lên 34, pass.

## 2026-06-20

### Added
- Khởi tạo web app `cfa-app` (React + TypeScript + Vite + Tailwind v4).
- Menu điều hướng theo đúng cấu trúc sách: Volume L1V1 → Topic → Learning Module → Section (`data/curriculum.ts`).
- Engine tính lợi suất LM1 `lib/quant/returns.ts`: HPR, linked HPR, arithmetic/geometric/harmonic mean, money-weighted (IRR), time-weighted, annualize (theo kỳ & theo ngày), continuously compounded, real, after-tax, leveraged return.
- Ứng dụng **Portfolio Return Analyzer** (LM1 — Rates and Returns), công cụ nhóm theo đúng heading sách.
- Bộ test Vitest đối chiếu ví dụ/đáp án trong 2024 L1V1.pdf (32 test, pass).
- 4 tài liệu dự án: DEVELOPMENT.md, USER_GUIDE.md, CHANGELOG.md, ROADMAP.md.

### Technical
- `.gitignore`: bỏ qua `node_modules/`, `dist/`.
- Cấu hình Vite + Vitest dùng chung; TypeScript strict.

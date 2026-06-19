# CHANGELOG

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

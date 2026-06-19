# CHANGELOG

## 2026-06-20 (m) — P10: LM10 Simple Linear Regression

### Added
- Engine `lib/quant/regression.ts`: OLS (slope/intercept), ANOVA (SST/SSR/SSE), R², SEE, F, standard error & t-stat của slope, prediction + prediction interval (standard error of forecast), log transform cho functional forms — 16 test đối chiếu Example ROA~CAPEX (slope 1.25, R² 0.8001, F 16.01, PI {2.0013, 22.7487}).
- Ứng dụng **Regression Workbench** (LM10): OLS estimation, ANOVA & goodness of fit, slope test, prediction interval, functional forms (log-lin/lin-log/log-log).
- Section LM10 trong `curriculum.ts` (đúng mục lục); bật LM10 sang "available".

## 2026-06-20 (l) — P9: LM9 Parametric and Non-Parametric Tests of Independence

### Added
- Engine `lib/quant/independence.ts`: correlation t-test (parametric), Spearman rank correlation (xếp hạng + xử lý ties), chi-square test độc lập trên bảng contingency (tự tính tần số kỳ vọng) — 12 test đối chiếu Example LM9 (t=2.656, rs=−0.204, χ²=32.08).
- Ứng dụng **Independence Tester** (LM9): parametric correlation t-test, Spearman, chi-square contingency.
- Section LM9 trong `curriculum.ts` (đúng mục lục); bật LM9 sang "available".

## 2026-06-20 (k) — P8: LM8 Hypothesis Testing for Finance

### Added
- Engine `lib/quant/hypothesis.ts`: t-test một trung bình, χ²-test một phương sai, pooled variance & t-test 2 mẫu độc lập, paired t-test, F-test 2 phương sai, quyết định 2 phía, p-value xấp xỉ chuẩn — 12 test đối chiếu Example LM8 (Sendar, ACE indexes, regulation change).
- Ứng dụng **Hypothesis Test Runner** (LM8): test decision & p-value, single-mean t, single-variance χ², two-sample/paired t, F-test.
- Section LM8 trong `curriculum.ts` (đúng mục lục); bật LM8 sang "available".

## 2026-06-20 (j) — P7: LM7 Estimation and Inference

### Added
- Engine `lib/quant/inference.ts`: standard error của trung bình mẫu, variance của trung bình mẫu (σ²/n), cỡ mẫu cần cho SE mục tiêu, mô phỏng CLT (phân phối trung bình mẫu) — 8 test (Biggs n=36/576, CLT std ≈ σ/√n).
- Ứng dụng **Sampling & Confidence Interval Studio** (LM7): standard error, required sample size, CLT simulator, empirical SE via bootstrap.
- Section LM7 trong `curriculum.ts` (đúng mục lục); bật LM7 sang "available".

## 2026-06-20 (i) — P6: LM6 Simulation Methods

### Added
- Engine `lib/quant/simulation.ts`: lognormal mean/variance, cc returns & annualized volatility, future price, PRNG mulberry32 + gaussian (Box–Muller), Monte Carlo giá cuối kỳ, bootstrap resample & statistic — 12 test (lognormal known values, Astra vol 33.6%, mô phỏng tái lập theo seed).
- Ứng dụng **Monte Carlo & Bootstrap Simulator** (LM6), công cụ nhóm theo đúng heading sách + đầy đủ ghi chú/hướng dẫn/trỏ mục.
- Section LM6 trong `curriculum.ts` (đúng mục lục); bật LM6 sang "available".

## 2026-06-20 (h) — P5: LM5 Portfolio Mathematics

### Added
- Engine `lib/quant/portfolio.ts`: portfolio expected return, variance/std từ ma trận hiệp phương sai, two-asset risk, cov↔corr, covariance từ joint probability, safety-first ratio, normal CDF, shortfall probability — 18 test đối chiếu Example LM5.
- Ứng dụng **Portfolio Risk Builder** (LM5), công cụ nhóm theo đúng heading sách + đầy đủ ghi chú/hướng dẫn/trỏ mục.
- Section LM5 trong `curriculum.ts` (đúng mục lục); bật LM5 sang "available".

## 2026-06-20 (g) — P4: LM4 Probability Trees and Conditional Expectations

### Added
- Engine `lib/quant/probability.ts`: expected value, variance, std (rời rạc), total probability rule for expected value, Bayes unconditional & posteriors — 14 test đối chiếu Example LM4 (BankCorp, bond recovery, tech firm, DriveMed).
- Ứng dụng **Scenario & Bayes Decision Tree** (LM4), công cụ nhóm theo đúng heading sách + đầy đủ ghi chú/hướng dẫn/trỏ mục.
- Section LM4 trong `curriculum.ts` (đúng mục lục); bật LM4 sang "available".

## 2026-06-20 (f) — P3: LM3 Statistical Measures of Asset Returns

### Added
- Engine `lib/quant/stats.ts`: mean, median, mode, range, MAD, sample variance/std, target semideviation, CV, skewness, excess kurtosis, covariance, correlation — 20 test đối chiếu Example LM3 (gồm Anscombe Quartet corr ≈ 0.82).
- Ứng dụng **Return Distribution Lab** (LM3), công cụ nhóm theo đúng heading sách + đầy đủ ghi chú/hướng dẫn/trỏ mục.
- Section LM3 trong `curriculum.ts` (đúng mục lục); bật LM3 sang "available".

## 2026-06-20 (e) — P2: LM2 The Time Value of Money in Finance

### Added
- Engine `lib/quant/tvm.ts`: PV discount/coupon bond, perpetuity, annuity payment, implied return (FI), constant/Gordon/two-stage DDM, implied return & growth (equity), PV cash flow stream, implied forward rate, forward FX (no-arbitrage), binomial call/put — 26 test đối chiếu Example LM2.
- Ứng dụng **Valuation & No-Arbitrage Workbench** (LM2), công cụ nhóm theo đúng heading sách + đầy đủ ghi chú/hướng dẫn/trỏ mục (rule in-app-guidance).
- Section LM2 trong `curriculum.ts` (đúng mục lục); bật LM2 sang "available".

### Changed
- Tách UI guidance dùng chung ra `components/ToolKit.tsx`; `ReturnAnalyzer` dùng lại để trình bày nhất quán.

## 2026-06-20 (d) — Nâng LM1 theo rule in-app-guidance

### Added
- Mỗi công cụ trong Portfolio Return Analyzer (LM1) có: ghi chú giải thích (tính gì + liên hệ thực tế), khối "Cách dùng" các bước, và dòng 📖 trỏ đúng mục sách (Module · Section · Example, đã đối chiếu PDF).
- Banner nhắc dữ liệu mẫu là ví dụ trong sách + quy ước nhập số thập phân.

### Changed
- Tách component `Field` dùng chung; chuẩn hóa trình bày ghi chú/hướng dẫn cho mọi công cụ.

## 2026-06-20 (c) — Thêm rule phát triển

### Technical
- Thêm rule `in-app-guidance` (Always On): công cụ phải có ghi chú giải thích, trỏ mục sách khi cần, và hướng dẫn các bước đầy đủ ngay trên app.
- Thêm rule `reread-book-when-needed` (Always On): khi cần đối chiếu nội dung/công thức/thứ tự/ví dụ phải đọc lại PDF curriculum để xác minh, không suy đoán từ trí nhớ.

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

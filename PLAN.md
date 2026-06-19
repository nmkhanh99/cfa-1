# Kế hoạch: App học CFA Level 1 — Quantitative Methods (v2, application-first)

> Triết lý: **học bằng cách dựng công cụ phân tích thật** chạy trên lý thuyết CFA, không phải đẩy flashcard/quiz nguyên si từ sách lên.
> Mỗi phần kiến thức → một **ứng dụng thực tế** (nhận dữ liệu → tính toán → ra quyết định/báo cáo). Reader/quiz/flashcard chỉ là lớp hỗ trợ bao quanh từng ứng dụng.

## 0. Thay đổi quan trọng so với v1 (sau review)
- **Nguồn nội dung:** dùng **`2024 L1V1.pdf`** (sách chính, 11 Learning Module thi thật) làm nguồn chính.
  `L1V1-Prerequisite Quant.pdf` chỉ là **ôn nền tảng** (6 module cơ bản) → dùng làm tài liệu bổ trợ, KHÔNG phải xương sống app.
- **Thứ tự ưu tiên:** ứng dụng thực tế đi TRƯỚC; reader/quiz/flashcard đi SAU và phục vụ ứng dụng.
- **Kiểm chứng:** test bằng đáp án có sẵn trong sách (ground truth độc lập), không để code tự chấm chính nó.

## 1. Quyết định đã chốt
- **Nền tảng:** Web app (PC + điện thoại).
- **Tính năng:** Ứng dụng phân tích tương tác (trọng tâm) · Quiz/Practice · Flashcard + SRS · Đọc bài + ghi chú · Theo dõi tiến độ.
- **Nội dung:** bóc tách từ PDF curriculum (dùng cá nhân).
- **Phạm vi MVP:** Quant trước, theo đúng 11 module của sách chính.

## 2. Đúng 11 Learning Module (nguồn: 2024 L1V1.pdf) → ứng dụng tương ứng

| LM | Tên module (sách chính) | Ứng dụng thực tế sẽ dựng |
|----|--------------------------|---------------------------|
| 1 | Rates and Returns | **Portfolio Return Analyzer** — nhập giao dịch/NAV (CSV), tính HPR, arithmetic/geometric/harmonic mean, **money-weighted (IRR)**, **time-weighted**, annualized, continuously compounded, gross/net, pre/after-tax, real, leveraged return → báo cáo so sánh |
| 2 | The Time Value of Money in Finance | **Valuation & No-Arbitrage Workbench** — định giá bond/equity từ dòng tiền, implied return & implied growth, cash flow additivity, **implied forward rates**, forward FX, định giá option bằng CF additivity |
| 3 | Statistical Measures of Asset Returns | **Return Distribution Lab** — nhập chuỗi lợi suất → central tendency/location, dispersion, downside deviation, CV, skew/kurtosis, **correlation 2 tài sản** + scatter |
| 4 | Probability Trees & Conditional Expectations | **Scenario & Bayes Decision Tree** — dựng cây kịch bản, expected value, conditional expectation, cập nhật Bayes |
| 5 | Portfolio Mathematics | **Portfolio Risk Builder** — expected return, variance, covariance/correlation danh mục, shortfall risk, **Roy's safety-first** |
| 6 | Simulation Methods | **Monte Carlo & Bootstrap Simulator** — mô hình giá lognormal, mô phỏng MC, bootstrap resampling |
| 7 | Estimation and Inference | **Sampling & Confidence Interval Studio** — sampling methods, **CLT (mô phỏng)**, standard error, CI, resampling |
| 8 | Hypothesis Testing for Finance | **Hypothesis Test Runner** — t-test 1 mẫu/2 mẫu, test phương sai, p-value, sai lầm loại I/II, power |
| 9 | Parametric & Non-Parametric Tests of Independence | **Independence Tester** — correlation t-test, Spearman, chi-square bảng contingency |
| 10 | Simple Linear Regression | **Regression Workbench** — OLS, ANOVA, SEE, kiểm định fit & hệ số, prediction interval, các dạng hàm |
| 11 | Introduction to Big Data Techniques | Module mô tả (fintech, AI/ML, Big Data) — nhẹ về tính toán, nặng reader/quiz + 1 demo ML nhỏ |

LOS lấy từ Topic Outline, gắn vào từng ứng dụng. (LM12 = Appendices/bảng tra → đưa vào dạng công cụ tra cứu.)

## 3. Mô hình "vertical slice" (mỗi module làm trọn 1 lát dọc)
Mỗi slice giao đủ 5 lớp, theo thứ tự:
1. **App** — công cụ phân tích nhận dữ liệu thật → kết quả + **báo cáo/diễn giải** (cốt lõi).
2. **Engine** — hàm tính trong `lib/quant/`, có **test độc lập từ ví dụ trong sách**.
3. **LOS mapping** — mỗi nút chức năng gắn với LOS tương ứng.
4. **Quiz** — bài tập áp dụng chính công cụ đó (không chỉ hỏi lý thuyết suông).
5. **Reader + Flashcard** — lý thuyết & công thức nền, đặt cạnh app để tra khi cần.

App được coi là "xong" chỉ khi chạy end-to-end với dữ liệu thật và engine pass test độc lập.

## 4. Tech stack (đơn giản, local-first, chưa cần server)
- React + Vite + TypeScript + Tailwind CSS.
- KaTeX (công thức), Recharts/SVG (biểu đồ), PapaParse (đọc CSV).
- **Engine tính toán:** `lib/quant/` thuần TS, tách khỏi UI, test bằng Vitest.
- Lưu trữ: IndexedDB (Dexie) cho tiến độ/ghi chú/SRS + **export/import JSON có version**.
- Pipeline bóc PDF: Python + PyMuPDF → JSON (chạy offline, không nằm trong app runtime).

## 5. Cấu trúc thư mục
```
cfa-app/
  scripts/extract/         # Python bóc PDF → JSON (offline)
  scripts/fixtures/        # golden fixtures: ví dụ số lấy từ Solutions trong sách
  public/content/quant/    # JSON bài học/quiz đã sinh
  src/
    lib/quant/             # engine tính toán thuần (returns, tvm, stats, regression...)
    lib/quant/__tests__/   # test độc lập đối chiếu đáp án sách
    data/                  # loader + type + schema version
    apps/                  # các ứng dụng vertical slice (return-analyzer, tvm-workbench...)
    features/reader/ quiz/ flashcards/ progress/
    components/
```

## 6. Roadmap (application-first, mỗi bước có tiêu chí kiểm chứng)
- **P0 — Scaffold + engine harness:** Vite+React+TS+Tailwind+Vitest; tạo `lib/quant` rỗng + cơ chế fixtures; tạo 4 file tài liệu (DEVELOPMENT/USER_GUIDE/CHANGELOG/ROADMAP).
  - *Verify:* `npm run dev` mở trang chủ; `npm test` chạy được 1 test mẫu.
- **P1 — Slice 1: Portfolio Return Analyzer (LM1):** engine returns + UI nhập CSV/giao dịch → báo cáo các loại return + diễn giải; quiz áp dụng; reader LM1.
  - *Verify:* mọi hàm return khớp **đáp án Examples/Solutions của LM1**; nhập 1 bộ giao dịch mẫu ra MWRR/TWRR đúng tay tính.
- **P2 — Slice 2: Valuation & No-Arbitrage Workbench (LM2).**
  - *Verify:* định giá bond/equity, implied forward rate khớp ví dụ LM2.
- **P3 — Slice 3: Return Distribution Lab (LM3).**
  - *Verify:* mean/dispersion/skew/kurtosis/correlation khớp ví dụ LM3.
- **P4 — Khung học chung:** tiến độ theo LOS, flashcard SRS (SM-2), dashboard — dùng lại cho mọi slice.
  - *Verify:* tick LOS + ôn flashcard lưu IndexedDB; export/import JSON khôi phục đúng.
- **P5..P11 — Các slice còn lại (LM4–LM11)** theo cùng khuôn vertical slice.
- **P-content — Pipeline nội dung (hỗ trợ, làm dần theo từng slice):** bóc reader/quiz từ PDF.
  - *Verify:* validate schema + map LOS↔question↔solution; lưu số trang nguồn; quarantine bản ghi lỗi; spot-review mỗi module.

## 7. Hàng rào kiểm chứng (rút ra từ review)
- **Engine test độc lập:** mỗi hàm trong `lib/quant` có test đối chiếu **đáp án có sẵn trong sách** (ground truth ≠ code của mình). Thêm property test, edge case, quy ước day-count/compounding, tolerance số học.
- **Không tự xác nhận:** quiz và app dùng chung engine, nhưng engine được nghiệm thu bằng fixtures từ sách, không bằng chính nó.
- **Pipeline nội dung:** lưu provenance theo trang, validate schema/LOS mapping, golden fixtures cho item có công thức/bảng, quarantine bản lỗi.
- **An toàn dữ liệu học:** export/import JSON có `schemaVersion`, nhắc backup; migration Dexie có test trước khi coi progress là xong.

## 8. Mở rộng sau Quant
- Áp dụng khuôn vertical-slice cho 9 topic còn lại (Economics, FSA, Equity, Fixed Income...).
- Tùy chọn: Claude API sinh thêm câu hỏi/diễn giải; backend đồng bộ đa thiết bị; mock exam.

## 9. Bản quyền
Nội dung CFA có bản quyền — chỉ dùng **cá nhân**, không phân phối/đăng công khai dữ liệu bóc tách (đã gitignore toàn bộ folder sách).

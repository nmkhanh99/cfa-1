# USER_GUIDE.md — App học CFA (Quant)

## App dùng để làm gì
Học CFA Level I bằng cách **dùng công cụ phân tích thật** dựng trên lý thuyết trong sách, thay vì chỉ đọc/nhớ. App đi đúng thứ tự tài liệu; mỗi phần ghi đúng tên mục theo sách.

## Mở app
```
cd cfa-app
npm install
npm run dev
```
Mở trình duyệt tại `http://localhost:5173`.

## Cách dùng
1. **Chọn nội dung ở menu trái** — menu phân cấp theo sách: Volume **L1V1** → Topic (Quantitative Methods / Economics) → Learning Module 1…11, đúng thứ tự sách.
2. **Xem "Mục lục theo sách"** của module — các section ghi đúng heading nguyên văn.
3. **Dùng ứng dụng của module.** Hiện đã có **Learning Module 1 — Rates and Returns → Portfolio Return Analyzer**.

## Portfolio Return Analyzer (LM1)
Các công cụ được nhóm đúng theo mục trong sách:
- **Rates of Return:** Holding Period Return; Arithmetic/Geometric mean & linked HPR; Harmonic mean (cost averaging).
- **Money-Weighted and Time-Weighted Return:** MWR (IRR) từ dòng tiền; TWR liên kết HPR từng kỳ.
- **Annualized Return:** annualize theo số kỳ/năm hoặc số ngày; continuously compounded return.
- **Other Major Return Measures:** real return, after-tax return, leveraged return.

Cách dùng: nhập số vào ô (chuỗi return cách nhau bởi dấu phẩy), kết quả hiện ngay bên dưới mỗi công cụ.

**Mỗi công cụ đều có sẵn ngay trên app:**
- **Ghi chú (ô vàng):** giải thích công cụ tính gì và liên hệ thực tế.
- **Cách dùng:** các bước thực hiện đầy đủ (nhập gì, định dạng, đọc kết quả ở đâu).
- **📖 Trỏ mục sách:** vị trí trong sách (Volume · Module · Section · Example) để tra cứu sâu hơn.
- Số nhập ở dạng thập phân (0.15 = 15%). Ô điền sẵn là ví dụ lấy từ sách để đối chiếu đáp án.

## Valuation & No-Arbitrage Workbench (LM2)
Định giá theo giá trị thời gian của tiền, nhóm đúng mục sách:
- **Time Value of Money in Fixed Income and Equity:** PV trái phiếu chiết khấu/coupon, perpetuity, khoản trả góp (mortgage), Gordon growth & two-stage DDM.
- **Implied Return and Growth:** suy lợi suất ẩn của trái phiếu; required return & implied growth của cổ phiếu.
- **Cash Flow Additivity:** PV chuỗi dòng tiền, implied forward rate, forward FX (no-arbitrage), định giá option nhị thức 1 kỳ (call/put).

## Return Distribution Lab (LM3)
Phân tích phân phối lợi suất, nhóm đúng mục sách:
- **Measures of Central Tendency and Location:** mean, median, mode.
- **Measures of Dispersion:** range, MAD, variance, std, CV, target downside deviation.
- **Measures of Shape of a Distribution:** skewness, excess kurtosis.
- **Correlation between Two Variables:** covariance, correlation (2 chuỗi X, Y).

## Portfolio Risk Builder (LM5)
Lợi suất & rủi ro danh mục, nhóm đúng mục sách:
- **Portfolio Expected Return and Variance of Return:** E(Rp), rủi ro 2 tài sản, đổi covariance↔correlation.
- **Covariance Given a Joint Probability Function:** covariance từ hàm xác suất đồng thời.
- **Portfolio Risk Measures (Normal Distribution):** safety-first ratio (Roy), xác suất shortfall.

## Monte Carlo & Bootstrap Simulator (LM6)
Mô phỏng & mô hình giá, nhóm đúng mục sách:
- **Lognormal Distribution and Continuous Compounding:** mean/variance lognormal, volatility năm hoá từ chuỗi giá.
- **Monte Carlo Simulation:** mô phỏng giá cuối kỳ (giá TB, khoảng 5%–95%, xác suất lỗ) — có seed để tái lập.
- **Bootstrapping:** rút lại có hoàn lại để ước lượng sai số chuẩn của trung bình.

## Sampling & Confidence Interval Studio (LM7)
Lấy mẫu & suy diễn, nhóm đúng mục sách:
- **Central Limit Theorem and Inference:** standard error (s/√n), cỡ mẫu cần thiết, CLT simulator (std trung bình mẫu ≈ σ/√n).
- **Bootstrapping and Empirical Sampling Distributions:** ước lượng standard error bằng bootstrap, so với công thức.
- (*Sampling Methods* là phần lý thuyết — xem trong sách.)

## Hypothesis Test Runner (LM8)
Kiểm định giả thuyết, nhóm đúng mục sách:
- **Hypothesis Tests for Finance:** quyết định theo giá trị tới hạn & p-value.
- **Tests of Return and Risk in Finance:** t-test một trung bình, χ²-test một phương sai, t-test 2 mẫu độc lập (pooled), paired t-test, F-test 2 phương sai.
- (*Parametric vs Nonparametric* là phần lý thuyết — xem trong sách.)

## Independence Tester (LM9)
Kiểm định độc lập, nhóm đúng mục sách:
- **Tests Concerning Correlation:** parametric correlation t-test; Spearman rank correlation (phi tham số) + t-test.
- **Tests of Independence Using Contingency Table Data:** chi-square test độc lập cho dữ liệu phân loại.

## Regression Workbench (LM10)
Hồi quy tuyến tính đơn, nhóm đúng mục sách:
- **Estimation:** OLS slope/intercept, phương trình hồi quy.
- **Hypothesis Tests:** ANOVA (SST/SSR/SSE), R², SEE, F; kiểm định slope (t-stat).
- **Prediction:** dự báo Ŷf + khoảng dự báo (standard error of forecast).
- **Functional Forms:** log-lin / lin-log / log-log, so R² để chọn dạng.
- (*Assumptions* là phần lý thuyết — xem trong sách.)

## Big Data Lab (LM11)
Big Data / AI-ML / NLP (module khái niệm — demo thuật toán minh hoạ):
- **Artificial Intelligence and Machine Learning:** k-means clustering (học không giám sát).
- **Tackling Big Data with Data Science:** feature scaling (min-max, z-score); text analytics & NLP (tần suất từ, điểm cảm xúc).
- (*Fintech / Big Data* là phần lý thuyết — xem trong sách.)

## Khung học chung (tiến độ, ghi chú, flashcard)
- **Tiến độ & Ghi chú:** trong mỗi module có khối "Tiến độ & Ghi chú" — tick section đã học và ghi chú; lưu tự động trong trình duyệt.
- **📊 Dashboard** (menu trái): xem % section đã học theo từng module/topic và số flashcard đến hạn; **Export/Import JSON** để sao lưu hoặc chuyển máy.
- **🗂️ Flashcards** (menu trái): ôn thẻ công thức theo spaced repetition (SM-2). Bấm "Hiện đáp án" rồi tự đánh giá Quên/Khó/Được/Dễ — app tự lên lịch ôn lại.
- **Lưu trữ:** dữ liệu nằm trong trình duyệt (localStorage). Xoá dữ liệu trình duyệt sẽ mất tiến độ → nên Export định kỳ.

## Giải thích nhanh thuật ngữ
- **HPR:** lợi suất nắm giữ một kỳ = (giá cuối − giá đầu + thu nhập)/giá đầu.
- **Arithmetic vs Geometric mean:** trung bình cộng dùng cho ước tính 1 kỳ; trung bình nhân phản ánh tăng trưởng kép nhiều kỳ.
- **MWR (money-weighted):** chính là IRR của dòng tiền, nhạy với thời điểm & quy mô nạp/rút.
- **TWR (time-weighted):** loại bỏ ảnh hưởng nạp/rút, dùng để đánh giá nhà quản lý quỹ.
- **Real return:** lợi suất sau khi loại lạm phát.
- **Leveraged return:** lợi suất trên vốn chủ khi có vay nợ.

## Các tính năng chưa có (sẽ bổ sung)
- Đọc bài + ghi chú, quiz, flashcard SRS, theo dõi tiến độ: **Chưa có** (xem ROADMAP.md).
- Ứng dụng cho LM2–LM11: **Sẽ bổ sung sau**, theo đúng thứ tự tài liệu.

## Lỗi thường gặp
- Trang trắng / không mở được: kiểm tra đã `npm install` và đang chạy `npm run dev` trong thư mục `cfa-app`.
- Kết quả hiện "—": dữ liệu nhập chưa hợp lệ (vd dòng tiền không đổi dấu nên không tính được IRR; giá ≤ 0 cho harmonic mean).

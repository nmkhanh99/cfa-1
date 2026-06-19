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

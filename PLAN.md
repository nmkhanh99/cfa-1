# Kế hoạch: App học CFA Level 1 (MVP — Quantitative Methods)

> Mục tiêu: học CFA bằng cách **hiểu + làm**, không chỉ đọc thuộc.
> MVP làm trọn vẹn mảng **Quantitative Methods** (đã có sẵn PDF prerequisite), chạy được rồi mở rộng sang 9 topic còn lại.

## 1. Quyết định đã chốt
- **Nền tảng:** Web app (chạy trình duyệt, dùng được cả PC lẫn điện thoại).
- **Tính năng:** Quiz/Practice · Flashcard + SRS · Đọc bài + ghi chú · Theo dõi tiến độ · **Labs tương tác (trọng tâm)**.
- **Nội dung:** bóc tách tự động từ PDF curriculum (dùng cá nhân).
- **Phạm vi MVP:** chỉ Quant (7 Learning Module).

## 2. Tech stack (ưu tiên đơn giản, local-first, không cần server cho MVP)
- **Frontend:** React + Vite + TypeScript + Tailwind CSS.
- **Công thức toán:** KaTeX (render LaTeX).
- **Biểu đồ:** Recharts (hoặc SVG/canvas tự vẽ cho lab cần tương tác mạnh).
- **Lưu trữ:** local-first — nội dung là JSON tĩnh; tiến độ/ghi chú/SRS lưu IndexedDB (Dexie).
- **Pipeline bóc PDF:** Python + PyMuPDF (đã cài) → xuất JSON.
- **Không backend** ở MVP. Khi cần đồng bộ nhiều thiết bị mới thêm sau.

## 3. Mô hình dữ liệu
```
Topic (Quant)
 └─ Module (7)            # vd: Interest Rates, PV, FV
     ├─ LOS[]             # Learning Outcome Statements (checklist)
     ├─ Lesson sections[] # lý thuyết theo mục, có công thức
     ├─ Flashcards[]      # khái niệm/công thức → SRS
     ├─ Questions[]       # practice problems + đáp án + lời giải
     └─ Labs[]            # widget tương tác gắn với module
```
LOS lấy từ Topic Outline. Lesson/Questions/Solutions bóc từ PDF prerequisite (mỗi module có sẵn Summary + Practice Problems + Solutions).

## 4. Cấu trúc thư mục
```
cfa-app/
  scripts/extract/        # script Python bóc PDF → JSON
  public/content/quant/    # JSON đã sinh (7 module)
  src/
    lib/finance/          # hàm TVM, thống kê — DÙNG CHUNG cho Labs + chấm Quiz
    data/                 # loader + type
    features/
      reader/             # đọc bài + ghi chú + tick LOS
      quiz/               # luyện câu hỏi, chấm điểm, giải thích
      flashcards/         # SRS (thuật toán SM-2)
      labs/               # widget tương tác
      progress/           # dashboard tiến độ
    components/
```

## 5. Labs tương tác — "học bằng cách làm" (phần khác biệt)
Mỗi module có công cụ để nghịch trực tiếp với lý thuyết:

| Module | Lab tương tác |
|--------|----------------|
| 1. Interest Rates, PV, FV | Máy tính TVM (PV/FV/PMT/N/I) + biểu đồ tăng trưởng; mô phỏng annuity, perpetuity; solve-for-rate; so sánh compounding (annual→continuous) |
| 2. Organizing/Describing Data | Nhập dữ liệu → tự vẽ histogram/box plot; slider xem mean/median/mode đổi; thí nghiệm phương sai, MAD, CV |
| 3. Probability Concepts | Trình dựng cây xác suất; máy tính Bayes; bài toán đếm (hoán vị/tổ hợp) |
| 4. Probability Distributions | Đồ thị normal/binomial/uniform tương tác; tính z-score & xác suất vùng; t/chi-square/F |
| 5. Sampling & Estimation | Mô phỏng CLT (rút mẫu lặp lại → phân phối mẫu); dựng khoảng tin cậy theo slider; tính cỡ mẫu |
| 6. Hypothesis Testing | Trình chạy kiểm định từng bước; trực quan p-value, miền bác bỏ, sai lầm loại I/II, power |

Mỗi lab gắn link tới LOS tương ứng và có vài "thử thách" nhỏ (cho số liệu, hỏi kết quả) → nối thẳng với Quiz.

## 6. Lộ trình theo giai đoạn (mỗi bước có tiêu chí kiểm chứng)

- **P0 — Scaffold:** dựng Vite+React+TS+Tailwind, routing.
  - *Verify:* `npm run dev` mở được trang chủ liệt kê 7 module (rỗng).
- **P1 — Pipeline bóc Quant:** script Python tách lý thuyết / practice problems / solutions → JSON; nhúng LOS từ outline.
  - *Verify:* sinh đủ 7 file JSON; số practice problem & solution khớp PDF; mở review thủ công 1 module.
- **P2 — Reader + ghi chú + tick LOS:** đọc bài theo section, render công thức, ghi chú, đánh dấu LOS đã học (lưu IndexedDB).
  - *Verify:* đọc module 1, tick vài LOS, ghi chú; reload vẫn còn.
- **P3 — Quiz engine:** làm practice problem, chấm điểm, hiện lời giải; thống kê đúng/sai theo LOS.
  - *Verify:* làm hết practice của module 1, điểm & giải thích hiển thị đúng.
- **P4 — Flashcards + SRS:** sinh thẻ từ khái niệm/công thức, ôn theo SM-2.
  - *Verify:* phiên ôn lên lịch lại thẻ theo mức nhớ; trạng thái lưu lại.
- **P5 — Labs tương tác (trọng tâm):** làm lần lượt lab cho từng module (bảng mục 5), bắt đầu Module 1 (TVM).
  - *Verify:* nhập input → kết quả khớp `lib/finance`; đối chiếu vài ví dụ trong sách.
- **P6 — Dashboard tiến độ:** % LOS đã học, điểm quiz theo module, lịch ôn, điểm yếu.
  - *Verify:* dashboard phản ánh đúng dữ liệu các bước trên.

## 7. Mở rộng sau MVP
- Thêm 9 topic còn lại (tái dùng pipeline + khung Labs).
- Tùy chọn: dùng Claude API sinh thêm câu hỏi/giải thích từ LOS.
- Tùy chọn: backend + đồng bộ đa thiết bị, chế độ thi thử full mock exam.

## 8. Lưu ý bản quyền
Nội dung CFA có bản quyền — app chỉ dùng **cá nhân**, không phân phối/đăng công khai dữ liệu bóc tách.

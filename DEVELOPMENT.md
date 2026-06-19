# DEVELOPMENT.md — App học CFA (Quant)

## Tổng quan kiến trúc
Web app học CFA Level I theo hướng **application-first**: mỗi Learning Module của sách → một ứng dụng phân tích thật. Code app nằm trong `cfa-app/`. App local-first, chưa có backend.

## Cấu trúc thư mục
```
cfa/                        # repo gốc
  PLAN.md                   # kế hoạch tổng thể (v2)
  DEVELOPMENT.md USER_GUIDE.md CHANGELOG.md ROADMAP.md
  cfa-app/                  # mã nguồn web app
    src/
      lib/quant/            # engine tính toán thuần (returns.ts) + __tests__
      lib/format.ts         # helper định dạng %/số
      data/curriculum.ts    # cấu trúc Volume→Topic→Module→Section đúng theo sách
      apps/ReturnAnalyzer.tsx  # ứng dụng LM1 (Rates and Returns)
      App.tsx main.tsx index.css
  2024 CFA L1 Curriculum/   # PDF bản quyền (gitignored)
```

## Công nghệ
- React 18 + TypeScript + Vite 5
- Tailwind CSS v4 (qua `@tailwindcss/vite`)
- Vitest (unit test cho engine)
- Recharts, PapaParse (đã cài, sẽ dùng cho biểu đồ / import CSV ở các slice sau)
- Pipeline bóc PDF: Python + PyMuPDF (offline, chưa đưa vào repo)

## Cách chạy local
```
cd cfa-app
npm install
npm run dev        # http://localhost:5173
```

## Test / build
```
cd cfa-app
npm test           # chạy Vitest (hiện 32 test cho engine returns)
npm run build      # tsc -b + vite build
```

## Quy ước code
- Engine (`lib/quant/`) thuần, không phụ thuộc UI, để test độc lập và tái dùng cho cả app lẫn quiz.
- TypeScript strict bật; tên hàm/biến tiếng Anh theo thuật ngữ sách, comment tiếng Việt.
- Cấu trúc nav bám đúng thứ tự & tên mục trong sách (Volume → Topic → Learning Module → Section).

## Quy ước Git
- Branch chính: `main`. Commit kèm cả code và tài liệu liên quan.
- Trailer: `Co-Authored-By: Claude ...`.

## Mô hình dữ liệu / nội dung
- `data/curriculum.ts`: `Volume → Topic → Module → Section`. Section ghi đúng heading sách.
- Engine return (LM1): xem `lib/quant/returns.ts`.
- Lưu tiến độ/ghi chú/SRS: `lib/store.ts` (`AppData` có `schemaVersion`; reducers immutable; serialize/deserialize có migration; export/import). Persistence dùng **localStorage** (đồng bộ, đủ cho 1 thiết bị) — chọn thay IndexedDB cho đơn giản; có abstraction store để đổi sau.
- SRS: `lib/srs.ts` (SM-2). Thống kê tiến độ: `lib/progress.ts`. Flashcard deck: `data/flashcards.ts`. UI khung học: `features/` (ProgressNotes, Dashboard, Flashcards).

## Quyết định kỹ thuật quan trọng
- **Nguồn nội dung = 2024 L1V1.pdf** (11 Learning Module thi thật), không dùng prerequisite làm xương sống. (Xem PLAN.md mục 0.)
- **Kiểm chứng độc lập:** engine test đối chiếu ví dụ/đáp án có sẵn trong sách (ground truth ≠ code), không để code tự chấm chính nó.
- Tailwind v4 + Vite plugin để cấu hình tối giản.

## Dependency chính & lý do
- `react`,`vite`: nền web app.
- `tailwindcss`: style nhanh.
- `vitest`: test engine.
- `recharts`,`papaparse`: phục vụ biểu đồ & import CSV (các slice sau).

## Bảo mật / bản quyền
- Nội dung CFA có bản quyền → chỉ dùng cá nhân; toàn bộ folder PDF đã gitignore.
- Không commit secret/token. Không sao chép nguyên văn nội dung CFA vào tài liệu.

## Hạn chế đã biết
- `npm audit` báo một số vulnerability ở devDependency (chuỗi build) — chưa xử lý, không ảnh hưởng runtime app.
- Mới có LM1; LM2–LM11 đang ở trạng thái "sắp có".

import { useState } from "react";
import {
  linearRegression,
  predict,
  standardErrorOfForecast,
  predictionInterval,
  logTransform,
} from "../lib/quant/regression";
import { num } from "../lib/format";
import type { Section } from "../data/curriculum";
import { Tool, Field, Row, SectionHeader, inputCls, parseNums, safe } from "../components/ToolKit";

type FunctionalForm = "linear" | "log-lin" | "lin-log" | "log-log";

/**
 * Công cụ LM10 — Simple Linear Regression.
 * Section render theo đúng `sections` của curriculum.ts; mỗi công cụ có ghi chú + hướng dẫn + trỏ mục sách.
 */
export default function RegressionWorkbench({ sections }: { sections: Section[] }) {
  const [xStr, setXStr] = useState("0.7, 0.4, 5.0, 10.0, 8.0, 12.5");
  const [yStr, setYStr] = useState("6.0, 4.0, 15.0, 20.0, 10.0, 20.0");
  const [xf, setXf] = useState("6");
  const [tCrit, setTCrit] = useState("2.776");
  const [form, setForm] = useState<FunctionalForm>("linear");

  const X = parseNums(xStr);
  const Y = parseNums(yStr);
  const reg = safe(() => linearRegression(X, Y));

  // Functional form: biến đổi log y/x rồi hồi quy
  const formReg = safe(() => {
    const fx = form === "lin-log" || form === "log-log" ? logTransform(X) : X;
    const fy = form === "log-lin" || form === "log-log" ? logTransform(Y) : Y;
    return linearRegression(fx, fy);
  });

  const toolsBySection: Record<string, React.ReactNode> = {
    estimation: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="OLS Estimation"
          note="Ước lượng đường hồi quy Ŷ = b0 + b1·X bằng bình phương nhỏ nhất. Slope = Cov(X,Y)/Var(X); intercept = Ȳ − b1·X̄. Slope = thay đổi Y khi X tăng 1 đơn vị."
          steps={[
            "Nhập biến độc lập X và biến phụ thuộc Y (cùng độ dài, từng cặp).",
            "Đọc slope, intercept và phương trình hồi quy.",
          ]}
          book="L1V1 · LM10 · Estimation of the Simple Linear Regression Model"
        >
          <Field label="X (độc lập)" value={xStr} onChange={setXStr} area />
          <Field label="Y (phụ thuộc)" value={yStr} onChange={setYStr} area />
          <Row label="Độ dài X / Y" value={`${X.length} / ${Y.length}`} />
          <Row label="Slope (b1)" value={reg ? num(reg.slope, 5) : "— (cần ≥3 cặp, X không hằng số)"} />
          <Row label="Intercept (b0)" value={reg ? num(reg.intercept, 5) : "—"} />
          <Row label="Phương trình" value={reg ? `Ŷ = ${num(reg.intercept, 3)} + ${num(reg.slope, 3)}·X` : "—"} />
        </Tool>
      </div>
    ),
    "hypothesis-tests": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="ANOVA & Goodness of Fit"
          note="Phân rã biến thiên: SST = SSR (giải thích) + SSE (dư). R² = SSR/SST = % biến thiên Y được X giải thích. SEE = √(SSE/(n−2)) đo sai số điển hình. F = MSR/MSE kiểm định mô hình."
          steps={["Dùng X, Y ở mục Estimation.", "Đọc SST/SSR/SSE, R², SEE, F (df = 1, n−2)."]}
          book="L1V1 · LM10 · Hypothesis Tests → Analysis of Variance & Measures of Goodness of Fit"
        >
          <Row label="SST" value={reg ? num(reg.sst, 4) : "—"} />
          <Row label="SSR (explained)" value={reg ? num(reg.ssr, 4) : "—"} />
          <Row label="SSE (residual)" value={reg ? num(reg.sse, 4) : "—"} />
          <Row label="R²" value={reg ? num(reg.rSquared, 5) : "—"} />
          <Row label="SEE" value={reg ? num(reg.see, 5) : "—"} />
          <Row label="F (df 1, n−2)" value={reg ? num(reg.fStat, 4) : "—"} />
        </Tool>

        <Tool
          title="Slope Coefficient Test"
          note="Kiểm định slope có khác 0 không (X có giải thích Y?): t = b1/s(b1), df = n−2. |t| > t tới hạn → slope khác 0 có ý nghĩa thống kê."
          steps={["Dùng X, Y ở mục Estimation.", "Đọc standard error của slope và t-statistic; so với t tới hạn (df = n−2)."]}
          book="L1V1 · LM10 · Hypothesis Tests → Hypothesis Testing of Individual Regression Coefficients"
        >
          <Row label="Standard error của slope" value={reg ? num(reg.slopeStdError, 5) : "—"} />
          <Row label="t-statistic (b1 = 0)" value={reg ? num(reg.slopeTStat, 5) : "—"} />
          <Row label="df" value={reg ? String(reg.n - 2) : "—"} />
        </Tool>
      </div>
    ),
    prediction: (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Prediction & Prediction Interval"
          note="Dự báo Ŷf cho một Xf, kèm khoảng dự báo phản ánh độ bất định. sf lớn hơn khi Xf càng xa X̄ (ngoại suy rủi ro hơn)."
          steps={[
            "Dùng X, Y ở mục Estimation; nhập Xf cần dự báo.",
            "Nhập giá trị tới hạn t (df = n−2) cho mức ý nghĩa mong muốn.",
            "Đọc Ŷf, standard error of forecast, và khoảng dự báo.",
          ]}
          book="L1V1 · LM10 · Prediction in the Simple Linear Regression Model"
        >
          <Field label="Xf (giá trị dự báo)" value={xf} onChange={setXf} />
          <Field label="t tới hạn (df = n−2)" value={tCrit} onChange={setTCrit} />
          <Row label="Ŷf" value={reg ? num(predict(reg, +xf), 4) : "—"} />
          <Row label="Std error of forecast (sf)" value={reg ? num(standardErrorOfForecast(reg, +xf), 5) : "—"} />
          <Row
            label="Khoảng dự báo"
            value={reg && safe(() => predictionInterval(reg, +xf, +tCrit)) !== null ? `${num(predictionInterval(reg, +xf, +tCrit).lower, 4)} – ${num(predictionInterval(reg, +xf, +tCrit).upper, 4)}` : "—"}
          />
        </Tool>
      </div>
    ),
    "functional-forms": (
      <div className="grid gap-4 sm:grid-cols-2">
        <Tool
          title="Functional Forms"
          note="Khi quan hệ không tuyến tính, biến đổi log có thể fit tốt hơn: log-lin (ln Y ~ X), lin-log (Y ~ ln X), log-log (ln Y ~ ln X). So R² giữa các dạng để chọn dạng phù hợp."
          steps={[
            "Dùng X, Y ở mục Estimation.",
            "Chọn dạng hàm; app biến đổi log tương ứng rồi hồi quy lại.",
            "So R² của các dạng (log yêu cầu giá trị > 0).",
          ]}
          book="L1V1 · LM10 · Functional Forms for Simple Linear Regression"
        >
          <label className="block text-xs text-slate-500">Dạng hàm</label>
          <select className={inputCls} value={form} onChange={(e) => setForm(e.target.value as FunctionalForm)}>
            <option value="linear">Linear (Y ~ X)</option>
            <option value="log-lin">Log-Lin (ln Y ~ X)</option>
            <option value="lin-log">Lin-Log (Y ~ ln X)</option>
            <option value="log-log">Log-Log (ln Y ~ ln X)</option>
          </select>
          <Row label="Slope" value={formReg ? num(formReg.slope, 5) : "— (log cần giá trị > 0)"} />
          <Row label="Intercept" value={formReg ? num(formReg.intercept, 5) : "—"} />
          <Row label="R²" value={formReg ? num(formReg.rSquared, 5) : "—"} />
        </Tool>
      </div>
    ),
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500">
        Hồi quy tuyến tính đơn — section & thứ tự lấy đúng từ mục lục sách (LM10).
      </p>
      <p className="mt-2 rounded-md border border-indigo-100 bg-indigo-50 px-3 py-2 text-xs text-indigo-700">
        💡 Ô X/Y điền sẵn dữ liệu ROA~CAPEX (Example LM10: slope 1.25, R² 0.8001, F 16.01). Giá trị tới hạn t tra bảng (df = n−2). Mục "Assumptions" là lý thuyết — xem trong sách.
      </p>
      {sections.map((s, i) => {
        const tools = toolsBySection[s.id];
        if (!tools) return null;
        return (
          <div key={s.id}>
            <SectionHeader n={i + 1} title={s.title} />
            {tools}
          </div>
        );
      })}
    </div>
  );
}

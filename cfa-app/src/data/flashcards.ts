/**
 * Bộ flashcard công thức/khái niệm chủ chốt cho Quant (LM1–LM11).
 * id ổn định để gắn với trạng thái SRS trong store. Nội dung tóm tắt — chi tiết xem trong sách.
 */
export interface Flashcard {
  id: string;
  moduleId: number;
  front: string;
  back: string;
}

export const QUANT_FLASHCARDS: Flashcard[] = [
  // LM1 — Rates and Returns
  { id: "lm1-hpr", moduleId: 1, front: "Holding period return?", back: "R = (P₁ − P₀ + I₁) / P₀" },
  { id: "lm1-geo", moduleId: 1, front: "Geometric mean return vs arithmetic?", back: "[Π(1+Ri)]^(1/n) − 1; luôn ≤ arithmetic, phản ánh tăng trưởng kép." },
  { id: "lm1-mwr", moduleId: 1, front: "Money-weighted return là gì?", back: "IRR của dòng tiền nhà đầu tư; nhạy với thời điểm & quy mô nạp/rút." },
  // LM2 — Time Value of Money
  { id: "lm2-gordon", moduleId: 2, front: "Gordon growth (constant DDM)?", back: "PV = D₀(1+g)/(r−g), cần r > g" },
  { id: "lm2-forward", moduleId: 2, front: "Implied forward rate (1y,2y)?", back: "F = (1+r₂)²/(1+r₁) − 1" },
  // LM3 — Statistical Measures
  { id: "lm3-cv", moduleId: 3, front: "Coefficient of variation?", back: "CV = s / mean (rủi ro trên mỗi đơn vị lợi suất, không thứ nguyên)" },
  { id: "lm3-corr", moduleId: 3, front: "Correlation từ covariance?", back: "ρ = Cov(X,Y) / (σX·σY), ∈ [−1, 1]" },
  // LM4 — Probability Trees
  { id: "lm4-ev", moduleId: 4, front: "Expected value của biến rời rạc?", back: "E(X) = Σ P(Xi)·Xi" },
  { id: "lm4-bayes", moduleId: 4, front: "Bayes' formula?", back: "P(E|I) = [P(I|E)/P(I)]·P(E)" },
  // LM5 — Portfolio Mathematics
  { id: "lm5-var2", moduleId: 5, front: "Phương sai danh mục 2 tài sản?", back: "σ²p = w₁²σ₁² + w₂²σ₂² + 2w₁w₂·Cov₁₂" },
  { id: "lm5-sfr", moduleId: 5, front: "Safety-first ratio (Roy)?", back: "SFRatio = (E(Rp) − RL)/σp; chọn cao nhất; P(shortfall) = N(−SFRatio)" },
  // LM6 — Simulation
  { id: "lm6-vol", moduleId: 6, front: "Năm hoá volatility?", back: "σ_năm = σ_kỳ · √(số kỳ/năm) (vd √250 ngày)" },
  { id: "lm6-lognormal", moduleId: 6, front: "Vì sao giá tài sản ~ lognormal?", back: "Nếu cc return ~ chuẩn thì giá = P₀·e^r ~ lognormal (≥0, lệch phải)." },
  // LM7 — Estimation & Inference
  { id: "lm7-se", moduleId: 7, front: "Standard error của trung bình mẫu?", back: "SE = s/√n (s = sample std)" },
  { id: "lm7-clt", moduleId: 7, front: "Central Limit Theorem?", back: "n lớn → trung bình mẫu ~ chuẩn, tâm μ, phương sai σ²/n (bất kể phân phối gốc)." },
  // LM8 — Hypothesis Testing
  { id: "lm8-tmean", moduleId: 8, front: "t-stat kiểm định một trung bình?", back: "t = (X̄ − μ₀)/(s/√n), df = n−1" },
  { id: "lm8-errors", moduleId: 8, front: "Sai lầm loại I vs II?", back: "I: bác bỏ H0 đúng (=α). II: không bác bỏ H0 sai. α↓ → β↑." },
  // LM9 — Tests of Independence
  { id: "lm9-corrt", moduleId: 9, front: "t-stat kiểm định tương quan?", back: "t = r·√(n−2)/√(1−r²), df = n−2" },
  { id: "lm9-chi", moduleId: 9, front: "χ² test độc lập (contingency)?", back: "χ² = Σ(O−E)²/E, E = (tổng hàng·tổng cột)/tổng, df=(r−1)(c−1)" },
  // LM10 — Simple Linear Regression
  { id: "lm10-slope", moduleId: 10, front: "Slope OLS?", back: "b₁ = Cov(X,Y)/Var(X); b₀ = Ȳ − b₁·X̄" },
  { id: "lm10-r2", moduleId: 10, front: "R² là gì?", back: "R² = SSR/SST = % biến thiên Y được X giải thích" },
  // LM11 — Big Data
  { id: "lm11-ml", moduleId: 11, front: "3 loại machine learning chính?", back: "Supervised, unsupervised, deep learning ('find the pattern, apply the pattern')." },
];

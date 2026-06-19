/**
 * Cấu trúc đúng theo sách CFA. Hiện đang dựng Volume L1V1 (tách menu riêng).
 * Thứ tự Topic / Learning Module / Section bám đúng mục lục 2024 L1V1.pdf.
 */

export interface Section {
  id: string;
  /** Tiêu đề đúng nguyên văn theo sách */
  title: string;
}

export interface Module {
  id: number;
  title: string; // đúng tên Learning Module trong sách
  app?: string; // ứng dụng thực tế tương ứng
  status: "available" | "planned";
  sections: Section[];
}

export interface Topic {
  id: string;
  name: string;
  modules: Module[];
}

export interface Volume {
  id: string;
  name: string;
  topics: Topic[];
}

/** LM1 — Rates and Returns: section đúng heading & thứ tự sách. */
const LM1_SECTIONS: Section[] = [
  { id: "intro", title: "Introduction" },
  { id: "interest-rates", title: "Interest Rates and Time Value of Money" },
  { id: "rates-of-return", title: "Rates of Return" },
  { id: "mwr-twr", title: "Money-Weighted and Time-Weighted Return" },
  { id: "annualized", title: "Annualized Return" },
  { id: "other-measures", title: "Other Major Return Measures and Their Applications" },
];

/** LM2 — The Time Value of Money in Finance: section đúng heading & thứ tự sách. */
const LM2_SECTIONS: Section[] = [
  { id: "intro", title: "Introduction" },
  { id: "tvm-fi-equity", title: "Time Value of Money in Fixed Income and Equity" },
  { id: "implied-return-growth", title: "Implied Return and Growth" },
  { id: "cash-flow-additivity", title: "Cash Flow Additivity" },
];

/** LM3 — Statistical Measures of Asset Returns: section đúng heading & thứ tự sách. */
const LM3_SECTIONS: Section[] = [
  { id: "intro", title: "Introduction" },
  { id: "central-location", title: "Measures of Central Tendency and Location" },
  { id: "dispersion", title: "Measures of Dispersion" },
  { id: "shape", title: "Measures of Shape of a Distribution" },
  { id: "correlation", title: "Correlation between Two Variables" },
];

/** LM4 — Probability Trees and Conditional Expectations: section đúng heading & thứ tự sách. */
const LM4_SECTIONS: Section[] = [
  { id: "intro", title: "Introduction" },
  { id: "ev-variance", title: "Expected Value and Variance" },
  { id: "prob-trees", title: "Probability Trees and Conditional Expectations" },
  { id: "bayes", title: "Bayes' Formula and Updating Probability Estimates" },
];

/** LM5 — Portfolio Mathematics: section đúng heading & thứ tự sách. */
const LM5_SECTIONS: Section[] = [
  { id: "intro", title: "Introduction" },
  { id: "return-variance", title: "Portfolio Expected Return and Variance of Return" },
  { id: "joint-probability", title: "Forecasting Correlation of Returns: Covariance Given a Joint Probability Function" },
  { id: "risk-measures", title: "Portfolio Risk Measures: Applications of the Normal Distribution" },
];

/** LM6 — Simulation Methods: section đúng heading & thứ tự sách. */
const LM6_SECTIONS: Section[] = [
  { id: "intro", title: "Introduction" },
  { id: "lognormal-cc", title: "Lognormal Distribution and Continuous Compounding" },
  { id: "monte-carlo", title: "Monte Carlo Simulation" },
  { id: "bootstrapping", title: "Bootstrapping" },
];

/** LM7 — Estimation and Inference: section đúng heading & thứ tự sách. */
const LM7_SECTIONS: Section[] = [
  { id: "intro", title: "Introduction" },
  { id: "sampling-methods", title: "Sampling Methods" },
  { id: "clt-inference", title: "Central Limit Theorem and Inference" },
  { id: "bootstrapping", title: "Bootstrapping and Empirical Sampling Distributions" },
];

/** LM8 — Hypothesis Testing for Finance: section đúng heading & thứ tự sách. */
const LM8_SECTIONS: Section[] = [
  { id: "hypothesis-process", title: "Hypothesis Tests for Finance" },
  { id: "tests-return-risk", title: "Tests of Return and Risk in Finance" },
  { id: "parametric-nonparametric", title: "Parametric versus Nonparametric Tests" },
];

/** LM9 — Parametric and Non-Parametric Tests of Independence: section đúng heading & thứ tự sách. */
const LM9_SECTIONS: Section[] = [
  { id: "intro", title: "Introduction" },
  { id: "correlation-tests", title: "Tests Concerning Correlation" },
  { id: "contingency", title: "Tests of Independence Using Contingency Table Data" },
];

const QUANT: Topic = {
  id: "quant",
  name: "Quantitative Methods",
  modules: [
    { id: 1, title: "Rates and Returns", app: "Portfolio Return Analyzer", status: "available", sections: LM1_SECTIONS },
    { id: 2, title: "The Time Value of Money in Finance", app: "Valuation & No-Arbitrage Workbench", status: "available", sections: LM2_SECTIONS },
    { id: 3, title: "Statistical Measures of Asset Returns", app: "Return Distribution Lab", status: "available", sections: LM3_SECTIONS },
    { id: 4, title: "Probability Trees and Conditional Expectations in Investment Applications", app: "Scenario & Bayes Decision Tree", status: "available", sections: LM4_SECTIONS },
    { id: 5, title: "Portfolio Mathematics", app: "Portfolio Risk Builder", status: "available", sections: LM5_SECTIONS },
    { id: 6, title: "Simulation Methods", app: "Monte Carlo & Bootstrap Simulator", status: "available", sections: LM6_SECTIONS },
    { id: 7, title: "Estimation and Inference", app: "Sampling & Confidence Interval Studio", status: "available", sections: LM7_SECTIONS },
    { id: 8, title: "Hypothesis Testing for Finance", app: "Hypothesis Test Runner", status: "available", sections: LM8_SECTIONS },
    { id: 9, title: "Parametric and Non-Parametric Tests of Independence", app: "Independence Tester", status: "available", sections: LM9_SECTIONS },
    { id: 10, title: "Simple Linear Regression", app: "Regression Workbench", status: "planned", sections: [] },
    { id: 11, title: "Introduction to Big Data Techniques", app: "Fintech / Big Data Concepts", status: "planned", sections: [] },
  ],
};

const ECONOMICS: Topic = {
  id: "economics",
  name: "Economics",
  modules: [
    { id: 1, title: "Firms and Market Structures", status: "planned", sections: [] },
    { id: 2, title: "Business Cycles", status: "planned", sections: [] },
    { id: 3, title: "Fiscal Policy", status: "planned", sections: [] },
    { id: 4, title: "Monetary Policy", status: "planned", sections: [] },
    { id: 5, title: "Introduction to Geopolitics", status: "planned", sections: [] },
    { id: 6, title: "International Trade", status: "planned", sections: [] },
    { id: 7, title: "The Foreign Exchange Market and Capital Flows", status: "planned", sections: [] },
    { id: 8, title: "Exchange Rate Calculations", status: "planned", sections: [] },
  ],
};

/**
 * Phần ôn nền (Prerequisite Quant) — là tài liệu BỔ TRỢ của Volume L1V1,
 * nên nằm trong menu L1V1, không tách Volume riêng (theo rule curriculum-ordered-development).
 */
const PREREQUISITE: Topic = {
  id: "prerequisite",
  name: "Prerequisite — Ôn nền (Quant)",
  modules: [
    { id: 1, title: "Interest Rates, Present Value, and Future Value", status: "planned", sections: [] },
    { id: 2, title: "Organizing, Visualizing, and Describing Data", status: "planned", sections: [] },
    { id: 3, title: "Probability Concepts", status: "planned", sections: [] },
    { id: 4, title: "Common Probability Distributions", status: "planned", sections: [] },
    { id: 5, title: "Sampling and Estimation", status: "planned", sections: [] },
    { id: 6, title: "Basics of Hypothesis Testing", status: "planned", sections: [] },
  ],
};

export const L1V1: Volume = {
  id: "L1V1",
  name: "2024 CFA Level I — Volume 1 (L1V1)",
  topics: [QUANT, ECONOMICS, PREREQUISITE],
};

export const VOLUMES: Volume[] = [L1V1];

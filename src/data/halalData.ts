import type { HalalPillar, Scenario, RiskProfileResult, AllocationSlice } from "../types";

export const BRAND_NAME = "NaijaVest Halal";
export const HALAL_STATEMENT =
  "We invest only in Halal-screened assets. No riba. No haram sectors. Your wealth grows with barakah.";

export const GOAL_OPTIONS = [
  { id: "growth", label: "Wealth Growth", hint: "Compound halal capital over time" },
  { id: "hajj", label: "Hajj / Pilgrimage Fund", hint: "Save for your sacred journey" },
  { id: "education", label: "Halal Children's Education", hint: "Fund schooling with barakah" },
  { id: "rainy", label: "Halal Rainy Day", hint: "A safe, Shariah-clean reserve" },
];

export const HALAL_PILLARS: HalalPillar[] = [
  {
    id: "riba",
    title: "Zero Riba (No Interest)",
    arabic: "تحريم الربا",
    description: "No riba-bearing debt instruments or conventional bonds.",
    detail:
      "Every holding is structured on trade, lease (Ijarah), or profit-sharing (Mudarabah). We never lend money to make money.",
  },
  {
    id: "haram",
    title: "Zero Haram Sectors",
    arabic: "الطهارة",
    description: "Strict exclusion of alcohol, gambling, adult entertainment, conventional banking, weapons, and pork.",
    detail:
      "Our advisory board screens every business activity. If a company earns from a haram source, it never enters your portfolio.",
  },
  {
    id: "asset",
    title: "Asset-Backed & Ethical",
    arabic: "المرابحة",
    description: "Sukuk (Asset-Backed Certificates), ethical real estate, and dividend-yielding equities with verified debt-to-equity ratios.",
    detail:
      "Your capital is tied to real, tangible assets and companies whose riba-bearing debt stays below the AAOIFI 33% threshold.",
  },
  {
    id: "zakat",
    title: "Zakat & Barakah Ready",
    arabic: "الزكاة",
    description: "Optional automated annual Zakat calculation support and ethical purification.",
    detail:
      "We compute your 2.5% Zakat on wealth held past one lunar year and purify any incidental non-compliant income below 5%.",
  },
];

export const SCENARIOS: Scenario[] = [
  {
    id: "shock",
    title: "Market Shock",
    prompt:
      "Your Halal portfolio of ₦100,000 drops to ₦75,000 during a global market downturn. What do you do?",
    options: [
      { id: "shock-a", label: "Sell everything immediately", description: "Exit to avoid any further loss.", score: 1 },
      { id: "shock-b", label: "Hold and stay composed", description: "Wait patiently for recovery.", score: 2 },
      { id: "shock-c", label: "Buy more at a discount", description: "Add units to maximize long-term gains.", score: 3 },
    ],
  },
  {
    id: "windfall",
    title: "Windfall Allocation",
    prompt: "You receive a ₦1,000,000 bonus or family gift. How do you deploy it?",
    options: [
      { id: "windfall-a", label: "100% sovereign Sukuk", description: "Anticipated Ijarah rental share, maximum safety.", score: 1 },
      { id: "windfall-b", label: "60% Sukuk / 40% Equities", description: "A balanced halal blend.", score: 2 },
      { id: "windfall-c", label: "80%+ high-growth Halal", description: "Tech, agriculture, ethical venture funds.", score: 3 },
    ],
  },
  {
    id: "horizon",
    title: "Investment Horizon",
    prompt: "When will you need to withdraw this capital?",
    options: [
      { id: "horizon-a", label: "Within 6 to 12 months", description: "An immediate, near-term need.", score: 1 },
      { id: "horizon-b", label: "3 to 5 years", description: "A medium-term goal.", score: 2 },
      { id: "horizon-c", label: "7+ years", description: "Compound generational wealth with barakah.", score: 3 },
    ],
  },
];

export const ALLOCATIONS: Record<string, AllocationSlice[]> = {
  conservative: [
    { label: "Sovereign & Corporate Sukuk", percent: 70, color: "#04442F", detail: "Asset-backed rental income certificates." },
    { label: "Halal Cash Liquidity Fund", percent: 20, color: "#065F46", detail: "Instant-access, purified reserve." },
    { label: "Blue-Chip Halal Equities", percent: 10, color: "#D97706", detail: "Screened NGX dividend leaders." },
  ],
  balanced: [
    { label: "Sukuk & Islamic Income", percent: 45, color: "#04442F", detail: "Steady halal income core." },
    { label: "Halal Global / NSE Equities", percent: 40, color: "#065F46", detail: "AAOIFI-screened growth stocks." },
    { label: "Ethical Commodities (Gold / Agric)", percent: 15, color: "#D97706", detail: "Inflation hedge & export crops." },
  ],
  growth: [
    { label: "Halal Equities (Global Tech & Emerging)", percent: 65, color: "#065F46", detail: "High-growth screened equities." },
    { label: "Ethical Commodities & Venture", percent: 20, color: "#D97706", detail: "Gold, agriculture, venture funds." },
    { label: "Sovereign Sukuk", percent: 15, color: "#04442F", detail: "Stability anchor income." },
  ],
};

export const PROFILE_META: Record<string, { name: string; tagline: string; expectedReturn: number }> = {
  conservative: {
    name: "Conservative (Low Risk)",
    tagline: "Capital preservation first. Gentle, steady barakah.",
    expectedReturn: 0.12,
  },
  balanced: {
    name: "Balanced (Moderate Risk)",
    tagline: "A Wasatiyyah blend of income and halal growth.",
    expectedReturn: 0.17,
  },
  growth: {
    name: "Growth (Higher Risk)",
    tagline: "Bold equity exposure for generational compounding.",
    expectedReturn: 0.23,
  },
};

export function tierFromScore(score: number): "conservative" | "balanced" | "growth" {
  if (score <= 4) return "conservative";
  if (score <= 7) return "balanced";
  return "growth";
}

export function buildProfile(score: number): RiskProfileResult {
  const tier = tierFromScore(score);
  const meta = PROFILE_META[tier];
  return {
    tier,
    name: meta.name,
    tagline: meta.tagline,
    score,
    allocations: ALLOCATIONS[tier],
    expectedReturn: meta.expectedReturn,
  };
}

export function formatNaira(value: number): string {
  return "₦" + Math.round(value).toLocaleString("en-NG");
}
export type RiskTier = "conservative" | "balanced" | "growth";

export interface IdentityData {
  fullName: string;
  email: string;
  goal: string;
  capital: number;
}

export interface ScenarioOption {
  id: string;
  label: string;
  description: string;
  score: number;
}

export interface Scenario {
  id: string;
  title: string;
  prompt: string;
  options: ScenarioOption[];
}

export interface AllocationSlice {
  label: string;
  percent: number;
  color: string;
  detail: string;
}

export interface RiskProfileResult {
  tier: RiskTier;
  name: string;
  tagline: string;
  score: number;
  allocations: AllocationSlice[];
  expectedReturn: number;
}

export interface HalalPillar {
  id: string;
  title: string;
  arabic: string;
  description: string;
  detail: string;
}

// ---------------------------------------------------------------------------
// Halal Wealth Dashboard models
// ---------------------------------------------------------------------------

export type AssetCategory =
  | "Equities"
  | "Sukuk"
  | "Halal ETFs"
  | "Gold"
  | "Cash Buffer";

export interface HoldingItem {
  id: string;
  name: string;
  ticker: string;
  category: AssetCategory;
  units: number;
  pricePerUnit: number;
  /** current market value in NGN */
  marketValue: number;
  /** daily change as a percentage, e.g. 2.4 */
  dailyChangePct: number;
  /** non-permissible (riba) income ratio for purification, 0-1 */
  impurityRatio: number;
  /** whether the asset is zakat-qualifying (gold/cash/trading equities) */
  zakatQualifying: boolean;
}

export interface AssetAllocationSlice {
  category: AssetCategory;
  value: number;
  percent: number;
  color: string;
}

export interface UserProfile {
  name: string;
  greetingName: string;
  hijriDate: string;
  gregorianDate: string;
}

export type TransactionType = "deposit" | "withdraw";

export interface TransactionRecord {
  id: string;
  type: TransactionType;
  amount: number;
  timestamp: string;
  balanceAfter: number;
  /** optional human-readable detail, e.g. "Instant Bank Transfer - Mudarabah Cash Buffer" */
  label?: string;
}

export interface ZakatCalculationResult {
  qualifyingWealth: number;
  nisab: number;
  isAboveNisab: boolean;
  rate: number;
  amountDue: number;
}

export interface PurificationItem {
  id: string;
  name: string;
  category: AssetCategory;
  income: number;
  impurityRatio: number;
  impureAmount: number;
}

export type CharityCategory =
  | "Poverty Alleviation"
  | "Orphans"
  | "Education"
  | "Healthcare"
  | "Emergency";

export interface VerifiedCharity {
  id: string;
  name: string;
  category: CharityCategory;
  location: string;
  blurb: string;
  accountName: string;
  accountNumber: string;
  bank: string;
  verified: boolean;
}

export interface ZakatConfig {
  /** standard used for nisab: "gold" | "silver" | "custom" */
  standard: "gold" | "silver" | "custom";
  /** live gold price per gram in NGN (editable) */
  goldPricePerGram: number;
  /** manual nisab threshold in NGN when standard is "custom" */
  customNisab: number;
}

export interface HawlCountdown {
  /** days remaining to the next hawl completion */
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** next completion date (ISO) */
  targetDate: string;
  /** whether a full lunar year has elapsed */
  complete: boolean;
}

export interface ZakatPaymentRecord {
  id: string;
  charityId: string;
  charityName: string;
  amount: number;
  timestamp: string;
  method: string;
}

export type AppView =
  | "dashboard"
  | "zakat"
  | "purification"
  | "goals"
  | "governance"
  | "profile";

// ---------------------------------------------------------------------------
// Shariah Governance
// ---------------------------------------------------------------------------

export interface ScholarProfile {
  id: string;
  name: string;
  honorific: string;
  role: string;
  credentials: string[];
  specialty: string;
  bio: string;
  advisoryYears: string;
  badges: string[];
  verified: boolean;
  initials: string;
}

export interface ScreeningRule {
  id: string;
  title: string;
  arabic?: string;
  description: string;
  detail: string;
}

export interface CompliancePillar {
  id: string;
  title: string;
  tagline: string;
  description: string;
  badge: string;
}

export interface PurificationHoldingBreakdown {
  id: string;
  name: string;
  ticker: string;
  category: AssetCategory;
  /** market value of the holding in NGN */
  marketValue: number;
  /** annual dividend/income estimated in NGN (6% yield basis) */
  dividendIncome: number;
  /** non-permissible income ratio, 0-1 (AAOIFI threshold < 0.05) */
  impurityRatio: number;
  /** annual digital yield in % */
  yieldPct: number;
  /** cleansing amount due in NGN */
  cleansingAmount: number;
  /** human-readable note on why this asset carries impurity */
  impurityNote: string;
}

export interface PurificationRecord {
  id: string;
  amount: number;
  organizationId: string;
  organizationName: string;
  timestamp: string;
  reference: string;
  note: string;
}

export interface SadaqahOption {
  id: string;
  name: string;
  /** public-utility focus, e.g. clean water, healthcare, education */
  focus: string;
  location: string;
  blurb: string;
  accountName: string;
  accountNumber: string;
  bank: string;
  verified: boolean;
}

// ---------------------------------------------------------------------------
// Asset Shariah Screening Detail
// ---------------------------------------------------------------------------

export interface ProhibitedSectorCheck {
  sector: string;
  passed: boolean;
}

// ---------------------------------------------------------------------------
// Halal Goals
// ---------------------------------------------------------------------------

export type IslamicGoalType =
  | "Hajj Savings"
  | "Umrah Fund"
  | "Waqf (Endowment)"
  | "Sadaqah Jariyah"
  | "Islamic Education"
  | "Nikah (Marriage) Fund";

export interface HalalGoal {
  id: string;
  type: IslamicGoalType;
  title: string;
  targetAmount: number;
  currentAmount: number;
  timelineMonths: number;
  expectedAnnualReturn: number;
  monthlyContribution: number;
  createdAt: string;
  notes: string;
  status: "active" | "completed" | "paused";
}

export interface AssetScreeningDetails {
  screeningDate: string;
  hijriDate: string;
  shariahBoard: string;
  standard: string;
  debtToAssetRatio: number;
  cashToAssetRatio: number;
  interestIncomeRatio: number;
  prohibitedSectors: ProhibitedSectorCheck[];
  purificationAmount: number;
  purificationPct: number;
  auditorNote: string;
}

// ---------------------------------------------------------------------------
// Hijri / Lunar engine models
// ---------------------------------------------------------------------------

export type MoonPhaseIcon =
  | "new"
  | "waxing-crescent"
  | "first-quarter"
  | "waxing-gibbous"
  | "full"
  | "waning-gibbous"
  | "last-quarter"
  | "waning-crescent";

export interface MoonPhaseInfo {
  phaseName: string;
  illuminationPct: number;
  phaseIcon: MoonPhaseIcon;
  isWhiteDays: boolean;
  ageDays: number;
}

export interface HijriMonthInfo {
  monthNumber: number;
  monthName: string;
  monthNameArabic: string;
  isSacred: boolean;
}

export type HijriMilestoneType =
  | "zakat"
  | "charity"
  | "fasting"
  | "hajj"
  | "general";

export interface HijriMilestone {
  id: string;
  title: string;
  arabic: string;
  description: string;
  action: string;
  type: HijriMilestoneType;
}

export interface HijriConfig {
  sightingAdjustment: number;
}

export interface DetailedHijriDate {
  day: number;
  monthNumber: number;
  monthName: string;
  monthNameArabic: string;
  year: number;
  formatted: string;
  formattedArabic: string;
  isSacredMonth: boolean;
  sacredMonthNote: string;
  seasonTag: string;
  seasonEmoji: string;
  milestones: HijriMilestone[];
  moonPhase: MoonPhaseInfo;
  gregorian: string;
  isFriday: boolean;
}

// ---------------------------------------------------------------------------
// Islamic Finance Contracts
// ---------------------------------------------------------------------------

export type ContractCategory =
  | "agency"
  | "profit-sharing"
  | "partnership"
  | "commission"
  | "certificates"
  | "benevolent-loan";

export interface IslamicContract {
  id: string;
  name: string;
  arabic: string;
  englishMeaning: string;
  category: ContractCategory;
  mechanism: string;
  naijaverole: string;
  status: "active" | "available";
  icon: string;
}

export interface ExcludedContract {
  id: string;
  name: string;
  arabic: string;
  reason: string;
}

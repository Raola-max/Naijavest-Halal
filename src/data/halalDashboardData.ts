import type {
  AssetAllocationSlice,
  AssetCategory,
  AssetScreeningDetails,
  CompliancePillar,
  DetailedHijriDate,
  ExcludedContract,
  HalalGoal,
  HawlCountdown,
  HijriMilestone,
  HoldingItem,
  IslamicContract,
  IslamicGoalType,
  MoonPhaseInfo,
  ProhibitedSectorCheck,
  PurificationHoldingBreakdown,
  SadaqahOption,
  ScholarProfile,
  ScreeningRule,
  UserProfile,
  VerifiedCharity,
  ZakatConfig,
} from "../types";

export const BRAND_NAME = "NaijaVest Halal";
export const SHARIAH_BOARD = "ACE Shariah Advisory Board";
export const ZAKAT_RATE = 0.025;

/** Nisab benchmark ~ 87.48g gold. Demo gold price per gram in NGN. */
export const GOLD_PRICE_PER_GRAM = 92_500;
export const NISAB_GRAMS = 87.48;
export const NISAB_VALUE = GOLD_PRICE_PER_GRAM * NISAB_GRAMS;

/** Silver nisab benchmark ~ 612.36g silver (fallback standard). */
export const SILVER_PRICE_PER_GRAM = 1_250;
export const SILVER_NISAB_GRAMS = 612.36;
export const SILVER_NISAB_VALUE = SILVER_PRICE_PER_GRAM * SILVER_NISAB_GRAMS;

/** Hawl: one lunar year (~354 days). */
export const LUNAR_YEAR_DAYS = 354;

export const HAWL_STORAGE_KEY = "nv_hawl_target_v1";
export const ZAKAT_CONFIG_KEY = "nv_zakat_config_v1";

export const DEFAULT_ZAKAT_CONFIG: ZakatConfig = {
  standard: "gold",
  goldPricePerGram: GOLD_PRICE_PER_GRAM,
  customNisab: NISAB_VALUE,
};

export const CATEGORY_CHARITY_META: Record<
  VerifiedCharity["category"],
  { blurb: string }
> = {
  "Poverty Alleviation": { blurb: "Food, shelter & cash for the poor and needy." },
  Orphans: { blurb: "Guardianship, schooling and care for orphaned children." },
  Education: { blurb: "Scholarships and Qur'anic & skill-based learning." },
  Healthcare: { blurb: "Free clinics, medicine and maternal care." },
  Emergency: { blurb: "Disaster relief and urgent humanitarian aid." },
};

export const CHARITIES: VerifiedCharity[] = [
  {
    id: "zsfn",
    name: "Zakat & Sadaqat Foundation Nigeria",
    category: "Poverty Alleviation",
    location: "Ibadan, Oyo State",
    blurb: "Nigeria's leading Zakat collector, disbursing to the poor in all 36 states.",
    accountName: "Zakat & Sadaqat Foundation",
    accountNumber: "1012345678",
    bank: "Jaiz Bank",
    verified: true,
  },
  {
    id: "jaizcf",
    name: "Jaiz Charity & Development Foundation",
    category: "Orphans",
    location: "Abuja, FCT",
    blurb: "Orphan care, widow empowerment and school feeding programs.",
    accountName: "Jaiz Charity Foundation",
    accountNumber: "3015500021",
    bank: "Jaiz Bank",
    verified: true,
  },
  {
    id: "nasfat",
    name: "NASFAT Relief Agency",
    category: "Healthcare",
    location: "Ikeja, Lagos State",
    blurb: "Free medical outreaches, eye camps and blood donation drives.",
    accountName: "NASFAT Agency",
    accountNumber: "2004455667",
    bank: "Taj Bank",
    verified: true,
  },
  {
    id: "hcfi",
    name: "HCFI (Humanity & Care Foundation Int'l)",
    category: "Education",
    location: "Kano, Kano State",
    blurb: "Qur'anic school support and tuition aid for underprivileged students.",
    accountName: "HCFI",
    accountNumber: "4007788990",
    bank: "Jaiz Bank",
    verified: true,
  },
  {
    id: "irw",
    name: "Islamic Relief Worldwide (Nigeria)",
    category: "Emergency",
    location: "Kaduna, Kaduna State",
    blurb: "Emergency relief, food security and clean water across Nigeria.",
    accountName: "Islamic Relief Nigeria",
    accountNumber: "1011122334",
    bank: "Jaiz Bank",
    verified: true,
  },
];

/** Resolve the active nisab threshold from the user's chosen standard. */
export function nisabFor(config: ZakatConfig): number {
  if (config.standard === "custom") return config.customNisab;
  if (config.standard === "silver") return SILVER_NISAB_VALUE;
  return config.goldPricePerGram * NISAB_GRAMS;
}

/** Format a number as Nigerian Naira (₦) with thousands separators. */
export function formatNaira(amount: number, compact = false): string {
  if (compact && Math.abs(amount) >= 1_000_000) {
    return `₦${(amount / 1_000_000).toFixed(2)}M`;
  }
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatSignedPct(pct: number): string {
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

/** Format a Naira amount with an explicit + / - sign (opposite of sign of `signFrom`). */
export function formatSignedNaira(
  amount: number,
  signFrom: number,
  compact = false
): string {
  const sign = signFrom >= 0 ? "+" : "-";
  return `${sign}${formatNaira(amount, compact).replace("₦", "₦")}`;
}

// ---------------------------------------------------------------------------
// Dynamic Hijri / Gregorian dates & time-based Islamic greeting
// ---------------------------------------------------------------------------

const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

/** Today's Hijri date as "15 Rajab 1446 AH" (Umm al-Qura calendar, with fallback). */
export function getHijriDate(date: Date = new Date()): string {
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Africa/Lagos",
    }).formatToParts(date);
    const day = parts.find((p) => p.type === "day")?.value;
    const month = parts.find((p) => p.type === "month")?.value;
    const year = parts.find((p) => p.type === "year")?.value;
    if (day && month && year) {
      return `${month} ${day} ${year} AH`.replace(" AH AH", " AH");
    }
  } catch {
    /* fall through to manual calculation */
  }
  return manualHijri(date);
}

/** Gregorian date as "Tuesday, 14 January 2025". */
export function getGregorianDate(date: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Lagos",
  }).format(date);
}

/** Combined dashboard date line: "15 Rajab 1446 AH · Tuesday, 14 January 2025". */
export function getTodayLine(date: Date = new Date()): string {
  return `${getHijriDate(date)} · ${getGregorianDate(date)}`;
}

/**
 * Time-based Islamic greeting.
 * Morning (05:00-11:59) Sabahul Khair · Afternoon (12:00-16:59) Naharak Sa'id
 * Evening (17:00-20:59) Masaul Khair · Night (21:00-04:59) Laylatun Sa'idah
 */
export function getIslamicGreeting(date: Date = new Date()): string {
  const local = new Intl.DateTimeFormat("en-GB", {
    hour: "numeric",
    hour12: false,
    timeZone: "Africa/Lagos",
  }).format(date);
  const hour = Number.parseInt(local, 10);
  if (hour >= 5 && hour < 12) return "Sabahul Khair";
  if (hour >= 12 && hour < 17) return "Naharak Sa'id";
  if (hour >= 17 && hour < 21) return "Masaul Khair";
  return "Laylatun Sa'idah";
}

/** Fallback Hijri calculation: 622 CE epoch, year offset approximation (used only if Intl Hijri fails). */
function manualHijri(date: Date): string {
  // Julian Day Number
  const jdn =
    Math.floor((date.getTime() + 0.5) / 86_400_000) + 2_440_588;
  // Approximate Hijri conversion (arithmetic tabular formula)
  const y = Math.floor((30 * (jdn - 1_948_439.5) + 10_646) / 10_631);
  const m = Math.min(
    11,
    Math.max(
      0,
      Math.floor(
        (jdn - 1_948_439.5 - Math.floor((10_631 * y - 10_646) / 30)) /
          (29.5 + 0.034)
      )
    )
  );
  const d = Math.floor(
    jdn -
      1_948_439.5 -
      Math.floor((10_631 * y - 10_646) / 30) -
      Math.floor((29.5 + 0.034) * (m + 0.5))
  );
  return `${HIJRI_MONTHS[m] ?? "Rajab"} ${d} ${y} AH`;
}

// ---------------------------------------------------------------------------
// Detailed Hijri / Lunar engine
// ---------------------------------------------------------------------------

const HIJRI_MONTHS_ARABIC = [
  "مُحَرَّم",
  "صَفَر",
  "رَبِيع ٱلْأَوَّل",
  "رَبِيع ٱلثَّانِي",
  "جُمَادَى ٱلْأُولَى",
  "جُمَادَى ٱلْآخِرَة",
  "رَجَب",
  "شَعْبَان",
  "رَمَضَان",
  "شَوَّال",
  "ذُو ٱلْقِعْدَة",
  "ذُو ٱلْحِجَّة",
];

/** Al-Ashhur Al-Hurum: the four sacred months (1, 7, 11, 12). */
const SACRED_MONTHS = new Set([1, 7, 11, 12]);

const SYNODIC_MONTH_DAYS = 29.53058867;
const KNOWN_NEW_MOON_MS = Date.UTC(2000, 0, 6, 18, 14);

/** LocalStorage key for the user's moon-sighting adjustment (-2 to +2 days). */
export const HIJRI_SIGHTING_KEY = "nv_hijri_sighting_adj_v1";

/** Read the persisted moon-sighting adjustment in days. */
export function getMoonSightingAdjustment(): number {
  try {
    const raw = localStorage.getItem(HIJRI_SIGHTING_KEY);
    if (raw === null) return 0;
    const n = Number.parseInt(raw, 10);
    if (Number.isFinite(n) && n >= -2 && n <= 2) return n;
  } catch {
    /* ignore */
  }
  return 0;
}

/** Persist the moon-sighting adjustment (-2 to +2 days). */
export function setMoonSightingAdjustment(days: number): number {
  const clamped = Math.max(-2, Math.min(2, Math.round(days)));
  try {
    localStorage.setItem(HIJRI_SIGHTING_KEY, String(clamped));
  } catch {
    /* ignore */
  }
  return clamped;
}

/** Compute lunar age (days since new moon) and illumination percentage. */
export function getMoonPhaseInfo(date: Date, hijriDay: number): MoonPhaseInfo {
  const daysSince = (date.getTime() - KNOWN_NEW_MOON_MS) / 86_400_000;
  const ageDays = ((daysSince % SYNODIC_MONTH_DAYS) + SYNODIC_MONTH_DAYS) % SYNODIC_MONTH_DAYS;
  const illuminationPct = Math.round(((1 - Math.cos((2 * Math.PI * ageDays) / SYNODIC_MONTH_DAYS)) / 2) * 100);
  const frac = ageDays / SYNODIC_MONTH_DAYS;
  let phaseIcon: MoonPhaseInfo["phaseIcon"];
  let phaseName: string;
  if (frac < 0.03 || frac > 0.97) {
    phaseIcon = "new";
    phaseName = "New Moon";
  } else if (frac < 0.22) {
    phaseIcon = "waxing-crescent";
    phaseName = "Waxing Crescent";
  } else if (frac < 0.28) {
    phaseIcon = "first-quarter";
    phaseName = "First Quarter";
  } else if (frac < 0.47) {
    phaseIcon = "waxing-gibbous";
    phaseName = "Waxing Gibbous";
  } else if (frac < 0.53) {
    phaseIcon = "full";
    phaseName = "Full Moon";
  } else if (frac < 0.72) {
    phaseIcon = "waning-gibbous";
    phaseName = "Waning Gibbous";
  } else if (frac < 0.78) {
    phaseIcon = "last-quarter";
    phaseName = "Last Quarter";
  } else {
    phaseIcon = "waning-crescent";
    phaseName = "Waning Crescent";
  }
  const isWhiteDays = hijriDay >= 13 && hijriDay <= 15;
  return { phaseName, illuminationPct, phaseIcon, isWhiteDays, ageDays: Math.round(ageDays) };
}

/** Build the actionable Shariah milestones for the current Hijri date. */
function buildMilestones(month: number, day: number, isFriday: boolean): HijriMilestone[] {
  const list: HijriMilestone[] = [];
  if (month === 9) {
    list.push({
      id: "ramadan",
      title: "Ramadan",
      arabic: "رَمَضَان",
      description: "The month of fasting, Qur'an revelation and multiplied reward.",
      action: "Prioritise Zakat al-Fitr and increase sadaqah before Eid.",
      type: "zakat",
    });
  }
  if (month === 12 && day <= 10) {
    list.push({
      id: "ten-nights",
      title: "The Ten Days of Dhul Hijjah",
      arabic: "عَشْر ذِي الحِجَّة",
      description: "The most beloved days of the year for good deeds.",
      action: "Give charity, fast, and prepare for Qurbani (Udhiyah).",
      type: "charity",
    });
  }
  if (month === 12 && day === 10) {
    list.push({
      id: "qurbani",
      title: "Yawm an-Nahr & Eid al-Adha",
      arabic: "يَوْم النَّحْر",
      description: "The Day of Sacrifice marking the peak of Hajj.",
      action: "Perform Qurbani and distribute the meat to the needy.",
      type: "hajj",
    });
  }
  if (month === 1 && day === 10) {
    list.push({
      id: "ashura",
      title: "Yawm Ashura",
      arabic: "يَوْم عَاشُورَاء",
      description: "The 10th of Muharram, a day of expiation for the past year.",
      action: "Fast and give sadaqah to those in need.",
      type: "fasting",
    });
  }
  if (month === 7) {
    list.push({
      id: "rajab",
      title: "Sacred Month of Rajab",
      arabic: "رَجَب",
      description: "One of the four sacred months where sins and rewards are magnified.",
      action: "Avoid wrongdoing and increase voluntary charity.",
      type: "general",
    });
  }
  if (month === 11) {
    list.push({
      id: "dhul-qidah",
      title: "Sacred Month of Dhul Qi'dah",
      arabic: "ذُو القِعْدَة",
      description: "A month of rest and preparation before the great pilgrimage.",
      action: "Settle zakatable balances ahead of the Hawl.",
      type: "zakat",
    });
  }
  if (day >= 13 && day <= 15) {
    list.push({
      id: "white-days",
      title: "Ayyam al-Beed (White Days)",
      arabic: "أَيَّام البِيد",
      description: "The three full-moon nights of every lunar month.",
      action: "Observe the Sunnah fast and give voluntary charity.",
      type: "fasting",
    });
  }
  if (isFriday) {
    list.push({
      id: "jumuah",
      title: "Jumu'ah",
      arabic: "الجُمُعَة",
      description: "The blessed weekly gathering; an hour of accepted supplication.",
      action: "Give Friday sadaqah and send salawat upon the Prophet ﷺ.",
      type: "charity",
    });
  }
  return list;
}

function seasonFor(month: number, day: number, isFriday: boolean): { tag: string; emoji: string } {
  if (month === 9) return { tag: "Ramadan Blessings", emoji: "🌙" };
  if (month === 12 && day <= 10) return { tag: "The Sacred Ten Days", emoji: "🕋" };
  if (month === 12 && day === 10) return { tag: "Eid al-Adha", emoji: "🐑" };
  if (day >= 13 && day <= 15) return { tag: "White Days", emoji: "🌕" };
  if (month === 1) return { tag: "Sacred Month of Muharram", emoji: "🌙" };
  if (month === 7) return { tag: "Sacred Month of Rajab", emoji: "🌙" };
  if (month === 11) return { tag: "Sacred Month of Dhul Qi'dah", emoji: "🌙" };
  if (month === 12) return { tag: "Sacred Month of Dhul Hijjah", emoji: "🕋" };
  if (isFriday) return { tag: "Blessed Jumu'ah", emoji: "🕌" };
  return { tag: "Barakah in Every Step", emoji: "✨" };
}

/**
 * Full detailed Hijri calculation with sacred-month detection, moon phase,
 * seasonal Shariah milestones and an optional moon-sighting day adjustment.
 */
export function getDetailedHijriDate(
  date: Date = new Date(),
  adjustment: number = getMoonSightingAdjustment()
): DetailedHijriDate {
  const adjusted = new Date(date.getTime() + adjustment * 86_400_000);
  let day = 1;
  let month = 1;
  let year = 1446;
  try {
    const parts = new Intl.DateTimeFormat("en-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      numberingSystem: "latn",
      timeZone: "Africa/Lagos",
    }).formatToParts(adjusted);
    day = Number(parts.find((p) => p.type === "day")?.value) || day;
    month = Number(parts.find((p) => p.type === "month")?.value) || month;
    year = Number(parts.find((p) => p.type === "year")?.value?.replace(/\D/g, "")) || year;
  } catch {
    const manual = manualHijriParts(adjusted);
    day = manual.day;
    month = manual.month;
    year = manual.year;
  }
  const monthName = HIJRI_MONTHS[month - 1] ?? "Rajab";
  const monthNameArabic = HIJRI_MONTHS_ARABIC[month - 1] ?? "رَجَب";
  const isSacredMonth = SACRED_MONTHS.has(month);
  const isFriday = new Intl.DateTimeFormat("en-US", { weekday: "long", timeZone: "Africa/Lagos" }).format(adjusted) === "Friday";
  const season = seasonFor(month, day, isFriday);
  const moonPhase = getMoonPhaseInfo(adjusted, day);
  const formatted = `${day} ${monthName} ${year} AH`;
  const formattedArabic = `${day} ${monthNameArabic} ${year} هـ`;
  return {
    day,
    monthNumber: month,
    monthName,
    monthNameArabic,
    year,
    formatted,
    formattedArabic,
    isSacredMonth,
    sacredMonthNote: isSacredMonth
      ? "Al-Ashhur Al-Hurum: deeds and transgressions in this month carry greater weight."
      : "A standard lunar month: remain consistent in your voluntary worship.",
    seasonTag: season.tag,
    seasonEmoji: season.emoji,
    milestones: buildMilestones(month, day, isFriday),
    moonPhase,
    gregorian: getGregorianDate(adjusted),
    isFriday,
  };
}

/** Manual Hijri fallback returning numeric parts (used only if Intl fails). */
function manualHijriParts(date: Date): { day: number; month: number; year: number } {
  const jdn = Math.floor((date.getTime() + 0.5) / 86_400_000) + 2_440_588;
  const y = Math.floor((30 * (jdn - 1_948_439.5) + 10_646) / 10_631);
  const m = Math.min(11, Math.max(0, Math.floor((jdn - 1_948_439.5 - Math.floor((10_631 * y - 10_646) / 30)) / (29.5 + 0.034))));
  const d = Math.floor(jdn - 1_948_439.5 - Math.floor((10_631 * y - 10_646) / 30) - Math.floor((29.5 + 0.034) * (m + 0.5))) + 1;
  return { day: Math.max(1, d), month: m + 1, year: y };
}

/** AAOIFI lunar Hawl: a Zakat year follows 354 lunar days, ~11 days shorter than solar. */
export const SOLAR_YEAR_DAYS = 365;
/** Effective compounding gap between the lunar Hawl and the solar calendar. */
export const LUNAR_SOLAR_RATIO = SOLAR_YEAR_DAYS / LUNAR_YEAR_DAYS; // ~1.0311
/** Over a solar decade the extra lunar cycles raise effective giving by ~2.577%. */
export const AAOIFI_LUNAR_PREMIUM_PCT = (LUNAR_SOLAR_RATIO - 1) * 100;

/** Format a Gregorian ISO date into its Hijri equivalent string. */
export function hawlTargetHijri(iso: string): string {
  try {
    return getDetailedHijriDate(new Date(iso), 0).formatted;
  } catch {
    return "";
  }
}

export const DEFAULT_PROFILE: UserProfile = {
  name: "Ibrahim Abdullahi",
  greetingName: "Ibrahim",
  hijriDate: "12 Rajab 1446 AH",
  gregorianDate: "Saturday, 18 January 2025",
};

export const CATEGORY_META: Record<
  AssetCategory,
  { color: string; tagline: string }
> = {
  Equities: { color: "#065F46", tagline: "Shariah-screened stocks" },
  Sukuk: { color: "#0F766E", tagline: "Asset-Backed Certificates (Sukuk)" },
  "Halal ETFs": { color: "#D97706", tagline: "Curated Shariah baskets" },
  Gold: { color: "#B45309", tagline: "Physical & vaulted bullion" },
  "Cash Buffer": { color: "#10B981", tagline: "Mudarabah liquid pool" },
};

/**
 * Preset Shariah-compliant portfolio. Values in NGN.
 * Totals sum to ₦20,450,000.
 */
export const INITIAL_HOLDINGS: HoldingItem[] = [
  {
    id: "dangcem",
    name: "Dangote Cement Plc",
    ticker: "DANGCEM",
    category: "Equities",
    units: 1000,
    pricePerUnit: 3450,
    marketValue: 3_450_000,
    dailyChangePct: 2.4,
    impurityRatio: 0.018,
    zakatQualifying: true,
  },
  {
    id: "mtnngr",
    name: "MTN Nigeria Communications",
    ticker: "MTNN",
    category: "Equities",
    units: 2000,
    pricePerUnit: 1400,
    marketValue: 2_800_000,
    dailyChangePct: -0.8,
    impurityRatio: 0.024,
    zakatQualifying: true,
  },
  {
    id: "buafood",
    name: "BUA Foods Plc",
    ticker: "BUAFOODS",
    category: "Equities",
    units: 1500,
    pricePerUnit: 1300,
    marketValue: 1_950_000,
    dailyChangePct: 1.2,
    impurityRatio: 0.011,
    zakatQualifying: true,
  },
  {
    id: "fgnsukuk",
    name: "FGN Sukuk Series VI",
    ticker: "FGNSUK6",
    category: "Sukuk",
    units: 4200,
    pricePerUnit: 1000,
    marketValue: 4_200_000,
    dailyChangePct: 0.15,
    impurityRatio: 0,
    zakatQualifying: false,
  },
  {
    id: "lotusfi",
    name: "Lotus Halal Sukuk Income Fund",
    ticker: "LOTHFI",
    category: "Sukuk",
    units: 2100,
    pricePerUnit: 1000,
    marketValue: 2_100_000,
    dailyChangePct: 0.05,
    impurityRatio: 0,
    zakatQualifying: false,
  },
  {
    id: "sibetc30",
    name: "Stanbic IBTC ETF 30",
    ticker: "SIBETF30",
    category: "Halal ETFs",
    units: 2500,
    pricePerUnit: 740,
    marketValue: 1_850_000,
    dailyChangePct: 1.1,
    impurityRatio: 0.009,
    zakatQualifying: true,
  },
  {
    id: "vetivasha",
    name: "Vetiva S&P Shariah ETF",
    ticker: "VETSH",
    category: "Halal ETFs",
    units: 2500,
    pricePerUnit: 500,
    marketValue: 1_250_000,
    dailyChangePct: -0.3,
    impurityRatio: 0.007,
    zakatQualifying: true,
  },
  {
    id: "newgold",
    name: "NewGold Vaulted Bullion",
    ticker: "NGOLD",
    category: "Gold",
    units: 17.84,
    pricePerUnit: GOLD_PRICE_PER_GRAM,
    marketValue: 1_650_000,
    dailyChangePct: 3.2,
    impurityRatio: 0,
    zakatQualifying: true,
  },
  {
    id: "jaizmad",
    name: "Jaiz Mudarabah Liquid Pool",
    ticker: "JAIZLIQ",
    category: "Cash Buffer",
    units: 1,
    pricePerUnit: 1_200_000,
    marketValue: 1_200_000,
    dailyChangePct: 0.02,
    impurityRatio: 0,
    zakatQualifying: true,
  },
];

export const CATEGORY_ORDER: AssetCategory[] = [
  "Equities",
  "Sukuk",
  "Halal ETFs",
  "Gold",
  "Cash Buffer",
];

/** Aggregate holdings into the 5 allocation slices used by the donut chart. */
export function buildAllocation(holdings: HoldingItem[]): AssetAllocationSlice[] {
  const total = holdings.reduce((s, h) => s + h.marketValue, 0) || 1;
  const map = new Map<AssetCategory, number>();
  for (const h of holdings) {
    map.set(h.category, (map.get(h.category) ?? 0) + h.marketValue);
  }
  return CATEGORY_ORDER.filter((c) => map.has(c)).map((category) => {
    const value = map.get(category) ?? 0;
    return {
      category,
      value,
      percent: (value / total) * 100,
      color: CATEGORY_META[category].color,
    };
  });
}

export function totalValue(holdings: HoldingItem[]): number {
  return holdings.reduce((s, h) => s + h.marketValue, 0);
}

export function dailyGain(holdings: HoldingItem[]): number {
  return holdings.reduce(
    (s, h) => s + (h.marketValue * h.dailyChangePct) / 100,
    0
  );
}

export function zakatQualifyingValue(holdings: HoldingItem[]): number {
  return holdings
    .filter((h) => h.zakatQualifying)
    .reduce((s, h) => s + h.marketValue, 0);
}

export function purificationDue(holdings: HoldingItem[]): number {
  // Estimate annual non-permissible income as 6% yield x impurity ratio.
  const ANNUAL_YIELD = 0.06;
  return holdings.reduce(
    (s, h) => s + h.marketValue * ANNUAL_YIELD * h.impurityRatio,
    0
  );
}

/** Storage key for the user's purification settlement history (localStorage). */
export const PURIFICATION_LOG_KEY = "nv_purification_log_v1";

/** AAOIFI board guideline: impurity ratio must stay below 5% of income. */
export const AAOIFI_MAX_IMPURITY = 0.05;

/** Estimated annual dividend/income yield basis used for cleansing math. */
export const DIVIDEND_YIELD_BASIS = 0.06;

const IMPURITY_NOTES: Record<string, string> = {
  dangcem:
    "Operating company holds excess cash in conventional bank deposits earning riba.",
  mtnngr:
    "Telecom operator carries riba-bearing financing and non-compliant income on float.",
  buafood:
    "Conglomerate earns minor non-compliant income on short-term conventional placements.",
  sibetc30:
    "ETF constituents include banks' non-compliant income allocations.",
  vetivash:
    "Index basket contains a small share of mixed non-compliant income.",
};

function impurityNoteFor(id: string): string {
  return (
    IMPURITY_NOTES[id] ??
    "Residual non-permissible income from conventional banking exposure."
  );
}

/**
 * Itemize every holding carrying non-permissible income, with the exact
 * cleansing amount due (6% dividend yield basis x impurity ratio).
 */
export function calculateHoldingsPurificationBreakdown(
  holdings: HoldingItem[]
): PurificationHoldingBreakdown[] {
  return holdings
    .filter((h) => h.impurityRatio > 0)
    .map((h) => {
      const dividendIncome = h.marketValue * DIVIDEND_YIELD_BASIS;
      return {
        id: h.id,
        name: h.name,
        ticker: h.ticker,
        category: h.category,
        marketValue: h.marketValue,
        dividendIncome,
        impurityRatio: h.impurityRatio,
        yieldPct: DIVIDEND_YIELD_BASIS * 100,
        cleansingAmount: dividendIncome * h.impurityRatio,
        impurityNote: impurityNoteFor(h.id),
      };
    })
    .sort((a, b) => b.cleansingAmount - a.cleansingAmount);
}

/** Average impurity ratio across holdings with non-permissible income (0-1). */
export function averageImpurityRatio(
  breakdown: PurificationHoldingBreakdown[]
): number {
  if (breakdown.length === 0) return 0;
  return (
    breakdown.reduce((s, b) => s + b.impurityRatio, 0) / breakdown.length
  );
}

/**
 * Vetted Sadaqah / public-benefit channels for disposing purification
 * funds. Purification goes to general public benefit (not the 8 Zakat
 * categories) per the plan's Shariah clarification.
 */
/** Default prohibited sector checks (all pass for certified halal assets). */
const DEFAULT_SECTOR_CHECKS: ProhibitedSectorCheck[] = [
  { sector: "Alcohol", passed: true },
  { sector: "Gambling", passed: true },
  { sector: "Conventional Banking", passed: true },
  { sector: "Tobacco", passed: true },
  { sector: "Pork Products", passed: true },
  { sector: "Adult Content", passed: true },
  { sector: "Weapons", passed: true },
];

/**
 * Per-asset Shariah screening metadata keyed by holding ID.
 */
export const ASSET_SCREENING_MAP: Record<string, AssetScreeningDetails> = {
  dangcem: {
    screeningDate: "March 2025",
    hijriDate: "15 Sha'ban 1446 AH",
    shariahBoard: "ACE Shariah Advisory Board",
    standard: "AAOIFI Standard No. 21",
    debtToAssetRatio: 0.18,
    cashToAssetRatio: 0.22,
    interestIncomeRatio: 0.018,
    prohibitedSectors: DEFAULT_SECTOR_CHECKS,
    purificationAmount: 3726,
    purificationPct: 1.8,
    auditorNote: "Operating company holds excess cash in conventional bank deposits earning riba.",
  },
  mtnngr: {
    screeningDate: "March 2025",
    hijriDate: "15 Sha'ban 1446 AH",
    shariahBoard: "Lotus Halal Advisory & AAOIFI Standards Committee",
    standard: "AAOIFI Standard No. 21",
    debtToAssetRatio: 0.27,
    cashToAssetRatio: 0.15,
    interestIncomeRatio: 0.024,
    prohibitedSectors: DEFAULT_SECTOR_CHECKS,
    purificationAmount: 4032,
    purificationPct: 2.4,
    auditorNote: "Telecom operator carries riba-bearing financing and non-compliant income on float.",
  },
  buafood: {
    screeningDate: "February 2025",
    hijriDate: "20 Rajab 1446 AH",
    shariahBoard: "ACE Shariah Advisory Board",
    standard: "AAOIFI Standard No. 21",
    debtToAssetRatio: 0.21,
    cashToAssetRatio: 0.11,
    interestIncomeRatio: 0.011,
    prohibitedSectors: DEFAULT_SECTOR_CHECKS,
    purificationAmount: 1287,
    purificationPct: 1.1,
    auditorNote: "Conglomerate earns minor non-compliant income on short-term conventional placements.",
  },
  fgnsukuk: {
    screeningDate: "January 2025",
    hijriDate: "10 Jumada al-Thani 1446 AH",
    shariahBoard: "National Sukuk Steering Committee",
    standard: "AAOIFI Shariah Standard No. 17 (Sukuk)",
    debtToAssetRatio: 0.0,
    cashToAssetRatio: 0.05,
    interestIncomeRatio: 0.0,
    prohibitedSectors: DEFAULT_SECTOR_CHECKS,
    purificationAmount: 0,
    purificationPct: 0,
    auditorNote: "Fully asset-backed sovereign sukuk with zero riba exposure.",
  },
  lotusfi: {
    screeningDate: "January 2025",
    hijriDate: "10 Jumada al-Thani 1446 AH",
    shariahBoard: "Lotus Halal Advisory & AAOIFI Standards Committee",
    standard: "AAOIFI Shariah Standard No. 17 (Sukuk)",
    debtToAssetRatio: 0.0,
    cashToAssetRatio: 0.03,
    interestIncomeRatio: 0.0,
    prohibitedSectors: DEFAULT_SECTOR_CHECKS,
    purificationAmount: 0,
    purificationPct: 0,
    auditorNote: "Islamic sukuk fund screened for zero conventional debt exposure.",
  },
  sibetc30: {
    screeningDate: "March 2025",
    hijriDate: "15 Sha'ban 1446 AH",
    shariahBoard: "ACE Shariah Advisory Board",
    standard: "AAOIFI Standard No. 21",
    debtToAssetRatio: 0.14,
    cashToAssetRatio: 0.09,
    interestIncomeRatio: 0.009,
    prohibitedSectors: DEFAULT_SECTOR_CHECKS,
    purificationAmount: 999,
    purificationPct: 0.9,
    auditorNote: "ETF constituents include minor non-compliant income allocations.",
  },
  vetivasha: {
    screeningDate: "February 2025",
    hijriDate: "20 Rajab 1446 AH",
    shariahBoard: "Vetiva Shariah Screening Panel",
    standard: "AAOIFI Standard No. 21",
    debtToAssetRatio: 0.12,
    cashToAssetRatio: 0.07,
    interestIncomeRatio: 0.007,
    prohibitedSectors: DEFAULT_SECTOR_CHECKS,
    purificationAmount: 525,
    purificationPct: 0.7,
    auditorNote: "Index basket contains a small share of mixed non-compliant income.",
  },
  newgold: {
    screeningDate: "January 2025",
    hijriDate: "10 Jumada al-Thani 1446 AH",
    shariahBoard: "ACE Shariah Advisory Board",
    standard: "AAOIFI Standard No. 54 (Gold & Silver)",
    debtToAssetRatio: 0.0,
    cashToAssetRatio: 0.0,
    interestIncomeRatio: 0.0,
    prohibitedSectors: DEFAULT_SECTOR_CHECKS,
    purificationAmount: 0,
    purificationPct: 0,
    auditorNote: "Physical vaulted bullion with zero income impurity.",
  },
  jaizmad: {
    screeningDate: "January 2025",
    hijriDate: "10 Jumada al-Thani 1446 AH",
    shariahBoard: "Jaiz Bank Shariah Supervisory Board",
    standard: "AAOIFI Shariah Standard No. 43 (Mudarabah)",
    debtToAssetRatio: 0.0,
    cashToAssetRatio: 0.0,
    interestIncomeRatio: 0.0,
    prohibitedSectors: DEFAULT_SECTOR_CHECKS,
    purificationAmount: 0,
    purificationPct: 0,
    auditorNote: "Pure profit-sharing mudarabah pool with no riba component.",
  },
};

// ---------------------------------------------------------------------------
// Halal Goals: metadata, math, and defaults
// ---------------------------------------------------------------------------

export const EXPECTED_ANNUAL_RETURN = 14.5; // portfolio benchmark p.a.
export const GOALS_STORAGE_KEY = "nv_halal_goals_v1";

export const ISLAMIC_GOALS_META: Record<
  IslamicGoalType,
  {
    arabic: string;
    niyyah: string;
    defaultTarget: number;
    defaultTimeline: number;
    description: string;
    color: string;
  }
> = {
  "Hajj Savings": {
    arabic: "حَجّ",
    niyyah: "O Allah, I intend to perform Hajj for Your sake, so make it easy for me.",
    defaultTarget: 5_000_000,
    defaultTimeline: 36,
    description: "Pilgrimage to Makkah - the fifth pillar of Islam.",
    color: "#065F46",
  },
  "Umrah Fund": {
    arabic: "عُمْرَة",
    niyyah: "Labbaik Allahumma Umrah - I answer Your call for Umrah.",
    defaultTarget: 2_500_000,
    defaultTimeline: 18,
    description: "Year-round pilgrimage to the Sacred House.",
    color: "#0F766E",
  },
  "Waqf (Endowment)": {
    arabic: "وَقْف",
    niyyah: "A charity whose reward never ceases, benefiting generations.",
    defaultTarget: 10_000_000,
    defaultTimeline: 60,
    description: "Perpetual community endowment - a sadaqah that outlives you.",
    color: "#D97706",
  },
  "Sadaqah Jariyah": {
    arabic: "صَدَقَة جَارِيَة",
    niyyah: "O Allah, make my wealth a means of ongoing benefit for Your servants.",
    defaultTarget: 3_000_000,
    defaultTimeline: 24,
    description: "Ongoing voluntary charity - wells, mosques, knowledge.",
    color: "#10B981",
  },
  "Islamic Education": {
    arabic: "عِلْم",
    niyyah: "O Allah, benefit me through what You have taught me.",
    defaultTarget: 4_000_000,
    defaultTimeline: 48,
    description: "Tuition, Qur'anic studies and scholarships for the next generation.",
    color: "#04442F",
  },
  "Nikah (Marriage) Fund": {
    arabic: "نِكَاح",
    niyyah: "Half your deen - a blessed union built on taqwa and barakah.",
    defaultTarget: 3_500_000,
    defaultTimeline: 30,
    description: "Sunnah marriage expenses and mahr.",
    color: "#B45309",
  },
};

/**
 * Monthly contribution using future-value-of-annuity formula:
 * PMT = (FV - PV*(1+r)^n) * r / ((1+r)^n - 1)
 * where r = annualReturn/12 (decimal), n = months.
 */
export function calculateMonthlyContribution(
  targetAmount: number,
  currentAmount: number,
  timelineMonths: number,
  annualReturnPct: number
): number {
  const r = annualReturnPct / 100 / 12;
  const n = timelineMonths;
  if (n <= 0) return targetAmount;
  if (r === 0) return Math.max(0, (targetAmount - currentAmount) / n);
  const growth = Math.pow(1 + r, n);
  const fvCurrent = currentAmount * growth;
  const remaining = targetAmount - fvCurrent;
  if (remaining <= 0) return 0;
  return remaining * r / (growth - 1);
}

/** Projected total value if user saves monthlyContribution for n months at r%. */
export function projectGoalGrowth(
  currentAmount: number,
  monthlyContribution: number,
  timelineMonths: number,
  annualReturnPct: number
): number {
  const r = annualReturnPct / 100 / 12;
  if (r === 0) return currentAmount + monthlyContribution * timelineMonths;
  const growth = Math.pow(1 + r, timelineMonths);
  return currentAmount * growth + monthlyContribution * ((growth - 1) / r);
}

export const DEFAULT_GOALS: HalalGoal[] = [
  {
    id: "goal-hajj-1",
    type: "Hajj Savings",
    title: "Hajj Mabrur Fund",
    targetAmount: 5_000_000,
    currentAmount: 1_250_000,
    timelineMonths: 36,
    expectedAnnualReturn: EXPECTED_ANNUAL_RETURN,
    monthlyContribution: calculateMonthlyContribution(5_000_000, 1_250_000, 36, EXPECTED_ANNUAL_RETURN),
    createdAt: "2025-01-15T10:00:00.000Z",
    notes: "For the obligatory pilgrimage - May Allah accept it.",
    status: "active",
  },
  {
    id: "goal-umrah-1",
    type: "Umrah Fund",
    title: "Ramadan Umrah 1447",
    targetAmount: 2_500_000,
    currentAmount: 800_000,
    timelineMonths: 18,
    expectedAnnualReturn: EXPECTED_ANNUAL_RETURN,
    monthlyContribution: calculateMonthlyContribution(2_500_000, 800_000, 18, EXPECTED_ANNUAL_RETURN),
    createdAt: "2025-02-01T08:00:00.000Z",
    notes: "Targeting the blessed last 10 nights of Ramadan.",
    status: "active",
  },
];

export const SADAQAH_CHANNELS: SadaqahOption[] = [
  {
    id: "cwf",
    name: "Clean Water Wells Initiative",
    focus: "Clean Water",
    location: "Northern Nigeria",
    blurb:
      "Bores community boreholes and solar-powered wells serving rural villages.",
    accountName: "Clean Water Wells Initiative",
    accountNumber: "1015500912",
    bank: "Jaiz Bank",
    verified: true,
  },
  {
    id: "health4all",
    name: "Sehati Health Access Fund",
    focus: "Healthcare",
    location: "Kano, Kano State",
    blurb:
      "Subsidises maternal care, dialysis and emergency surgeries for low-income families.",
    accountName: "Sehati Health Access Fund",
    accountNumber: "3015567801",
    bank: "Taj Bank",
    verified: true,
  },
  {
    id: "edurelief",
    name: "Iqra Education Relief",
    focus: "Education",
    location: "Ibadan, Oyo State",
    blurb:
      "Pays school fees and supplies STEM & Qur'anic learning kits to underserved pupils.",
    accountName: "Iqra Education Relief",
    accountNumber: "2016600345",
    bank: "Jaiz Bank",
    verified: true,
  },
  {
    id: "pubinfra",
    name: "Umma Public Infrastructure Trust",
    focus: "Public Infrastructure",
    location: "Abuja, FCT",
    blurb:
      "Funds street lighting, drainage and public market repairs benefiting whole communities.",
    accountName: "Umma Public Infrastructure Trust",
    accountNumber: "4017728846",
    bank: "Taj Bank",
    verified: true,
  },
];

// ---------------------------------------------------------------------------
// Shariah Governance: board statements, scholars, screening & audit cycle
// ---------------------------------------------------------------------------

export const GOVERNANCE_STATEMENTS = {
  oversight:
    "NaijaVest Halal is overseen by a Shariah Advisory Board of recognized Islamic scholars.",
  approval:
    "Our Shariah Advisory Board reviews and approves every asset in your portfolio.",
  standard: "AAOIFI",
  standardName:
    "Accounting and Auditing Organization for Islamic Financial Institutions",
};

export const SHARIAH_SCHOLARS: ScholarProfile[] = [
  {
    id: "al-misri",
    name: "Prof. Sheikh Dr. Abubakar Al-Misri",
    honorific: "Chairman of the Shariah Board",
    role: "Professor of Islamic Jurisprudence",
    credentials: [
      "PhD in Islamic Jurisprudence (Fiqh al-Mu'amalat)",
      "PhD in Islamic Banking",
    ],
    specialty: "Fiqh al-Mu'amalat & Islamic Banking",
    bio: "Recognized scholar with 20+ years of advisory experience guiding Islamic financial institutions through AAOIFI-compliant product structuring, fatwa issuance and board governance.",
    advisoryYears: "20+ years",
    badges: ["AAOIFI Compliant", "Fatwa Authority"],
    verified: true,
    initials: "AM",
  },
  {
    id: "bello",
    name: "Dr. Maryam Ibrahim Bello",
    honorific: "Shariah Scholar & Islamic FinTech Specialist",
    role: "Board Member",
    credentials: ["PhD in Islamic Finance & Law"],
    specialty: "Islamic Finance & FinTech",
    bio: "Advisor to non-interest banking institutions across Nigeria and West Africa, bridging classical Shariah principles with modern digital wealth platforms.",
    advisoryYears: "12+ years",
    badges: ["FinTech Specialist", "Non-Interest Banking"],
    verified: true,
    initials: "MB",
  },
  {
    id: "al-hassan",
    name: "Sheikh Usman Al-Hassan",
    honorific: "Sukuk & Capital Markets Specialist",
    role: "Board Member",
    credentials: [
      "Master's in Islamic Commercial Law",
      "Certified Shariah Advisor & Auditor (CSAA)",
    ],
    specialty: "Sukuk Structuring & Equity Screening",
    bio: "Certified Shariah Advisor & Auditor specializing in Sukuk structuring, capital market equity screening and continuous dividend cleansing programs.",
    advisoryYears: "10+ years",
    badges: ["CSAA Certified", "Sukuk Structuring"],
    verified: true,
    initials: "UH",
  },
];

export const SCREENING_METHODOLOGY_AVOID: ScreeningRule[] = [
  {
    id: "riba",
    title: "Riba",
    arabic: "رِبَا",
    description: "Riba / Usury",
    detail:
      "Conventional riba-bearing instruments, conventional debt certificates, and usurious lending models are excluded outright.",
  },
  {
    id: "gharar",
    title: "Gharar",
    arabic: "غَرَر",
    description: "Excessive Uncertainty & Speculation",
    detail:
      "Unbacked speculative contracts, binary options and gambling-like instruments are blocked for their excessive uncertainty and zero-sum nature.",
  },
  {
    id: "haram-sectors",
    title: "Haram Sectors",
    description: "Non-Permissible Business Activities",
    detail:
      "Alcohol, tobacco, conventional gambling/casinos, adult entertainment, pork processing and weapons/defense manufacturing are never held.",
  },
  {
    id: "leverage",
    title: "Excessive Leverage & Ratios",
    description: "Financial Ratio Filter",
    detail:
      "Companies exceeding 30-33% debt-to-market-cap ratios, or holding non-permissible income above the AAOIFI 5% tolerance threshold, are rejected.",
  },
];

export const SCREENING_METHODOLOGY_INVEST: ScreeningRule[] = [
  {
    id: "equities",
    title: "Halal Equities",
    description: "Shariah-Screened Stocks",
    detail:
      "Nigerian and global public equities that pass business-activity and financial-ratio screens are eligible for your portfolio.",
  },
  {
    id: "sukuk",
    title: "Sukuk",
    description: "Asset-Backed Trust Certificates",
    detail:
      "Sovereign sukuk (e.g. FGN Sukuk) and corporate asset-backed non-interest trust certificates backed by tangible assets.",
  },
  {
    id: "halal-etfs",
    title: "Halal ETFs",
    description: "AAOIFI-Compliant Index Funds",
    detail:
      "Index funds tracking AAOIFI-compliant global and emerging market equity baskets with ongoing screening.",
  },
  {
    id: "gold",
    title: "Physical Gold",
    description: "Allocated Vault Holdings",
    detail:
      "Allocated physical gold vault holdings backed 1:1 with audited bars and full provenance.",
  },
  {
    id: "cash-buffers",
    title: "Mudarabah & Murabaha Cash Buffers",
    description: "Non-Interest Liquidity",
    detail:
      "Islamic liquidity management buffers earning profit-share (mudarabah) or cost-plus trade (murabaha) rather than riba.",
  },
];

export const AUDIT_PROCESS_STEPS: CompliancePillar[] = [
  {
    id: "pre-screen",
    title: "Pre-Screening",
    tagline: "Business Activity Filter",
    description:
      "Every candidate asset is checked against the prohibited business-activity list before it can proceed.",
    badge: "Step 1",
  },
  {
    id: "ratio-audit",
    title: "Financial Ratio Audit",
    tagline: "Quantitative Filter",
    description:
      "Debt, cash and riba-income ratios are audited against AAOIFI thresholds (30-33% debt cap, 5% impurity tolerance).",
    badge: "Step 2",
  },
  {
    id: "board-approval",
    title: "Board Approval & Fatwa",
    tagline: "Scholar Oversight",
    description:
      "The Shariah Advisory Board reviews the file and issues a fatwa ruling approving the asset for the portfolio.",
    badge: "Step 3",
  },
  {
    id: "ongoing-monitoring",
    title: "Continuous Cleansing & Hawl",
    tagline: "Ongoing Compliance",
    description:
      "Dividend purification and hawl (lunar-year) monitoring run continuously to keep every holding compliant.",
    badge: "Step 4",
  },
];

// ---------------------------------------------------------------------------
// Islamic Finance Contract Architecture
// ---------------------------------------------------------------------------

export const CONTRACTS_EXCLUSION_NOTE =
  "We do not use Murabahah, Ijarah, or Tawarruq in this app. Those are financing contracts, not investment contracts.";

export const ISLAMIC_FINANCE_CONTRACTS: IslamicContract[] = [
  {
    id: "wakalah",
    name: "Wakalah",
    arabic: "وَكَالَة",
    englishMeaning: "Agency",
    category: "agency",
    mechanism:
      "One party appoints another as an agent to perform a specified task on their behalf, with a pre-agreed fee or profit share for the service rendered.",
    naijaverole:
      "NaijaVest acts as your authorized agent (wakeel) to invest your capital according to your mandate and risk profile.",
    status: "active",
    icon: "Handshake",
  },
  {
    id: "mudarabah",
    name: "Mudarabah",
    arabic: "مُضَارَبَة",
    englishMeaning: "Profit-Sharing Partnership",
    category: "profit-sharing",
    mechanism:
      "One party provides capital (rabb al-mal), the other provides expertise and management (mudarib). Profits are shared per a pre-agreed ratio; losses are borne by the capital provider unless due to negligence.",
    naijaverole:
      "Your Cash Buffer is held in a Mudarabah structure with Jaiz Bank. Profit is shared, never guaranteed. Your capital is at genuine risk.",
    status: "active",
    icon: "Coins",
  },
  {
    id: "musharakah",
    name: "Musharakah",
    arabic: "مُشَارَكَة",
    englishMeaning: "Joint Partnership",
    category: "partnership",
    mechanism:
      "All partners contribute capital and share in profit and loss proportionally. Each partner has ownership rights in the underlying assets.",
    naijaverole:
      "Used for joint asset ownership in your Halal Goals. You co-own the underlying sukuk and equity positions through a diminishing musharakah structure.",
    status: "active",
    icon: "Users",
  },
  {
    id: "jualah",
    name: "Jualah",
    arabic: "جَعَالَة",
    englishMeaning: "Commission-Based Reward",
    category: "commission",
    mechanism:
      "A unilateral promise to pay a specified commission or reward for completing a defined task. Unlike interest, the fee is for a service, not for lending money.",
    naijaverole:
      "Our advisory fee is structured as a Jualah commission for managing your portfolio and delivering Shariah-compliant returns. It is payment for a service, not interest on a loan.",
    status: "active",
    icon: "Lightbulb",
  },
  {
    id: "sukuk",
    name: "Sukuk",
    arabic: "صُكُوك",
    englishMeaning: "Investment Certificates",
    category: "certificates",
    mechanism:
      "Asset-backed certificates representing proportional ownership in tangible assets, usufruct, or venture. Returns come from the underlying asset performance, not interest.",
    naijaverole:
      "We invest in FGN Sukuk Series VI and corporate Sukuk funds (e.g. Lotus Halal Sukuk Income Fund) backed by real government and private-sector assets.",
    status: "active",
    icon: "Certificate",
  },
  {
    id: "qard-hasan",
    name: "Qard Hasan",
    arabic: "قَرْض حَسَن",
    englishMeaning: "Benevolent Loan",
    category: "benevolent-loan",
    mechanism:
      "An interest-free loan extended purely for goodwill. The borrower repays only the principal; no markup, fee, or profit is charged to the lender.",
    naijaverole:
      "Any short-term liquidity advance or emergency withdrawal processing is structured as a Qard Hasan. No interest or hidden charge is ever applied.",
    status: "available",
    icon: "HandCoins",
  },
];

export const EXCLUDED_FINANCING_CONTRACTS: ExcludedContract[] = [
  {
    id: "murabahah",
    name: "Murabahah",
    arabic: "مُرَابَحَة",
    reason:
      "A cost-plus financing contract used by banks to sell goods at a marked-up price. It is a debt-creation tool, not an investment partnership.",
  },
  {
    id: "ijarah",
    name: "Ijarah",
    arabic: "إِجَارَة",
    reason:
      "A lease-based financing structure where the bank rents an asset to the client. It generates rental income, not shared investment returns.",
  },
  {
    id: "tawarruq",
    name: "Tawarruq",
    arabic: "تَوَرُّق",
    reason:
      "A commodity-based monetization technique used to create synthetic cash liquidity. Scholars widely consider it a disguised form of riba-based lending.",
  },
];
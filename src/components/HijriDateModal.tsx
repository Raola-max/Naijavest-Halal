import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowClockwise,
  Calendar,
  Check,
  Coins,
  Heart,
  Hourglass,
  Info,
  Moon,
  Sparkle,
  StarAndCrescent,
  Sun,
  Target,
  X,
} from "@phosphor-icons/react";
import {
  AAOIFI_LUNAR_PREMIUM_PCT,
  HAWL_STORAGE_KEY,
  LUNAR_YEAR_DAYS,
  getDetailedHijriDate,
  getMoonSightingAdjustment,
  hawlTargetHijri,
  setMoonSightingAdjustment,
} from "../data/halalDashboardData";
import type { DetailedHijriDate, HijriMilestoneType } from "../types";

const DAY_MS = 86_400_000;

const MILESTONE_TONE: Record<
  HijriMilestoneType,
  { icon: React.ReactNode; ring: string; chip: string }
> = {
  zakat: { icon: <Coins size={15} weight="bold" />, ring: "ring-emerald-200", chip: "bg-emerald-50 text-emerald-700" },
  charity: { icon: <Heart size={15} weight="bold" />, ring: "ring-rose-200", chip: "bg-rose-50 text-rose-700" },
  fasting: { icon: <Moon size={15} weight="bold" />, ring: "ring-indigo-200", chip: "bg-indigo-50 text-indigo-700" },
  hajj: { icon: <StarAndCrescent size={15} weight="bold" />, ring: "ring-amber-200", chip: "bg-amber-50 text-amber-700" },
  general: { icon: <Sparkle size={15} weight="bold" />, ring: "ring-slate-200", chip: "bg-slate-100 text-slate-700" },
};

function MoonDisc({ illum, waxing }: { illum: number; waxing: boolean }) {
  const side = waxing ? "30%" : "70%";
  return (
    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#0F172A] ring-1 ring-amber-200/40">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at ${side} 35%, #FEF3C7, #F59E0B 55%, rgba(245,158,11,0.15) 78%, transparent 82%)`,
          opacity: 0.25 + (illum / 100) * 0.75,
        }}
      />
      <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-amber-100/90">
        {illum}%
      </span>
    </div>
  );
}

function loadHawlTarget(): string {
  try {
    const stored = localStorage.getItem(HAWL_STORAGE_KEY);
    if (stored) return stored;
    const t = new Date(Date.now() + LUNAR_YEAR_DAYS * DAY_MS).toISOString();
    localStorage.setItem(HAWL_STORAGE_KEY, t);
    return t;
  } catch {
    return new Date(Date.now() + LUNAR_YEAR_DAYS * DAY_MS).toISOString();
  }
}

export default function HijriDateModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [adjustment, setAdjustment] = useState<number>(() => getMoonSightingAdjustment());
  const [hawlTarget, setHawlTarget] = useState<string>(() => loadHawlTarget());

  useEffect(() => {
    if (open) setAdjustment(getMoonSightingAdjustment());
  }, [open]);

  const hijri: DetailedHijriDate = useMemo(
    () => getDetailedHijriDate(new Date(), adjustment),
    [adjustment]
  );

  const hawl = useMemo(() => {
    const diff = new Date(hawlTarget).getTime() - Date.now();
    return {
      days: Math.max(0, Math.floor(diff / DAY_MS)),
      complete: diff <= 0,
      hijri: hawlTargetHijri(hawlTarget),
      gregorian: new Date(hawlTarget).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    };
  }, [hawlTarget]);

  function applyAdjustment(days: number) {
    const next = setMoonSightingAdjustment(days);
    setAdjustment(next);
    toast.success(`Hijri date recalculated (${next >= 0 ? "+" : ""}${next} day${next === 1 ? "" : "s"})`, {
      description: "Your local moon-sighting preference was saved.",
    });
  }

  function setHawlFromInput(value: string) {
    if (!value) return;
    const iso = new Date(`${value}T00:00:00`).toISOString();
    localStorage.setItem(HAWL_STORAGE_KEY, iso);
    setHawlTarget(iso);
    toast.success("Zakat Hawl anniversary updated");
  }

  function resetHawl() {
    const iso = new Date(Date.now() + LUNAR_YEAR_DAYS * DAY_MS).toISOString();
    localStorage.setItem(HAWL_STORAGE_KEY, iso);
    setHawlTarget(iso);
    toast.message("Hawl reset to one lunar year from today");
  }

  const waxing = hijri.moonPhase.phaseIcon.startsWith("waxing") || hijri.moonPhase.phaseIcon === "first-quarter" || hijri.moonPhase.phaseIcon === "new";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/60 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 10 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[#F8FAFC] shadow-2xl"
          >
            {/* Header */}
            <div className="relative overflow-hidden rounded-t-3xl bg-gradient-to-br from-[#065F46] via-[#064E3B] to-[#0F172A] p-6 text-white">
              <div
                className="pointer-events-none absolute inset-0 opacity-30"
                style={{ background: "radial-gradient(45% 60% at 90% 0%, rgba(217,119,6,0.5), transparent 60%)" }}
              />
              <div className="relative flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100/70">
                    Hijri &amp; Lunar Hub
                  </p>
                  <p dir="rtl" className="mt-2 font-display text-3xl font-extrabold leading-tight text-amber-200">
                    {hijri.formattedArabic}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-white">{hijri.formatted}</p>
                  <p className="mt-0.5 text-xs text-emerald-100/60">{hijri.gregorian}</p>
                </div>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-white ring-1 ring-white/20 transition hover:bg-white/20 active:scale-95"
                >
                  <X size={18} />
                </button>
              </div>
              <span className="relative mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/30">
                <span>{hijri.seasonEmoji}</span>
                {hijri.seasonTag}
              </span>
            </div>

            <div className="space-y-5 p-6">
              {/* Moon phase */}
              <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <MoonDisc illum={hijri.moonPhase.illuminationPct} waxing={waxing} />
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Current Moon Phase</p>
                  <p className="mt-0.5 font-display text-base font-bold text-slate-900">{hijri.moonPhase.phaseName}</p>
                  <p className="text-xs text-slate-500">
                    Lunar age {hijri.moonPhase.ageDays} days · {hijri.moonPhase.illuminationPct}% illuminated
                  </p>
                </div>
                {hijri.moonPhase.isWhiteDays && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-700 ring-1 ring-indigo-200">
                    <Sun size={13} weight="fill" /> White Days
                  </span>
                )}
              </div>

              {/* Sacred month note */}
              <div className={`rounded-2xl border p-4 ${hijri.isSacredMonth ? "border-amber-200 bg-amber-50" : "border-slate-200 bg-white"}`}>
                <div className="flex items-center gap-2">
                  <StarAndCrescent size={18} className={hijri.isSacredMonth ? "text-amber-600" : "text-emerald-600"} />
                  <p className="font-display text-sm font-bold text-slate-900">
                    {hijri.isSacredMonth ? `Sacred Month of ${hijri.monthName}` : hijri.monthName}
                  </p>
                </div>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{hijri.sacredMonthNote}</p>
              </div>

              {/* Seasonal insights / milestones */}
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                  <Info size={14} className="text-emerald-600" /> Islamic Wealth &amp; Seasonal Insights
                </p>
                <div className="space-y-2">
                  {hijri.milestones.length === 0 && (
                    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 text-xs text-slate-500">
                      No special seasonal obligation today. Keep your voluntary charity and Hawl tracking consistent.
                    </div>
                  )}
                  {hijri.milestones.map((m) => {
                    const tone = MILESTONE_TONE[m.type];
                    return (
                      <motion.div
                        key={m.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-2xl border border-slate-100 bg-white p-4 shadow-sm ring-1 ${tone.ring}`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${tone.chip}`}>{tone.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-bold text-slate-900">{m.title}</p>
                              <span dir="rtl" className="text-sm font-semibold text-emerald-700">{m.arabic}</span>
                            </div>
                            <p className="mt-0.5 text-xs text-slate-500">{m.description}</p>
                            <p className="mt-1.5 inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                              <Check size={12} weight="bold" /> {m.action}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Hawl widget */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Hourglass size={18} className="text-amber-600" />
                  <p className="font-display text-sm font-bold text-slate-900">Zakat Hawl Anniversary</p>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  {hawl.complete ? "Your lunar year is complete — Zakat is due." : `${hawl.days} days until your Zakat year completes.`}
                </p>
                <div className="mt-2 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] font-medium text-emerald-800">
                  <Calendar size={14} />
                  Target: {hawl.gregorian} · <span dir="rtl" className="font-semibold">{hawl.hijri}</span>
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <label className="text-xs font-medium text-slate-500">Set date</label>
                  <input
                    type="date"
                    value={hawlTarget.slice(0, 10)}
                    onChange={(e) => setHawlFromInput(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
                  />
                  <button
                    onClick={resetHawl}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 active:scale-95"
                  >
                    <ArrowClockwise size={13} /> Reset
                  </button>
                </div>
                <p className="mt-2 text-[10px] leading-relaxed text-slate-400">
                  AAOIFI Hawl follows the 354-day lunar year. Tracking by lunar cycle raises your effective annual giving by ~{AAOIFI_LUNAR_PREMIUM_PCT.toFixed(3)}% vs a solar year.
                </p>
              </div>

              {/* Moon sighting calibrator */}
              <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <Target size={18} className="text-emerald-600" />
                  <p className="font-display text-sm font-bold text-slate-900">Moon Sighting Calibrator</p>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Adjust for your local sighting committee. The date recalculates instantly and is saved.
                </p>
                <div className="mt-3 flex items-center justify-center gap-2">
                  {[-2, -1, 0, 1, 2].map((d) => (
                    <button
                      key={d}
                      onClick={() => applyAdjustment(d)}
                      className={`h-10 w-12 rounded-xl text-sm font-bold transition active:scale-95 ${
                        adjustment === d
                          ? "bg-gradient-to-r from-[#065F46] to-[#10B981] text-white shadow-md shadow-emerald-900/20"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-emerald-50"
                      }`}
                    >
                      {d > 0 ? `+${d}` : d}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-center text-[11px] font-medium text-slate-400">
                  Showing {hijri.formatted}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

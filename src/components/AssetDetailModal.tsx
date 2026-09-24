import { AnimatePresence, motion } from "framer-motion";
import {
  ShieldCheck,
  SealCheck,
  CalendarCheck,
  Bank,
  X,
  TrendUp,
  TrendDown,
  CheckCircle,
  Prohibit,
  Coins,
  Scales,
  Certificate,
  HandCoins,
  ArrowRight,
} from "@phosphor-icons/react";
import {
  ASSET_SCREENING_MAP,
  CATEGORY_META,
  formatNaira,
  formatSignedPct,
} from "../data/halalDashboardData";
import type { AssetScreeningDetails, HoldingItem } from "../types";

interface Props {
  holding: HoldingItem | null;
  onClose: () => void;
}

export default function AssetDetailModal({ holding, onClose }: Props) {
  const screening: AssetScreeningDetails | undefined = holding
    ? ASSET_SCREENING_MAP[holding.id]
    : undefined;

  return (
    <AnimatePresence>
      {holding && screening && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

          {/* Sheet */}
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.97 }}
            transition={{ type: "spring", damping: 28, stiffness: 350 }}
            onClick={(e) => e.stopPropagation()}
            className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 rounded-t-3xl bg-white/95 backdrop-blur-sm border-b border-slate-100 px-6 pt-5 pb-4">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    {holding.ticker}
                  </p>
                  <h2 className="mt-0.5 text-lg font-bold text-slate-900 truncate">
                    {holding.name}
                  </h2>
                  <div className="mt-1.5 flex items-center gap-2">
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      style={{
                        backgroundColor: `${CATEGORY_META[holding.category].color}14`,
                        color: CATEGORY_META[holding.category].color,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: CATEGORY_META[holding.category].color }}
                      />
                      {holding.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 active:scale-90"
                  aria-label="Close"
                >
                  <X size={18} weight="bold" />
                </button>
              </div>

              {/* Value row */}
              <div className="mt-3 flex items-end justify-between">
                <div>
                  <p className="text-2xl font-bold tabular-nums text-slate-900">
                    {formatNaira(holding.marketValue)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {holding.units.toLocaleString()} units @ {formatNaira(holding.pricePerUnit)}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold tabular-nums ${
                    holding.dailyChangePct >= 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {holding.dailyChangePct >= 0 ? (
                    <TrendUp size={14} />
                  ) : (
                    <TrendDown size={14} />
                  )}
                  {formatSignedPct(holding.dailyChangePct)}
                </span>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {/* Certified Halal Seal */}
              <div className="rounded-2xl border border-emerald-200/60 bg-gradient-to-br from-emerald-50 to-teal-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="grid h-12 w-12 place-items-center rounded-full bg-emerald-600 shadow-lg shadow-emerald-200">
                    <SealCheck size={26} className="text-white" weight="fill" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      Certified Halal
                    </p>
                    <p className="text-[11px] text-emerald-700/80">
                      {screening.standard}
                    </p>
                  </div>
                  <div className="ml-auto flex items-center gap-1 text-emerald-700">
                    <ShieldCheck size={16} weight="fill" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              {/* Why is this Halal? */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Certificate size={16} className="text-emerald-600" />
                  Why is this Halal?
                </h3>
                <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <p className="text-[13px] leading-relaxed text-slate-700">
                    This asset passed our Shariah screening: no riba income, no haram sectors
                    (alcohol, gambling, conventional banking, tobacco, pork, adult content, weapons),
                    and debt-to-assets ratio below 33%.
                  </p>
                </div>
              </section>

              {/* Screening Parameters */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Scales size={16} className="text-emerald-600" />
                  Screening Parameters
                </h3>
                <div className="mt-3 space-y-3">
                  {/* Debt to Assets */}
                  <RatioBar
                    label="Debt-to-Assets Ratio"
                    value={screening.debtToAssetRatio}
                    threshold={0.33}
                    icon={<Bank size={14} />}
                  />
                  {/* Cash to Assets */}
                  <RatioBar
                    label="Cash-to-Assets Ratio"
                    value={screening.cashToAssetRatio}
                    threshold={0.05}
                    icon={<Coins size={14} />}
                  />
                  {/* Non-Compliant Income */}
                  <RatioBar
                    label="Non-Permissible Income"
                    value={screening.interestIncomeRatio}
                    threshold={0.05}
                    icon={<Prohibit size={14} />}
                  />
                </div>
              </section>

              {/* Prohibited Sectors */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <Prohibit size={16} className="text-emerald-600" />
                  Prohibited Sector Audit
                </h3>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {screening.prohibitedSectors.map((s) => (
                    <div
                      key={s.sector}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-[11px] font-semibold ${
                        s.passed
                          ? "bg-emerald-50 text-emerald-800"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {s.passed ? (
                        <CheckCircle size={13} weight="fill" className="text-emerald-600 shrink-0" />
                      ) : (
                        <X size={13} weight="bold" className="text-rose-500 shrink-0" />
                      )}
                      <span className="truncate">{s.sector}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Screening Governance */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <CalendarCheck size={16} className="text-emerald-600" />
                  Screening Governance
                </h3>
                <div className="mt-3 space-y-2.5 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-slate-500">Screening Date</span>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-800">{screening.screeningDate}</p>
                      <p className="text-[10px] text-slate-400">{screening.hijriDate}</p>
                    </div>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-slate-500">Shariah Board</span>
                    <p className="text-right text-xs font-semibold text-slate-800 max-w-[60%]">
                      {screening.shariahBoard}
                    </p>
                  </div>
                  <div className="h-px bg-slate-200" />
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[11px] text-slate-500">Standard Applied</span>
                    <p className="text-right text-xs font-semibold text-slate-800">
                      {screening.standard}
                    </p>
                  </div>
                </div>
              </section>

              {/* Purification */}
              <section>
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                  <HandCoins size={16} className="text-amber-600" />
                  Purification Due
                </h3>
                <div className="mt-3 rounded-xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 p-4">
                  {screening.purificationAmount > 0 ? (
                    <>
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-[11px] text-amber-700/70">
                            Impure income ratio
                          </p>
                          <p className="text-xs font-semibold text-amber-900">
                            {screening.purificationPct}% of dividend income
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[11px] text-amber-700/70">Amount to purify</p>
                          <p className="text-xl font-bold tabular-nums text-amber-900">
                            {formatNaira(screening.purificationAmount)}
                          </p>
                        </div>
                      </div>
                      <p className="mt-3 text-[11px] leading-relaxed text-amber-800/80">
                        {screening.auditorNote}
                      </p>
                      <button
                        onClick={onClose}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-amber-700 active:scale-95"
                      >
                        Purify Now
                        <ArrowRight size={13} />
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} weight="fill" className="text-emerald-600" />
                      <div>
                        <p className="text-xs font-semibold text-emerald-900">
                          No purification required
                        </p>
                        <p className="text-[11px] text-emerald-700/70">
                          This asset has zero non-permissible income exposure.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>

            {/* Bottom safe area for mobile */}
            <div className="h-4 sm:h-6" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Sub-component: RatioBar ---------- */
function RatioBar({
  label,
  value,
  threshold,
  icon,
}: {
  label: string;
  value: number;
  threshold: number;
  icon: React.ReactNode;
}) {
  const pct = Math.min(value * 100, 100);
  const maxPct = threshold * 100;
  const barWidth = Math.min((pct / maxPct) * 100, 100);
  const passed = value <= threshold;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">{icon}</span>
          <span className="text-[11px] font-medium text-slate-600">{label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold tabular-nums text-slate-800">
            {(value * 100).toFixed(1)}%
          </span>
          {passed ? (
            <CheckCircle size={14} weight="fill" className="text-emerald-600" />
          ) : (
            <X size={14} weight="bold" className="text-rose-500" />
          )}
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200">
        <div
          className={`h-full rounded-full transition-all ${
            passed ? "bg-emerald-500" : "bg-rose-500"
          }`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="text-[10px] text-slate-400">0%</span>
        <span className="text-[10px] text-slate-400">
          Max {maxPct}%
        </span>
      </div>
    </div>
  );
}
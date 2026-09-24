import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle,
  Drop,
  HandHeart,
  Info,
  MagnifyingGlass,
  Scales,
  SealCheck,
  ShieldCheck,
} from "@phosphor-icons/react";
import {
  AAOIFI_MAX_IMPURITY,
  PURIFICATION_LOG_KEY,
  SADAQAH_CHANNELS,
  SHARIAH_BOARD,
  averageImpurityRatio,
  calculateHoldingsPurificationBreakdown,
  formatNaira,
} from "../data/halalDashboardData";
import type {
  HoldingItem,
  PurificationHoldingBreakdown,
  PurificationRecord,
  SadaqahOption,
  UserProfile,
} from "../types";
import { PurifyDrawer } from "./PurifyDrawer";

interface Props {
  profile: UserProfile;
  holdings: HoldingItem[];
  onPurify: (amount: number, record: PurificationRecord) => void;
  purifiedTotal: number;
}

const EDUCATION_COPY =
  "Sometimes a Halal-screened company earns a small amount of impermissible income (e.g., riba income). We calculate that amount so you can purify your wealth through charity.";

const NON_ZAKAT_NOTE =
  "Purification is not Zakat. It is a separate obligation to cleanse impermissible income from your portfolio.";

const AAOIFI_META =
  "AAOIFI Shariah Standard No. 21 caps incidental non-permissible income at 5% of total income. Any amount above that must be donated to charitable causes and cannot be retained.";

const DIVIDEND_YIELD = 0.06;

function loadLog(): PurificationRecord[] {
  try {
    const raw = localStorage.getItem(PURIFICATION_LOG_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PurificationRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function PurificationScreen({
  profile,
  holdings,
  onPurify,
  purifiedTotal,
}: Props) {
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<string>("All");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [log, setLog] = useState<PurificationRecord[]>(loadLog);

  const breakdown = useMemo(
    () => calculateHoldingsPurificationBreakdown(holdings),
    [holdings]
  );

  const totalDue = useMemo(
    () => breakdown.reduce((s, b) => s + b.cleansingAmount, 0),
    [breakdown]
  );

  const avgImpurity = useMemo(() => averageImpurityRatio(breakdown), [breakdown]);

  const dividendBase = useMemo(
    () => breakdown.reduce((s, b) => s + b.dividendIncome, 0),
    [breakdown]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    breakdown.forEach((b) => set.add(b.category));
    return ["All", ...Array.from(set)];
  }, [breakdown]);

  const visible = useMemo(
    () =>
      breakdown.filter(
        (b) =>
          (catFilter === "All" || b.category === catFilter) &&
          (query.trim() === "" ||
            b.name.toLowerCase().includes(query.trim().toLowerCase()) ||
            b.ticker.toLowerCase().includes(query.trim().toLowerCase()))
      ),
    [breakdown, catFilter, query]
  );

  function confirmPurify(amount: number, org: SadaqahOption, note: string) {
    if (amount <= 0) {
      toast.error("Enter a valid amount to purify");
      return;
    }
    const record: PurificationRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      amount,
      organizationId: org.id,
      organizationName: org.name,
      timestamp: new Date().toISOString(),
      reference: `PUR-${Date.now().toString(36).toUpperCase()}`,
      note,
    };
    const next = [record, ...log];
    setLog(next);
    localStorage.setItem(PURIFICATION_LOG_KEY, JSON.stringify(next));
    onPurify(amount, record);
    setDrawerOpen(false);
    toast.success(`Purified ${formatNaira(amount)} via ${org.name}`, {
      description: "Non-permissible income cleansed. Barakah preserved.",
    });
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2 text-sm text-amber-700">
            <Scales size={17} weight="bold" />
            <span className="font-semibold">Purification Tracker</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Cleanse your portfolio, {profile.greetingName}
          </h1>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">
            Disperse tiny amounts of non-permissible income to verified
            public-benefit causes, guided by AAOIFI standards.
          </p>
        </div>
        <button
          onClick={() => setDrawerOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#D97706] to-amber-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition hover:brightness-105 active:scale-[0.98]"
        >
          <HandHeart size={16} weight="bold" /> Purify Now
        </button>
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#065F46] via-[#0A7A55] to-[#0F9D6E] p-6 text-white shadow-lg shadow-emerald-900/20 sm:p-8"
      >
        <div className="flex flex-col gap-5 md:flex-row md:items-center">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
            <Drop size={26} weight="fill" className="text-amber-300" />
          </div>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-emerald-200">
              Why purification matters
            </p>
            <p className="mt-1.5 font-display text-lg font-bold leading-snug sm:text-xl">
              {EDUCATION_COPY}
            </p>
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/20">
              <Info size={17} weight="fill" className="mt-0.5 shrink-0 text-amber-300" />
              <p className="text-[13px] leading-relaxed text-emerald-50">{NON_ZAKAT_NOTE}</p>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.14, ease: "easeOut" }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <MetricCard
          label="Total Purification Due"
          value={formatNaira(totalDue)}
          sub="Cleanse this amount this year"
          tone="amber"
          emphasis
        />
        <MetricCard
          label="Portfolio Dividend Yield"
          value={`${(DIVIDEND_YIELD * 100).toFixed(1)}%`}
          sub="Income base for cleansing"
          tone="emerald"
        />
        <MetricCard
          label="Average Impurity Rate"
          value={`${(avgImpurity * 100).toFixed(2)}%`}
          sub={`AAOIFI limit ${(AAOIFI_MAX_IMPURITY * 100).toFixed(0)}%`}
          tone="teal"
        />
        <MetricCard
          label="Total Purified to Date"
          value={formatNaira(purifiedTotal)}
          sub="Across all past settlements"
          tone="slate"
        />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Breakdown by Holding
            </h2>
            <p className="text-xs text-slate-500">
              Every asset with non-zero impermissible income
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2 focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-100">
              <MagnifyingGlass size={15} className="text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search ticker or asset"
                className="w-full bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-300 sm:w-44"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCatFilter(c)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    catFilter === c
                      ? "bg-[#065F46] text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 hidden overflow-hidden rounded-2xl ring-1 ring-slate-100 lg:block">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[11px] uppercase tracking-wide text-slate-400">
                <th className="px-4 py-3 font-semibold">Asset</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 text-right font-semibold">Market Value</th>
                <th className="px-4 py-3 text-right font-semibold">Dividend Base</th>
                <th className="px-4 py-3 text-right font-semibold">Impurity</th>
                <th className="px-4 py-3 text-right font-semibold">Amount Due</th>
                <th className="px-4 py-3 font-semibold">Screening</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((b) => (
                <BreakdownRow key={b.id} b={b} />
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-5 space-y-3 lg:hidden">
          <AnimatePresence initial={false}>
            {visible.map((b) => (
              <MobileBreakdownCard key={b.id} b={b} />
            ))}
          </AnimatePresence>
        </div>

        {visible.length === 0 && (
          <div className="grid place-items-center rounded-2xl bg-slate-50/60 py-10 text-center">
            <Drop size={24} className="text-slate-300" />
            <p className="mt-2 text-sm font-medium text-slate-500">
              No holdings match this filter
            </p>
          </div>
        )}

        <div className="mt-5 flex items-start gap-2.5 rounded-2xl bg-amber-50/70 px-4 py-3 ring-1 ring-amber-100">
          <ShieldCheck size={17} weight="fill" className="mt-0.5 shrink-0 text-[#D97706]" />
          <p className="text-xs leading-relaxed text-amber-900/80">{AAOIFI_META}</p>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.26, ease: "easeOut" }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#D97706] to-amber-500 p-6 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-lg font-bold text-white">
              {formatNaira(totalDue)} is pending cleansing
            </p>
            <p className="mt-0.5 text-sm text-amber-100">
              Give to verified Sadaqah causes and mark it purified.
            </p>
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-[#D97706] shadow-md transition hover:bg-amber-50 active:scale-[0.98]"
          >
            <HandHeart size={16} weight="bold" /> Purify Now
            <ArrowRight size={15} weight="bold" />
          </button>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-slate-900">
              Purification History
            </h3>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-100">
              {log.length} settlement{log.length === 1 ? "" : "s"}
            </span>
          </div>
          {log.length === 0 ? (
            <div className="mt-3 grid place-items-center rounded-2xl bg-slate-50/60 py-10 text-center">
              <CheckCircle size={24} className="text-slate-300" />
              <p className="mt-2 text-sm font-medium text-slate-500">
                No purifications yet. Use "Purify Now" to log your first cleansing.
              </p>
            </div>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              <AnimatePresence initial={false}>
                {log.map((r) => (
                  <HistoryRow key={r.id} r={r} />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </motion.section>

      <PurifyDrawer
        open={drawerOpen}
        totalDue={totalDue}
        onClose={() => setDrawerOpen(false)}
        onConfirm={confirmPurify}
      />
    </div>
  );
}

function MetricCard({
  label,
  value,
  sub,
  tone,
  emphasis,
}: {
  label: string;
  value: string;
  sub: string;
  tone: "emerald" | "amber" | "teal" | "slate";
  emphasis?: boolean;
}) {
  const tones: Record<string, string> = {
    emerald: "from-emerald-50/80 to-white text-[#065F46] ring-emerald-100",
    amber: "from-amber-50/80 to-white text-amber-700 ring-amber-100",
    teal: "from-teal-50/80 to-white text-teal-700 ring-teal-100",
    slate: "from-slate-50/80 to-white text-slate-700 ring-slate-200/80",
  };
  return (
    <div
      className={`rounded-2xl bg-gradient-to-br p-5 ring-1 transition ${
        tones[tone]
      } ${emphasis ? "shadow-md shadow-amber-900/10" : "shadow-sm"}`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 font-display text-2xl font-extrabold tracking-tight text-slate-900 ${
          emphasis ? "text-[#D97706]" : ""
        }`}
      >
        {value}
      </p>
      <p className="mt-1 text-[11px] text-slate-400">{sub}</p>
    </div>
  );
}

function BreakdownRow({ b }: { b: PurificationHoldingBreakdown }) {
  return (
    <tr className="transition hover:bg-amber-50/40">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">{b.name}</p>
        <p className="text-[11px] font-medium tracking-wide text-slate-400">{b.ticker}</p>
      </td>
      <td className="px-4 py-3">
        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
          {b.category}
        </span>
      </td>
      <td className="px-4 py-3 text-right text-sm font-semibold tabular-nums text-slate-700">
        {formatNaira(b.marketValue, true)}
      </td>
      <td className="px-4 py-3 text-right text-sm font-medium tabular-nums text-slate-500">
        {formatNaira(b.dividendIncome, true)}
      </td>
      <td className="px-4 py-3 text-right">
        <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-bold tabular-nums text-amber-700 ring-1 ring-amber-100">
          {(b.impurityRatio * 100).toFixed(1)}%
        </span>
      </td>
      <td className="px-4 py-3 text-right font-display text-sm font-extrabold tabular-nums text-[#D97706]">
        {formatNaira(b.cleansingAmount)}
      </td>
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
          <SealCheck size={13} weight="fill" /> AAOIFI OK
        </span>
      </td>
    </tr>
  );
}

function MobileBreakdownCard({ b }: { b: PurificationHoldingBreakdown }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{b.name}</p>
          <p className="text-[11px] font-medium tracking-wide text-slate-400">{b.ticker}</p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
          {b.category}
        </span>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{b.impurityNote}</p>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <Cell label="Market value" value={formatNaira(b.marketValue, true)} />
        <Cell label="Dividend base" value={formatNaira(b.dividendIncome, true)} />
        <Cell label="Impurity" value={`${(b.impurityRatio * 100).toFixed(1)}%`} />
      </div>
      <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-50 px-3 py-2.5 ring-1 ring-amber-100">
        <span className="text-xs font-semibold text-amber-800">Cleansing amount</span>
        <span className="font-display text-sm font-extrabold text-[#D97706]">
          {formatNaira(b.cleansingAmount)}
        </span>
      </div>
    </motion.div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50/70 px-2.5 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-0.5 text-xs font-bold tabular-nums text-slate-700">{value}</p>
    </div>
  );
}

function HistoryRow({ r }: { r: PurificationRecord }) {
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-center justify-between gap-3 py-3"
    >
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-50 text-[#065F46]">
          <HandHeart size={17} weight="bold" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-800">{r.organizationName}</p>
          <p className="text-[11px] text-slate-400">
            {r.reference} ·{" "}
            {new Date(r.timestamp).toLocaleString("en-NG", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-display text-sm font-extrabold tabular-nums text-[#065F46]">
          {formatNaira(r.amount)}
        </p>
        <p className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-700">
          <CheckCircle size={12} weight="fill" /> Settled
        </p>
      </div>
    </motion.li>
  );
}
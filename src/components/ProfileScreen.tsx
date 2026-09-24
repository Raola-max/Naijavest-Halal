import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bank,
  Certificate,
  ChartLineUp,
  Coins,
  Drop,
  Handshake,
  MoonStars,
  Scales,
  SealCheck,
  ShieldCheck,
  Sparkle,
  Target,
  UserCircle,
  Users,
  Wallet,
} from "@phosphor-icons/react";
import {
  BRAND_NAME,
  CATEGORY_META,
  SHARIAH_BOARD,
  buildAllocation,
  formatNaira,
  getDetailedHijriDate,
  totalValue,
  zakatQualifyingValue,
} from "../data/halalDashboardData";
import type { HalalGoal, HoldingItem, UserProfile } from "../types";

interface Props {
  profile: UserProfile;
  holdings: HoldingItem[];
  goals: HalalGoal[];
  purifiedTotal: number;
  onOpenHijri: () => void;
}

const CONTRACTS = [
  {
    id: "wakalah",
    name: "Wakalah",
    arabic: "وَكَالَة",
    icon: <Handshake size={18} weight="bold" />,
    role: "NaijaVest acts as your authorized agent to invest per your mandate.",
  },
  {
    id: "mudarabah",
    name: "Mudarabah",
    arabic: "مُضَارَبَة",
    icon: <Coins size={18} weight="bold" />,
    role: "Your cash buffer shares profit with Jaiz Bank - never a guaranteed return.",
  },
  {
    id: "musharakah",
    name: "Musharakah",
    arabic: "مُشَارَكَة",
    icon: <Users size={18} weight="bold" />,
    role: "You co-own the underlying sukuk and equity positions in your goals.",
  },
];

export default function ProfileScreen({
  profile,
  holdings,
  goals,
  purifiedTotal,
  onOpenHijri,
}: Props) {
  const total = useMemo(() => totalValue(holdings), [holdings]);
  const cashBuffer = useMemo(
    () =>
      holdings
        .filter((h) => h.category === "Cash Buffer")
        .reduce((s, h) => s + h.marketValue, 0),
    [holdings]
  );
  const zakatValue = useMemo(() => zakatQualifyingValue(holdings), [holdings]);
  const allocation = useMemo(() => buildAllocation(holdings), [holdings]);
  const hijri = useMemo(() => getDetailedHijriDate(), []);

  const activeGoals = goals.filter((g) => g.status === "active");
  const goalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const goalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);
  const goalPct = goalTarget > 0 ? Math.min(100, (goalSaved / goalTarget) * 100) : 0;

  const initials = profile.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#065F46] via-[#0A7A55] to-[#0F9D6E] p-6 text-white shadow-lg shadow-emerald-900/20 sm:p-8"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-white/15 font-display text-xl font-extrabold ring-1 ring-white/25">
              {initials}
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
                Barakah Account · Tier: Growth
              </p>
              <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                {profile.name}
              </h1>
              <p className="mt-0.5 text-sm text-emerald-100/90">
                Assalamu alaikum, {profile.greetingName} · {BRAND_NAME}
              </p>
            </div>
          </div>
          <button
            onClick={onOpenHijri}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-left ring-1 ring-white/20 transition hover:bg-white/20 active:scale-[0.98]"
          >
            <MoonStars size={18} weight="fill" className="text-amber-300" />
            <div className="leading-tight">
              <p className="text-xs font-bold">{hijri.formatted}</p>
              <p className="text-[11px] text-emerald-100/90">{hijri.gregorian}</p>
            </div>
            <ArrowRight size={15} weight="bold" className="text-emerald-100/80" />
          </button>
        </div>
      </motion.section>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.08, ease: "easeOut" }}
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          icon={<Wallet size={18} weight="bold" />}
          label="Total Portfolio Value"
          value={formatNaira(total, true)}
          sub={`${holdings.length} active holdings`}
          tone="emerald"
        />
        <StatCard
          icon={<Bank size={18} weight="bold" />}
          label="Mudarabah Cash Buffer"
          value={formatNaira(cashBuffer, true)}
          sub="Liquid, profit-sharing pool"
          tone="teal"
        />
        <StatCard
          icon={<ChartLineUp size={18} weight="bold" />}
          label="Zakat-Qualifying Wealth"
          value={formatNaira(zakatValue, true)}
          sub="Subject to the nisab threshold"
          tone="amber"
        />
        <StatCard
          icon={<Drop size={18} weight="bold" />}
          label="Total Purified to Date"
          value={formatNaira(purifiedTotal, true)}
          sub="Non-permissible income cleansed"
          tone="slate"
        />
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Allocation */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.14, ease: "easeOut" }}
          className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2"
        >
          <div className="flex items-center gap-2">
            <Scales size={17} weight="bold" className="text-[#065F46]" />
            <h2 className="font-display text-base font-bold text-slate-900">
              Shariah-Screened Allocation
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Every category independently screened under AAOIFI Standard No. 21.
          </p>
          <div className="mt-5 space-y-4">
            {allocation.map((slice) => (
              <div key={slice.category}>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-slate-700">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    {slice.category}
                  </span>
                  <span className="font-bold tabular-nums text-slate-800">
                    {slice.percent.toFixed(1)}% · {formatNaira(slice.value, true)}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${slice.percent}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: slice.color }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-slate-400">
                  {CATEGORY_META[slice.category].tagline}
                </p>
              </div>
            ))}
            {allocation.length === 0 && (
              <p className="rounded-2xl bg-slate-50/60 py-8 text-center text-sm font-medium text-slate-500">
                No holdings yet
              </p>
            )}
          </div>
        </motion.section>

        {/* Goals + Governance */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
          className="space-y-6"
        >
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Target size={17} weight="bold" className="text-[#D97706]" />
              <h2 className="font-display text-base font-bold text-slate-900">
                Halal Goals Progress
              </h2>
            </div>
            <p className="mt-3 font-display text-2xl font-extrabold text-[#065F46]">
              {formatNaira(goalSaved, true)}
            </p>
            <p className="text-xs text-slate-500">
              of {formatNaira(goalTarget, true)} across {activeGoals.length} active goal
              {activeGoals.length === 1 ? "" : "s"}
            </p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${goalPct}%` }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#065F46] to-[#10B981]"
              />
            </div>
            <p className="mt-2 text-[11px] font-semibold text-slate-400">
              {goalPct.toFixed(1)}% funded
            </p>
          </section>

          <section className="rounded-3xl border border-amber-100 bg-gradient-to-br from-amber-50/80 to-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} weight="fill" className="text-[#D97706]" />
              <h2 className="font-display text-base font-bold text-slate-900">
                Shariah Compliance
              </h2>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Oversight</span>
                <span className="text-right font-semibold text-slate-800">
                  {SHARIAH_BOARD}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Standard</span>
                <span className="font-semibold text-slate-800">AAOIFI</span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Last review</span>
                <span className="font-semibold text-slate-800">March 2025</span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-slate-500">Status</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                  <SealCheck size={14} weight="fill" /> Compliant
                </span>
              </li>
            </ul>
            <button
              onClick={onOpenHijri}
              className="mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-100 active:scale-[0.98]"
            >
              View Hijri &amp; Lunar Hub
            </button>
          </section>
        </motion.div>
      </div>

      {/* Contracts */}
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.26, ease: "easeOut" }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Certificate size={17} weight="bold" className="text-[#065F46]" />
          <h2 className="font-display text-base font-bold text-slate-900">
            Contracts Governing Your Account
          </h2>
        </div>
        <p className="mt-1 text-xs text-slate-500">
          Your wealth is structured on partnership and agency - not interest-bearing debt.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {CONTRACTS.map((c) => (
            <div
              key={c.id}
              className="rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4"
            >
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-white text-[#065F46] ring-1 ring-emerald-100">
                  {c.icon}
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-slate-900">{c.name}</p>
                  <p className="text-[13px] text-emerald-700">{c.arabic}</p>
                </div>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate-600">{c.role}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <p className="flex items-center justify-center gap-1.5 pb-2 text-center text-xs text-slate-400">
        <Sparkle size={13} weight="fill" className="text-[#D97710]" />
        <UserCircle size={13} weight="bold" />
        Educational demo account - not a real financial profile.
      </p>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  tone: "emerald" | "teal" | "amber" | "slate";
}) {
  const tones: Record<string, string> = {
    emerald: "text-[#065F46] ring-emerald-100",
    teal: "text-teal-700 ring-teal-100",
    amber: "text-[#D97706] ring-amber-100",
    slate: "text-slate-700 ring-slate-200/80",
  };
  return (
    <div className={`rounded-2xl border bg-white p-5 shadow-sm ${tones[tone]}`}>
      <div className="flex items-center gap-2">
        <span className={`grid h-8 w-8 place-items-center rounded-xl ${tones[tone]}`}>
          {icon}
        </span>
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="mt-1 text-[11px] text-slate-400">{sub}</p>
    </div>
  );
}
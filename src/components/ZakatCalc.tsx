import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Coins,
  GearSix,
  HandCoins,
  Hourglass,
  MoonStars,
  Scales,
  SealCheck,
  ShieldCheck,
  Wallet,
} from "@phosphor-icons/react";
import {
  AAOIFI_LUNAR_PREMIUM_PCT,
  HAWL_STORAGE_KEY,
  LUNAR_YEAR_DAYS,
  hawlTargetHijri,
  nisabFor,
} from "../data/halalDashboardData";
import type { HawlCountdown, ZakatConfig } from "../types";

const DAY_MS = 86_400_000;
const ZAKAT_RATE = 0.025;

export function useHawlCountdown(): HawlCountdown {
  const [target] = useState<string>(() => {
    const stored = localStorage.getItem(HAWL_STORAGE_KEY);
    if (stored) return stored;
    const t = new Date(Date.now() + LUNAR_YEAR_DAYS * DAY_MS);
    localStorage.setItem(HAWL_STORAGE_KEY, t.toISOString());
    return t.toISOString();
  });
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  return useMemo(() => {
    const targetMs = new Date(target).getTime();
    const diff = Math.max(0, targetMs - now);
    return {
      days: Math.floor(diff / DAY_MS),
      hours: Math.floor((diff % DAY_MS) / 3_600_000),
      minutes: Math.floor((diff % 3_600_000) / 60_000),
      seconds: Math.floor((diff % 60_000) / 1000),
      targetDate: target,
      complete: diff <= 0,
    };
  }, [target, now]);
}

export function HawlCard({ hawl }: { hawl: HawlCountdown }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#065F46] via-[#064E3B] to-[#0F172A] p-6 text-white shadow-xl shadow-emerald-900/20"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            "radial-gradient(45% 70% at 95% 0%, rgba(217,119,6,0.45), transparent 60%)",
        }}
      />
      <div className="relative flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <Hourglass size={22} weight="bold" className="text-amber-300" />
          </span>
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-100/70">
              Hawl Countdown
            </p>
            <p className="mt-0.5 font-display text-lg font-bold">
              {hawl.complete
                ? "Lunar year complete — Zakat is due"
                : "Time to your next Zakat due date"}
            </p>
            <p className="mt-0.5 text-xs text-emerald-100/60">
              Target{" "}
              {new Date(hawl.targetDate).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              · <span dir="rtl" className="font-semibold text-amber-200">{hawlTargetHijri(hawl.targetDate)}</span>
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-emerald-100/50">
              AAOIFI: a lunar Hawl is 354 days — ~{AAOIFI_LUNAR_PREMIUM_PCT.toFixed(3)}% more frequent than a solar year, raising effective annual giving.
            </p>
          </div>
        </div>
        {!hawl.complete && (
          <div className="flex items-center gap-2">
            {[
              { v: hawl.days, l: "Days" },
              { v: hawl.hours, l: "Hrs" },
              { v: hawl.minutes, l: "Min" },
              { v: hawl.seconds, l: "Sec" },
            ].map((u) => (
              <div
                key={u.l}
                className="grid w-16 place-items-center rounded-2xl bg-white/10 py-2.5 ring-1 ring-white/15 backdrop-blur"
              >
                <span className="font-display text-2xl font-extrabold tabular-nums">
                  {String(u.v).padStart(2, "0")}
                </span>
                <span className="text-[10px] font-medium uppercase tracking-wider text-emerald-100/70">
                  {u.l}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function NisabSection({
  config,
  totalWealth,
  impureAmount,
  onOpenSettings,
  onPay,
}: {
  config: ZakatConfig;
  totalWealth: number;
  impureAmount: number;
  onOpenSettings: () => void;
  onPay: () => void;
}) {
  const nisab = nisabFor(config);
  const zakatableWealth = Math.max(0, totalWealth - impureAmount);
  const aboveNisab = zakatableWealth >= nisab;
  const due = aboveNisab ? zakatableWealth * ZAKAT_RATE : 0;
  const nisabProgress = Math.min(100, (zakatableWealth / nisab) * 100);

  const fmt = (n: number) =>
    "₦" + Math.round(n).toLocaleString("en-NG");

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: "easeOut" }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Zakatable Wealth
            </h2>
            <p className="text-xs text-slate-500">
              Total portfolio net of impurity ({fmt(impureAmount)})
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <SealCheck size={14} weight="fill" className="text-amber-500" />
            Halal assets only
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Stat
            label="Net Wealth"
            value={fmt(zakatableWealth)}
            icon={<Wallet size={17} weight="bold" />}
          />
          <Stat
            label="Nisab Threshold"
            value={fmt(nisab)}
            icon={<Scales size={17} weight="bold" />}
          />
          <Stat
            label="Zakat Rate"
            value="2.5%"
            icon={<Coins size={17} weight="bold" />}
          />
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-500">Nisab progress</span>
            <span className="font-bold tabular-nums text-emerald-700">
              {nisabProgress.toFixed(0)}%
            </span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${nisabProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-full rounded-full ${
                aboveNisab
                  ? "bg-gradient-to-r from-emerald-500 to-[#10B981]"
                  : "bg-gradient-to-r from-amber-400 to-amber-500"
              }`}
            />
          </div>
          <p
            className={`mt-2 text-xs font-medium ${
              aboveNisab ? "text-emerald-700" : "text-amber-600"
            }`}
          >
            {aboveNisab
              ? `Your wealth exceeds nisab — Zakat of ${fmt(due)} is due.`
              : "Wealth is below nisab — no Zakat due yet. Keep saving, barakah!"}
          </p>
        </div>

        <div className="mt-6 flex items-center gap-4 rounded-2xl bg-emerald-50/70 p-4">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white">
            <HandCoins size={20} weight="bold" />
          </span>
          <div className="flex-1">
            <p className="text-xs font-medium text-emerald-700/80">
              Estimated Zakat Due
            </p>
            <p className="font-display text-2xl font-extrabold tabular-nums text-[#065F46]">
              {fmt(due)}
            </p>
          </div>
          {due > 0 && (
            <button
              onClick={onPay}
              className="inline-flex items-center gap-1 rounded-xl bg-[#065F46] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition hover:bg-emerald-700 active:scale-95"
            >
              Pay Zakat <ArrowRight size={14} weight="bold" />
            </button>
          )}
        </div>
      </motion.section>

      <motion.aside
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl border border-amber-200/60 bg-gradient-to-br from-amber-50 to-orange-50 p-6"
      >
        <ShieldCheck size={26} weight="fill" className="text-amber-500" />
        <h3 className="mt-3 font-display text-sm font-bold text-slate-900">
          Shariah Note
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
          Zakat (2.5%) is obligatory on zakatable wealth held above the nisab
          for one lunar year. Rates for gold, silver, cash and trade goods may
          differ — consult your local imam or scholar for personal rulings.
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-xl bg-white/70 p-3 ring-1 ring-amber-200/70">
          <MoonStars size={16} className="text-amber-600" />
          <p className="text-[11px] font-medium text-slate-500">
            {new Date().toLocaleDateString("en-NG", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            · Nisab via {config.standard} standard
          </p>
        </div>
      </motion.aside>
    </>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
        <span className="text-emerald-600">{icon}</span>
        {label}
      </div>
      <p className="mt-1.5 font-display text-lg font-extrabold tabular-nums text-slate-900">
        {value}
      </p>
    </div>
  );
}
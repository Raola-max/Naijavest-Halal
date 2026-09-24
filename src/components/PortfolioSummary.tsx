import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowDownLeft,
  ArrowUpRight,
  SealCheck,
  TrendUp,
  Coins,
  X,
} from "@phosphor-icons/react";
import {
  formatNaira,
  formatSignedPct,
  getIslamicGreeting,
  getDetailedHijriDate,
} from "../data/halalDashboardData";
import type { UserProfile } from "../types";

interface Props {
  profile: UserProfile;
  total: number;
  dailyGain: number;
  netYieldPct: number;
  totalReturnPct: number;
  cashBuffer: number;
  onDeposit: (amount: number) => void;
  onWithdraw: (amount: number) => void;
  onOpenHijri: () => void;
}

export default function PortfolioSummary({
  profile,
  total,
  dailyGain,
  netYieldPct,
  totalReturnPct,
  cashBuffer,
  onDeposit,
  onWithdraw,
  onOpenHijri,
}: Props) {
  const [modal, setModal] = useState<null | "deposit" | "withdraw">(null);
  const [amount, setAmount] = useState("");

  const parsed = useMemo(() => {
    const n = Number(amount.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }, [amount]);

  const canWithdraw = parsed > 0 && parsed <= cashBuffer;
  const positive = dailyGain >= 0;
  const hijri = getDetailedHijriDate();

  function submit() {
    if (!modal) return;
    if (parsed <= 0) {
      toast.error("Enter a valid amount in Naira");
      return;
    }
    if (modal === "withdraw" && parsed > cashBuffer) {
      toast.error("Amount exceeds your Mudarabah cash buffer");
      return;
    }
    if (modal === "deposit") onDeposit(parsed);
    else onWithdraw(parsed);
    toast.success(
      modal === "deposit"
        ? `₦${parsed.toLocaleString()} deposited to Halal buffer`
        : `₦${parsed.toLocaleString()} withdrawal requested`,
      { description: "Balance updated instantly. Barakah!" }
    );
    setModal(null);
    setAmount("");
  }

  return (
    <section className="grid gap-5 lg:grid-cols-3">
      {/* Hero value card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#065F46] via-[#064E3B] to-[#0F172A] p-6 text-white shadow-2xl shadow-emerald-900/30 lg:col-span-2"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "radial-gradient(40% 60% at 90% 0%, rgba(217,119,6,0.5), transparent 60%)",
          }}
        />
        <div className="relative">
          <div className="flex items-center gap-2 text-sm text-emerald-100/80">
            <span className="font-medium">{getIslamicGreeting()},</span>
            <span className="font-semibold text-white">
              {profile.greetingName} 🌙
            </span>
          </div>
          <p className="mt-1 text-xs text-emerald-100/60">
            {hijri.formatted} · {hijri.gregorian}
          </p>
          <button
            onClick={onOpenHijri}
            title="Open Hijri & Lunar Hub"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-200 ring-1 ring-white/20 backdrop-blur transition hover:bg-white/20 active:scale-95"
          >
            <span>{hijri.seasonEmoji}</span>
            {hijri.seasonTag}
            {hijri.isSacredMonth && (
              <span className="ml-0.5 rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-bold text-amber-200">
                Sacred
              </span>
            )}
          </button>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-100/70">
                Total Portfolio Value
              </p>
              <p className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                {formatNaira(total)}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-400/15 px-3 py-1 text-xs font-semibold text-amber-200 ring-1 ring-amber-300/30">
                <SealCheck size={15} weight="fill" className="text-amber-300" />
                Certified Halal · Zero Riba
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setModal("deposit")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-[#0F172A] shadow-lg shadow-amber-900/20 transition active:scale-95 hover:bg-amber-400"
              >
                <ArrowDownLeft size={17} weight="bold" /> Deposit
              </button>
              <button
                onClick={() => setModal("withdraw")}
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-bold text-white ring-1 ring-white/25 backdrop-blur transition active:scale-95 hover:bg-white/20"
              >
                <ArrowUpRight size={17} weight="bold" /> Withdraw
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats stack */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
        <StatCard
          label="Daily Gain / Loss"
          value={formatNaira(Math.abs(dailyGain))}
          accent={positive ? "emerald" : "rose"}
          icon={<TrendUp size={18} weight="bold" />}
          sub={formatSignedPct(positive ? 1 : -1) + " today"}
        />
        <StatCard
          label="Total Return"
          value={formatSignedPct(totalReturnPct)}
          accent="emerald"
          icon={<ArrowUpRight size={18} weight="bold" />}
          sub="since inception"
        />
        <StatCard
          label="Net Halal Yield"
          value={formatSignedPct(netYieldPct)}
          accent="amber"
          icon={<Coins size={18} weight="bold" />}
          sub="annualised, purified"
        />
      </div>

      {/* Modal */}
      {modal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm"
          onClick={() => setModal(null)}
        >
          <motion.div
            initial={{ scale: 0.94, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold text-slate-900">
                {modal === "deposit" ? "Deposit Funds" : "Withdraw Funds"}
              </h3>
              <button
                onClick={() => setModal(null)}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <p className="mt-1 text-sm text-slate-500">
              {modal === "deposit"
                ? "Add to your Mudarabah cash buffer."
                : `Available buffer: ${formatNaira(cashBuffer)}`}
            </p>

            <div className="mt-5">
              <label className="text-xs font-semibold text-slate-500">
                Amount (₦)
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
                <span className="font-display text-lg font-bold text-slate-400">
                  ₦
                </span>
                <input
                  autoFocus
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="500,000"
                  className="w-full bg-transparent px-2 py-3 font-display text-lg font-bold text-slate-900 outline-none"
                />
              </div>
              <div className="mt-2 flex gap-2">
                {[100000, 500000, 1000000].map((q) => (
                  <button
                    key={q}
                    onClick={() => setAmount(String(q))}
                    className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
                  >
                    +{formatNaira(q, true)}
                  </button>
                ))}
              </div>
            </div>

            {modal === "withdraw" && amount && !canWithdraw && (
              <p className="mt-3 text-xs font-medium text-rose-600">
                Insufficient Mudarabah buffer for this withdrawal.
              </p>
            )}

            <button
              onClick={submit}
              disabled={modal === "withdraw" && !canWithdraw}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#065F46] to-[#10B981] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition active:scale-[0.98] hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {modal === "deposit" ? "Confirm Deposit" : "Confirm Withdrawal"}
            </button>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  accent: "emerald" | "rose" | "amber";
  icon: React.ReactNode;
}) {
  const tones: Record<string, string> = {
    emerald: "text-emerald-700 bg-emerald-50",
    rose: "text-rose-600 bg-rose-50",
    amber: "text-amber-700 bg-amber-50",
  };
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-slate-500">{label}</p>
        <span
          className={`grid h-7 w-7 place-items-center rounded-lg ${tones[accent]}`}
        >
          {icon}
        </span>
      </div>
      <p className="mt-2 font-display text-xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="text-[11px] text-slate-400">{sub}</p>
    </div>
  );
}
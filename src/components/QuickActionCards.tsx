import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Bank,
  Calculator,
  Check,
  Coins,
  Drop,
  Lightning,
  SealCheck,
  Scales,
  ShieldCheck,
  Target,
  Wallet,
  X,
} from "@phosphor-icons/react";
import {
  NISAB_VALUE,
  ZAKAT_RATE,
  formatNaira,
  purificationDue,
  totalValue,
  zakatQualifyingValue,
} from "../data/halalDashboardData";
import type { HoldingItem } from "../types";

interface Props {
  holdings: HoldingItem[];
  cashBuffer: number;
  onTransfer: (amount: number) => void;
  onPurge: (amount: number) => void;
  onOpenZakat: () => void;
  onOpenPurification: () => void;
  onOpenGoals: () => void;
}

type Panel = null | "zakat" | "purify" | "buffer";

export default function QuickActionCards({
  holdings,
  cashBuffer,
  onTransfer,
  onPurge,
  onOpenZakat,
  onOpenPurification,
  onOpenGoals,
}: Props) {
  const [panel, setPanel] = useState<Panel>(null);
  const total = totalValue(holdings);
  const qualifying = zakatQualifyingValue(holdings);
  const purify = purificationDue(holdings);

  return (
    <section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ActionCard
          onClick={onOpenZakat}
          icon={<Calculator size={20} weight="bold" />}
          title="Zakat Calculator"
          value={formatNaira(qualifying * ZAKAT_RATE, true)}
          sub="Open full calculator · 2.5% due"
          tone="emerald"
        />
        <ActionCard
          onClick={onOpenPurification}
          icon={<Drop size={20} weight="bold" />}
          title="Purification Tracker"
          value={formatNaira(purify, true)}
          sub="Non-permissible income to give"
          tone="amber"
        />
        <ActionCard
          onClick={() => setPanel("buffer")}
          icon={<Wallet size={20} weight="bold" />}
          title="Instant Cash Buffer"
          value={formatNaira(cashBuffer, true)}
          sub="Available instantly · Mudarabah pool"
          tone="teal"
        />
        <ActionCard
          onClick={onOpenGoals}
          icon={<Target size={20} weight="bold" />}
          title="Halal Goals"
          value="Plan"
          sub="Hajj · Umrah · Waqf · Nikah"
          tone="emerald"
        />
      </div>

      <AnimatePresence>
        {panel === "zakat" && (
          <Modal onClose={() => setPanel(null)} title="Zakat Calculator" icon={<Scales size={18} />}>
            <ZakatPanel qualifying={qualifying} total={total} />
          </Modal>
        )}
        {panel === "purify" && (
          <Modal onClose={() => setPanel(null)} title="Purification Tracker" icon={<Drop size={18} />}>
            <PurifyPanel holdings={holdings} onPurge={onPurge} />
          </Modal>
        )}
        {panel === "buffer" && (
          <Modal onClose={() => setPanel(null)} title="Instant Cash Buffer" icon={<Coins size={18} />}>
            <BufferPanel cashBuffer={cashBuffer} onTransfer={onTransfer} />
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}

function ActionCard({
  onClick,
  icon,
  title,
  value,
  sub,
  tone,
}: {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  value: string;
  sub: string;
  tone: "emerald" | "amber" | "teal";
}) {
  const tones: Record<string, string> = {
    emerald: "from-emerald-50 to-white text-[#065F46] ring-emerald-100",
    amber: "from-amber-50 to-white text-amber-700 ring-amber-100",
    teal: "from-teal-50 to-white text-teal-700 ring-teal-100",
  };
  return (
    <motion.button
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-2xl bg-gradient-to-br p-5 text-left shadow-sm ring-1 transition ${tones[tone]}`}
    >
      <div className="flex items-center justify-between">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/70 shadow-sm">
          {icon}
        </span>
        <span className="text-[11px] font-semibold uppercase tracking-wide opacity-60">
          Tool
        </span>
      </div>
      <p className="mt-4 text-sm font-semibold text-slate-700">{title}</p>
      <p className="font-display text-xl font-extrabold tracking-tight text-slate-900">
        {value}
      </p>
      <p className="text-[11px] text-slate-500">{sub}</p>
    </motion.button>
  );
}

function Modal({
  onClose,
  title,
  icon,
  children,
}: {
  onClose: () => void;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, y: 14 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.94, y: 14 }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-[#065F46]">
              {icon}
            </span>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </motion.div>
    </motion.div>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className={`tabular-nums ${strong ? "font-display text-base font-extrabold text-slate-900" : "text-sm font-semibold text-slate-700"}`}>
        {value}
      </span>
    </div>
  );
}

function ZakatPanel({ qualifying, total }: { qualifying: number; total: number }) {
  const nisab = NISAB_VALUE;
  const above = qualifying >= nisab;
  const due = above ? qualifying * ZAKAT_RATE : 0;
  return (
    <div>
      <div className="rounded-2xl bg-emerald-50/70 p-4 ring-1 ring-emerald-100">
        <p className="text-xs font-medium text-emerald-700">Qualifying wealth (cash · gold · trade equities)</p>
        <p className="font-display text-2xl font-extrabold text-[#065F46]">{formatNaira(qualifying)}</p>
        <p className="mt-1 text-[11px] text-emerald-700/70">of {formatNaira(total, true)} total portfolio</p>
      </div>
      <div className="mt-4">
        <Row label="Nisab threshold (87.48g gold)" value={formatNaira(nisab)} />
        <Row label="Above Nisab?" value={above ? "Yes - Zakat is due" : "No - not due"} />
        <Row label="Rate (Hawl complete)" value={`${(ZAKAT_RATE * 100).toFixed(1)}%`} />
        <Row label="Zakat amount due" value={formatNaira(due)} strong />
      </div>
      <button
        disabled={!above}
        onClick={() => toast.success(`Zakat of ${formatNaira(due)} scheduled for the poor`, { description: "Purifies 2.5% of your wealth." })}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#065F46] to-[#10B981] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition active:scale-[0.98] disabled:opacity-40"
      >
        Pay Zakat ({formatNaira(due)})
      </button>
    </div>
  );
}

function PurifyPanel({ holdings, onPurge }: { holdings: HoldingItem[]; onPurge: (n: number) => void }) {
  const items = useMemo(
    () =>
      holdings
        .filter((h) => h.impurityRatio > 0)
        .map((h) => ({
          id: h.id,
          name: h.name,
          category: h.category,
          income: h.marketValue * 0.06,
          impurityRatio: h.impurityRatio,
          impureAmount: h.marketValue * 0.06 * h.impurityRatio,
        }))
        .sort((a, b) => b.impureAmount - a.impureAmount),
    [holdings]
  );
  const totalPurge = items.reduce((s, i) => s + i.impureAmount, 0);
  return (
    <div>
      <p className="text-sm text-slate-500">
        Estimated non-compliant incidental yield from mixed holdings. Donate this to purify your wealth.
      </p>
      <div className="mt-3 max-h-56 space-y-2 overflow-y-auto pr-1">
        {items.map((i) => (
          <div key={i.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 px-3 py-2.5">
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-800">{i.name}</p>
              <p className="text-[11px] text-slate-400">{i.category} · {(i.impurityRatio * 100).toFixed(1)}% impure</p>
            </div>
            <span className="font-bold tabular-nums text-amber-700">{formatNaira(i.impureAmount)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between rounded-2xl bg-amber-50 px-4 py-3 ring-1 ring-amber-100">
        <span className="text-sm font-semibold text-amber-800">Total to purify</span>
        <span className="font-display text-lg font-extrabold text-amber-900">{formatNaira(totalPurge)}</span>
      </div>
      <button
        onClick={() => { onPurge(totalPurge); toast.success(`Purification of ${formatNaira(totalPurge)} logged`, { description: "Given in charity to keep wealth halal." }); }}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition active:scale-[0.98]"
      >
        <Check size={16} weight="bold" /> Purify & Log Donation
      </button>
    </div>
  );
}

const PRESETS = [5_000, 25_000, 100_000] as const;
const LINKED_ACCOUNT = "Linked Halal Bank Account •••• 4092";

function BufferPanel({ cashBuffer, onTransfer }: { cashBuffer: number; onTransfer: (n: number) => void }) {
  const [amount, setAmount] = useState(() => Math.min(50_000, cashBuffer));
  const max = Math.max(0, cashBuffer);
  const clamped = Math.min(Math.max(amount, 0), max);

  function confirmTransfer() {
    if (clamped <= 0) {
      toast.error("Enter an amount to move to your bank");
      return;
    }
    onTransfer(clamped);
    toast.success("Transferred instantly. No riba involved.", {
      description: `${formatNaira(clamped)} sent to your linked bank account via Mudarabah liquidity.`,
    });
  }

  return (
    <div>
      {/* Shariah callout banner */}
      <div className="flex gap-3 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50/60 p-4 ring-1 ring-teal-100">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/80 text-teal-700 shadow-sm">
          <ShieldCheck size={18} weight="bold" />
        </span>
        <p className="text-[13px] leading-relaxed text-teal-900/90">
          Your cash buffer is held in a Mudarabah structure - a Shariah-compliant
          profit-sharing arrangement. You earn a share of profit through a Mudarabah contract.
        </p>
      </div>

      {/* Availability badge */}
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-white px-4 py-3 ring-1 ring-slate-200/80">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        <p className="text-sm font-semibold text-slate-700">
          {formatNaira(cashBuffer)} <span className="font-medium text-emerald-700">available instantly</span>
        </p>
      </div>

      {/* Amount controls */}
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-400">Amount to move</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p}
            onClick={() => setAmount(p)}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-[0.97] ${
              clamped === p
                ? "bg-[#0F766E] text-white shadow-sm"
                : "bg-teal-50 text-teal-800 ring-1 ring-teal-100 hover:bg-teal-100/70"
            }`}
          >
            {formatNaira(p, true)}
          </button>
        ))}
        <button
          onClick={() => setAmount(max)}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition active:scale-[0.97] ${
            clamped === max && max > 0
              ? "bg-[#0F766E] text-white shadow-sm"
              : "bg-teal-50 text-teal-800 ring-1 ring-teal-100 hover:bg-teal-100/70"
          }`}
        >
          Full Balance
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-teal-300 focus-within:ring-2 focus-within:ring-teal-100">
        <span className="text-sm font-bold text-slate-400">₦</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          max={max}
          value={amount === 0 ? "" : amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          placeholder="Enter amount"
          className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-300"
        />
        <span className="text-[11px] text-slate-400">of {formatNaira(max, true)}</span>
      </div>

      {/* Destination bank */}
      <div className="mt-3 flex items-center gap-2.5 rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-slate-200/80">
        <Bank size={16} className="text-teal-700" />
        <p className="text-xs font-medium text-slate-600">{LINKED_ACCOUNT}</p>
        <span className="ml-auto rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
          Instant
        </span>
      </div>

      {/* Primary CTA */}
      <button
        disabled={clamped <= 0}
        onClick={confirmTransfer}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#14B8A6] py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition active:scale-[0.98] disabled:opacity-40"
      >
        <Lightning size={16} weight="fill" /> Move to Bank
      </button>

      {/* Shariah certification footer */}
      <div className="mt-4 flex items-center justify-center gap-1.5">
        <SealCheck size={15} weight="fill" className="text-[#065F46]" />
        <p className="text-[11px] font-semibold tracking-wide text-[#065F46]">
          Powered by Mudarabah. Certified Halal.
        </p>
      </div>
    </div>
  );
}
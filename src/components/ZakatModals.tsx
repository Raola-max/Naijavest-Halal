import { motion } from "framer-motion";
import { Check, Copy, PencilSimple, ShieldCheck, X } from "@phosphor-icons/react";
import { SILVER_NISAB_VALUE, formatNaira } from "../data/halalDashboardData";
import type { VerifiedCharity, ZakatConfig } from "../types";

export function PaidState({ name, onDone }: { name: string; onDone: () => void }) {
  return (
    <div className="py-4 text-center">
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600"
      >
        <Check size={30} weight="bold" />
      </motion.span>
      <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
        Zakat Confirmed
      </h3>
      <p className="mt-1 text-sm text-slate-500">
        Your donation to{" "}
        <span className="font-semibold text-slate-700">{name}</span> is being
        processed.
      </p>
      <button
        onClick={onDone}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#065F46] to-[#10B981] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  );
}

export function PayForm({
  selected,
  due,
  payAmount,
  setPayAmount,
  copied,
  onCopy,
  onConfirm,
  onClose,
}: {
  selected: VerifiedCharity;
  due: number;
  payAmount: string;
  setPayAmount: (v: string) => void;
  copied: boolean;
  onCopy: () => void;
  onConfirm: () => void;
  onClose: () => void;
}) {
  const quick = due > 0 ? [due, Math.round(due / 2)] : [10000, 50000, 100000];
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-slate-900">
          Pay Zakat
        </h3>
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>
      <p className="mt-1 text-sm text-slate-500">{selected.name}</p>

      {due > 0 && (
        <div className="mt-4 rounded-2xl bg-emerald-50/70 p-3.5">
          <p className="text-[11px] font-medium text-emerald-700/80">
            Recommended (your calculated Zakat)
          </p>
          <p className="font-display text-xl font-extrabold tabular-nums text-[#065F46]">
            {formatNaira(due)}
          </p>
        </div>
      )}

      <div className="mt-4">
        <label className="text-xs font-semibold text-slate-500">
          Amount (₦)
        </label>
        <div className="mt-1.5 flex items-center rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
          <span className="font-display text-lg font-bold text-slate-400">₦</span>
          <input
            autoFocus
            inputMode="numeric"
            value={payAmount}
            onChange={(e) => setPayAmount(e.target.value)}
            placeholder="250,000"
            className="w-full bg-transparent px-2 py-3 font-display text-lg font-bold text-slate-900 outline-none"
          />
        </div>
        <div className="mt-2 flex gap-2">
          {quick.map((q) => (
            <button
              key={q}
              onClick={() => setPayAmount(String(q))}
              className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100"
            >
              {formatNaira(q, true)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Transfer to
        </p>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-slate-800">
              {selected.accountName}
            </p>
            <p className="text-xs text-slate-500">
              {selected.accountNumber} · {selected.bank}
            </p>
          </div>
          <button
            onClick={onCopy}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 transition hover:border-emerald-300 active:scale-95"
          >
            {copied ? (
              <Check size={13} className="text-emerald-600" />
            ) : (
              <Copy size={13} />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck size={13} className="text-emerald-600" />
          IBAN/recta transfer — no card fees, fully Shariah-compliant.
        </p>
      </div>

      <button
        onClick={onConfirm}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#065F46] to-[#10B981] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition active:scale-[0.98] hover:brightness-105"
      >
        Confirm Zakat Payment
      </button>
    </>
  );
}

export function SettingsForm({
  config,
  onChange,
  onSave,
  onClose,
}: {
  config: ZakatConfig;
  onChange: (c: ZakatConfig) => void;
  onSave: () => void;
  onClose: () => void;
}) {
  const fmt = (n: number) => "₦" + Math.round(n).toLocaleString("en-NG");
  return (
    <>
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-slate-900">
          Nisab Settings
        </h3>
        <button
          onClick={onClose}
          className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
        >
          <X size={18} />
        </button>
      </div>
      <p className="mt-1 text-sm text-slate-500">
        Choose the standard used to compute your nisab threshold.
      </p>

      <div className="mt-4 space-y-2">
        {[
          {
            id: "gold" as const,
            label: "Gold (87.48g)",
            sub: fmt(config.goldPricePerGram * 87.48),
          },
          { id: "silver" as const, label: "Silver (612.36g)", sub: fmt(SILVER_NISAB_VALUE) },
          { id: "custom" as const, label: "Custom", sub: fmt(config.customNisab) },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => onChange({ ...config, standard: opt.id })}
            className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
              config.standard === opt.id
                ? "border-emerald-400 bg-emerald-50/60 ring-2 ring-emerald-100"
                : "border-slate-200 bg-white hover:border-emerald-200"
            }`}
          >
            <div>
              <p className="text-sm font-bold text-slate-800">{opt.label}</p>
              <p className="text-xs text-slate-400">Nisab ≈ {opt.sub}</p>
            </div>
            <span
              className={`grid h-5 w-5 place-items-center rounded-full border ${
                config.standard === opt.id
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-slate-300"
              }`}
            >
              {config.standard === opt.id && <Check size={12} weight="bold" />}
            </span>
          </button>
        ))}
      </div>

      {config.standard === "custom" && (
        <div className="mt-3">
          <label className="text-xs font-semibold text-slate-500">
            Custom Nisab (₦)
          </label>
          <input
            inputMode="numeric"
            value={config.customNisab}
            onChange={(e) => {
              const n = Number(e.target.value.replace(/[^0-9.]/g, ""));
              onChange({
                ...config,
                customNisab: Number.isFinite(n) ? n : config.customNisab,
              });
            }}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-display text-sm font-bold text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          />
        </div>
      )}

      {config.standard === "gold" && (
        <div className="mt-3">
          <label className="text-xs font-semibold text-slate-500">
            Gold price per gram (₦)
          </label>
          <div className="mt-1 flex items-center gap-2">
            <input
              inputMode="numeric"
              value={config.goldPricePerGram}
              onChange={(e) => {
                const n = Number(e.target.value.replace(/[^0-9.]/g, ""));
                onChange({
                  ...config,
                  goldPricePerGram:
                    Number.isFinite(n) && n > 0 ? n : config.goldPricePerGram,
                });
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-display text-sm font-bold text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            />
            <PencilSimple size={16} className="shrink-0 text-slate-400" />
          </div>
          <p className="mt-1.5 text-[11px] text-slate-400">
            Live demo price · update to current NGN gold spot.
          </p>
        </div>
      )}

      <button
        onClick={onSave}
        className="mt-5 w-full rounded-xl bg-gradient-to-r from-[#065F46] to-[#10B981] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition active:scale-[0.98]"
      >
        Save Settings
      </button>
    </>
  );
}
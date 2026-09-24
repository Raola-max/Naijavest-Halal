import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  Check,
  CheckCircle,
  Copy,
  DownloadSimple,
  HandHeart,
  SealCheck,
  X,
} from "@phosphor-icons/react";
import { SADAQAH_CHANNELS, SHARIAH_BOARD, formatNaira } from "../data/halalDashboardData";
import type { PurificationRecord, SadaqahOption } from "../types";

interface DrawerProps {
  open: boolean;
  totalDue: number;
  onClose: () => void;
  onConfirm: (amount: number, org: SadaqahOption, note: string) => void;
}

/** Right-hand purification drawer: amount → sadaqah org → payment → receipt. */
export function PurifyDrawer({ open, totalDue, onClose, onConfirm }: DrawerProps) {
  const [selected, setSelected] = useState<SadaqahOption>(SADAQAH_CHANNELS[0]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<"bank" | "card">("bank");
  const [done, setDone] = useState(false);
  const [last, setLast] = useState<{ amount: number; org: SadaqahOption; ref: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const parsed = Number(amount.replace(/[^0-9.]/g, ""));
  const valid = Number.isFinite(parsed) && parsed > 0;

  function confirm() {
    if (!valid) {
      toast.error("Enter a valid amount in Naira");
      return;
    }
    const ref = `PUR-${Date.now().toString(36).toUpperCase()}`;
    setLast({ amount: parsed, org: selected, ref });
    setDone(true);
    toast.message(`Payment of ${formatNaira(parsed)} simulated`, {
      description: "Receipt generated below. Amount is now marked as purified.",
    });
  }

  function finish() {
    if (!last) return;
    onConfirm(
      last.amount,
      last.org,
      `Sadaqah via ${method === "bank" ? "bank transfer" : "debit card"}`
    );
    setAmount("");
    setDone(false);
    setLast(null);
  }

  function copyAccount() {
    navigator.clipboard
      ?.writeText(`${selected.accountName} | ${selected.accountNumber} | ${selected.bank}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => toast.error("Could not copy account details"));
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            className="h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 font-display text-lg font-bold text-slate-900">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-amber-50 text-[#D97706]">
                  <HandHeart size={19} weight="bold" />
                </span>
                Purify via Sadaqah
              </h3>
              <button
                onClick={onClose}
                className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            {done && last ? (
              <ReceiptState amount={last.amount} org={last.org} refCode={last.ref} onFinish={finish} />
            ) : (
              <div className="mt-5 space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Amount to cleanse
                  </p>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 focus-within:border-amber-300 focus-within:ring-2 focus-within:ring-amber-100">
                    <span className="text-sm font-bold text-slate-400">₦</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-300"
                    />
                    <button
                      onClick={() => setAmount(String(Math.round(totalDue)))}
                      className="shrink-0 rounded-lg bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-800 transition hover:bg-amber-200 active:scale-95"
                    >
                      Purify All ({formatNaira(totalDue, true)})
                    </button>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Sadaqah organization
                  </p>
                  <div className="mt-2 space-y-2">
                    {SADAQAH_CHANNELS.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => setSelected(org)}
                        className={`w-full rounded-2xl border p-3.5 text-left transition active:scale-[0.99] ${
                          selected.id === org.id
                            ? "border-[#D97706] bg-amber-50/60 ring-1 ring-amber-200"
                            : "border-slate-200 bg-white hover:border-amber-200"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-sm font-bold text-slate-800">{org.name}</p>
                            <p className="text-[11px] text-slate-400">
                              {org.focus} · {org.location}
                            </p>
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 ring-1 ring-emerald-100">
                            <SealCheck size={11} weight="fill" /> Verified
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{org.blurb}</p>
                        {selected.id === org.id && (
                          <div className="mt-2.5 flex items-center justify-between rounded-xl bg-white px-3 py-2 ring-1 ring-slate-200/80">
                            <div className="text-[11px]">
                              <p className="font-semibold text-slate-600">{org.accountName}</p>
                              <p className="font-bold tracking-wide text-slate-800">
                                {org.accountNumber} · {org.bank}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                copyAccount();
                              }}
                              className={`grid h-8 w-8 place-items-center rounded-lg transition active:scale-95 ${
                                copied
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                              aria-label="Copy account details"
                            >
                              {copied ? <Check size={15} weight="bold" /> : <Copy size={15} />}
                            </button>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Payment method
                  </p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <MethodButton
                      active={method === "bank"}
                      label="Bank Transfer"
                      sub="Instant · Jaiz/Taj"
                      onClick={() => setMethod("bank")}
                    />
                    <MethodButton
                      active={method === "card"}
                      label="Debit Card"
                      sub="Secured · 3-D Secure"
                      onClick={() => setMethod("card")}
                    />
                  </div>
                </div>

                <button
                  disabled={!valid}
                  onClick={confirm}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#D97706] to-amber-500 py-3 text-sm font-bold text-white shadow-lg shadow-amber-900/20 transition hover:brightness-105 active:scale-[0.98] disabled:opacity-40"
                >
                  <Check size={16} weight="bold" /> Pay {valid ? formatNaira(parsed) : ""}
                </button>
                <p className="text-center text-[11px] text-slate-400">
                  Payments are simulated for this demo. Your receipt is saved locally.
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function MethodButton({
  active,
  label,
  sub,
  onClick,
}: {
  active: boolean;
  label: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-3 text-left transition active:scale-[0.98] ${
        active
          ? "border-[#065F46] bg-emerald-50/60 ring-1 ring-emerald-200"
          : "border-slate-200 bg-white hover:border-emerald-200"
      }`}
    >
      <p className={`text-sm font-bold ${active ? "text-[#065F46]" : "text-slate-700"}`}>{label}</p>
      <p className="text-[11px] text-slate-400">{sub}</p>
    </button>
  );
}

function ReceiptState({
  amount,
  org,
  refCode,
  onFinish,
}: {
  amount: number;
  org: SadaqahOption;
  refCode: string;
  onFinish: () => void;
}) {
  const [download, setDownload] = useState(false);

  function generateReceipt() {
    const lines = [
      "NAIJAVEST HALAL - PURIFICATION RECEIPT",
      "------------------------------------",
      `Reference: ${refCode}`,
      `Date: ${new Date().toLocaleString("en-NG")}`,
      `Organization: ${org.name} (${org.focus})`,
      `Account: ${org.accountName} | ${org.accountNumber} | ${org.bank}`,
      `Amount: ${formatNaira(amount)}`,
      `Disposal type: Sadaqah (public benefit)`,
      `Certified by: ${SHARIAH_BOARD}`,
    ].join(String.fromCharCode(10));
    const blob = new Blob([lines], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${refCode}-receipt.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setDownload(true);
    setTimeout(() => setDownload(false), 2000);
  }

  return (
    <div className="mt-6 text-center">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 ring-8 ring-emerald-50"
      >
        <CheckCircle size={34} weight="fill" className="text-[#065F46]" />
      </motion.div>
      <h4 className="mt-4 font-display text-xl font-extrabold text-slate-900">
        Purification Complete
      </h4>
      <p className="mt-1 text-sm text-slate-500">
        {formatNaira(amount)} cleansed via {org.name}
      </p>
      <div className="mt-5 space-y-2.5 rounded-2xl bg-slate-50/70 p-4 text-left ring-1 ring-slate-100">
        <ReceiptCell label="Reference" value={refCode} />
        <ReceiptCell label="Organization" value={org.name} />
        <ReceiptCell label="Focus" value={org.focus} />
        <ReceiptCell label="Amount" value={formatNaira(amount)} strong />
        <ReceiptCell label="Date" value={new Date().toLocaleString("en-NG")} />
      </div>
      <button
        onClick={generateReceipt}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-bold text-slate-700 transition hover:border-emerald-300 hover:text-[#065F46] active:scale-[0.98]"
      >
        <DownloadSimple size={16} weight="bold" />
        {download ? "Receipt downloaded" : "Download receipt"}
      </button>
      <button
        onClick={onFinish}
        className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#065F46] to-[#10B981] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:brightness-105 active:scale-[0.98]"
      >
        <Check size={16} weight="bold" /> Mark as Purified
      </button>
    </div>
  );
}

function ReceiptCell({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span
        className={`text-right text-sm ${
          strong ? "font-display font-extrabold text-[#065F46]" : "font-semibold text-slate-700"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export type { PurificationRecord };
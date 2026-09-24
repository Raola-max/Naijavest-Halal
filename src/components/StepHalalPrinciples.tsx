import { useState } from "react";
import { motion } from "framer-motion";
import { Scales, Prohibit, Wallet, HandCoins, ArrowRight, ArrowLeft, SealCheck } from "@phosphor-icons/react";
import { HALAL_PILLARS, HALAL_STATEMENT } from "../data/halalData";

const ICONS = [Scales, Prohibit, Wallet, HandCoins];

interface Props {
  onNext: () => void;
  onBack: () => void;
}

export default function StepHalalPrinciples({ onNext, onBack }: Props) {
  const [open, setOpen] = useState<string | null>(HALAL_PILLARS[0].id);
  const [acknowledged, setAcknowledged] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#D97706]">Step 2 of 3</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
          The NaijaVest Halal philosophy
        </h1>
        <blockquote className="mt-4 rounded-2xl border border-emerald-700/20 bg-gradient-to-br from-[#04442F] to-[#065F46] p-5 text-[15px] font-medium leading-relaxed text-emerald-50 shadow-lg sm:text-base">
          <SealCheck size={20} weight="fill" className="mb-2 text-[#34D399]" />
          {HALAL_STATEMENT}
        </blockquote>
      </motion.div>

      <div className="mt-6 space-y-3">
        {HALAL_PILLARS.map((pillar, i) => {
          const Icon = ICONS[i] ?? Scales;
          const expanded = open === pillar.id;
          return (
            <motion.div
              key={pillar.id}
              layout
              className={
                "overflow-hidden rounded-2xl border bg-white transition-colors " +
                (expanded ? "border-[#065F46] shadow-md" : "border-slate-200")
              }
            >
              <button
                onClick={() => setOpen(expanded ? null : pillar.id)}
                className="flex w-full items-center gap-4 p-4 text-left"
              >
                <span
                  className={
                    "grid size-11 shrink-0 place-items-center rounded-xl transition-colors " +
                    (expanded ? "bg-[#065F46] text-white" : "bg-emerald-50 text-[#065F46]")
                  }
                >
                  <Icon size={22} weight="fill" />
                </span>
                <span className="flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-display text-[15px] font-bold text-[#0F172A]">{pillar.title}</span>
                    <span dir="rtl" className="text-sm text-[#D97706]">{pillar.arabic}</span>
                  </span>
                  <span className="mt-0.5 block text-sm text-slate-500">{pillar.description}</span>
                </span>
                <span className={"text-lg text-slate-400 transition-transform " + (expanded ? "rotate-90" : "")}>
                  {expanded ? "−" : "+"}
                </span>
              </button>
              <motion.div
                initial={false}
                animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <p className="px-4 pb-4 pl-[76px] text-sm leading-relaxed text-slate-600">{pillar.detail}</p>
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      <button
        onClick={() => setAcknowledged((v) => !v)}
        className="mt-6 flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-emerald-300"
      >
        <span
          className={
            "grid size-6 shrink-0 place-items-center rounded-md border-2 transition-colors " +
            (acknowledged ? "border-[#065F46] bg-[#065F46] text-white" : "border-slate-300")
          }
        >
          {acknowledged && "✓"}
        </span>
        <span className="text-sm font-medium text-[#0F172A]">
          I understand and accept the Shariah screening methodology.
        </span>
      </button>

      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.99]"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!acknowledged}
          className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#04442F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Continue <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}

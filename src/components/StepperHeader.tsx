import { motion } from "framer-motion";
import { ShieldCheck, ArrowsClockwise } from "@phosphor-icons/react";

const STEPS = [
  { id: 1, label: "Identity" },
  { id: 2, label: "Halal Principles" },
  { id: 3, label: "Risk Profiling" },
  { id: 4, label: "Portfolio" },
];

interface Props {
  currentStep: number;
  onReset: () => void;
}

export default function StepperHeader({ currentStep, onReset }: Props) {
  return (
    <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-[#F8FAFC]/85 backdrop-blur-xl">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-[#04442F] to-[#065F46] text-[#34D399] shadow-sm">
              <ShieldCheck size={20} weight="fill" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-[15px] font-bold tracking-tight text-[#0F172A]">
                NaijaVest <span className="text-[#065F46]">Halal</span>
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[#D97706]">
                Shariah-Screened
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-emerald-700/20 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-[#065F46] sm:inline-flex">
              <ShieldCheck size={13} weight="fill" />
              100% Shariah-Screened by Advisory Board
            </span>
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 hover:text-[#065F46] active:scale-[0.98]"
            >
              <ArrowsClockwise size={14} />
              <span className="hidden sm:inline">Restart</span>
            </button>
          </div>
        </div>
        <nav className="pb-3">
          <ol className="flex items-center gap-1 sm:gap-2">
            {STEPS.map((step, i) => {
              const done = currentStep > step.id;
              const active = currentStep === step.id;
              return (
                <li key={step.id} className="flex flex-1 items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        "grid size-6 shrink-0 place-items-center rounded-full text-[11px] font-bold transition-colors " +
                        (done
                          ? "bg-[#065F46] text-white"
                          : active
                            ? "bg-[#D97706] text-white"
                            : "bg-slate-200 text-slate-500")
                      }
                    >
                      {done ? "✓" : step.id}
                    </span>
                    <span
                      className={
                        "hidden text-xs font-semibold sm:inline " +
                        (active ? "text-[#0F172A]" : done ? "text-[#065F46]" : "text-slate-400")
                      }
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="relative h-0.5 flex-1 overflow-hidden rounded-full bg-slate-200">
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-[#065F46]"
                        initial={false}
                        animate={{ width: done ? "100%" : "0%" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                      />
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </header>
  );
}

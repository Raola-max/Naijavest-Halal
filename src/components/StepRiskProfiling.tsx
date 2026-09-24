import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, TrendDown, Coins, Calendar } from "@phosphor-icons/react";
import { toast } from "sonner";
import { SCENARIOS } from "../data/halalData";

const ICONS = [TrendDown, Coins, Calendar];

interface Props {
  answers: Record<string, string>;
  setAnswer: (scenarioId: string, optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function StepRiskProfiling({ answers, setAnswer, onNext, onBack }: Props) {
  const answered = SCENARIOS.filter((s) => answers[s.id]).length;
  const complete = answered === SCENARIOS.length;

  const submit = () => {
    if (!complete) {
      toast.error("Please answer all three scenarios to reveal your profile.");
      return;
    }
    onNext();
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#D97706]">Step 3 of 3</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
          Real-world risk scenarios
        </h1>
        <p className="mt-2 max-w-[60ch] leading-relaxed text-slate-600">
          No boring surveys. Choose how you would truly react in three high-stakes moments.
        </p>
      </motion.div>

      <div className="mt-8 space-y-6">
        {SCENARIOS.map((scenario, si) => {
          const Icon = ICONS[si] ?? Coins;
          const selected = answers[scenario.id];
          return (
            <motion.section
              key={scenario.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: si * 0.05 }}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-[#065F46]">
                  <Icon size={20} weight="fill" />
                </span>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#D97706]">{scenario.title}</p>
                  <p className="mt-0.5 font-medium leading-snug text-[#0F172A]">{scenario.prompt}</p>
                </div>
              </div>
              <div className="mt-4 grid gap-2.5">
                {scenario.options.map((opt) => {
                  const isSel = selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setAnswer(scenario.id, opt.id)}
                      className={
                        "flex items-center gap-3 rounded-xl border p-3.5 text-left transition active:scale-[0.995] " +
                        (isSel
                          ? "border-[#065F46] bg-emerald-50 ring-1 ring-[#065F46]"
                          : "border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/40")
                      }
                    >
                      <span
                        className={
                          "grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors " +
                          (isSel ? "bg-[#065F46] text-white" : "bg-slate-100 text-slate-500")
                        }
                      >
                        {opt.label.charAt(0)}
                      </span>
                      <span className="flex-1">
                        <span className="block text-sm font-semibold text-[#0F172A]">{opt.label}</span>
                        <span className="block text-xs text-slate-500">{opt.description}</span>
                      </span>
                      {isSel && <span className="text-[#065F46]">✓</span>}
                    </button>
                  );
                })}
              </div>
            </motion.section>
          );
        })}
      </div>

      <p className="mt-5 text-center text-xs font-medium text-slate-500">
        {answered} of {SCENARIOS.length} scenarios answered
      </p>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.99]"
        >
          <ArrowLeft size={18} /> Back
        </button>
        <button
          onClick={submit}
          disabled={!complete}
          className="inline-flex items-center gap-2 rounded-xl bg-[#065F46] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#04442F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reveal My Portfolio <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}

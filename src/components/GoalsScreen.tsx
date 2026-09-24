import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  CalendarCheck,
  Check,
  Coins,
  FlagBanner,
  HandCoins,
  Heart,
  Moon,
  PencilSimple,
  Plus,
  SealCheck,
  Target,
  TrendUp,
  Users,
  Wallet,
  X,
} from "@phosphor-icons/react";
import {
  EXPECTED_ANNUAL_RETURN,
  ISLAMIC_GOALS_META,
  calculateMonthlyContribution,
  formatNaira,
  projectGoalGrowth,
} from "../data/halalDashboardData";
import type { HalalGoal, IslamicGoalType } from "../types";

interface Props {
  goals: HalalGoal[];
  cashBuffer: number;
  onSaveGoal: (goal: HalalGoal) => void;
  onDeleteGoal: (id: string) => void;
  onFundGoal: (goalId: string, amount: number) => void;
}

const GOAL_ICONS: Record<IslamicGoalType, React.ReactNode> = {
  "Hajj Savings": <Moon size={20} weight="bold" />,
  "Umrah Fund": <Moon size={20} weight="duotone" />,
  "Waqf (Endowment)": <Users size={20} weight="bold" />,
  "Sadaqah Jariyah": <HandCoins size={20} weight="bold" />,
  "Islamic Education": <FlagBanner size={20} weight="bold" />,
  "Nikah (Marriage) Fund": <Heart size={20} weight="fill" />,
};

type Modal = null | { mode: "create"; goalType: IslamicGoalType } | { mode: "edit"; goal: HalalGoal } | { mode: "fund"; goal: HalalGoal };

export default function GoalsScreen({ goals, cashBuffer, onSaveGoal, onDeleteGoal, onFundGoal }: Props) {
  const [modal, setModal] = useState<Modal>(null);

  const totalAllocated = goals.reduce((s, g) => s + g.monthlyContribution, 0);
  const totalProgress = goals.reduce((s, g) => s + g.currentAmount, 0);
  const completedCount = goals.filter((g) => g.status === "completed").length;

  return (
    <section className="space-y-6">
      {/* Stats header */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={<Target size={18} />} label="Active Goals" value={`${goals.length}`} sub="Islamic wealth targets" />
        <StatCard icon={<TrendUp size={18} />} label="Monthly Allocated" value={formatNaira(totalAllocated, true)} sub="Auto-debit from portfolio" />
        <StatCard icon={<CalendarCheck size={18} />} label="Total Saved" value={formatNaira(totalProgress, true)} sub={`${completedCount} completed milestone${completedCount !== 1 ? "s" : ""}`} />
      </div>

      {/* Goal starter grid */}
      <div>
        <h2 className="font-display text-base font-bold text-slate-900">Start a New Goal</h2>
        <p className="mt-1 text-sm text-slate-500">Choose an Islamic financial intention to begin planning.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(ISLAMIC_GOALS_META) as IslamicGoalType[]).map((type) => {
            const meta = ISLAMIC_GOALS_META[type];
            return (
              <motion.button
                key={type}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setModal({ mode: "create", goalType: type })}
                className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition hover:border-emerald-200"
              >
                <div className="flex items-start justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl text-white shadow-sm" style={{ background: meta.color }}>
                    {GOAL_ICONS[type]}
                  </span>
                  <span className="text-lg font-bold text-slate-200 group-hover:text-emerald-200 transition">{meta.arabic}</span>
                </div>
                <p className="mt-3 text-sm font-bold text-slate-800">{type}</p>
                <p className="mt-0.5 text-xs text-slate-500 line-clamp-2">{meta.description}</p>
                <p className="mt-2 text-[11px] font-semibold text-slate-400">
                  Target: {formatNaira(meta.defaultTarget, true)} · {meta.defaultTimeline} months
                </p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active goals list */}
      {goals.length > 0 && (
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">Your Goals</h2>
          <div className="mt-3 space-y-3">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} onEdit={() => setModal({ mode: "edit", goal })} onFund={() => setModal({ mode: "fund", goal })} onDelete={() => onDeleteGoal(goal.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <AnimatePresence>
        {modal && (
          <ModalShell onClose={() => setModal(null)}>
            {modal.mode === "create" && (
              <GoalForm goalType={modal.goalType} existing={null} onSave={(g) => { onSaveGoal(g); setModal(null); toast.success(`Goal "${g.title}" created`, { description: "This goal is being funded through Shariah-compliant investments." }); }} />
            )}
            {modal.mode === "edit" && (
              <GoalForm goalType={modal.goal.type} existing={modal.goal} onSave={(g) => { onSaveGoal(g); setModal(null); toast.success("Goal updated"); }} />
            )}
            {modal.mode === "fund" && (
              <FundForm goal={modal.goal} cashBuffer={cashBuffer} onFund={(amt) => { onFundGoal(modal.goal.id, amt); setModal(null); toast.success(`${formatNaira(amt)} added to "${modal.goal.title}"`, { description: "Funded from your Mudarabah Cash Buffer." }); }} />
            )}
          </ModalShell>
        )}
      </AnimatePresence>
    </section>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub }: { icon: React.ReactNode; label: string; value: string; sub: string }) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-emerald-700">{icon}<span className="text-xs font-semibold uppercase tracking-wide">{label}</span></div>
      <p className="mt-2 font-display text-xl font-extrabold text-slate-900">{value}</p>
      <p className="text-[11px] text-slate-400">{sub}</p>
    </div>
  );
}

// ─── Goal Card ────────────────────────────────────────────────────────────────
function GoalCard({ goal, onEdit, onFund, onDelete }: { goal: HalalGoal; onEdit: () => void; onFund: () => void; onDelete: () => void }) {
  const meta = ISLAMIC_GOALS_META[goal.type];
  const pct = Math.min(100, (goal.currentAmount / goal.targetAmount) * 100);
  const projected = projectGoalGrowth(goal.currentAmount, goal.monthlyContribution, goal.timelineMonths, goal.expectedAnnualReturn);
  const projectedPct = Math.min(100, (projected / goal.targetAmount) * 100);

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl text-white" style={{ background: meta.color }}>{GOAL_ICONS[goal.type]}</span>
          <div>
            <p className="text-sm font-bold text-slate-900">{goal.title}</p>
            <p className="text-[11px] text-slate-400">{goal.type} · {goal.timelineMonths} months</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={onFund} className="grid h-8 w-8 place-items-center rounded-lg text-emerald-700 hover:bg-emerald-50" title="Add Funds"><Coins size={16} /></button>
          <button onClick={onEdit} className="grid h-8 w-8 place-items-center rounded-lg text-slate-500 hover:bg-slate-50" title="Edit"><PencilSimple size={15} /></button>
          <button onClick={onDelete} className="grid h-8 w-8 place-items-center rounded-lg text-rose-500 hover:bg-rose-50" title="Delete"><X size={15} /></button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] font-semibold">
          <span className="text-slate-500">{formatNaira(goal.currentAmount)} saved</span>
          <span className="text-slate-400">of {formatNaira(goal.targetAmount)}</span>
        </div>
        <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${meta.color}, #10B981)` }} />
        </div>
        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
          <span>{pct.toFixed(1)}% complete</span>
          <span>Projected: {projectedPct.toFixed(0)}% at {goal.expectedAnnualReturn}% p.a.</span>
        </div>
      </div>

      {/* Footer badges */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-800 ring-1 ring-emerald-100">
          <SealCheck size={12} weight="fill" /> Shariah-Compliant
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800 ring-1 ring-amber-100">
          <Wallet size={12} /> {formatNaira(goal.monthlyContribution, true)}/mo
        </span>
        {goal.status === "completed" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-bold text-emerald-900"><Check size={12} weight="bold" /> Completed</span>
        )}
      </div>

      {/* Shariah note */}
      <p className="mt-2 text-[10px] italic text-emerald-700/80">
        "This goal is being funded through Shariah-compliant investments."
      </p>
    </motion.div>
  );
}

// ─── Modal Shell ──────────────────────────────────────────────────────────────
function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.94, y: 14 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 14 }} transition={{ type: "spring", stiffness: 320, damping: 26 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-slate-900">Goal Planner</h3>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="mt-4">{children}</div>
      </motion.div>
    </motion.div>
  );
}

// ─── Goal Create/Edit Form ────────────────────────────────────────────────────
function GoalForm({ goalType, existing, onSave }: { goalType: IslamicGoalType; existing: HalalGoal | null; onSave: (g: HalalGoal) => void }) {
  const meta = ISLAMIC_GOALS_META[goalType];
  const [title, setTitle] = useState(existing?.title ?? goalType);
  const [target, setTarget] = useState(existing?.targetAmount ?? meta.defaultTarget);
  const [timeline, setTimeline] = useState(existing?.timelineMonths ?? meta.defaultTimeline);
  const [notes, setNotes] = useState(existing?.notes ?? "");
  const [returnRate, setReturnRate] = useState(existing?.expectedAnnualReturn ?? EXPECTED_ANNUAL_RETURN);

  const current = existing?.currentAmount ?? 0;
  const monthly = useMemo(() => calculateMonthlyContribution(target, current, timeline, returnRate), [target, current, timeline, returnRate]);
  const projected = useMemo(() => projectGoalGrowth(current, monthly, timeline, returnRate), [current, monthly, timeline, returnRate]);
  const cashOnly = current + monthly * timeline;

  function submit() {
    const goal: HalalGoal = {
      id: existing?.id ?? `goal-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      type: goalType,
      title,
      targetAmount: target,
      currentAmount: current,
      timelineMonths: timeline,
      expectedAnnualReturn: returnRate,
      monthlyContribution: monthly,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      notes,
      status: current >= target ? "completed" : "active",
    };
    onSave(goal);
  }

  return (
    <div className="space-y-4">
      {/* Niyyah quote */}
      <div className="rounded-xl bg-emerald-50/70 p-3 ring-1 ring-emerald-100">
        <p className="text-[11px] font-semibold text-emerald-800">Niyyah (Intention)</p>
        <p className="mt-0.5 text-xs italic text-emerald-900/80">{meta.niyyah}</p>
      </div>

      {/* Title */}
      <div>
        <label className="text-xs font-semibold text-slate-600">Goal Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100" />
      </div>

      {/* Target slider */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600">Target Amount</label>
          <span className="font-display text-sm font-bold text-slate-900">{formatNaira(target)}</span>
        </div>
        <input type="range" min={500_000} max={20_000_000} step={100_000} value={target} onChange={(e) => setTarget(Number(e.target.value))} className="mt-1 w-full accent-emerald-600" />
      </div>

      {/* Timeline slider */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600">Timeline</label>
          <span className="font-display text-sm font-bold text-slate-900">{timeline} months ({(timeline / 12).toFixed(1)} yrs)</span>
        </div>
        <input type="range" min={6} max={120} step={1} value={timeline} onChange={(e) => setTimeline(Number(e.target.value))} className="mt-1 w-full accent-emerald-600" />
      </div>

      {/* Return rate */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-600">Expected Annual Return</label>
          <span className="font-display text-sm font-bold text-emerald-700">{returnRate}% p.a.</span>
        </div>
        <input type="range" min={8} max={22} step={0.5} value={returnRate} onChange={(e) => setReturnRate(Number(e.target.value))} className="mt-1 w-full accent-emerald-600" />
      </div>

      {/* Calculation breakdown */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <p className="text-[10px] font-bold uppercase tracking-wide text-slate-400">Compounding Breakdown</p>
        <div className="mt-2 space-y-2 text-sm">
          <CalcRow label="Required Monthly" value={formatNaira(monthly)} highlight />
          <CalcRow label="Projected Value (Halal)" value={formatNaira(projected)} />
          <CalcRow label="Cash-Only Savings (0%)" value={formatNaira(cashOnly)} />
          <CalcRow label="Halal Advantage" value={`+${formatNaira(Math.max(0, projected - cashOnly))}`} positive />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="text-xs font-semibold text-slate-600">Notes (optional)</label>
        <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100" placeholder="Personal reminder or intention..." />
      </div>

      {/* Submit */}
      <button onClick={submit} className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#065F46] to-[#10B981] py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 transition active:scale-[0.98]">
        <Plus size={16} weight="bold" /> {existing ? "Update Goal" : "Create Goal"}
        <ArrowRight size={14} />
      </button>
    </div>
  );
}

function CalcRow({ label, value, highlight, positive }: { label: string; value: string; highlight?: boolean; positive?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-500">{label}</span>
      <span className={`tabular-nums font-semibold ${highlight ? "text-emerald-700 text-base font-display font-extrabold" : positive ? "text-emerald-600" : "text-slate-800"}`}>{value}</span>
    </div>
  );
}

// ─── Fund Goal Form ───────────────────────────────────────────────────────────
function FundForm({ goal, cashBuffer, onFund }: { goal: HalalGoal; cashBuffer: number; onFund: (amt: number) => void }) {
  const [amount, setAmount] = useState(Math.min(100_000, cashBuffer));
  const presets = [50_000, 100_000, 250_000, 500_000].filter((p) => p <= cashBuffer);

  return (
    <div className="space-y-4">
      <div className="rounded-xl bg-teal-50/70 p-3 ring-1 ring-teal-100">
        <p className="text-xs font-semibold text-teal-800">Fund from Cash Buffer (Mudarabah Pool)</p>
        <p className="mt-0.5 text-[11px] text-teal-700/80">Available: {formatNaira(cashBuffer)}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button key={p} onClick={() => setAmount(p)} className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${amount === p ? "bg-[#065F46] text-white" : "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100"}`}>
            {formatNaira(p, true)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5">
        <span className="text-sm font-bold text-slate-400">₦</span>
        <input type="number" value={amount === 0 ? "" : amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full bg-transparent text-sm font-semibold outline-none" min={0} max={cashBuffer} />
      </div>

      <button
        disabled={amount <= 0 || amount > cashBuffer}
        onClick={() => onFund(amount)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0F766E] to-[#14B8A6] py-3 text-sm font-bold text-white shadow-lg shadow-teal-900/20 transition active:scale-[0.98] disabled:opacity-40"
      >
        <Coins size={16} weight="bold" /> Add {formatNaira(amount, true)} to Goal
      </button>

      <p className="text-center text-[10px] italic text-emerald-700/70">
        "This goal is being funded through Shariah-compliant investments."
      </p>
    </div>
  );
}

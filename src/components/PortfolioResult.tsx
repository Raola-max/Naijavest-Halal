import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { SealCheck, ArrowRight, PencilSimple, Sparkle, TrendUp } from "@phosphor-icons/react";
import { formatNaira } from "../data/halalData";
import type { RiskProfileResult, IdentityData } from "../types";

interface Props {
  profile: RiskProfileResult;
  identity: IdentityData;
  onEdit: () => void;
  onRestart: () => void;
}

export default function PortfolioResult({ profile, identity, onEdit, onRestart }: Props) {
  const firstYear = identity.capital * (1 + profile.expectedReturn);
  const fiveYear = identity.capital * Math.pow(1 + profile.expectedReturn, 5);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className="relative overflow-hidden rounded-3xl border border-emerald-700/20 bg-gradient-to-br from-[#04442F] via-[#065F46] to-[#04442F] p-6 text-white shadow-2xl sm:p-8"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 size-48 rounded-full bg-[#34D399]/20 blur-3xl" />
        <div className="relative flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#34D399]">Your Halal Profile</p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">{profile.name}</h1>
            <p className="mt-2 max-w-[46ch] text-sm text-emerald-100/90">{profile.tagline}</p>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-[#D97706]/40 bg-[#D97706]/15 px-5 py-4">
            <SealCheck size={34} weight="fill" className="text-[#F59E0B]" />
            <div className="leading-tight">
              <p className="text-sm font-bold text-amber-200">Shariah-Compliant</p>
              <p className="text-[11px] text-amber-100/80">Certified by NaijaVest Advisory Board</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2"
        >
          <p className="text-sm font-semibold text-[#0F172A]">Asset Allocation</p>
          <div className="relative mx-auto mt-2 size-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={profile.allocations}
                  dataKey="percent"
                  nameKey="label"
                  innerRadius="62%"
                  outerRadius="100%"
                  paddingAngle={2}
                  cornerRadius={4}
                  stroke="none"
                  animationBegin={200}
                  animationDuration={900}
                >
                  {profile.allocations.map((a) => (
                    <Cell key={a.label} fill={a.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <p className="font-display text-2xl font-bold text-[#065F46]">{Math.round(profile.expectedReturn * 100)}%</p>
                <p className="text-[10px] uppercase tracking-wide text-slate-400">Est. Annual Profit Share</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="space-y-3 lg:col-span-3"
        >
          {profile.allocations.map((a, i) => (
            <div key={a.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: a.color }} />
                <p className="flex-1 text-sm font-semibold text-[#0F172A]">{a.label}</p>
                <p className="font-display text-sm font-bold text-[#065F46]">{a.percent}%</p>
              </div>
              <p className="mt-1 pl-6 text-xs text-slate-500">{a.detail}</p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: a.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${a.percent}%` }}
                  transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: "easeOut" }}
                />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.5 }}
        className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3"
      >
        <Stat icon={<Sparkle size={18} />} label="Investor" value={identity.fullName || "You"} />
        <Stat icon={<TrendUp size={18} />} label="Projected in 1 year" value={formatNaira(firstYear)} />
        <Stat icon={<TrendUp size={18} />} label="Projected in 5 years" value={formatNaira(fiveYear)} />
      </motion.div>

      <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onEdit}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 active:scale-[0.99]"
        >
          <PencilSimple size={16} /> Edit my profile
        </button>
        <button
          onClick={onRestart}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#065F46] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#04442F] active:scale-[0.99]"
        >
          Start a New Halal Journey <ArrowRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[#D97706]">
        {icon}
        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{label}</p>
      </div>
      <p className="mt-1 truncate font-display text-lg font-bold text-[#0F172A]">{value}</p>
    </div>
  );
}
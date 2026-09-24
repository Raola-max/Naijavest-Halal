import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bank,
  CheckCircle,
  Certificate,
  Coins,
  GraduationCap,
  HandCoins,
  Handshake,
  Lightbulb,
  Lock,
  Prohibit,
  Scales,
  Scroll,
  SealCheck,
  ShieldCheck,
  Sparkle,
  Users,
} from "@phosphor-icons/react";
import {
  AUDIT_PROCESS_STEPS,
  BRAND_NAME,
  CONTRACTS_EXCLUSION_NOTE,
  EXCLUDED_FINANCING_CONTRACTS,
  GOVERNANCE_STATEMENTS,
  ISLAMIC_FINANCE_CONTRACTS,
  SCREENING_METHODOLOGY_AVOID,
  SCREENING_METHODOLOGY_INVEST,
  SHARIAH_SCHOLARS,
} from "../data/halalDashboardData";
import type { IslamicContract, UserProfile } from "../types";

const CONTRACT_ICONS: Record<string, React.ReactNode> = {
  Handshake: <Handshake size={22} weight="fill" />,
  Coins: <Coins size={22} weight="fill" />,
  Users: <Users size={22} weight="fill" />,
  Lightbulb: <Lightbulb size={22} weight="fill" />,
  Certificate: <Certificate size={22} weight="fill" />,
  HandCoins: <HandCoins size={22} weight="fill" />,
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; ring: string }> = {
  agency: { bg: "bg-emerald-50", text: "text-emerald-700", ring: "ring-emerald-200" },
  "profit-sharing": { bg: "bg-teal-50", text: "text-teal-700", ring: "ring-teal-200" },
  partnership: { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200" },
  commission: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  certificates: { bg: "bg-cyan-50", text: "text-cyan-700", ring: "ring-cyan-200" },
  "benevolent-loan": { bg: "bg-rose-50", text: "text-rose-700", ring: "ring-rose-200" },
};

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function ShariahGovernanceScreen({
  profile,
  onBack,
}: {
  profile: UserProfile;
  onBack: () => void;
}) {
  const [openRule, setOpenRule] = useState<string | null>(
    SCREENING_METHODOLOGY_AVOID[0].id
  );
  const [openFaq, setOpenFaq] = useState<string | null>("cleansing");
  const [openContract, setOpenContract] = useState<string | null>(
    ISLAMIC_FINANCE_CONTRACTS[0].id
  );

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Back to dashboard */}
      <motion.button
        variants={item}
        onClick={onBack}
        className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold text-emerald-800 transition hover:bg-emerald-50 active:scale-[0.98]"
      >
        <ArrowRight size={14} weight="bold" className="rotate-180" />
        Back to Portfolio Dashboard
      </motion.button>

      {/* Hero: board declaration */}
      <motion.section
        variants={item}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#022C22] via-[#065F46] to-[#0F766E] p-8 text-white shadow-xl shadow-emerald-900/20 sm:p-10"
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(55% 60% at 90% 0%, rgba(16,185,129,0.35), transparent 60%), radial-gradient(40% 50% at 0% 100%, rgba(217,119,6,0.28), transparent 60%)",
          }}
        />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-bold text-emerald-100 backdrop-blur">
            <ShieldCheck size={15} weight="fill" className="text-[#34D399]" />
            Shariah Governance
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
            Certified Shariah Compliance
          </h1>
          <p className="mt-4 max-w-3xl text-[15px] leading-relaxed text-emerald-50/90">
            {GOVERNANCE_STATEMENTS.oversight}
          </p>
          <div className="mt-6 inline-flex max-w-3xl items-start gap-3 rounded-2xl border border-[#D97706]/40 bg-[#D97706]/15 p-4 text-sm font-semibold text-amber-100">
            <Sparkle size={18} weight="fill" className="mt-0.5 shrink-0 text-[#FBBF24]" />
            <span>{GOVERNANCE_STATEMENTS.approval}</span>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
            <span className="inline-flex items-center gap-2 font-semibold text-emerald-100">
              <SealCheck size={18} weight="fill" className="text-[#34D399]" />
              {profile.name} · Growth Tier
            </span>
            <span className="inline-flex items-center gap-2 font-semibold text-emerald-100/80">
              <Scales size={18} weight="bold" className="text-[#FBBF24]" />
              Aligned to {GOVERNANCE_STATEMENTS.standard} Standards
            </span>
          </div>
        </div>
      </motion.section>

      {/* Islamic Finance Contract Architecture */}
      <motion.section variants={item} className="space-y-5">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#065F46] to-[#10B981] text-white shadow-md shadow-emerald-900/20">
            <Scales size={20} weight="fill" />
          </span>
          <div>
            <h2 className="font-display text-xl font-extrabold text-[#0F172A]">
              Islamic Finance Contract Architecture
            </h2>
            <p className="text-xs font-semibold text-emerald-700/70">
              {ISLAMIC_FINANCE_CONTRACTS.length} investment contracts structuring your wealth
            </p>
          </div>
        </div>

        {/* Exclusion Callout Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-rose-200/80 bg-gradient-to-r from-rose-50 via-amber-50/50 to-rose-50 p-5">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-600/10 text-rose-600">
              <Lock size={18} weight="bold" />
            </span>
            <div>
              <h3 className="font-display text-sm font-extrabold text-rose-800">
                Financing Contracts Excluded
              </h3>
              <p className="mt-1 text-[13px] font-semibold leading-relaxed text-rose-700/90">
                {CONTRACTS_EXCLUSION_NOTE}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {EXCLUDED_FINANCING_CONTRACTS.map((ec) => (
                  <span
                    key={ec.id}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-bold text-rose-700 ring-1 ring-rose-200"
                  >
                    <Prohibit size={12} weight="bold" className="text-rose-500" />
                    {ec.name} ({ec.arabic})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contract Cards Grid */}
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {ISLAMIC_FINANCE_CONTRACTS.map((contract) => {
            const isOpen = openContract === contract.id;
            const colors = CATEGORY_COLORS[contract.category] ?? CATEGORY_COLORS.agency;
            return (
              <article
                key={contract.id}
                className={`group overflow-hidden rounded-2xl border bg-white shadow-sm transition-all duration-200 ${
                  isOpen
                    ? "border-emerald-300 shadow-lg shadow-emerald-900/5 ring-1 ring-emerald-200"
                    : "border-slate-200/80 hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
                }`}
              >
                <button
                  onClick={() => setOpenContract(isOpen ? null : contract.id)}
                  className="w-full px-5 py-4 text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${colors.bg} ${colors.text} ring-1 ${colors.ring}`}>
                        {CONTRACT_ICONS[contract.icon] ?? <Bank size={22} weight="fill" />}
                      </span>
                      <div>
                        <span className="font-display text-lg font-extrabold text-[#0F172A]">
                          {contract.name}
                        </span>
                        <span className="ml-2 text-base font-bold text-emerald-700/60">
                          {contract.arabic}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`mt-1 shrink-0 text-[10px] font-bold text-emerald-500 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      &#x25be;
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-2 pl-[52px]">
                    <span className="text-xs font-semibold text-slate-500">
                      {contract.englishMeaning}
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold capitalize ${
                      contract.status === "active"
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                        : "bg-slate-50 text-slate-600 ring-1 ring-slate-200"
                    }`}>
                      {contract.status}
                    </span>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-3">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-[#D97706]">
                        Contract Mechanism
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                        {contract.mechanism}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
                        Role in {BRAND_NAME}
                      </p>
                      <p className="mt-1 text-[13px] leading-relaxed text-slate-600">
                        {contract.naijaverole}
                      </p>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </motion.section>

      {/* Scholar profiles */}
      <motion.section variants={item} className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-extrabold text-[#0F172A]">
            The Scholars Behind Your Wealth
          </h2>
          <span className="hidden rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 sm:inline-flex">
            {SHARIAH_SCHOLARS.length} Verified Advisors
          </span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {SHARIAH_SCHOLARS.map((s) => (
            <article
              key={s.id}
              className="group flex flex-col rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#065F46] to-[#10B981] text-sm font-extrabold text-white shadow-md shadow-emerald-900/20">
                    {s.initials}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle size={12} weight="fill" />
                    Verified
                  </span>
                </div>
                <h3 className="max-w-[160px] text-right font-display text-[15px] font-extrabold leading-tight text-[#0F172A]">
                  {s.name}
                </h3>
              </div>
              <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-[#D97706]">
                {s.honorific}
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">{s.role}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.credentials.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 rounded-lg bg-slate-50 px-2 py-1 text-[11px] font-semibold text-slate-600 ring-1 ring-slate-200"
                  >
                    <GraduationCap size={12} weight="bold" className="text-emerald-600" />
                    {c}
                  </span>
                ))}
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-slate-500">
                {s.bio}
              </p>
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {s.badges.map((b) => (
                  <span
                    key={b}
                    className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-[#B45309] ring-1 ring-amber-200"
                  >
                    {b}
                  </span>
                ))}
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 ring-1 ring-emerald-200">
                  {s.advisoryYears}
                </span>
              </div>
            </article>
          ))}
        </div>
      </motion.section>

      {/* Two-pillar screening methodology */}
      <motion.section variants={item} className="space-y-4">
        <h2 className="font-display text-xl font-extrabold text-[#0F172A]">
          How We Screen Every Asset
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {/* Avoid column */}
          <div className="overflow-hidden rounded-3xl border border-rose-200/70 bg-white shadow-sm">
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-rose-50 to-rose-100/60 px-5 py-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-rose-600/10 text-rose-600">
                <Prohibit size={20} weight="bold" />
              </span>
              <div>
                <h3 className="font-display text-base font-extrabold text-[#0F172A]">
                  What We Strictly Avoid
                </h3>
                <p className="text-xs font-medium text-rose-700/70">
                  Automatic exclusion at every layer
                </p>
              </div>
            </div>
            <ul className="divide-y divide-slate-100 px-2 py-2">
              {SCREENING_METHODOLOGY_AVOID.map((rule) => {
                const open = openRule === rule.id;
                return (
                  <li key={rule.id}>
                    <button
                      onClick={() => setOpenRule(open ? null : rule.id)}
                      className={`w-full rounded-2xl px-3 py-3 text-left transition hover:bg-rose-50/60 ${
                        open ? "bg-rose-50/60" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
                          {rule.arabic ? (
                            <span className="font-display text-base font-extrabold text-rose-600">
                              {rule.arabic}
                            </span>
                          ) : (
                            <span className="grid h-6 w-6 place-items-center rounded-md bg-rose-600/10 text-[10px] font-black text-rose-600">
                              NO
                            </span>
                          )}
                          {rule.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold text-rose-500 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        >
                          ▾
                        </span>
                      </div>
                      <p className="mt-0.5 pl-8 text-xs font-medium text-rose-700/70">
                        {rule.description}
                      </p>
                      {open && (
                        <p className="mt-2 rounded-xl bg-white p-3 text-[13px] leading-relaxed text-slate-500 ring-1 ring-rose-100">
                          {rule.detail}
                        </p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Invest column */}
          <div className="overflow-hidden rounded-3xl border border-emerald-200/70 bg-white shadow-sm">
            <div className="flex items-center gap-2.5 bg-gradient-to-r from-emerald-50 to-emerald-100/60 px-5 py-4">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-600/10 text-emerald-700">
                <CheckCircle size={20} weight="bold" />
              </span>
              <div>
                <h3 className="font-display text-base font-extrabold text-[#0F172A]">
                  What We Invest In
                </h3>
                <p className="text-xs font-medium text-emerald-700/70">
                  {SCREENING_METHODOLOGY_INVEST.length} eligible asset classes
                </p>
              </div>
            </div>
            <ul className="divide-y divide-slate-100 px-2 py-2">
              {SCREENING_METHODOLOGY_INVEST.map((rule) => {
                const open = openRule === rule.id;
                return (
                  <li key={rule.id}>
                    <button
                      onClick={() => setOpenRule(open ? null : rule.id)}
                      className={`w-full rounded-2xl px-3 py-3 text-left transition hover:bg-emerald-50/60 ${
                        open ? "bg-emerald-50/60" : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-2 text-sm font-bold text-slate-800">
                          <span className="grid h-6 w-6 place-items-center rounded-md bg-emerald-600/10 text-emerald-700">
                            <CheckCircle size={14} weight="fill" />
                          </span>
                          {rule.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold text-emerald-500 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        >
                          ▾
                        </span>
                      </div>
                      <p className="mt-0.5 pl-8 text-xs font-medium text-emerald-700/70">
                        {rule.description}
                      </p>
                      {open && (
                        <p className="mt-2 rounded-xl bg-white p-3 text-[13px] leading-relaxed text-slate-500 ring-1 ring-emerald-100">
                          {rule.detail}
                        </p>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </motion.section>

      {/* Continuous review banner */}
      <motion.section
        variants={item}
        className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-[#D97706]/25 bg-gradient-to-r from-amber-50 to-emerald-50 p-6 sm:flex-row sm:items-center"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#D97706]/15 text-[#B45309]">
            <ShieldCheck size={22} weight="fill" />
          </span>
          <div>
            <h3 className="font-display text-base font-extrabold text-[#0F172A]">
              {GOVERNANCE_STATEMENTS.approval}
            </h3>
            <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-slate-500">
              Every holding in your dashboard carries a live approval from the
              Board. New assets are frozen at pre-screening until a formal
              ruling is issued. No asset trades without Board sign-off.
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-emerald-800 shadow-sm ring-1 ring-emerald-200">
          <SealCheck size={15} weight="fill" className="text-[#065F46]" />
          {GOVERNANCE_STATEMENTS.standard} Compliant
        </span>
      </motion.section>

      {/* Audit cycle */}
      <motion.section variants={item} className="space-y-4">
        <h2 className="font-display text-xl font-extrabold text-[#0F172A]">
          Portfolio Approval Flow
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {AUDIT_PROCESS_STEPS.map((step, i) => (
            <article
              key={step.id}
              className="relative rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-900/5"
            >
              <span className="absolute right-5 top-5 font-display text-3xl font-black text-emerald-100">
                {i + 1}
              </span>
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#065F46] to-[#10B981] text-white shadow-md shadow-emerald-900/20">
                <Scroll size={18} weight="fill" />
              </span>
              <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-[#D97706]">
                {step.badge}
              </p>
              <h3 className="mt-1 font-display text-[15px] font-extrabold text-[#0F172A]">
                {step.title}
              </h3>
              <p className="mt-1 text-xs font-semibold text-emerald-700/80">
                {step.tagline}
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
                {step.description}
              </p>
            </article>
          ))}
        </div>
      </motion.section>

      {/* AAOIFI reference & FAQ */}
      <motion.section
        variants={item}
        className="grid gap-4 lg:grid-cols-5"
      >
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
            <Certificate size={20} weight="fill" />
          </span>
          <h3 className="mt-4 font-display text-base font-extrabold text-[#0F172A]">
            Certificate of Shariah Compliance
          </h3>
          <p className="mt-2 text-[13px] leading-relaxed text-slate-500">
            Every portfolio allocation is reviewed under{" "}
            <span className="font-bold text-emerald-800">{GOVERNANCE_STATEMENTS.standard}</span>{" "}
            ({GOVERNANCE_STATEMENTS.standardName}) standards. Your signed
            certificate and the Board fatwa rulings are available for download
            with each quarterly audit cycle.
          </p>
          <button
            onClick={() => onBack()}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#065F46] to-[#10B981] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/20 transition hover:opacity-95 active:scale-[0.98]"
          >
            <Certificate size={15} weight="bold" />
            View Your Certificate
          </button>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-3">
          <h3 className="font-display text-base font-extrabold text-[#0F172A]">
            {BRAND_NAME} Compliance FAQ
          </h3>
          <div className="mt-4 space-y-2">
            {[
              {
                id: "cleansing",
                q: "What is dividend cleansing and how does it work?",
                a: "Some screened companies still earn a tiny share of non-permissible income (e.g. riba income on idle cash). We estimate that portion at 6% dividend yield basis, then purify it: the impure amount is given to charity so your wealth stays fully halal.",
              },
              {
                id: "aaoifi",
                q: `What does "${GOVERNANCE_STATEMENTS.standard} aligned" actually mean?`,
                a: `The ${GOVERNANCE_STATEMENTS.standard} is the global standards body for Islamic finance. Aligned means our screens follow ${GOVERNANCE_STATEMENTS.standard} Standard No. 21 (equities) and related standards for sukuk, gold and liquidity instruments.`,
              },
              {
                id: "thresholds",
                q: "What are the exact ratio thresholds?",
                a: "Debt-to-market-cap must stay under 33%, cash-and-riba-bearing assets under 33%, and non-permissible income under the 5% AAOIFI tolerance. Breaches trigger automatic review and disqualification.",
              },
            ].map((f) => {
              const open = openFaq === f.id;
              return (
                <div
                  key={f.id}
                  className="overflow-hidden rounded-2xl ring-1 ring-slate-100"
                >
                  <button
                    onClick={() => setOpenFaq(open ? null : f.id)}
                    className={`flex w-full items-start justify-between gap-3 px-4 py-3 text-left transition ${
                      open ? "bg-emerald-50/70" : "hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-sm font-bold text-slate-800">{f.q}</span>
                    <span
                      className={`mt-0.5 shrink-0 grid h-5 w-5 place-items-center rounded-full text-[10px] font-black transition ${
                        open
                          ? "rotate-180 bg-emerald-600 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      ▾
                    </span>
                  </button>
                  {open && (
                    <p className="border-t border-emerald-100/70 bg-white px-4 py-3 text-[13px] leading-relaxed text-slate-500">
                      {f.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      <motion.p
        variants={item}
        className="text-center text-xs text-slate-400"
      >
        {BRAND_NAME} · Screened & approved by {GOVERNANCE_STATEMENTS.standard}{" "}
        aligned Shariah governance. Educational demo, not financial advice.
      </motion.p>
    </motion.div>
  );
}
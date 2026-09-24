import { useState } from "react";
import { motion } from "framer-motion";
import { User, Envelope, Target, Coins, ArrowRight } from "@phosphor-icons/react";
import { toast } from "sonner";
import { GOAL_OPTIONS, formatNaira } from "../data/halalData";
import type { IdentityData } from "../types";

interface Props {
  onComplete: (data: IdentityData) => void;
}

export default function StepIdentity({ onComplete }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [capital, setCapital] = useState<number>(250000);

  const valid = fullName.trim().length > 1 && /\S+@\S+\.\S+/.test(email) && goal !== "";

  const submit = () => {
    if (!valid) {
      toast.error("Please complete your details to continue.");
      return;
    }
    onComplete({ fullName: fullName.trim(), email: email.trim(), goal, capital });
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#D97706]">Step 1 of 3</p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-[#0F172A] sm:text-4xl">
          Welcome, future investor.
        </h1>
        <p className="mt-2 max-w-[60ch] leading-relaxed text-slate-600">
          Tell us who you are and what you are building. Your details stay on this device.
        </p>
      </motion.div>

      <div className="mt-8 space-y-5">
        <Field label="Full Name" icon={<User size={18} />}>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Aisha Bello"
            className="w-full bg-transparent text-[15px] text-[#0F172A] outline-none placeholder:text-slate-400"
          />
        </Field>
        <Field label="Email Address" icon={<Envelope size={18} />}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full bg-transparent text-[15px] text-[#0F172A] outline-none placeholder:text-slate-400"
          />
        </Field>

        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
            <Target size={18} className="text-[#065F46]" /> Investment Goal
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {GOAL_OPTIONS.map((g) => {
              const selected = goal === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={
                    "rounded-xl border p-4 text-left transition active:scale-[0.99] " +
                    (selected
                      ? "border-[#065F46] bg-emerald-50 shadow-sm ring-1 ring-[#065F46]"
                      : "border-slate-200 bg-white hover:border-emerald-300")
                  }
                >
                  <p className="text-sm font-semibold text-[#0F172A]">{g.label}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{g.hint}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#0F172A]">
            <Coins size={18} className="text-[#D97706]" /> Initial Intended Capital
          </div>
          <p className="font-display text-2xl font-bold text-[#065F46]">{formatNaira(capital)}</p>
          <input
            type="range"
            min={10000}
            max={5000000}
            step={10000}
            value={capital}
            onChange={(e) => setCapital(Number(e.target.value))}
            className="mt-3 w-full accent-[#065F46]"
          />
          <div className="mt-1 flex justify-between text-[11px] text-slate-400">
            <span>₦10,000</span>
            <span>₦5,000,000</span>
          </div>
        </div>
      </div>

      <button
        onClick={submit}
        disabled={!valid}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#065F46] px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-[#04442F] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
      >
        Continue <ArrowRight size={18} weight="bold" />
      </button>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-[#0F172A]">{label}</span>
      <div className="flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white px-4 py-3 transition focus-within:border-[#065F46] focus-within:ring-2 focus-within:ring-emerald-500/20">
        <span className="text-[#065F46]">{icon}</span>
        {children}
      </div>
    </label>
  );
}

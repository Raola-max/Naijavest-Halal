import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  FirstAidKit,
  GearSix,
  GraduationCap,
  HandCoins,
  House,
  Lightning,
  MapPin,
  Receipt,
  Scales,
  SealCheck,
  Users,
} from "@phosphor-icons/react";
import {
  CHARITIES,
  DEFAULT_ZAKAT_CONFIG,
  ZAKAT_CONFIG_KEY,
  formatNaira,
} from "../data/halalDashboardData";
import type { CharityCategory, UserProfile, VerifiedCharity, ZakatConfig } from "../types";
import { HawlCard, useHawlCountdown } from "./ZakatCalc";
import NisabSection from "./ZakatCalc";
import { PaidState, PayForm, SettingsForm } from "./ZakatModals";

interface Props {
  profile: UserProfile;
  totalWealth: number;
  impureAmount: number;
}

const ZAKAT_RATE = 0.025;
const CHARITY_CATEGORIES: CharityCategory[] = [
  "Poverty Alleviation",
  "Orphans",
  "Education",
  "Healthcare",
  "Emergency",
];

const CATEGORY_ICONS: Record<CharityCategory, React.ReactNode> = {
  "Poverty Alleviation": <Users size={18} weight="bold" />,
  Orphans: <House size={18} weight="bold" />,
  Education: <GraduationCap size={18} weight="bold" />,
  Healthcare: <FirstAidKit size={18} weight="bold" />,
  Emergency: <Lightning size={18} weight="bold" />,
};

function loadConfig(): ZakatConfig {
  try {
    const raw = localStorage.getItem(ZAKAT_CONFIG_KEY);
    if (!raw) return DEFAULT_ZAKAT_CONFIG;
    return { ...DEFAULT_ZAKAT_CONFIG, ...(JSON.parse(raw) as ZakatConfig) };
  } catch {
    return DEFAULT_ZAKAT_CONFIG;
  }
}

export default function ZakatScreen({ profile, totalWealth, impureAmount }: Props) {
  const hawl = useHawlCountdown();
  const [config, setConfig] = useState<ZakatConfig>(loadConfig);
  const [showSettings, setShowSettings] = useState(false);
  const [catFilter, setCatFilter] = useState<CharityCategory | "All">("All");
  const [selected, setSelected] = useState<VerifiedCharity | null>(null);
  const [payAmount, setPayAmount] = useState("");
  const [paid, setPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  const zakatableWealth = Math.max(0, totalWealth - impureAmount);
  const due = zakatableWealth * ZAKAT_RATE;

  const visibleCharities = useMemo(
    () =>
      catFilter === "All"
        ? CHARITIES
        : CHARITIES.filter((c) => c.category === catFilter),
    [catFilter]
  );

  function saveConfig(next: ZakatConfig) {
    setConfig(next);
    localStorage.setItem(ZAKAT_CONFIG_KEY, JSON.stringify(next));
    toast.success("Nisab settings updated");
    setShowSettings(false);
  }

  function confirmPay() {
    if (!selected) return;
    const amount = Number(payAmount.replace(/[^0-9.]/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) {
      toast.error("Enter a valid amount in Naira");
      return;
    }
    if (amount > due && due > 0) {
      toast.error("Amount exceeds your calculated Zakat due");
      return;
    }
    setPaid(true);
    toast.success(`Zakat of ${formatNaira(amount)} to ${selected.name}`, {
      description: "May Allah accept it. JazakAllah khair!",
    });
  }

  function copyDetails(c: VerifiedCharity) {
    navigator.clipboard
      ?.writeText(`${c.accountName} | ${c.accountNumber} | ${c.bank}`)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => toast.error("Could not copy account details"));
  }

  function closeModal() {
    setSelected(null);
    setPayAmount("");
    setPaid(false);
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex flex-wrap items-end justify-between gap-3"
      >
        <div>
          <div className="flex items-center gap-2 text-sm text-emerald-700">
            <Scales size={17} weight="bold" />
            <span className="font-semibold">Zakat Calculator</span>
          </div>
          <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            Purify your wealth, {profile.greetingName} 🌙
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Estimate your Zakat on assets held above the nisab for one lunar
            year (Hawl).
          </p>
        </div>
        <button
          onClick={() => setShowSettings(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 active:scale-95"
        >
          <GearSix size={15} /> Nisab Settings
        </button>
      </motion.div>

      <HawlCard hawl={hawl} />

      <div className="grid gap-5 lg:grid-cols-3">
        <NisabSection
          config={config}
          totalWealth={totalWealth}
          impureAmount={impureAmount}
          onOpenSettings={() => setShowSettings(true)}
          onPay={() => setSelected(CHARITIES[0])}
        />
      </div>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
        className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Verified Charities &amp; Zakat Funds
            </h2>
            <p className="text-xs text-slate-500">
              Shariah-vetted recipients · direct account transfer
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...CHARITY_CATEGORIES] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  catFilter === c
                    ? "bg-[#065F46] text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleCharities.map((c) => (
            <CharityCard key={c.id} c={c} onDonate={() => setSelected(c)} />
          ))}
        </div>
        {visibleCharities.length === 0 && (
          <div className="grid place-items-center py-10 text-center">
            <Receipt size={22} className="text-slate-300" />
            <p className="mt-2 text-sm font-medium text-slate-500">
              No charities in this category yet
            </p>
          </div>
        )}
      </motion.section>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            >
              {paid ? (
                <PaidState name={selected.name} onDone={closeModal} />
              ) : (
                <PayForm
                  selected={selected}
                  due={due}
                  payAmount={payAmount}
                  setPayAmount={setPayAmount}
                  copied={copied}
                  onCopy={() => copyDetails(selected)}
                  onConfirm={confirmPay}
                  onClose={closeModal}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-slate-900/50 p-4 backdrop-blur-sm"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
              <SettingsForm
                config={config}
                onChange={setConfig}
                onSave={() => saveConfig(config)}
                onClose={() => setShowSettings(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CharityCard({
  c,
  onDonate,
}: {
  c: VerifiedCharity;
  onDonate: () => void;
}) {
  return (
    <div className="group rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition hover:border-emerald-200 hover:bg-white hover:shadow-md">
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-700">
          {CATEGORY_ICONS[c.category] ?? <HandCoins size={18} weight="bold" />}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
          <SealCheck size={12} weight="fill" /> Verified
        </span>
      </div>
      <h3 className="mt-3 text-sm font-bold leading-snug text-slate-900">
        {c.name}
      </h3>
      <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
        <MapPin size={12} /> {c.location} · {c.category}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-slate-500">{c.blurb}</p>
      <button
        onClick={onDonate}
        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-white py-2 text-xs font-bold text-emerald-700 transition group-hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.98]"
      >
        Donate Zakat <ArrowRight size={13} weight="bold" />
      </button>
    </div>
  );
}
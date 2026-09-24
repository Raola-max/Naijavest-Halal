import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster, toast } from "sonner";
import HeaderNav from "./components/HeaderNav";
import PortfolioSummary from "./components/PortfolioSummary";
import AssetAllocationChart from "./components/AssetAllocationChart";
import HoldingsList from "./components/HoldingsList";
import QuickActionCards from "./components/QuickActionCards";
import ZakatScreen from "./components/ZakatScreen";
import PurificationScreen from "./components/PurificationScreen";
import GoalsScreen from "./components/GoalsScreen";
import AssetDetailModal from "./components/AssetDetailModal";
import ShariahGovernanceScreen from "./components/ShariahGovernanceScreen";
import ProfileScreen from "./components/ProfileScreen";
import HijriDateModal from "./components/HijriDateModal";
import {
  BRAND_NAME,
  DEFAULT_GOALS,
  DEFAULT_PROFILE,
  GOALS_STORAGE_KEY,
  INITIAL_HOLDINGS,
  PURIFICATION_LOG_KEY,
  SHARIAH_BOARD,
  buildAllocation,
  dailyGain,
  formatNaira,
  getTodayLine,
  totalValue,
} from "./data/halalDashboardData";
import type { AppView, HalalGoal, HoldingItem, TransactionRecord, PurificationRecord } from "./types";

const HOLDINGS_KEY = "nv_holdings_v1";
const TX_KEY = "nv_transactions_v1";

function loadGoals(): HalalGoal[] {
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as HalalGoal[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch { /* ignore */ }
  return DEFAULT_GOALS;
}

function loadHoldings(): HoldingItem[] {
  try {
    const raw = localStorage.getItem(HOLDINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as HoldingItem[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {
    /* ignore corrupt state */
  }
  return INITIAL_HOLDINGS;
}

function loadTx(): TransactionRecord[] {
  try {
    const raw = localStorage.getItem(TX_KEY);
    if (raw) return JSON.parse(raw) as TransactionRecord[];
  } catch {
    /* ignore */
  }
  return [];
}

/** Sum every persisted purification settlement so the running total survives reloads. */
function loadPurifiedTotal(): number {
  try {
    const raw = localStorage.getItem(PURIFICATION_LOG_KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as PurificationRecord[];
    if (!Array.isArray(parsed)) return 0;
    return parsed.reduce((sum, r) => sum + (Number(r.amount) || 0), 0);
  } catch {
    return 0;
  }
}

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>("dashboard");
  const [holdings, setHoldings] = useState<HoldingItem[]>(loadHoldings);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(loadTx);
  const [selectedHolding, setSelectedHolding] = useState<HoldingItem | null>(null);
  const [goals, setGoals] = useState<HalalGoal[]>(loadGoals);
  const [hijriOpen, setHijriOpen] = useState(false);

  // Running total of purification amounts settled, rehydrated from localStorage.
  const [purifiedTotal, setPurifiedTotal] = useState(loadPurifiedTotal);

  const handlePurifyRecord = useCallback((amount: number, _record: PurificationRecord) => {
    setPurifiedTotal((prev) => prev + amount);
    toast.message(`Purification logged: ${formatNaira(amount)}`, {
      description: "Charity recorded against non-permissible income.",
    });
  }, []);

  useEffect(() => {
    localStorage.setItem(HOLDINGS_KEY, JSON.stringify(holdings));
  }, [holdings]);
  useEffect(() => {
    localStorage.setItem(TX_KEY, JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  }, [goals]);

  const total = useMemo(() => totalValue(holdings), [holdings]);
  const gain = useMemo(() => dailyGain(holdings), [holdings]);
  const allocation = useMemo(() => buildAllocation(holdings), [holdings]);

  const cashBuffer = useMemo(
    () =>
      holdings
        .filter((h) => h.category === "Cash Buffer")
        .reduce((s, h) => s + h.marketValue, 0),
    [holdings]
  );

  const netYieldPct = useMemo(() => {
    const w = holdings.reduce((s, h) => s + h.marketValue, 0) || 1;
    return holdings.reduce((s, h) => s + h.dailyChangePct * h.marketValue, 0) / w;
  }, [holdings]);

  const impureAmount = useMemo(
    () =>
      holdings.reduce(
        (s, h) => s + h.marketValue * 0.06 * (h.impurityRatio ?? 0),
        0
      ),
    [holdings]
  );

  const pushTx = useCallback(
    (type: TransactionRecord["type"], amount: number, balanceAfter: number, label?: string) => {
      setTransactions((prev) => [
        {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          amount,
          timestamp: new Date().toISOString(),
          balanceAfter,
          label,
        },
        ...prev,
      ]);
    },
    []
  );

  const handleDeposit = useCallback(
    (amount: number) => {
      setHoldings((prev) =>
        prev.map((h) =>
          h.category === "Cash Buffer"
            ? {
                ...h,
                marketValue: h.marketValue + amount,
                pricePerUnit: h.marketValue + amount,
              }
            : h
        )
      );
      pushTx("deposit", amount, total + amount);
    },
    [pushTx, total]
  );

  const handleWithdraw = useCallback(
    (amount: number) => {
      setHoldings((prev) =>
        prev.map((h) =>
          h.category === "Cash Buffer"
            ? {
                ...h,
                marketValue: Math.max(0, h.marketValue - amount),
                pricePerUnit: Math.max(0, h.marketValue - amount),
              }
            : h
        )
      );
      pushTx("withdraw", amount, Math.max(0, total - amount));
    },
    [pushTx, total]
  );

  // Instant "Move to Bank" - withdraw from the Mudarabah cash buffer to the
  // linked halal bank account (zero-riba simulation) and log the transaction.
  const handleTransfer = useCallback(
    (amount: number) => {
      setHoldings((prev) =>
        prev.map((h) =>
          h.category === "Cash Buffer"
            ? {
                ...h,
                marketValue: Math.max(0, h.marketValue - amount),
                pricePerUnit: Math.max(0, h.marketValue - amount),
              }
            : h
        )
      );
      pushTx("withdraw", amount, Math.max(0, cashBuffer - amount), "Instant Bank Transfer - Mudarabah Cash Buffer");
    },
    [cashBuffer, pushTx]
  );

  // Dashboard quick-purification: persists a settlement record so it stays in
  // sync with the Purification Tracker history and the running purified total.
  const handlePurge = useCallback((amount: number) => {
    if (amount <= 0) return;
    const record: PurificationRecord = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      amount,
      organizationId: "quick-sadaqah",
      organizationName: "Quick Sadaqah",
      timestamp: new Date().toISOString(),
      reference: `PUR-${Date.now().toString(36).toUpperCase()}`,
      note: "Logged from dashboard quick purification",
    };
    try {
      const raw = localStorage.getItem(PURIFICATION_LOG_KEY);
      const existing = raw ? (JSON.parse(raw) as PurificationRecord[]) : [];
      const next = [record, ...(Array.isArray(existing) ? existing : [])];
      localStorage.setItem(PURIFICATION_LOG_KEY, JSON.stringify(next));
    } catch {
      /* ignore storage failures */
    }
    setPurifiedTotal((prev) => prev + amount);
    toast.message(`Purification logged: ${formatNaira(amount)}`, {
      description: "Charity recorded against non-permissible income.",
    });
  }, []);

  // ─── Goals handlers ────────────────────────────────────────────────────────
  const handleSaveGoal = useCallback((goal: HalalGoal) => {
    setGoals((prev) => {
      const idx = prev.findIndex((g) => g.id === goal.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = goal; return next; }
      return [...prev, goal];
    });
  }, []);

  const handleDeleteGoal = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    toast.message("Goal removed");
  }, []);

  const handleFundGoal = useCallback((goalId: string, amount: number) => {
    setGoals((prev) => prev.map((g) => {
      if (g.id !== goalId) return g;
      const newCurrent = g.currentAmount + amount;
      return { ...g, currentAmount: newCurrent, status: newCurrent >= g.targetAmount ? "completed" as const : g.status };
    }));
    // Deduct from cash buffer
    setHoldings((prev) => prev.map((h) =>
      h.category === "Cash Buffer"
        ? { ...h, marketValue: Math.max(0, h.marketValue - amount), pricePerUnit: Math.max(0, h.marketValue - amount) }
        : h
    ));
    pushTx("withdraw", amount, Math.max(0, cashBuffer - amount), "Goal Funding");
  }, [cashBuffer, pushTx]);

  return (
    <div className="min-h-[100dvh] bg-[#F8FAFC] font-sans text-[#0F172A] antialiased">
      <div
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 45% at 85% 0%, rgba(6,95,70,0.12), transparent 60%), radial-gradient(50% 40% at 0% 100%, rgba(217,119,6,0.09), transparent 60%)",
        }}
      />
      <Toaster position="top-center" richColors closeButton />
      <HeaderNav
        profile={DEFAULT_PROFILE}
        view={currentView}
        onNavigate={setCurrentView}
        onOpenHijri={() => setHijriOpen(true)}
      />

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <PortfolioSummary
          profile={DEFAULT_PROFILE}
          total={total}
          dailyGain={gain}
          netYieldPct={netYieldPct}
          totalReturnPct={18.4}
          cashBuffer={cashBuffer}
          onDeposit={handleDeposit}
          onWithdraw={handleWithdraw}
          onOpenHijri={() => setHijriOpen(true)}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <AssetAllocationChart allocation={allocation} total={total} />
          </div>
          <div className="lg:col-span-2">
            <HoldingsList holdings={holdings} onSelectAsset={setSelectedHolding} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="space-y-6"
          >
            {currentView === "zakat" && (
              <ZakatScreen
                profile={DEFAULT_PROFILE}
                totalWealth={total}
                impureAmount={impureAmount}
              />
            )}
            {currentView === "goals" && (
              <GoalsScreen
                goals={goals}
                cashBuffer={cashBuffer}
                onSaveGoal={handleSaveGoal}
                onDeleteGoal={handleDeleteGoal}
                onFundGoal={handleFundGoal}
              />
            )}
            {currentView === "purification" && (
              <PurificationScreen
                profile={DEFAULT_PROFILE}
                holdings={holdings}
                purifiedTotal={purifiedTotal}
                onPurify={handlePurifyRecord}
              />
            )}
            {currentView === "governance" && (
              <ShariahGovernanceScreen
                profile={DEFAULT_PROFILE}
                onBack={() => setCurrentView("dashboard")}
              />
            )}
            {currentView === "profile" && (
              <ProfileScreen
                profile={DEFAULT_PROFILE}
                holdings={holdings}
                goals={goals}
                purifiedTotal={purifiedTotal}
                onOpenHijri={() => setHijriOpen(true)}
              />
            )}
            {currentView === "dashboard" && (
              <QuickActionCards
                holdings={holdings}
                cashBuffer={cashBuffer}
                onTransfer={handleTransfer}
                onPurge={handlePurge}
                onOpenZakat={() => setCurrentView("zakat")}
                onOpenPurification={() => setCurrentView("purification")}
                onOpenGoals={() => setCurrentView("goals")}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {transactions.length > 0 && (
          <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <h2 className="font-display text-base font-bold text-slate-900">
              Recent Activity
            </h2>
            <ul className="mt-3 divide-y divide-slate-100">
              {transactions.slice(0, 5).map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2.5">
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-8 w-8 place-items-center rounded-lg text-xs font-bold ${
                        t.type === "deposit"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-600"
                      }`}
                    >
                      {t.type === "deposit" ? "+" : "−"}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        {t.label ?? t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {new Date(t.timestamp).toLocaleString("en-NG")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold tabular-nums text-slate-900">
                      {formatNaira(t.amount)}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      after {formatNaira(t.balanceAfter, true)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer className="border-t border-emerald-900/10 py-6 text-center text-xs text-slate-400">
        {BRAND_NAME} · All allocations screened by {SHARIAH_BOARD} via Wakalah, Mudarabah & Musharakah contracts. Educational demo, not financial advice.
      </footer>

      <AssetDetailModal
        holding={selectedHolding}
        onClose={() => setSelectedHolding(null)}
      />
      <HijriDateModal open={hijriOpen} onClose={() => setHijriOpen(false)} />
    </div>
  );
}
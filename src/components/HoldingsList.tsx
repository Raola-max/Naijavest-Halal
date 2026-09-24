import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  MagnifyingGlass,
  TrendUp,
  TrendDown,
  ArrowsClockwise,
} from "@phosphor-icons/react";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  formatNaira,
  formatSignedPct,
} from "../data/halalDashboardData";
import type { AssetCategory, HoldingItem } from "../types";

type Filter = "All" | AssetCategory;
type SortKey = "value" | "performance";

const FILTERS: Filter[] = ["All", ...CATEGORY_ORDER];

export default function HoldingsList({ holdings, onSelectAsset }: { holdings: HoldingItem[]; onSelectAsset?: (h: HoldingItem) => void }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("value");

  const rows = useMemo(() => {
    let list = holdings.slice();
    if (filter !== "All") list = list.filter((h) => h.category === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.ticker.toLowerCase().includes(q)
      );
    }
    list.sort((a, b) =>
      sortKey === "value"
        ? b.marketValue - a.marketValue
        : b.dailyChangePct - a.dailyChangePct
    );
    return list;
  }, [holdings, filter, query, sortKey]);

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">
            Holdings Breakdown
          </h2>
          <p className="text-xs text-slate-500">
            {rows.length} asset{rows.length === 1 ? "" : "s"} · daily P&amp;L
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2.5 focus-within:border-emerald-400 focus-within:ring-2 focus-within:ring-emerald-100">
            <MagnifyingGlass size={15} className="text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search assets"
              className="w-32 bg-transparent py-2 text-sm text-slate-700 outline-none placeholder:text-slate-400 sm:w-40"
            />
          </div>
          <button
            onClick={() =>
              setSortKey((s) => (s === "value" ? "performance" : "value"))
            }
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-emerald-300 active:scale-95"
          >
            <ArrowsClockwise size={14} />
            {sortKey === "value" ? "By Value" : "By P&amp;L"}
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filter === f
                ? "bg-[#065F46] text-white shadow-sm"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="mt-4 hidden overflow-hidden rounded-2xl border border-slate-100 md:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-400">
            <tr>
              <th className="px-4 py-3 font-semibold">Asset</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 text-right font-semibold">Units</th>
              <th className="px-4 py-3 text-right font-semibold">Market Value</th>
              <th className="px-4 py-3 text-right font-semibold">Daily</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((h) => (
              <tr
                key={h.id}
                onClick={() => onSelectAsset?.(h)}
                className="cursor-pointer transition hover:bg-emerald-50/40 active:bg-emerald-50"
              >
                <td className="px-4 py-3">
                  <p className="font-semibold text-slate-800">{h.name}</p>
                  <p className="text-[11px] text-slate-400">{h.ticker}</p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
                    style={{
                      backgroundColor: `${CATEGORY_META[h.category].color}14`,
                      color: CATEGORY_META[h.category].color,
                    }}
                  >
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: CATEGORY_META[h.category].color }}
                    />
                    {h.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-right tabular-nums text-slate-600">
                  {h.units.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-right font-bold tabular-nums text-slate-900">
                  {formatNaira(h.marketValue)}
                </td>
                <td className="px-4 py-3">
                  <ChangeBadge pct={h.dailyChangePct} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && <EmptyRow />}
      </div>

      {/* Mobile cards */}
      <div className="mt-4 space-y-2.5 md:hidden">
        {rows.map((h) => (
          <div
            key={h.id}
            onClick={() => onSelectAsset?.(h)}
            className="cursor-pointer rounded-2xl border border-slate-100 bg-slate-50/50 p-3.5 transition hover:border-emerald-200 hover:bg-emerald-50/30 active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">{h.name}</p>
                <p className="text-[11px] text-slate-400">
                  {h.ticker} · {h.category}
                </p>
              </div>
              <ChangeBadge pct={h.dailyChangePct} />
            </div>
            <div className="mt-2 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                {h.units.toLocaleString()} units
              </p>
              <p className="font-bold tabular-nums text-slate-900">
                {formatNaira(h.marketValue)}
              </p>
            </div>
          </div>
        ))}
        {rows.length === 0 && <EmptyRow />}
      </div>
    </motion.section>
  );
}

function ChangeBadge({ pct }: { pct: number }) {
  const up = pct >= 0;
  return (
    <div className="flex flex-col items-end md:items-end">
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-bold tabular-nums ${
          up ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"
        }`}
      >
        {up ? <TrendUp size={13} /> : <TrendDown size={13} />}
        {formatSignedPct(pct)}
      </span>
    </div>
  );
}

function EmptyRow() {
  return (
    <div className="grid place-items-center py-10 text-center">
      <MagnifyingGlass size={22} className="text-slate-300" />
      <p className="mt-2 text-sm font-medium text-slate-500">
        No holdings match your filters
      </p>
    </div>
  );
}
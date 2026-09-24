import { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ChartPie } from "@phosphor-icons/react";
import {
  CATEGORY_META,
  formatNaira,
} from "../data/halalDashboardData";
import type { AssetAllocationSlice, AssetCategory } from "../types";

interface Props {
  allocation: AssetAllocationSlice[];
  total: number;
}

export default function AssetAllocationChart({ allocation, total }: Props) {
  const [focused, setFocused] = useState<AssetCategory | null>(null);

  const data = allocation.map((a) => ({
    name: a.category,
    value: a.value,
    percent: a.percent,
    color: a.color,
  }));

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm"
    >
      <div className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-[#065F46]">
          <ChartPie size={18} weight="bold" />
        </span>
        <div>
          <h2 className="font-display text-base font-bold text-slate-900">
            Asset Allocation
          </h2>
          <p className="text-xs text-slate-500">
            Shariah-screened across 5 halal asset classes
          </p>
        </div>
      </div>

      <div className="mt-2 grid items-center gap-6 lg:grid-cols-2">
        <div className="relative h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius="62%"
                outerRadius="92%"
                paddingAngle={2}
                stroke="none"
                isAnimationActive
              >
                {data.map((d) => (
                  <Cell
                    key={d.name}
                    fill={d.color}
                    opacity={focused && focused !== d.name ? 0.25 : 1}
                    onClick={() =>
                      setFocused((f) => (f === d.name ? null : (d.name as AssetCategory)))
                    }
                    style={{ cursor: "pointer", outline: "none" }}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatNaira(value), "Value"]}
                contentStyle={{
                  borderRadius: 14,
                  border: "1px solid #e2e8f0",
                  fontSize: 12,
                  boxShadow: "0 10px 30px rgba(2,44,34,0.12)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="pointer-events-none absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                {focused ? focused : "Total"}
              </p>
              <p className="font-display text-lg font-extrabold text-slate-900">
                {formatNaira(
                  focused
                    ? allocation.find((a) => a.category === focused)?.value ?? 0
                    : total,
                  true
                )}
              </p>
              {focused && (
                <p className="text-xs font-semibold text-emerald-700">
                  {allocation.find((a) => a.category === focused)?.percent.toFixed(1)}%
                </p>
              )}
            </div>
          </div>
        </div>

        <ul className="space-y-1.5">
          {allocation.map((a) => {
            const active = focused === a.category;
            return (
              <li key={a.category}>
                <button
                  onClick={() =>
                    setFocused((f) => (f === a.category ? null : a.category))
                  }
                  className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left transition ${
                    active
                      ? "border-emerald-300 bg-emerald-50/60"
                      : "border-transparent hover:bg-slate-50"
                  }`}
                >
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: a.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800">
                      {a.category}
                    </p>
                    <p className="truncate text-[11px] text-slate-400">
                      {CATEGORY_META[a.category].tagline}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">
                      {a.percent.toFixed(1)}%
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {formatNaira(a.value, true)}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </motion.section>
  );
}

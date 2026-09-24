import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  MoonStars,
  SealCheck,
  CaretDown,
  Drop,
  Sparkle,
  Target,
  Scales,
  UserCircle,
} from "@phosphor-icons/react";
import {
  BRAND_NAME,
  SHARIAH_BOARD,
  getIslamicGreeting,
  getTodayLine,
} from "../data/halalDashboardData";
import type { AppView, UserProfile } from "../types";

export default function HeaderNav({
  profile,
  view,
  onNavigate,
  onOpenHijri,
}: {
  profile: UserProfile;
  view: AppView;
  onNavigate: (v: AppView) => void;
  onOpenHijri: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const items: { id: AppView; label: string; icon?: React.ReactNode }[] = [
    { id: "dashboard", label: "Portfolio Dashboard" },
    { id: "goals", label: "Halal Goals", icon: <Target size={13} weight="bold" className="relative" /> },
    { id: "zakat", label: "Zakat Calculator" },
    {
      id: "purification",
      label: "Purification Tracker",
      icon: <Drop size={13} weight="bold" className="relative" />,
    },
    {
      id: "governance",
      label: "Shariah Governance",
      icon: <Scales size={13} weight="bold" className="relative" />,
    },
    {
      id: "profile",
      label: "Profile",
      icon: <UserCircle size={13} weight="bold" className="relative" />,
    },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-900/10 bg-[#F8FAFC]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="relative grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#065F46] to-[#10B981] text-white shadow-lg shadow-emerald-900/20">
            <Sparkle size={20} weight="fill" />
            <span className="absolute -bottom-1 -right-1 grid h-4 w-4 place-items-center rounded-full bg-[#D97706] text-[9px] font-black text-white ring-2 ring-[#F8FAFC]">
              ح
            </span>
          </div>
          <div className="leading-tight">
            <p className="font-display text-[15px] font-extrabold tracking-tight text-[#0F172A]">
              {BRAND_NAME}
            </p>
            <p className="hidden text-[11px] font-medium text-emerald-700/70 sm:block">
              Certified Shariah Wealth
            </p>
          </div>
        </div>

        {/* Dynamic greeting + Hijri / Gregorian date */}
        <button
          onClick={onOpenHijri}
          title="Open Hijri & Lunar Hub"
          className="hidden shrink-0 items-center gap-2.5 rounded-2xl border border-emerald-100 bg-white/70 px-4 py-1.5 text-left transition hover:border-emerald-300 hover:bg-emerald-50/60 active:scale-[0.98] lg:flex"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-[#065F46] to-[#10B981] text-white shadow-sm">
            <MoonStars size={15} weight="fill" />
          </span>
          <div className="leading-tight">
            <p className="text-[11px] font-bold text-[#0F172A]">
              {getIslamicGreeting()}
            </p>
            <p className="text-[10px] text-slate-500">
              {getTodayLine()}
            </p>
          </div>
        </button>

        <div className="hidden items-center gap-1 rounded-2xl border border-slate-200/80 bg-white/70 p-1 md:flex">
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`relative rounded-xl px-4 py-2 text-xs font-bold transition ${
                view === item.id
                  ? "text-white"
                  : "text-slate-500 hover:bg-slate-100 hover:text-slate-800"
              }`}
            >
              {view === item.id && (
                <motion.span
                  layoutId="nav-pill"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#065F46] to-[#10B981] shadow-md shadow-emerald-900/20"
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {item.icon}
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={() => onNavigate("governance")}
            className="inline-flex items-center gap-1.5 rounded-full border border-emerald-600/20 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:border-emerald-600/40 hover:bg-emerald-100 active:scale-95"
            title="Open Shariah Governance"
          >
            <SealCheck size={15} weight="fill" className="text-[#065F46]" />
            {SHARIAH_BOARD}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-xl border border-slate-200 bg-white text-slate-600 transition active:scale-95 hover:border-emerald-300 hover:text-emerald-700"
            >
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#D97706] ring-2 ring-white" />
            </button>
            {notifOpen && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
              >
                <NotifRow title="FGN Sukuk profit share credited" meta="2h ago" />
                <NotifRow title="Gold up +3.2% today" meta="5h ago" />
                <NotifRow title="Zakat due in 18 days" meta="1d ago" />
              </motion.div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 transition active:scale-95 hover:border-emerald-300"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-[#065F46] to-[#0F766E] text-xs font-bold text-white">
                {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </span>
              <span className="hidden text-sm font-semibold text-slate-700 sm:block">
                {profile.greetingName}
              </span>
              <CaretDown size={14} className="text-slate-400" />
            </button>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
              >
                <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-medium text-emerald-800">
                  <MoonStars size={15} className="text-[#065F46]" />
                  {getTodayLine()}
                </div>
                <p className="px-3 py-2 text-xs text-slate-500">
                  Barakah account · Tier: Growth
                </p>
                <button
                  onClick={() => onNavigate("profile")}
                  className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Account settings
                </button>
                <button className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50">
                  Sign out
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function NotifRow({ title, meta }: { title: string; meta: string }) {
  return (
    <div className="flex items-start gap-2 rounded-xl px-3 py-2 hover:bg-slate-50">
      <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#10B981]" />
      <div>
        <p className="text-sm font-medium text-slate-700">{title}</p>
        <p className="text-[11px] text-slate-400">{meta}</p>
      </div>
    </div>
  );
}
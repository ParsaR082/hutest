"use client";

import { useMemo, useState } from "react";

const MONTHS = ["فروردین","اردیبهشت","خرداد","تیر","مرداد","شهریور","مهر","آبان","آذر","دی","بهمن","اسفند"];
const WEEKDAYS = ["شنبه","یکشنبه","دوشنبه","سه‌شنبه","چهارشنبه","پنجشنبه","جمعه"];

function g2j(gy: number, gm: number, gd: number): [number, number, number] {
  const gdm = [0,31,59,90,120,151,181,212,243,273,304,334];
  let jy = gy <= 1600 ? 0 : 979;
  gy -= gy <= 1600 ? 621 : 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd + gdm[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) jy += Math.floor((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  const jm = days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
}

function j2g(jy: number, jm: number, jd: number): string {
  let gy = jy <= 979 ? 621 : 1600;
  jy -= jy <= 979 ? 0 : 979;
  let days = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor(((jy % 33) + 3) / 4) + 78 + jd + (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  gy += Math.floor((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  let gd = days + 1;
  const salA = [0,31,((gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0) ? 29 : 28,31,30,31,30,31,31,30,31,30,31];
  let gm = 1;
  while (gm <= 12 && gd > salA[gm]) {
    gd -= salA[gm];
    gm++;
  }
  return `${gy}-${String(gm).padStart(2,"0")}-${String(gd).padStart(2,"0")}`;
}

function todayJalali() {
  const d = new Date();
  return g2j(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

function parseGregorian(value: string): [number, number, number] | null {
  const parts = value.split("-").map(Number);
  return parts.length === 3 && parts.every(Number.isFinite) ? [parts[0], parts[1], parts[2]] : null;
}

function daysInMonth(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  const next = j2g(year + 1, 1, 1);
  const current = j2g(year, 1, 1);
  return Math.round((new Date(next).getTime() - new Date(current).getTime()) / 86400000) - 336;
}

function toPersianDigits(value: number) {
  return String(value).replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[Number(d)]);
}

export function JalaliDatePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const initial = parseGregorian(value) ?? (() => {
    const [jy, jm, jd] = todayJalali();
    return j2g(jy, jm, jd).split("-").map(Number) as [number, number, number];
  })();
  const [jy0, jm0] = g2j(initial[0], initial[1], initial[2]);
  const [year, setYear] = useState(jy0);
  const [month, setMonth] = useState(jm0);
  const selected = value ? parseGregorian(value) : null;
  const selectedJ = selected ? g2j(selected[0], selected[1], selected[2]) : null;

  const cells = useMemo(() => {
    const firstGregorian = j2g(year, month, 1);
    const firstWeekday = new Date(firstGregorian).getDay();
    const offset = (firstWeekday + 1) % 7;
    const total = month === 12 ? 30 : month <= 6 ? 31 : 30;
    return Array.from({ length: 42 }, (_, i) => {
      const day = i - offset + 1;
      return day >= 1 && day <= total ? day : null;
    });
  }, [year, month]);

  const choose = (day: number) => onChange(j2g(year, month, day));
  const previous = () => {
    if (month === 1) { setMonth(12); setYear((v) => v - 1); }
    else setMonth((v) => v - 1);
  };
  const next = () => {
    if (month === 12) { setMonth(1); setYear((v) => v + 1); }
    else setMonth((v) => v + 1);
  };

  return (
    <div className="mt-2 rounded-2xl border border-gray-200 bg-white p-4" dir="rtl">
      <div className="mb-4 flex items-center justify-between">
        <button type="button" onClick={next} className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100" aria-label="ماه بعد">←</button>
        <div className="text-center font-medium text-gray-900">{MONTHS[month - 1]} {toPersianDigits(year)}</div>
        <button type="button" onClick={previous} className="rounded-lg px-3 py-2 text-gray-500 hover:bg-gray-100" aria-label="ماه قبل">→</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-gray-400">
        {WEEKDAYS.map((day) => <span key={day} className="py-1">{day}</span>)}
        {cells.map((day, index) => {
          const active = day !== null && selectedJ?.[0] === year && selectedJ?.[1] === month && selectedJ?.[2] === day;
          return day === null ? <span key={index} /> : (
            <button key={day} type="button" onClick={() => choose(day)} className={`rounded-lg py-2 text-sm transition ${active ? "bg-[#F97316] text-white" : "text-gray-700 hover:bg-orange-50"}`}>
              {toPersianDigits(day)}
            </button>
          );
        })}
      </div>
      {value && selectedJ && <p className="mt-3 text-center text-xs text-gray-400">تاریخ انتخاب‌شده: {toPersianDigits(selectedJ[2])} {MONTHS[selectedJ[1]-1]} {toPersianDigits(selectedJ[0])}</p>}
    </div>
  );
}

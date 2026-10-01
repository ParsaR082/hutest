"use client";

import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  toGregorian,
  toJalaali,
  isValidJalaaliDate,
} from "jalaali-js";

interface JalaliDatePickerProps {
  value: string;
  onChange: (gregorianDate: string) => void;
  required?: boolean;
}

const MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const WEEKDAYS = [
  "شنبه",
  "یکشنبه",
  "دوشنبه",
  "سه‌شنبه",
  "چهارشنبه",
  "پنجشنبه",
  "جمعه",
];

function toPersianNumber(value: number | string) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[Number(digit)]);
}

function formatJalaliDate(year: number, month: number, day: number) {
  return `${toPersianNumber(year)}/${toPersianNumber(month)}/${toPersianNumber(day)}`;
}

function gregorianToJalaliDate(value: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  if (!year || !month || !day) return null;

  return toJalaali(year, month, day);
}

function jalaliToGregorianString(
  year: number,
  month: number,
  day: number
) {
  const gregorian = toGregorian(year, month, day);

  return [
    gregorian.gy,
    String(gregorian.gm).padStart(2, "0"),
    String(gregorian.gd).padStart(2, "0"),
  ].join("-");
}

function getDaysInMonth(year: number, month: number) {
  if (month <= 6) return 31;
  if (month <= 11) return 30;

  return isValidJalaaliDate(year, 12, 30) ? 30 : 29;
}

export function JalaliDatePicker({
  value,
  onChange,
  required = false,
}: JalaliDatePickerProps) {
  const selectedDate = useMemo(
    () => gregorianToJalaliDate(value),
    [value]
  );

  const today = useMemo(() => {
    const now = new Date();

    return toJalaali(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate()
    );
  }, []);

  const [viewYear, setViewYear] = useState(
    selectedDate?.jy ?? today.jy
  );

  const [viewMonth, setViewMonth] = useState(
    selectedDate?.jm ?? today.jm
  );

  const [open, setOpen] = useState(false);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);

  const firstDayGregorian = toGregorian(viewYear, viewMonth, 1);

  const firstDay = new Date(
    firstDayGregorian.gy,
    firstDayGregorian.gm - 1,
    firstDayGregorian.gd
  );

  // JavaScript: Sunday = 0
  // Persian calendar: Saturday = 0
  const startingDay = (firstDay.getDay() + 1) % 7;

  const days = Array.from(
    { length: startingDay + daysInMonth },
    (_, index) => {
      if (index < startingDay) return null;

      return index - startingDay + 1;
    }
  );

  const selectDate = (day: number) => {
    const gregorian = jalaliToGregorianString(
      viewYear,
      viewMonth,
      day
    );

    onChange(gregorian);
    setOpen(false);
  };

  const goToPreviousMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((year) => year - 1);
    } else {
      setViewMonth((month) => month - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((year) => year + 1);
    } else {
      setViewMonth((month) => month + 1);
    }
  };

  const isSelected = (day: number) =>
    selectedDate?.jy === viewYear &&
    selectedDate?.jm === viewMonth &&
    selectedDate?.jd === day;

  const isToday = (day: number) =>
    today.jy === viewYear &&
    today.jm === viewMonth &&
    today.jd === day;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-center gap-3 border-b border-gray-300 bg-transparent py-3 text-right outline-none transition-colors hover:border-gray-400 focus:border-[#F97316]"
        aria-label="انتخاب تاریخ"
      >
        <Calendar className="h-4 w-4 shrink-0 text-[#F97316]" />

        <span
          className={
            value
              ? "text-gray-900"
              : "text-gray-400"
          }
        >
          {selectedDate
            ? formatJalaliDate(
                selectedDate.jy,
                selectedDate.jm,
                selectedDate.jd
              )
            : "انتخاب تاریخ"}
        </span>
      </button>

      {required && !value && (
        <input
          tabIndex={-1}
          required
          value=""
          onChange={() => {}}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          aria-hidden="true"
        />
      )}

      {open && (
        <div className="absolute start-0 top-full z-50 mt-2 w-full min-w-[290px] rounded-xl border border-gray-200 bg-white p-4 shadow-[0_15px_40px_rgba(0,0,0,0.12)]">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <button
              type="button"
              onClick={goToNextMonth}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#F97316]"
              aria-label="ماه بعد"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

            <div className="text-sm font-semibold text-gray-900">
              {MONTHS[viewMonth - 1]}{" "}
              {toPersianNumber(viewYear)}
            </div>

            <button
              type="button"
              onClick={goToPreviousMonth}
              className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-[#F97316]"
              aria-label="ماه قبل"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Weekdays */}
          <div className="mb-2 grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((day) => (
              <span
                key={day}
                className="py-1 text-[11px] font-medium text-gray-400"
              >
                {day.slice(0, 1)}
              </span>
            ))}
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (day === null) {
                return <span key={`empty-${index}`} />;
              }

              const selected = isSelected(day);
              const currentDay = isToday(day);

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => selectDate(day)}
                  className={`flex aspect-square items-center justify-center rounded-lg text-sm transition-colors ${
                    selected
                      ? "bg-[#F97316] text-white"
                      : currentDay
                        ? "border border-[#F97316] text-[#F97316]"
                        : "text-gray-700 hover:bg-orange-50 hover:text-[#F97316]"
                  }`}
                >
                  {toPersianNumber(day)}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
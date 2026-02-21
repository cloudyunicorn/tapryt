"use client";

import { useState } from "react";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{
    years: number;
    months: number;
    days: number;
    totalDays: number;
    nextBirthday: number;
  } | null>(null);

  const calculate = () => {
    if (!birthDate) return;

    const [year, month, day] = birthDate.split('-').map(Number);
    const birth = new Date(year, month - 1, day);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      // Get the number of days in the previous month
      const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Use Math.round to avoid issues with daylight saving time transitions
    const totalDays = Math.round((today.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));

    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday < today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysUntilBirthday = Math.round((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, totalDays, nextBirthday: daysUntilBirthday });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Age Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Date of Birth
          </label>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-rose-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-rose-600 px-6 py-3 font-medium text-white transition-colors hover:bg-rose-700"
        >
          Calculate Age
        </button>

        {result && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-rose-50 p-4 text-center dark:bg-rose-900/30">
              <p className="text-4xl font-bold text-rose-900 dark:text-rose-50">{result.years}</p>
              <p className="text-rose-600 dark:text-rose-400">years</p>
            </div>
            <div className="rounded-xl bg-rose-50 p-4 text-center dark:bg-rose-900/30">
              <p className="text-4xl font-bold text-rose-900 dark:text-rose-50">{result.months}</p>
              <p className="text-rose-600 dark:text-rose-400">months</p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4 text-center dark:bg-zinc-800">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.days}</p>
              <p className="text-zinc-600 dark:text-zinc-400">days</p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4 text-center dark:bg-zinc-800">
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.totalDays.toLocaleString()}</p>
              <p className="text-zinc-600 dark:text-zinc-400">total days</p>
            </div>
            <div className="col-span-2 rounded-xl bg-rose-50 p-4 text-center dark:bg-rose-900/30">
              <p className="text-sm text-rose-600 dark:text-rose-400">Days until next birthday</p>
              <p className="text-2xl font-bold text-rose-900 dark:text-rose-50">{result.nextBirthday}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

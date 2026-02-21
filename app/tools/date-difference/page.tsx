"use client";

import { useState } from "react";

export default function DateDifference() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState<{
    days: number;
    weeks: number;
    months: number;
    years: number;
    totalDays: number;
  } | null>(null);

  const calculate = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    const years = Math.floor(totalDays / 365);
    const remainingAfterYears = totalDays % 365;
    const months = Math.floor(remainingAfterYears / 30);
    const remainingAfterMonths = remainingAfterYears % 30;
    const weeks = Math.floor(remainingAfterMonths / 7);
    const days = remainingAfterMonths % 7;

    setResult({
      days,
      weeks,
      months,
      years,
      totalDays: Math.abs(totalDays),
    });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Date Difference Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-purple-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-purple-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition-colors hover:bg-purple-700"
        >
          Calculate Difference
        </button>

        {result && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-purple-50 p-4 text-center dark:bg-purple-900/30">
              <p className="text-sm text-purple-600 dark:text-purple-400">Total Days</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-50">
                {result.totalDays}
              </p>
            </div>
            <div className="rounded-xl bg-purple-50 p-4 text-center dark:bg-purple-900/30">
              <p className="text-sm text-purple-600 dark:text-purple-400">Total Weeks</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-50">
                {(result.totalDays / 7).toFixed(1)}
              </p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4 text-center dark:bg-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Years</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.years}</p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4 text-center dark:bg-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Months</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.months}</p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4 text-center dark:bg-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Weeks</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.weeks}</p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4 text-center dark:bg-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Days</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.days}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

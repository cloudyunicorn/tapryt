"use client";

import { useState } from "react";

export default function SIPCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState("");
  const [expectedReturn, setExpectedReturn] = useState("");
  const [years, setYears] = useState("");
  const [result, setResult] = useState<{
    totalInvested: number;
    estimatedReturns: number;
    totalValue: number;
  } | null>(null);

  const calculate = () => {
    const pmt = parseFloat(monthlyInvestment);
    const rate = parseFloat(expectedReturn) / 100 / 12;
    const months = parseFloat(years) * 12;

    if (isNaN(pmt) || isNaN(rate) || isNaN(months)) return;

    let futureValue = 0;
    if (rate === 0) {
      futureValue = pmt * months;
    } else {
      futureValue = pmt * ((Math.pow(1 + rate, months) - 1) / rate) * (1 + rate);
    }

    const totalInvested = pmt * months;
    const estimatedReturns = futureValue - totalInvested;

    setResult({
      totalInvested: Math.round(totalInvested),
      estimatedReturns: Math.round(estimatedReturns),
      totalValue: Math.round(futureValue),
    });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        SIP Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Monthly Investment
            </label>
            <input
              type="number"
              value={monthlyInvestment}
              onChange={(e) => setMonthlyInvestment(e.target.value)}
              placeholder="5000"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-teal-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Expected Return (% p.a.)
            </label>
            <input
              type="number"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              placeholder="12"
              step="0.1"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-teal-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Time Period (Years)
            </label>
            <input
              type="number"
              value={years}
              onChange={(e) => setYears(e.target.value)}
              placeholder="10"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-teal-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-teal-50 p-6 text-center dark:bg-teal-900/30">
              <p className="text-sm text-teal-600 dark:text-teal-400">Total Value</p>
              <p className="text-3xl font-bold text-teal-900 dark:text-teal-50">
                {result.totalValue.toLocaleString()}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Amount Invested</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                  {result.totalInvested.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Est. Returns</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  +{result.estimatedReturns.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

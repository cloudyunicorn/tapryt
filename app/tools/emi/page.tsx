"use client";

import { useState } from "react";

export default function EMICalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [tenureType, setTenureType] = useState<"months" | "years">("months");
  const [result, setResult] = useState<{
    emi: number;
    totalInterest: number;
    totalPayment: number;
    principal: number;
  } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 12 / 100;
    let n = parseFloat(tenure);
    
    if (isNaN(p) || isNaN(r) || isNaN(n) || p <= 0 || r <= 0 || n <= 0) return;
    
    if (tenureType === "years") {
      n = n * 12;
    }

    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - p;

    setResult({
      emi: Math.round(emi * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPayment: Math.round(totalPayment * 100) / 100,
      principal: p,
    });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        EMI Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Principal Amount
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="100000"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Interest Rate (% p.a.)
            </label>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="8.5"
              step="0.1"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Tenure
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                placeholder="24"
                className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
              <select
                value={tenureType}
                onChange={(e) => setTenureType(e.target.value as "months" | "years")}
                className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-3 text-zinc-900 focus:border-indigo-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-indigo-600 px-6 py-3 font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Calculate EMI
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-indigo-50 p-6 text-center dark:bg-indigo-900/30">
              <p className="text-sm text-indigo-600 dark:text-indigo-400">Monthly EMI</p>
              <p className="text-3xl font-bold text-indigo-900 dark:text-indigo-50">
                {result.emi.toLocaleString()}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Principal</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {result.principal.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Interest</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {result.totalInterest.toLocaleString()}
                </p>
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Payment</p>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {result.totalPayment.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

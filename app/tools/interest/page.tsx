"use client";

import { useState } from "react";

type InterestType = "simple" | "compound";

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [years, setYears] = useState("");
  const [type, setType] = useState<InterestType>("simple");
  const [compounding, setCompounding] = useState("12");
  const [result, setResult] = useState<{
    interest: number;
    total: number;
  } | null>(null);

  const calculate = () => {
    const p = parseFloat(principal);
    const r = parseFloat(rate) / 100;
    const t = parseFloat(years);

    if (isNaN(p) || isNaN(r) || isNaN(t)) return;

    let interest = 0;

    if (type === "simple") {
      interest = p * r * t;
    } else {
      const n = parseInt(compounding);
      interest = p * Math.pow(1 + r / n, n * t) - p;
    }

    setResult({
      interest: Math.round(interest * 100) / 100,
      total: Math.round((p + interest) * 100) / 100,
    });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Interest Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex gap-2">
          {(["simple", "compound"] as InterestType[]).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 rounded-lg px-4 py-2 font-medium capitalize transition-colors ${
                type === t
                  ? "bg-amber-600 text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {t} Interest
            </button>
          ))}
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Principal Amount
            </label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="10000"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-amber-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
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
              placeholder="5"
              step="0.1"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-amber-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
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
              placeholder="5"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-amber-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
        </div>

        {type === "compound" && (
          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Compounding Frequency
            </label>
            <select
              value={compounding}
              onChange={(e) => setCompounding(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-amber-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="1">Annually (1x/year)</option>
              <option value="2">Semi-annually (2x/year)</option>
              <option value="4">Quarterly (4x/year)</option>
              <option value="12">Monthly (12x/year)</option>
              <option value="365">Daily (365x/year)</option>
            </select>
          </div>
        )}

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-amber-600 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-700"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl bg-amber-50 p-6 text-center dark:bg-amber-900/30">
              <p className="text-sm text-amber-600 dark:text-amber-400">Interest Earned</p>
              <p className="text-2xl font-bold text-amber-900 dark:text-amber-50">
                {result.interest.toLocaleString()}
              </p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-6 text-center dark:bg-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total Amount</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                {result.total.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

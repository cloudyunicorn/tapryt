"use client";

import { useState } from "react";

export default function TipCalculator() {
  const [bill, setBill] = useState("");
  const [tipPercent, setTipPercent] = useState("15");
  const [people, setPeople] = useState("1");
  const [result, setResult] = useState<{
    tipAmount: number;
    total: number;
    perPerson: number;
  } | null>(null);

  const calculate = () => {
    const billAmount = parseFloat(bill);
    const tip = parseFloat(tipPercent);
    const numPeople = parseInt(people);

    if (isNaN(billAmount) || isNaN(tip) || isNaN(numPeople) || billAmount <= 0) return;

    const tipAmount = (billAmount * tip) / 100;
    const total = billAmount + tipAmount;
    const perPerson = total / numPeople;

    setResult({
      tipAmount: Math.round(tipAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
      perPerson: Math.round(perPerson * 100) / 100,
    });
  };

  const presets = [10, 15, 18, 20, 25];

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Tip Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Bill Amount
          </label>
          <input
            type="number"
            value={bill}
            onChange={(e) => setBill(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-lime-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Tip Percentage
          </label>
          <div className="mb-3 flex gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setTipPercent(p.toString())}
                className={`flex-1 rounded-lg py-2 font-medium transition-colors ${
                  tipPercent === p.toString()
                    ? "bg-lime-600 text-white"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {p}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min="0"
            max="50"
            value={tipPercent}
            onChange={(e) => setTipPercent(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Number of People
          </label>
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min="1"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-lime-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-lime-600 px-6 py-3 font-medium text-white transition-colors hover:bg-lime-700"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-lime-50 p-4 text-center dark:bg-lime-900/30">
              <p className="text-sm text-lime-600 dark:text-lime-400">Tip Amount</p>
              <p className="text-2xl font-bold text-lime-900 dark:text-lime-50">{result.tipAmount}</p>
            </div>
            <div className="rounded-xl bg-zinc-100 p-4 text-center dark:bg-zinc-800">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Total</p>
              <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{result.total}</p>
            </div>
            <div className="rounded-xl bg-lime-50 p-4 text-center dark:bg-lime-900/30">
              <p className="text-sm text-lime-600 dark:text-lime-400">Per Person</p>
              <p className="text-2xl font-bold text-lime-900 dark:text-lime-50">{result.perPerson}</p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

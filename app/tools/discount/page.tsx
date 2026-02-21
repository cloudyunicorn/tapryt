"use client";

import { useState } from "react";

export default function DiscountCalculator() {
  const [originalPrice, setOriginalPrice] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [taxPercent, setTaxPercent] = useState("0");
  const [result, setResult] = useState<{
    discountAmount: number;
    finalPrice: number;
    taxAmount: number;
    total: number;
  } | null>(null);

  const calculate = () => {
    const price = parseFloat(originalPrice);
    const discount = parseFloat(discountPercent);
    const tax = parseFloat(taxPercent);

    if (isNaN(price) || isNaN(discount)) return;

    const discountAmount = (price * discount) / 100;
    const finalPrice = price - discountAmount;
    const taxAmount = (finalPrice * tax) / 100;
    const total = finalPrice + taxAmount;

    setResult({
      discountAmount: Math.round(discountAmount * 100) / 100,
      finalPrice: Math.round(finalPrice * 100) / 100,
      taxAmount: Math.round(taxAmount * 100) / 100,
      total: Math.round(total * 100) / 100,
    });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Discount Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Original Price
            </label>
            <input
              type="number"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              placeholder="100"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-green-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Discount %
            </label>
            <input
              type="number"
              value={discountPercent}
              onChange={(e) => setDiscountPercent(e.target.value)}
              placeholder="20"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-green-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Tax % (optional)
            </label>
            <input
              type="number"
              value={taxPercent}
              onChange={(e) => setTaxPercent(e.target.value)}
              placeholder="0"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-green-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-green-600 px-6 py-3 font-medium text-white transition-colors hover:bg-green-700"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="flex justify-between rounded-lg bg-red-50 p-4 dark:bg-red-900/30">
              <span className="text-red-700 dark:text-red-300">Discount Amount</span>
              <span className="font-bold text-red-800 dark:text-red-200">-{result.discountAmount}</span>
            </div>
            <div className="flex justify-between rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
              <span className="text-zinc-600 dark:text-zinc-400">Price After Discount</span>
              <span className="font-bold text-zinc-900 dark:text-zinc-50">{result.finalPrice}</span>
            </div>
            {result.taxAmount > 0 && (
              <div className="flex justify-between rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
                <span className="text-zinc-600 dark:text-zinc-400">Tax Amount</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-50">+{result.taxAmount}</span>
              </div>
            )}
            <div className="flex justify-between rounded-lg bg-green-50 p-4 dark:bg-green-900/30">
              <span className="text-green-700 dark:text-green-300">Final Price</span>
              <span className="text-2xl font-bold text-green-800 dark:text-green-200">{result.total}</span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

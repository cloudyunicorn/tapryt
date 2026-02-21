"use client";

import { useState } from "react";

type CalculationType = "percentageOf" | "percentageChange" | "whatIsXOfY" | "increaseDecrease";

export default function PercentageCalculator() {
  const [calcType, setCalcType] = useState<CalculationType>("percentageOf");
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState<string>("");

  const calculate = () => {
    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    if (isNaN(n1) || isNaN(n2)) return "";

    let res = 0;
    switch (calcType) {
      case "percentageOf":
        res = (n2 / 100) * n1;
        break;
      case "percentageChange":
        res = ((n2 - n1) / n1) * 100;
        break;
      case "whatIsXOfY":
        res = (n1 / n2) * 100;
        break;
      case "increaseDecrease":
        res = ((n2 - n1) / n1) * 100;
        break;
    }
    return res.toFixed(2);
  };

  const handleCalculate = () => {
    setResult(calculate());
  };

  const getLabel = () => {
    switch (calcType) {
      case "percentageOf":
        return { first: "Percentage", second: "Number", question: "X% of Y" };
      case "percentageChange":
        return { first: "Old Value", second: "New Value", question: "Change from X to Y" };
      case "whatIsXOfY":
        return { first: "X", second: "Y", question: "X is what % of Y" };
      case "increaseDecrease":
        return { first: "Original", second: "New", question: "Increase/Decrease" };
    }
  };

  const labels = getLabel();

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Percentage Calculator
      </h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {([
          { key: "percentageOf", label: "X% of Y" },
          { key: "percentageChange", label: "Change %" },
          { key: "whatIsXOfY", label: "X is what % of Y" },
          { key: "increaseDecrease", label: "Increase/Decrease" },
        ] as { key: CalculationType; label: string }[]).map((item) => (
          <button
            key={item.key}
            onClick={() => {
              setCalcType(item.key);
              setNum1("");
              setNum2("");
              setResult("");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              calcType === item.key
                ? "bg-blue-600 text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 text-center">
          <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
            {labels.question}
          </p>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {labels.first}
            </label>
            <input
              type="number"
              value={num1}
              onChange={(e) => setNum1(e.target.value)}
              placeholder="Enter value"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {labels.second}
            </label>
            <input
              type="number"
              value={num2}
              onChange={(e) => setNum2(e.target.value)}
              placeholder="Enter value"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="w-full rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-6 rounded-xl bg-blue-50 p-6 text-center dark:bg-blue-900/30">
            <p className="text-sm text-blue-600 dark:text-blue-400">Result</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-50">
              {result}%
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

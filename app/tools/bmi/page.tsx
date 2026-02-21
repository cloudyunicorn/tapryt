"use client";

import { useState } from "react";

export default function BMICalculator() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [result, setResult] = useState<{ bmi: number; category: string; color: string } | null>(null);

  const calculate = () => {
    let heightM: number;
    let weightKg: number;

    if (unit === "metric") {
      heightM = parseFloat(height) / 100;
      weightKg = parseFloat(weight);
    } else {
      heightM = parseFloat(height) * 0.0254;
      weightKg = parseFloat(weight) * 0.453592;
    }

    if (isNaN(heightM) || isNaN(weightKg) || heightM <= 0 || weightKg <= 0) return;

    const bmi = weightKg / (heightM * heightM);
    let category = "";
    let color = "";

    if (bmi < 18.5) {
      category = "Underweight";
      color = "text-blue-500";
    } else if (bmi < 25) {
      category = "Normal weight";
      color = "text-green-500";
    } else if (bmi < 30) {
      category = "Overweight";
      color = "text-yellow-500";
    } else {
      category = "Obese";
      color = "text-red-500";
    }

    setResult({ bmi: Math.round(bmi * 10) / 10, category, color });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        BMI Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 flex gap-2">
          {(["metric", "imperial"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`flex-1 rounded-lg px-4 py-2 font-medium capitalize transition-colors ${
                unit === u
                  ? "bg-emerald-600 text-white"
                  : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
              }`}
            >
              {u === "metric" ? "Metric (kg/cm)" : "Imperial (lb/in)"}
            </button>
          ))}
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {unit === "metric" ? "Height (cm)" : "Height (inches)"}
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder={unit === "metric" ? "175" : "69"}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-emerald-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              {unit === "metric" ? "Weight (kg)" : "Weight (lb)"}
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder={unit === "metric" ? "70" : "154"}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-emerald-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-emerald-600 px-6 py-3 font-medium text-white transition-colors hover:bg-emerald-700"
        >
          Calculate BMI
        </button>

        {result && (
          <div className="mt-6">
            <div className="rounded-xl bg-emerald-50 p-6 text-center dark:bg-emerald-900/30">
              <p className="text-sm text-emerald-600 dark:text-emerald-400">Your BMI</p>
              <p className="text-4xl font-bold text-emerald-900 dark:text-emerald-50">{result.bmi}</p>
              <p className={`mt-2 text-lg font-medium ${result.color}`}>{result.category}</p>
            </div>

            <div className="mt-4 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
              <p className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">BMI Categories:</p>
              <div className="space-y-1 text-sm text-zinc-500 dark:text-zinc-400">
                <p><span className="text-blue-500">Underweight:</span> less than 18.5</p>
                <p><span className="text-green-500">Normal:</span> 18.5 - 24.9</p>
                <p><span className="text-yellow-500">Overweight:</span> 25 - 29.9</p>
                <p><span className="text-red-500">Obese:</span> 30 or greater</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

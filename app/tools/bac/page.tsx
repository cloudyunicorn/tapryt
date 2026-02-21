"use client";

import { useState } from "react";

interface Drink {
  id: number;
  type: string;
  amount: number;
  alcoholPercent: number;
}

interface BACResult {
  bac: number;
  safeToDrive: boolean;
  timeToZero: number;
  effects: string;
}

const drinkTypes = [
  { name: "Beer (12 oz)", amount: 12, alcoholPercent: 5 },
  { name: "Wine (5 oz)", amount: 5, alcoholPercent: 12 },
  { name: "Shot (1.5 oz)", amount: 1.5, alcoholPercent: 40 },
  { name: "Malt Liquor (12 oz)", amount: 12, alcoholPercent: 7 },
  { name: "Cooler (12 oz)", amount: 12, alcoholPercent: 5 },
];

const bacLevels = [
  { limit: 0.02, effects: "Some loss of judgment, relaxed feeling" },
  { limit: 0.05, effects: "Exaggerated behavior, loss of small-muscle control" },
  { limit: 0.08, effects: "Impaired coordination, legally intoxicated in most states" },
  { limit: 0.10, effects: "Slurred speech, blurred vision, slowed reaction time" },
  { limit: 0.15, effects: "Major loss of balance, vomiting possible" },
  { limit: 0.20, effects: "Confusion, nausea, need for assistance to walk" },
  { limit: 0.30, effects: "Unconsciousness, potential coma" },
  { limit: 0.40, effects: "Potential respiratory arrest, possible death" },
];

export default function BACCalculator() {
  const [weight, setWeight] = useState<string>("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [drinks, setDrinks] = useState<Drink[]>([
    { id: 1, type: "Beer (12 oz)", amount: 12, alcoholPercent: 5 },
  ]);
  const [hours, setHours] = useState<string>("1");
  const [result, setResult] = useState<BACResult | null>(null);

  const addDrink = () => {
    const newId = drinks.length > 0 ? Math.max(...drinks.map((d) => d.id)) + 1 : 1;
    setDrinks([...drinks, { ...drinks[0], id: newId }]);
  };

  const removeDrink = (id: number) => {
    setDrinks(drinks.filter((d) => d.id !== id));
  };

  const updateDrink = (id: number, field: keyof Drink, value: string | number) => {
    setDrinks(
      drinks.map((d) => {
        if (d.id === id) {
          const updated = { ...d, [field]: value };
          if (field === "type") {
            const drinkType = drinkTypes.find((dt) => dt.name === value);
            if (drinkType) {
              updated.amount = drinkType.amount;
              updated.alcoholPercent = drinkType.alcoholPercent;
            }
          }
          return updated;
        }
        return d;
      })
    );
  };

  const calculate = () => {
    const weightNum = parseFloat(weight);
    const hoursNum = parseFloat(hours);

    if (isNaN(weightNum) || weightNum <= 0 || isNaN(hoursNum)) return;

    const totalAlcoholOz = drinks.reduce((sum, drink) => {
      return sum + (drink.amount * drink.alcoholPercent) / 100;
    }, 0);

    const r = gender === "male" ? 0.68 : 0.55;
    const weightLb = weightNum * 2.20462;
    const bacBeforeMetabolism = (totalAlcoholOz * 5.14) / (weightLb * r);
    const metabolismRate = 0.015;
    const bac = Math.max(0, bacBeforeMetabolism - metabolismRate * hoursNum);

    const timeToZero = bac > 0 ? Math.ceil(bac / 0.015) : 0;
    const legalLimit = 0.08;
    const safeToDrive = bac < legalLimit;

    let effects = "";
    for (const level of bacLevels) {
      if (bac <= level.limit) {
        effects = level.effects;
        break;
      }
    }
    if (!effects && bac > 0.40) effects = "Life-threatening, seek immediate medical attention";

    setResult({
      bac: Math.round(bac * 10000) / 10000,
      safeToDrive,
      timeToZero,
      effects: effects || "Unknown effects",
    });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        BAC Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="Enter weight"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Gender
            </label>
            <div className="flex gap-4 pt-3">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={() => setGender("male")}
                  className="h-4 w-4"
                />
                <span className="text-zinc-900 dark:text-zinc-50">Male</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className="h-4 w-4"
                />
                <span className="text-zinc-900 dark:text-zinc-50">Female</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Hours since first drink
          </label>
          <input
            type="number"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Enter hours"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Drinks Consumed
            </label>
            <button
              onClick={addDrink}
              className="text-sm text-amber-600 hover:text-amber-700"
            >
              + Add Drink
            </button>
          </div>
          <div className="space-y-3">
            {drinks.map((drink) => (
              <div key={drink.id} className="flex gap-2 items-center">
                <select
                  value={drink.type}
                  onChange={(e) => updateDrink(drink.id, "type", e.target.value)}
                  className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                >
                  {drinkTypes.map((dt) => (
                    <option key={dt.name} value={dt.name}>
                      {dt.name} ({dt.alcoholPercent}% alcohol)
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeDrink(drink.id)}
                  className="p-2 text-zinc-400 hover:text-red-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-amber-500 px-6 py-3 font-medium text-white transition-colors hover:bg-amber-600"
        >
          Calculate BAC
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className={`rounded-xl p-6 text-center ${result.safeToDrive ? "bg-emerald-100 dark:bg-emerald-900/30" : "bg-red-100 dark:bg-red-900/30"}`}>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Estimated BAC</p>
              <p className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                {result.bac.toFixed(4)}%
              </p>
              <p className={`mt-2 font-medium ${result.safeToDrive ? "text-emerald-600" : "text-red-600"}`}>
                {result.safeToDrive ? "May be safe to drive (depends on local laws)" : "Do NOT drive"}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Time to Zero BAC</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  ~{result.timeToZero} {result.timeToZero === 1 ? "hour" : "hours"}
                </p>
              </div>
              <div className="rounded-xl bg-zinc-100 p-4 dark:bg-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">Expected Effects</p>
                <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                  {result.effects}
                </p>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Disclaimer: This calculator provides an estimate only. Actual BAC varies based on many factors including metabolism, food consumption, medications, and individual differences. Never drink and drive.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";

interface Drink {
  id: string;
  type: string;
  abv: number | string;
  volume: number | string;
  volumeUnit: "ml" | "oz";
  minutesAfterPrevious: number | string;
}

interface BACResult {
  bac: number;
  safeToDrive: boolean;
  hoursToSafe: number;
  hoursToZero: number;
  effects: string;
  safeLimit: number;
}

const countries = [
  { name: "USA (0.08%)", limit: 0.08 },
  { name: "UK - England/Wales (0.08%)", limit: 0.08 },
  { name: "Canada (0.08%)", limit: 0.08 },
  { name: "Australia (0.05%)", limit: 0.05 },
  { name: "UK - Scotland (0.05%)", limit: 0.05 },
  { name: "India (0.03%)", limit: 0.03 },
  { name: "Zero Tolerance (0.00%)", limit: 0.00 },
];

const drinkPresets = [
  { name: "Beer", abv: 5, defaultVolume: 330, defaultUnit: "ml" },
  { name: "Wine", abv: 12, defaultVolume: 150, defaultUnit: "ml" },
  { name: "Vodka", abv: 40, defaultVolume: 44, defaultUnit: "ml" },
  { name: "Whiskey", abv: 40, defaultVolume: 44, defaultUnit: "ml" },
  { name: "Rum", abv: 40, defaultVolume: 44, defaultUnit: "ml" },
  { name: "Tequila", abv: 40, defaultVolume: 44, defaultUnit: "ml" },
  { name: "Custom", abv: 5, defaultVolume: 100, defaultUnit: "ml" },
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
  const generateId = () => Math.random().toString(36).substring(2, 9);

  const [weight, setWeight] = useState<string>("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [country, setCountry] = useState<string>(countries[0].name);
  const [minutesSinceLast, setMinutesSinceLast] = useState<string>("0");

  const [drinks, setDrinks] = useState<Drink[]>([
    {
      id: generateId(),
      type: "Custom",
      abv: "",
      volume: "",
      volumeUnit: "ml",
      minutesAfterPrevious: "",
    },
  ]);
  const [result, setResult] = useState<BACResult | null>(null);

  const addDrink = () => {
    setDrinks([
      ...drinks,
      {
        id: generateId(),
        type: "Custom",
        abv: "",
        volume: "",
        volumeUnit: "ml",
        minutesAfterPrevious: "",
      },
    ]);
  };

  const removeDrink = (id: string) => {
    if (drinks.length === 1) return;
    setDrinks(drinks.filter((d) => d.id !== id));
  };

  const updateDrink = (id: string, field: keyof Drink, value: any) => {
    setDrinks(
      drinks.map((d) => {
        if (d.id !== id) return d;

        if (field === "type") {
          const preset = drinkPresets.find((p) => p.name === value);
          if (preset) {
            return {
              ...d,
              type: value as string,
              abv: preset.abv,
              volume: preset.defaultVolume,
              volumeUnit: preset.defaultUnit as "ml" | "oz",
            };
          }
        }
        return { ...d, [field]: value };
      })
    );
  };

  const calculate = () => {
    const weightNum = parseFloat(weight);
    const minsSinceLastNum = parseFloat(minutesSinceLast || "0");

    if (isNaN(weightNum) || weightNum <= 0) return;

    // Convert weight to grams
    const weightGrams = weightUnit === "kg" ? weightNum * 1000 : weightNum * 453.592;
    const r = gender === "male" ? 0.68 : 0.55;

    let currentBAC = 0;

    for (let i = 0; i < drinks.length; i++) {
      const drink = drinks[i];

      // Metabolism for interval between drinks
      if (i > 0) {
        const hoursPassed = (Number(drink.minutesAfterPrevious) || 0) / 60;
        currentBAC -= hoursPassed * 0.015;
        if (currentBAC < 0) currentBAC = 0;
      }

      // Add BAC contribution of the current drink
      const volumeNum = Number(drink.volume) || 0;
      const abvNum = Number(drink.abv) || 0;
      const volumeMl = drink.volumeUnit === "oz" ? volumeNum * 29.5735 : volumeNum;
      const alcoholGrams = volumeMl * (abvNum / 100) * 0.789;
      const bacContribution = (alcoholGrams / (weightGrams * r)) * 100;
      currentBAC += bacContribution;
    }

    // Apply metabolism for time passed since the LAST drink
    currentBAC -= (minsSinceLastNum / 60) * 0.015;
    if (currentBAC < 0) currentBAC = 0;

    const selectedCountry = countries.find((c) => c.name === country) || countries[0];
    const safeLimit = selectedCountry.limit;

    let hoursToSafe = 0;
    if (currentBAC > safeLimit) {
      hoursToSafe = (currentBAC - safeLimit) / 0.015;
    }

    let hoursToZero = 0;
    if (currentBAC > 0) {
      hoursToZero = currentBAC / 0.015;
    }

    const safeToDrive = currentBAC < safeLimit;

    let effects = "";
    if (currentBAC === 0) {
      effects = "Normal, no impairment";
    } else {
      for (const level of bacLevels) {
        if (currentBAC <= level.limit) {
          effects = level.effects;
          break;
        }
      }
      if (!effects && currentBAC > 0.4) effects = "Life-threatening, seek medical attention";
    }

    setResult({
      bac: Math.max(0, currentBAC),
      safeToDrive,
      hoursToSafe,
      hoursToZero,
      effects: effects || "Unknown effects",
      safeLimit,
    });
  };

  const formatTime = (decimalHours: number) => {
    if (decimalHours <= 0) return "0 mins";
    const h = Math.floor(decimalHours);
    const m = Math.round((decimalHours - h) * 60);
    if (h === 0) return `${m} min${m !== 1 ? "s" : ""}`;
    if (m === 0) return `${h} hour${h !== 1 ? "s" : ""}`;
    return `${h}h ${m}m`;
  };

  return (
    <main className="container mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-4 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Holistic BAC Calculator
      </h1>
      <p className="mb-8 text-zinc-600 dark:text-zinc-400">
        Estimate your Blood Alcohol Content based on a timeline of drinks, and find out when you'll be within safe legal limits for driving based on your country.
      </p>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <h2 className="mb-4 font-semibold text-zinc-900 dark:text-zinc-50">Body Profile & Rules</h2>
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1 lg:col-span-2">
            <label className="mb-2 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Weight
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Weight"
                className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-amber-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              />
              <select
                value={weightUnit}
                onChange={(e) => setWeightUnit(e.target.value as "kg" | "lbs")}
                className="w-20 rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-2 text-zinc-900 focus:border-amber-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
              >
                <option value="kg">kg</option>
                <option value="lbs">lbs</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Gender
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as "male" | "female")}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-amber-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Driving Location
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-900 focus:border-amber-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              {countries.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Drinks Timeline</h2>
            <button
              onClick={addDrink}
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-amber-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
            >
              + Add Drink
            </button>
          </div>
          <div className="space-y-4">
            {drinks.map((drink, index) => (
              <div
                key={drink.id}
                className="relative rounded-xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-700/50 dark:bg-zinc-800/30"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                    {index === 0 ? "1st Drink (Start)" : `Drink ${index + 1}`}
                  </h3>
                  {drinks.length > 1 && (
                    <button
                      onClick={() => removeDrink(drink.id)}
                      className="text-zinc-400 hover:text-red-500"
                      title="Remove Drink"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>

                {index > 0 && (
                  <div className="mb-4">
                    <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">
                      Minutes after previous drink
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={drink.minutesAfterPrevious}
                      onChange={(e) => updateDrink(drink.id, "minutesAfterPrevious", e.target.value)}
                      placeholder="e.g. 60"
                      className="w-full sm:w-1/2 rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 focus:border-amber-400 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
                    />
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Type</label>
                    <select
                      value={drink.type}
                      onChange={(e) => updateDrink(drink.id, "type", e.target.value)}
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 focus:border-amber-400 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
                    >
                      {drinkPresets.map((p) => (
                        <option key={p.name} value={p.name}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Alcohol %</label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={drink.abv}
                      onChange={(e) => updateDrink(drink.id, "abv", e.target.value)}
                      placeholder="%"
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 focus:border-amber-400 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Volume</label>
                    <input
                      type="number"
                      min="0"
                      value={drink.volume}
                      onChange={(e) => updateDrink(drink.id, "volume", e.target.value)}
                      placeholder="Volume"
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 focus:border-amber-400 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-zinc-600 dark:text-zinc-400">Unit</label>
                    <select
                      value={drink.volumeUnit}
                      onChange={(e) => updateDrink(drink.id, "volumeUnit", e.target.value)}
                      className="w-full rounded-md border border-zinc-200 bg-white px-3 py-2 text-zinc-900 focus:border-amber-400 focus:outline-none dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50"
                    >
                      <option value="ml">ml</option>
                      <option value="oz">oz</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 border-t border-zinc-200 pt-6 dark:border-zinc-800">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Minutes elapsed since your LAST drink <span className="opacity-75 font-normal">(Leave 0 if right now)</span>
          </label>
          <input
            type="number"
            min="0"
            value={minutesSinceLast}
            onChange={(e) => setMinutesSinceLast(e.target.value)}
            placeholder="0"
            className="w-full sm:w-1/2 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-amber-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-amber-500 px-6 py-4 font-bold text-white shadow-md transition-colors hover:bg-amber-600 text-lg"
        >
          Calculate My BAC
        </button>

        {result && (
          <div className="mt-8 space-y-4">
            <div
              className={`rounded-2xl p-8 text-center border ${result.safeToDrive
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20"
                : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20"
                }`}
            >
              <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                Current Estimated BAC
              </p>
              <p className="my-2 text-6xl font-black text-zinc-900 dark:text-zinc-50">
                {result.bac.toFixed(4)}%
              </p>
              <p
                className={`text-lg font-bold ${result.safeToDrive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  }`}
              >
                {result.safeToDrive
                  ? `May be safe to drive (Limit: ${result.safeLimit.toFixed(2)}%)`
                  : `DO NOT DRIVE (Limit: ${result.safeLimit.toFixed(2)}%)`}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="flex flex-col justify-center rounded-xl bg-zinc-100 p-5 dark:bg-zinc-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Time until Safe
                </p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {formatTime(result.hoursToSafe)}
                </p>
              </div>
              <div className="flex flex-col justify-center rounded-xl bg-zinc-100 p-5 dark:bg-zinc-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Time until completely sober
                </p>
                <p className="mt-1 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                  {formatTime(result.hoursToZero)}
                </p>
              </div>
              <div className="flex flex-col justify-center rounded-xl bg-zinc-100 p-5 dark:bg-zinc-800">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                  Expected Effects
                </p>
                <p className="mt-1 text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-50">
                  {result.effects}
                </p>
              </div>
            </div>

            <p className="mt-4 text-center text-xs leading-relaxed text-zinc-400 dark:text-zinc-500">
              Disclaimer: This calculator yields only an estimate based on the Widmark formula. Actual BAC fluctuates based on food consumed, medication, personal metabolism, hydration, and other variations. Zero Tolerance is always the safest limit for driving.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

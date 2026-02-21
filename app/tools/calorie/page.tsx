"use client";

import { useState } from "react";

type Gender = "male" | "female";
type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "very_active";

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const activityLabels: Record<ActivityLevel, string> = {
  sedentary: "Sedentary",
  light: "Lightly Active",
  moderate: "Moderately Active",
  active: "Very Active",
  very_active: "Extremely Active",
};

export default function CalorieCalculator() {
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>("moderate");
  const [goal, setGoal] = useState<"lose" | "maintain" | "gain">("maintain");
  const [result, setResult] = useState<{
    bmr: number;
    tdee: number;
    dailyCalories: number;
  } | null>(null);

  const calculate = () => {
    const ageNum = parseInt(age);
    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(ageNum) || isNaN(heightNum) || isNaN(weightNum)) return;

    let bmr = 0;
    if (gender === "male") {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
    } else {
      bmr = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
    }

    const tdee = Math.round(bmr * activityMultipliers[activityLevel]);
    
    let dailyCalories = tdee;
    if (goal === "lose") dailyCalories -= 500;
    else if (goal === "gain") dailyCalories += 500;

    setResult({
      bmr: Math.round(bmr),
      tdee,
      dailyCalories,
    });
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Calorie Calculator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Age (years)
            </label>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="25"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-orange-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
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
                  checked={gender === "female"}
                  onChange={() => setGender("female")}
                  className="h-4 w-4"
                />
                <span className="text-zinc-900 dark:text-zinc-50">Female</span>
              </label>
            </div>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="175"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-orange-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="70"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-orange-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Activity Level
          </label>
          <select
            value={activityLevel}
            onChange={(e) => setActivityLevel(e.target.value as ActivityLevel)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-orange-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          >
            {(Object.keys(activityLabels) as ActivityLevel[]).map((level) => (
              <option key={level} value={level}>
                {activityLabels[level]}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Goal
          </label>
          <div className="flex gap-2">
            {(["lose", "maintain", "gain"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGoal(g)}
                className={`flex-1 rounded-lg py-2 font-medium capitalize transition-colors ${
                  goal === g
                    ? g === "lose"
                      ? "bg-red-500 text-white"
                      : g === "gain"
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 text-white"
                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={calculate}
          className="w-full rounded-lg bg-orange-600 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-700"
        >
          Calculate
        </button>

        {result && (
          <div className="mt-6 space-y-4">
            <div className="rounded-xl bg-orange-50 p-6 text-center dark:bg-orange-900/30">
              <p className="text-sm text-orange-600 dark:text-orange-400">Daily Calories ({goal})</p>
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-50">
                {result.dailyCalories}
              </p>
              <p className="text-sm text-orange-600 dark:text-orange-400">calories/day</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">BMR</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{result.bmr}</p>
              </div>
              <div className="rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
                <p className="text-sm text-zinc-600 dark:text-zinc-400">TDEE</p>
                <p className="text-xl font-bold text-zinc-900 dark:text-zinc-50">{result.tdee}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

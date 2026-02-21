"use client";

import { useState } from "react";

type Category = "length" | "weight" | "temperature" | "volume" | "area" | "speed";

interface Unit {
  name: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

const units: Record<Category, Unit[]> = {
  length: [
    { name: "Meter", symbol: "m", toBase: (v) => v, fromBase: (v) => v },
    { name: "Kilometer", symbol: "km", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { name: "Centimeter", symbol: "cm", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { name: "Millimeter", symbol: "mm", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "Mile", symbol: "mi", toBase: (v) => v * 1609.344, fromBase: (v) => v / 1609.344 },
    { name: "Yard", symbol: "yd", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { name: "Foot", symbol: "ft", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: "Inch", symbol: "in", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { name: "Kilogram", symbol: "kg", toBase: (v) => v, fromBase: (v) => v },
    { name: "Gram", symbol: "g", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "Milligram", symbol: "mg", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { name: "Pound", symbol: "lb", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { name: "Ounce", symbol: "oz", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { name: "Stone", symbol: "st", toBase: (v) => v * 6.35029, fromBase: (v) => v / 6.35029 },
  ],
  temperature: [
    { name: "Celsius", symbol: "°C", toBase: (v) => v, fromBase: (v) => v },
    { name: "Fahrenheit", symbol: "°F", toBase: (v) => (v - 32) * 5 / 9, fromBase: (v) => v * 9 / 5 + 32 },
    { name: "Kelvin", symbol: "K", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  volume: [
    { name: "Liter", symbol: "L", toBase: (v) => v, fromBase: (v) => v },
    { name: "Milliliter", symbol: "mL", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { name: "Gallon (US)", symbol: "gal", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { name: "Gallon (UK)", symbol: "gal (UK)", toBase: (v) => v * 4.54609, fromBase: (v) => v / 4.54609 },
    { name: "Quart", symbol: "qt", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { name: "Pint", symbol: "pt", toBase: (v) => v * 0.473176, fromBase: (v) => v / 0.473176 },
    { name: "Cup", symbol: "cup", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
    { name: "Fluid Ounce", symbol: "fl oz", toBase: (v) => v * 0.0295735, fromBase: (v) => v / 0.0295735 },
    { name: "Cubic Meter", symbol: "m³", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  ],
  area: [
    { name: "Square Meter", symbol: "m²", toBase: (v) => v, fromBase: (v) => v },
    { name: "Square Kilometer", symbol: "km²", toBase: (v) => v * 1000000, fromBase: (v) => v / 1000000 },
    { name: "Square Centimeter", symbol: "cm²", toBase: (v) => v / 10000, fromBase: (v) => v * 10000 },
    { name: "Hectare", symbol: "ha", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
    { name: "Acre", symbol: "ac", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { name: "Square Mile", symbol: "mi²", toBase: (v) => v * 2589988.11, fromBase: (v) => v / 2589988.11 },
    { name: "Square Yard", symbol: "yd²", toBase: (v) => v * 0.836127, fromBase: (v) => v / 0.836127 },
    { name: "Square Foot", symbol: "ft²", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
  ],
  speed: [
    { name: "Meters per second", symbol: "m/s", toBase: (v) => v, fromBase: (v) => v },
    { name: "Kilometers per hour", symbol: "km/h", toBase: (v) => v / 3.6, fromBase: (v) => v * 3.6 },
    { name: "Miles per hour", symbol: "mph", toBase: (v) => v * 0.44704, fromBase: (v) => v / 0.44704 },
    { name: "Feet per second", symbol: "ft/s", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { name: "Knots", symbol: "kn", toBase: (v) => v * 0.514444, fromBase: (v) => v / 0.514444 },
  ],
};

const categoryLabels: Record<Category, string> = {
  length: "Length",
  weight: "Weight",
  temperature: "Temperature",
  volume: "Volume",
  area: "Area",
  speed: "Speed",
};

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>("length");
  const [inputValue, setInputValue] = useState<string>("");
  const [fromUnit, setFromUnit] = useState<number>(0);
  const [toUnit, setToUnit] = useState<number>(1);

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return "";
    const baseValue = units[category][fromUnit].toBase(value);
    const result = units[category][toUnit].fromBase(baseValue);
    return result.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  const result = handleConvert();

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Unit Converter
      </h1>

      <div className="mb-6 flex flex-wrap gap-2">
        {(Object.keys(categoryLabels) as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setFromUnit(0);
              setToUnit(1);
              setInputValue("");
            }}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              category === cat
                ? "bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Enter value
          </label>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value to convert"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-lg text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              From
            </label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              {units[category].map((unit, index) => (
                <option key={index} value={index}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              To
            </label>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              {units[category].map((unit, index) => (
                <option key={index} value={index}>
                  {unit.name} ({unit.symbol})
                </option>
              ))}
            </select>
          </div>
        </div>

        {inputValue && (
          <div className="rounded-xl bg-zinc-100 p-6 dark:bg-zinc-800">
            <p className="text-center text-zinc-600 dark:text-zinc-400">
              {inputValue} {units[category][fromUnit].symbol} =
            </p>
            <p className="mt-2 text-center text-3xl font-bold text-zinc-900 dark:text-zinc-50">
              {result} {units[category][toUnit].symbol}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

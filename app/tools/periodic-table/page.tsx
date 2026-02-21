"use client";

import { useState } from "react";

interface Element {
  number: number;
  symbol: string;
  name: string;
  mass: string;
  category: string;
}

const elements: Element[] = [
  { number: 1, symbol: "H", name: "Hydrogen", mass: "1.008", category: "nonmetal" },
  { number: 2, symbol: "He", name: "Helium", mass: "4.003", category: "noble-gas" },
  { number: 3, symbol: "Li", name: "Lithium", mass: "6.941", category: "alkali" },
  { number: 4, symbol: "Be", name: "Beryllium", mass: "9.012", category: "alkaline" },
  { number: 5, symbol: "B", name: "Boron", mass: "10.81", category: "metalloid" },
  { number: 6, symbol: "C", name: "Carbon", mass: "12.01", category: "nonmetal" },
  { number: 7, symbol: "N", name: "Nitrogen", mass: "14.01", category: "nonmetal" },
  { number: 8, symbol: "O", name: "Oxygen", mass: "16.00", category: "nonmetal" },
  { number: 9, symbol: "F", name: "Fluorine", mass: "19.00", category: "halogen" },
  { number: 10, symbol: "Ne", name: "Neon", mass: "20.18", category: "noble-gas" },
  { number: 11, symbol: "Na", name: "Sodium", mass: "22.99", category: "alkali" },
  { number: 12, symbol: "Mg", name: "Magnesium", mass: "24.31", category: "alkaline" },
  { number: 13, symbol: "Al", name: "Aluminum", mass: "26.98", category: "metal" },
  { number: 14, symbol: "Si", name: "Silicon", mass: "28.09", category: "metalloid" },
  { number: 15, symbol: "P", name: "Phosphorus", mass: "30.97", category: "nonmetal" },
  { number: 16, symbol: "S", name: "Sulfur", mass: "32.07", category: "nonmetal" },
  { number: 17, symbol: "Cl", name: "Chlorine", mass: "35.45", category: "halogen" },
  { number: 18, symbol: "Ar", name: "Argon", mass: "39.95", category: "noble-gas" },
  { number: 19, symbol: "K", name: "Potassium", mass: "39.10", category: "alkali" },
  { number: 20, symbol: "Ca", name: "Calcium", mass: "40.08", category: "alkaline" },
  { number: 26, symbol: "Fe", name: "Iron", mass: "55.85", category: "metal" },
  { number: 29, symbol: "Cu", name: "Copper", mass: "63.55", category: "metal" },
  { number: 30, symbol: "Zn", name: "Zinc", mass: "65.38", category: "metal" },
  { number: 47, symbol: "Ag", name: "Silver", mass: "107.87", category: "metal" },
  { number: 79, symbol: "Au", name: "Gold", mass: "196.97", category: "metal" },
];

const categoryColors: Record<string, string> = {
  "nonmetal": "bg-yellow-200 text-yellow-800",
  "noble-gas": "bg-purple-200 text-purple-800",
  "alkali": "bg-red-200 text-red-800",
  "alkaline": "bg-orange-200 text-orange-800",
  "metalloid": "bg-green-200 text-green-800",
  "halogen": "bg-cyan-200 text-cyan-800",
  "metal": "bg-blue-200 text-blue-800",
};

export default function PeriodicTable() {
  const [selected, setSelected] = useState<Element | null>(null);

  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Periodic Table
      </h1>

      <div className="mb-6 flex flex-wrap gap-3">
        {Object.entries(categoryColors).map(([cat, color]) => (
          <span key={cat} className={`rounded-full px-3 py-1 text-xs font-medium ${color}`}>
            {cat.replace("-", " ")}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
        {elements.map((el) => (
          <button
            key={el.number}
            onClick={() => setSelected(el)}
            className={`relative flex flex-col items-center justify-center rounded-lg p-2 transition-transform hover:scale-110 ${
              categoryColors[el.category]
            } ${selected?.number === el.number ? "ring-2 ring-zinc-900 dark:ring-white" : ""}`}
          >
            <span className="text-xs opacity-70">{el.number}</span>
            <span className="text-lg font-bold">{el.symbol}</span>
            <span className="hidden text-[10px] sm:block">{el.name}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-start gap-4">
            <div className={`flex h-20 w-20 items-center justify-center rounded-xl text-3xl font-bold ${categoryColors[selected.category]}`}>
              {selected.symbol}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{selected.name}</h2>
              <p className="text-zinc-500">{selected.category.replace("-", " ")}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-zinc-500">Atomic Number</p>
                  <p className="font-bold text-zinc-900 dark:text-zinc-50">{selected.number}</p>
                </div>
                <div>
                  <p className="text-zinc-500">Atomic Mass</p>
                  <p className="font-bold text-zinc-900 dark:text-zinc-50">{selected.mass}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

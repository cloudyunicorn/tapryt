"use client";

import { useState } from "react";

interface Chemical {
  name: string;
  formula: string;
  commonUses: string[];
  safetyNotes: string;
  category: string;
}

const chemicals: Chemical[] = [
  {
    name: "Sodium Chloride",
    formula: "NaCl",
    commonUses: ["Table salt", "Food preservation", "Water softening", "De-icing"],
    safetyNotes: "Generally safe. High consumption can lead to health issues.",
    category: "Household",
  },
  {
    name: "Sodium Bicarbonate",
    formula: "NaHCO₃",
    commonUses: ["Baking soda", "Cleaning agent", "Antacid", "Fire extinguisher"],
    safetyNotes: "Safe for consumption in small amounts. Can cause irritation if inhaled.",
    category: "Household",
  },
  {
    name: "Acetic Acid",
    formula: "CH₃COOH",
    commonUses: ["Vinegar", "Food preservative", "Cleaning", "Pickling"],
    safetyNotes: "Dilute form (vinegar) is safe. Concentrated form causes burns.",
    category: "Household",
  },
  {
    name: "Hydrogen Peroxide",
    formula: "H₂O₂",
    commonUses: ["Disinfectant", "Hair bleach", "Cleaning agent", "Oxidizer"],
    safetyNotes: "Dilute (3%) is safe for minor wounds. Higher concentrations are dangerous.",
    category: "Medical",
  },
  {
    name: "Isopropyl Alcohol",
    formula: "C₃H₈O",
    commonUses: ["Rubbing alcohol", "Disinfectant", "Solvent", "Personal care"],
    safetyNotes: "Toxic if swallowed. Flammable. Use in well-ventilated areas.",
    category: "Medical",
  },
  {
    name: "Calcium Carbonate",
    formula: "CaCO₃",
    commonUses: ["Antacid", "Chalk", "Supplement", "Construction"],
    safetyNotes: "Generally safe. May cause constipation in large amounts.",
    category: "Household",
  },
  {
    name: "Citric Acid",
    formula: "C₆H₈O₇",
    commonUses: ["Food preservative", "Flavoring agent", "Cleaning", "Chelating agent"],
    safetyNotes: "Safe in food amounts. Can irritate skin and eyes in concentrated form.",
    category: "Food",
  },
  {
    name: "Aspirin",
    formula: "C₉H₈O₄",
    commonUses: ["Pain relief", "Fever reduction", "Anti-inflammatory", "Blood thinner"],
    safetyNotes: "Do not give to children with viral infections. Can cause stomach issues.",
    category: "Medical",
  },
  {
    name: "Ammonia",
    formula: "NH₃",
    commonUses: ["Cleaning products", "Fertilizer", "Refrigerant", "Water treatment"],
    safetyNotes: "Toxic if inhaled. Never mix with bleach. Causes severe burns.",
    category: "Industrial",
  },
  {
    name: "Sodium Hydroxide",
    formula: "NaOH",
    commonUses: ["Drain cleaner", "Soap making", "Paper manufacturing", "Food processing"],
    safetyNotes: "Caustic - causes severe burns. Wear protective equipment.",
    category: "Industrial",
  },
  {
    name: "Hydrochloric Acid",
    formula: "HCl",
    commonUses: ["Pool maintenance", "Steel pickling", "pH control", "Food processing"],
    safetyNotes: "Highly corrosive. Never mix with bases. Use in ventilated areas.",
    category: "Industrial",
  },
  {
    name: "Ethanol",
    formula: "C₂H₅OH",
    commonUses: ["Alcoholic beverages", "Solvent", "Fuel", "Disinfectant"],
    safetyNotes: "Toxic if consumed in large amounts. Highly flammable.",
    category: "Household",
  },
  {
    name: "Glycerin",
    formula: "C₃H₈O₃",
    commonUses: ["Moisturizer", "Food additive", "Solvent", "Preservative"],
    safetyNotes: "Safe for topical and food use. May cause irritation if inhaled.",
    category: "Household",
  },
  {
    name: "Boric Acid",
    formula: "H₃BO₃",
    commonUses: ["Antiseptic", "Insecticide", "Cleaning", "Preservative"],
    safetyNotes: "Toxic if swallowed in large amounts. Avoid prolonged skin contact.",
    category: "Medical",
  },
  {
    name: "Potassium Permanganate",
    formula: "KMnO₄",
    commonUses: ["Disinfectant", "Water treatment", "Oxidizing agent", "Medical use"],
    safetyNotes: "Strong oxidizer. Can cause burns. Keep away from flammable materials.",
    category: "Medical",
  },
];

const categories = ["All", "Household", "Medical", "Industrial", "Food"];

export default function ChemicalsReference() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredChemicals = chemicals.filter((chem) => {
    const matchesSearch =
      chem.name.toLowerCase().includes(search.toLowerCase()) ||
      chem.formula.toLowerCase().includes(search.toLowerCase()) ||
      chem.commonUses.some((use) => use.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || chem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Everyday Chemicals Reference
      </h1>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search chemicals..."
          className="flex-1 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-zinc-900 focus:border-zinc-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-4">
        {filteredChemicals.map((chem) => (
          <div
            key={chem.name}
            className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-3 flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {chem.name}
                </h2>
                <p className="font-mono text-sm text-purple-600 dark:text-purple-400">
                  {chem.formula}
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {chem.category}
              </span>
            </div>

            <div className="mb-3">
              <p className="mb-1 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Common Uses:
              </p>
              <div className="flex flex-wrap gap-2">
                {chem.commonUses.map((use) => (
                  <span
                    key={use}
                    className="rounded-md bg-purple-50 px-2 py-1 text-xs text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    {use}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-900/20">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                Safety: {chem.safetyNotes}
              </p>
            </div>
          </div>
        ))}
      </div>

      {filteredChemicals.length === 0 && (
        <p className="text-center text-zinc-500 dark:text-zinc-400">
          No chemicals found matching your search.
        </p>
      )}
    </main>
  );
}

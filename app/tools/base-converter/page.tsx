"use client";

import { useState } from "react";

type Base = "binary" | "octal" | "decimal" | "hexadecimal";

export default function BaseConverter() {
  const [value, setValue] = useState("");
  const [fromBase, setFromBase] = useState<Base>("decimal");
  const [results, setResults] = useState<Record<Base, string>>({
    binary: "",
    octal: "",
    decimal: "",
    hexadecimal: "",
  });

  const convert = () => {
    let decimalValue: number;

    try {
      switch (fromBase) {
        case "binary":
          decimalValue = parseInt(value, 2);
          break;
        case "octal":
          decimalValue = parseInt(value, 8);
          break;
        case "decimal":
          decimalValue = parseInt(value, 10);
          break;
        case "hexadecimal":
          decimalValue = parseInt(value, 16);
          break;
      }
    } catch {
      return;
    }

    if (isNaN(decimalValue)) return;

    setResults({
      binary: decimalValue.toString(2),
      octal: decimalValue.toString(8),
      decimal: decimalValue.toString(10),
      hexadecimal: decimalValue.toString(16).toUpperCase(),
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setValue(val);
    
    let decimalValue: number | undefined;
    try {
      switch (fromBase) {
        case "binary":
          if (/^[01]*$/.test(val)) decimalValue = parseInt(val, 2);
          break;
        case "octal":
          if (/^[0-7]*$/.test(val)) decimalValue = parseInt(val, 8);
          break;
        case "decimal":
          if (/^\d*$/.test(val)) decimalValue = parseInt(val, 10);
          break;
        case "hexadecimal":
          if (/^[0-9A-Fa-f]*$/.test(val)) decimalValue = parseInt(val, 16);
          break;
      }
    } catch {
      return;
    }

    if (decimalValue !== undefined && !isNaN(decimalValue)) {
      setResults({
        binary: decimalValue.toString(2),
        octal: decimalValue.toString(8),
        decimal: decimalValue.toString(10),
        hexadecimal: decimalValue.toString(16).toUpperCase(),
      });
    } else if (val === "") {
      setResults({ binary: "", octal: "", decimal: "", hexadecimal: "" });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Number Base Converter
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Input Number
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={handleInputChange}
              placeholder="Enter number"
              className="flex-1 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-orange-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
            <select
              value={fromBase}
              onChange={(e) => {
                setFromBase(e.target.value as Base);
                setValue("");
                setResults({ binary: "", octal: "", decimal: "", hexadecimal: "" });
              }}
              className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-orange-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="binary">Binary (2)</option>
              <option value="octal">Octal (8)</option>
              <option value="decimal">Decimal (10)</option>
              <option value="hexadecimal">Hexadecimal (16)</option>
            </select>
          </div>
        </div>

        <div className="space-y-3">
          {(["binary", "octal", "decimal", "hexadecimal"] as Base[]).map((base) => (
            <div
              key={base}
              className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800"
            >
              <div className="flex-1">
                <p className="mb-1 text-sm font-medium capitalize text-zinc-600 dark:text-zinc-400">
                  {base}
                </p>
                <p className="font-mono text-lg font-bold text-zinc-900 dark:text-zinc-50">
                  {results[base] || "-"}
                </p>
              </div>
              {results[base] && (
                <button
                  onClick={() => copyToClipboard(results[base])}
                  className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

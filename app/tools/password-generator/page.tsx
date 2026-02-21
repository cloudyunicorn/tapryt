"use client";

import { useState } from "react";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let chars = "";
    if (includeUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) chars += "0123456789";
    if (includeSymbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (!chars) {
      setPassword("Select at least one character type");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Password Generator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6">
          <label className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <span>Password Length</span>
            <span className="font-bold text-zinc-900 dark:text-zinc-50">{length}</span>
          </label>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div className="mb-6 space-y-3">
          {[
            { label: "Uppercase (A-Z)", checked: includeUppercase, setter: setIncludeUppercase },
            { label: "Lowercase (a-z)", checked: includeLowercase, setter: setIncludeLowercase },
            { label: "Numbers (0-9)", checked: includeNumbers, setter: setIncludeNumbers },
            { label: "Symbols (!@#$%...)", checked: includeSymbols, setter: setIncludeSymbols },
          ].map((item) => (
            <label key={item.label} className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={(e) => item.setter(e.target.checked)}
                className="h-5 w-5"
              />
              <span className="text-zinc-700 dark:text-zinc-300">{item.label}</span>
            </label>
          ))}
        </div>

        <button
          onClick={generate}
          className="w-full rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white transition-colors hover:bg-cyan-700"
        >
          Generate Password
        </button>

        {password && (
          <div className="mt-6">
            <div className="flex items-center gap-2 rounded-lg bg-zinc-100 p-4 dark:bg-zinc-800">
              <p className="flex-1 break-all font-mono text-lg font-bold text-zinc-900 dark:text-zinc-50">
                {password}
              </p>
              <button
                onClick={copyToClipboard}
                className="shrink-0 rounded-lg bg-zinc-200 px-3 py-1 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div className="mt-4 flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className={`h-2 w-16 rounded ${password.length >= 8 ? "bg-green-500" : "bg-zinc-300"}`} />
                <span className="text-zinc-500">Weak</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-16 rounded ${password.length >= 12 ? "bg-yellow-500" : "bg-zinc-300"}`} />
                <span className="text-zinc-500">Medium</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-2 w-16 rounded ${password.length >= 16 ? "bg-green-600" : "bg-zinc-300"}`} />
                <span className="text-zinc-500">Strong</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

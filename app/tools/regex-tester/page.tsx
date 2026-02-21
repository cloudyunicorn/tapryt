"use client";

import { useState } from "react";

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<string[]>([]);
  const [error, setError] = useState("");

  const test = () => {
    setError("");
    setMatches([]);

    if (!pattern) {
      setError("Please enter a regex pattern");
      return;
    }

    try {
      const regex = new RegExp(pattern, flags);
      const results: string[] = [];
      let match;
      
      if (flags.includes("g")) {
        while ((match = regex.exec(testString)) !== null) {
          results.push(match[0]);
          if (match.index === regex.lastIndex) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) results.push(match[0]);
      }

      setMatches(results);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid regex");
    }
  };

  const commonPatterns = [
    { name: "Email", pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}" },
    { name: "Phone", pattern: "\\d{3}[-.]?\\d{3}[-.]?\\d{4}" },
    { name: "URL", pattern: "https?:\\/\\/[^\\s]+" },
    { name: "Date (YYYY-MM-DD)", pattern: "\\d{4}-\\d{2}-\\d{2}" },
    { name: "IP Address", pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}" },
    { name: "Hex Color", pattern: "#[0-9A-Fa-f]{6}" },
  ];

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Regex Tester
      </h1>

      <div className="mb-4 flex flex-wrap gap-2">
        {commonPatterns.map((p) => (
          <button
            key={p.name}
            onClick={() => setPattern(p.pattern)}
            className="rounded-lg bg-zinc-100 px-3 py-1 text-sm text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Regex Pattern
            </label>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="e.g., \d+"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-zinc-900 placeholder-zinc-400 focus:border-pink-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Flags
            </label>
            <div className="flex gap-4">
              {["g", "i", "m", "s"].map((flag) => (
                <label key={flag} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={flags.includes(flag)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFlags(flags + flag);
                      } else {
                        setFlags(flags.replace(flag, ""));
                      }
                    }}
                    className="h-4 w-4"
                  />
                  <span className="text-zinc-900 dark:text-zinc-50">{flag}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Test String
          </label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            placeholder="Enter text to test against..."
            className="h-32 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-pink-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <button
          onClick={test}
          className="w-full rounded-lg bg-pink-600 px-6 py-3 font-medium text-white transition-colors hover:bg-pink-700"
        >
          Test Regex
        </button>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            {error}
          </div>
        )}

        {matches.length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Matches ({matches.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {matches.map((match, i) => (
                <span
                  key={i}
                  className="rounded-lg bg-pink-100 px-3 py-1 font-mono text-pink-700 dark:bg-pink-900/30 dark:text-pink-300"
                >
                  {match}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

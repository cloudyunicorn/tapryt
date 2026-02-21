"use client";

import { useState } from "react";

export default function HashGenerator() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<string, string>>({});

  const generateHashes = async () => {
    if (!input) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const hashAlgorithms = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
    const results: Record<string, string> = {};

    for (const algo of hashAlgorithms) {
      const hashBuffer = await crypto.subtle.digest(algo, data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      results[algo] = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    setHashes(results);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Hash Generator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Input Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="h-32 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 placeholder-zinc-400 focus:border-red-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <button
          onClick={generateHashes}
          className="w-full rounded-lg bg-red-600 px-6 py-3 font-medium text-white transition-colors hover:bg-red-700"
        >
          Generate Hashes
        </button>

        <div className="mt-6 space-y-4">
          {Object.entries(hashes).map(([algorithm, hash]) => (
            <div key={algorithm} className="rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
              <div className="mb-2 flex items-center justify-between">
                <p className="font-medium text-zinc-700 dark:text-zinc-300">{algorithm}</p>
                <button
                  onClick={() => copyToClipboard(hash)}
                  className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
                >
                  Copy
                </button>
              </div>
              <p className="break-all font-mono text-sm text-zinc-900 dark:text-zinc-50">
                {hash}
              </p>
            </div>
          ))}
        </div>

        <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
          Note: Computed entirely in your browser. SHA-1 is considered cryptographically unsafe and is provided for legacy compatibility.
        </p>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState("5");
  const [version, setVersion] = useState<"4" | "7">("4");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const num = parseInt(count);
    if (isNaN(num) || num < 1 || num > 100) return;

    const newUuids: string[] = [];
    for (let i = 0; i < num; i++) {
      if (version === "4") {
        newUuids.push(crypto.randomUUID());
      } else {
        const ts = Date.now();
        const randomPart = Array.from({ length: 12 }, () => 
          Math.floor(Math.random() * 16).toString(16)
        ).join("");
        newUuids.push(`${ts.toString(16).padStart(13, "0")}-${randomPart.slice(0, 4)}-7${randomPart.slice(4, 7)}-${(parseInt(randomPart.slice(7, 8), 16) & 0x3 | 0x8).toString(16)}${randomPart.slice(8, 12)}-${randomPart.slice(12)}`);
      }
    }
    setUuids(newUuids);
    setCopied(false);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        UUID Generator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Number of UUIDs
            </label>
            <input
              type="number"
              value={count}
              onChange={(e) => setCount(e.target.value)}
              min="1"
              max="100"
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-fuchsia-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Version
            </label>
            <select
              value={version}
              onChange={(e) => setVersion(e.target.value as "4" | "7")}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-fuchsia-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              <option value="4">UUID v4 (Random)</option>
              <option value="7">UUID v7 (Timestamp)</option>
            </select>
          </div>
        </div>

        <button
          onClick={generate}
          className="w-full rounded-lg bg-fuchsia-600 px-6 py-3 font-medium text-white transition-colors hover:bg-fuchsia-700"
        >
          Generate UUIDs
        </button>

        {uuids.length > 0 && (
          <div className="mt-6">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Generated UUIDs
              </label>
              <button
                onClick={copyAll}
                className="text-sm text-fuchsia-600 hover:text-fuchsia-700"
              >
                {copied ? "Copied!" : "Copy All"}
              </button>
            </div>
            <div className="max-h-64 space-y-2 overflow-y-auto rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
              {uuids.map((uuid, i) => (
                <p key={i} className="font-mono text-sm text-zinc-900 dark:text-zinc-50">
                  {uuid}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

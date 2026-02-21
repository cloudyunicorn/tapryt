"use client";

import { useState } from "react";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [minified, setMinified] = useState(false);

  const format = () => {
    try {
      const parsed = JSON.parse(input);
      const formatted = minified
        ? JSON.stringify(parsed)
        : JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
      setOutput("");
    }
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JSON");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        JSON Formatter
      </h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Input JSON
            </label>
            <button
              onClick={() => setInput("")}
              className="text-sm text-red-500 hover:text-red-600"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"name": "John", "age": 30}'
            className="h-64 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm text-zinc-900 placeholder-zinc-400 focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Formatted Output
            </label>
            <div className="flex gap-2">
              <button
                onClick={minify}
                className="text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                Minify
              </button>
              <button
                onClick={format}
                className="rounded bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
              >
                Format
              </button>
            </div>
          </div>
          <textarea
            value={error ? "" : output}
            readOnly
            placeholder={error || "Formatted JSON will appear here"}
            className={`h-64 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4 font-mono text-sm focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 ${
              error ? "text-red-500" : "text-zinc-900 dark:text-zinc-50"
            }`}
          />
          {output && (
            <button
              onClick={copyToClipboard}
              className="mt-2 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              Copy to Clipboard
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

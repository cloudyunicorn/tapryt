"use client";

import { useState } from "react";

export default function CsvJson() {
    const [mode, setMode] = useState<"csv-to-json" | "json-to-csv">("csv-to-json");
    const [input, setInput] = useState("");
    const [output, setOutput] = useState("");
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);

    const csvToJson = (csv: string): string => {
        const lines = csv.trim().split("\n");
        if (lines.length < 2) throw new Error("CSV must have at least a header row and one data row");
        const headers = parseCsvLine(lines[0]);
        const result = [];
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            const values = parseCsvLine(lines[i]);
            const obj: Record<string, string> = {};
            headers.forEach((h, idx) => {
                obj[h.trim()] = (values[idx] || "").trim();
            });
            result.push(obj);
        }
        return JSON.stringify(result, null, 2);
    };

    const parseCsvLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (inQuotes) {
                if (char === '"' && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else if (char === '"') {
                    inQuotes = false;
                } else {
                    current += char;
                }
            } else {
                if (char === '"') {
                    inQuotes = true;
                } else if (char === ",") {
                    result.push(current);
                    current = "";
                } else {
                    current += char;
                }
            }
        }
        result.push(current);
        return result;
    };

    const jsonToCsv = (json: string): string => {
        const data = JSON.parse(json);
        if (!Array.isArray(data) || data.length === 0) throw new Error("JSON must be a non-empty array of objects");
        const headers = Object.keys(data[0]);
        const escapeCsvField = (field: string) => {
            const str = String(field ?? "");
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };
        const rows = data.map((obj: Record<string, unknown>) =>
            headers.map((h) => escapeCsvField(String(obj[h] ?? ""))).join(",")
        );
        return [headers.map(escapeCsvField).join(","), ...rows].join("\n");
    };

    const convert = () => {
        setError("");
        setOutput("");
        setCopied(false);
        try {
            if (!input.trim()) throw new Error("Please enter some input");
            if (mode === "csv-to-json") {
                setOutput(csvToJson(input));
            } else {
                setOutput(jsonToCsv(input));
            }
        } catch (e) {
            setError(e instanceof Error ? e.message : "Conversion failed");
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadFile = () => {
        if (!output) return;
        const ext = mode === "csv-to-json" ? "json" : "csv";
        const mimeType = mode === "csv-to-json" ? "application/json" : "text/csv";
        const blob = new Blob([output], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `converted.${ext}`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <main className="container mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                CSV ↔ JSON Converter
            </h1>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                {/* Mode Toggle */}
                <div className="mb-4 flex gap-2">
                    {(["csv-to-json", "json-to-csv"] as const).map((m) => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); setInput(""); setOutput(""); setError(""); }}
                            className={`flex-1 rounded-lg px-4 py-2 font-medium transition-colors ${mode === m
                                    ? "bg-teal-600 text-white"
                                    : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                }`}
                        >
                            {m === "csv-to-json" ? "CSV → JSON" : "JSON → CSV"}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        {mode === "csv-to-json" ? "CSV Input" : "JSON Input"}
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={
                            mode === "csv-to-json"
                                ? "name,age,city\nAlice,30,New York\nBob,25,London"
                                : '[{"name":"Alice","age":"30","city":"New York"}]'
                        }
                        className="h-40 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-sm text-zinc-900 placeholder-zinc-400 focus:border-teal-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    />
                </div>

                <button
                    onClick={convert}
                    className="w-full rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700"
                >
                    Convert
                </button>

                {error && (
                    <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        {error}
                    </div>
                )}

                {output && (
                    <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Result</label>
                            <div className="flex gap-2">
                                <button onClick={copyToClipboard} className="text-sm text-teal-600 hover:text-teal-700">
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                                <button onClick={downloadFile} className="text-sm text-teal-600 hover:text-teal-700">
                                    Download
                                </button>
                            </div>
                        </div>
                        <div className="max-h-80 overflow-auto rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                            <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-900 dark:text-zinc-50">
                                {output}
                            </pre>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

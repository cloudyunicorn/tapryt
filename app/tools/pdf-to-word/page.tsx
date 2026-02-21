"use client";

import { useState, useCallback } from "react";

export default function PdfToWord() {
    const [file, setFile] = useState<File | null>(null);
    const [status, setStatus] = useState<"idle" | "processing" | "done" | "error">("idle");
    const [progress, setProgress] = useState(0);
    const [pageCount, setPageCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState("");

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f || f.type !== "application/pdf") return;
        setFile(f);
        setStatus("idle");
        setProgress(0);
        setErrorMsg("");
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (!f || f.type !== "application/pdf") return;
        setFile(f);
        setStatus("idle");
        setProgress(0);
        setErrorMsg("");
    }, []);

    const convert = async () => {
        if (!file) return;
        setStatus("processing");
        setProgress(0);
        setErrorMsg("");

        try {
            // Dynamically import libraries
            const pdfjsLib = await import("pdfjs-dist");
            const { Document, Packer, Paragraph, TextRun, HeadingLevel, PageBreak } = await import("docx");
            const { saveAs } = await import("file-saver");

            // Set worker
            pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const totalPages = pdf.numPages;
            setPageCount(totalPages);

            const sections: { properties: Record<string, unknown>; children: InstanceType<typeof Paragraph>[] }[] = [];

            for (let i = 1; i <= totalPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const paragraphs: InstanceType<typeof Paragraph>[] = [];

                // Group text items by their y-position to form lines
                const lines: { y: number; text: string; fontSize: number }[] = [];
                let currentLine = "";
                let currentY = -1;
                let maxFontSize = 0;

                for (const item of content.items) {
                    if (!("str" in item)) continue;
                    const textItem = item as { str: string; transform: number[] };
                    const y = Math.round(textItem.transform[5]);
                    const fontSize = Math.round(textItem.transform[0]);

                    if (currentY === -1) {
                        currentY = y;
                        currentLine = textItem.str;
                        maxFontSize = fontSize;
                    } else if (Math.abs(y - currentY) < 3) {
                        currentLine += textItem.str;
                        maxFontSize = Math.max(maxFontSize, fontSize);
                    } else {
                        if (currentLine.trim()) {
                            lines.push({ y: currentY, text: currentLine.trim(), fontSize: maxFontSize });
                        }
                        currentY = y;
                        currentLine = textItem.str;
                        maxFontSize = fontSize;
                    }
                }
                if (currentLine.trim()) {
                    lines.push({ y: currentY, text: currentLine.trim(), fontSize: maxFontSize });
                }

                // Convert lines to Word paragraphs with basic heading detection
                for (const line of lines) {
                    const isHeading = line.fontSize >= 16;
                    paragraphs.push(
                        new Paragraph({
                            children: [
                                new TextRun({
                                    text: line.text,
                                    size: line.fontSize * 2, // docx uses half-points
                                    bold: isHeading,
                                }),
                            ],
                            heading: isHeading ? HeadingLevel.HEADING_1 : undefined,
                        })
                    );
                }

                // Add page break between pages (except the last)
                if (i < totalPages) {
                    paragraphs.push(
                        new Paragraph({
                            children: [new PageBreak()],
                        })
                    );
                }

                if (i === 1) {
                    sections.push({ properties: {}, children: paragraphs });
                } else {
                    sections[0].children.push(...paragraphs);
                }

                setProgress(Math.round((i / totalPages) * 100));
            }

            const doc = new Document({
                sections,
            });

            const blob = await Packer.toBlob(doc);
            const name = file.name.replace(/\.pdf$/i, "");
            saveAs(blob, `${name}.docx`);
            setStatus("done");
        } catch (err) {
            console.error(err);
            setErrorMsg(err instanceof Error ? err.message : "Conversion failed");
            setStatus("error");
        }
    };

    return (
        <main className="container mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                PDF → Word Converter
            </h1>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                {/* File Upload */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Upload PDF
                    </label>
                    <label
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-10 transition-colors hover:border-teal-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500"
                    >
                        <svg className="mb-3 h-10 w-10 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                            {file ? file.name : "Drop a PDF here or click to browse"}
                        </span>
                        {file && (
                            <span className="mt-1 text-xs text-zinc-400">
                                {(file.size / 1024).toFixed(1)} KB
                            </span>
                        )}
                        <input type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" />
                    </label>
                </div>

                {/* Convert Button */}
                <button
                    onClick={convert}
                    disabled={!file || status === "processing"}
                    className="w-full rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {status === "processing" ? "Converting..." : "Convert to Word"}
                </button>

                {/* Progress */}
                {status === "processing" && (
                    <div className="mt-4">
                        <div className="mb-1 flex justify-between text-sm text-zinc-500 dark:text-zinc-400">
                            <span>Processing{pageCount > 0 ? ` (${pageCount} pages)` : ""}...</span>
                            <span>{progress}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                            <div
                                className="h-full rounded-full bg-teal-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Success */}
                {status === "done" && (
                    <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm font-medium">
                            Converted successfully! Your .docx file has been downloaded.
                        </span>
                    </div>
                )}

                {/* Error */}
                {status === "error" && (
                    <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                        <p className="text-sm font-medium">Conversion failed</p>
                        {errorMsg && <p className="mt-1 text-xs">{errorMsg}</p>}
                    </div>
                )}

                {/* Info */}
                <p className="mt-4 text-xs text-zinc-400 dark:text-zinc-500">
                    Text is extracted client-side — your files never leave your browser. Complex layouts and images may not be preserved.
                </p>
            </div>
        </main>
    );
}

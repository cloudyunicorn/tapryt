"use client";

import { useState, useMemo } from "react";

function markdownToHtml(md: string): string {
    let html = md;

    // Code blocks (``` ... ```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_m, _lang, code) => {
        return `<pre><code>${code.replace(/</g, "&lt;").replace(/>/g, "&gt;").trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

    // Headings
    html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
    html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
    html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
    html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
    html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
    html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

    // Bold & italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
    html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Images
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />');

    // Horizontal rule
    html = html.replace(/^[-*_]{3,}$/gm, "<hr />");

    // Blockquotes
    html = html.replace(/^>\s+(.+)$/gm, "<blockquote>$1</blockquote>");

    // Unordered lists
    html = html.replace(/^[-*+]\s+(.+)$/gm, "<li>$1</li>");
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>$1</ul>");

    // Paragraphs — wrap remaining standalone lines
    html = html.replace(/^(?!<[a-z/])((?:.(?!<[a-z/]))+.)$/gm, "<p>$1</p>");

    // Clean up extra newlines
    html = html.replace(/\n{2,}/g, "\n");

    return html.trim();
}

export default function MarkdownHtml() {
    const [input, setInput] = useState("");
    const [viewMode, setViewMode] = useState<"preview" | "html">("preview");
    const [copied, setCopied] = useState(false);

    const htmlOutput = useMemo(() => markdownToHtml(input), [input]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(htmlOutput);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadFile = () => {
        if (!htmlOutput) return;
        const blob = new Blob([htmlOutput], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = "converted.html";
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <main className="container mx-auto max-w-4xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Markdown → HTML
            </h1>

            <div className="grid gap-6 lg:grid-cols-2">
                {/* Input */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Markdown Input
                    </label>
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={"# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n[Link](https://example.com)"}
                        className="h-80 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 font-mono text-sm text-zinc-900 placeholder-zinc-400 focus:border-teal-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    />
                </div>

                {/* Output */}
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex gap-2">
                            {(["preview", "html"] as const).map((m) => (
                                <button
                                    key={m}
                                    onClick={() => setViewMode(m)}
                                    className={`rounded-lg px-3 py-1 text-sm font-medium capitalize transition-colors ${viewMode === m
                                            ? "bg-teal-600 text-white"
                                            : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                        }`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <button onClick={copyToClipboard} className="text-sm text-teal-600 hover:text-teal-700">
                                {copied ? "Copied!" : "Copy"}
                            </button>
                            <button onClick={downloadFile} className="text-sm text-teal-600 hover:text-teal-700">
                                Download
                            </button>
                        </div>
                    </div>
                    <div className="h-80 overflow-auto rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                        {viewMode === "preview" ? (
                            <div
                                className="prose prose-sm max-w-none dark:prose-invert"
                                dangerouslySetInnerHTML={{ __html: htmlOutput }}
                            />
                        ) : (
                            <pre className="whitespace-pre-wrap font-mono text-sm text-zinc-900 dark:text-zinc-50">
                                {htmlOutput}
                            </pre>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
}

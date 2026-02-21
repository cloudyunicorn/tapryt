"use client";

import { useState } from "react";

export default function LoremIpsum() {
  const [paragraphs, setParagraphs] = useState("3");
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    const num = parseInt(paragraphs);
    if (isNaN(num) || num < 1 || num > 50) return;

    const loremText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur";

    const sentences = loremText.split(". ").filter(s => s.length > 0);
    let result = "";

    for (let i = 0; i < num; i++) {
      const randomSentences = Math.floor(Math.random() * 3) + 2;
      let para = "";
      for (let j = 0; j < randomSentences; j++) {
        const idx = Math.floor(Math.random() * sentences.length);
        para += sentences[idx] + (j < randomSentences - 1 ? ". " : ".");
      }
      result += para + "\n\n";
    }

    setText(result.trim());
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Lorem Ipsum Generator
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Number of Paragraphs
          </label>
          <input
            type="number"
            value={paragraphs}
            onChange={(e) => setParagraphs(e.target.value)}
            min="1"
            max="50"
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-yellow-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
          />
        </div>

        <button
          onClick={generate}
          className="w-full rounded-lg bg-yellow-600 px-6 py-3 font-medium text-white transition-colors hover:bg-yellow-700"
        >
          Generate Text
        </button>

        {text && (
          <div className="mt-6">
            <div className="mb-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
              <p className="whitespace-pre-wrap text-zinc-700 dark:text-zinc-300">{text}</p>
            </div>
            <button
              onClick={copyToClipboard}
              className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
            >
              {copied ? "Copied!" : "Copy to Clipboard"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

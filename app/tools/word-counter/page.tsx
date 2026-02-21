"use client";

import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  const counts = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split("\n").length : 0,
    paragraphs: text ? text.split(/\n\s*\n/).filter((p) => p.trim()).length : 0,
  };

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Word & Character Counter
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type or paste your text here..."
          className="mb-6 h-48 w-full rounded-lg border border-zinc-200 bg-zinc-50 p-4 text-zinc-900 placeholder-zinc-400 focus:border-violet-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg bg-violet-50 p-4 text-center dark:bg-violet-900/30">
            <p className="text-sm text-violet-600 dark:text-violet-400">Characters</p>
            <p className="text-2xl font-bold text-violet-900 dark:text-violet-50">{counts.characters}</p>
          </div>
          <div className="rounded-lg bg-violet-50 p-4 text-center dark:bg-violet-900/30">
            <p className="text-sm text-violet-600 dark:text-violet-400">Characters (no spaces)</p>
            <p className="text-2xl font-bold text-violet-900 dark:text-violet-50">{counts.charactersNoSpaces}</p>
          </div>
          <div className="rounded-lg bg-violet-50 p-4 text-center dark:bg-violet-900/30">
            <p className="text-sm text-violet-600 dark:text-violet-400">Words</p>
            <p className="text-2xl font-bold text-violet-900 dark:text-violet-50">{counts.words}</p>
          </div>
          <div className="rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Lines</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{counts.lines}</p>
          </div>
          <div className="rounded-lg bg-zinc-100 p-4 text-center dark:bg-zinc-800">
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Paragraphs</p>
            <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{counts.paragraphs}</p>
          </div>
        </div>
      </div>
    </main>
  );
}

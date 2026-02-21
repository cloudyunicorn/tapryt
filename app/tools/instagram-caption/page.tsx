"use client";

import { useState } from "react";

import CAPTION_CATEGORIES from "./captions.json";

type Category = keyof typeof CAPTION_CATEGORIES;

export default function InstagramCaptionGenerator() {
    const [selectedCategory, setSelectedCategory] = useState<Category | "Random">("Random");
    const [caption, setCaption] = useState("");
    const [copied, setCopied] = useState(false);

    const generateCaption = () => {
        let categoryToUse: Category;
        const categories = Object.keys(CAPTION_CATEGORIES) as Category[];

        if (selectedCategory === "Random") {
            categoryToUse = categories[Math.floor(Math.random() * categories.length)];
        } else {
            categoryToUse = selectedCategory;
        }

        const captions = CAPTION_CATEGORIES[categoryToUse];
        const randomCaption = captions[Math.floor(Math.random() * captions.length)];
        setCaption(randomCaption);
        setCopied(false);
    };

    const copyToClipboard = () => {
        if (!caption) return;
        navigator.clipboard.writeText(caption);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <main className="container mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Instagram Caption Generator
            </h1>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="mb-6 text-sm text-zinc-600 dark:text-zinc-400">
                    Need a quick caption for your next post? Select a category or generate a random one, and you're good to go!
                </p>

                {/* Category selector */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Category
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {(["Random", ...Object.keys(CAPTION_CATEGORIES)] as const).map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setSelectedCategory(cat as Category | "Random");
                                    setCaption("");
                                    setCopied(false);
                                }}
                                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${selectedCategory === cat
                                    ? "bg-fuchsia-600 text-white"
                                    : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Generate Button */}
                <button
                    onClick={generateCaption}
                    className="w-full rounded-lg bg-fuchsia-600 px-6 py-3 font-medium text-white transition-colors hover:bg-fuchsia-700"
                >
                    Generate Caption
                </button>

                {/* Output */}
                {caption && (
                    <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between">
                            <label className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Your Caption</label>
                        </div>
                        <div className="flex items-center justify-between gap-4 rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                            <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">{caption}</p>
                            <button
                                onClick={copyToClipboard}
                                className="flex-shrink-0 rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-600"
                            >
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

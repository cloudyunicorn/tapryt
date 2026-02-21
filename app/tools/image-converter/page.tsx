"use client";

import { useState, useRef } from "react";

const formats = ["png", "jpeg", "webp"] as const;
type Format = (typeof formats)[number];

export default function ImageConverter() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const [targetFormat, setTargetFormat] = useState<Format>("jpeg");
    const [quality, setQuality] = useState(90);
    const [converted, setConverted] = useState<string>("");
    const [originalSize, setOriginalSize] = useState(0);
    const [convertedSize, setConvertedSize] = useState(0);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !file.type.startsWith("image/")) return;
        setSelectedFile(file);
        setOriginalSize(file.size);
        setConverted("");
        const reader = new FileReader();
        reader.onload = (ev) => setPreview(ev.target?.result as string);
        reader.readAsDataURL(file);
    };

    const convert = () => {
        if (!preview) return;
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            if (targetFormat === "jpeg") {
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(img, 0, 0);
            const mimeType = `image/${targetFormat}`;
            const q = targetFormat === "png" ? undefined : quality / 100;
            const dataUrl = canvas.toDataURL(mimeType, q);
            setConverted(dataUrl);

            // estimate converted size
            const base64 = dataUrl.split(",")[1];
            const bytes = atob(base64).length;
            setConvertedSize(bytes);
        };
        img.src = preview;
    };

    const download = () => {
        if (!converted) return;
        const link = document.createElement("a");
        const name = selectedFile?.name.replace(/\.[^.]+$/, "") || "converted";
        link.download = `${name}.${targetFormat === "jpeg" ? "jpg" : targetFormat}`;
        link.href = converted;
        link.click();
    };

    const formatBytes = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <main className="container mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Image Converter
            </h1>

            <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                {/* File Upload */}
                <div className="mb-6">
                    <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Upload Image
                    </label>
                    <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-8 transition-colors hover:border-teal-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500">
                        <svg className="mb-2 h-8 w-8 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-zinc-500 dark:text-zinc-400">
                            {selectedFile ? selectedFile.name : "Click to select an image"}
                        </span>
                        <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                    </label>
                </div>

                {/* Target Format */}
                <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        Convert To
                    </label>
                    <div className="flex gap-2">
                        {formats.map((f) => (
                            <button
                                key={f}
                                onClick={() => { setTargetFormat(f); setConverted(""); }}
                                className={`flex-1 rounded-lg px-4 py-2 font-medium uppercase transition-colors ${targetFormat === f
                                        ? "bg-teal-600 text-white"
                                        : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                                    }`}
                            >
                                {f === "jpeg" ? "JPG" : f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Quality Slider */}
                {targetFormat !== "png" && (
                    <div className="mb-6">
                        <label className="mb-2 flex items-center justify-between text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            <span>Quality</span>
                            <span className="text-teal-600 dark:text-teal-400">{quality}%</span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="100"
                            value={quality}
                            onChange={(e) => { setQuality(Number(e.target.value)); setConverted(""); }}
                            className="w-full accent-teal-600"
                        />
                    </div>
                )}

                <button
                    onClick={convert}
                    disabled={!selectedFile}
                    className="w-full rounded-lg bg-teal-600 px-6 py-3 font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Convert
                </button>

                {/* Result */}
                {converted && (
                    <div className="mt-6 space-y-4">
                        <div className="flex items-center justify-between rounded-lg bg-zinc-50 p-4 dark:bg-zinc-800">
                            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                                <p>Original: <span className="font-medium text-zinc-900 dark:text-zinc-50">{formatBytes(originalSize)}</span></p>
                                <p>Converted: <span className="font-medium text-zinc-900 dark:text-zinc-50">{formatBytes(convertedSize)}</span></p>
                            </div>
                            <button
                                onClick={download}
                                className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                            >
                                Download
                            </button>
                        </div>
                        <div className="overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-700">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={converted} alt="Converted preview" className="w-full" />
                        </div>
                    </div>
                )}
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </main>
    );
}

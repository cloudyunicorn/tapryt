"use client";

import { useState, useRef, useCallback, useEffect } from "react";

interface PageData {
    pageNum: number;
    rotation: number;
    deleted: boolean;
}

interface TextItem {
    id: string;
    pageNum: number;
    text: string;
    originalText: string;
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    // PDF coordinate system values (for saving)
    pdfX: number;
    pdfY: number;
    pdfFontSize: number;
    edited: boolean;
}

interface TextAnnotation {
    id: string;
    pageNum: number;
    x: number;
    y: number;
    text: string;
    fontSize: number;
    color: string;
}

export default function PdfEditor() {
    const [file, setFile] = useState<File | null>(null);
    const [pdfBytes, setPdfBytes] = useState<ArrayBuffer | null>(null);
    const [pages, setPages] = useState<PageData[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [textItems, setTextItems] = useState<TextItem[]>([]);
    const [annotations, setAnnotations] = useState<TextAnnotation[]>([]);
    const [activeTool, setActiveTool] = useState<"select" | "text">("select");
    const [editingItem, setEditingItem] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [newText, setNewText] = useState("Type here");
    const [fontSize, setFontSize] = useState(16);
    const [textColor, setTextColor] = useState("#000000");
    const [saving, setSaving] = useState(false);
    const [scale, setScale] = useState(1.2);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const editInputRef = useRef<HTMLInputElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfDocRef = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const renderTaskRef = useRef<any>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f || f.type !== "application/pdf") return;
        setFile(f);
        const buffer = await f.arrayBuffer();
        setPdfBytes(buffer);
        setAnnotations([]);
        setTextItems([]);
        setCurrentPage(1);
        setActiveTool("select");
        setEditingItem(null);
    };

    const handleDrop = useCallback(async (e: React.DragEvent) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (!f || f.type !== "application/pdf") return;
        setFile(f);
        const buffer = await f.arrayBuffer();
        setPdfBytes(buffer);
        setAnnotations([]);
        setTextItems([]);
        setCurrentPage(1);
        setActiveTool("select");
        setEditingItem(null);
    }, []);

    // Load PDF
    useEffect(() => {
        if (!pdfBytes) return;
        let cancelled = false;

        const loadPdf = async () => {
            const pdfjsLib = await import("pdfjs-dist");
            pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

            const pdf = await pdfjsLib.getDocument({ data: pdfBytes.slice(0) }).promise;
            if (cancelled) return;
            pdfDocRef.current = pdf;

            const pageList: PageData[] = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                pageList.push({ pageNum: i, rotation: 0, deleted: false });
            }
            setPages(pageList);

            // Extract text items from all pages
            const allTextItems: TextItem[] = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const viewport = page.getViewport({ scale });

                for (const item of content.items) {
                    if (!("str" in item) || !(item as { str: string }).str.trim()) continue;
                    const textItem = item as {
                        str: string;
                        transform: number[];
                        width: number;
                        height: number;
                    };

                    // transform: [scaleX, skewY, skewX, scaleY, translateX, translateY]
                    const pdfFontSize = Math.abs(textItem.transform[0]);
                    const pdfX = textItem.transform[4];
                    const pdfY = textItem.transform[5];

                    // Convert from PDF to canvas coords using viewport
                    const [canvasX, canvasY] = viewport.convertToViewportPoint(pdfX, pdfY);

                    allTextItems.push({
                        id: `text-${i}-${allTextItems.length}`,
                        pageNum: i,
                        text: textItem.str,
                        originalText: textItem.str,
                        x: canvasX,
                        y: canvasY - pdfFontSize * scale, // adjust to top of text
                        width: textItem.width * scale,
                        height: pdfFontSize * scale + 4,
                        fontSize: pdfFontSize,
                        pdfX,
                        pdfY,
                        pdfFontSize,
                        edited: false,
                    });
                }
            }
            setTextItems(allTextItems);
        };

        loadPdf();
        return () => { cancelled = true; };
    }, [pdfBytes, scale]);

    // Render current page
    useEffect(() => {
        if (!pdfDocRef.current || pages.length === 0) return;
        const page = pages.find((p) => p.pageNum === currentPage);
        if (!page || page.deleted) return;

        let cancelled = false;

        // Cancel any in-flight render before starting a new one
        if (renderTaskRef.current) {
            renderTaskRef.current.cancel();
            renderTaskRef.current = null;
        }

        const renderPage = async () => {
            const pdfPage = await pdfDocRef.current.getPage(page.pageNum);
            if (cancelled) return;
            const canvas = canvasRef.current;
            if (!canvas) return;

            const viewport = pdfPage.getViewport({ scale, rotation: page.rotation });
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            const task = pdfPage.render({ canvasContext: ctx, viewport });
            renderTaskRef.current = task;

            try {
                await task.promise;
            } catch (err: unknown) {
                // Ignore cancellation errors
                if (err instanceof Error && err.message.includes("Rendering cancelled")) return;
                throw err;
            }

            if (cancelled) return;
            renderTaskRef.current = null;

            // Draw new annotations
            const pageAnns = annotations.filter((a) => a.pageNum === currentPage);
            for (const ann of pageAnns) {
                ctx.font = `${ann.fontSize}px sans-serif`;
                ctx.fillStyle = ann.color;
                ctx.fillText(ann.text, ann.x, ann.y);
            }

            // Overlay edited text: white-out original, draw new text
            const editedItems = textItems.filter(
                (t) => t.pageNum === currentPage && t.edited
            );
            for (const item of editedItems) {
                // White-out original area
                ctx.fillStyle = "#FFFFFF";
                ctx.fillRect(item.x, item.y, item.width + 20, item.height + 2);
                // Draw new text
                ctx.fillStyle = "#000000";
                ctx.font = `${item.fontSize * scale}px sans-serif`;
                ctx.fillText(item.text, item.x, item.y + item.fontSize * scale);
            }
        };

        renderPage();
        return () => {
            cancelled = true;
            if (renderTaskRef.current) {
                renderTaskRef.current.cancel();
                renderTaskRef.current = null;
            }
        };
    }, [currentPage, pages, scale, annotations, textItems]);

    // Focus edit input when editing
    useEffect(() => {
        if (editingItem && editInputRef.current) {
            editInputRef.current.focus();
            editInputRef.current.select();
        }
    }, [editingItem]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const clickX = (e.clientX - rect.left) * scaleX;
        const clickY = (e.clientY - rect.top) * scaleY;

        if (activeTool === "select") {
            // Check if clicking on an existing text item
            const currentItems = textItems.filter((t) => t.pageNum === currentPage);
            const clicked = currentItems.find(
                (t) =>
                    clickX >= t.x &&
                    clickX <= t.x + t.width + 20 &&
                    clickY >= t.y &&
                    clickY <= t.y + t.height + 2
            );

            if (clicked) {
                setEditingItem(clicked.id);
                setEditValue(clicked.text);
            } else {
                setEditingItem(null);
            }
        } else if (activeTool === "text") {
            const annotation: TextAnnotation = {
                id: crypto.randomUUID(),
                pageNum: currentPage,
                x: clickX,
                y: clickY,
                text: newText,
                fontSize,
                color: textColor,
            };
            setAnnotations((prev) => [...prev, annotation]);
        }
    };

    const confirmEdit = () => {
        if (!editingItem) return;
        setTextItems((prev) =>
            prev.map((t) =>
                t.id === editingItem
                    ? { ...t, text: editValue, edited: editValue !== t.originalText }
                    : t
            )
        );
        setEditingItem(null);
    };

    const cancelEdit = () => {
        setEditingItem(null);
        setEditValue("");
    };

    const rotatePage = (direction: 1 | -1) => {
        setPages((prev) =>
            prev.map((p) =>
                p.pageNum === currentPage
                    ? { ...p, rotation: (p.rotation + direction * 90 + 360) % 360 }
                    : p
            )
        );
    };

    const deletePage = () => {
        if (pages.filter((p) => !p.deleted).length <= 1) return;
        setPages((prev) =>
            prev.map((p) => (p.pageNum === currentPage ? { ...p, deleted: true } : p))
        );
        const remaining = pages.filter((p) => !p.deleted && p.pageNum !== currentPage);
        if (remaining.length > 0) setCurrentPage(remaining[0].pageNum);
    };

    const removeAnnotation = (id: string) => {
        setAnnotations((prev) => prev.filter((a) => a.id !== id));
    };

    const saveModifiedPdf = async () => {
        if (!pdfBytes) return;
        setSaving(true);

        try {
            const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib");
            const pdfDoc = await PDFDocument.load(pdfBytes);

            // Remove deleted pages (in reverse)
            const deletedIndices = pages
                .filter((p) => p.deleted)
                .map((p) => p.pageNum - 1)
                .sort((a, b) => b - a);
            for (const idx of deletedIndices) {
                pdfDoc.removePage(idx);
            }

            const activePgs = pages.filter((p) => !p.deleted);
            const pageMapping = new Map<number, number>();
            activePgs.forEach((p, i) => pageMapping.set(p.pageNum, i));

            // Apply rotations
            for (const pageData of activePgs) {
                if (pageData.rotation !== 0) {
                    const idx = pageMapping.get(pageData.pageNum)!;
                    const page = pdfDoc.getPage(idx);
                    const currentRotation = page.getRotation().angle;
                    page.setRotation({ type: 0, angle: currentRotation + pageData.rotation } as never);
                }
            }

            const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

            // Apply text edits (white-out + redraw)
            const editedItems = textItems.filter((t) => t.edited);
            for (const item of editedItems) {
                if (pages.find((p) => p.pageNum === item.pageNum)?.deleted) continue;
                const idx = pageMapping.get(item.pageNum);
                if (idx === undefined) continue;
                const page = pdfDoc.getPage(idx);
                const { height } = page.getSize();

                // White-out the original text area
                const pdfH = item.pdfFontSize + 4;
                page.drawRectangle({
                    x: item.pdfX - 1,
                    y: item.pdfY - 3,
                    width: item.width / scale + 22,
                    height: pdfH + 2,
                    color: rgb(1, 1, 1),
                });

                // Draw new text at original position
                page.drawText(item.text, {
                    x: item.pdfX,
                    y: item.pdfY,
                    size: item.pdfFontSize,
                    font,
                    color: rgb(0, 0, 0),
                });
            }

            // Apply new text annotations
            for (const ann of annotations) {
                if (pages.find((p) => p.pageNum === ann.pageNum)?.deleted) continue;
                const idx = pageMapping.get(ann.pageNum);
                if (idx === undefined) continue;
                const page = pdfDoc.getPage(idx);
                const { height } = page.getSize();

                const r = parseInt(ann.color.slice(1, 3), 16) / 255;
                const g = parseInt(ann.color.slice(3, 5), 16) / 255;
                const b = parseInt(ann.color.slice(5, 7), 16) / 255;

                const pdfFontSize = ann.fontSize / scale;
                page.drawText(ann.text, {
                    x: ann.x / scale,
                    y: height - ann.y / scale,
                    size: pdfFontSize,
                    font,
                    color: rgb(r, g, b),
                });
            }

            const modifiedBytes = await pdfDoc.save();
            const blob = new Blob([new Uint8Array(modifiedBytes)], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            const name = file?.name.replace(/\.pdf$/i, "") || "edited";
            link.download = `${name}_edited.pdf`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Save failed:", err);
        } finally {
            setSaving(false);
        }
    };

    const activePagesArr = pages.filter((p) => !p.deleted);
    const currentPageAnnotations = annotations.filter((a) => a.pageNum === currentPage);
    const currentEditedItems = textItems.filter((t) => t.pageNum === currentPage && t.edited);
    const editingItemData = editingItem ? textItems.find((t) => t.id === editingItem) : null;

    return (
        <main className="container mx-auto max-w-5xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                PDF Editor
            </h1>

            {!file ? (
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
                    <label
                        onDrop={handleDrop}
                        onDragOver={(e) => e.preventDefault()}
                        className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-300 bg-zinc-50 px-4 py-16 transition-colors hover:border-teal-400 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-teal-500"
                    >
                        <svg className="mb-3 h-12 w-12 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                            Drop a PDF here or click to browse
                        </span>
                        <input type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" />
                    </label>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Toolbar */}
                    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
                        <span className="mr-2 max-w-[150px] truncate text-sm font-medium text-zinc-600 dark:text-zinc-400">
                            {file.name}
                        </span>
                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

                        <button
                            onClick={() => { setActiveTool("select"); setEditingItem(null); }}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${activeTool === "select" ? "bg-teal-600 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}
                        >
                            ↖ Edit Text
                        </button>
                        <button
                            onClick={() => { setActiveTool("text"); setEditingItem(null); }}
                            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${activeTool === "text" ? "bg-teal-600 text-white" : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"}`}
                        >
                            T Add Text
                        </button>

                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

                        <button onClick={() => rotatePage(-1)} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400" title="Rotate Left">↺</button>
                        <button onClick={() => rotatePage(1)} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400" title="Rotate Right">↻</button>
                        <button onClick={deletePage} disabled={activePagesArr.length <= 1} className="rounded-lg bg-red-50 px-3 py-1.5 text-sm text-red-600 transition-colors hover:bg-red-100 disabled:opacity-40 dark:bg-red-900/30 dark:text-red-400" title="Delete Page">🗑</button>

                        <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-700" />

                        <button onClick={() => setScale((s) => Math.max(0.5, s - 0.2))} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">−</button>
                        <span className="text-xs text-zinc-500">{Math.round(scale * 100)}%</span>
                        <button onClick={() => setScale((s) => Math.min(3, s + 0.2))} className="rounded-lg bg-zinc-100 px-3 py-1.5 text-sm text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">+</button>

                        <div className="flex-1" />

                        <button onClick={saveModifiedPdf} disabled={saving} className="rounded-lg bg-teal-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:opacity-50">
                            {saving ? "Saving..." : "Save PDF"}
                        </button>
                    </div>

                    {/* Tool-specific options */}
                    {activeTool === "select" && (
                        <div className="flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-800 dark:bg-blue-900/20">
                            <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-xs font-medium text-blue-700 dark:text-blue-400">Click on any text in the PDF to edit it</span>
                        </div>
                    )}

                    {activeTool === "text" && (
                        <div className="flex flex-wrap items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 p-3 dark:border-teal-800 dark:bg-teal-900/20">
                            <span className="text-xs font-medium text-teal-700 dark:text-teal-400">Click on the page to add text</span>
                            <input type="text" value={newText} onChange={(e) => setNewText(e.target.value)} className="rounded border border-teal-300 bg-white px-2 py-1 text-sm dark:border-teal-700 dark:bg-zinc-800 dark:text-zinc-50" placeholder="Text content" />
                            <select value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} className="rounded border border-teal-300 bg-white px-2 py-1 text-sm dark:border-teal-700 dark:bg-zinc-800 dark:text-zinc-50">
                                {[12, 14, 16, 18, 20, 24, 28, 32, 40, 48].map((s) => (
                                    <option key={s} value={s}>{s}px</option>
                                ))}
                            </select>
                            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-8 w-8 cursor-pointer rounded border border-teal-300" />
                        </div>
                    )}

                    <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
                        {/* Canvas area */}
                        <div ref={containerRef} className="relative overflow-auto rounded-xl border border-zinc-200 bg-zinc-100 p-4 dark:border-zinc-800 dark:bg-zinc-950" style={{ maxHeight: "70vh" }}>
                            {pages.find((p) => p.pageNum === currentPage)?.deleted ? (
                                <div className="flex h-64 items-center justify-center text-zinc-400">Page deleted</div>
                            ) : (
                                <div className="relative inline-block">
                                    <canvas
                                        ref={canvasRef}
                                        onClick={handleCanvasClick}
                                        className={`mx-auto block shadow-lg ${activeTool === "text" ? "cursor-crosshair" : "cursor-pointer"}`}
                                    />
                                    {/* Inline edit overlay */}
                                    {editingItemData && (
                                        <div
                                            className="absolute"
                                            style={{
                                                left: `${editingItemData.x / (canvasRef.current?.width || 1) * 100}%`,
                                                top: `${editingItemData.y / (canvasRef.current?.height || 1) * 100}%`,
                                                minWidth: `${editingItemData.width / (canvasRef.current?.width || 1) * 100}%`,
                                            }}
                                        >
                                            <input
                                                ref={editInputRef}
                                                type="text"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter") confirmEdit();
                                                    if (e.key === "Escape") cancelEdit();
                                                }}
                                                className="w-full min-w-[120px] rounded border-2 border-teal-500 bg-white px-1 py-0.5 text-sm shadow-lg focus:outline-none dark:bg-zinc-900 dark:text-zinc-50"
                                                style={{ fontSize: `${editingItemData.fontSize * scale * 0.65}px` }}
                                            />
                                            <div className="mt-1 flex gap-1">
                                                <button onClick={confirmEdit} className="rounded bg-teal-600 px-2 py-0.5 text-xs text-white hover:bg-teal-700">✓ Save</button>
                                                <button onClick={cancelEdit} className="rounded bg-zinc-200 px-2 py-0.5 text-xs text-zinc-600 hover:bg-zinc-300 dark:bg-zinc-700 dark:text-zinc-300">✕ Cancel</button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-4">
                            {/* Page Navigator */}
                            <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                <h3 className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Pages ({activePagesArr.length})</h3>
                                <div className="flex flex-wrap gap-2">
                                    {pages.map((p) => p.deleted ? null : (
                                        <button key={p.pageNum} onClick={() => { setCurrentPage(p.pageNum); setEditingItem(null); }}
                                            className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${currentPage === p.pageNum ? "bg-teal-600 text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400"} ${p.rotation !== 0 ? "ring-2 ring-orange-400" : ""}`}
                                        >{p.pageNum}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Edited text items */}
                            {currentEditedItems.length > 0 && (
                                <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                    <h3 className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Edited Text ({currentEditedItems.length})</h3>
                                    <div className="space-y-2">
                                        {currentEditedItems.map((item) => (
                                            <div key={item.id} className="rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                                                <div className="text-xs text-red-400 line-through">{item.originalText}</div>
                                                <div className="text-sm text-zinc-900 dark:text-zinc-50">{item.text}</div>
                                                <button
                                                    onClick={() => setTextItems((prev) => prev.map((t) => t.id === item.id ? { ...t, text: t.originalText, edited: false } : t))}
                                                    className="mt-1 text-xs text-zinc-400 hover:text-zinc-600"
                                                >Undo</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New annotations */}
                            {currentPageAnnotations.length > 0 && (
                                <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                                    <h3 className="mb-3 text-sm font-medium text-zinc-600 dark:text-zinc-400">Added Text</h3>
                                    <div className="space-y-2">
                                        {currentPageAnnotations.map((ann) => (
                                            <div key={ann.id} className="flex items-center justify-between rounded-lg bg-zinc-50 px-3 py-2 dark:bg-zinc-800">
                                                <span className="truncate text-sm" style={{ color: ann.color }}>&quot;{ann.text}&quot;</span>
                                                <button onClick={() => removeAnnotation(ann.id)} className="ml-2 text-xs text-red-500 hover:text-red-700">✕</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Open another file */}
                            <label className="block cursor-pointer rounded-xl border border-dashed border-zinc-300 bg-zinc-50 p-3 text-center text-sm text-zinc-500 transition-colors hover:border-teal-400 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
                                Open another PDF
                                <input type="file" accept=".pdf,application/pdf" onChange={handleFileSelect} className="hidden" />
                            </label>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

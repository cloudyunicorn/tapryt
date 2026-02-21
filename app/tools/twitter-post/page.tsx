"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

export default function TwitterPostGenerator() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [verified, setVerified] = useState(true);
    const [tweetText, setTweetText] = useState("");
    const [time, setTime] = useState("");
    const [date, setDate] = useState("");
    const [views, setViews] = useState("");
    const [retweets, setRetweets] = useState("");
    const [quotes, setQuotes] = useState("");
    const [likes, setLikes] = useState("");
    const [bookmarks, setBookmarks] = useState("");
    const [profilePic, setProfilePic] = useState<string | null>(null);

    const [isExporting, setIsExporting] = useState(false);
    const postRef = useRef<HTMLDivElement>(null);

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setTarget: (url: string) => void
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (typeof event.target?.result === "string") {
                    setTarget(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const exportAsImage = async () => {
        if (!postRef.current) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(postRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#ffffff",
            });
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `x-post-${username || "username"}.png`;
            a.click();
        } catch (err) {
            console.error("Failed to export image:", err);
        } finally {
            setIsExporting(false);
        }
    };

    const defaultProfile = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

    return (
        <main className="container mx-auto max-w-5xl px-4 py-8 flex flex-col items-center">
            <div className="w-full mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    Twitter (X) Post Generator
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Create a fake X post. Fill out the details, preview it, and download the image.
                </p>
            </div>

            <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                {/* Controls */}
                <div className="flex-1 space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, setProfilePic)}
                            className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-sky-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-sky-700 hover:file:bg-sky-100 dark:file:bg-sky-900/30 dark:file:text-sky-400"
                        />
                    </div>

                    <hr className="border-zinc-200 dark:border-zinc-800" />

                    {/* Details */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Display Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="Elon Musk"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Username</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-500">@</span>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-300 pl-8 pr-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="elonmusk"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Time</label>
                            <input
                                type="text"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="4:20 PM"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Date</label>
                            <input
                                type="text"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="Apr 20, 2026"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Views</label>
                            <input
                                type="text"
                                value={views}
                                onChange={(e) => setViews(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="69M"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Retweets</label>
                            <input
                                type="text"
                                value={retweets}
                                onChange={(e) => setRetweets(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="42K"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Quotes</label>
                            <input
                                type="text"
                                value={quotes}
                                onChange={(e) => setQuotes(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="12K"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Likes</label>
                            <input
                                type="text"
                                value={likes}
                                onChange={(e) => setLikes(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="1.2M"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Bookmarks</label>
                            <input
                                type="text"
                                value={bookmarks}
                                onChange={(e) => setBookmarks(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="10K"
                            />
                        </div>

                        <div className="flex flex-col justify-end pb-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={verified}
                                    onChange={(e) => setVerified(e.target.checked)}
                                    className="rounded border-zinc-300 text-sky-500 focus:ring-sky-500"
                                />
                                Verified Badge
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Tweet Text</label>
                        <textarea
                            value={tweetText}
                            onChange={(e) => setTweetText(e.target.value)}
                            rows={4}
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            placeholder="Just bought another company."
                        />
                    </div>

                    <button
                        onClick={exportAsImage}
                        disabled={isExporting}
                        className="w-full rounded-lg bg-[#1da1f2] px-4 py-3 font-medium text-white transition-colors hover:bg-sky-600 disabled:opacity-50"
                    >
                        {isExporting ? "Exporting..." : "Download Tweet Image"}
                    </button>
                </div>

                {/* Preview Container */}
                <div className="flex w-full justify-center lg:w-[500px]">
                    {/* Post Card */}
                    <div
                        ref={postRef}
                        className="w-full max-w-[500px] bg-white text-zinc-900 border border-zinc-100 dark:border-zinc-200 overflow-hidden px-4 py-3"
                        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between pb-3">
                            <div className="flex items-center gap-3">
                                <img
                                    src={profilePic || defaultProfile}
                                    alt="Profile"
                                    className="h-12 w-12 rounded-full object-cover"
                                />
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[15px] font-bold leading-none hover:underline cursor-pointer">{name || "Elon Musk"}</span>
                                        {verified && (
                                            <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] text-[#1da1f2]" fill="currentColor">
                                                <g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.918-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.337 2.25c-.416-.165-.866-.25-1.336-.25-2.21 0-3.918 1.79-3.918 4 0 .495.084.965.238 1.4-1.273.65-2.148 2.02-2.148 3.6 0 1.52.81 2.84 2.008 3.52-.055.22-.08.45-.08.68 0 2.21 1.71 4 3.918 4 .47 0 .92-.086 1.336-.25.52 1.335 1.82 2.25 3.337 2.25s2.816-.915 3.337-2.25c.416.164.866.25 1.336.25 2.21 0 3.918-1.79 3.918-4 0-.23-.025-.46-.08-.68 1.198-.68 2.008-2 2.008-3.52zm-12.016 3.864l-3.36-3.36 1.415-1.415 1.944 1.944 5.35-5.35 1.415 1.415-6.764 6.766z" /></g>
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-[15px] text-zinc-500 leading-tight mt-1">@{username || "elonmusk"}</span>
                                </div>
                            </div>
                            {/* 3 dots */}
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 text-zinc-500"><g><path d="M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"></path></g></svg>
                        </div>

                        {/* Content */}
                        <div className="text-[15px] leading-normal text-[#0f1419] mb-3 whitespace-pre-wrap break-words" style={{ fontSize: '17px', lineHeight: '1.3125' }}>
                            {tweetText || "Just bought another company."}
                        </div>

                        {/* Details */}
                        <div className="flex items-center gap-1 text-[15px] text-zinc-500 mb-4 py-1">
                            <span>{time || "4:20 PM"}</span>
                            <span>·</span>
                            <span>{date || "Apr 20, 2026"}</span>
                            <span>·</span>
                            <span className="font-bold text-[#0f1419]">{views || "69M"}</span>
                            <span>Views</span>
                        </div>

                        <div className="w-full h-px bg-zinc-200 mb-4" />

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-[15px] text-zinc-500 mb-4">
                            <span className="flex items-center gap-1 hover:underline cursor-pointer"><span className="font-bold text-[#0f1419]">{retweets || "42K"}</span> Reposts</span>
                            <span className="flex items-center gap-1 hover:underline cursor-pointer"><span className="font-bold text-[#0f1419]">{quotes || "12K"}</span> Quotes</span>
                            <span className="flex items-center gap-1 hover:underline cursor-pointer"><span className="font-bold text-[#0f1419]">{likes || "1.2M"}</span> Likes</span>
                            <span className="flex items-center gap-1 hover:underline cursor-pointer"><span className="font-bold text-[#0f1419]">{bookmarks || "10K"}</span> Bookmarks</span>
                        </div>

                        <div className="w-full h-px bg-zinc-200 mb-4" />

                        {/* Action buttons */}
                        <div className="flex items-center justify-around text-zinc-500 pb-1">
                            {/* Reply */}
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22.5px] w-[22.5px]"><g><path d="M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z"></path></g></svg>
                            {/* Repost */}
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22.5px] w-[22.5px]"><g><path d="M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z"></path></g></svg>
                            {/* Like */}
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22.5px] w-[22.5px]"><g><path d="M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z"></path></g></svg>
                            {/* Bookmark */}
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22.5px] w-[22.5px]"><g><path d="M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z"></path></g></svg>
                            {/* Share */}
                            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[22.5px] w-[22.5px]"><g><path d="M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z"></path></g></svg>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

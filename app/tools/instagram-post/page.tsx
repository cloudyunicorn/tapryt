"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

export default function InstagramPostGenerator() {
    const [username, setUsername] = useState("");
    const [location, setLocation] = useState("");
    const [verified, setVerified] = useState(false);
    const [likes, setLikes] = useState("");
    const [caption, setCaption] = useState("");
    const [profilePic, setProfilePic] = useState<string | null>(null);
    const [postPic, setPostPic] = useState<string | null>(null);

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
            a.download = `ig-post-${username}.png`;
            a.click();
        } catch (err) {
            console.error("Failed to export image:", err);
        } finally {
            setIsExporting(false);
        }
    };

    // Generic avatar if no profile pic
    const defaultProfile = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";
    // Generic gradient placeholder if no post pic
    const defaultPost = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%23f1f5f9'/%3E%3Cpath d='M150 150l50 50 100-100' stroke='%23cbd5e1' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E";

    return (
        <main className="container mx-auto max-w-5xl px-4 py-8 flex flex-col items-center">
            <div className="w-full mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    Instagram Post Generator
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Create a fake Instagram post. Fill out the details, preview it, and download the image.
                </p>
            </div>

            <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                {/* Controls */}
                <div className="flex-1 space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">

                    {/* Images */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, setProfilePic)}
                                className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-fuchsia-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-fuchsia-700 hover:file:bg-fuchsia-100 dark:file:bg-fuchsia-900/30 dark:file:text-fuchsia-400"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Post Image</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, setPostPic)}
                                className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-fuchsia-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-fuchsia-700 hover:file:bg-fuchsia-100 dark:file:bg-fuchsia-900/30 dark:file:text-fuchsia-400"
                            />
                        </div>
                    </div>

                    <hr className="border-zinc-200 dark:border-zinc-800" />

                    {/* Details */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="username"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Location</label>
                            <input
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="Somewhere over the rainbow"
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Likes</label>
                            <input
                                type="text"
                                value={likes}
                                onChange={(e) => setLikes(e.target.value)}
                                className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                placeholder="1,234"
                            />
                        </div>
                        <div className="flex flex-col justify-end pb-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={verified}
                                    onChange={(e) => setVerified(e.target.checked)}
                                    className="rounded border-zinc-300 text-fuchsia-600 focus:ring-fuchsia-500"
                                />
                                Verified Badge
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Caption</label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            rows={3}
                            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                            placeholder="Living my best life ✨ #vibes"
                        />
                    </div>

                    <button
                        onClick={exportAsImage}
                        disabled={isExporting}
                        className="w-full rounded-lg bg-fuchsia-600 px-4 py-3 font-medium text-white transition-colors hover:bg-fuchsia-700 disabled:opacity-50"
                    >
                        {isExporting ? "Exporting..." : "Download Post Image"}
                    </button>
                </div>

                {/* Preview Container */}
                <div className="flex w-full justify-center lg:w-[450px]">
                    {/* Post Card */}
                    <div
                        ref={postRef}
                        className="w-full max-w-[400px] bg-white text-zinc-900 border border-zinc-200 overflow-hidden"
                        style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full overflow-hidden bg-zinc-100 flex-shrink-0">
                                    <img
                                        src={profilePic || defaultProfile}
                                        alt="Profile"
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center gap-1">
                                        <span className="text-[13px] font-semibold leading-none">{username || "username"}</span>
                                        {verified && (
                                            <svg viewBox="0 0 24 24" className="h-[14px] w-[14px] text-blue-500" fill="currentColor">
                                                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7L6 12.6l1.5-1.5 2.6 2.6 6.4-6.4 1.5 1.5-8.1 7.9z" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-[11px] text-zinc-500 leading-tight mt-0.5">{location || "Somewhere over the rainbow"}</span>
                                </div>
                            </div>
                            <svg className="h-5 w-5 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                            </svg>
                        </div>

                        {/* Image */}
                        <div className="w-full aspect-[4/5] bg-zinc-100 overflow-hidden flex items-center justify-center">
                            <img
                                src={postPic || defaultPost}
                                alt="Post"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Footie */}
                        <div className="p-3">
                            {/* Actions */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex gap-4">
                                    <svg className="h-6 w-6 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <svg aria-label="Comment" className="h-6 w-6 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <svg aria-label="Share Post" className="h-6 w-6 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                </div>
                                <div>
                                    <svg aria-label="Save" className="h-6 w-6 text-zinc-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </div>
                            </div>

                            {/* Likes */}
                            <div className="mb-1 text-[13px] font-semibold text-zinc-900">
                                {likes || "1,234"} likes
                            </div>

                            {/* Caption */}
                            <div className="text-[13px] text-zinc-900 leading-[18px]">
                                <span className="font-semibold mr-1">{username || "username"}</span>
                                {caption || "Living my best life ✨ #vibes"}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

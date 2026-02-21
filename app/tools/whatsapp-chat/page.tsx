"use client";

import { useState, useRef } from "react";
import { toPng } from "html-to-image";

type Message = {
    id: string;
    text: string;
    time: string;
    sender: "me" | "them";
    status: "sent" | "delivered" | "read" | "none";
};

export default function WhatsAppChatGenerator() {
    const [name, setName] = useState("");
    const [status, setStatus] = useState("");
    const [profilePic, setProfilePic] = useState<string | null>(null);

    const [messages, setMessages] = useState<Message[]>([
        { id: "1", text: "Hey! How are you?", time: "10:30 AM", sender: "them", status: "none" },
        { id: "2", text: "I'm good, thanks! You?", time: "10:32 AM", sender: "me", status: "read" },
    ]);

    // Temp state for new message
    const [newMessageText, setNewMessageText] = useState("");
    const [newMessageTime, setNewMessageTime] = useState("");
    const [newMessageSender, setNewMessageSender] = useState<"me" | "them">("me");
    const [newMessageStatus, setNewMessageStatus] = useState<"sent" | "delivered" | "read" | "none">("read");

    const [isExporting, setIsExporting] = useState(false);
    const chatRef = useRef<HTMLDivElement>(null);

    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (typeof event.target?.result === "string") {
                    setProfilePic(event.target.result);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const addMessage = () => {
        if (!newMessageText.trim()) return;
        setMessages([
            ...messages,
            {
                id: Date.now().toString(),
                text: newMessageText,
                time: newMessageTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                sender: newMessageSender,
                status: newMessageSender === "me" ? newMessageStatus : "none",
            },
        ]);
        setNewMessageText("");
    };

    const removeMessage = (id: string) => {
        setMessages(messages.filter((m) => m.id !== id));
    };

    const exportAsImage = async () => {
        if (!chatRef.current) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(chatRef.current, {
                cacheBust: true,
                pixelRatio: 2,
                backgroundColor: "#efeae2", // WA background color
            });
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = `wa-chat-${name || "contact"}.png`;
            a.click();
        } catch (err) {
            console.error("Failed to export image:", err);
        } finally {
            setIsExporting(false);
        }
    };

    const defaultProfile = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23ccc'%3E%3Cpath d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/%3E%3C/svg%3E";

    // WhatsApp typical background pattern can be simulated with a faint repeating background, but a solid color works too.
    const chatBgColor = "#efe7dd";

    return (
        <main className="container mx-auto max-w-5xl px-4 py-8 flex flex-col items-center">
            <div className="w-full mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                    WhatsApp Chat Generator
                </h1>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                    Create a fake WhatsApp chat screen. Customize the header and add your messages.
                </p>
            </div>

            <div className="flex w-full flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
                {/* Controls */}
                <div className="flex-1 space-y-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
                    {/* Header Controls */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Header Defaults</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Profile Picture</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="block w-full text-sm text-zinc-500 file:mr-4 file:rounded-md file:border-0 file:bg-[#25D366]/10 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#128C7E] hover:file:bg-[#25D366]/20 dark:file:bg-[#25D366]/20 dark:file:text-[#25D366]"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Contact Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="Mom"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Status</label>
                                <input
                                    type="text"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="online"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-zinc-200 dark:border-zinc-800" />

                    {/* Messages Controls */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Add Message</h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Message Text</label>
                                <textarea
                                    value={newMessageText}
                                    onChange={(e) => setNewMessageText(e.target.value)}
                                    rows={2}
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="Type a message..."
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Time</label>
                                <input
                                    type="text"
                                    value={newMessageTime}
                                    onChange={(e) => setNewMessageTime(e.target.value)}
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    placeholder="10:30 AM"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Sender</label>
                                <select
                                    value={newMessageSender}
                                    onChange={(e) => setNewMessageSender(e.target.value as "me" | "them")}
                                    className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                >
                                    <option value="me">Me (Sent)</option>
                                    <option value="them">Them (Received)</option>
                                </select>
                            </div>
                            {newMessageSender === "me" && (
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Read Status</label>
                                    <select
                                        value={newMessageStatus}
                                        onChange={(e) => setNewMessageStatus(e.target.value as any)}
                                        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
                                    >
                                        <option value="sent">Sent (Single Tick)</option>
                                        <option value="delivered">Delivered (Double Tick)</option>
                                        <option value="read">Read (Blue Ticks)</option>
                                    </select>
                                </div>
                            )}
                        </div>
                        <button
                            onClick={addMessage}
                            className="w-full rounded-lg bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
                        >
                            Add Message
                        </button>
                    </div>

                    {/* Message Manager */}
                    {messages.length > 0 && (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {messages.map((m) => (
                                <div key={m.id} className="flex items-center justify-between gap-4 p-2 bg-zinc-50 rounded-lg dark:bg-zinc-800">
                                    <div className="flex flex-col truncate">
                                        <span className="text-xs font-semibold text-zinc-500 overflow-hidden text-ellipsis whitespace-nowrap">{m.sender === "me" ? "Me" : "Them"} • {m.time}</span>
                                        <span className="text-sm truncate">{m.text}</span>
                                    </div>
                                    <button
                                        onClick={() => removeMessage(m.id)}
                                        className="text-red-500 hover:text-red-700 flex-shrink-0"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <hr className="border-zinc-200 dark:border-zinc-800" />

                    <button
                        onClick={exportAsImage}
                        disabled={isExporting}
                        className="w-full rounded-lg bg-[#25D366] px-4 py-3 font-medium text-white transition-colors hover:bg-[#128C7E] disabled:opacity-50"
                    >
                        {isExporting ? "Exporting..." : "Download Chat Image"}
                    </button>
                </div>

                {/* Preview Container */}
                <div className="flex w-full justify-center lg:w-[400px]">
                    {/* Chat Window */}
                    <div
                        ref={chatRef}
                        className="w-full max-w-[400px] h-[700px] bg-[#efeae2] overflow-hidden flex flex-col relative"
                        style={{ fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif" }}
                    >
                        {/* Header */}
                        <div className="bg-[#075E54] text-white px-2 py-2 flex items-center gap-2 shadow-sm z-10 sticky top-0">
                            <div className="flex items-center">
                                <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                    <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"></path>
                                </svg>
                                <img
                                    src={profilePic || defaultProfile}
                                    alt="Profile"
                                    className="h-[36px] w-[36px] rounded-full object-cover ml-1 bg-white"
                                />
                            </div>
                            <div className="flex flex-col flex-1 truncate ml-1">
                                <span className="font-semibold text-[16px] leading-tight truncate">{name || "Contact Name"}</span>
                                <span className="text-[12px] opacity-90 truncate leading-tight">{status || "online"}</span>
                            </div>
                            <div className="flex items-center gap-4 px-2">
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z"></path>
                                </svg>
                                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                                    <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"></path>
                                </svg>
                                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"></path>
                                </svg>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2 relative">
                            {/* WhatsApp Doodle Background Pattern Note: We use a solid color base for simplicity 
                                but users can add a doodle image as a background if they want. */}

                            {messages.map((m, index) => {
                                const isMe = m.sender === "me";
                                return (
                                    <div
                                        key={m.id}
                                        className={`flex flex-col max-w-[80%] ${isMe ? 'self-end' : 'self-start'}`}
                                    >
                                        <div
                                            className={`relative px-2 py-1.5 rounded-lg text-[14.5px] leading-relaxed shadow-sm flex flex-col ${isMe ? 'bg-[#dcf8c6] rounded-tr-none' : 'bg-white rounded-tl-none'}`}
                                        >
                                            {/* Tail */}
                                            {isMe ? (
                                                <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -right-2 text-[#dcf8c6]" fill="currentColor">
                                                    <path d="M5.188 1H0v11.193l6.422-5.487c.725-.62.793-1.714.152-2.428L5.188 1z" />
                                                </svg>
                                            ) : (
                                                <svg viewBox="0 0 8 13" width="8" height="13" className="absolute top-0 -left-2 text-white" fill="currentColor">
                                                    <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" />
                                                </svg>
                                            )}

                                            <span className="pr-14 break-words" style={{ paddingRight: isMe ? '4rem' : '3.5rem' }}>{m.text}</span>
                                            <div className="flex items-center gap-1 justify-end mt-[-10px] self-end h-[15px] pb-0.5">
                                                <span className="text-[10px] text-zinc-500 select-none whitespace-nowrap">{m.time}</span>
                                                {isMe && (
                                                    <span className="mt-0.5">
                                                        {m.status === "sent" && (
                                                            <svg viewBox="0 0 16 15" width="16" height="15" fill="#a0a4a8">
                                                                <path d="M10.91 3.316l-.478-.372a.365.365 0 00-.51.063L4.566 9.879a.32.32 0 01-.484.033L1.891 7.769a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51z" />
                                                            </svg>
                                                        )}
                                                        {m.status === "delivered" && (
                                                            <svg viewBox="0 0 16 15" width="16" height="15" fill="#a0a4a8">
                                                                <path d="M15.01 3.316l-.478-.372a.365.365 0 00-.51.063L8.666 9.879a.32.32 0 01-.484.033l-.358-.325a.319.319 0 00-.484.032l-.378.483a.418.418 0 00.036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 00-.064-.512zm-4.1 0l-.478-.372a.365.365 0 00-.51.063L4.566 9.879a.32.32 0 01-.484.033L1.891 7.769a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51z" />
                                                            </svg>
                                                        )}
                                                        {m.status === "read" && (
                                                            <svg viewBox="0 0 16 15" width="16" height="15" fill="#4fc3f7">
                                                                <path d="M15.01 3.316l-.478-.372a.365.365 0 00-.51.063L8.666 9.879a.32.32 0 01-.484.033l-.358-.325a.319.319 0 00-.484.032l-.378.483a.418.418 0 00.036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 00-.064-.512zm-4.1 0l-.478-.372a.365.365 0 00-.51.063L4.566 9.879a.32.32 0 01-.484.033L1.891 7.769a.366.366 0 00-.515.006l-.423.433a.364.364 0 00.006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 00-.063-.51z" />
                                                            </svg>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer Input Area Placeholder */}
                        <div className="bg-transparent p-2 sticky bottom-0">
                            <div className="flex items-end gap-2 relative">
                                <div className="flex-1 bg-white rounded-full min-h-[44px] flex items-center px-3 gap-3 shadow-sm">
                                    <svg viewBox="0 0 24 24" width="24" height="24" className="text-zinc-400 flex-shrink-0" fill="currentColor">
                                        <path d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm-3.204 1.362c-.026-.307-.131 5.218 6.063 5.551 6.066-.25 6.066-5.551 6.066-5.551-6.078 1.416-12.129 0-12.129 0zm11.363-1.108s-.669 1.959-5.051 1.959c-3.379 0-5.549-2.158-5.549-2.158-1.586.207-1.071 2.505 5.051 2.505 6.122 0 5.549-2.306 5.549-2.306zm-4.126-2.215c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962z"></path>
                                    </svg>
                                    <span className="flex-1 text-zinc-400 text-[15px]">Message</span>
                                    <svg viewBox="0 0 24 24" width="24" height="24" className="text-zinc-400 flex-shrink-0" fill="currentColor">
                                        <path d="M21.58 12.04l-6.47 5.76v-3.8h-6v-3.92h6V6.3l6.47 5.74zM8.11 16.08h-2v-8.1h2v8.1zM5 16.08H3v-8.1h2v8.1z"></path>
                                    </svg>
                                    <svg viewBox="0 0 24 24" width="24" height="24" className="text-zinc-400 flex-shrink-0" fill="currentColor">
                                        <path d="M12 21.05a9 9 0 110-18 9 9 0 010 18zm0-16a7 7 0 100 14 7 7 0 000-14zm.8 11.23h-1.6v-3h1.6v3zm-.8-3.92a2.33 2.33 0 01-1.35-4.14 2 2 0 112.92-1.6c0 1.05-.62 1.62-1.22 2.14-.54.49-.6.84-.55 1.43.06.66-.4 1.25-.94 1.25-.37 0-.74-.29-.68-.82.1-.96.96-1.57 1.48-1.98.53-.42.92-.76.92-1.41a1.2 1.2 0 10-1.74-1.07c0 .5-.47.9-1.08.77a.89.89 0 01-.73-1.01 2.45 2.45 0 014.93-.05c0 1.26-.95 1.9-1.55 2.46-.5.44-.65.65-.62 1h1.61c.64 0 1 .49.92 1.03h-.62z"></path>
                                    </svg>
                                </div>
                                <div className="h-[44px] w-[44px] rounded-full bg-[#00897B] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                                    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                                        <path d="M11.999 14.942c2.001 0 3.531-1.53 3.531-3.531V4.35c0-2.001-1.53-3.531-3.531-3.531S8.469 2.35 8.469 4.35v7.061c0 2.001 1.53 3.531 3.53 3.531zm6.238-3.53c0 3.531-2.942 6.002-6.237 6.002s-6.237-2.471-6.237-6.002H3.761c0 4.001 3.178 7.297 7.061 7.885v3.884h2.354v-3.884c3.884-.588 7.061-3.884 7.061-7.885h-2.002z"></path>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

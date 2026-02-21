"use client";

import { useState } from "react";

const timezones = [
  { name: "UTC", offset: 0 },
  { name: "New York", offset: -5 },
  { name: "Los Angeles", offset: -8 },
  { name: "London", offset: 0 },
  { name: "Paris", offset: 1 },
  { name: "Berlin", offset: 1 },
  { name: "Tokyo", offset: 9 },
  { name: "Sydney", offset: 11 },
  { name: "Mumbai", offset: 5.5 },
  { name: "Singapore", offset: 8 },
  { name: "Dubai", offset: 4 },
  { name: "Hong Kong", offset: 8 },
  { name: "Shanghai", offset: 8 },
  { name: "Seoul", offset: 9 },
  { name: "Moscow", offset: 3 },
  { name: "Sao Paulo", offset: -3 },
  { name: "Toronto", offset: -5 },
  { name: "Chicago", offset: -6 },
  { name: "Denver", offset: -7 },
  { name: "Amsterdam", offset: 1 },
  { name: "Stockholm", offset: 1 },
];

export default function TimezoneConverter() {
  const [baseTimezone, setBaseTimezone] = useState(0);
  const [baseTime, setBaseTime] = useState("12:00");
  const [baseDate, setBaseDate] = useState(new Date().toISOString().split("T")[0]);
  const [conversions, setConversions] = useState<{ name: string; time: string; date: string; offset: number }[]>([]);

  const convert = () => {
    const [hours, minutes] = baseTime.split(":").map(Number);
    const [year, month, day] = baseDate.split("-").map(Number);

    // Calculate the base time entirely in UTC to bypass browser timezone issues
    const baseUTC = Date.UTC(year, month - 1, day, hours, minutes, 0, 0);

    const results = timezones
      .filter((tz) => tz.offset !== baseTimezone)
      .map((tz) => {
        // Find difference between target offset and base offset
        const offsetDiffHours = tz.offset - baseTimezone;
        const convertedUTC = baseUTC + offsetDiffHours * 60 * 60 * 1000;
        const convertedDate = new Date(convertedUTC);

        return {
          name: tz.name,
          time: convertedDate.toLocaleTimeString("en-US", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", hour12: true }),
          date: convertedDate.toLocaleDateString("en-US", { timeZone: "UTC", month: "short", day: "numeric", year: "numeric" }),
          offset: tz.offset,
        };
      });

    setConversions(results);
  };

  return (
    <main className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-zinc-900 dark:text-zinc-50">
        Timezone Converter
      </h1>

      <div className="mb-6 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Base Timezone
            </label>
            <select
              value={baseTimezone}
              onChange={(e) => setBaseTimezone(Number(e.target.value))}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-cyan-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            >
              {timezones.map((tz) => (
                <option key={tz.name} value={tz.offset}>
                  {tz.name} (UTC{tz.offset >= 0 ? `+${tz.offset}` : tz.offset})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Time
            </label>
            <input
              type="time"
              value={baseTime}
              onChange={(e) => setBaseTime(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-cyan-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Date
            </label>
            <input
              type="date"
              value={baseDate}
              onChange={(e) => setBaseDate(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 focus:border-cyan-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
            />
          </div>
        </div>
        <button
          onClick={convert}
          className="mt-4 w-full rounded-lg bg-cyan-600 px-6 py-3 font-medium text-white transition-colors hover:bg-cyan-700"
        >
          Convert
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {conversions.map((conv) => (
          <div
            key={conv.name}
            className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div>
              <p className="font-medium text-zinc-900 dark:text-zinc-50">{conv.name}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                UTC{conv.offset >= 0 ? `+${conv.offset}` : conv.offset}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{conv.time}</p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{conv.date}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

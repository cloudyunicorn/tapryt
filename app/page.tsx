import Link from "next/link";

const categories = [
  {
    name: "Math",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: "bg-blue-500",
    tools: [
      { name: "Unit Converter", href: "/tools/unit-converter", desc: "Convert length, weight, temp, volume & more" },
      { name: "Percentage Calculator", href: "/tools/percentage", desc: "Calculate percentages easily" },
      { name: "Scientific Calculator", href: "/tools/scientific-calculator", desc: "Advanced math operations" },
      { name: "Number Base Converter", href: "/tools/base-converter", desc: "Hex, Binary, Octal, Decimal" },
      { name: "Discount Calculator", href: "/tools/discount", desc: "Calculate discounts and savings" },
    ],
  },
  {
    name: "Finance",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "bg-green-500",
    tools: [
      { name: "EMI Calculator", href: "/tools/emi", desc: "Calculate loan EMIs" },
      { name: "SIP Calculator", href: "/tools/sip", desc: "Systematic Investment Plan returns" },
      { name: "Interest Calculator", href: "/tools/interest", desc: "Simple & compound interest" },
      { name: "Tip Calculator", href: "/tools/tip-calculator", desc: "Calculate tips quickly" },
    ],
  },
  {
    name: "Health",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    color: "bg-emerald-500",
    tools: [
      { name: "Health Parameters", href: "/tools/health", desc: "BMI, BMR, ideal weight, calories" },
      { name: "BMI Calculator", href: "/tools/bmi", desc: "Body Mass Index calculator" },
      { name: "Calorie Calculator", href: "/tools/calorie", desc: "Daily calorie needs" },
      { name: "BAC Calculator", href: "/tools/bac", desc: "Blood alcohol concentration" },
    ],
  },
  {
    name: "Date & Time",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: "bg-purple-500",
    tools: [
      { name: "Date Difference", href: "/tools/date-difference", desc: "Calculate days between dates" },
      { name: "Timezone Converter", href: "/tools/timezone", desc: "Convert time across timezones" },
      { name: "Age Calculator", href: "/tools/age", desc: "Calculate exact age" },
    ],
  },
  {
    name: "Developer Tools",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    color: "bg-orange-500",
    tools: [
      { name: "JSON Formatter", href: "/tools/json-formatter", desc: "Format & validate JSON" },
      { name: "Regex Tester", href: "/tools/regex-tester", desc: "Test regular expressions" },
      { name: "Hash Generator", href: "/tools/hash-generator", desc: "MD5, SHA, and more" },
      { name: "Base64 Encoder", href: "/tools/base64", desc: "Encode & decode Base64" },
      { name: "URL Encoder", href: "/tools/url-encoder", desc: "URL encode & decode" },
      { name: "UUID Generator", href: "/tools/uuid-generator", desc: "Generate UUIDs" },
    ],
  },
  {
    name: "Security",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: "bg-red-500",
    tools: [
      { name: "Password Generator", href: "/tools/password-generator", desc: "Generate secure passwords" },
    ],
  },
  {
    name: "Utilities",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    color: "bg-cyan-500",
    tools: [
      { name: "Word Counter", href: "/tools/word-counter", desc: "Count words & characters" },
      { name: "Color Converter", href: "/tools/color-converter", desc: "HEX, RGB, HSL conversion" },
      { name: "Lorem Ipsum", href: "/tools/lorem-ipsum", desc: "Generate placeholder text" },
    ],
  },
  {
    name: "File Convert",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
    color: "bg-teal-500",
    tools: [
      { name: "Image Converter", href: "/tools/image-converter", desc: "Convert PNG, JPG, WebP formats" },
      { name: "CSV ↔ JSON", href: "/tools/csv-json", desc: "Convert between CSV and JSON" },
      { name: "Markdown → HTML", href: "/tools/markdown-html", desc: "Convert Markdown to HTML" },
      { name: "PDF → Word", href: "/tools/pdf-to-word", desc: "Convert PDF to Word document" },
    ],
  },
  {
    name: "Reference",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    color: "bg-pink-500",
    tools: [
      { name: "Periodic Table", href: "/tools/periodic-table", desc: "Interactive periodic table" },
      { name: "Chemicals Reference", href: "/tools/chemicals", desc: "Everyday chemicals info" },
    ],
  },
];

export default function Home() {
  return (
    <main className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Multi-Tool Website
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
          30+ useful calculators and tools for everyday needs
        </p>
      </div>

      <div className="space-y-10">
        {categories.map((category) => (
          <div key={category.name}>
            <div className="mb-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-white ${category.color}`}>
                {category.icon}
              </div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {category.name}
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {category.tools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="group relative overflow-hidden rounded-xl border border-zinc-200 bg-white p-4 transition-all hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
                >
                  <h3 className="mb-1 font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {tool.desc}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

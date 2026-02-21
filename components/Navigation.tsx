"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const tools = [
  {
    name: "Math",
    items: [
      { name: "Unit Converter", href: "/tools/unit-converter", description: "Convert length, weight, temp, volume" },
      { name: "Percentage Calculator", href: "/tools/percentage", description: "Calculate percentages easily" },
      { name: "Scientific Calculator", href: "/tools/scientific-calculator", description: "Advanced math operations" },
      { name: "Number Base Converter", href: "/tools/base-converter", description: "Hex, Binary, Octal, Decimal" },
      { name: "Discount Calculator", href: "/tools/discount", description: "Calculate discounts and savings" },
    ],
  },
  {
    name: "Finance",
    items: [
      { name: "EMI Calculator", href: "/tools/emi", description: "Calculate loan EMIs" },
      { name: "SIP Calculator", href: "/tools/sip", description: "Systematic Investment Plan" },
      { name: "Interest Calculator", href: "/tools/interest", description: "Simple & compound interest" },
      { name: "Tip Calculator", href: "/tools/tip-calculator", description: "Calculate tips quickly" },
    ],
  },
  {
    name: "Health",
    items: [
      { name: "Health Parameters", href: "/tools/health", description: "BMI, BMR, ideal weight" },
      { name: "BMI Calculator", href: "/tools/bmi", description: "Body Mass Index" },
      { name: "Calorie Calculator", href: "/tools/calorie", description: "Daily calorie needs" },
      { name: "BAC Calculator", href: "/tools/bac", description: "Blood alcohol concentration" },
    ],
  },
  {
    name: "Date & Time",
    items: [
      { name: "Date Difference", href: "/tools/date-difference", description: "Days between dates" },
      { name: "Timezone Converter", href: "/tools/timezone", description: "Convert across timezones" },
      { name: "Age Calculator", href: "/tools/age", description: "Calculate exact age" },
    ],
  },
  {
    name: "Developer",
    items: [
      { name: "JSON Formatter", href: "/tools/json-formatter", description: "Format & validate JSON" },
      { name: "Regex Tester", href: "/tools/regex-tester", description: "Test regular expressions" },
      { name: "Hash Generator", href: "/tools/hash-generator", description: "MD5, SHA-256, SHA-512" },
      { name: "Base64 Encoder", href: "/tools/base64", description: "Encode & decode Base64" },
      { name: "URL Encoder", href: "/tools/url-encoder", description: "URL encode & decode" },
      { name: "UUID Generator", href: "/tools/uuid-generator", description: "Generate UUIDs" },
    ],
  },
  {
    name: "Security",
    items: [
      { name: "Password Generator", href: "/tools/password-generator", description: "Generate secure passwords" },
    ],
  },
  {
    name: "Utilities",
    items: [
      { name: "Word Counter", href: "/tools/word-counter", description: "Count words & characters" },
      { name: "Color Converter", href: "/tools/color-converter", description: "HEX, RGB, HSL conversion" },
      { name: "Lorem Ipsum", href: "/tools/lorem-ipsum", description: "Generate placeholder text" },
    ],
  },
  {
    name: "Reference",
    items: [
      { name: "Periodic Table", href: "/tools/periodic-table", description: "Interactive periodic table" },
      { name: "Chemicals Reference", href: "/tools/chemicals", description: "Everyday chemicals info" },
    ],
  },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-zinc-900 dark:text-zinc-50"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          Tapryt
        </Link>

        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            {tools.map((category) => (
              <NavigationMenuItem key={category.name}>
                <NavigationMenuTrigger className={cn(
                  "text-sm font-medium",
                  pathname.startsWith("/tools")
                    ? "text-zinc-900 dark:text-zinc-50"
                    : "text-zinc-500 dark:text-zinc-400"
                )}>
                  {category.name}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[600px] grid-cols-2 gap-4 p-4 lg:w-[700px]">
                    {category.items.map((item) => (
                      <NavigationMenuLink asChild key={item.href}>
                        <Link
                          href={item.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-zinc-100 focus:bg-zinc-100 dark:hover:bg-zinc-800 dark:focus:bg-zinc-800"
                        >
                          <div className="text-sm font-medium leading-none text-zinc-900 dark:text-zinc-50">
                            {item.name}
                          </div>
                          <p className="line-clamp-2 text-sm leading-snug text-zinc-500 dark:text-zinc-400">
                            {item.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    ))}
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <Link
          href="/"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50 lg:hidden"
        >
          All Tools
        </Link>
      </div>
    </header>
  );
}

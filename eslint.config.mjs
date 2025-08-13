import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Extend Next.js configs
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  
  // Global ignores for generated files
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/lib/generated/**",
      "**/prisma/generated/**",
      "**/prisma/migrations/**",
      "**/.vercel/**",
      "**/dist/**",
      "**/build/**",
      "**/*.config.js",
      "**/*.config.mjs",
    ],
  },
  
  // Rules for TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-require-imports": "error",
      // Allow empty object type for Prisma compatibility
      "@typescript-eslint/ban-types": [
        "error",
        {
          extendDefaults: true,
          types: {
            "{}": false,
          },
        },
      ],
    },
  },
  
  // More lenient rules for generated/config files
  {
    files: [
      "**/*.config.*",
      "**/generated/**",
      "**/prisma/**",
      "**/.next/**",
    ],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/ban-types": "off",
    },
  },
];

export default eslintConfig;

const fs = require('fs');
const pagePath = 'app/tools/periodic-table/page.tsx';
let content = fs.readFileSync(pagePath, 'utf8');

const elementsList = fs.readFileSync('elements.txt', 'utf8');

const updatedElements = `const elements: Element[] = [\n  ${elementsList}\n];`;

content = content.replace(/const elements: Element\[\] = \[[\s\S]*?\];/, updatedElements);

const updatedCategories = `const categoryColors: Record<string, string> = {
  "nonmetal": "bg-yellow-200 text-yellow-800",
  "noble-gas": "bg-purple-200 text-purple-800",
  "alkali": "bg-red-200 text-red-800",
  "alkaline": "bg-orange-200 text-orange-800",
  "metalloid": "bg-green-200 text-green-800",
  "halogen": "bg-cyan-200 text-cyan-800",
  "metal": "bg-blue-200 text-blue-800",
  "lanthanide": "bg-pink-200 text-pink-800",
  "actinide": "bg-rose-200 text-rose-800",
  "unknown": "bg-zinc-200 text-zinc-800",
};`;

content = content.replace(/const categoryColors: Record<string, string> = \{[\s\S]*?\};/, updatedCategories);

fs.writeFileSync(pagePath, content);
console.log('Successfully updated page.tsx');

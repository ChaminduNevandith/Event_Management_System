const fs = require('fs');

const files = [
  'apps/web/src/app/invite/[token]/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/map/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/budget/page.tsx',
  'apps/web/src/app/(dashboard)/friends/page.tsx'
];

const skeletonHTML = `
      <div className="space-y-6 w-full mt-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-1/3 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-3xl" />
          <Skeleton className="h-48 rounded-3xl hidden md:block" />
          <Skeleton className="h-48 rounded-3xl hidden lg:block" />
        </div>
      </div>
`.trim();

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;

  const replacePatterns = [
    /<p className="[^"]*animate-pulse[^"]*">Loading invitation...<\/p>/g,
    /<p className="[^"]*font-bold[^"]*">Loading Map Data...<\/p>/g,
    /<div className="[^"]*">Loading ledger...<\/div>/g,
    /<div className="[^"]*">Loading friends...<\/div>/g,
    /<div>Loading\.\.\.<\/div>/g
  ];

  for (let regex of replacePatterns) {
    if (regex.test(content)) {
      content = content.replace(regex, skeletonHTML);
      modified = true;
    }
  }

  const basicLoadingRegex = /<div className="p-8 text-center text-slate-500">Loading...<\/div>/g;
  if (basicLoadingRegex.test(content)) {
    content = content.replace(basicLoadingRegex, skeletonHTML);
    modified = true;
  }

  if (modified) {
    if (!content.includes('Skeleton')) {
        if (content.includes('lucide-react')) {
            content = content.replace(/import {([^}]+)} from "lucide-react";/, 'import { $1 } from "lucide-react";\nimport { Skeleton } from "@/components/ui/skeleton";');
        } else {
            content = 'import { Skeleton } from "@/components/ui/skeleton";\n' + content;
        }
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated ' + file);
  }
});

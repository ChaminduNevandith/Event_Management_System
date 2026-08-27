const fs = require('fs');

const files = [
  'apps/web/src/app/(dashboard)/trips/[id]/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/tasks/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/transport/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/places/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/map/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/destinations/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/decisions/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/chat/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/activity/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/accommodations/page.tsx',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  const hasSpinner = content.includes('animate-spin');
  if (!hasSpinner) return;

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

  let modified = false;
  
  const spinnerRegex = /<div className="[^"]*animate-spin[^"]*"><\/div>/g;
  
  const parentRegex = /<div className="flex h-[0-9a-z]* items-center justify-center">\s*<div className="[^"]*animate-spin[^"]*"><\/div>\s*<\/div>/g;
  const parentRegex2 = /<div className="h-[0-9a-z]* flex items-center justify-center">\s*<div className="[^"]*animate-spin[^"]*"><\/div>\s*<\/div>/g;
  const parentRegex3 = /<div className="flex items-center justify-center py-[0-9]*">\s*<div className="[^"]*animate-spin[^"]*"><\/div>\s*<\/div>/g;
  const parentRegex4 = /<div className="flex justify-center items-center h-[0-9a-z]*">\s*<div className="[^"]*animate-spin[^"]*"><\/div>\s*<\/div>/g;
  
  if (parentRegex.test(content)) {
    content = content.replace(parentRegex, skeletonHTML);
    modified = true;
  } else if (parentRegex2.test(content)) {
    content = content.replace(parentRegex2, skeletonHTML);
    modified = true;
  } else if (parentRegex3.test(content)) {
    content = content.replace(parentRegex3, skeletonHTML);
    modified = true;
  } else if (parentRegex4.test(content)) {
    content = content.replace(parentRegex4, skeletonHTML);
    modified = true;
  } else if (spinnerRegex.test(content)) {
    content = content.replace(spinnerRegex, skeletonHTML);
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

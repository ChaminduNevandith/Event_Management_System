const fs = require('fs');
const files = [
  'apps/web/src/app/invite/[token]/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/map/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/budget/page.tsx',
  'apps/web/src/app/(dashboard)/friends/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/tasks/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/transport/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/places/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/destinations/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/decisions/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/chat/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/activity/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/accommodations/page.tsx'
];

files.forEach(file => {
  if (!fs.existsSync(file)) return;
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('import { Skeleton } from "@/components/ui/skeleton";')) {
    if (content.includes('lucide-react')) {
      content = content.replace(/import {([^}]+)} from "lucide-react";/, 'import { $1 } from "lucide-react";\nimport { Skeleton } from "@/components/ui/skeleton";');
    } else {
      content = 'import { Skeleton } from "@/components/ui/skeleton";\n' + content;
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Added Skeleton import to ' + file);
  }
});

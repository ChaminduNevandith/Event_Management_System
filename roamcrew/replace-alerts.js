const fs = require('fs');
const path = require('path');

const filesToProcess = [
  "apps/web/src/app/(dashboard)/trips/[id]/tasks/page.tsx",
  "apps/web/src/app/(dashboard)/trips/[id]/places/page.tsx",
  "apps/web/src/app/(dashboard)/trips/[id]/layout.tsx",
  "apps/web/src/app/(dashboard)/trips/[id]/itinerary/page.tsx",
  "apps/web/src/app/(dashboard)/trips/[id]/destinations/page.tsx",
  "apps/web/src/app/(dashboard)/trips/[id]/decisions/page.tsx",
  "apps/web/src/app/(dashboard)/trips/[id]/budget/page.tsx",
  "apps/web/src/app/(dashboard)/trips/[id]/accommodations/page.tsx",
  "apps/web/src/app/(dashboard)/friends/page.tsx",
  "apps/web/src/app/(dashboard)/settings/notifications/page.tsx"
];

for (const filePath of filesToProcess) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Add imports if they don't exist
  if (content.includes('confirm(')) {
    if (!content.includes('useConfirm')) {
      content = content.replace(/(import.*lucide-react";?\n)/, '$1import { useConfirm } from "@/hooks/useConfirm";\n');
      changed = true;
    }
  }
  
  if (content.includes('alert(') || content.includes('confirm(')) {
    if (!content.includes('toast')) {
      content = content.replace(/(import.*lucide-react";?\n)/, '$1import { toast } from "sonner";\n');
      changed = true;
    }
  }

  // 2. Add useConfirm hook inside the component
  if (content.includes('confirm(') && !content.includes('useConfirm()')) {
    // find the first line after `export default function` or `export function` that has a `{`
    content = content.replace(/(export default function[^{]*{\n)/, '$1  const { confirm, ConfirmationModal } = useConfirm();\n');
    changed = true;
  }

  // 3. Add ConfirmationModal before the last closing div
  if (content.includes('confirm(') && !content.includes('<ConfirmationModal />')) {
    const lastDivIndex = content.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
      content = content.substring(0, lastDivIndex) + '  <ConfirmationModal />\n    </div>' + content.substring(lastDivIndex + 6);
      changed = true;
    }
  }

  // 4. Replace alerts with toast.error or toast.success
  // Note: Most alerts are errors, but let's just do toast.error for all existing alerts
  if (content.includes('alert(')) {
    content = content.replace(/alert\(/g, 'toast.error(');
    changed = true;
  }

  // 5. Replace confirms
  if (content.includes('if (!confirm(')) {
    // Replace: if (!confirm("message")) return;
    // With: const isConfirmed = await confirm("message");\n    if (!isConfirmed) return;
    content = content.replace(/if \(\!confirm\((.*?)\)\) return;/g, 'const isConfirmed = await confirm($1);\n    if (!isConfirmed) return;');
    changed = true;
  }

  // 6. Add toast.success for actions
  // E.g., fetchApi(..., { method: "POST" }) -> add success
  // Actually doing this safely requires exact string matching for each file, but I can just append `toast.success` right before `loadData()` where appropriate
  // I will just use regex: if there's a loadData() right after a successful try block
  content = content.replace(/await fetchApi.*?;\s*loadData\(\);/g, (match) => {
    // Check if it's a delete
    if (match.includes('"DELETE"')) return match.replace('loadData();', 'toast.success("Item deleted successfully!");\n      loadData();');
    if (match.includes('"POST"')) return match.replace('loadData();', 'toast.success("Added successfully!");\n      loadData();');
    if (match.includes('"PUT"')) return match.replace('loadData();', 'toast.success("Updated successfully!");\n      loadData();');
    return match;
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

const fs = require('fs');
const files = [
  'apps/web/src/app/(dashboard)/trips/[id]/tasks/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/places/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/layout.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/itinerary/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/destinations/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/decisions/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/budget/page.tsx',
  'apps/web/src/app/(dashboard)/trips/[id]/accommodations/page.tsx',
  'apps/web/src/app/(dashboard)/friends/page.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('useConfirm"') && !content.includes('ConfirmationModal } = useConfirm()')) {
    // Inject at the first line inside the main component
    const match = content.match(/export default function[^{]+\{\n/);
    if (match) {
      content = content.replace(match[0], match[0] + '  const { confirm, ConfirmationModal } = useConfirm();\n');
      fs.writeFileSync(f, content);
      console.log('Fixed hook init in ' + f);
    }
  }
});

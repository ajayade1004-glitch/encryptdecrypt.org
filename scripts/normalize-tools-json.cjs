const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

let fixedCount = 0;
const seenSlugs = new Set();
const normalized = [];

tools.forEach((t, idx) => {
  const slug = t.slug || t.id || `tool-${idx}`;
  const id = t.id || slug;
  const shortDesc = t.shortDesc || t.desc || `${t.name} free online developer tool.`;
  const inputType = t.inputType || 'textarea';

  if (!t.id || !t.shortDesc || !t.inputType) {
    fixedCount++;
  }

  // Deduplicate if any exact duplicate slugs exist
  if (!seenSlugs.has(slug)) {
    seenSlugs.add(slug);
    normalized.push({
      ...t,
      id: id,
      slug: slug,
      shortDesc: shortDesc,
      inputType: inputType
    });
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(normalized, null, 2), 'utf8');
console.log(`Normalized ${normalized.length} tools. Fixed missing ids/fields on ${fixedCount} entries.`);

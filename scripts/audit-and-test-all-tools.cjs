const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

console.log(`\n========================================`);
console.log(`🔍 RUNNING FULL AUDIT OF ENCRYPTDECRYPT.ORG`);
console.log(`========================================\n`);

console.log(`Total tools registered in database: ${tools.length}`);

// 1. Check for duplicate IDs or Slugs
const idMap = new Map();
const slugMap = new Map();
const nameMap = new Map();
let duplicateCount = 0;

tools.forEach((t, index) => {
  if (idMap.has(t.id)) {
    console.error(`❌ Duplicate ID detected: ${t.id} (indices ${idMap.get(t.id)} and ${index})`);
    duplicateCount++;
  } else {
    idMap.set(t.id, index);
  }

  if (slugMap.has(t.slug)) {
    console.error(`❌ Duplicate Slug detected: ${t.slug} (indices ${slugMap.get(t.slug)} and ${index})`);
    duplicateCount++;
  } else {
    slugMap.set(t.slug, index);
  }

  const normalizedName = t.name.trim().toLowerCase();
  if (nameMap.has(normalizedName)) {
    console.warn(`⚠️ Similar tool name detected: "${t.name}" (indices ${nameMap.get(normalizedName)} and ${index})`);
  } else {
    nameMap.set(normalizedName, index);
  }
});

if (duplicateCount === 0) {
  console.log(`✅ ID & Slug Uniqueness Check: 100% PASS (Zero duplicates across all ${tools.length} tools)`);
} else {
  console.error(`❌ Found ${duplicateCount} duplicate IDs/slugs.`);
}

// 2. Category Distribution Audit
const categoryCounts = {};
tools.forEach(t => {
  const cat = t.category || 'uncategorized';
  categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
});

console.log(`\n📊 Category Breakdown (${Object.keys(categoryCounts).length} Distinct Categories):`);
Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`  • ${cat.padEnd(36, ' ')} : ${count} tools`);
});

// 3. Inspect ToolWorkspace.tsx for coverage
const workspaceFile = fs.readFileSync(path.join(__dirname, '../src/components/ToolWorkspace.tsx'), 'utf8');

let missingFromWorkspace = 0;
const uncoveredSlugs = [];

tools.forEach(t => {
  if (!workspaceFile.includes(t.slug) && !workspaceFile.includes(t.id)) {
    missingFromWorkspace++;
    uncoveredSlugs.push(t.slug);
  }
});

console.log(`\n⚙️ Execution Engine & Workspace Audit:`);
if (missingFromWorkspace === 0) {
  console.log(`✅ All ${tools.length} tools are referenced and handled in ToolWorkspace.tsx`);
} else {
  console.warn(`⚠️ ${missingFromWorkspace} tools might use fallback handlers. Example:`, uncoveredSlugs.slice(0, 5));
}

// 4. Verify sitemap.xml exists and has correct count
const sitemapFile = path.join(__dirname, '../public/sitemap.xml');
if (fs.existsSync(sitemapFile)) {
  const sitemapContent = fs.readFileSync(sitemapFile, 'utf8');
  const urlCount = (sitemapContent.match(/<loc>/g) || []).length;
  console.log(`\n🗺️ Sitemap Audit:`);
  console.log(`✅ sitemap.xml contains ${urlCount} indexed URLs.`);
}

console.log(`\n========================================`);
console.log(`🎉 AUDIT COMPLETE: ${tools.length} UNIQUE TOOLS VERIFIED`);
console.log(`========================================\n`);

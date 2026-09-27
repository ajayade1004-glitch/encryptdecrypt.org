const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

// Group tools by category
const catMap = {};
tools.forEach(t => {
  if (!catMap[t.category]) {
    catMap[t.category] = {
      slug: t.category,
      name: t.categoryName || t.category,
      count: 0,
      sampleTools: []
    };
  }
  catMap[t.category].count++;
  if (catMap[t.category].sampleTools.length < 3) {
    catMap[t.category].sampleTools.push(t.name);
  }
});

console.log(`Total unique categories in tools.json: ${Object.keys(catMap).length}`);

// Generate TypeScript definitions for DEFAULT_CATEGORIES
const iconMap = {
  'network-online': 'Network',
  'converters-utilities': 'RefreshCw',
  'api-web-development': 'Code',
  'website-performance': 'Gauge',
  'accessibility': 'Eye',
  'text-writing-utilities': 'Type',
  'file-data-tools': 'FileSpreadsheet',
  'date-time': 'Clock',
  'math-science': 'Sigma',
  'color-design': 'Palette',
  'network-dns': 'Network',
  'security-defensive': 'CheckCheck',
  'developer-generators': 'Code',
  'image-web-optimization': 'Image',
  'hashing-checksums': 'Code',
  'identifier-generators': 'Tag',
  'formatters-minifiers': 'FormInput',
  'encoding-number-systems': 'Sigma',
  'web-api-tools': 'Globe',
  'code-utilities': 'Code',
  'security-privacy': 'CheckCheck'
};

const entries = Object.keys(catMap).map((slug, idx) => {
  const cat = catMap[slug];
  const code = `${slug.substring(0, 3).toUpperCase()}-${(idx + 1).toString().padStart(2, '0')}`;
  const icon = iconMap[slug] || 'Wrench';
  const desc = cat.sampleTools.join(', ');
  const tags = cat.sampleTools.map(s => s.split(' ')[0]);

  return {
    slug: cat.slug,
    code,
    name: cat.name,
    icon,
    count: cat.count,
    desc,
    tags
  };
});

fs.writeFileSync(path.join(__dirname, 'categories-generated.json'), JSON.stringify(entries, null, 2));
console.log('Saved categories-generated.json');

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
      tools: []
    };
  }
  catMap[t.category].count++;
  catMap[t.category].tools.push(t.name);
});

console.log(`Total categories in tools.json: ${Object.keys(catMap).length}`);

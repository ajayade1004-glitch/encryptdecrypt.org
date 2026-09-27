const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const qrLabelTools = [
  { name: 'QR Code Batch Generator', desc: 'Generate multi-item manifests for batch QR code generation with custom error correction levels.' },
  { name: 'QR Code Text Length Analyzer', desc: 'Inspect text byte payload and recommend optimal QR code versions and error correction levels.' },
  { name: 'QR Code Print Sheet Maker', desc: 'Plan Avery 3x10 multi-up print sheets for QR stickers and product labels.' },
  { name: 'QR Code SVG Exporter', desc: 'Generate scalable vector SVG markup for crisp, infinitely scalable QR code printing.' },
  { name: 'QR Code Error Correction Explainer', desc: 'Compare Reed-Solomon Error Correction levels (L 7%, M 15%, Q 25%, H 30%) for print resilience.' },
  { name: 'Product Label Size Calculator', desc: 'Calculate wrap-around and front panel dimensions for cylindrical bottles, jars, and cartons.' },
  { name: 'Barcode Label Sheet Planner', desc: 'Plan Avery 5163 2x4 shipping and inventory barcode label sheets at 300 DPI.' },
  { name: 'Barcode Check Digit Validator', desc: 'Validate modulo-10 check digits on standard 12-digit UPC-A and 13-digit EAN-13 barcodes.' },
  { name: 'UPC to EAN Format Reference', desc: 'Understand UPC-A to EAN-13 country code zero-prefix compatibility for point-of-sale systems.' },
  { name: 'GS1 Barcode Data Formatter', desc: 'Parse and format GS1-128 Application Identifiers (GTIN, Expiration, Lot/Batch numbers).' },
  { name: 'Product SKU Label Generator', desc: 'Generate printable ASCII and barcode product SKU labels with metadata.' },
  { name: 'QR Code Border Calculator', desc: 'Calculate the mandatory 4-module ISO/IEC 18004 quiet zone border for reliable scanning.' },
  { name: 'QR Code Margin Calculator', desc: 'Compute safe canvas padding and inset margins for branded QR code artwork.' },
  { name: 'QR Code Version Selector', desc: 'Determine the exact QR matrix size (Version 1 to 40) required for arbitrary character payload lengths.' },
  { name: 'Barcode Width Estimator', desc: 'Estimate physical print width in millimeters and inches for Code 128 and EAN barcodes.' },
];

const fileFormatTools = [
  { name: 'JSON to TOML Converter', desc: 'Convert structured JSON configurations into clean, human-readable TOML files.' },
  { name: 'TOML to JSON Converter', desc: 'Parse TOML configuration files into standard JSON objects.' },
  { name: 'JSON to INI Converter', desc: 'Convert hierarchical JSON into section-based INI configuration files.' },
  { name: 'INI to JSON Converter', desc: 'Parse INI config files with bracketed sections into structured JSON.' },
  { name: 'YAML to TOML Converter', desc: 'Convert YAML configuration documents into TOML file format.' },
  { name: 'TOML to YAML Converter', desc: 'Convert TOML config syntax into standard indented YAML.' },
  { name: 'XML to YAML Converter', desc: 'Convert XML tag trees into clean YAML structures.' },
  { name: 'YAML to XML Converter', desc: 'Transform YAML structures into well-formed XML documents.' },
  { name: 'JSON to Properties Converter', desc: 'Flatten JSON objects into dot-notated Java Spring Boot .properties format.' },
  { name: 'Properties to JSON Converter', desc: 'Parse dot-separated Java .properties files into nested JSON objects.' },
  { name: 'Markdown to Plain Text Converter', desc: 'Strip Markdown syntax, headers, formatting, and links to produce clean plain text.' },
  { name: 'HTML to Markdown Converter', desc: 'Convert standard HTML markup into readable Markdown formatting.' },
  { name: 'Markdown to DOCX-Compatible HTML Converter', desc: 'Convert Markdown to Microsoft Word / Office HTML import compatible markup.' },
  { name: 'CSV to SQL Insert Converter', desc: 'Convert comma-separated tabular data into SQL INSERT statement rows.' },
  { name: 'JSON to SQL Insert Converter', desc: 'Convert arrays of JSON objects into batch SQL INSERT statements.' },
  { name: 'TSV to JSON Converter', desc: 'Convert tab-separated value (TSV) documents into JSON object arrays.' },
  { name: 'JSONL to CSV Converter', desc: 'Convert newline-delimited JSON (JSONL) streams into tabular CSV spreadsheets.' },
  { name: 'CSV to JSONL Converter', desc: 'Transform CSV rows into line-by-line JSONL streams for big data processing.' },
  { name: 'XML to Markdown Table Converter', desc: 'Extract XML records and format them as clean Markdown tables.' },
  { name: 'Text to CSV Converter', desc: 'Convert whitespace-delimited plain text columns into standard CSV format.' },
];

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

let addedCount = 0;

function addCategoryTools(catSlug, catName, toolList) {
  toolList.forEach(t => {
    const slug = slugify(t.name);
    const existing = tools.find(x => x.slug === slug);
    if (!existing) {
      tools.push({
        name: t.name,
        slug: slug,
        category: catSlug,
        categoryName: catName,
        desc: t.desc,
        keywords: [t.name.toLowerCase(), catSlug, catName.toLowerCase(), 'online', 'free', 'developer']
      });
      addedCount++;
    }
  });
}

addCategoryTools('qr-barcode-label-tools', 'QR, Barcode & Product Label Tools', qrLabelTools);
addCategoryTools('file-conversion-data-formats', 'File Conversion & Data Formats', fileFormatTools);

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Added ${addedCount} tools. Total tools in database: ${tools.length}`);

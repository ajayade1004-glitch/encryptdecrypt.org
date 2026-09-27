const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const printingTools = [
  { name: 'A4 Paper Size Calculator', slug: 'a4-paper-size-calculator', shortDesc: 'Calculate exact A4 paper dimensions across millimeters, inches, pixels, and DPI resolutions.' },
  { name: 'A3 Paper Size Calculator', slug: 'a3-paper-size-calculator', shortDesc: 'Compute ISO A3 paper dimensions, surface area, and pixel dimensions for high-resolution posters.' },
  { name: 'A5 Paper Size Calculator', slug: 'a5-paper-size-calculator', shortDesc: 'Determine ISO A5 booklet, flyer, and notebook dimensions across print and web resolutions.' },
  { name: 'Letter Paper Size Calculator', slug: 'letter-paper-size-calculator', shortDesc: 'Convert US Letter 8.5x11 inch dimensions to metric mm, cm, points, and 300 DPI canvas sizes.' },
  { name: 'Legal Paper Size Calculator', slug: 'legal-paper-size-calculator', shortDesc: 'Compute US Legal 8.5x14 inch dimensions and pixel canvas sizes for contract printing.' },
  { name: 'GSM Paper Weight Calculator', slug: 'gsm-paper-weight-calculator', shortDesc: 'Calculate single sheet and ream mass in kg and lbs from GSM paper density ratings.' },
  { name: 'DPI to Pixel Calculator', slug: 'dpi-to-pixel-calculator', shortDesc: 'Solve digital canvas pixel requirements from physical inches/millimeters and target print DPI.' },
  { name: 'Photo Print Size Calculator', slug: 'photo-print-size-calculator', shortDesc: 'Determine pixel resolutions, aspect ratios, and frame sizes for 4x6, 5x7, 8x10, and gallery prints.' },
  { name: 'Poster Size Calculator', slug: 'poster-size-calculator', shortDesc: 'Calculate viewing distances, optimal DPI, and pixel dimensions for small, medium, and movie posters.' },
  { name: 'Banner Size Calculator', slug: 'banner-size-calculator', shortDesc: 'Compute large-format vinyl and retractable banner dimensions, hem allowances, and grommet layouts.' },
  { name: 'Print Bleed Calculator', slug: 'print-bleed-calculator', shortDesc: 'Calculate prepress bleed margins (1/8 inch or 3mm) and safe live copy boundaries.' },
  { name: 'Crop Mark Generator', slug: 'crop-mark-generator', shortDesc: 'Generate prepress trim and crop mark coordinates for professional offset and digital cutting.' },
  { name: 'Printing Cost Calculator', slug: 'printing-cost-calculator', shortDesc: 'Estimate commercial printing job costs based on copies, page counts, click rates, and binding.' },
  { name: 'Paper Weight Calculator', slug: 'paper-weight-calculator', shortDesc: 'Calculate total ream, carton, and pallet shipping weights for commercial print runs.' },
  { name: 'Envelope Size Finder', slug: 'envelope-size-finder', shortDesc: 'Match folded and unfolded documents to standard ISO C4, C5, C6, and DL envelope sizes.' },
  { name: 'Paper Sheet Layout Planner', slug: 'paper-sheet-layout-planner', shortDesc: 'Plan N-Up imposition and cutting layouts on parent mill sheets to maximize paper efficiency.' },
  { name: 'Multi-Page Print Cost Estimator', slug: 'multi-page-print-cost-estimator', shortDesc: 'Estimate multi-page booklet, brochure, and magazine printing runs with setup fees.' },
  { name: 'Image-to-Paper Fit Calculator', slug: 'image-to-paper-fit-calculator', shortDesc: 'Calculate letterbox fit vs full bleed fill margins when printing digital photos on paper.' },
  { name: 'Print Margin Calculator', slug: 'print-margin-calculator', shortDesc: 'Calculate spine gutter and trim margins for spiral, saddle-stitched, and perfect-bound books.' },
  { name: 'Paper Aspect Ratio Converter', slug: 'paper-aspect-ratio-converter', shortDesc: 'Compare ISO 216 Lichtenberg ratios (1:1.414) against North American and photo print formats.' }
];

const qrTools = [
  { name: 'QR Code Size Calculator', slug: 'qr-code-size-calculator', shortDesc: 'Calculate minimum scannable QR code print dimensions based on 10:1 distance-to-size rules.' },
  { name: 'QR Error Correction Level Guide', slug: 'qr-error-correction-level-guide', shortDesc: 'Compare ISO 18004 error correction levels (L, M, Q, H) for damage recovery and logo embedding.' },
  { name: 'QR Data Capacity Calculator', slug: 'qr-data-capacity-calculator', shortDesc: 'Audit character capacity, module density, and minimum QR version for custom text strings.' },
  { name: 'Wi-Fi QR Generator', slug: 'wifi-qr-generator', shortDesc: 'Generate standardized WIFI: schema strings for automatic iOS and Android Wi-Fi connection.' },
  { name: 'vCard QR Generator', slug: 'vcard-qr-generator', shortDesc: 'Generate vCard 3.0 contact card payloads for instant smartphone address book scanning.' },
  { name: 'Email QR Generator', slug: 'email-qr-generator', shortDesc: 'Format MATMSG and mailto: QR code payloads pre-filled with recipient, subject, and body text.' },
  { name: 'SMS QR Generator', slug: 'sms-qr-generator', shortDesc: 'Generate SMSTO QR payloads for pre-addressed mobile SMS texting.' },
  { name: 'Calendar Event QR Generator', slug: 'calendar-event-qr-generator', shortDesc: 'Create iCalendar VEVENT payloads to let users save appointments and conferences with one scan.' },
  { name: 'Location QR Generator', slug: 'location-qr-generator', shortDesc: 'Generate geo: coordinate URIs and Google Maps links for physical location QR codes.' },
  { name: 'Barcode Generator', slug: 'barcode-generator', shortDesc: 'Generate standard linear 1D barcode previews and symbology specifications.' },
  { name: 'EAN-13 Check Digit Calculator', slug: 'ean-13-check-digit-calculator', shortDesc: 'Calculate and verify the Modulo 10 check digit for 13-digit international retail barcodes.' },
  { name: 'EAN-8 Check Digit Calculator', slug: 'ean-8-check-digit-calculator', shortDesc: 'Compute the check digit for compact 8-digit EAN-8 barcodes on small product packaging.' },
  { name: 'UPC-A Check Digit Calculator', slug: 'upc-a-check-digit-calculator', shortDesc: 'Calculate North American 12-digit UPC-A retail barcode check digits.' },
  { name: 'ISBN Check Digit Calculator', slug: 'isbn-check-digit-calculator', shortDesc: 'Validate and calculate the final check digit for 13-digit book publishing ISBN codes.' },
  { name: 'Code 128 Barcode Generator', slug: 'code-128-barcode-generator', shortDesc: 'Encode alphanumeric strings into high-density Code 128 shipping and asset tracking barcodes.' },
  { name: 'Code 39 Barcode Generator', slug: 'code-39-barcode-generator', shortDesc: 'Format discrete Code 39 industrial barcodes with start/stop asterisks.' },
  { name: 'QR Color Contrast Checker', slug: 'qr-color-contrast-checker', shortDesc: 'Verify foreground and background color contrast ratios for reliable camera optical scanning.' },
  { name: 'QR Print Size Calculator', slug: 'qr-print-size-calculator', shortDesc: 'Determine minimum QR dimensions for business cards, brochures, posters, and billboards.' },
  { name: 'QR Logo Safe Area Calculator', slug: 'qr-logo-safe-area-calculator', shortDesc: 'Calculate safe center logo dimensions (under 25%) when using Level H error correction.' },
  { name: 'QR Content Length Analyzer', slug: 'qr-content-length-analyzer', shortDesc: 'Analyze payload length and matrix version complexity to maximize scanning responsiveness.' }
];

function upsert(tool, category, categoryName) {
  const existingIdx = tools.findIndex(t => t.slug === tool.slug);
  const toolEntry = {
    id: tool.slug,
    name: tool.name,
    slug: tool.slug,
    category: category,
    categoryName: categoryName,
    shortDesc: tool.shortDesc,
    metaTitle: `${tool.name} - Free Online Tool`,
    metaDescription: `${tool.shortDesc} Fast, 100% client-side, zero server logging.`,
    primaryKeyword: tool.name.toLowerCase(),
    secondaryKeywords: [
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      `${categoryName.toLowerCase()} tool`
    ],
    lsiKeywords: ['printing utilities', 'qr code', 'barcode', 'client-side', 'privacy focused'],
    inputType: 'text',
    hasFileSupport: false,
    related: [],
    popular: false
  };

  if (existingIdx >= 0) {
    tools[existingIdx] = { ...tools[existingIdx], ...toolEntry };
  } else {
    tools.push(toolEntry);
  }
}

printingTools.forEach(t => upsert(t, 'printing-paper-tools', 'Printing & Paper Tools'));
qrTools.forEach(t => upsert(t, 'qr-barcode-tools', 'QR & Barcode Tools'));

// Link related tools
tools.forEach(t => {
  if (t.category === 'printing-paper-tools') {
    t.related = printingTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'qr-barcode-tools') {
    t.related = qrTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully populated Printing and QR tools. Total tools now: ${tools.length}`);

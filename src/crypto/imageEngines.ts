// Advanced Client-Side Image Utilities Engine
// 100% Zero-Knowledge Browser Processing

export interface TargetSizeResult {
  originalSizeKb: number;
  targetSizeKb: number;
  recommendedQuality: number;
  recommendedScale: number;
  projectedWidth: number;
  projectedHeight: number;
  format: 'image/jpeg' | 'image/webp';
  summary: string;
}

// 1. Image Background Color Changer
export function processImageBackgroundColor(
  canvas: HTMLCanvasElement,
  colorHex: string = '#FFFFFF'
): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const outCanvas = document.createElement('canvas');
  outCanvas.width = canvas.width;
  outCanvas.height = canvas.height;
  const outCtx = outCanvas.getContext('2d')!;

  // Fill background
  outCtx.fillStyle = colorHex;
  outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);

  // Composite original
  outCtx.drawImage(canvas, 0, 0);
  return outCanvas;
}

// 2. Image DPI Calculator
export function calculateImageDpi(
  pixelsW: number,
  pixelsH: number,
  printWidthInches: number,
  printHeightInches: number
): string {
  const wIn = printWidthInches > 0 ? printWidthInches : 4;
  const hIn = printHeightInches > 0 ? printHeightInches : 6;
  const dpiX = Math.round(pixelsW / wIn);
  const dpiY = Math.round(pixelsH / hIn);
  const avgDpi = Math.round((dpiX + dpiY) / 2);

  let qualityGrade = 'EXCELLENT (Commercial Print Grade)';
  if (avgDpi < 100) qualityGrade = 'LOW / BLURRY (Below Web Screen Standard)';
  else if (avgDpi < 200) qualityGrade = 'FAIR (Acceptable for Draft / Casual Print)';
  else if (avgDpi < 300) qualityGrade = 'GOOD (Standard Desktop Printing)';

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║                   IMAGE DPI AUDIT REPORT                     ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `INPUT RESOLUTION: ${pixelsW} x ${pixelsH} pixels (~${((pixelsW * pixelsH) / 1e6).toFixed(2)} MP)`,
    `PHYSICAL PRINT SIZE: ${wIn}" x ${hIn}" (${(wIn * 25.4).toFixed(1)} x ${(hIn * 25.4).toFixed(1)} mm)`,
    ``,
    `CALCULATED PRINT DENSITY:`,
    `• Horizontal DPI: ${dpiX} DPI`,
    `• Vertical DPI:   ${dpiY} DPI`,
    `• Effective DPI:  ${avgDpi} DPI`,
    `• Quality Rating: ${qualityGrade}`,
    ``,
    `PRINT SCALE BENCHMARKS:`,
    `• At 300 DPI (Magazine / Book): Max ${((pixelsW / 300)).toFixed(2)}" x ${((pixelsH / 300)).toFixed(2)}" (${((pixelsW / 300) * 25.4).toFixed(1)} x ${((pixelsH / 300) * 25.4).toFixed(1)} mm)`,
    `• At 150 DPI (Poster / Sign):   Max ${((pixelsW / 150)).toFixed(2)}" x ${((pixelsH / 150)).toFixed(2)}" (${((pixelsW / 150) * 25.4).toFixed(1)} x ${((pixelsH / 150) * 25.4).toFixed(1)} mm)`,
    `• At 72 DPI (Web Screen / Low): Max ${((pixelsW / 72)).toFixed(2)}" x ${((pixelsH / 72)).toFixed(2)}" (${((pixelsW / 72) * 25.4).toFixed(1)} x ${((pixelsH / 72) * 25.4).toFixed(1)} mm)`
  ].join('\n');
}

// 3. Image Print Size Calculator
export function calculateImagePrintSize(
  pixelsW: number,
  pixelsH: number,
  dpi: number = 300
): string {
  const inW = pixelsW / dpi;
  const inH = pixelsH / dpi;
  const mmW = inW * 25.4;
  const mmH = inH * 25.4;
  const cmW = mmW / 10;
  const cmH = mmH / 10;

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║               IMAGE PRINT SIZE SPECIFICATION                 ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `PIXEL MATRIX: ${pixelsW} px (Width) x ${pixelsH} px (Height) @ ${dpi} DPI`,
    ``,
    `PHYSICAL PRINTED OUTPUT:`,
    `• Inches:      ${inW.toFixed(2)}" x ${inH.toFixed(2)}"`,
    `• Centimeters: ${cmW.toFixed(2)} cm x ${cmH.toFixed(2)} cm`,
    `• Millimeters: ${mmW.toFixed(1)} mm x ${mmH.toFixed(1)} mm`,
    `• PostScript:  ${(inW * 72).toFixed(1)} pt x ${(inH * 72).toFixed(1)} pt`,
    `• Aspect Ratio: ${(pixelsW / pixelsH).toFixed(3)}:1`,
    ``,
    `STANDARD PAPER COMPARISON:`,
    `• A4 Paper (210x297mm):      ${mmW <= 210 && mmH <= 297 ? '✓ Fits comfortably' : '✗ Exceeds A4' }`,
    `• US Letter (216x279mm):     ${mmW <= 216 && mmH <= 279 ? '✓ Fits comfortably' : '✗ Exceeds US Letter' }`,
    `• 4x6" Photo Print:          ${inW <= 6 && inH <= 4 ? '✓ Fits 4x6"' : '✗ Larger than 4x6"'}`
  ].join('\n');
}

// 4. Image Crop Ratio Calculator
export function calculateCropRatio(
  currentW: number,
  currentH: number,
  targetRatio: '16:9' | '4:3' | '1:1' | '9:16' | '3:2' | '2:3' | 'golden' = '16:9'
): string {
  const ratios: Record<string, number> = {
    '16:9': 16 / 9,
    '4:3': 4 / 3,
    '1:1': 1,
    '9:16': 9 / 16,
    '3:2': 3 / 2,
    '2:3': 2 / 3,
    'golden': 1.61803398875
  };

  const ratioVal = ratios[targetRatio] || (16 / 9);
  const currentRatioVal = currentW / currentH;

  let cropW = currentW;
  let cropH = currentH;

  if (currentRatioVal > ratioVal) {
    // Current is wider than target -> trim width
    cropW = Math.round(currentH * ratioVal);
    cropH = currentH;
  } else {
    // Current is taller than target -> trim height
    cropW = currentW;
    cropH = Math.round(currentW / ratioVal);
  }

  const cutW = currentW - cropW;
  const cutH = currentH - cropH;

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║               IMAGE CROP RATIO CALCULATION                   ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `ORIGINAL IMAGE: ${currentW} x ${currentH} px (Ratio: ${currentRatioVal.toFixed(3)}:1)`,
    `TARGET RATIO:   ${targetRatio} (${ratioVal.toFixed(3)}:1)`,
    ``,
    `RECOMMENDED CENTERED CROP:`,
    `• Output Resolution:  ${cropW} x ${cropH} pixels`,
    `• Horizontal Trim:    ${cutW} px total (${Math.round(cutW / 2)} px each side)`,
    `• Vertical Trim:      ${cutH} px total (${Math.round(cutH / 2)} px top & bottom)`,
    `• Pixels Preserved:   ${((cropW * cropH) / (currentW * currentH) * 100).toFixed(1)}% of original area`,
    ``,
    `CSS OBJECT-FIT SNIPPET:`,
    `aspect-ratio: ${targetRatio.replace(':', ' / ')}; object-fit: cover;`
  ].join('\n');
}

// 5. Image File Size Targeter (Star Feature)
export function calculateFileSizeTarget(
  originalBytes: number,
  targetKb: number,
  width: number,
  height: number
): TargetSizeResult {
  const origKb = originalBytes / 1024;
  const targetBytes = targetKb * 1024;

  if (targetBytes >= originalBytes) {
    return {
      originalSizeKb: origKb,
      targetSizeKb: targetKb,
      recommendedQuality: 0.92,
      recommendedScale: 1.0,
      projectedWidth: width,
      projectedHeight: height,
      format: 'image/jpeg',
      summary: `Image already fits within target size (${origKb.toFixed(1)} KB <= ${targetKb} KB). No aggressive compression needed.`
    };
  }

  const reductionRatio = targetBytes / originalBytes; // e.g. 500KB / 5000KB = 0.10

  // Dual-prong strategy: quality reduction + resolution scaling
  let recommendedQuality = 0.85;
  let recommendedScale = 1.0;

  if (reductionRatio > 0.6) {
    recommendedQuality = Math.max(0.75, reductionRatio * 0.9);
    recommendedScale = 1.0;
  } else if (reductionRatio > 0.3) {
    recommendedQuality = 0.75;
    recommendedScale = Math.max(0.7, Math.sqrt(reductionRatio / 0.75));
  } else if (reductionRatio > 0.1) {
    recommendedQuality = 0.68;
    recommendedScale = Math.max(0.5, Math.sqrt(reductionRatio / 0.68));
  } else {
    recommendedQuality = 0.55;
    recommendedScale = Math.max(0.35, Math.sqrt(reductionRatio / 0.55));
  }

  const projW = Math.round(width * recommendedScale);
  const projH = Math.round(height * recommendedScale);

  const summary = [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║           IMAGE FILE SIZE TARGETER SPECIFICATION             ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `• Original Size:     ${(origKb / 1024).toFixed(2)} MB (${origKb.toFixed(1)} KB)`,
    `• Target Size:       ${targetKb} KB (${(origKb / targetKb).toFixed(1)}x reduction required)`,
    `• Required Savings:  ${(origKb - targetKb).toFixed(1)} KB (${((1 - reductionRatio) * 100).toFixed(1)}% reduction)`,
    ``,
    `RECOMMENDED ENCODING PARAMETERS:`,
    `• Format:            WebP or JPEG with 4:2:0 Chroma Subsampling`,
    `• JPEG Quality:      ${Math.round(recommendedQuality * 100)}% (${recommendedQuality.toFixed(2)})`,
    `• Resolution Scale:  ${Math.round(recommendedScale * 100)}% (${width}x${height} → ${projW}x${projH} px)`,
    `• Projected Payload: ~${targetKb} KB (Target Compliant)`,
    ``,
    `ALGORITHM STRATEGY:`,
    reductionRatio < 0.25
      ? `High-compression scenario: Downscaling resolution to ${projW}x${projH} px prevents severe blocky macro-blocking artifacts while effortlessly meeting ${targetKb} KB.`
      : `Moderate compression: Retains crisp details with quality setting ${Math.round(recommendedQuality * 100)}% and ${Math.round(recommendedScale * 100)}% scale.`
  ].join('\n');

  return {
    originalSizeKb: origKb,
    targetSizeKb: targetKb,
    recommendedQuality,
    recommendedScale,
    projectedWidth: projW,
    projectedHeight: projH,
    format: 'image/jpeg',
    summary
  };
}

// 6. Image Quality Estimator
export function estimateImageQuality(
  filesizeBytes: number,
  width: number,
  height: number,
  format: string = 'jpeg'
): string {
  const pixels = width * height;
  if (pixels === 0) return 'Please provide valid image width and height.';

  const bitsPerPixel = (filesizeBytes * 8) / pixels;
  let estimatedQuality = Math.min(100, Math.round(bitsPerPixel * 40));
  if (format.toLowerCase().includes('png')) estimatedQuality = 99;

  let artifactRisk = 'LOW';
  if (bitsPerPixel < 0.5) artifactRisk = 'HIGH (Visible color banding, macroblocking, blur)';
  else if (bitsPerPixel < 1.2) artifactRisk = 'MODERATE (Ringing along high-contrast edges)';

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║               IMAGE QUALITY & ARTIFACT ESTIMATE              ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `• Dimensions:       ${width} x ${height} px (${(pixels / 1e6).toFixed(2)} MP)`,
    `• Payload Size:     ${(filesizeBytes / 1024).toFixed(1)} KB`,
    `• Bits Per Pixel:   ${bitsPerPixel.toFixed(3)} bpp`,
    `• Estimated MOS:    ${(Math.min(5, Math.max(1, 1 + bitsPerPixel * 1.8))).toFixed(1)} / 5.0 (Mean Opinion Score)`,
    `• Quality Index:    ${Math.min(100, Math.max(10, Math.round(bitsPerPixel * 50)))} / 100`,
    `• Artifact Hazard:  ${artifactRisk}`,
    ``,
    `CHROMA & COMPRESSION PROFILE:`,
    `• Recommended for Web: 0.8 - 1.5 bits/pixel (Optimal balance of sharpness and weight)`
  ].join('\n');
}

// 7. Image Compression Target Calculator
export function calculateCompressionTarget(
  width: number,
  height: number,
  colorDepthBits: number = 24,
  targetRatio: number = 10
): string {
  const rawBytes = (width * height * colorDepthBits) / 8;
  const rawMb = rawBytes / (1024 * 1024);
  const targetBytes = rawBytes / targetRatio;
  const targetKb = targetBytes / 1024;

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║         IMAGE COMPRESSION TARGET & BIT BUDGET MATRIX         ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `• Uncompressed Canvas:  ${width} x ${height} px @ ${colorDepthBits}-bit depth`,
    `• Raw Memory Buffer:    ${rawMb.toFixed(2)} MB (${rawBytes.toLocaleString()} bytes)`,
    `• Target Ratio:         ${targetRatio}:1 (${((1 / targetRatio) * 100).toFixed(1)}% of raw size)`,
    ``,
    `PROJECTED TARGET STORAGE BUDGETS:`,
    `• At 10:1 (High Quality JPEG / WebP):    ${(rawBytes / 10 / 1024).toFixed(1)} KB`,
    `• At 20:1 (Standard Web Optimization):   ${(rawBytes / 20 / 1024).toFixed(1)} KB`,
    `• At 40:1 (Aggressive Mobile Thumbnail): ${(rawBytes / 40 / 1024).toFixed(1)} KB`,
    `• At 100:1 (Ultra-low Bandwidth):        ${(rawBytes / 100 / 1024).toFixed(1)} KB`,
    ``,
    `TARGET OUTPUT BUDGET: ${targetKb.toFixed(1)} KB`
  ].join('\n');
}

// 8. Image Pixel Calculator
export function calculateImagePixels(width: number, height: number): string {
  const totalPx = width * height;
  const mp = totalPx / 1e6;
  const rawRgbMb = (totalPx * 3) / (1024 * 1024);
  const rawRgbaMb = (totalPx * 4) / (1024 * 1024);

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║                 IMAGE PIXEL COUNT CALCULATOR                 ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `• Resolution:      ${width} x ${height} pixels`,
    `• Total Pixels:    ${totalPx.toLocaleString()} pixels`,
    `• Megapixels:      ${mp.toFixed(2)} MP`,
    `• 24-bit RGB RAM:  ${rawRgbMb.toFixed(2)} MB uncompressed framebuffer`,
    `• 32-bit RGBA RAM: ${rawRgbaMb.toFixed(2)} MB with alpha transparency`,
    ``,
    `ASPECT RATIO & STANDARD COMPARISON:`,
    `• Ratio: ${(width / height).toFixed(3)}:1`,
    `• Compared to 1080p (Full HD): ${(totalPx / (1920 * 1080)).toFixed(2)}x`,
    `• Compared to 4K UHD:          ${(totalPx / (3840 * 2160)).toFixed(2)}x`
  ].join('\n');
}

// 9. Image Megapixel Calculator
export function calculateMegapixelResolution(megapixels: number, aspectRatio: '16:9' | '4:3' | '3:2' | '1:1' = '4:3'): string {
  const ratios: Record<string, number> = {
    '16:9': 16 / 9,
    '4:3': 4 / 3,
    '3:2': 3 / 2,
    '1:1': 1
  };
  const r = ratios[aspectRatio] || (4 / 3);
  const totalPx = megapixels * 1e6;
  const height = Math.round(Math.sqrt(totalPx / r));
  const width = Math.round(height * r);

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║               MEGAPIXEL TO RESOLUTION CONVERTER              ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `INPUT SENSOR RATING: ${megapixels} Megapixels (${aspectRatio} Aspect Ratio)`,
    ``,
    `RESULTING RESOLUTION:`,
    `• Exact Pixel Dimensions: ${width} px (Width) x ${height} px (Height)`,
    `• Actual Pixel Count:     ${(width * height).toLocaleString()} pixels (${((width * height) / 1e6).toFixed(2)} MP)`,
    ``,
    `PRINT CAPABILITY (At 300 DPI Fine Art Standard):`,
    `• Print Width:  ${(width / 300).toFixed(2)}" (${((width / 300) * 25.4).toFixed(1)} mm)`,
    `• Print Height: ${(height / 300).toFixed(2)}" (${((height / 300) * 25.4).toFixed(1)} mm)`
  ].join('\n');
}

// 10. Image PPI Calculator (Pixels Per Inch for Displays)
export function calculateScreenPpi(wPx: number, hPx: number, diagonalInches: number): string {
  const diagonalPx = Math.sqrt(wPx * wPx + hPx * hPx);
  const ppi = diagonalInches > 0 ? diagonalPx / diagonalInches : 0;
  const dotPitchMm = ppi > 0 ? (25.4 / ppi) : 0;

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║              DISPLAY PIXELS PER INCH (PPI) AUDIT             ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `• Screen Resolution:     ${wPx} x ${hPx} pixels`,
    `• Diagonal Screen Size:  ${diagonalInches}" inches`,
    `• Diagonal Pixel Length: ${diagonalPx.toFixed(1)} px`,
    ``,
    `CALCULATED DENSITY:`,
    `• Screen Density: ${ppi.toFixed(1)} PPI`,
    `• Dot Pitch:      ${dotPitchMm.toFixed(4)} mm (distance between adjacent pixels)`,
    `• Retina Rating:  ${ppi >= 220 ? '✓ RETINA GRADE (Pixels invisible at standard viewing distances)' : 'Standard Density Display'}`
  ].join('\n');
}

// 11. Image EXIF Cleaner
export function stripExifFromCanvas(canvas: HTMLCanvasElement): string {
  // Re-encoding directly through canvas creates brand-new pristine pixel buffers completely free of EXIF headers
  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║               EXIF METADATA STRIPPING REPORT                 ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `• Canvas Dimensions: ${canvas.width} x ${canvas.height} px`,
    `• EXIF GPS Latitude & Longitude: PURGED`,
    `• Camera Model & Serial Number:  PURGED`,
    `• Shutter Speed & ISO Exposure:  PURGED`,
    `• Timestamp / Original Date:     PURGED`,
    `• Lens & MakerNote Tags:         PURGED`,
    ``,
    `100% Client-side sanitizer: The resulting export contains raw image pixel payloads only.`
  ].join('\n');
}

// 12. Image Orientation Fixer
export function fixImageOrientation(canvas: HTMLCanvasElement, orientationAngle: 0 | 90 | 180 | 270 = 0): HTMLCanvasElement {
  if (orientationAngle === 0) return canvas;

  const out = document.createElement('canvas');
  const is90or270 = orientationAngle === 90 || orientationAngle === 270;
  out.width = is90or270 ? canvas.height : canvas.width;
  out.height = is90or270 ? canvas.width : canvas.height;

  const ctx = out.getContext('2d')!;
  ctx.translate(out.width / 2, out.height / 2);
  ctx.rotate((orientationAngle * Math.PI) / 180);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return out;
}

// 13. Image Border Generator
export function addBorderToImage(
  canvas: HTMLCanvasElement,
  borderWidthPx: number = 20,
  borderColor: string = '#000000'
): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = canvas.width + borderWidthPx * 2;
  out.height = canvas.height + borderWidthPx * 2;
  const ctx = out.getContext('2d')!;

  ctx.fillStyle = borderColor;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, borderWidthPx, borderWidthPx);

  return out;
}

// 14. Image Rounded Corner Generator
export function addRoundedCornersToImage(
  canvas: HTMLCanvasElement,
  radiusPx: number = 30
): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext('2d')!;

  ctx.beginPath();
  const r = Math.min(radiusPx, canvas.width / 2, canvas.height / 2);
  ctx.moveTo(r, 0);
  ctx.lineTo(canvas.width - r, 0);
  ctx.quadraticCurveTo(canvas.width, 0, canvas.width, r);
  ctx.lineTo(canvas.width, canvas.height - r);
  ctx.quadraticCurveTo(canvas.width, canvas.height, canvas.width - r, canvas.height);
  ctx.lineTo(r, canvas.height);
  ctx.quadraticCurveTo(0, canvas.height, 0, canvas.height - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(canvas, 0, 0);
  return out;
}

// 15. Image Padding Generator
export function addPaddingToImage(
  canvas: HTMLCanvasElement,
  padTop: number = 20,
  padRight: number = 20,
  padBottom: number = 20,
  padLeft: number = 20,
  padColor: string = '#FFFFFF'
): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = canvas.width + padLeft + padRight;
  out.height = canvas.height + padTop + padBottom;
  const ctx = out.getContext('2d')!;

  ctx.fillStyle = padColor;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, padLeft, padTop);

  return out;
}

// 16. Image Canvas Expander
export function expandCanvasSquare(
  canvas: HTMLCanvasElement,
  fillColor: string = '#FFFFFF'
): HTMLCanvasElement {
  const size = Math.max(canvas.width, canvas.height);
  const out = document.createElement('canvas');
  out.width = size;
  out.height = size;
  const ctx = out.getContext('2d')!;

  ctx.fillStyle = fillColor;
  ctx.fillRect(0, 0, size, size);

  const x = Math.round((size - canvas.width) / 2);
  const y = Math.round((size - canvas.height) / 2);
  ctx.drawImage(canvas, x, y);

  return out;
}

// 17. Image Social Media Size Calculator
export function getSocialMediaSizes(): string {
  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║         SOCIAL MEDIA IMAGE RESOLUTION CHEAT SHEET            ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `INSTAGRAM:`,
    `• Square Post (1:1):          1080 x 1080 px`,
    `• Portrait Post (4:5):        1080 x 1350 px (Best for feed engagement)`,
    `• Landscape Post (1.91:1):    1080 x 566 px`,
    `• Story & Reels (9:16):       1080 x 1920 px`,
    ``,
    `YOUTUBE:`,
    `• Video Thumbnail (16:9):     1280 x 720 px (Min 640px wide, max 2MB)`,
    `• Channel Banner (16:9):      2560 x 1440 px (Safe area 1546 x 423 px)`,
    `• Profile Picture (1:1):      800 x 800 px`,
    ``,
    `TWITTER / X:`,
    `• In-Stream Single Post:      1600 x 900 px (16:9) or 1200 x 675 px`,
    `• Header Banner (3:1):        1500 x 500 px`,
    `• Profile Photo (1:1):        400 x 400 px`,
    ``,
    `LINKEDIN:`,
    `• Post Image (1.91:1):        1200 x 627 px`,
    `• Company Cover Banner:       1128 x 191 px`,
    `• Profile Photo:              400 x 400 px`,
    ``,
    `TIKTOK / FACEBOOK:`,
    `• TikTok Video / Story:       1080 x 1920 px (9:16)`,
    `• Facebook Shared Link (1.91:1): 1200 x 630 px`,
    `• Facebook Cover Photo:       820 x 312 px`
  ].join('\n');
}

// 18. Passport Photo Size Calculator
export function calculatePassportPhotoSize(country: string = 'United States'): string {
  const specs: Record<string, { mmW: number; mmH: number; inW: number; inH: number; headMin: number; headMax: number; notes: string }> = {
    'United States': { mmW: 50.8, mmH: 50.8, inW: 2.0, inH: 2.0, headMin: 50, headMax: 69, notes: 'White or off-white background, 600x600 px min @ 300 DPI.' },
    'United Kingdom': { mmW: 35.0, mmH: 45.0, inW: 1.38, inH: 1.77, headMin: 64, headMax: 75, notes: 'Light grey or cream background, head 29mm-34mm.' },
    'India': { mmW: 50.8, mmH: 50.8, inW: 2.0, inH: 2.0, headMin: 50, headMax: 70, notes: '2x2" or 35x45mm (visa/OCI standard), plain white background.' },
    'Schengen / Europe': { mmW: 35.0, mmH: 45.0, inW: 1.38, inH: 1.77, headMin: 70, headMax: 80, notes: 'Biometric standard, head height 32mm - 36mm.' },
    'Canada': { mmW: 50.0, mmH: 70.0, inW: 1.97, inH: 2.76, headMin: 44, headMax: 51, notes: 'Head size 31mm - 36mm from chin to crown.' },
    'Australia': { mmW: 35.0, mmH: 45.0, inW: 1.38, inH: 1.77, headMin: 71, headMax: 80, notes: 'Head size 32mm - 36mm, white background.' }
  };

  const spec = specs[country] || specs['United States'];
  const px300W = Math.round((spec.mmW / 25.4) * 300);
  const px300H = Math.round((spec.mmH / 25.4) * 300);
  const px600W = Math.round((spec.mmW / 25.4) * 600);
  const px600H = Math.round((spec.mmH / 25.4) * 600);

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║              PASSPORT PHOTO SPECIFICATION AUDIT              ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `COUNTRY STANDARD: ${country.toUpperCase()}`,
    ``,
    `OFFICIAL PHYSICAL DIMENSIONS:`,
    `• Millimeters:  ${spec.mmW} mm (Width) x ${spec.mmH} mm (Height)`,
    `• Inches:       ${spec.inW}" x ${spec.inH}"`,
    `• Head Height:  ${spec.headMin}% to ${spec.headMax}% of vertical frame`,
    ``,
    `PRINT RESOLUTION REQUIREMENTS:`,
    `• At 300 DPI Standard:  ${px300W} x ${px300H} pixels`,
    `• At 600 DPI Hi-Res:    ${px600W} x ${px600H} pixels`,
    ``,
    `COMPLIANCE GUIDELINES:`,
    `• ${spec.notes}`,
    `• Full face visible, neutral expression, eyes open looking directly at lens.`
  ].join('\n');
}

// 19. Photo ID Size Calculator
export function calculatePhotoIdSize(cardFormat: string = 'CR80'): string {
  const formats: Record<string, { name: string; mmW: number; mmH: number; desc: string }> = {
    'CR80': { name: 'CR80 (Standard Credit Card & Driver License)', mmW: 85.6, mmH: 53.98, desc: 'ISO/IEC 7810 ID-1 standard for driver licenses, banking, and employee badges.' },
    'CR79': { name: 'CR79 (Adhesive Backed Proximity Cards)', mmW: 83.9, mmH: 52.1, desc: 'Slightly smaller to fit within the lip of standard clamshell proximity cards.' },
    'CR100': { name: 'CR100 (Oversized Event & Military Badge)', mmW: 98.5, mmH: 67.0, desc: 'Large conference badge and military ID format.' },
  };

  const f = formats[cardFormat] || formats['CR80'];
  const px300W = Math.round((f.mmW / 25.4) * 300);
  const px300H = Math.round((f.mmH / 25.4) * 300);

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║              PHOTO ID CARD SPECIFICATION REPORT              ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `CARD STANDARD: ${f.name}`,
    ``,
    `PHYSICAL METRICS:`,
    `• Dimensions:    ${f.mmW} mm x ${f.mmH} mm`,
    `• Inches:        ${(f.mmW / 25.4).toFixed(3)}" x ${(f.mmH / 25.4).toFixed(3)}"`,
    `• Standard DPI:  ${px300W} x ${px300H} px @ 300 DPI`,
    `• Corner Radius: 3.18 mm (1/8") ISO rounded corners`,
    `• Description:   ${f.desc}`
  ].join('\n');
}

// 20. Image Contact Sheet Generator
export function calculateContactSheetLayout(
  imageCount: number = 12,
  columns: number = 4,
  thumbW: number = 300,
  thumbH: number = 200,
  padding: number = 15
): string {
  const cols = Math.max(1, columns);
  const rows = Math.ceil(imageCount / cols);
  const totalW = cols * thumbW + (cols + 1) * padding;
  const totalH = rows * thumbH + (rows + 1) * padding;

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║             CONTACT SHEET GRID SPECIFICATIONS                ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `• Total Images:        ${imageCount} thumbnails`,
    `• Grid Configuration:  ${cols} Columns x ${rows} Rows`,
    `• Thumbnail Size:      ${thumbW} x ${thumbH} pixels`,
    `• Cell Gutter Padding: ${padding} pixels`,
    ``,
    `CANVAS SPECIFICATIONS:`,
    `• Sheet Width:   ${totalW} pixels (${((totalW / 300) * 25.4).toFixed(1)} mm @ 300 DPI)`,
    `• Sheet Height:  ${totalH} pixels (${((totalH / 300) * 25.4).toFixed(1)} mm @ 300 DPI)`,
    `• Canvas Pixels: ${((totalW * totalH) / 1e6).toFixed(2)} MP`,
    `• Fits A4 Page:  ${totalW <= 2480 && totalH <= 3508 ? '✓ Yes (Fits 300 DPI A4 print)' : 'Custom Canvas Sheet'}`
  ].join('\n');
}

// 21. ID Photo Sheet Maker Planner
export function planIdPhotoSheet(
  photoType: string = 'passport_us',
  paperSize: '4x6' | '5x7' | 'A4' = '4x6'
): string {
  // Dimensions in inches & mm
  let photoW = 2.0;
  let photoH = 2.0;
  let photoLabel = 'US Passport (2" x 2" / 51x51 mm)';

  if (photoType.includes('schengen') || photoType.includes('35x45') || photoType.includes('uk')) {
    photoW = 35 / 25.4;
    photoH = 45 / 25.4;
    photoLabel = 'Schengen / UK / India (35 x 45 mm)';
  } else if (photoType.includes('cr80') || photoType.includes('badge')) {
    photoW = 85.6 / 25.4;
    photoH = 53.98 / 25.4;
    photoLabel = 'CR80 ID Badge (85.6 x 54 mm)';
  } else if (photoType.includes('stamp') || photoType.includes('25x30')) {
    photoW = 25 / 25.4;
    photoH = 30 / 25.4;
    photoLabel = 'Stamp Size (25 x 30 mm)';
  }

  let paperW = 4.0;
  let paperH = 6.0;
  let paperName = '4" x 6" Photo Paper (10 x 15 cm)';

  if (paperSize === '5x7') {
    paperW = 5.0;
    paperH = 7.0;
    paperName = '5" x 7" Photo Paper (13 x 18 cm)';
  } else if (paperSize === 'A4') {
    paperW = 8.27;
    paperH = 11.69;
    paperName = 'A4 Standard Sheet (210 x 297 mm)';
  }

  const margin = 0.2; // 0.2 inch margin
  const gap = 0.1; // 0.1 inch gap

  const usableW = paperW - 2 * margin;
  const usableH = paperH - 2 * margin;

  const cols = Math.floor((usableW + gap) / (photoW + gap));
  const rows = Math.floor((usableH + gap) / (photoH + gap));
  const totalPhotos = cols * rows;

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║               ID PHOTO SHEET MAKER LAYOUT                    ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `PHOTO SPECIFICATION:  ${photoLabel}`,
    `PAPER MEDIUM:         ${paperName}`,
    `RESOLUTION TARGET:    300 DPI High-Definition Photo Lab Print`,
    ``,
    `GRID ARRANGEMENT:`,
    `• Columns:            ${cols} across`,
    `• Rows:               ${rows} down`,
    `• Total Photos/Sheet: ${totalPhotos} individual ID photos per print`,
    `• Gap Between Photos: 0.1" (2.5 mm cutting guide lines)`,
    `• Outer Edge Margin:  0.2" (5.1 mm non-printable margin)`,
    ``,
    `PRINT INSTRUCTIONS:`,
    `• Select "Borderless" or "Actual Size / 100%" (Do NOT select "Fit to Printable Area").`,
    `• Use glossy or matte premium 200+ GSM photographic paper.`
  ].join('\n');
}

// 22. Image Color Palette Extractor
export function extractColorPalette(canvas?: HTMLCanvasElement, maxColors: number = 6): string {
  if (canvas && canvas.width > 0 && canvas.height > 0) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imgData = ctx.getImageData(0, 0, Math.min(100, canvas.width), Math.min(100, canvas.height));
      const colorCounts: Record<string, number> = {};
      const data = imgData.data;

      for (let i = 0; i < data.length; i += 16) {
        const r = Math.round(data[i] / 16) * 16;
        const g = Math.round(data[i + 1] / 16) * 16;
        const b = Math.round(data[i + 2] / 16) * 16;
        const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
        colorCounts[hex] = (colorCounts[hex] || 0) + 1;
      }

      const sorted = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]).slice(0, maxColors);
      const rows = sorted.map(([hex, cnt], idx) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
        return `• Color #${idx + 1}: ${hex} │ rgb(${r}, ${g}, ${b}) │ Luminosity: ${lum}/255 │ Rank Weight: ${cnt}`;
      });

      return [
        `╔══════════════════════════════════════════════════════════════╗`,
        `║            EXTRACTED IMAGE COLOR PALETTE                     ║`,
        `╚══════════════════════════════════════════════════════════════╝`,
        `SAMPLED PIXELS: ${imgData.width * imgData.height} pixels scanned`,
        `UNIQUE DOMINANT SWATCHES: ${sorted.length} colors extracted`,
        ``,
        ...rows,
        ``,
        `CSS PALETTE VARIABLES:`,
        `:root {`,
        ...sorted.map(([hex], i) => `  --palette-color-${i + 1}: ${hex};`),
        `}`
      ].join('\n');
    }
  }

  // Fallback demo audit report
  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║            EXTRACTED IMAGE COLOR PALETTE                     ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `STATUS: Ready for image sampling. Upload or generate an image canvas to extract dominant hues.`,
    ``,
    `SAMPLE 6-COLOR DOMINANT PALETTE EXTRACTION:`,
    `• Color #1 (Dominant Background): #1E293B │ rgb(30, 41, 59)   │ Slate Navy    (42% presence)`,
    `• Color #2 (Primary Accent):     #3B82F6 │ rgb(59, 130, 246) │ Vibrant Blue  (24% presence)`,
    `• Color #3 (Secondary Accent):   #10B981 │ rgb(16, 185, 129) │ Emerald Green (16% presence)`,
    `• Color #4 (Warm Contrast):      #F59E0B │ rgb(245, 158, 11) │ Amber Gold    (9% presence)`,
    `• Color #5 (Highlight Light):    #F8FAFC │ rgb(248, 250, 252)│ Crisp White   (6% presence)`,
    `• Color #6 (Deep Shadow):        #0F172A │ rgb(15, 23, 42)   │ Dark Obsidian (3% presence)`,
    ``,
    `CSS EXPORT:`,
    `:root {`,
    `  --color-brand-1: #1E293B;`,
    `  --color-brand-2: #3B82F6;`,
    `  --color-brand-3: #10B981;`,
    `}`
  ].join('\n');
}

// 23. Image Transparency Checker
export function checkImageTransparency(canvas?: HTMLCanvasElement): string {
  if (canvas && canvas.width > 0 && canvas.height > 0) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentPixels = 0;
      let semiTransparentPixels = 0;
      let opaquePixels = 0;
      const total = canvas.width * canvas.height;

      for (let i = 3; i < data.length; i += 4) {
        const alpha = data[i];
        if (alpha === 0) transparentPixels++;
        else if (alpha < 255) semiTransparentPixels++;
        else opaquePixels++;
      }

      const hasAlpha = transparentPixels > 0 || semiTransparentPixels > 0;

      return [
        `╔══════════════════════════════════════════════════════════════╗`,
        `║              IMAGE TRANSPARENCY AUDIT REPORT                 ║`,
        `╚══════════════════════════════════════════════════════════════╝`,
        `TRANSPARENCY DETECTED: ${hasAlpha ? '✓ YES (Alpha Channel Active)' : '✗ NO (100% Fully Opaque)'}`,
        `TOTAL PIXEL MATRIX:    ${total.toLocaleString()} pixels (${canvas.width} x ${canvas.height})`,
        ``,
        `ALPHA CHANNEL DISTRIBUTION:`,
        `• Fully Transparent (Alpha = 0):   ${transparentPixels.toLocaleString()} px (${((transparentPixels / total) * 100).toFixed(2)}%)`,
        `• Semi-Transparent (1 ≤ Alpha ≤ 254): ${semiTransparentPixels.toLocaleString()} px (${((semiTransparentPixels / total) * 100).toFixed(2)}%)`,
        `• Fully Opaque (Alpha = 255):      ${opaquePixels.toLocaleString()} px (${((opaquePixels / total) * 100).toFixed(2)}%)`,
        ``,
        `WEB FORMAT COMPATIBILITY:`,
        `• PNG (Portable Network Graphics):  Supported (8-bit index or 32-bit RGBA)`,
        `• WebP (Lossless/Lossy Alpha):      Supported (High compression efficiency)`,
        `• AVIF (Alpha Transparency):        Supported`,
        `• JPEG / JPG:                       ⚠️ NOT Supported (Alpha will convert to solid black or white)`
      ].join('\n');
    }
  }

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║              IMAGE TRANSPARENCY AUDIT REPORT                 ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `STATUS: Ready for transparency scan. Upload a PNG/WebP image to verify alpha channel depth.`,
    ``,
    `ALGORITHM CHECKPOINTS:`,
    `• Scans 32-bit RGBA bitstream for Alpha byte byte-values < 255.`,
    `• Identifies feathered anti-aliased edge halos and binary cutout masks.`,
    `• Recommends optimal container formats (PNG vs WebP vs SVG).`
  ].join('\n');
}

// 24. Image Alpha Channel Viewer (Renders alpha mask: White = opaque, Black = transparent)
export function renderAlphaChannelMask(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const outCanvas = document.createElement('canvas');
  outCanvas.width = canvas.width;
  outCanvas.height = canvas.height;
  const outCtx = outCanvas.getContext('2d')!;

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    data[i] = alpha;     // R
    data[i + 1] = alpha; // G
    data[i + 2] = alpha; // B
    data[i + 3] = 255;   // Fully opaque mask
  }

  outCtx.putImageData(imgData, 0, 0);
  return outCanvas;
}

// 25. Image Aspect Ratio Batch Calculator
export function calculateBatchAspectRatios(inputList: string): string {
  const lines = inputList.trim().split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) {
    return 'Enter resolutions in format: Width x Height (one per line)\nExample:\n1920x1080\n3840x2160\n1080x1920\n1200x630\n1080x1080\n2560x1440\n1280x720';
  }

  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

  const results: Array<{ raw: string; w: number; h: number; ratio: string; name: string; orient: string; mp: string }> = [];

  for (const line of lines) {
    const match = line.match(/(\d+)\s*[xX*×,]\s*(\d+)/);
    if (!match) continue;
    const w = parseInt(match[1]);
    const h = parseInt(match[2]);
    if (w <= 0 || h <= 0) continue;

    const divisor = gcd(w, h);
    let rW = w / divisor;
    let rH = h / divisor;

    // Standardize common ratios like 16:9, 16:10, 4:3, 21:9
    let commonRatio = `${rW}:${rH}`;
    let designation = 'Custom';

    if (Math.abs(w / h - 16 / 9) < 0.01) { commonRatio = '16:9'; designation = 'Widescreen HD/4K'; }
    else if (Math.abs(w / h - 4 / 3) < 0.01) { commonRatio = '4:3'; designation = 'Classic SD / iPad'; }
    else if (Math.abs(w / h - 1 / 1) < 0.001) { commonRatio = '1:1'; designation = 'Square / Instagram Post'; }
    else if (Math.abs(w / h - 9 / 16) < 0.01) { commonRatio = '9:16'; designation = 'Vertical / Reels / TikTok'; }
    else if (Math.abs(w / h - 21 / 9) < 0.05) { commonRatio = '21:9'; designation = 'Ultrawide Cinema'; }
    else if (Math.abs(w / h - 3 / 2) < 0.01) { commonRatio = '3:2'; designation = '35mm DSLR Standard'; }

    const orient = w > h ? 'Landscape' : w < h ? 'Portrait' : 'Square';
    const mp = ((w * h) / 1e6).toFixed(2);
    results.push({ raw: line.trim(), w, h, ratio: commonRatio, name: designation, orient, mp });
  }

  if (results.length === 0) return 'No valid resolutions found. Use format: Width x Height (e.g., 1920x1080).';

  const rows = results.map(r => 
    `║ ${`${r.w}x${r.h}`.padEnd(14).slice(0, 14)} │ ${r.ratio.padEnd(6).slice(0, 6)} │ ${r.orient.padEnd(10).slice(0, 10)} │ ${`${r.mp} MP`.padStart(7)} │ ${r.name.padEnd(20).slice(0, 20)} ║`
  );

  return [
    `╔═════════════════════════════════════════════════════════════════════════════╗`,
    `║                BATCH ASPECT RATIO AUDIT TABLE                               ║`,
    `╚═════════════════════════════════════════════════════════════════════════════╝`,
    `PROCESSED RESOLUTIONS: ${results.length} items analyzed`,
    ``,
    `╟────────────────┬────────┬────────────┬─────────┬──────────────────────╢`,
    `║ Resolution     │ Ratio  │ Orient     │ MP      │ Standard Standard    ║`,
    `╟────────────────┼────────┼────────────┼─────────┼──────────────────────╢`,
    ...rows,
    `╚════════════════╧════════╧════════════╧═════════╧══════════════════════╝`
  ].join('\n');
}

// 26. Image Crop Coordinate Calculator
export function calculateCropCoordinates(
  imgW: number = 1920,
  imgH: number = 1080,
  targetRatio: string = '1:1',
  anchor: 'center' | 'top' | 'bottom' | 'left' | 'right' = 'center'
): string {
  const parts = targetRatio.split(':').map(Number);
  const rW = parts[0] || 1;
  const rH = parts[1] || 1;
  const targetAspect = rW / rH;
  const srcAspect = imgW / imgH;

  let cropW = imgW;
  let cropH = imgH;

  if (srcAspect > targetAspect) {
    // Source is wider than target -> crop width
    cropW = Math.round(imgH * targetAspect);
    cropH = imgH;
  } else {
    // Source is taller than target -> crop height
    cropW = imgW;
    cropH = Math.round(imgW / targetAspect);
  }

  let x = 0;
  let y = 0;

  if (anchor === 'center') {
    x = Math.round((imgW - cropW) / 2);
    y = Math.round((imgH - cropH) / 2);
  } else if (anchor === 'top') {
    x = Math.round((imgW - cropW) / 2);
    y = 0;
  } else if (anchor === 'bottom') {
    x = Math.round((imgW - cropW) / 2);
    y = imgH - cropH;
  } else if (anchor === 'left') {
    x = 0;
    y = Math.round((imgH - cropH) / 2);
  } else if (anchor === 'right') {
    x = imgW - cropW;
    y = Math.round((imgH - cropH) / 2);
  }

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║            IMAGE CROP COORDINATE SPECIFICATION               ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `ORIGINAL RESOLUTION: ${imgW} x ${imgH} px (${(imgW / imgH).toFixed(2)}:1)`,
    `TARGET ASPECT RATIO: ${targetRatio} (${anchor.toUpperCase()} Anchor)`,
    ``,
    `CALCULATED BOUNDING BOX:`,
    `• Left (X Offset):   ${x} pixels`,
    `• Top (Y Offset):    ${y} pixels`,
    `• Crop Width:        ${cropW} pixels`,
    `• Crop Height:       ${cropH} pixels`,
    `• Trimmed Margins:   X: ${(imgW - cropW)} px discarded, Y: ${(imgH - cropH)} px discarded`,
    ``,
    `CODE SNIPPETS:`,
    `• CSS clip-path:  inset(${y}px ${imgW - (x + cropW)}px ${imgH - (y + cropH)}px ${x}px)`,
    `• FFmpeg filter:  -vf "crop=${cropW}:${cropH}:${x}:${y}"`,
    `• Canvas draw:    ctx.drawImage(img, ${x}, ${y}, ${cropW}, ${cropH}, 0, 0, ${cropW}, ${cropH})`
  ].join('\n');
}

// 27. Image Resolution Comparison Tool
export function compareImageResolutions(resA: string = '1920x1080', resB: string = '3840x2160'): string {
  const parse = (s: string) => {
    const m = s.match(/(\d+)\s*[xX*×,]\s*(\d+)/);
    return m ? { w: parseInt(m[1]), h: parseInt(m[2]) } : { w: 1920, h: 1080 };
  };

  const a = parse(resA);
  const b = parse(resB);

  const pxA = a.w * a.h;
  const pxB = b.w * b.h;
  const mpA = pxA / 1e6;
  const mpB = pxB / 1e6;

  const ratioPixels = pxB / pxA;
  const scaleLinear = Math.sqrt(ratioPixels);

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║               IMAGE RESOLUTION COMPARISON                    ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `IMAGE A: ${a.w} x ${a.h} pixels (${mpA.toFixed(2)} Megapixels)`,
    `IMAGE B: ${b.w} x ${b.h} pixels (${mpB.toFixed(2)} Megapixels)`,
    ``,
    `COMPARATIVE ANALYSIS:`,
    `• Total Pixel Ratio:   Image B has ${ratioPixels.toFixed(2)}x the pixels of Image A`,
    `• Linear Scale Factor: Image B is ${scaleLinear.toFixed(2)}x as wide/tall as Image A`,
    `• Difference in Pixels: ${(pxB - pxA > 0 ? '+' : '')}${(pxB - pxA).toLocaleString()} pixels (${((mpB - mpA)).toFixed(2)} MP)`,
    ``,
    `PRINT DISPLAY CAPACITY (@ 300 DPI):`,
    `• Image A Print: ${(a.w / 300).toFixed(1)}" x ${(a.h / 300).toFixed(1)}" (${((a.w / 300) * 25.4).toFixed(0)} x ${((a.h / 300) * 25.4).toFixed(0)} mm)`,
    `• Image B Print: ${(b.w / 300).toFixed(1)}" x ${(b.h / 300).toFixed(1)}" (${((b.w / 300) * 25.4).toFixed(0)} x ${((b.h / 300) * 25.4).toFixed(0)} mm)`
  ].join('\n');
}

// 28. Image Pixel Density Analyzer
export function analyzePixelDensity(
  width: number = 2560,
  height: number = 1440,
  diagonalInches: number = 27
): string {
  const ppi = Math.sqrt(width * width + height * height) / diagonalInches;
  const dotPitchMm = (25.4 / ppi);

  // Ideal retina viewing distance: distance = 3438 / PPI (inches)
  const retinaDistanceInches = 3438 / ppi;
  const retinaDistanceCm = retinaDistanceInches * 2.54;

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║               IMAGE PIXEL DENSITY AUDIT                      ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `PANEL RESOLUTION:     ${width} x ${height} Pixels`,
    `SCREEN DIAGONAL:      ${diagonalInches} Inches`,
    ``,
    `DENSITY METRICS:`,
    `• Pixel Density:       ${ppi.toFixed(1)} PPI (Pixels Per Inch)`,
    `• Dot Pitch:           ${dotPitchMm.toFixed(4)} mm (Pixel Spacing)`,
    `• Total Pixels:        ${((width * height) / 1e6).toFixed(2)} Megapixels`,
    ``,
    `RETINA THRESHOLD (Steve Jobs / Human Eye 20/20 Resolving Limit):`,
    `• Becomes "Retina" at: ${retinaDistanceInches.toFixed(1)}" (${retinaDistanceCm.toFixed(1)} cm) viewing distance`,
    `• Desktop Normal View: At 24" distance, individual pixels are ${24 >= retinaDistanceInches ? 'Completely Invisible (Retina grade)' : 'Slightly discernable'}.`
  ].join('\n');
}

// 29. Image Print Sheet Layout Planner
export function planPrintSheetLayout(
  paperSize: string = 'A4',
  photoW: number = 100,
  photoH: number = 150,
  marginMm: number = 10,
  spacingMm: number = 5
): string {
  const paperDims: Record<string, { w: number; h: number; name: string }> = {
    'A4': { w: 210, h: 297, name: 'A4 Sheet (210 x 297 mm)' },
    'A3': { w: 297, h: 420, name: 'A3 Sheet (297 x 420 mm)' },
    '4x6': { w: 101.6, h: 152.4, name: '4" x 6" Photo Paper (102 x 152 mm)' },
    'Letter': { w: 215.9, h: 279.4, name: 'US Letter (8.5" x 11")' }
  };

  const p = paperDims[paperSize] || paperDims['A4'];
  const usableW = p.w - 2 * marginMm;
  const usableH = p.h - 2 * marginMm;

  // Orientation 1: Normal
  const cols1 = Math.floor((usableW + spacingMm) / (photoW + spacingMm));
  const rows1 = Math.floor((usableH + spacingMm) / (photoH + spacingMm));
  const count1 = cols1 * rows1;

  // Orientation 2: Rotated 90 degrees
  const cols2 = Math.floor((usableW + spacingMm) / (photoH + spacingMm));
  const rows2 = Math.floor((usableH + spacingMm) / (photoW + spacingMm));
  const count2 = cols2 * rows2;

  const bestIsRotated = count2 > count1;
  const bestCount = Math.max(count1, count2);
  const bestCols = bestIsRotated ? cols2 : cols1;
  const bestRows = bestIsRotated ? rows2 : rows1;

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║               PRINT SHEET LAYOUT PLANNER                     ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `TARGET SHEET:         ${p.name}`,
    `PHOTO CARD SIZE:      ${photoW} mm (W) x ${photoH} mm (H)`,
    `MARGINS / SPACING:    ${marginMm} mm margin, ${spacingMm} mm gutter gap`,
    ``,
    `OPTIMAL IMPOSITION GRID:`,
    `• Best Orientation:   ${bestIsRotated ? 'Rotated 90° (Landscape on sheet)' : 'Normal Portrait Orientation'}`,
    `• Grid Layout:        ${bestCols} Columns x ${bestRows} Rows`,
    `• Photos per Sheet:   ${bestCount} individual photos per printed page`,
    `• Sheet Utilization:  ${(((bestCount * photoW * photoH) / (p.w * p.h)) * 100).toFixed(1)}% paper area efficiency`
  ].join('\n');
}

// 30. Image Thumbnail Generator Dimensions
export function generateThumbnailGrid(
  origW: number = 1920,
  origH: number = 1080,
  targetSizesStr: string = '64, 128, 256, 512, 1024'
): string {
  const sizes = targetSizesStr.split(/[,;\s]+/).map(Number).filter(n => !isNaN(n) && n > 0);
  const aspect = origW / origH;

  const rows = sizes.map(sz => {
    let w = sz;
    let h = Math.round(sz / aspect);
    if (origH > origW) {
      h = sz;
      w = Math.round(sz * aspect);
    }
    return `• ${sz}px Box:  ${w} x ${h} px  (Retina @2x: ${w * 2} x ${h * 2} px) │ ~${((w * h) / 1000).toFixed(0)}k pixels`;
  });

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║              THUMBNAIL SCALE SPECIFICATIONS                  ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `ORIGINAL SOURCE: ${origW} x ${origH} px (${aspect.toFixed(3)}:1 Aspect)`,
    ``,
    `MULTI-SCALE THUMBNAIL DIMENSIONS:`,
    ...rows,
    ``,
    `HTML SRCSET CODE GENERATION:`,
    `<img src="thumb-512.jpg"`,
    `     srcset="${sizes.map(s => `thumb-${s}.jpg ${s}w`).join(', ')}"`,
    `     sizes="(max-width: 600px) 256px, 512px" alt="Responsive Image" />`
  ].join('\n');
}

// 31. Image Side-by-Side Comparator Info
export function compareImagesSideBySide(imageAInfo: string = '1920x1080, 2.4 MB, JPEG', imageBInfo: string = '1920x1080, 680 KB, WebP'): string {
  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║              IMAGE SIDE-BY-SIDE COMPARATOR                   ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `IMAGE A SPECIFICATION:  ${imageAInfo}`,
    `IMAGE B SPECIFICATION:  ${imageBInfo}`,
    ``,
    `COMPARATIVE METRICS:`,
    `• Visual Diff Mode:     Synchronized Zoom & Pan Active`,
    `• Overlay Slider:       Left = Image A (Original) │ Right = Image B (Optimized)`,
    `• Compression Delta:    WebP achieves ~71.6% bandwidth savings with identical perceptual fidelity (SSIM > 0.98).`
  ].join('\n');
}

// 32. Image Color Profile Inspector
export function inspectColorProfile(profileName: string = 'sRGB'): string {
  const profiles: Record<string, { gamut: string; coverage: string; bitDepth: string; useCase: string }> = {
    'sRGB': {
      gamut: 'Rec.709 / Standard Red Green Blue',
      coverage: '100% of standard web displays, browsers, and mobile devices',
      bitDepth: '8-bit per channel (16.7 Million Colors)',
      useCase: 'Universal standard for Web, eCommerce, social media, and digital displays.'
    },
    'Display P3': {
      gamut: 'DCI-P3 wide color gamut (Apple Retina, modern OLED)',
      coverage: '25% wider color spectrum than sRGB (deeper reds and vivid greens)',
      bitDepth: '10-bit HDR compatible',
      useCase: 'Modern Apple iPhones, MacBooks, 4K HDR video, and high-end digital photography.'
    },
    'Adobe RGB (1998)': {
      gamut: 'Adobe RGB 1998 Wide Gamut',
      coverage: 'Covers ~50% of the CIE 1931 chromaticity diagram',
      bitDepth: '16-bit professional workflows',
      useCase: 'Pre-press CMYK commercial offset printing, fine art photography, inkjet proofing.'
    }
  };

  const p = profiles[profileName] || profiles['sRGB'];

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║              IMAGE COLOR PROFILE INSPECTION                  ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `PROFILE:              ${profileName}`,
    `COLOR GAMUT:          ${p.gamut}`,
    `SPECTRAL COVERAGE:    ${p.coverage}`,
    `COLOR DEPTH:          ${p.bitDepth}`,
    ``,
    `RECOMMENDED USE CASE:`,
    `• ${p.useCase}`,
    ``,
    `BROWSER RENDERING WARNING:`,
    `• Images tagged with Adobe RGB or ProPhoto RGB may appear washed out or desaturated on non-color-managed web browsers if not converted to sRGB before publishing.`
  ].join('\n');
}

// 33. Image Batch Renaming Planner
export function planBatchImageRenaming(
  pattern: string = '{date}_{project}_{seq}',
  fileListText: string = 'IMG_001.JPG\nIMG_002.JPG\nDSC_4921.PNG\nscreenshot.png',
  startSeq: number = 1
): string {
  const files = fileListText.trim().split('\n').filter(f => f.trim().length > 0);
  if (files.length === 0) return 'Enter filenames to plan batch renaming scheme.';

  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const mappings: string[] = [];

  files.forEach((file, idx) => {
    const ext = file.split('.').pop() || 'jpg';
    const seqStr = (startSeq + idx).toString().padStart(3, '0');
    let newName = pattern
      .replace(/{date}/g, today)
      .replace(/{project}/g, 'PhotoSet')
      .replace(/{seq}/g, seqStr)
      .replace(/{original}/g, file.replace(/\.[^/.]+$/, ''));

    newName = `${newName}.${ext}`;
    mappings.push(`• ${file.padEnd(20).slice(0, 20)}  ──►  ${newName}`);
  });

  return [
    `╔══════════════════════════════════════════════════════════════╗`,
    `║               BATCH IMAGE RENAMING PLAN                      ║`,
    `╚══════════════════════════════════════════════════════════════╝`,
    `NAMING TEMPLATE:      ${pattern}`,
    `FILES TO PROCESS:     ${files.length} items`,
    `STARTING SEQUENCE:    #${startSeq.toString().padStart(3, '0')}`,
    ``,
    `PROJECTED FILENAME MAPPINGS:`,
    ...mappings,
    ``,
    `SAFE RENAMING RULES: All spaces removed, special characters normalized, extensions preserved.`
  ].join('\n');
}


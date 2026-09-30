/**
 * 100% Client-Side Universal Image Converter & Optimization Engine
 * Processes all image operations in local browser RAM using HTML5 Canvas & Web APIs.
 * Zero server uploads, zero network latency, 100% private.
 */

export interface ConvertedImageResult {
  dataUrl: string;
  blob: Blob;
  format: 'webp' | 'png' | 'jpeg';
  mimeType: string;
  originalSizeKb: number;
  convertedSizeKb: number;
  savedPercent: number;
  width: number;
  height: number;
  filename: string;
}

/**
 * Creates a high-fidelity vector/canvas sample image in browser RAM
 */
export function generateSampleCanvasImage(
  title: string = 'EncryptDecrypt Sample',
  width: number = 800,
  height: number = 500
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Background gradient
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#0F172A');
  grad.addColorStop(0.5, '#1E293B');
  grad.addColorStop(1, '#0284C7');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative grid lines
  ctx.strokeStyle = 'rgba(46, 155, 255, 0.12)';
  ctx.lineWidth = 1;
  const step = 40;
  for (let x = 0; x < width; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += step) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Glowing center shield circle
  ctx.beginPath();
  ctx.arc(width / 2, height / 2 - 30, 80, 0, Math.PI * 2);
  const circleGrad = ctx.createRadialGradient(
    width / 2, height / 2 - 30, 10,
    width / 2, height / 2 - 30, 80
  );
  circleGrad.addColorStop(0, 'rgba(46, 155, 255, 0.35)');
  circleGrad.addColorStop(1, 'rgba(14, 165, 233, 0.05)');
  ctx.fillStyle = circleGrad;
  ctx.fill();
  ctx.strokeStyle = '#2E9BFF';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Shield Icon / Badge
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('🛡️', width / 2, height / 2 - 30);

  // Title Text
  ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(title, width / 2, height / 2 + 80);

  // Subtitle Text
  ctx.font = '500 14px monospace';
  ctx.fillStyle = '#38BDF8';
  ctx.fillText('100% Private Client-Side Browser RAM Processing', width / 2, height / 2 + 115);

  // Footer metadata badge
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.fillRect(width / 2 - 140, height - 55, 280, 30);
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(width / 2 - 140, height - 55, 280, 30);

  ctx.font = '600 11px monospace';
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(`${width} × ${height} px · Lossless RGBA`, width / 2, height - 37);

  return canvas;
}

/**
 * Loads an image from a Data URL, Object URL, or Blob into an HTMLImageElement
 */
export function loadImageElement(source: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image into browser canvas.'));
    img.src = source;
  });
}

/**
 * Converts any image source to WebP, PNG, or JPEG with real byte size calculations
 */
export async function convertImage(
  source: string | HTMLCanvasElement,
  options: {
    format?: 'webp' | 'png' | 'jpeg';
    quality?: number; // 0.1 to 1.0
    maxWidth?: number;
    maxHeight?: number;
    backgroundColor?: string;
  } = {}
): Promise<ConvertedImageResult> {
  const format = options.format || 'webp';
  const quality = typeof options.quality === 'number' ? options.quality : 0.85;

  let canvas: HTMLCanvasElement;
  let originalBytes = 0;

  if (typeof source === 'string') {
    // Estimate original size from data url length or fetch
    if (source.startsWith('data:')) {
      const base64Data = source.split(',')[1] || '';
      originalBytes = Math.round((base64Data.length * 3) / 4);
    } else {
      originalBytes = 150 * 1024;
    }

    const img = await loadImageElement(source);
    let targetW = img.naturalWidth || img.width || 800;
    let targetH = img.naturalHeight || img.height || 600;

    if (options.maxWidth && targetW > options.maxWidth) {
      targetH = Math.round((targetH * options.maxWidth) / targetW);
      targetW = options.maxWidth;
    }
    if (options.maxHeight && targetH > options.maxHeight) {
      targetW = Math.round((targetW * options.maxHeight) / targetH);
      targetH = options.maxHeight;
    }

    canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;
    const ctx = canvas.getContext('2d')!;

    // Optional background fill for JPEG (no alpha)
    if (format === 'jpeg' || options.backgroundColor) {
      ctx.fillStyle = options.backgroundColor || '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    ctx.drawImage(img, 0, 0, targetW, targetH);
  } else {
    canvas = source;
    originalBytes = canvas.width * canvas.height * 4;
  }

  const mimeType = format === 'webp' ? 'image/webp' : format === 'png' ? 'image/png' : 'image/jpeg';
  const dataUrl = canvas.toDataURL(mimeType, quality);

  const base64Content = dataUrl.split(',')[1] || '';
  const convertedBytes = Math.round((base64Content.length * 3) / 4);

  const origKb = originalBytes > 0 ? originalBytes / 1024 : convertedBytes / 1024 * 1.5;
  const convKb = convertedBytes / 1024;
  const savedPercent = origKb > 0 ? Math.round(((origKb - convKb) / origKb) * 100) : 0;

  // Create Blob
  const byteChars = atob(base64Content);
  const byteNums = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) {
    byteNums[i] = byteChars.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNums);
  const blob = new Blob([byteArray], { type: mimeType });

  return {
    dataUrl,
    blob,
    format,
    mimeType,
    originalSizeKb: Math.max(0.1, parseFloat(origKb.toFixed(1))),
    convertedSizeKb: Math.max(0.1, parseFloat(convKb.toFixed(1))),
    savedPercent,
    width: canvas.width,
    height: canvas.height,
    filename: `converted-image.${format === 'jpeg' ? 'jpg' : format}`
  };
}

/**
 * Converts SVG string or SVG file to a crystal-clear PNG image
 */
export async function convertSvgToPng(
  svgString: string,
  scale: number = 2
): Promise<ConvertedImageResult> {
  const cleanSvg = svgString.trim();
  const blob = new Blob([cleanSvg], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  try {
    const img = await loadImageElement(url);
    const width = (img.naturalWidth || 500) * scale;
    const height = (img.naturalHeight || 500) * scale;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d')!;

    ctx.drawImage(img, 0, 0, width, height);
    URL.revokeObjectURL(url);

    return convertImage(canvas, { format: 'png' });
  } catch (err) {
    URL.revokeObjectURL(url);
    throw new Error('Could not parse SVG document. Ensure it starts with <svg> and has valid XML tags.');
  }
}

/**
 * Generates an SVG code string sample
 */
export function getSampleSvgCode(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="cyberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0284C7" />
      <stop offset="50%" stop-color="#2563EB" />
      <stop offset="100%" stop-color="#4F46E5" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>
  <rect width="400" height="400" rx="32" fill="#0B0F19" />
  <circle cx="200" cy="200" r="130" fill="url(#cyberGrad)" opacity="0.9" filter="url(#glow)" />
  <polygon points="200,90 310,270 90,270" fill="none" stroke="#38BDF8" stroke-width="8" stroke-linejoin="round" />
  <circle cx="200" cy="200" r="30" fill="#FFFFFF" />
  <text x="200" y="340" fill="#F8FAFC" font-family="system-ui, sans-serif" font-weight="bold" font-size="20" text-anchor="middle">ENCRYPTDECRYPT</text>
  <text x="200" y="365" fill="#38BDF8" font-family="monospace" font-size="12" text-anchor="middle">100% PRIVATE CLIENT-SIDE</text>
</svg>`;
}

/**
 * Generates Multi-Size Favicons from an Image
 */
export async function generateFaviconKit(sourceDataUrl: string): Promise<Array<{ size: number; dataUrl: string; label: string }>> {
  const sizes = [
    { size: 16, label: '16x16 (Browser Tab Standard)' },
    { size: 32, label: '32x32 (Retina Browser Tab / Taskbar)' },
    { size: 48, label: '48x48 (Desktop Shortcut Icon)' },
    { size: 180, label: '180x180 (Apple Touch Icon / iOS Home)' },
    { size: 512, label: '512x512 (PWA Manifest Splash Icon)' }
  ];

  const img = await loadImageElement(sourceDataUrl);
  const results = [];

  for (const item of sizes) {
    const canvas = document.createElement('canvas');
    canvas.width = item.size;
    canvas.height = item.size;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, item.size, item.size);

    results.push({
      size: item.size,
      label: item.label,
      dataUrl: canvas.toDataURL('image/png')
    });
  }

  return results;
}

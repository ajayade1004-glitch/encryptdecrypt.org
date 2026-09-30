import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Download, Copy, Check, RefreshCw, Image as ImageIcon, 
  Sparkles, Layers, Sliders, ArrowRight, Eye, ShieldCheck, FileCheck, CheckCircle
} from 'lucide-react';
import { 
  convertImage, convertSvgToPng, generateSampleCanvasImage, 
  getSampleSvgCode, generateFaviconKit, ConvertedImageResult 
} from '../utils/universalImageConverter';

interface ImageStudioProps {
  toolSlug: string;
  toolName: string;
  onPayloadGenerated?: (dataUrl: string, info: string) => void;
}

export const ImageStudio: React.FC<ImageStudioProps> = ({
  toolSlug,
  toolName,
  onPayloadGenerated
}) => {
  const isSvgTool = toolSlug.includes('svg');
  const isFaviconTool = toolSlug.includes('favicon');
  const defaultFormat: 'webp' | 'png' | 'jpeg' = toolSlug.includes('png') ? 'png' : toolSlug.includes('jpeg') ? 'jpeg' : 'webp';

  const [targetFormat, setTargetFormat] = useState<'webp' | 'png' | 'jpeg'>(defaultFormat);
  const [quality, setQuality] = useState<number>(85);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [svgSource, setSvgSource] = useState<string>(getSampleSvgCode());
  const [result, setResult] = useState<ConvertedImageResult | null>(null);
  const [faviconKit, setFaviconKit] = useState<Array<{ size: number; dataUrl: string; label: string }> | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize with a beautiful in-memory canvas sample
  useEffect(() => {
    loadSampleImage();
  }, [toolSlug]);

  const loadSampleImage = () => {
    if (isSvgTool) {
      const code = getSampleSvgCode();
      setSvgSource(code);
      runSvgConversion(code);
    } else {
      const sampleCanvas = generateSampleCanvasImage(toolName, 800, 500);
      const dataUrl = sampleCanvas.toDataURL('image/png');
      setSourceImage(dataUrl);
      runConversion(dataUrl, targetFormat, quality / 100);
    }
  };

  const runConversion = async (dataUrl: string, fmt: 'webp' | 'png' | 'jpeg', q: number) => {
    setIsProcessing(true);
    try {
      const conv = await convertImage(dataUrl, {
        format: fmt,
        quality: q
      });
      setResult(conv);

      if (isFaviconTool) {
        const kit = await generateFaviconKit(dataUrl);
        setFaviconKit(kit);
      }

      if (onPayloadGenerated) {
        onPayloadGenerated(conv.dataUrl, `[Converted ${conv.format.toUpperCase()}]\nSize: ${conv.convertedSizeKb} KB (${conv.savedPercent}% reduction)\nDimensions: ${conv.width}x${conv.height} px`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const runSvgConversion = async (code: string) => {
    setIsProcessing(true);
    try {
      const conv = await convertSvgToPng(code, 2);
      setResult(conv);
      if (onPayloadGenerated) {
        onPayloadGenerated(conv.dataUrl, `[Rasterized PNG from SVG]\nResolution: ${conv.width}x${conv.height} px\nSize: ${conv.convertedSizeKb} KB`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type === 'image/svg+xml' || file.name.endsWith('.svg')) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target?.result as string;
        if (text) {
          setSvgSource(text);
          runSvgConversion(text);
        }
      };
      reader.readAsText(file);
    } else {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const url = evt.target?.result as string;
        if (url) {
          setSourceImage(url);
          runConversion(url, targetFormat, quality / 100);
        }
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const url = evt.target?.result as string;
        if (url) {
          setSourceImage(url);
          runConversion(url, targetFormat, quality / 100);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.dataUrl;
    a.download = `encryptdecrypt-${toolSlug}-${Date.now()}.${result.format === 'jpeg' ? 'jpg' : result.format}`;
    a.click();
  };

  const handleCopyBase64 = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.dataUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="card-glass p-4 sm:p-5 bg-[var(--bg-surface)] border border-blue-500/30 rounded-2xl shadow-md my-4 space-y-4">
      {/* Studio Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-sky-400">
            <ImageIcon size={18} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 m-0">
              <span>Client-Side High-Speed Image Studio</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                100% RAM
              </span>
            </h3>
            <p className="text-[11px] text-[var(--text-muted)] m-0">
              Zero server upload · Native HTML5 Canvas conversion & hardware acceleration
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSampleImage}
            className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5"
            title="Load sample canvas graphic"
          >
            <Sparkles size={13} className="text-sky-400" />
            <span>Load Sample Image</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn btn-primary text-xs py-1 px-3 flex items-center gap-1.5 shadow-xs"
          >
            <Upload size={13} />
            <span>Upload Image</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*,.png,.jpg,.jpeg,.webp,.svg,.bmp,.gif,.ico"
            className="hidden"
          />
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-3 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs">
        {/* Target Format */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
            Target Output Format
          </label>
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            {(['webp', 'png', 'jpeg'] as const).map((fmt) => (
              <button
                key={fmt}
                onClick={() => {
                  setTargetFormat(fmt);
                  if (sourceImage) runConversion(sourceImage, fmt, quality / 100);
                }}
                className={`flex-1 py-1 px-2 rounded-md font-bold text-xs transition cursor-pointer uppercase ${
                  targetFormat === fmt
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                }`}
              >
                {fmt === 'jpeg' ? 'JPG' : fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Compression Quality Slider */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-bold text-[var(--text-secondary)] uppercase tracking-wider">
              Compression Quality
            </label>
            <span className="font-mono font-bold text-sky-400 text-xs">
              {quality}%
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={100}
            step={5}
            value={quality}
            disabled={targetFormat === 'png'}
            onChange={(e) => {
              const q = parseInt(e.target.value, 10);
              setQuality(q);
              if (sourceImage) runConversion(sourceImage, targetFormat, q / 100);
            }}
            className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="text-[10px] text-[var(--text-muted)]">
            {targetFormat === 'png' ? 'PNG format is always lossless (100%)' : 'Balanced: 80%–90% for web performance'}
          </span>
        </div>

        {/* Live Metrics Badge */}
        <div className="flex flex-col justify-center sm:col-span-2 md:col-span-1">
          {result && (
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-400 block">
                  File Size Reduction
                </span>
                <span className="text-sm font-extrabold text-emerald-400">
                  {result.savedPercent > 0 ? `-${result.savedPercent}% Saved` : 'Optimized'}
                </span>
              </div>
              <div className="text-right font-mono text-[11px] text-[var(--text-secondary)]">
                <div>{result.originalSizeKb} KB ➔ <strong className="text-sky-400">{result.convertedSizeKb} KB</strong></div>
                <div className="text-[10px] text-[var(--text-muted)]">{result.width} × {result.height} px</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Side-By-Side Visual Comparison */}
      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 transition-all duration-200 ${
          isDragging ? 'ring-2 ring-blue-500 bg-blue-500/5' : ''
        }`}
      >
        {/* Source Image Box */}
        <div className="rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
              <Eye size={13} className="text-slate-400" /> Source Image
            </span>
            {result && (
              <span className="text-[10px] font-mono text-[var(--text-muted)]">
                Original ({result.originalSizeKb} KB)
              </span>
            )}
          </div>

          <div className="w-full h-56 sm:h-64 flex items-center justify-center overflow-hidden rounded-lg bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:16px_16px] border border-[var(--border-subtle)]">
            {sourceImage ? (
              <img
                src={sourceImage}
                alt="Source preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center p-4 text-[var(--text-muted)] text-xs">
                <Upload size={24} className="mx-auto mb-2 text-sky-400" />
                <span>Drop image here or click Upload above</span>
              </div>
            )}
          </div>
        </div>

        {/* Converted Output Image Box */}
        <div className="rounded-xl border border-blue-500/40 bg-[var(--bg-input)] p-3 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <CheckCircle size={13} className="text-emerald-400" />
              Converted Output ({targetFormat.toUpperCase()})
            </span>
            {result && (
              <span className="text-[10px] font-mono font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {result.convertedSizeKb} KB
              </span>
            )}
          </div>

          <div className="w-full h-56 sm:h-64 flex items-center justify-center overflow-hidden rounded-lg bg-[repeating-conic-gradient(#1e293b_0%_25%,#0f172a_0%_50%)] bg-[length:16px_16px] border border-[var(--border-subtle)] relative">
            {isProcessing ? (
              <div className="flex flex-col items-center gap-2 text-sky-400 text-xs">
                <RefreshCw size={24} className="animate-spin" />
                <span>Processing in browser RAM...</span>
              </div>
            ) : result ? (
              <img
                src={result.dataUrl}
                alt="Converted preview"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-center p-4 text-[var(--text-muted)] text-xs">
                <span>Output preview will appear here</span>
              </div>
            )}
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-[var(--border-subtle)]">
            <div className="flex items-center gap-1 text-[11px] text-[var(--text-muted)] font-mono">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Zero Server Transmission</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyBase64}
                disabled={!result}
                className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5 cursor-pointer"
                title="Copy Base64 DataURI"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                <span>{copied ? 'Copied URI!' : 'Copy Base64'}</span>
              </button>

              <button
                onClick={handleDownload}
                disabled={!result}
                className="btn btn-primary text-xs py-1 px-3.5 flex items-center gap-1.5 shadow-md cursor-pointer font-bold"
              >
                <Download size={13} />
                <span>Download {targetFormat.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Size Favicon Kit Generator (For favicon tools) */}
      {isFaviconTool && faviconKit && (
        <div className="p-3.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] mt-3">
          <h4 className="text-xs font-bold text-[var(--text-primary)] mb-2 flex items-center gap-1.5">
            <FileCheck size={14} className="text-sky-400" />
            <span>Generated Favicon Pack (Multi-Resolution Icons)</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {faviconKit.map((item) => (
              <div key={item.size} className="p-2 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] flex flex-col items-center gap-2 text-center">
                <img src={item.dataUrl} alt={`${item.size}px icon`} className="w-8 h-8 rounded" />
                <span className="text-[10px] font-mono text-[var(--text-secondary)]">{item.size} × {item.size}</span>
                <a
                  href={item.dataUrl}
                  download={`favicon-${item.size}x${item.size}.png`}
                  className="text-[10px] font-bold text-sky-400 hover:underline flex items-center gap-1"
                >
                  <Download size={10} /> Save PNG
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

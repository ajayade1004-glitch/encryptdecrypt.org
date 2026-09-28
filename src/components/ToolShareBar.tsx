import React, { useState } from 'react';
import { Share2, Link2, Check, ExternalLink } from 'lucide-react';
import { ToolItem } from '../types';

interface ToolShareBarProps {
  tool: ToolItem;
  className?: string;
}

export const ToolShareBar: React.FC<ToolShareBarProps> = ({ tool, className = '' }) => {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Construct absolute canonical share URL
  const baseUrl = 'https://www.encryptdecrypt.org';
  const shareUrl = `${baseUrl}/tools/${tool.category}/${tool.slug}/`;
  const shareText = `Check out ${tool.name} on EncryptDecrypt.org — 100% Free & Private In-Browser Developer Utility!`;

  // Handle Copy Link
  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      setCopied(true);
      setShowToast(true);
      setTimeout(() => setCopied(false), 2500);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error('Failed to copy link', err);
    }
  };

  // Handle Native All Share / Web Share API
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${tool.name} | EncryptDecrypt.org`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share failed, fallback to copy
        handleCopyLink();
      }
    } else {
      // Fallback on desktop browsers without Web Share API
      handleCopyLink();
    }
  };

  // Popup helper for social sharing
  const openSharePopup = (url: string) => {
    const width = 600;
    const height = 500;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    window.open(
      url,
      'share_window',
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
    );
  };

  // Share URLs
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const xTwitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
  const pinterestUrl = `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}&description=${encodeURIComponent(shareText)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;

  return (
    <div className={`card-glass rounded-xl p-3.5 sm:p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-xs relative ${className}`}>
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white text-xs font-semibold py-1.5 px-3.5 rounded-full shadow-lg flex items-center gap-1.5 animate-bounce z-30">
          <Check size={13} />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left Label */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 text-[#2E9BFF] flex items-center justify-center shrink-0">
            <Share2 size={14} />
          </div>
          <div>
            <span className="text-xs font-bold text-[var(--text-primary)] block leading-tight">
              Share This Tool
            </span>
            <span className="text-[11px] text-[var(--text-muted)] block leading-tight font-mono">
              100% Client-Side &amp; Zero-Log
            </span>
          </div>
        </div>

        {/* Share Buttons Grid / Row */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Facebook */}
          <button
            onClick={() => openSharePopup(facebookUrl)}
            aria-label="Share on Facebook"
            title="Share on Facebook"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-[#1877F2] hover:bg-[#166fe5] active:scale-95 transition shadow-xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="hidden xs:inline text-[11px] font-semibold">Facebook</span>
          </button>

          {/* X (formerly Twitter) */}
          <button
            onClick={() => openSharePopup(xTwitterUrl)}
            aria-label="Share on X"
            title="Share on X (Twitter)"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-black hover:bg-neutral-900 border border-neutral-700/80 active:scale-95 transition shadow-xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="hidden xs:inline text-[11px] font-semibold">X</span>
          </button>

          {/* Pinterest */}
          <button
            onClick={() => openSharePopup(pinterestUrl)}
            aria-label="Share on Pinterest"
            title="Share on Pinterest"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-[#E60023] hover:bg-[#d5001f] active:scale-95 transition shadow-xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.211-.174.256-.402.155-1.499-.696-2.435-2.883-2.435-4.643 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
            </svg>
            <span className="hidden xs:inline text-[11px] font-semibold">Pinterest</span>
          </button>

          {/* WhatsApp */}
          <button
            onClick={() => openSharePopup(whatsappUrl)}
            aria-label="Share on WhatsApp"
            title="Share on WhatsApp"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-white bg-[#25D366] hover:bg-[#20ba59] active:scale-95 transition shadow-xs cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="hidden xs:inline text-[11px] font-semibold">WhatsApp</span>
          </button>

          {/* All Share (Native / Web Share API) */}
          <button
            onClick={handleNativeShare}
            aria-label="All Share Options"
            title="Open All Share Options / Copy Link"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-[var(--text-primary)] bg-[var(--bg-input)] hover:bg-[#2E9BFF]/15 hover:text-[#2E9BFF] border border-[var(--border-subtle)] hover:border-[#2E9BFF]/40 active:scale-95 transition shadow-xs cursor-pointer"
          >
            <Share2 size={13} className="text-[#2E9BFF]" />
            <span className="text-[11px] font-semibold">All Share</span>
          </button>

          {/* Direct Copy Link Button */}
          <button
            onClick={handleCopyLink}
            aria-label="Copy Tool Link"
            title="Copy Direct Link to Clipboard"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition shadow-xs cursor-pointer border ${
              copied
                ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40'
                : 'bg-[var(--bg-input)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border-[var(--border-subtle)]'
            }`}
          >
            {copied ? <Check size={13} className="text-emerald-400" /> : <Link2 size={13} />}
            <span className="hidden sm:inline text-[11px] font-semibold">
              {copied ? 'Copied!' : 'Copy Link'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

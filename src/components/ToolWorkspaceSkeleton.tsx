import React from 'react';
import { ArrowLeft, Terminal, QrCode, Columns, Rows, RefreshCw, Link2, ShieldCheck, Zap } from 'lucide-react';
import { ToolItem } from '../types';

interface ToolWorkspaceSkeletonProps {
  tool: ToolItem;
  onBack: () => void;
}

export const ToolWorkspaceSkeleton: React.FC<ToolWorkspaceSkeletonProps> = ({ tool, onBack }) => {
  return (
    <div className="tool-workspace-page animate-in fade-in duration-150">
      {/* Sleek Breadcrumb & Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 text-xs font-mono">
        <nav className="flex items-center gap-1.5 text-[var(--text-muted)] overflow-x-auto whitespace-nowrap py-0.5" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 list-none m-0 p-0">
            <li className="flex items-center gap-1.5">
              <button 
                onClick={onBack}
                className="transition flex items-center gap-1 text-[var(--text-secondary)] hover:text-[#00FF88] cursor-pointer"
              >
                <ArrowLeft size={13} className="text-[#00FF88]" /> [..] All Tools
              </button>
              <span className="text-[#1B2A3A]">/</span>
            </li>
            <li className="flex items-center gap-1.5">
              <span className="text-[#00D9FF]">{tool.categoryName || tool.category}</span>
              <span className="text-[#1B2A3A]">/</span>
            </li>
            <li aria-current="page">
              <span className="text-[#00FF88] font-bold">{tool.name}</span>
            </li>
          </ol>
        </nav>

        {/* Quick Actions & Layout Toggle */}
        <div className="flex items-center gap-1.5">
          <div className="hidden md:flex items-center bg-[#060A0E] p-0.5 rounded-lg border border-[#1B2A3A] text-[11px] font-mono">
            <button className="px-2 py-1 rounded flex items-center gap-1 bg-[#00FF88] text-[#05070A] font-bold shadow-[0_0_8px_rgba(0,255,136,0.3)]">
              <Columns size={12} />
              <span>Split</span>
            </button>
            <button className="px-2 py-1 rounded flex items-center gap-1 text-[var(--text-muted)]">
              <Rows size={12} />
              <span>Stacked</span>
            </button>
          </div>

          <button className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5 opacity-60">
            <RefreshCw size={12} /> <span className="hidden sm:inline">Load</span> Sample
          </button>
          <button className="btn btn-secondary text-xs py-1 px-2.5 flex items-center gap-1.5 opacity-60">
            <Link2 size={12} />
            <span className="hidden sm:inline">Share</span>
          </button>
          <button className="btn btn-ghost text-xs py-1 px-2 text-[var(--text-muted)] opacity-60">
            Clear
          </button>
        </div>
      </div>

      {/* Cyber Hacker Tool Hero Strip */}
      <div className="card-glass p-3.5 mb-3.5 bg-[#0B1117] border border-[#00FF88]/30 rounded-xl flex flex-wrap items-center justify-between gap-3 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#00FF88]/10 border border-[#00FF88]/40 flex items-center justify-center text-[#00FF88] shrink-0 shadow-xs">
            {tool.slug === 'qr-code-generator' ? <QrCode size={18} /> : <Terminal size={18} />}
          </div>
          <div>
            <div className="flex items-center gap-2 font-mono">
              <h1 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight m-0 leading-tight">
                {tool.name}
              </h1>
              {tool.popular && (
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  POPULAR
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] mt-0.5">
              <span className="flex items-center gap-1 text-[#00FF88]">
                <Zap size={11} /> 100% In-Browser RAM
              </span>
              <span>·</span>
              <span className="text-[var(--text-secondary)]">{tool.categoryName || tool.category}</span>
            </div>
          </div>
        </div>

        {/* Security attestation tag */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#060A0E] border border-[#00FF88]/20 text-[11px] font-mono text-[#00FF88]">
          <ShieldCheck size={14} className="text-[#00FF88]" />
          <span>Zero-Knowledge Sandbox Active</span>
        </div>
      </div>

      {/* Workspace Split/Stacked Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Input Panel Skeleton */}
        <div className="card-glass bg-[#0B1117] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col min-h-[340px]">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-3">
            <span className="text-xs font-mono font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse"></span>
              INPUT / PARAMETERS
            </span>
            <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <span>Ready</span>
            </div>
          </div>
          <div className="flex-1 rounded-lg bg-[#060A0E] border border-[var(--border-subtle)] p-3 font-mono text-xs text-[var(--text-muted)] flex flex-col justify-between">
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-white/5 rounded w-3/4"></div>
              <div className="h-3 bg-white/5 rounded w-1/2"></div>
              <div className="h-3 bg-white/5 rounded w-2/3"></div>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-1.5 pt-4">
              <RefreshCw size={11} className="animate-spin text-[#00FF88]" /> Initializing client cryptographic engine...
            </div>
          </div>
        </div>

        {/* Output Panel Skeleton */}
        <div className="card-glass bg-[#0B1117] border border-[var(--border-subtle)] rounded-xl p-4 flex flex-col min-h-[340px]">
          <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] mb-3">
            <span className="text-xs font-mono font-bold text-[var(--text-secondary)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00D9FF]"></span>
              OUTPUT RESULT
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
              <span>0 bytes</span>
            </div>
          </div>
          <div className="flex-1 rounded-lg bg-[#060A0E] border border-[var(--border-subtle)] p-3 font-mono text-xs text-[var(--text-muted)] flex flex-col justify-between">
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-white/5 rounded w-5/6"></div>
              <div className="h-3 bg-white/5 rounded w-3/5"></div>
              <div className="h-3 bg-white/5 rounded w-4/5"></div>
            </div>
            <div className="text-[11px] text-[var(--text-muted)] flex items-center justify-between pt-4">
              <span>Hardware-accelerated WebCrypto</span>
              <span className="text-[#00FF88]">Verified Zero-Knowledge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

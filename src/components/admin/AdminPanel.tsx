import React from 'react';
import { ToolItem } from '../../types';
import { Shield, ArrowLeft } from 'lucide-react';

interface AdminPanelProps {
  tools: ToolItem[];
  onCloseAdmin: () => void;
  onRefreshToolsCatalog?: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ tools, onCloseAdmin }) => {
  return (
    <div className="card-glass p-6 max-w-2xl mx-auto my-8">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2 font-bold text-lg text-[var(--text-primary)]">
          <Shield size={20} className="text-[#2E9BFF]" />
          <span>System Console</span>
        </div>
        <button
          onClick={onCloseAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Catalog</span>
        </button>
      </div>

      <p className="text-xs text-[var(--text-secondary)] leading-relaxed mb-4">
        EncryptDecrypt.org operates strictly as a 100% client-side zero-knowledge developer utility platform. All {tools.length} active tools execute directly in volatile browser memory.
      </p>

      <div className="p-4 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs space-y-2">
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Active Utilities:</span>
          <span className="font-mono font-bold text-[#2E9BFF]">{tools.length} Tools</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Cryptographic Engine:</span>
          <span className="font-mono text-[var(--text-primary)]">W3C WebCrypto API</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[var(--text-muted)]">Data Telemetry:</span>
          <span className="font-mono text-emerald-400 font-bold">Disabled (Zero Server Transmissions)</span>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  Download, Upload, FileSpreadsheet, FileJson, 
  Check, RefreshCw, AlertCircle, Database, ToggleLeft, ToggleRight 
} from 'lucide-react';
import { ToolItem } from '../../../types';
import { 
  getToolOverrides, 
  saveToolOverride, 
  exportAllAdminData, 
  importAllAdminData 
} from '../../../utils/adminStorage';

interface ImportExportTabProps {
  tools: ToolItem[];
  onRefreshTools: () => void;
  showToast: (msg: string) => void;
}

export const ImportExportTab: React.FC<ImportExportTabProps> = ({
  tools,
  onRefreshTools,
  showToast,
}) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Export JSON
  const handleExportJson = () => {
    const data = JSON.stringify(tools, null, 2);
    downloadFile(data, 'encryptdecrypt-tools-catalog.json', 'application/json');
    showToast('Tools JSON catalog exported!');
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['ID', 'Slug', 'Name', 'Category', 'Description', 'Popular', 'Disabled'];
    const rows = tools.map(t => [
      `"${t.id}"`,
      `"${t.slug}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.categoryName}"`,
      `"${(t.shortDesc || '').replace(/"/g, '""')}"`,
      t.popular ? 'TRUE' : 'FALSE',
      (t as any).status === 'disabled' || (t as any).disabled ? 'TRUE' : 'FALSE',
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csvContent, 'encryptdecrypt-tools-catalog.csv', 'text/csv');
    showToast('Tools CSV catalog exported!');
  };

  // Full Admin Backup
  const handleExportFullBackup = () => {
    const backup = exportAllAdminData();
    downloadFile(backup, `encryptdecrypt-admin-backup-${new Date().toISOString().split('T')[0]}.json`, 'application/json');
    showToast('Complete admin settings & content backup exported!');
  };

  // Import JSON handler
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        // Check if it's full admin backup or tools catalog
        if (parsed.seo || parsed.ads || parsed.overrides) {
          const res = importAllAdminData(text);
          if (res.success) {
            onRefreshTools();
            showToast('Full system backup restored successfully!');
          } else {
            alert(res.error);
          }
        } else if (Array.isArray(parsed)) {
          // Bulk merge tools
          parsed.forEach((item: any) => {
            if (item.id) {
              saveToolOverride(item.id, {
                disabled: item.disabled,
                popular: item.popular,
                customName: item.name,
                metaTitle: item.metaTitle,
              });
            }
          });
          onRefreshTools();
          showToast(`Successfully imported & updated ${parsed.length} tools!`);
        } else {
          alert('Invalid JSON schema format.');
        }
      } catch (err: any) {
        alert('Failed to parse JSON file: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Bulk Operations
  const handleBulkEnableAll = () => {
    if (confirm('Enable all 300+ tools across the website?')) {
      tools.forEach(t => saveToolOverride(t.id, { disabled: false }));
      onRefreshTools();
      showToast('All tools enabled!');
    }
  };

  const handleBulkDisableAll = () => {
    if (confirm('Disable all tools? Users will not be able to open any tool.')) {
      tools.forEach(t => saveToolOverride(t.id, { disabled: true }));
      onRefreshTools();
      showToast('All tools disabled.');
    }
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 text-xs">
      <div className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Catalog Import, Export & Bulk Orchestration
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Export all 300+ tools to JSON or Excel/CSV, restore full system backups, or execute bulk batch operations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Card */}
        <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Download size={16} className="text-emerald-500" />
            Export Tools & Data Catalog
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Download your active catalog format for spreadsheet editing or offline backup.
          </p>

          <div className="space-y-3 pt-2">
            <button
              onClick={handleExportJson}
              className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] hover:border-[#2E9BFF] flex items-center justify-between cursor-pointer transition"
            >
              <div className="flex items-center gap-2.5">
                <FileJson size={18} className="text-[#2E9BFF]" />
                <div className="text-left">
                  <span className="font-bold text-[var(--text-primary)] block">Export Tools as JSON</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Structured schema with IDs, slugs, and categories</span>
                </div>
              </div>
              <Download size={14} className="text-[var(--text-muted)]" />
            </button>

            <button
              onClick={handleExportCsv}
              className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] hover:border-[#2E9BFF] flex items-center justify-between cursor-pointer transition"
            >
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet size={18} className="text-emerald-500" />
                <div className="text-left">
                  <span className="font-bold text-[var(--text-primary)] block">Export Tools as CSV</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Excel & Google Sheets compatible tabular sheet</span>
                </div>
              </div>
              <Download size={14} className="text-[var(--text-muted)]" />
            </button>

            <button
              onClick={handleExportFullBackup}
              className="w-full p-3 rounded-xl border border-[var(--border-subtle)] bg-blue-500/10 hover:border-[#2E9BFF] flex items-center justify-between cursor-pointer transition"
            >
              <div className="flex items-center gap-2.5">
                <Database size={18} className="text-[#2E9BFF]" />
                <div className="text-left">
                  <span className="font-bold text-[var(--text-primary)] block">Complete System Snapshot</span>
                  <span className="text-[11px] text-[var(--text-muted)]">Backs up SEO, Ads, FAQs, and Tool Overrides</span>
                </div>
              </div>
              <Download size={14} className="text-[#2E9BFF]" />
            </button>
          </div>
        </div>

        {/* Import & Restore Card */}
        <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Upload size={16} className="text-purple-400" />
            Import / Restore Catalog
          </h3>
          <p className="text-xs text-[var(--text-muted)]">
            Upload JSON catalog or snapshot files to restore tool parameters or apply bulk overrides.
          </p>

          <label className="border-2 border-dashed border-[var(--border-subtle)] hover:border-[#2E9BFF] rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition group">
            <Upload size={28} className="text-[var(--text-muted)] group-hover:text-[#2E9BFF] mb-2 transition" />
            <span className="font-bold text-[var(--text-primary)]">Select or drop .json file</span>
            <span className="text-[11px] text-[var(--text-muted)] mt-1">Accepts tools catalog JSON or full admin backup</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Bulk Operations */}
      <div className="card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)]">
          Fast Bulk Operations
        </h3>
        <p className="text-xs text-[var(--text-muted)]">
          Instantly apply updates across all 300+ tools simultaneously.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleBulkEnableAll}
            className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Check size={14} /> Enable All 300+ Tools
          </button>
          <button
            onClick={handleBulkDisableAll}
            className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20 font-semibold flex items-center gap-2 cursor-pointer"
          >
            <AlertCircle size={14} /> Disable All Tools
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Wrench, Layers, Eye, Zap, ArrowUpRight, Plus, 
  Download, ShieldCheck, Activity, Search, CheckCircle2, 
  XCircle, Clock, AlertTriangle, Sparkles 
} from 'lucide-react';
import { ToolItem } from '../../../types';
import { AdminModule, ActivityLogItem, AnalyticsSummary } from '../../../types/admin';

interface DashboardTabProps {
  tools: ToolItem[];
  analytics: AnalyticsSummary;
  activityLogs: ActivityLogItem[];
  onNavigateTab: (tab: AdminModule) => void;
  onOpenAddTool?: () => void;
  onSelectToolToEdit?: (tool: ToolItem) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  tools,
  analytics,
  activityLogs,
  onNavigateTab,
  onOpenAddTool,
  onSelectToolToEdit,
}) => {
  const activeCount = tools.filter(t => (t as any).status !== 'disabled').length;
  const popularTools = tools.filter(t => t.popular).slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="card-glass p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-[11px] font-semibold mb-3">
            <CheckCircle2 size={13} />
            <span>Master System Status: Operational (100% Client-Side)</span>
          </div>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight mb-2">
            EncryptDecrypt.org Control Hub
          </h2>
          <p className="text-xs text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Manage all 300+ cryptographic utilities, category taxonomy, long-form SEO content, Google AdSense unit positions, and security audit logs from one unified master dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => onOpenAddTool ? onOpenAddTool() : onNavigateTab('tools')}
            className="btn btn-primary text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer shadow-md"
          >
            <Plus size={15} /> Add New Tool
          </button>
          <button
            onClick={() => onNavigateTab('import-export')}
            className="px-3.5 py-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-primary)] hover:border-[#2E9BFF] transition flex items-center gap-2 cursor-pointer"
          >
            <Download size={14} /> Export Backup
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Tools */}
        <div 
          onClick={() => onNavigateTab('tools')}
          className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl hover:border-[#2E9BFF]/50 transition cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Total Tools</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#2E9BFF] flex items-center justify-center group-hover:scale-105 transition">
              <Wrench size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {tools.length}
          </div>
          <div className="text-[11px] text-emerald-500 mt-1 font-medium flex items-center gap-1">
            <CheckCircle2 size={12} /> {activeCount} Active utilities
          </div>
        </div>

        {/* Card 2: Categories */}
        <div 
          onClick={() => onNavigateTab('categories')}
          className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl hover:border-[#2E9BFF]/50 transition cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Categories</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-105 transition">
              <Layers size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            14
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            Fully indexed category hubs
          </div>
        </div>

        {/* Card 3: Total Executions */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl hover:border-[#2E9BFF]/50 transition cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Client Executions</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-105 transition">
              <Zap size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {analytics.totalExecutions.toLocaleString()}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1">
            100% Private local RAM runs
          </div>
        </div>

        {/* Card 4: Page Views */}
        <div 
          onClick={() => onNavigateTab('analytics')}
          className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl hover:border-[#2E9BFF]/50 transition cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-[var(--text-secondary)]">Page Views</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-105 transition">
              <Eye size={16} />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {analytics.totalPageViews.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">
            +18.4% this month
          </div>
        </div>
      </div>

      {/* Two Column Section: Popular Tools & Recent Audit Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Popular Tools Leaderboard */}
        <div className="lg:col-span-7 card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Sparkles size={16} className="text-[#2E9BFF]" />
                Featured & Popular Tools
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">High-traffic tools receiving greatest user engagement</p>
            </div>
            <button
              onClick={() => onNavigateTab('tools')}
              className="text-xs text-[#2E9BFF] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              View All ({tools.length}) <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="divide-y divide-[var(--border-subtle)]">
            {popularTools.map((tool) => (
              <div 
                key={tool.id} 
                className="py-3 flex items-center justify-between gap-4 group hover:bg-[var(--bg-surface-hover)] px-2 rounded-lg transition"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                      {tool.name}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20 whitespace-nowrap">
                      {tool.categoryName}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--text-muted)] block truncate">
                    /{tool.slug}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onSelectToolToEdit ? onSelectToolToEdit(tool) : onNavigateTab('tools')}
                    className="px-2.5 py-1 text-[11px] font-semibold text-[#2E9BFF] hover:bg-blue-500/15 rounded-md transition cursor-pointer"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Real-Time Activity Log */}
        <div className="lg:col-span-5 card-glass p-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                <Activity size={16} className="text-emerald-500" />
                Recent System Activity
              </h3>
              <p className="text-[11px] text-[var(--text-muted)]">Live audit trail of administrative changes</p>
            </div>
            <button
              onClick={() => onNavigateTab('users')}
              className="text-xs text-[#2E9BFF] hover:underline font-semibold cursor-pointer"
            >
              Full Log
            </button>
          </div>

          <div className="space-y-3">
            {activityLogs.slice(0, 5).map((log) => (
              <div 
                key={log.id}
                className="p-3 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-[var(--text-primary)] text-[11px]">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)] font-mono flex items-center gap-1">
                    <Clock size={10} />
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                  {log.details}
                </p>
                <div className="text-[10px] font-mono text-[var(--text-muted)] flex items-center justify-between pt-1">
                  <span>Module: {log.module}</span>
                  <span>By: {log.user}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Access Control Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div 
          onClick={() => onNavigateTab('ads')}
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#2E9BFF] transition cursor-pointer"
        >
          <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1">Google AdSense Auto-Ads</h4>
          <p className="text-[11px] text-[var(--text-muted)]">Configure Publisher ID and toggle auto vs manual ad slots.</p>
        </div>

        <div 
          onClick={() => onNavigateTab('seo')}
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#2E9BFF] transition cursor-pointer"
        >
          <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1">Robots.txt & Sitemap</h4>
          <p className="text-[11px] text-[var(--text-muted)]">Regenerate 300+ tool XML sitemaps and update crawler rules.</p>
        </div>

        <div 
          onClick={() => onNavigateTab('settings')}
          className="p-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[#2E9BFF] transition cursor-pointer"
        >
          <h4 className="text-xs font-bold text-[var(--text-primary)] mb-1">Master Security & Users</h4>
          <p className="text-[11px] text-[var(--text-muted)]">Update administrator password, email, and tracking IDs.</p>
        </div>
      </div>
    </div>
  );
};

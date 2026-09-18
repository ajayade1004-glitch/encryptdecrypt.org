import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Wrench, FolderTree, Globe, FileText, 
  Home, DollarSign, BookOpen, BarChart3, Users, Settings, 
  ArrowUpDown, LogOut, ExternalLink, ShieldCheck, ChevronRight,
  Menu, X, Sparkles, CheckCircle2
} from 'lucide-react';
import { ToolItem } from '../../types';
import { AdminTabType, AdminUser, ActivityLogItem, ToolContentOverride } from '../../types/admin';
import { 
  getAdminSession, 
  logoutAdmin, 
  getActivityLogs, 
  getAnalyticsSummary,
  getToolOverrides
} from '../../utils/adminStorage';
import { AdminLogin } from './AdminLogin';
import { AdminErrorBoundary } from './AdminErrorBoundary';

// Sub-tabs
import { DashboardTab } from './tabs/DashboardTab';
import { ToolsManagerTab } from './tabs/ToolsManagerTab';
import { CategoriesTab } from './tabs/CategoriesTab';
import { SeoManagerTab } from './tabs/SeoManagerTab';
import { ContentManagerTab } from './tabs/ContentManagerTab';
import { HomepageManagerTab } from './tabs/HomepageManagerTab';
import { AdsManagerTab } from './tabs/AdsManagerTab';
import { PagesManagerTab } from './tabs/PagesManagerTab';
import { AnalyticsTab } from './tabs/AnalyticsTab';
import { UsersTab } from './tabs/UsersTab';
import { SettingsTab } from './tabs/SettingsTab';
import { ImportExportTab } from './tabs/ImportExportTab';

interface AdminPanelProps {
  tools: ToolItem[];
  onCloseAdmin: () => void;
  onRefreshToolsCatalog: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  tools = [],
  onCloseAdmin,
  onRefreshToolsCatalog,
}) => {
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [activeTab, setActiveTab] = useState<AdminTabType>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activityLogs, setActivityLogs] = useState<ActivityLogItem[]>([]);
  const [analytics, setAnalytics] = useState(getAnalyticsSummary());
  const [toolOverrides, setToolOverrides] = useState<Record<string, ToolContentOverride>>(getToolOverrides());
  const [editingTool, setEditingTool] = useState<ToolItem | null>(null);

  // Check login state
  useEffect(() => {
    const session = getAdminSession();
    setCurrentUser(session ? session.user : null);
    setActivityLogs(getActivityLogs());
    setToolOverrides(getToolOverrides());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleLogout = () => {
    logoutAdmin();
    setCurrentUser(null);
    showToast('Logged out of Admin Panel.');
  };

  const refreshLogs = () => {
    setActivityLogs(getActivityLogs());
  };

  const reloadOverrides = () => {
    setToolOverrides(getToolOverrides());
    onRefreshToolsCatalog();
  };

  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 bg-[var(--bg-app)] flex flex-col items-center justify-center p-4">
        <AdminLogin
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Welcome back, ${user.name}!`);
          }}
          onSuccess={(user) => {
            setCurrentUser(user);
            showToast(`Welcome back, ${user.name}!`);
          }}
          onCancel={onCloseAdmin}
          onExit={onCloseAdmin}
        />
      </div>
    );
  }

  // Calculate tool count per category
  const toolCountByCategory = (tools || []).reduce((acc, t) => {
    if (t && t.category) {
      acc[t.category] = (acc[t.category] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const navItems: { id: AdminTabType; label: string; icon: any; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tools', label: 'Tools Management', icon: Wrench, badge: `${tools.length}` },
    { id: 'categories', label: 'Categories Taxonomy', icon: FolderTree },
    { id: 'seo', label: 'SEO & Webmaster', icon: Globe },
    { id: 'content', label: 'Content & 1500+ Guides', icon: FileText },
    { id: 'homepage', label: 'Homepage Structure', icon: Home },
    { id: 'ads', label: 'Ads & Monetization', icon: DollarSign },
    { id: 'pages', label: 'Static Policy Pages', icon: BookOpen },
    { id: 'analytics', label: 'Privacy Analytics', icon: BarChart3 },
    { id: 'users', label: 'Users & Security', icon: Users },
    { id: 'settings', label: 'System Settings', icon: Settings },
    { id: 'import-export', label: 'Import / Export', icon: ArrowUpDown },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] flex flex-col">
      {/* Top Admin Header */}
      <header className="h-16 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#2E9BFF] shadow-xs">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-[var(--text-primary)]">
                  Master Admin Console
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  Ajay Ade (Owner)
                </span>
              </div>
              <span className="text-[10px] text-[var(--text-muted)] font-mono block">
                EncryptDecrypt.org • Single-Tenant Engine
              </span>
            </div>
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCloseAdmin}
            className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[#2E9BFF] flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">View Live Site</span>
          </button>

          <div className="h-4 w-px bg-[var(--border-subtle)] hidden sm:block" />

          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <span className="text-xs font-bold block text-[var(--text-primary)] leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                Master Admin
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
              title="Log out of Admin Console"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className={`
          fixed md:static inset-y-0 left-0 z-30
          w-64 bg-[var(--bg-surface)] border-r border-[var(--border-subtle)]
          flex flex-col justify-between p-3 transition-transform duration-200 ease-in-out
          ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          top-16 md:top-0
        `}>
          <div className="space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
              Control Panel Navigation
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                    active 
                      ? 'bg-[#2E9BFF] text-white shadow-sm font-semibold' 
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={active ? 'text-white' : 'text-[var(--text-muted)]'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${
                      active ? 'bg-white/20 text-white' : 'bg-[var(--bg-input)] text-[var(--text-muted)]'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer Info */}
          <div className="pt-3 border-t border-[var(--border-subtle)] px-2">
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span>Restricted Master Access</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)] block mt-0.5">
              Zero-Cloud Local Encryption
            </span>
          </div>
        </aside>

        {/* Right Scrollable Workspace Canvas */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-[var(--bg-app)]">
          <div className="max-w-6xl mx-auto space-y-6">
            {activeTab === 'dashboard' && (
              <AdminErrorBoundary tabName="Dashboard" onReset={reloadOverrides}>
                <DashboardTab
                  tools={tools}
                  analytics={analytics}
                  activityLogs={activityLogs}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  onOpenAddTool={() => setActiveTab('tools')}
                  onSelectToolToEdit={(tool) => {
                    setEditingTool(tool);
                    setActiveTab('tools');
                  }}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'tools' && (
              <AdminErrorBoundary tabName="Tools Management" onReset={reloadOverrides}>
                <ToolsManagerTab
                  tools={tools}
                  overrides={toolOverrides}
                  onRefreshTools={reloadOverrides}
                  onOpenToolInWebsite={(tool) => {
                    onCloseAdmin();
                    window.location.hash = `tool=${tool.slug}`;
                  }}
                  showToast={showToast}
                  editingToolInitial={editingTool}
                  onClearEditingTool={() => setEditingTool(null)}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'categories' && (
              <AdminErrorBoundary tabName="Categories Taxonomy">
                <CategoriesTab
                  toolCountByCategory={toolCountByCategory}
                  showToast={showToast}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'seo' && (
              <AdminErrorBoundary tabName="SEO & Webmaster">
                <SeoManagerTab
                  tools={tools}
                  showToast={showToast}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'content' && (
              <AdminErrorBoundary tabName="Content & 1500+ Guides">
                <ContentManagerTab
                  tools={tools}
                  showToast={showToast}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'homepage' && (
              <AdminErrorBoundary tabName="Homepage Structure">
                <HomepageManagerTab
                  tools={tools}
                  showToast={showToast}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'ads' && (
              <AdminErrorBoundary tabName="Ads & Monetization">
                <AdsManagerTab
                  showToast={showToast}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'pages' && (
              <AdminErrorBoundary tabName="Static Policy Pages">
                <PagesManagerTab
                  showToast={showToast}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'analytics' && (
              <AdminErrorBoundary tabName="Privacy Analytics">
                <AnalyticsTab
                  analytics={analytics}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'users' && (
              <AdminErrorBoundary tabName="Users & Security">
                <UsersTab
                  currentUser={currentUser}
                  activityLogs={activityLogs}
                  onRefreshLogs={refreshLogs}
                  showToast={showToast}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'settings' && (
              <AdminErrorBoundary tabName="System Settings">
                <SettingsTab
                  showToast={showToast}
                />
              </AdminErrorBoundary>
            )}

            {activeTab === 'import-export' && (
              <AdminErrorBoundary tabName="Import / Export">
                <ImportExportTab
                  tools={tools}
                  onRefreshTools={reloadOverrides}
                  showToast={showToast}
                />
              </AdminErrorBoundary>
            )}
          </div>
        </main>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-blue-500/40 shadow-2xl text-xs font-semibold text-[var(--text-primary)]">
            <CheckCircle2 size={16} className="text-[#2E9BFF]" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

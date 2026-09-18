import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, CheckSquare, Square, Trash2, 
  Eye, Edit, Power, Sparkles, ArrowUpDown, CheckCircle2, 
  XCircle, AlertCircle, ExternalLink, X, Save, Layers 
} from 'lucide-react';
import { ToolItem } from '../../../types';
import { ToolContentOverride } from '../../../types/admin';
import { saveToolOverride, saveCustomTool, deleteTool, bulkUpdateToolStatus, getToolOverrides } from '../../../utils/adminStorage';

interface ToolsManagerTabProps {
  tools?: ToolItem[];
  overrides?: Record<string, ToolContentOverride>;
  onRefreshTools?: () => void;
  onOpenToolInWebsite?: (tool: ToolItem) => void;
  showToast?: (msg: string) => void;
  editingToolInitial?: ToolItem | null;
  onClearEditingTool?: () => void;
}

export const ToolsManagerTab: React.FC<ToolsManagerTabProps> = ({
  tools = [],
  overrides,
  onRefreshTools,
  onOpenToolInWebsite,
  showToast,
  editingToolInitial = null,
  onClearEditingTool,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'disabled' | 'popular'>('all');
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [editingTool, setEditingTool] = useState<ToolItem | null>(editingToolInitial);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Safe fallback to localStorage if overrides prop was not passed
  const activeOverrides = useMemo(() => {
    return overrides || getToolOverrides() || {};
  }, [overrides]);

  const triggerToast = (msg: string) => {
    if (showToast) showToast(msg);
  };

  const triggerRefresh = () => {
    if (onRefreshTools) onRefreshTools();
  };

  // New tool form state
  const [newTool, setNewTool] = useState<Partial<ToolItem>>({
    name: '',
    slug: '',
    category: 'encoding-decoding',
    categoryName: 'Encoding & Decoding',
    shortDesc: '',
    metaTitle: '',
    metaDescription: '',
    primaryKeyword: '',
    inputType: 'textarea',
    hasFileSupport: false,
    popular: false,
    related: [],
  });

  // Extract unique categories safely
  const categories = useMemo(() => {
    const map = new Map<string, string>();
    (tools || []).forEach(t => {
      if (t && t.category) {
        map.set(t.category, t.categoryName || t.category);
      }
    });
    return Array.from(map.entries()).map(([slug, name]) => ({ slug, name }));
  }, [tools]);

  // Filter tools safely
  const filteredTools = useMemo(() => {
    if (!Array.isArray(tools)) return [];
    
    return tools.filter(tool => {
      if (!tool) return false;
      const override = activeOverrides[tool.id] || activeOverrides[tool.slug];
      const status = override?.status || (tool as any).status || 'active';

      // Status filter
      if (statusFilter === 'active' && status === 'disabled') return false;
      if (statusFilter === 'disabled' && status !== 'disabled') return false;
      if (statusFilter === 'popular' && !tool.popular) return false;

      // Category filter
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) return false;

      // Search query
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = (tool.name || '').toLowerCase().includes(q);
        const matchesSlug = (tool.slug || '').toLowerCase().includes(q);
        const matchesDesc = (tool.shortDesc || '').toLowerCase().includes(q);
        const matchesCategory = (tool.categoryName || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSlug && !matchesDesc && !matchesCategory) return false;
      }

      return true;
    });
  }, [tools, activeOverrides, search, selectedCategory, statusFilter]);

  // Bulk Selection
  const allFilteredSelected = filteredTools.length > 0 && filteredTools.every(t => selectedToolIds.includes(t.id));

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      setSelectedToolIds(prev => prev.filter(id => !filteredTools.some(t => t.id === id)));
    } else {
      const idsToAdd = filteredTools.map(t => t.id);
      setSelectedToolIds(prev => Array.from(new Set([...prev, ...idsToAdd])));
    }
  };

  const toggleSelectTool = (id: string) => {
    setSelectedToolIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk Status Toggles
  const handleBulkStatus = (status: 'active' | 'disabled') => {
    if (selectedToolIds.length === 0) return;
    bulkUpdateToolStatus(selectedToolIds, status);
    triggerRefresh();
    triggerToast(`Updated ${selectedToolIds.length} tools to ${status}.`);
    setSelectedToolIds([]);
  };

  // Single Status Toggle
  const handleToggleStatus = (tool: ToolItem) => {
    const currentOverride = activeOverrides[tool.id] || activeOverrides[tool.slug];
    const currentStatus = currentOverride?.status || 'active';
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    saveToolOverride(tool.id, { status: newStatus });
    triggerRefresh();
    triggerToast(`Tool "${tool.name}" is now ${newStatus}.`);
  };

  // Single Popular Toggle
  const handleTogglePopular = (tool: ToolItem) => {
    const updatedTool: ToolItem = { ...tool, popular: !tool.popular };
    saveCustomTool(updatedTool);
    saveToolOverride(tool.id, { isFeatured: !tool.popular });
    triggerRefresh();
    triggerToast(`Updated popular flag for "${tool.name}".`);
  };

  // Save Edit Tool
  const handleSaveEditTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool) return;

    saveCustomTool(editingTool);
    saveToolOverride(editingTool.id, {
      customMetaTitle: editingTool.metaTitle,
      customMetaDescription: editingTool.metaDescription,
      customKeywords: editingTool.primaryKeyword ? [editingTool.primaryKeyword] : [],
    });

    triggerRefresh();
    setEditingTool(null);
    if (onClearEditingTool) onClearEditingTool();
    triggerToast(`Tool "${editingTool.name}" successfully updated!`);
  };

  // Add New Tool
  const handleSaveNewTool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTool.name || !newTool.slug) {
      triggerToast('Please enter tool name and slug URL.');
      return;
    }

    const cleanSlug = newTool.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const matchedCategory = categories.find(c => c.slug === newTool.category);

    const createdTool: ToolItem = {
      id: `tool_${cleanSlug}`,
      name: newTool.name,
      slug: cleanSlug,
      category: newTool.category || 'encoding-decoding',
      categoryName: matchedCategory ? matchedCategory.name : 'Encoding & Decoding',
      shortDesc: newTool.shortDesc || `Fast client-side ${newTool.name} utility.`,
      metaTitle: newTool.metaTitle || `${newTool.name} - Free Online Tool | EncryptDecrypt.org`,
      metaDescription: newTool.metaDescription || `Calculate and execute ${newTool.name} in your browser without server uploads.`,
      primaryKeyword: newTool.primaryKeyword || newTool.name.toLowerCase(),
      inputType: newTool.inputType || 'textarea',
      hasFileSupport: !!newTool.hasFileSupport,
      popular: !!newTool.popular,
      related: [],
    };

    saveCustomTool(createdTool);
    triggerRefresh();
    setIsAddModalOpen(false);
    triggerToast(`New tool "${createdTool.name}" created and added to catalog!`);
    setNewTool({
      name: '',
      slug: '',
      category: 'encoding-decoding',
      categoryName: 'Encoding & Decoding',
      shortDesc: '',
      metaTitle: '',
      metaDescription: '',
      primaryKeyword: '',
      inputType: 'textarea',
      hasFileSupport: false,
      popular: false,
      related: [],
    });
  };

  // Delete Tool
  const handleDeleteTool = (tool: ToolItem) => {
    if (window.confirm(`Are you sure you want to remove or disable "${tool.name}"?`)) {
      deleteTool(tool.id);
      triggerRefresh();
      triggerToast(`Tool "${tool.name}" disabled.`);
    }
  };

  const handleOpenTool = (tool: ToolItem) => {
    if (onOpenToolInWebsite) {
      onOpenToolInWebsite(tool);
    } else {
      window.location.hash = `tool=${tool.slug}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Actions Bar */}
      <div className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)]">
              Tools Management Console ({tools.length} Tools)
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Search, configure URLs, edit SEO titles, toggle active status, or assign popular badges across all utilities.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="btn btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Plus size={14} /> Add New Tool
            </button>
          </div>
        </div>

        {/* Search and Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by tool name, slug (e.g. aes, base64), or description..."
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl pl-9 pr-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF] transition"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF] transition"
            >
              <option value="all">All Categories ({categories.length})</option>
              {categories.map(c => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF] transition"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="disabled">Disabled Only</option>
              <option value="popular">Popular Only</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Bar (When items selected) */}
        {selectedToolIds.length > 0 && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
            <div className="flex items-center gap-2 font-semibold text-[#2E9BFF]">
              <CheckSquare size={16} />
              <span>{selectedToolIds.length} tool(s) selected</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkStatus('active')}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 font-medium transition cursor-pointer"
              >
                Enable Selected
              </button>
              <button
                onClick={() => handleBulkStatus('disabled')}
                className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 font-medium transition cursor-pointer"
              >
                Disable Selected
              </button>
              <button
                onClick={() => setSelectedToolIds([])}
                className="px-2.5 py-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tools Table */}
      <div className="card-glass bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between text-xs text-[var(--text-muted)] font-medium">
          <span>Showing {filteredTools.length} of {tools.length} total utilities</span>
          <span className="font-mono text-[11px]">Direct live updates apply instantly</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[var(--text-secondary)]">
            <thead className="bg-[var(--bg-surface-hover)] border-b border-[var(--border-subtle)] font-semibold text-[var(--text-primary)] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5 w-10 text-center">
                  <button 
                    onClick={toggleSelectAll}
                    className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    {allFilteredSelected ? <CheckSquare size={15} className="text-[#2E9BFF]" /> : <Square size={15} />}
                  </button>
                </th>
                <th className="p-3.5">Tool Name & URL</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5 text-center">Popular</th>
                <th className="p-3.5 text-center">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)]">
              {filteredTools.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[var(--text-muted)]">
                    No tools match the selected query or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTools.map((tool) => {
                  const override = activeOverrides[tool.id] || activeOverrides[tool.slug];
                  const isToolDisabled = override?.status === 'disabled';
                  const isSelected = selectedToolIds.includes(tool.id);

                  return (
                    <tr 
                      key={tool.id}
                      className={`hover:bg-[var(--bg-surface-hover)] transition ${
                        isToolDisabled ? 'opacity-60 bg-rose-500/[0.02]' : ''
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="p-3.5 text-center">
                        <button 
                          onClick={() => toggleSelectTool(tool.id)}
                          className="text-[var(--text-muted)] hover:text-[#2E9BFF] cursor-pointer"
                        >
                          {isSelected ? <CheckSquare size={15} className="text-[#2E9BFF]" /> : <Square size={15} />}
                        </button>
                      </td>

                      {/* Tool Name & Slug */}
                      <td className="p-3.5">
                        <div className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                          <span>{tool.name}</span>
                          {tool.popular && (
                            <span className="inline-flex items-center text-[9px] px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-400 border border-amber-500/30">
                              ★ Featured
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-[var(--text-muted)] mt-0.5">
                          /{tool.slug}
                        </div>
                        <div className="text-[11px] text-[var(--text-secondary)] line-clamp-1 mt-0.5 max-w-md">
                          {tool.shortDesc}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-3.5 whitespace-nowrap">
                        <span className="text-[11px] px-2 py-0.5 rounded-md bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20 font-medium">
                          {tool.categoryName || tool.category}
                        </span>
                      </td>

                      {/* Popular Toggle */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleTogglePopular(tool)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            tool.popular 
                              ? 'text-amber-400 hover:bg-amber-500/10' 
                              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                          }`}
                          title={tool.popular ? 'Marked Popular (Click to toggle)' : 'Not marked popular'}
                        >
                          <Sparkles size={16} />
                        </button>
                      </td>

                      {/* Status Toggle */}
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleToggleStatus(tool)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold cursor-pointer transition ${
                            isToolDisabled 
                              ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25' 
                              : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                          }`}
                        >
                          {isToolDisabled ? (
                            <>
                              <XCircle size={11} /> Disabled
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={11} /> Active
                            </>
                          )}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenTool(tool)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[#2E9BFF] hover:bg-blue-500/10 transition cursor-pointer"
                            title="Test Tool in Live Workspace"
                          >
                            <ExternalLink size={14} />
                          </button>
                          <button
                            onClick={() => setEditingTool(tool)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition cursor-pointer"
                            title="Edit Tool Details & SEO"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTool(tool)}
                            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Disable / Delete Tool"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Tool Drawer / Modal */}
      {editingTool && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Edit Tool: {editingTool.name}
                </h3>
                <span className="text-[11px] font-mono text-[var(--text-muted)]">ID: {editingTool.id}</span>
              </div>
              <button
                onClick={() => { setEditingTool(null); if (onClearEditingTool) onClearEditingTool(); }}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditTool} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Tool Display Name
                  </label>
                  <input
                    type="text"
                    value={editingTool.name || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, name: e.target.value })}
                    required
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Slug / URL Path
                  </label>
                  <input
                    type="text"
                    value={editingTool.slug || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, slug: e.target.value })}
                    required
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Category
                  </label>
                  <select
                    value={editingTool.category || 'encoding-decoding'}
                    onChange={(e) => {
                      const matched = categories.find(c => c.slug === e.target.value);
                      setEditingTool({
                        ...editingTool,
                        category: e.target.value,
                        categoryName: matched ? matched.name : editingTool.categoryName,
                      });
                    }}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Input Type
                  </label>
                  <select
                    value={editingTool.inputType || 'textarea'}
                    onChange={(e) => setEditingTool({ ...editingTool, inputType: e.target.value as any })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  >
                    <option value="textarea">Textarea (Multi-line text)</option>
                    <option value="text">Single Line Text</option>
                    <option value="file">File Input</option>
                    <option value="dual">Dual Input (Text + Key/Password)</option>
                    <option value="number">Numeric Input</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={editingTool.shortDesc || ''}
                  onChange={(e) => setEditingTool({ ...editingTool, shortDesc: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                />
              </div>

              {/* SEO Controls */}
              <div className="p-3.5 rounded-xl bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] space-y-3">
                <span className="font-bold text-[var(--text-primary)] block text-[11px] uppercase tracking-wider">
                  Tool SEO Meta Overrides
                </span>

                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                    Meta Title
                  </label>
                  <input
                    type="text"
                    value={editingTool.metaTitle || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, metaTitle: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                    Meta Description
                  </label>
                  <textarea
                    rows={2}
                    value={editingTool.metaDescription || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, metaDescription: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-[var(--text-secondary)] mb-1">
                    Primary Keyword
                  </label>
                  <input
                    type="text"
                    value={editingTool.primaryKeyword || ''}
                    onChange={(e) => setEditingTool({ ...editingTool, primaryKeyword: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingTool.popular}
                    onChange={(e) => setEditingTool({ ...editingTool, popular: e.target.checked })}
                    className="rounded border-[var(--border-subtle)] text-[#2E9BFF] focus:ring-0"
                  />
                  <span className="font-medium text-[var(--text-primary)]">Mark as Popular / Featured</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!editingTool.hasFileSupport}
                    onChange={(e) => setEditingTool({ ...editingTool, hasFileSupport: e.target.checked })}
                    className="rounded border-[var(--border-subtle)] text-[#2E9BFF] focus:ring-0"
                  />
                  <span className="font-medium text-[var(--text-primary)]">Enable Drag & Drop File Support</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => { setEditingTool(null); if (onClearEditingTool) onClearEditingTool(); }}
                  className="px-4 py-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary py-2 px-5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md font-semibold"
                >
                  <Save size={14} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Tool Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-5 animate-scale-up">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Add New Tool to Catalog
                </h3>
                <p className="text-[11px] text-[var(--text-muted)]">Creates a new instant client-side tool card & dedicated URL route</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNewTool} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Tool Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTool.name || ''}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setNewTool(prev => ({
                        ...prev,
                        name,
                        slug: prev.slug ? prev.slug : slug,
                        metaTitle: `${name} - Free Online Tool | EncryptDecrypt.org`,
                        primaryKeyword: name.toLowerCase(),
                      }));
                    }}
                    placeholder="e.g. BLAKE3 Hash Generator"
                    required
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Slug / URL Path <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTool.slug || ''}
                    onChange={(e) => setNewTool({ ...newTool, slug: e.target.value })}
                    placeholder="e.g. blake3-hash-generator"
                    required
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Category Assignment
                  </label>
                  <select
                    value={newTool.category || 'encoding-decoding'}
                    onChange={(e) => setNewTool({ ...newTool, category: e.target.value })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  >
                    {categories.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-[var(--text-primary)] mb-1">
                    Input Control Layout
                  </label>
                  <select
                    value={newTool.inputType || 'textarea'}
                    onChange={(e) => setNewTool({ ...newTool, inputType: e.target.value as any })}
                    className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                  >
                    <option value="textarea">Textarea (Standard Multi-line)</option>
                    <option value="text">Single-line Text Input</option>
                    <option value="dual">Dual Input (Text + Secret Key/IV)</option>
                    <option value="file">Direct File Upload</option>
                    <option value="number">Numeric Parameter</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={newTool.shortDesc || ''}
                  onChange={(e) => setNewTool({ ...newTool, shortDesc: e.target.value })}
                  placeholder="A one-sentence summary for search engines and catalog cards..."
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">
                  Meta Description (SEO)
                </label>
                <textarea
                  rows={2}
                  value={newTool.metaDescription || ''}
                  onChange={(e) => setNewTool({ ...newTool, metaDescription: e.target.value })}
                  placeholder="Full description displayed in Google SERP results (150-160 characters)..."
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)] focus:outline-none focus:border-[#2E9BFF]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!newTool.popular}
                    onChange={(e) => setNewTool({ ...newTool, popular: e.target.checked })}
                    className="rounded border-[var(--border-subtle)] text-[#2E9BFF] focus:ring-0"
                  />
                  <span className="font-medium text-[var(--text-primary)]">Add to Homepage Featured List</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!newTool.hasFileSupport}
                    onChange={(e) => setNewTool({ ...newTool, hasFileSupport: e.target.checked })}
                    className="rounded border-[var(--border-subtle)] text-[#2E9BFF] focus:ring-0"
                  />
                  <span className="font-medium text-[var(--text-primary)]">Enable Drag-and-Drop File Support</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary py-2 px-5 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md font-semibold"
                >
                  <Plus size={14} /> Create Tool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

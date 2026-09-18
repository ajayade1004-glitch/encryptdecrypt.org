import React, { useState } from 'react';
import { Layers, Plus, Edit2, Trash2, CheckCircle2, Save, X, Sparkles, Folder } from 'lucide-react';
import { CATEGORY_HUBS_CONFIG } from '../../../App';

interface CategoriesTabProps {
  toolCountByCategory: Record<string, number>;
  showToast: (msg: string) => void;
}

export const CategoriesTab: React.FC<CategoriesTabProps> = ({
  toolCountByCategory,
  showToast,
}) => {
  const [categories, setCategories] = useState(
    CATEGORY_HUBS_CONFIG.map(c => ({
      slug: c.slug,
      name: c.name,
      count: toolCountByCategory[c.slug] || c.count || 0,
      desc: c.desc,
      metaTitle: `${c.name} - Free Online Developer Tools | EncryptDecrypt.org`,
      metaDesc: `Browse all ${c.name} online utilities. 100% private, client-side, zero-knowledge browser tools.`,
    }))
  );

  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: '',
    slug: '',
    desc: '',
    metaTitle: '',
    metaDesc: '',
  });

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setCategories(prev => prev.map(c => c.slug === editingCategory.slug ? editingCategory : c));
    setEditingCategory(null);
    showToast(`Category "${editingCategory.name}" updated successfully!`);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.name || !newCategory.slug) return;
    const cleanSlug = newCategory.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const created = {
      slug: cleanSlug,
      name: newCategory.name,
      count: 0,
      desc: newCategory.desc || 'Collection of cryptographic tools.',
      metaTitle: newCategory.metaTitle || `${newCategory.name} - Free Online Tools`,
      metaDesc: newCategory.metaDesc || `Free client-side ${newCategory.name} tools.`,
    };
    setCategories(prev => [...prev, created]);
    setIsAddOpen(false);
    setNewCategory({ name: '', slug: '', desc: '', metaTitle: '', metaDesc: '' });
    showToast(`Category "${created.name}" created!`);
  };

  const handleDelete = (slug: string, name: string) => {
    if (confirm(`Remove category "${name}"? Existing tools in this category will become unassigned.`)) {
      setCategories(prev => prev.filter(c => c.slug !== slug));
      showToast(`Category "${name}" removed.`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-primary)]">
            Category Taxonomy & SEO Hubs
          </h2>
          <p className="text-xs text-[var(--text-secondary)]">
            Organize all 300+ tools across categorized hubs with customizable meta descriptions and descriptions.
          </p>
        </div>
        <button
          onClick={() => setIsAddOpen(true)}
          className="btn btn-primary text-xs py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer shrink-0 shadow-sm"
        >
          <Plus size={14} /> Add Category
        </button>
      </div>

      {/* Grid of Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div 
            key={cat.slug}
            className="card-glass p-5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs flex flex-col justify-between space-y-4 hover:border-[#2E9BFF]/40 transition group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-[#2E9BFF] flex items-center justify-center shrink-0">
                    <Folder size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] transition">
                      {cat.name}
                    </h3>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      /{cat.slug}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-[#2E9BFF] font-mono text-[11px] font-bold">
                  {cat.count} tools
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mt-2 leading-relaxed">
                {cat.desc}
              </p>
            </div>

            <div className="pt-3 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <span className="text-[11px] text-[var(--text-muted)] font-mono truncate max-w-[170px]">
                {cat.metaTitle}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setEditingCategory({ ...cat })}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] cursor-pointer"
                  title="Edit Category Details & SEO"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(cat.slug, cat.name)}
                  className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                  title="Delete Category"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-up text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Edit Category: {editingCategory.name}
              </h3>
              <button onClick={() => setEditingCategory(null)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Category Name</label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  required
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Slug URL</label>
                <input
                  type="text"
                  value={editingCategory.slug}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  required
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Hub Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.desc}
                  onChange={(e) => setEditingCategory({ ...editingCategory, desc: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">SEO Meta Title</label>
                <input
                  type="text"
                  value={editingCategory.metaTitle}
                  onChange={(e) => setEditingCategory({ ...editingCategory, metaTitle: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">SEO Meta Description</label>
                <textarea
                  rows={2}
                  value={editingCategory.metaDesc}
                  onChange={(e) => setEditingCategory({ ...editingCategory, metaDesc: e.target.value })}
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-3.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary py-1.5 px-4 rounded-lg flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <Save size={13} /> Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4 animate-scale-up text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Add New Category Hub
              </h3>
              <button onClick={() => setIsAddOpen(false)} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer">
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3.5">
              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Category Name *</label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setNewCategory({ ...newCategory, name, slug });
                  }}
                  placeholder="e.g. Quantum Cryptography"
                  required
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Slug URL *</label>
                <input
                  type="text"
                  value={newCategory.slug}
                  onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                  placeholder="e.g. quantum-cryptography"
                  required
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-2 font-mono text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[var(--text-primary)] mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newCategory.desc}
                  onChange={(e) => setNewCategory({ ...newCategory, desc: e.target.value })}
                  placeholder="Overview of algorithms included in this hub..."
                  className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg p-2.5 text-[var(--text-primary)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--border-subtle)]">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary py-1.5 px-4 rounded-lg flex items-center gap-1.5 font-semibold cursor-pointer"
                >
                  <Plus size={13} /> Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

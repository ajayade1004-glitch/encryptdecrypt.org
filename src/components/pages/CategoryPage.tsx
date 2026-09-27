import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Search, X, Terminal, Shield, ArrowRight, 
  Layers, Star, CheckCircle, Code, Lock, Key, Globe, 
  Database, FileText, Cpu, Hash, Binary, Wifi, Palette, 
  Calculator, Gauge, Eye, Clock, ShieldCheck, Filter
} from 'lucide-react';
import { ToolItem } from '../../types';
import { SeoHead } from '../SeoHead';

interface CategoryPageProps {
  categorySlug: string;
  tools: ToolItem[];
  allCategoryHubs: Array<{ slug: string; name: string; count: number; desc: string; icon: any }>;
  onSelectTool: (tool: ToolItem) => void;
  onSelectCategory: (catSlug: string) => void;
  onNavigateHome: () => void;
  onNavigateAllTools: () => void;
  starredToolIds: string[];
  onToggleStar: (e: React.MouseEvent, toolSlug: string) => void;
}

export const CategoryPage: React.FC<CategoryPageProps> = ({
  categorySlug,
  tools,
  allCategoryHubs,
  onSelectTool,
  onSelectCategory,
  onNavigateHome,
  onNavigateAllTools,
  starredToolIds,
  onToggleStar
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Find category hub info
  const categoryInfo = useMemo(() => {
    const found = allCategoryHubs.find(h => h.slug === categorySlug);
    if (found) return found;

    // Fallback: derive from tools
    const matchingTool = tools.find(t => t.category === categorySlug);
    const name = matchingTool?.categoryName || categorySlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    return {
      slug: categorySlug,
      name,
      count: tools.filter(t => t.category === categorySlug).length,
      desc: matchingTool?.shortDesc || `Client-side ${name} cryptographic tools and developer utilities.`,
      icon: Code
    };
  }, [categorySlug, allCategoryHubs, tools]);

  // All tools belonging to this category
  const categoryTools = useMemo(() => {
    return tools.filter(t => t.category === categorySlug);
  }, [tools, categorySlug]);

  // Filter tools inside this category by search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return categoryTools;
    const q = searchQuery.toLowerCase().trim();
    return categoryTools.filter(t => 
      t.name.toLowerCase().includes(q) ||
      t.slug.toLowerCase().includes(q) ||
      (t.shortDesc && t.shortDesc.toLowerCase().includes(q)) ||
      (t.primaryKeyword && t.primaryKeyword.toLowerCase().includes(q)) ||
      (t.secondaryKeywords && t.secondaryKeywords.some(kw => kw.toLowerCase().includes(q)))
    );
  }, [categoryTools, searchQuery]);

  const Icon = categoryInfo.icon || Code;

  // Other categories for quick switching
  const otherCategories = useMemo(() => {
    return allCategoryHubs.filter(h => h.slug !== categorySlug).slice(0, 12);
  }, [allCategoryHubs, categorySlug]);

  return (
    <article className="max-w-6xl mx-auto py-4 px-2 sm:px-4 animate-fade-in" itemScope itemType="https://schema.org/CollectionPage">
      {/* Category SEO Head */}
      <SeoHead
        title={`${categoryInfo.name} Tools (${categoryTools.length} Free Utilities) | EncryptDecrypt.org`}
        description={`Explore all ${categoryTools.length} free client-side ${categoryInfo.name} developer utilities. 100% private in browser RAM with W3C Web Cryptography API and zero server logging.`}
        canonicalUrl={`https://encryptdecrypt.org/tools/${categorySlug}/`}
        keywords={[
          `${categoryInfo.name} tools`,
          `${categorySlug} utilities`,
          'cryptographic tools',
          'developer utilities',
          'client side tools',
          'web crypto'
        ]}
        schemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'CollectionPage',
            'name': `${categoryInfo.name} Tools & Utilities`,
            'description': categoryInfo.desc,
            'url': `https://encryptdecrypt.org/tools/${categorySlug}/`,
            'numberOfItems': categoryTools.length
          }
        ]}
      />

      {/* Programmatic Cyber Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4 font-mono">
        <button onClick={onNavigateHome} className="hover:text-[#2E9BFF] transition cursor-pointer flex items-center gap-1">
          <ArrowLeft size={13} /> Home
        </button>
        <span>/</span>
        <button onClick={onNavigateAllTools} className="hover:text-[#2E9BFF] transition cursor-pointer">
          Categories
        </button>
        <span>/</span>
        <span className="text-[#2E9BFF] font-semibold">{categoryInfo.name}</span>
      </nav>

      {/* Category Hero Header Banner */}
      <header className="card-glass p-6 sm:p-8 rounded-2xl mb-8 relative overflow-hidden bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-sm">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-1 rounded-full bg-[#2E9BFF]/15 text-[#2E9BFF] border border-[#2E9BFF]/30 text-xs font-mono font-bold flex items-center gap-1.5">
                <Icon size={14} />
                {categoryInfo.name} Hub
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
                {categoryTools.length} Free Utilities
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-500/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] text-xs font-mono">
                100% Client-Side RAM
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight mb-2">
              {categoryInfo.name} Tools
            </h1>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              {categoryInfo.desc || `Complete collection of high-performance ${categoryInfo.name} utilities running 100% locally in your browser memory via the W3C Web Cryptography API.`}
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
            <button
              onClick={onNavigateHome}
              className="btn btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Home
            </button>
            <button
              onClick={onNavigateAllTools}
              className="btn btn-primary text-xs px-4 py-2 flex items-center gap-1.5 cursor-pointer font-bold shadow-md shadow-blue-500/20"
            >
              <Layers size={14} /> View All 1,380+ Tools
            </button>
          </div>
        </div>

        {/* Search Within This Category */}
        <div className="mt-6 pt-5 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${categoryTools.length} tools in ${categoryInfo.name}...`}
              className="w-full h-9 bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-lg pl-9 pr-8 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#2E9BFF] transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-0.5 cursor-pointer"
              >
                <X size={13} />
              </button>
            )}
          </div>

          <span className="text-xs font-mono text-[var(--text-muted)] shrink-0 self-center">
            Showing <strong className="text-[var(--text-primary)]">{filteredTools.length}</strong> of {categoryTools.length} tools
          </span>
        </div>
      </header>

      {/* Grid of ALL Tools in this Category */}
      <section className="mb-12">
        {filteredTools.length === 0 ? (
          <div className="card-glass p-8 text-center rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
            <Search size={24} className="mx-auto text-[var(--text-muted)] mb-2" />
            <h3 className="text-sm font-bold text-[var(--text-primary)] mb-1">
              No tools found matching &ldquo;{searchQuery}&rdquo; in {categoryInfo.name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] mb-4">
              Try a different keyword or reset your search.
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="btn btn-secondary text-xs px-4 py-2 cursor-pointer"
            >
              Clear Search
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTools.map(tool => {
              const isStarred = starredToolIds.includes(tool.slug) || starredToolIds.includes(tool.id);
              return (
                <div
                  key={tool.id}
                  onClick={() => onSelectTool(tool)}
                  className="card-glass flex flex-col justify-between hover:-translate-y-1 hover:border-[#2E9BFF]/60 transition duration-200 cursor-pointer group shadow-sm bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl p-4 relative"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-[#2E9BFF] border border-blue-500/20 truncate max-w-[170px]">
                        {tool.categoryName || categoryInfo.name}
                      </span>
                      <div className="flex items-center gap-1">
                        {tool.popular && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20">
                            Popular
                          </span>
                        )}
                        <button
                          onClick={(e) => onToggleStar(e, tool.slug)}
                          className="p-1 rounded hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-amber-400 transition cursor-pointer"
                          title={isStarred ? "Remove from Favorites" : "Add to Favorites"}
                        >
                          <Star size={13} className={isStarred ? "fill-amber-400 text-amber-400" : ""} />
                        </button>
                      </div>
                    </div>

                    <h2 className="text-sm font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] transition mb-1.5 leading-snug">
                      {tool.name}
                    </h2>

                    <p className="text-xs text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3">
                      {tool.shortDesc || `Execute ${tool.name} locally in client memory with zero server transmission.`}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
                    <span className="text-[11px] text-[var(--text-muted)] font-mono truncate max-w-[120px]">
                      {tool.inputType || 'Text / Stream'}
                    </span>
                    <span className="text-xs font-semibold text-[#2E9BFF] group-hover:translate-x-1 transition inline-flex items-center gap-1 shrink-0">
                      Open Tool →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Switch to Other Categories */}
      <section className="p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Layers size={16} className="text-[#2E9BFF]" />
            Explore Other Tool Categories ({allCategoryHubs.length} Categories)
          </h3>
          <button
            onClick={onNavigateAllTools}
            className="text-xs font-semibold text-[#2E9BFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            All 109 Categories →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {otherCategories.map(hub => {
            const HubIcon = hub.icon || Code;
            return (
              <button
                key={hub.slug}
                onClick={() => onSelectCategory(hub.slug)}
                className="p-2.5 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-input)] hover:border-[#2E9BFF] hover:bg-[var(--bg-surface-hover)] transition text-left cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <HubIcon size={14} className="text-[#2E9BFF]" />
                  <span className="text-[10px] font-mono text-[var(--text-muted)]">
                    {hub.count}
                  </span>
                </div>
                <div className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] transition line-clamp-1">
                  {hub.name}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Big Bottom CTA to View All Tools */}
      <div className="p-6 sm:p-8 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-950/20 via-[#2E9BFF]/10 to-indigo-950/20 text-center">
        <h3 className="text-lg sm:text-xl font-bold text-[var(--text-primary)] mb-2">
          Looking for more developer tools?
        </h3>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-lg mx-auto mb-5">
          Explore all 1,380+ client-side tools across 109 categories in our comprehensive searchable directory.
        </p>
        <button
          onClick={onNavigateAllTools}
          className="btn btn-primary px-6 py-2.5 text-xs sm:text-sm font-bold inline-flex items-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Terminal size={16} />
          <span>Browse All 1,380+ Tools Directory</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
};

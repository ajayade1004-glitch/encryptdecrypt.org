import React, { useState, useMemo } from 'react';
import { 
  Terminal, Search, X, Shield, ArrowRight, Layers, 
  ExternalLink, Sparkles, Filter, Hash, CheckCircle2,
  Lock, Key, Code, Globe, Database, FileText
} from 'lucide-react';
import { ToolItem } from '../../types';
import { preloadToolWorkspace } from '../../utils/toolPreloader';

interface AllToolsPageProps {
  tools: ToolItem[];
  onSelectTool: (tool: ToolItem) => void;
  onNavigateHome: () => void;
}

export const AllToolsPage: React.FC<AllToolsPageProps> = ({
  tools,
  onSelectTool,
  onNavigateHome
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // Group tools by category
  const categoriesMap = useMemo(() => {
    const map = new Map<string, {
      slug: string;
      name: string;
      tools: ToolItem[];
      desc?: string;
    }>();

    tools.forEach(tool => {
      const slug = tool.category || 'general';
      const name = tool.categoryName || slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      
      if (!map.has(slug)) {
        map.set(slug, {
          slug,
          name,
          tools: [],
          desc: tool.shortDesc ? `${name} utilities and converters.` : undefined
        });
      }
      map.get(slug)!.tools.push(tool);
    });

    return map;
  }, [tools]);

  // Sorted list of categories
  const categoriesList = useMemo(() => {
    return Array.from(categoriesMap.values()).sort((a, b) => b.tools.length - a.tools.length);
  }, [categoriesMap]);

  // Filtered categories and tools based on search query and category filter
  const displayedCategories = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return categoriesList.map(cat => {
      if (selectedCategoryFilter !== 'all' && cat.slug !== selectedCategoryFilter) {
        return null;
      }

      if (!query) {
        return cat;
      }

      const matchingTools = cat.tools.filter(t => 
        t.name.toLowerCase().includes(query) ||
        t.slug.toLowerCase().includes(query) ||
        (t.shortDesc && t.shortDesc.toLowerCase().includes(query)) ||
        (t.primaryKeyword && t.primaryKeyword.toLowerCase().includes(query)) ||
        (t.secondaryKeywords && t.secondaryKeywords.some(kw => kw.toLowerCase().includes(query)))
      );

      if (matchingTools.length === 0 && !cat.name.toLowerCase().includes(query)) {
        return null;
      }

      return {
        ...cat,
        tools: matchingTools.length > 0 ? matchingTools : cat.tools
      };
    }).filter((cat): cat is typeof categoriesList[0] => cat !== null);
  }, [categoriesList, searchQuery, selectedCategoryFilter]);

  const totalDisplayedTools = useMemo(() => {
    return displayedCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, [displayedCategories]);

  return (
    <article className="max-w-6xl mx-auto py-4 px-2 sm:px-4 animate-fade-in" itemScope itemType="https://schema.org/CollectionPage">
      {/* Programmatic Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-4 font-mono">
        <button onClick={onNavigateHome} className="hover:text-[#2E9BFF] transition cursor-pointer">Home</button>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold">All Tools Directory</span>
      </nav>

      {/* SEO & AEO Hero Header */}
      <header className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-blue-500/10 via-[var(--bg-surface)] to-[var(--bg-surface)] border border-blue-500/20 mb-8 shadow-sm">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-full bg-[#2E9BFF]/20 text-[#2E9BFF] border border-[#2E9BFF]/30 text-xs font-mono font-bold flex items-center gap-1.5">
            <Shield size={13} />
            Best Website for Cryptographic Tools & Developer Utilities
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono">
            1,380+ Verified Client-Side Tools
          </span>
          <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono">
            109 Categories
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight mb-3">
          Complete 1,380+ Tools Directory &amp; Category Index
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed max-w-4xl mb-6">
          Welcome to the authoritative directory of <strong>1,380+ free browser-based cryptographic utilities</strong>, security ciphers, encoding engines, formatters, and full-stack developer tools. Every calculation executes <strong>100% in client-side RAM</strong> using standard W3C Web Cryptography APIs with zero server logging.
        </p>

        {/* Directory Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search across all 1,380+ tools (e.g. aes-256, rsa, sha256, base64, jwt, uuid)..."
              className="w-full h-11 bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-xl pl-10 pr-10 text-xs sm:text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-1 focus:ring-[#2E9BFF] transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1 cursor-pointer"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategoryFilter}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="h-11 bg-[var(--bg-input)] border border-[var(--border-subtle)] focus:border-[#2E9BFF] rounded-xl px-3 text-xs sm:text-sm text-[var(--text-primary)] cursor-pointer focus:outline-none"
            >
              <option value="all">All 109 Categories ({tools.length} Tools)</option>
              {categoriesList.map(cat => (
                <option key={cat.slug} value={cat.slug}>
                  {cat.name} ({cat.tools.length})
                </option>
              ))}
            </select>

            {(searchQuery || selectedCategoryFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryFilter('all');
                }}
                className="h-11 px-4 rounded-xl bg-blue-500/20 text-[#2E9BFF] border border-blue-500/30 hover:bg-blue-500/30 text-xs font-semibold whitespace-nowrap cursor-pointer transition flex items-center gap-1.5"
              >
                <X size={14} /> Reset
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-xs text-[var(--text-muted)] font-mono">
          <span>Showing {totalDisplayedTools} of {tools.length} tools across {displayedCategories.length} categories</span>
          <span>W3C Web Cryptography Standard compliant</span>
        </div>
      </header>

      {/* Quick Category Jump Matrix */}
      <section className="mb-10 p-5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2 m-0">
            <Layers size={16} className="text-[#2E9BFF]" />
            Fast Category Jump ({categoriesList.length} Categories)
          </h2>
          <span className="text-[11px] text-[var(--text-muted)] font-mono">Click to jump directly to category</span>
        </div>

        <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto pr-1">
          {categoriesList.map(cat => (
            <a
              key={cat.slug}
              href={`#cat-${cat.slug}`}
              className="min-h-[44px] px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-blue-400 text-xs text-slate-200 hover:text-sky-300 transition flex items-center gap-2 font-mono"
            >
              <span>{cat.name}</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800 font-bold">
                {cat.tools.length}
              </span>
            </a>
          ))}
        </div>
      </section>

      {/* Category-by-Category Tool Directory */}
      <div className="space-y-10">
        {displayedCategories.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <Search size={32} className="mx-auto text-[var(--text-muted)] mb-3" />
            <h3 className="text-base font-bold text-[var(--text-primary)] mb-1">No matching tools found</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">No tools matched your search query &ldquo;{searchQuery}&rdquo;.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategoryFilter('all');
              }}
              className="px-5 py-3 min-h-[48px] rounded-lg bg-[#1d4ed8] text-white text-xs font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          displayedCategories.map(cat => (
            <section 
              key={cat.slug} 
              id={`cat-${cat.slug}`}
              className="scroll-mt-24 p-5 sm:p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-subtle)] transition shadow-xs"
            >
              {/* Category Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[#2E9BFF]">
                    <Terminal size={18} />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] m-0 flex items-center gap-2">
                      {cat.name}
                      <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-sky-400 border border-blue-500/20">
                        {cat.tools.length} Tools
                      </span>
                    </h2>
                    <span className="text-xs text-slate-300 font-mono">
                      Category ID: {cat.slug} · 100% Client-Side Private
                    </span>
                  </div>
                </div>

                <a
                  href={`#cat-${cat.slug}`}
                  className="min-h-[44px] px-3 py-2 text-xs text-slate-300 hover:text-sky-300 font-mono flex items-center gap-1 rounded-lg hover:bg-white/5"
                >
                  <Hash size={13} /> Anchor Link
                </a>
              </div>

              {/* Tools Grid in this category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {cat.tools.map(tool => (
                  <div
                    key={tool.id}
                    onClick={() => onSelectTool(tool)}
                    onMouseEnter={preloadToolWorkspace}
                    onTouchStart={preloadToolWorkspace}
                    className="p-3.5 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[#2E9BFF] transition cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-950 text-sky-300 border border-blue-800">
                          {tool.inputType || 'Client-Side'}
                        </span>
                        {tool.popular && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                            ★ Popular
                          </span>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] transition line-clamp-1 mb-1">
                        {tool.name}
                      </h3>

                      <p className="text-[11px] text-[var(--text-muted)] line-clamp-2 leading-relaxed mb-3">
                        {tool.shortDesc || `Perform client-side ${tool.name} computations in secure browser RAM.`}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] text-[#2E9BFF] font-semibold group-hover:translate-x-0.5 transition">
                      <span>Launch Tool</span>
                      <ArrowRight size={13} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </div>

      {/* Programmatic SEO & AEO Deep Authority Footer Section */}
      <footer className="mt-16 p-8 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">
          Why EncryptDecrypt.org is the Best Website for Cryptographic Tools &amp; Developer Utilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[var(--text-secondary)] leading-relaxed">
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              100% Zero-Knowledge RAM
            </h3>
            <p>
              Unlike legacy online utility websites that upload your confidential keys, passwords, and JSON payloads to backend web servers, EncryptDecrypt.org executes 100% of calculations in your local browser sandbox.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              W3C Web Cryptography API
            </h3>
            <p>
              All AES-256-GCM, RSA, SHA-256, SHA-512, and HMAC algorithms are accelerated by your computer’s native CPU cryptography extensions via the W3C WebCrypto standard, ensuring high-speed processing without latency.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-emerald-400" />
              Comprehensive 1,380+ Suite
            </h3>
            <p>
              Covering 109 specialized domains: symmetric and asymmetric cryptography, hashes, token generators, encoding/decoding, network inspection, regex, CSV/JSON formatters, SEO tags, and developer productivity tools.
            </p>
          </div>
        </div>
      </footer>
    </article>
  );
};

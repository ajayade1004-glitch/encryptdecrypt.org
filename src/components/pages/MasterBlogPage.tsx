import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, ArrowLeft, Clock, Calendar, User, 
  Terminal, Share2, Check, ArrowRight, BookOpen, Lock, Shield, Search
} from 'lucide-react';
import { BLOG_POSTS, BlogPost } from '../../data/blogPosts';
import { BlogPostPage } from './BlogPostPage';
import { SeoHead } from '../SeoHead';

interface MasterBlogPageProps {
  onNavigateHome: () => void;
  onSelectToolBySlug: (slug: string) => void;
  onNavigateGuides?: () => void;
}

export const MasterBlogPage: React.FC<MasterBlogPageProps> = ({
  onNavigateHome,
  onSelectToolBySlug,
}) => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter(post => {
      const matchesSearch = 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = activeCategory === 'all' || post.category === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [searchQuery, activeCategory]);

  const categories = useMemo(() => {
    const set = new Set(BLOG_POSTS.map(p => p.category));
    return ['all', ...Array.from(set)];
  }, []);

  if (selectedPost) {
    return (
      <BlogPostPage
        post={selectedPost}
        onBackToBlog={() => {
          setSelectedPost(null);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }}
        onNavigateHome={onNavigateHome}
        onSelectToolBySlug={onSelectToolBySlug}
      />
    );
  }

  return (
    <div className="container py-8 max-w-6xl mx-auto px-4 sm:px-6">
      <SeoHead
        title="Security &amp; Cryptography Guides | EncryptDecrypt.org Blog"
        description="Clear, practical cryptography tutorials written by developers. Learn AES-256, SHA-256 hashing, JWT debugging, and Base64 encoding without confusing math."
        canonicalUrl="https://www.encryptdecrypt.org/blog"
        keywords={['cryptography blog', 'aes-256 guide', 'jwt tutorial', 'sha-256 explanation', 'base64 vs encryption']}
      />

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-[var(--border-subtle)]">
        <button
          onClick={onNavigateHome}
          className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[#2E9BFF] flex items-center gap-1.5 transition cursor-pointer"
        >
          <ArrowLeft size={14} /> Back to Tools Catalog
        </button>
        <span className="text-xs font-mono text-emerald-400 font-semibold flex items-center gap-1">
          <ShieldCheck size={14} /> 100% Human-Written Tutorials
        </span>
      </div>

      {/* Header Banner */}
      <div className="card-glass p-6 sm:p-10 mb-10 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[#2E9BFF] text-xs font-semibold mb-3">
            <BookOpen size={14} />
            <span>Developer Guides &amp; Practical Cryptography</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight mb-3">
            Security &amp; Cryptography Tutorials
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-6">
            Straightforward, human-written guides to help you understand encryption ciphers, hash digests, identity tokens, and web security. No AI-generated fluff or heavy academic proofs—just real-world explanations and code snippets.
          </p>

          <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
            <div className="w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[#2E9BFF] font-bold text-xs">
              AR
            </div>
            <div>
              <span className="font-semibold text-[var(--text-primary)]">Curated by Ajay Rathod</span>
              <span className="block text-[11px] text-[var(--text-muted)]">Full-Stack Developer · Maharashtra, India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex flex-wrap items-center gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition cursor-pointer ${
                activeCategory === cat
                  ? 'bg-[#1d4ed8] text-white font-semibold'
                  : 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] hover:border-blue-400'
              }`}
            >
              {cat === 'all' ? 'All Guides' : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search guides (AES, JWT...)"
            className="w-full bg-[var(--bg-input)] border border-[var(--border-subtle)] rounded-lg px-3 py-1.5 pl-8 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[#2E9BFF]"
          />
          <Search size={14} className="absolute left-2.5 top-2.5 text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {filteredPosts.map(post => (
          <article
            key={post.slug}
            onClick={() => {
              setSelectedPost(post);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="card-glass p-6 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-blue-500/50 hover:shadow-lg transition flex flex-col justify-between cursor-pointer group"
          >
            <div>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-3">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-sky-400 border border-blue-500/20">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock size={12} /> {post.readTime}
                </span>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-[#2E9BFF] transition mb-2.5 leading-snug">
                {post.title}
              </h2>

              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3 mb-4">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <span className="text-[var(--text-muted)] flex items-center gap-1.5">
                <User size={13} /> {post.author}
              </span>
              <span className="text-[#2E9BFF] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition">
                Read Guide <ArrowRight size={13} />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* E-E-A-T Disclaimer Banner */}
      <div className="p-5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-secondary)]">
        <div>
          <span className="font-bold text-[var(--text-primary)]">Educational Guarantee:</span> All guides are published for technical education and defensive software security. We advocate for responsible data privacy.
        </div>
        <div className="font-mono text-[11px] text-[var(--text-muted)]">
          Questions or errata? Write to <a href="mailto:support@encryptdecrypt.org" className="text-[#2E9BFF] hover:underline">support@encryptdecrypt.org</a>
        </div>
      </div>
    </div>
  );
};

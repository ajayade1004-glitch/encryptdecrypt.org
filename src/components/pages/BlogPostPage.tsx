import React, { useState } from 'react';
import { 
  ShieldCheck, ArrowLeft, Clock, Calendar, User, 
  Terminal, Share2, Check, Copy, ArrowRight, BookOpen, Lock, Shield
} from 'lucide-react';
import { BlogPost } from '../../data/blogPosts';
import { SeoHead } from '../SeoHead';

interface BlogPostPageProps {
  post: BlogPost;
  onBackToBlog: () => void;
  onNavigateHome: () => void;
  onSelectToolBySlug: (slug: string) => void;
}

export const BlogPostPage: React.FC<BlogPostPageProps> = ({
  post,
  onBackToBlog,
  onNavigateHome,
  onSelectToolBySlug,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Render paragraphs and markdown headings simply and safely
  const renderFormattedContent = (content: string) => {
    const lines = content.trim().split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    let codeLanguage = '';

    lines.forEach((line, index) => {
      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.replace('```', '').trim();
          codeBuffer = [];
        } else {
          inCodeBlock = false;
          elements.push(
            <div key={`code-${index}`} className="my-5 rounded-xl overflow-hidden border border-[var(--border-subtle)] bg-[var(--bg-input)]">
              {codeLanguage && (
                <div className="px-4 py-1.5 text-[11px] font-mono text-[var(--text-muted)] border-b border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] flex items-center justify-between">
                  <span>{codeLanguage}</span>
                  <span>Client-Side Standard</span>
                </div>
              )}
              <pre className="p-4 font-mono text-xs overflow-x-auto text-sky-300 leading-relaxed">
                <code>{codeBuffer.join('\n')}</code>
              </pre>
            </div>
          );
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${index}`} className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-8 mb-3 tracking-tight">
            {line.replace('## ', '')}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${index}`} className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-6 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={`li-${index}`} className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed ml-4 list-disc mb-1.5">
            {line.replace('- ', '')}
          </li>
        );
      } else if (line.startsWith('|')) {
        // Simple table row detection
        elements.push(
          <div key={`table-row-${index}`} className="font-mono text-xs text-[var(--text-secondary)] py-1 overflow-x-auto">
            {line}
          </div>
        );
      } else if (line.trim() === '---') {
        elements.push(<hr key={`hr-${index}`} className="my-8 border-[var(--border-subtle)]" />);
      } else if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${index}`} className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
            {line}
          </p>
        );
      }
    });

    return elements;
  };

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <SeoHead
        title={`${post.title} | EncryptDecrypt.org Blog`}
        description={post.excerpt}
        canonicalUrl={`https://www.encryptdecrypt.org/blog/${post.slug}`}
        schemas={[
          {
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            'headline': post.title,
            'description': post.excerpt,
            'datePublished': post.publishedDate,
            'dateModified': post.updatedDate,
            'author': {
              '@type': 'Person',
              'name': post.author,
              'jobTitle': post.authorRole
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'EncryptDecrypt.org',
              'url': 'https://www.encryptdecrypt.org/'
            },
            'mainEntityOfPage': `https://www.encryptdecrypt.org/blog/${post.slug}`
          }
        ]}
      />

      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[var(--text-muted)] mb-6 font-mono">
        <a href="/" onClick={(e) => { e.preventDefault(); onNavigateHome(); }} className="hover:text-[#2E9BFF] cursor-pointer">
          Home
        </a>
        <span>/</span>
        <button onClick={onBackToBlog} className="hover:text-[#2E9BFF] cursor-pointer">
          Blog
        </button>
        <span>/</span>
        <span className="text-[var(--text-primary)] font-semibold truncate max-w-[200px] sm:max-w-xs">
          {post.title}
        </span>
      </nav>

      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={onBackToBlog}
          className="inline-flex items-center gap-2 text-xs font-semibold text-sky-400 hover:text-sky-300 transition cursor-pointer p-2 rounded-lg hover:bg-blue-500/10"
        >
          <ArrowLeft size={16} /> Back to all articles
        </button>
      </div>

      {/* Article Header */}
      <header className="card-glass p-6 sm:p-10 mb-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-500/10 text-sky-400 border border-blue-500/20">
            {post.category}
          </span>
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-mono">
            <Clock size={13} /> {post.readTime}
          </span>
          <span className="text-xs text-[var(--text-muted)] flex items-center gap-1 font-mono">
            <Calendar size={13} /> Updated: {post.updatedDate}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight leading-tight mb-4">
          {post.title}
        </h1>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed mb-6">
          {post.excerpt}
        </p>

        {/* Author Bio Banner & Share */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[var(--border-subtle)]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600/20 text-[#2E9BFF] border border-blue-500/30 flex items-center justify-center font-bold text-sm">
              AR
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm text-[var(--text-primary)]">
                {post.author}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                {post.authorRole} · Maharashtra, India
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyShare}
              className="px-3 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-surface-hover)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[#2E9BFF] transition flex items-center gap-1.5 cursor-pointer"
            >
              {copiedLink ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
              <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
            </button>
            {post.relatedToolSlug && (
              <button
                onClick={() => onSelectToolBySlug(post.relatedToolSlug)}
                className="px-3.5 py-1.5 rounded-lg bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Try Related Tool</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Article Body */}
      <article className="card-glass p-6 sm:p-10 mb-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs leading-relaxed">
        {renderFormattedContent(post.content)}
      </article>

      {/* Author Trust & Review Box at Bottom */}
      <div className="card-glass p-6 sm:p-8 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/30 text-[#2E9BFF] flex items-center justify-center font-bold text-xl shrink-0">
          AR
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm sm:text-base text-[var(--text-primary)]">
              Written &amp; Verified by Ajay Rathod
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
              Verified Author
            </span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Ajay Rathod is an independent web developer and security researcher based in Maharashtra, India. He builds open-source client-side developer utilities designed to make cryptography accessible and private for everyone without tracking or server uploads.
          </p>
          <div className="text-[11px] font-mono text-[var(--text-muted)] pt-1 flex items-center gap-3">
            <span>Last Reviewed: {post.updatedDate}</span>
            <span>·</span>
            <a href="mailto:support@encryptdecrypt.org" className="text-sky-400 hover:underline">support@encryptdecrypt.org</a>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * encryptdecrypt.org - Router & Data Helpers
 * Reads tools.json to generate breadcrumbs, related-tool lists, category counts and sitemap entries.
 */

(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.RouterData = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  let cachedTools = null;

  async function loadTools(basePath = '/assets/data/tools.json') {
    if (cachedTools) return cachedTools;
    if (typeof window !== 'undefined' && window.__TOOLS_DATA__) {
      cachedTools = window.__TOOLS_DATA__;
      return cachedTools;
    }
    try {
      const response = await fetch(basePath);
      cachedTools = await response.json();
      return cachedTools;
    } catch (err) {
      console.error('Error loading tools.json:', err);
      return [];
    }
  }

  function setTools(tools) {
    cachedTools = tools;
  }

  function getToolById(tools, id) {
    return tools.find(t => t.id === id) || null;
  }

  function getToolBySlug(tools, categorySlug, toolSlug) {
    return tools.find(t => t.category === categorySlug && t.slug === toolSlug) || null;
  }

  function getToolsByCategory(tools, categorySlug) {
    return tools.filter(t => t.category === categorySlug);
  }

  function getCategoryCounts(tools) {
    const counts = {};
    tools.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }

  function getAllCategories(tools) {
    const map = new Map();
    tools.forEach(t => {
      if (!map.has(t.category)) {
        map.set(t.category, {
          slug: t.category,
          name: t.categoryName,
          count: 0
        });
      }
      map.get(t.category).count++;
    });
    return Array.from(map.values());
  }

  function generateBreadcrumbsHTML(categoryName, categorySlug, toolName) {
    return `
      <nav class="breadcrumb-bar" aria-label="Breadcrumb">
        <a href="/">Home</a>
        <span aria-hidden="true">/</span>
        <a href="/tools/">Tools</a>
        <span aria-hidden="true">/</span>
        <a href="/tools/${categorySlug}/">${categoryName}</a>
        ${toolName ? `<span aria-hidden="true">/</span><span aria-current="page">${toolName}</span>` : ''}
      </nav>
    `;
  }

  function generateRelatedToolsHTML(tools, relatedIds, currentToolId) {
    const related = (relatedIds || [])
      .map(id => getToolById(tools, id))
      .filter(t => t && t.id !== currentToolId)
      .slice(0, 6);

    if (!related.length) return '';

    const items = related.map(t => `
      <li style="margin-bottom: 8px;">
        <a href="/tools/${t.category}/${t.slug}/" style="display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; border-radius: 6px; background: var(--bg-surface-hover); font-size: 13px;">
          <span>${t.name}</span>
          <span style="font-size: 11px; color: var(--text-muted);">→</span>
        </a>
      </li>
    `).join('');

    return `
      <div class="card-glass" style="margin-top: 16px;">
        <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); margin-bottom: 12px;">Related Developer Tools</h3>
        <ul style="list-style: none; padding: 0; margin: 0;">
          ${items}
        </ul>
      </div>
    `;
  }

  function generateSitemapEntries(tools, baseUrl = 'https://encryptdecrypt.org') {
    const now = new Date().toISOString().split('T')[0];
    const urls = [
      { loc: `${baseUrl}/`, priority: '1.0', changefreq: 'daily' },
      { loc: `${baseUrl}/tools/`, priority: '0.9', changefreq: 'daily' },
      { loc: `${baseUrl}/about/`, priority: '0.5', changefreq: 'monthly' },
      { loc: `${baseUrl}/privacy-policy/`, priority: '0.3', changefreq: 'monthly' },
      { loc: `${baseUrl}/terms/`, priority: '0.3', changefreq: 'monthly' }
    ];

    // Categories
    const categories = getAllCategories(tools);
    categories.forEach(c => {
      urls.push({ loc: `${baseUrl}/tools/${c.slug}/`, priority: '0.8', changefreq: 'weekly' });
    });

    // Tools
    tools.forEach(t => {
      urls.push({ loc: `${baseUrl}/tools/${t.category}/${t.slug}/`, priority: '0.8', changefreq: 'weekly' });
    });

    return urls;
  }

  return {
    loadTools,
    setTools,
    getToolById,
    getToolBySlug,
    getToolsByCategory,
    getCategoryCounts,
    getAllCategories,
    generateBreadcrumbsHTML,
    generateRelatedToolsHTML,
    generateSitemapEntries
  };
}));

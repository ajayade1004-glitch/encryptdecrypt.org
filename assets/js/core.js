/**
 * encryptdecrypt.org - Core Shared Runtime
 * 100% Client-Side Pure JavaScript (ES6+)
 * Zero dependencies · Theme toggle · Fuzzy search · Clipboard & File helpers
 */

(function () {
  'use strict';

  // 1. THEME TOGGLE WITH LOCALSTORAGE & SYSTEM PREFERENCE
  const THEME_STORAGE_KEY = 'ed_theme';
  
  function getPreferredTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
      const iconDark = btn.querySelector('.icon-dark');
      const iconLight = btn.querySelector('.icon-light');
      if (iconDark && iconLight) {
        iconDark.style.display = theme === 'dark' ? 'none' : 'inline-block';
        iconLight.style.display = theme === 'dark' ? 'inline-block' : 'none';
      }
    });
  }

  window.toggleTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
  };

  // Initialize theme immediately
  applyTheme(getPreferredTheme());

  // 2. TOAST NOTIFICATION HELPER
  window.showToast = function (message, type = 'success') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M20 6L9 17l-5-5"/>
      </svg>
      <span>${message}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2500);
  };

  // 3. COPY TO CLIPBOARD HELPER
  window.copyToClipboard = function (text, btnElement) {
    if (!text) {
      window.showToast('Nothing to copy', 'warning');
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      window.showToast('Copied to clipboard!');
      if (btnElement) {
        const originalText = btnElement.innerText;
        btnElement.innerText = 'Copied!';
        setTimeout(() => { btnElement.innerText = originalText; }, 1800);
      }
    }).catch(err => {
      console.error('Clipboard copy failed:', err);
      // Fallback using textarea
      const el = document.createElement('textarea');
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      window.showToast('Copied to clipboard!');
    });
  };

  // 4. DOWNLOAD RESULT HELPER
  window.downloadResultAsFile = function (content, filename = 'result.txt', mime = 'text/plain') {
    if (!content) {
      window.showToast('Output is empty', 'warning');
      return;
    }
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    window.showToast(`Saved as ${filename}`);
  };

  // 5. FILE DRAG-AND-DROP & UPLOAD HELPER
  window.initFileUploadZone = function (dropZoneEl, inputEl, onFileRead) {
    if (!dropZoneEl || !inputEl) return;

    ['dragenter', 'dragover'].forEach(eventName => {
      dropZoneEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZoneEl.classList.add('is-dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      dropZoneEl.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        dropZoneEl.classList.remove('is-dragover');
      }, false);
    });

    dropZoneEl.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      if (files && files[0]) handleFile(files[0]);
    });

    inputEl.addEventListener('change', () => {
      if (inputEl.files && inputEl.files[0]) {
        handleFile(inputEl.files[0]);
      }
    });

    function handleFile(file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof onFileRead === 'function') {
          onFileRead(e.target.result, file);
        }
      };
      reader.readAsText(file);
    }
  };

  // 6. GLOBAL TOOL FUZZY SEARCH (KEYBOARD SHORTCUT '/')
  let toolsData = [];
  let selectedSearchIndex = -1;

  async function loadToolsData() {
    if (toolsData.length) return toolsData;
    try {
      const res = await fetch('/assets/data/tools.json');
      if (res.ok) {
        toolsData = await res.json();
      }
    } catch (e) {
      console.warn('Could not load tools.json directly:', e);
    }
    return toolsData;
  }

  function initGlobalSearch() {
    const searchInputs = document.querySelectorAll('.global-search-input');
    
    // Global "/" key shortcut
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
        e.preventDefault();
        const firstInput = document.querySelector('.global-search-input');
        if (firstInput) {
          firstInput.focus();
          firstInput.select();
        }
      }
    });

    searchInputs.forEach(input => {
      const container = input.closest('.search-container') || input.parentElement;
      let dropdown = container.querySelector('.search-dropdown');
      if (!dropdown) {
        dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        container.appendChild(dropdown);
      }

      input.addEventListener('focus', () => {
        loadToolsData();
        if (input.value.trim()) renderSearchResults(input.value.trim(), dropdown);
      });

      input.addEventListener('input', () => {
        const query = input.value.trim();
        if (!query) {
          dropdown.classList.remove('is-open');
          dropdown.innerHTML = '';
          selectedSearchIndex = -1;
          return;
        }
        renderSearchResults(query, dropdown);
      });

      // Keyboard navigation: Up, Down, Enter, Esc
      input.addEventListener('keydown', (e) => {
        const items = dropdown.querySelectorAll('.search-item');
        if (!items.length) return;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          selectedSearchIndex = (selectedSearchIndex + 1) % items.length;
          updateSearchSelection(items);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          selectedSearchIndex = (selectedSearchIndex - 1 + items.length) % items.length;
          updateSearchSelection(items);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (selectedSearchIndex >= 0 && items[selectedSearchIndex]) {
            items[selectedSearchIndex].click();
          } else if (items[0]) {
            items[0].click();
          }
        } else if (e.key === 'Escape') {
          dropdown.classList.remove('is-open');
          input.blur();
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        document.querySelectorAll('.search-dropdown').forEach(d => d.classList.remove('is-open'));
      }
    });
  }

  function renderSearchResults(query, dropdown) {
    if (!toolsData.length) return;
    const q = query.toLowerCase();
    
    // Fuzzy matching score
    const results = toolsData.map(tool => {
      let score = 0;
      const name = tool.name.toLowerCase();
      const desc = tool.shortDesc.toLowerCase();
      const cat = tool.categoryName.toLowerCase();
      
      if (name === q) score += 100;
      else if (name.startsWith(q)) score += 50;
      else if (name.includes(q)) score += 30;
      
      if (desc.includes(q)) score += 15;
      if (cat.includes(q)) score += 10;
      if (tool.popular) score += 5;

      return { tool, score };
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

    if (!results.length) {
      dropdown.innerHTML = `<div style="padding: 16px; text-align: center; color: var(--text-muted); font-size: 13px;">No tools found matching "${query}"</div>`;
      dropdown.classList.add('is-open');
      selectedSearchIndex = -1;
      return;
    }

    dropdown.innerHTML = results.map((r, idx) => `
      <div class="search-item ${idx === 0 ? 'is-active' : ''}" data-url="/tools/${r.tool.category}/${r.tool.slug}/" data-id="${r.tool.id}">
        <div>
          <strong style="display: block; font-size: 14px;">${r.tool.name}</strong>
          <span style="font-size: 12px; color: var(--text-muted);">${r.tool.shortDesc}</span>
        </div>
        <span class="badge">${r.tool.categoryName}</span>
      </div>
    `).join('');

    dropdown.classList.add('is-open');
    selectedSearchIndex = 0;

    dropdown.querySelectorAll('.search-item').forEach(item => {
      item.addEventListener('click', () => {
        const url = item.getAttribute('data-url');
        const toolId = item.getAttribute('data-id');
        if (window.onToolSelected) {
          window.onToolSelected(toolId);
        } else {
          window.location.href = url;
        }
      });
    });
  }

  function updateSearchSelection(items) {
    items.forEach((item, idx) => {
      if (idx === selectedSearchIndex) {
        item.classList.add('is-active');
        item.scrollIntoView({ block: 'nearest' });
      } else {
        item.classList.remove('is-active');
      }
    });
  }

  // 7. LAZY LOAD AD SLOTS AND ACCORDIONS
  function initLazyAdSlots() {
    if ('IntersectionObserver' in window) {
      const adObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const adSlot = entry.target;
            adSlot.setAttribute('data-ad-loaded', 'true');
            observer.unobserve(adSlot);
          }
        });
      }, { rootMargin: '200px' });

      document.querySelectorAll('.ad-slot').forEach(slot => adObserver.observe(slot));
    }
  }

  // Mobile Drawer Toggle
  window.toggleMobileDrawer = function () {
    const drawer = document.getElementById('mobile-drawer');
    if (drawer) {
      drawer.classList.toggle('is-open');
    }
  };

  // DOMContentLoaded initialization
  document.addEventListener('DOMContentLoaded', () => {
    initGlobalSearch();
    initLazyAdSlots();
  });
})();

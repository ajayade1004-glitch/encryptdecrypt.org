const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const cssTools = [
  { name: 'CSS Clamp Generator', slug: 'css-clamp-generator', shortDesc: 'Generate fluid responsive CSS clamp(min, val, max) formulas for typography and spacing.' },
  { name: 'CSS Grid Layout Generator', slug: 'css-grid-layout-generator', shortDesc: 'Visual CSS grid template generator with columns, rows, gap, and responsive auto-fit.' },
  { name: 'CSS Flexbox Layout Generator', slug: 'css-flexbox-layout-generator', shortDesc: 'Create flexible CSS flexbox containers with justify, align, direction, and gap rules.' },
  { name: 'CSS Animation Generator', slug: 'css-animation-generator', shortDesc: 'Design custom CSS keyframe animations with cubic-bezier timing and smooth transitions.' },
  { name: 'CSS Transform Generator', slug: 'css-transform-generator', shortDesc: 'Generate 2D and 3D CSS transforms including rotate, scale, translate, skew, and perspective.' },
  { name: 'CSS Filter Generator', slug: 'css-filter-generator', shortDesc: 'Apply visual CSS filters: blur, brightness, contrast, grayscale, hue-rotate, invert, and sepia.' },
  { name: 'CSS Text Shadow Generator', slug: 'css-text-shadow-generator', shortDesc: 'Create layered neon, 3D, retro, and soft glowing CSS text shadows.' },
  { name: 'CSS Gradient Text Generator', slug: 'css-gradient-text-generator', shortDesc: 'Generate modern background-clip gradient text styling with custom angles and color stops.' },
  { name: 'CSS Glassmorphism Generator', slug: 'css-glassmorphism-generator', shortDesc: 'Design frosted glass UI elements with backdrop-filter blur, border opacity, and soft shadows.' },
  { name: 'CSS Neumorphism Generator', slug: 'css-neumorphism-generator', shortDesc: 'Generate soft UI neumorphic shadows with flat, convex, concave, and inset shapes.' },
  { name: 'CSS Button Generator', slug: 'css-button-generator', shortDesc: 'Generate modern button CSS with hover effects, active states, pill radius, and gradients.' },
  { name: 'CSS Card Generator', slug: 'css-card-generator', shortDesc: 'Generate responsive card layouts with elevation shadows, hover lifts, and border radius.' },
  { name: 'CSS Tooltip Generator', slug: 'css-tooltip-generator', shortDesc: 'Pure CSS tooltips with data-tooltip attributes, pointer arrows, and zero JavaScript.' },
  { name: 'CSS Modal Generator', slug: 'css-modal-generator', shortDesc: 'Generate modal dialog boxes with backdrop blur, entrance animations, and responsive max-width.' },
  { name: 'CSS Toggle Switch Generator', slug: 'css-toggle-switch-generator', shortDesc: 'Create pure CSS toggle switch sliders with smooth knob transitions and custom accent colors.' },
  { name: 'CSS Checkbox Generator', slug: 'css-checkbox-generator', shortDesc: 'Custom CSS checkboxes with animated checkmarks, rounded borders, and focus rings.' },
  { name: 'CSS Radio Button Generator', slug: 'css-radio-button-generator', shortDesc: 'Custom radio buttons with smooth scaling inner dots and accessible focus states.' },
  { name: 'CSS Loader Generator', slug: 'css-loader-generator', shortDesc: 'Generate pure CSS loading indicators including pulsating dots and equalizer wave bars.' },
  { name: 'CSS Spinner Generator', slug: 'css-spinner-generator', shortDesc: 'Generate smooth rotating CSS circular spinners and dual-ring loaders.' },
  { name: 'CSS Skeleton Loader Generator', slug: 'css-skeleton-loader-generator', shortDesc: 'Create shimmer skeleton placeholder loaders for cards, avatars, and text lines.' },
  { name: 'CSS Media Query Generator', slug: 'css-media-query-generator', shortDesc: 'Generate standard and modern range media queries for responsive layouts and user preferences.' },
  { name: 'CSS Breakpoint Planner', slug: 'css-breakpoint-planner', shortDesc: 'Plan mobile-first and desktop-down responsive breakpoint tokens for Tailwind and SCSS.' },
  { name: 'CSS Sticky Header Generator', slug: 'css-sticky-header-generator', shortDesc: 'Create sticky navigation headers with backdrop-filter blur and scroll shrinking.' },
  { name: 'CSS Responsive Typography Generator', slug: 'css-responsive-typography-generator', shortDesc: 'Generate a fluid modular typographic scale from h1 to small using viewport math.' },
  { name: 'CSS Image Overlay Generator', slug: 'css-image-overlay-generator', shortDesc: 'Design image hover overlays with smooth slide-up captions, dark tints, and zoom effects.' },
  { name: 'CSS Hover Effect Generator', slug: 'css-hover-effect-generator', shortDesc: 'Generate interactive hover effects: card lifts, button glows, and expanding underlines.' },
  { name: 'CSS Scrollbar Styler', slug: 'css-scrollbar-styler', shortDesc: 'Style custom cross-browser scrollbars for WebKit browsers, Firefox, and Chromium.' },
  { name: 'CSS Text Truncation Generator', slug: 'css-text-truncation-generator', shortDesc: 'Generate single-line ellipsis truncation and multi-line line-clamp CSS rules.' },
  { name: 'CSS Multi-Column Layout Generator', slug: 'css-multi-column-layout-generator', shortDesc: 'Create newspaper and editorial multi-column layouts with column-count and column-gap.' },
  { name: 'CSS Container Query Generator', slug: 'css-container-query-generator', shortDesc: 'Generate modern CSS container queries (@container) based on parent element width.' }
];

const gitTools = [
  { name: 'Git Branch Name Generator', slug: 'git-branch-name-generator', shortDesc: 'Format standardized team git branch names with issue tracker tickets and conventional prefixes.' },
  { name: 'Git Commit Message Generator', slug: 'git-commit-message-generator', shortDesc: 'Build Conventional Commits (v1.0.0) with type, scope, breaking changes, and issue refs.' },
  { name: 'Git Reset Command Builder', slug: 'git-reset-command-builder', shortDesc: 'Generate and explain safe git reset commands (--soft, --mixed, --hard) with rollback safety.' },
  { name: 'Git Revert Command Builder', slug: 'git-revert-command-builder', shortDesc: 'Build safe git revert commands for single commits, ranges, and merge commits without history rewriting.' },
  { name: 'Git Merge Command Builder', slug: 'git-merge-command-builder', shortDesc: 'Craft git merge workflows with --no-ff, --ff-only, and --squash strategies.' },
  { name: 'Git Rebase Command Builder', slug: 'git-rebase-command-builder', shortDesc: 'Build interactive git rebase commands (git rebase -i) with squashing and conflict handling steps.' },
  { name: 'Git Diff Viewer', slug: 'git-diff-viewer', shortDesc: 'Parse and inspect unified git diffs with additions, deletions, and file change statistics.' },
  { name: 'Git Patch Viewer', slug: 'git-patch-viewer', shortDesc: 'Inspect and parse git format-patch files with commit metadata and apply instructions.' },
  { name: 'Git README Generator', slug: 'git-readme-generator', shortDesc: 'Generate professional GitHub README.md files with shields badges, installation, and tech stack.' },
  { name: 'GitHub Issue Template Generator', slug: 'github-issue-template-generator', shortDesc: 'Create YAML and Markdown issue templates for bug reports and feature requests.' },
  { name: 'GitHub Pull Request Template Generator', slug: 'github-pull-request-template-generator', shortDesc: 'Generate standardized pull request templates with test checklists and issue links.' },
  { name: 'GitHub Actions Workflow Generator', slug: 'github-actions-workflow-generator', shortDesc: 'Build CI/CD GitHub Actions workflows for Node.js testing, linting, and production builds.' },
  { name: 'Git Ignore Generator', slug: 'git-ignore-generator', shortDesc: 'Generate comprehensive .gitignore templates for Node.js, macOS, Windows, and modern IDEs.' },
  { name: 'Git Changelog Generator', slug: 'git-changelog-generator', shortDesc: 'Parse commit messages into Keep a Changelog format grouped by features, fixes, and breaking changes.' },
  { name: 'Git Release Notes Generator', slug: 'git-release-notes-generator', shortDesc: 'Format GitHub release notes with version tags, highlights, and categorized commit logs.' },
  { name: 'Git Command Explainer', slug: 'git-command-explainer', shortDesc: 'Deconstruct and explain any complex git command and its CLI flags in clear English.' },
  { name: 'Git Repository Size Estimator', slug: 'git-repo-size-estimator', shortDesc: 'Estimate repository packfile sizes, detect oversized files, and generate Git LFS rules.' },
  { name: 'Git Branch Comparison Tool', slug: 'git-branch-comparison-tool', shortDesc: 'Compare branches with ahead/behind commit counts, diff summaries, and cherry-pick helpers.' },
  { name: 'Git Tag Formatter', slug: 'git-tag-formatter', shortDesc: 'Format semantic versioning git tags (v1.0.0) with annotated messages and GPG signing.' },
  { name: 'GitHub Markdown Table Generator', slug: 'github-markdown-table-generator', shortDesc: 'Create GitHub-flavored markdown tables with custom column alignments and CSV import.' }
];

function upsert(tool, category, categoryName) {
  const existingIdx = tools.findIndex(t => t.slug === tool.slug);
  const toolEntry = {
    id: tool.slug,
    name: tool.name,
    slug: tool.slug,
    category: category,
    categoryName: categoryName,
    shortDesc: tool.shortDesc,
    metaTitle: `${tool.name} - Free Online Developer Utility`,
    metaDescription: `${tool.shortDesc} Fast, 100% client-side, zero server logging.`,
    primaryKeyword: tool.name.toLowerCase(),
    secondaryKeywords: [
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      `${categoryName.toLowerCase()} tool`
    ],
    lsiKeywords: ['developer tools', 'web developer utilities', 'client-side', 'privacy focused'],
    inputType: 'text',
    hasFileSupport: false,
    related: [],
    popular: false
  };

  if (existingIdx >= 0) {
    tools[existingIdx] = { ...tools[existingIdx], ...toolEntry };
  } else {
    tools.push(toolEntry);
  }
}

cssTools.forEach(t => upsert(t, 'web-developer-css-tools', 'Web Developer & CSS Tools'));
gitTools.forEach(t => upsert(t, 'git-github-tools', 'Git & GitHub Tools'));

// Link related tools
tools.forEach(t => {
  if (t.category === 'web-developer-css-tools') {
    t.related = cssTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'git-github-tools') {
    t.related = gitTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully updated tools.json. Total tools now: ${tools.length}`);

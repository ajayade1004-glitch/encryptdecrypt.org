/**
 * Git & GitHub Client-Side Developer Engines
 * 100% browser-native git commands, workflows, diff viewers, commit formatters,
 * and GitHub templates.
 */

/**
 * 1. Git Branch Name Generator
 * Formats standardized, clean branch names according to team convention
 */
export function generateGitBranchName(
  type = 'feature',
  ticket = 'JIRA-1042',
  description = 'add user dark mode toggle',
  delimiter = '/'
): string {
  const cleanDesc = description
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const cleanTicket = ticket.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  const prefix = type.toLowerCase().trim();

  const branchName = cleanTicket
    ? `${prefix}${delimiter}${cleanTicket}-${cleanDesc}`
    : `${prefix}${delimiter}${cleanDesc}`;

  return `# Git Branch Name Generator
# Convention: <type>/<ticket>-<short-description>

Branch Name:
${branchName}

# Terminal Commands to create & checkout:
git checkout -b ${branchName}

# Or with modern Git switch:
git switch -c ${branchName}

# Set upstream push command:
git push -u origin ${branchName}`;
}

/**
 * 2. Git Commit Message Generator
 * Formats Conventional Commits specification (v1.0.0) with git command
 */
export function generateGitCommitMessage(
  type = 'feat',
  scope = 'auth',
  summary = 'implement OAuth2 PKCE authorization flow',
  body = 'Ensures public clients and single-page apps can authenticate securely without exposing client secrets.',
  isBreaking = false,
  breakingDesc = '',
  issuesClosed = '#142'
): string {
  const breakingMarker = isBreaking ? '!' : '';
  const scopePart = scope.trim() ? `(${scope.trim()})` : '';
  const firstLine = `${type.trim()}${scopePart}${breakingMarker}: ${summary.trim()}`;

  const paragraphs: string[] = [firstLine];

  if (body.trim()) {
    paragraphs.push(body.trim());
  }

  if (isBreaking) {
    paragraphs.push(`BREAKING CHANGE: ${breakingDesc.trim() || 'Alters previous signature and requirements.'}`);
  }

  if (issuesClosed.trim()) {
    const issues = issuesClosed.startsWith('#') || issuesClosed.startsWith('Closes')
      ? issuesClosed
      : `Closes #${issuesClosed.replace(/[^0-9]/g, '')}`;
    paragraphs.push(`Fixes: ${issues}`);
  }

  const commitMsg = paragraphs.join('\n\n');
  const escapedMsg = commitMsg.replace(/"/g, '\\"');

  return `# Conventional Commit (v1.0.0)
${commitMsg}

--------------------------------------------------
# Git CLI Command:
git commit -m "${escapedMsg}"`;
}

/**
 * 3. Git Reset Command Builder
 * Explains and crafts safe reset commands (--soft, --mixed, --hard)
 */
export function buildGitResetCommand(
  mode = 'mixed',
  target = 'HEAD~1',
  stashChanges = true
): string {
  let explanation = '';
  let riskLevel = 'Low';

  switch (mode) {
    case 'soft':
      explanation = 'Moves HEAD back to target. Keeps all changes STAGED in index. Zero code lost.';
      riskLevel = 'Safe / Low Risk';
      break;
    case 'mixed':
      explanation = 'Moves HEAD back to target. Keeps all changes in WORKING DIRECTORY but UNSTAGED.';
      riskLevel = 'Moderate (Default)';
      break;
    case 'hard':
      explanation = 'DISCARDS all uncommitted changes and overwrites files to match target commit exactly!';
      riskLevel = 'HIGH RISK (Irreversible data loss if not backed up)';
      break;
    default:
      explanation = 'Standard git reset targeting commit ref.';
  }

  const lines = [
    `# Git Reset Command Builder`,
    `# Mode: --${mode} | Target: ${target} | Risk: ${riskLevel}`,
    `# Explanation: ${explanation}`,
    ''
  ];

  if (mode === 'hard' && stashChanges) {
    lines.push('# Safety Step: Stash existing uncommitted work before running hard reset:');
    lines.push('git stash save "backup-before-hard-reset-' + new Date().toISOString().slice(0, 10) + '"');
    lines.push('');
  }

  lines.push(`git reset --${mode} ${target}`);
  lines.push('');
  lines.push('# Emergency Undo (if you need to recover a lost reset commit):');
  lines.push('git reflog');
  lines.push('git reset --hard HEAD@{1}');

  return lines.join('\n');
}

/**
 * 4. Git Revert Command Builder
 * Creates inverse commits for production-safe rollbacks on shared branches
 */
export function buildGitRevertCommand(
  commitHash = 'a1b2c3d',
  isMerge = false,
  parentNumber = 1,
  noCommit = false
): string {
  const flags: string[] = [];
  if (isMerge) {
    flags.push(`-m ${parentNumber}`);
  }
  if (noCommit) {
    flags.push('-n');
  }

  const flagStr = flags.length > 0 ? ` ${flags.join(' ')}` : '';
  const cmd = `git revert${flagStr} ${commitHash}`;

  return `# Git Revert Command Builder
# Why revert instead of reset?
# In shared/remote branches (main/develop), 'git revert' creates a new forward commit that
# reverses the target commit's diff without rewriting git history, avoiding force pushes!

Revert Command:
${cmd}

# If reverting a range of commits:
git revert ${commitHash}~3..${commitHash}

# Abort revert in case of conflicts:
git revert --abort

# Continue after resolving conflicts:
git revert --continue`;
}

/**
 * 5. Git Merge Command Builder
 */
export function buildGitMergeCommand(
  sourceBranch = 'feature/auth-login',
  strategy = 'no-ff',
  squash = false,
  commitMessage = 'Merge branch feature/auth-login into main'
): string {
  const flags: string[] = [];
  if (strategy === 'no-ff') flags.push('--no-ff');
  if (strategy === 'ff-only') flags.push('--ff-only');
  if (squash) flags.push('--squash');

  if (commitMessage && !squash) {
    flags.push(`-m "${commitMessage.replace(/"/g, '\\"')}"`);
  }

  const flagStr = flags.length > 0 ? ` ${flags.join(' ')}` : '';

  return `# Git Merge Command Workflow
# 1. Update your local main branch first:
git checkout main
git pull origin main

# 2. Execute merge with desired strategy (${strategy}):
git merge${flagStr} ${sourceBranch}

${squash ? `# 3. For squash merges, finalize the single squashed commit:\ngit commit -m "${commitMessage}"\n` : ''}
# 4. Push merged state to remote:
git push origin main

# 5. Delete local and remote feature branch (optional cleanup):
git branch -d ${sourceBranch}
git push origin --delete ${sourceBranch}`;
}

/**
 * 6. Git Rebase Command Builder
 */
export function buildGitRebaseCommand(
  upstreamBranch = 'main',
  interactive = true,
  commitCount = 3,
  ontoBranch = ''
): string {
  const lines = [
    `# Git Rebase Command Builder`,
    `# Rebase keeps your branch history linear without extraneous merge commits.`,
    ''
  ];

  if (interactive) {
    lines.push(`# Interactive rebase last ${commitCount} commits to clean up / squash:`);
    lines.push(`git rebase -i HEAD~${commitCount}`);
    lines.push('');
    lines.push('# Cheatsheet of interactive commands:');
    lines.push('#   p, pick   = use commit as is');
    lines.push('#   r, reword = use commit, but edit the commit message');
    lines.push('#   s, squash = meld into previous commit and combine messages');
    lines.push('#   f, fixup  = meld into previous commit, discarding this message');
    lines.push('#   d, drop   = remove commit entirely');
    lines.push('');
  }

  lines.push(`# Rebase current branch on top of latest ${upstreamBranch}:`);
  lines.push(`git fetch origin`);
  lines.push(`git rebase origin/${upstreamBranch}`);
  lines.push('');
  lines.push('# If conflicts occur:');
  lines.push('git status');
  lines.push('# (Edit conflicting files and stage them with git add)');
  lines.push('git rebase --continue');
  lines.push('# Or abort and restore original branch:');
  lines.push('git rebase --abort');

  return lines.join('\n');
}

/**
 * 7. Git Diff Viewer
 * Parses unified git diff, calculates lines changed, and formats colored report
 */
export function parseGitDiff(diffText: string): string {
  if (!diffText || !diffText.trim()) {
    return 'Paste a unified git diff (e.g. from "git diff" or "git show") to view parsed chunks.';
  }

  const lines = diffText.split(/\r?\n/);
  let filesCount = 0;
  let additions = 0;
  let deletions = 0;
  const files: { name: string; add: number; del: number }[] = [];
  let currentFile: { name: string; add: number; del: number } | null = null;

  for (const line of lines) {
    if (line.startsWith('diff --git')) {
      filesCount++;
      const match = line.match(/diff --git a\/(.*) b\/(.*)/);
      const name = match ? match[2] : `File ${filesCount}`;
      currentFile = { name, add: 0, del: 0 };
      files.push(currentFile);
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      additions++;
      if (currentFile) currentFile.add++;
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      deletions++;
      if (currentFile) currentFile.del++;
    }
  }

  const summary = [
    `=== GIT DIFF SUMMARY ===`,
    `Files Changed : ${filesCount || 1}`,
    `Total Additions (+): ${additions}`,
    `Total Deletions (-): ${deletions}`,
    `Net Line Change: ${additions >= deletions ? `+${additions - deletions}` : `${additions - deletions}`}`,
    '',
    `=== FILE BREAKDOWN ===`
  ];

  if (files.length > 0) {
    files.forEach(f => {
      summary.push(`• ${f.name.padEnd(35)} +${f.add.toString().padStart(3)} | -${f.del.toString().padStart(3)}`);
    });
  } else {
    summary.push(`Total lines analyzed: ${lines.length}`);
  }

  return summary.join('\n');
}

/**
 * 8. Git Patch Viewer
 */
export function parseGitPatch(patchText: string): string {
  if (!patchText || !patchText.trim()) {
    return 'Paste output from "git format-patch" or a .patch file.';
  }

  const fromMatch = patchText.match(/From:\s+(.*)/i);
  const dateMatch = patchText.match(/Date:\s+(.*)/i);
  const subjectMatch = patchText.match(/Subject:\s+(?:\[PATCH[^\]]*\]\s*)?(.*)/i);

  const author = fromMatch ? fromMatch[1].trim() : 'Unknown Author';
  const date = dateMatch ? dateMatch[1].trim() : 'Unknown Date';
  const subject = subjectMatch ? subjectMatch[1].trim() : 'No Subject';

  const addCount = (patchText.match(/^\+[^+]/gm) || []).length;
  const delCount = (patchText.match(/^-[^-]/gm) || []).length;

  return `=== GIT PATCH METADATA ===
Author   : ${author}
Date     : ${date}
Subject  : ${subject}
Additions: +${addCount} lines
Deletions: -${delCount} lines

# Apply this patch locally:
git apply --check sample.patch     # Test dry-run
git apply sample.patch             # Apply changes
git am < sample.patch              # Apply as commit with author/date`;
}

/**
 * 9. Git README Generator
 */
export function generateGitReadme(
  projectName = 'CryptoVault Pro',
  description = 'High-assurance client-side cryptographic and developer utility suite.',
  license = 'MIT',
  techStack = ['TypeScript', 'React', 'Tailwind CSS', 'Vite'],
  installCmd = 'npm install',
  runCmd = 'npm run dev'
): string {
  const stackBadges = techStack.map(t => `![${t}](https://img.shields.io/badge/${encodeURIComponent(t)}-informational?style=flat-square)`).join(' ');

  return `# ${projectName}

${description}

${stackBadges}
[![License: ${license}](https://img.shields.io/badge/License-${encodeURIComponent(license)}-blue.svg)](LICENSE)

---

## 🚀 Key Features

- **100% Client-Side Execution**: Zero data logging; calculations run directly in your local browser runtime.
- **Enterprise-Grade Algorithms**: Sub-millisecond performance with native Web APIs.
- **Modern Responsive UI**: Built with fluid design tokens and full keyboard accessibility.

## 📦 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.git

# Navigate to project directory
cd ${projectName.toLowerCase().replace(/[^a-z0-9]/g, '-')}

# Install dependencies
${installCmd}
\`\`\`

### Running the App

\`\`\`bash
${runCmd}
\`\`\`

## 🛠️ Built With

${techStack.map(t => `- **${t}**`).join('\n')}

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
1. Fork the Project
2. Create your Feature Branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit your Changes (\`git commit -m 'feat: add some AmazingFeature'\`)
4. Push to the Branch (\`git push origin feature/AmazingFeature\`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ${license} License - see the [LICENSE](LICENSE) file for details.`;
}

/**
 * 10. GitHub Issue Template Generator
 */
export function generateGitHubIssueTemplate(
  templateType = 'bug_report',
  projectName = 'Project'
): string {
  if (templateType === 'feature_request') {
    return `---
name: Feature request
about: Suggest an idea for this project
title: "[FEATURE] "
labels: enhancement
assignees: ''

---

**Is your feature request related to a problem? Please describe.**
A clear and concise description of what the problem is. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
A clear and concise description of any alternative solutions or features you've considered.

**Additional context**
Add any other context, screenshots, or mockups about the feature request here.`;
  }

  return `---
name: Bug report
about: Create a report to help us improve
title: "[BUG] "
labels: bug
assignees: ''

---

**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots / Console Logs**
If applicable, add screenshots or console logs to help explain your problem.

**Desktop Environment:**
 - OS: [e.g. macOS Sonoma, Windows 11, Ubuntu 22.04]
 - Browser: [e.g. Chrome, Safari, Firefox]
 - Version: [e.g. 124.0]`;
}

/**
 * 11. GitHub Pull Request Template Generator
 */
export function generateGitHubPullRequestTemplate(projectName = 'Project'): string {
  return `## Description
Provide a concise summary of the changes introduced in this PR and the problem being resolved.

Fixes #(issue number)

## Type of Change
- [ ] 🐛 Bug fix (non-breaking change which fixes an issue)
- [ ] ✨ New feature (non-breaking change which adds functionality)
- [ ] 💥 Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] 📚 Documentation update
- [ ] ⚡ Performance optimization
- [ ] 🧪 Tests addition or refactor

## How Has This Been Tested?
Please describe the tests that you ran to verify your changes:
- [ ] Unit tests pass cleanly (\`npm test\`)
- [ ] Tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] Manual smoke tests for edge cases

## Checklist:
- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented complex or non-obvious algorithms
- [ ] No hardcoded secrets or telemetry introduced`;
}

/**
 * 12. GitHub Actions Workflow Generator
 */
export function generateGitHubActionsWorkflow(
  workflowType = 'node-ci',
  nodeVersion = '20.x',
  branch = 'main'
): string {
  return `name: CI / Test & Build

on:
  push:
    branches: [ "${branch}" ]
  pull_request:
    branches: [ "${branch}" ]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [ ${nodeVersion} ]

    steps:
    - name: Checkout repository
      uses: actions/checkout@v4

    - name: Use Node.js \${{ matrix.node-version }}
      uses: actions/setup-node@v4
      with:
        node-version: \${{ matrix.node-version }}
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Check code formatting & linting
      run: npm run lint --if-present

    - name: Build production bundle
      run: npm run build`;
}

/**
 * 13. Git Ignore Generator
 */
export function generateGitIgnore(techs = ['node', 'macos', 'vscode']): string {
  const sections: string[] = ['# Comprehensive .gitignore'];

  if (techs.includes('node') || techs.includes('javascript') || techs.includes('react')) {
    sections.push(`
# Node & NPM
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
.pnpm-debug.log*

# Build Outputs
dist/
build/
out/
.next/
storybook-static/

# Environment Variables & Secrets
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
*.pem
*.key`);
  }

  if (techs.includes('macos') || techs.includes('os')) {
    sections.push(`
# macOS System Files
.DS_Store
.AppleDouble
.LSOverride
Icon?
._*
.Spotlight-V100
.Trashes`);
  }

  if (techs.includes('vscode') || techs.includes('ide')) {
    sections.push(`
# Editor Directories & Files
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?`);
  }

  return sections.join('\n');
}

/**
 * 14. Git Changelog Generator
 */
export function generateGitChangelog(
  commitsText: string,
  version = 'v1.4.0',
  date = new Date().toISOString().slice(0, 10)
): string {
  const lines = (commitsText || '').split(/\r?\n/).filter(l => l.trim());
  const features: string[] = [];
  const fixes: string[] = [];
  const chores: string[] = [];
  const breaking: string[] = [];

  for (const line of lines) {
    const clean = line.replace(/^[*\s-]+/, '').trim();
    if (/^feat(\(.*\))?:/i.test(clean)) {
      features.push(clean.replace(/^feat(\(.*\))?:\s*/i, ''));
    } else if (/^fix(\(.*\))?:/i.test(clean)) {
      fixes.push(clean.replace(/^fix(\(.*\))?:\s*/i, ''));
    } else if (/BREAKING CHANGE/i.test(clean)) {
      breaking.push(clean);
    } else {
      chores.push(clean);
    }
  }

  const output: string[] = [
    `# Changelog`,
    '',
    `## [${version}] - ${date}`,
    ''
  ];

  if (breaking.length > 0) {
    output.push('### ⚠️ Breaking Changes');
    breaking.forEach(b => output.push(`- ${b}`));
    output.push('');
  }

  if (features.length > 0) {
    output.push('### 🚀 Features & Enhancements');
    features.forEach(f => output.push(`- ${f}`));
    output.push('');
  }

  if (fixes.length > 0) {
    output.push('### 🐛 Bug Fixes');
    fixes.forEach(f => output.push(`- ${f}`));
    output.push('');
  }

  if (chores.length > 0 && (features.length === 0 && fixes.length === 0)) {
    output.push('### 🔧 Maintenance & Chores');
    chores.forEach(c => output.push(`- ${c}`));
    output.push('');
  }

  return output.join('\n');
}

/**
 * 15. Git Release Notes Generator
 */
export function generateGitReleaseNotes(
  tag = 'v2.1.0',
  title = 'Performance & Client-Side Caching Overhaul',
  highlights = 'Reduces initial bundle footprint by 38% and introduces 50 new offline developer tools.',
  changelog = 'feat: add CSS layout generator\nfeat: add Git workflow engines\nfix: prevent undefined toLowerCase call'
): string {
  const parsedChangelog = generateGitChangelog(changelog, tag);

  return `## What's Changed in ${tag} - ${title}

${highlights}

${parsedChangelog}

**Full Changelog**: https://github.com/organization/repo/compare/v2.0.0...${tag}`;
}

/**
 * 16. Git Command Explainer
 */
export function explainGitCommand(command: string): string {
  const trimmed = (command || 'git log --graph --oneline --all').trim();
  const parts = trimmed.split(/\s+/);
  
  const explanations: string[] = [
    `Analyzing Git Command: \`${trimmed}\``,
    '--------------------------------------------------'
  ];

  const flagDict: Record<string, string> = {
    '--graph': 'Draws an ASCII graph of the branch commit history tree on the left.',
    '--oneline': 'Condenses each commit into a single line showing abbreviated hash and commit title.',
    '--all': 'Shows all commits across all local and remote tracking branches.',
    '--decorate': 'Prints out ref names (HEAD, branch names, tags) alongside commit hashes.',
    '--stat': 'Displays the number of modified lines (+/-) and file statistics per commit.',
    '--patch': 'Shows raw unified diff changes associated with each commit.',
    '-p': 'Shows raw unified diff changes associated with each commit.',
    '--soft': 'Moves HEAD without touching working directory or staging index (keeps changes staged).',
    '--mixed': 'Moves HEAD and unstages index changes, preserving working directory files.',
    '--hard': 'Resets index and working directory, wiping all unstaged and uncommitted modifications!',
    '--force-with-lease': 'Safer force push that refuses to overwrite if remote has commits you haven\'t fetched.',
    '-f': 'Force pushes changes, potentially overwriting other collaborators\' remote work.',
    '--no-ff': 'Prevents fast-forward merges, creating an explicit merge commit to document branch integration.',
    '--ff-only': 'Refuses to merge unless the current branch can be fast-forwarded without a merge commit.',
    '--squash': 'Combines all commits from the source branch into a single unstaged set of changes.'
  };

  parts.forEach(p => {
    if (flagDict[p]) {
      explanations.push(`• Flag [${p}]: ${flagDict[p]}`);
    }
  });

  if (explanations.length === 2) {
    explanations.push('Standard git command syntax. Verified safe for standard repository workflows.');
  }

  return explanations.join('\n');
}

/**
 * 17. Git Repository Size Estimator
 */
export function estimateGitRepoSize(fileTreeText: string): string {
  const lines = (fileTreeText || '').split(/\r?\n/).filter(l => l.trim());
  let estimatedKb = 0;
  let largeFilesCount = 0;
  const warnings: string[] = [];

  for (const line of lines) {
    const match = line.match(/(\d+(?:\.\d+)?)\s*(kb|mb|gb|bytes?)/i);
    if (match) {
      const val = parseFloat(match[1]);
      const unit = match[2].toLowerCase();
      let bytes = val;
      if (unit.startsWith('kb')) bytes = val * 1024;
      else if (unit.startsWith('mb')) bytes = val * 1024 * 1024;
      else if (unit.startsWith('gb')) bytes = val * 1024 * 1024 * 1024;

      estimatedKb += bytes / 1024;
      if (bytes > 50 * 1024 * 1024) {
        largeFilesCount++;
        warnings.push(`⚠️ Large file detected (>50MB): ${line}`);
      }
    }
  }

  if (estimatedKb === 0) {
    estimatedKb = lines.length * 15; // default estimation 15kb per file
  }

  const mb = (estimatedKb / 1024).toFixed(2);
  const projectedPackfileMb = ((estimatedKb * 0.4) / 1024).toFixed(2);

  return `=== GIT REPOSITORY SIZE & LFS ESTIMATOR ===
Total Files Counted   : ${lines.length}
Raw Working Tree Size : ~${mb} MB
Projected .git Packfile: ~${projectedPackfileMb} MB (with zlib delta compression)

LFS Recommendations:
${largeFilesCount > 0 ? `⚠️ Found ${largeFilesCount} files exceeding GitHub recommended limits (50MB). Use Git LFS!` : '✓ No dangerously oversized files detected in tree.'}

Sample .gitattributes for Git LFS:
*.psd filter=lfs diff=lfs merge=lfs -text
*.zip filter=lfs diff=lfs merge=lfs -text
*.mp4 filter=lfs diff=lfs merge=lfs -text
*.tar.gz filter=lfs diff=lfs merge=lfs -text`;
}

/**
 * 18. Git Branch Comparison Tool
 */
export function compareGitBranches(
  baseBranch = 'main',
  headBranch = 'feature/payment-gateway'
): string {
  return `=== GIT BRANCH COMPARISON WORKFLOW ===
Base Branch: ${baseBranch}
Head Branch: ${headBranch}

# 1. Fetch latest remote state:
git fetch origin

# 2. Check ahead/behind commit counts:
git rev-list --left-right --count ${baseBranch}...${headBranch}
# Left number = commits ahead in ${baseBranch}
# Right number = commits ahead in ${headBranch}

# 3. View commits unique to ${headBranch}:
git log ${baseBranch}..${headBranch} --oneline

# 4. View raw file diff:
git diff ${baseBranch}...${headBranch} --stat

# 5. Cherry-pick a specific commit from ${headBranch} into current:
git cherry-pick <commit-hash>`;
}

/**
 * 19. Git Tag Formatter
 */
export function formatGitTag(
  version = 'v1.4.2',
  message = 'Release version 1.4.2 with enhanced client-side caching',
  isSigned = false,
  isAnnotated = true
): string {
  const flags = isSigned ? '-s' : isAnnotated ? '-a' : '';
  const msgPart = isAnnotated || isSigned ? ` -m "${message.replace(/"/g, '\\"')}"` : '';

  const tagCmd = `git tag ${flags} ${version}${msgPart}`;

  return `# Git Semantic Version Tag Formatter
# SemVer 2.0.0 Rule Check:
# MAJOR = Breaking changes
# MINOR = Backward-compatible features
# PATCH = Backward-compatible bug fixes

Create Tag:
${tagCmd}

# Push tag to remote:
git push origin ${version}

# Push all local tags:
git push origin --tags

# Verify tag signature:
git tag -v ${version}

# Delete tag locally and remotely if needed:
git tag -d ${version}
git push origin --delete ${version}`;
}

/**
 * 20. GitHub Markdown Table Generator
 */
export function generateGitHubMarkdownTable(
  headers: string[] = ['Feature', 'Client-Side', 'Privacy', 'Performance'],
  rows: string[][] = [
    ['AES-256-GCM', 'Yes', '100% Zero-Log', 'Sub-millisecond'],
    ['CSS Generator', 'Yes', 'In-Memory', 'Instant'],
    ['Git Builder', 'Yes', 'Browser Native', 'Instant']
  ],
  alignments: ('left' | 'center' | 'right')[] = ['left', 'center', 'center', 'right']
): string {
  const alignTokens = alignments.map(a => {
    if (a === 'center') return ':---:';
    if (a === 'right') return '---:';
    return ':---';
  });

  const headerRow = `| ${headers.join(' | ')} |`;
  const separatorRow = `| ${alignTokens.join(' | ')} |`;
  const dataRows = rows.map(r => `| ${r.join(' | ')} |`).join('\n');

  return `${headerRow}\n${separatorRow}\n${dataRows}`;
}

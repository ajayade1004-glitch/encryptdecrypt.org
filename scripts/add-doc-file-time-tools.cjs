const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const docTools = [
  { name: 'README Generator', slug: 'readme-generator', shortDesc: 'Generate professional, comprehensive GitHub and open-source README.md files instantly.' },
  { name: 'API Documentation Generator', slug: 'api-documentation-generator', shortDesc: 'Generate clean markdown API endpoint reference documentation with request/response schemas.' },
  { name: 'Changelog Generator', slug: 'changelog-generator', shortDesc: 'Format structured Keep a Changelog markdown files adhering to Semantic Versioning.' },
  { name: 'Release Notes Generator', slug: 'release-notes-generator', shortDesc: 'Generate production software release notes with feature highlights and upgrade commands.' },
  { name: 'Markdown Table Generator', slug: 'markdown-table-generator', shortDesc: 'Convert CSV or delimited raw rows into clean GitHub-flavored markdown tables.' },
  { name: 'Markdown Table Formatter', slug: 'markdown-table-formatter', shortDesc: 'Auto-align and pad uneven markdown table pipes and column boundaries.' },
  { name: 'Markdown TOC Generator', slug: 'markdown-toc-generator', shortDesc: 'Generate hierarchical table of contents with nested markdown anchors from headings.' },
  { name: 'Markdown Link Checker', slug: 'markdown-link-checker', shortDesc: 'Audit relative, absolute, and anchor link targets in markdown documentation.' },
  { name: 'Markdown Image Link Checker', slug: 'markdown-image-link-checker', shortDesc: 'Validate image embed syntax, file formats, and accessibility alt text in markdown.' },
  { name: 'JSDoc Generator', slug: 'jsdoc-generator', shortDesc: 'Generate standard JSDoc comment blocks for TypeScript and JavaScript functions.' },
  { name: 'TypeDoc Comment Generator', slug: 'typedoc-comment-generator', shortDesc: 'Generate rich TypeDoc documentation tags and remarks for TypeScript interfaces.' },
  { name: 'License File Generator', slug: 'license-file-generator', shortDesc: 'Generate standardized open-source software license files (MIT, Apache 2.0, BSD).' },
  { name: 'CONTRIBUTING.md Generator', slug: 'contributing-md-generator', shortDesc: 'Create clear open-source project contribution guidelines and PR workflows.' },
  { name: 'SECURITY.md Generator', slug: 'security-md-generator', shortDesc: 'Generate vulnerability disclosure policies and private reporting guidelines.' },
  { name: 'CODEOWNERS Generator', slug: 'codeowners-generator', shortDesc: 'Format GitHub CODEOWNERS files for directory and team PR review routing.' },
  { name: 'Issue Template Generator', slug: 'issue-template-generator', shortDesc: 'Generate structured GitHub Issue templates with reproduction steps and environment specs.' },
  { name: 'Pull Request Template Generator', slug: 'pull-request-template-generator', shortDesc: 'Create standardized GitHub Pull Request descriptions and QA checklists.' },
  { name: 'Markdown Frontmatter Generator', slug: 'markdown-frontmatter-generator', shortDesc: 'Format YAML frontmatter headers for static site generators and markdown blogs.' },
  { name: 'Markdown Heading Numbering Tool', slug: 'markdown-heading-numbering-tool', shortDesc: 'Automatically add hierarchical decimal numbers (1.1, 1.2) to markdown headings.' },
  { name: 'Documentation Word Count Analyzer', slug: 'documentation-word-count-analyzer', shortDesc: 'Analyze documentation word counts, reading duration, and speaking estimates.' }
];

const fileBinaryTools = [
  { name: 'File Extension Extractor', slug: 'file-extension-extractor', shortDesc: 'Extract and parse primary and compound file extensions from single and batch filenames.' },
  { name: 'Filename Cleaner', slug: 'filename-cleaner', shortDesc: 'Sanitize dirty filenames by removing illegal characters, spaces, and formatting into safe slugs.' },
  { name: 'File Path Normalizer', slug: 'file-path-normalizer', shortDesc: 'Normalize cross-platform POSIX and Windows filesystem paths and resolve dot segments.' },
  { name: 'Batch File Renaming Planner', slug: 'batch-file-renaming-planner', shortDesc: 'Plan sequential batch renaming patterns and generate executable shell rename scripts.' },
  { name: 'MIME Type Detector', slug: 'mime-type-detector', shortDesc: 'Lookup official IANA MIME types and HTTP Content-Type headers from file extensions.' },
  { name: 'File Magic Number Viewer', slug: 'file-magic-number-viewer', shortDesc: 'Inspect file signature magic hex bytes for true format detection without extensions.' },
  { name: 'File Header Inspector', slug: 'file-header-inspector', shortDesc: 'Inspect structured binary headers, image chunks, and compression parameters.' },
  { name: 'Binary Offset Calculator', slug: 'binary-offset-calculator', shortDesc: 'Translate decimal byte offsets into hexadecimal memory addresses and disk sectors.' },
  { name: 'File Size Difference Calculator', slug: 'file-size-difference-calculator', shortDesc: 'Calculate compression ratio, space reduction percentage, and byte differentials.' },
  { name: 'Folder Size Estimator', slug: 'folder-size-estimator', shortDesc: 'Estimate total directory data volume, cluster slack space, and inode requirements.' },
  { name: 'Archive Size Estimator', slug: 'archive-size-estimator', shortDesc: 'Compare estimated compressed sizes across ZIP, GZIP, BZIP2, 7Z, and Zstandard.' },
  { name: 'File Name Pattern Generator', slug: 'file-name-pattern-generator', shortDesc: 'Generate standardized enterprise backup, log, and semantic version file naming formats.' },
  { name: 'File Extension Converter Guide', slug: 'file-extension-converter-guide', shortDesc: 'View browser compatibility and CLI conversion commands across modern media formats.' },
  { name: 'File Signature Comparison Tool', slug: 'file-signature-comparison-tool', shortDesc: 'Compare uploaded byte signatures against standard magic numbers to verify file integrity.' },
  { name: 'Binary String Viewer', slug: 'binary-string-viewer', shortDesc: 'Convert plain text and hexadecimal strings into 8-bit binary bit streams.' },
  { name: 'Hexadecimal File Inspector', slug: 'hexadecimal-file-inspector', shortDesc: 'Render formatted 16-column hexadecimal byte dumps with side-by-side ASCII view.' },
  { name: 'File Metadata Summary Tool', slug: 'file-metadata-summary-tool', shortDesc: 'Inspect file properties, cryptographic checksums, permissions, and timestamps.' },
  { name: 'File Size Distribution Analyzer', slug: 'file-size-distribution-analyzer', shortDesc: 'Analyze asset size distributions and web performance budget compliance.' },
  { name: 'File Hash Comparison Tool', slug: 'file-hash-comparison-tool', shortDesc: 'Compare MD5, SHA-1, and SHA-256 hashes bit-for-bit to verify file integrity.' },
  { name: 'File Content Type Inspector', slug: 'file-content-type-inspector', shortDesc: 'Verify HTTP Content-Type headers, magic numbers, and anti-MIME-confusion security.' }
];

const timeTools = [
  { name: 'Pomodoro Timer', slug: 'pomodoro-timer', shortDesc: 'Plan structured Pomodoro focus cycles, short breaks, and long rest intervals.' },
  { name: 'Countdown Timer', slug: 'countdown-timer', shortDesc: 'Calculate precise real-time countdown intervals and elapsed durations to any target date.' },
  { name: 'Meeting Time Planner', slug: 'meeting-time-planner', shortDesc: 'Coordinate international multi-timezone meeting times to find optimal overlap windows.' },
  { name: 'Work Hours Calculator', slug: 'work-hours-calculator', shortDesc: 'Calculate net daily billable working hours after deducting unpaid lunch and breaks.' },
  { name: 'Overtime Calculator', slug: 'overtime-calculator', shortDesc: 'Calculate overtime hours, 1.5x time-and-a-half multipliers, and gross payroll earnings.' },
  { name: 'Break Time Calculator', slug: 'break-time-calculator', shortDesc: 'Calculate statutory paid rest breaks and lunch periods for full-time work shifts.' },
  { name: 'Deadline Calculator', slug: 'deadline-calculator', shortDesc: 'Compute project delivery deadlines by adding business days excluding weekends.' },
  { name: 'Sprint Duration Calculator', slug: 'sprint-duration-calculator', shortDesc: 'Plan Agile Scrum 2-week sprint schedules, daily standups, and story point capacity.' },
  { name: 'Project Duration Calculator', slug: 'project-duration-calculator', shortDesc: 'Calculate critical path project phases, duration weeks, and contingency buffers.' },
  { name: 'Recurring Date Calculator', slug: 'recurring-date-calculator', shortDesc: 'Project future recurring monthly, bi-weekly, or annual milestone dates.' },
  { name: 'ISO Week Planner', slug: 'iso-week-planner', shortDesc: 'Calculate ISO 8601 week numbers, day-of-year indices, and weekly engineering goals.' },
  { name: 'Batch Timestamp Converter', slug: 'batch-timestamp-converter', shortDesc: 'Convert batch Unix epoch timestamps in seconds and milliseconds to ISO UTC dates.' },
  { name: 'Duration Splitter', slug: 'duration-splitter', shortDesc: 'Split total time spans into equal chronological segments and blocks.' },
  { name: 'Meeting Agenda Timer', slug: 'meeting-agenda-timer', shortDesc: 'Plan timed agenda item durations for executive meetings and technical reviews.' },
  { name: 'Time Blocking Planner', slug: 'time-blocking-planner', shortDesc: 'Structure daily deep work focus blocks, communication windows, and shutdown routines.' },
  { name: 'Weekly Work Schedule Generator', slug: 'weekly-work-schedule-generator', shortDesc: 'Generate standard 40-hour weekly shift rosters with day-by-day work hours.' },
  { name: 'Daily Task Time Estimator', slug: 'daily-task-time-estimator', shortDesc: 'Estimate realistic task completion durations including focus and interruption buffers.' },
  { name: 'Shift Rotation Planner', slug: 'shift-rotation-planner', shortDesc: 'Generate 24/7 continuous 3-shift rotation schedules for support and operations teams.' },
  { name: 'Time Difference Across Cities', slug: 'time-difference-across-cities', shortDesc: 'View current synchronized world clocks across global tech hubs and financial centers.' },
  { name: 'Working Hours Distribution Calculator', slug: 'working-hours-distribution-calculator', shortDesc: 'Analyze workday time distribution across coding, reviews, syncs, and admin.' }
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
    metaTitle: `${tool.name} - Free Online Tool`,
    metaDescription: `${tool.shortDesc} Fast, 100% client-side, zero server logging.`,
    primaryKeyword: tool.name.toLowerCase(),
    secondaryKeywords: [
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      `${categoryName.toLowerCase()} tool`
    ],
    lsiKeywords: ['developer tools', 'client-side', 'privacy focused', 'instant calculation'],
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

docTools.forEach(t => upsert(t, 'documentation-writing-tools', 'Documentation & Writing Tools'));
fileBinaryTools.forEach(t => upsert(t, 'file-binary-tools', 'File & Binary Tools'));
timeTools.forEach(t => upsert(t, 'time-productivity-tools', 'Time & Productivity Tools'));

// Link related tools
tools.forEach(t => {
  if (t.category === 'documentation-writing-tools') {
    t.related = docTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'file-binary-tools') {
    t.related = fileBinaryTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'time-productivity-tools') {
    t.related = timeTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully populated 60 tools across 3 categories. Total tools now: ${tools.length}`);

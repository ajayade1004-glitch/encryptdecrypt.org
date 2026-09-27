const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const textTools = [
  { name: 'Text Readability Analyzer', slug: 'text-readability-analyzer', shortDesc: 'Calculate Flesch Reading Ease, Flesch-Kincaid grade level, and reading difficulty.' },
  { name: 'Paragraph Counter', slug: 'paragraph-counter', shortDesc: 'Count paragraphs, line breaks, word density, and average words per paragraph.' },
  { name: 'Syllable Counter', slug: 'syllable-counter', shortDesc: 'Count syllables in words and sentences for phonetic and readability analysis.' },
  { name: 'Sentence Length Analyzer', slug: 'sentence-length-analyzer', shortDesc: 'Analyze sentence length variation, pacing, and identify over-length sentences.' },
  { name: 'Passive Voice Finder', slug: 'passive-voice-finder', shortDesc: 'Detect passive voice sentence structures and get active voice rewrite suggestions.' },
  { name: 'Repeated Word Finder', slug: 'repeated-word-finder', shortDesc: 'Identify accidental consecutive duplicate words in writing and copy.' },
  { name: 'Common Phrase Finder', slug: 'common-phrase-finder', shortDesc: 'Highlight clichés and wordy phrases and replace them with concise wording.' },
  { name: 'Text Similarity Checker', slug: 'text-similarity-checker', shortDesc: 'Compare two text strings using Jaccard index and Cosine word similarity.' },
  { name: 'Text Diff Summary', slug: 'text-diff-summary', shortDesc: 'Summarize added, removed, and modified word revisions between drafts.' },
  { name: 'Unicode Character Inspector', slug: 'unicode-character-inspector', shortDesc: 'Inspect Unicode codepoints (U+XXXX), UTF-8 bytes, and decimal values.' },
  { name: 'Unicode Normalization Tool', slug: 'unicode-normalization-tool', shortDesc: 'Normalize strings across NFC, NFD, NFKC, and NFKD Unicode standards.' },
  { name: 'Emoji Counter', slug: 'emoji-counter', shortDesc: 'Count total and unique emojis and extract Unicode glyph codepoints.' },
  { name: 'Emoji Remover', slug: 'emoji-remover', shortDesc: 'Strip all emoji symbols and pictographs from text for clean data pipelines.' },
  { name: 'Smart Quote Converter', slug: 'smart-quote-converter', shortDesc: 'Convert plain ASCII quotes into typographically correct curly smart quotes.' },
  { name: 'Straight Quote Converter', slug: 'straight-quote-converter', shortDesc: 'Convert curly smart quotes into programming-safe straight ASCII quotes.' },
  { name: 'Typography Character Converter', slug: 'typography-character-converter', shortDesc: 'Convert dashes to em-dashes, dots to ellipses, and symbols to copyright/trademark.' },
  { name: 'Text to Speech Duration Estimator', slug: 'text-to-speech-duration-estimator', shortDesc: 'Estimate spoken audio playback duration in minutes and seconds across voice paces.' },
  { name: 'Reading Grade Estimator', slug: 'reading-grade-estimator', shortDesc: 'Calculate Coleman-Liau, Automated Readability Index (ARI), and Gunning Fog grades.' },
  { name: 'Text Line Length Formatter', slug: 'text-line-length-formatter', shortDesc: 'Wrap text blocks at fixed column character widths for clean terminal displays.' },
  { name: 'Paragraph Rewriter Template', slug: 'paragraph-rewriter-template', shortDesc: 'Generate action, technical, and concise copywriting angles from source text.' },
  { name: 'Alphabetical Word Sorter', slug: 'alphabetical-word-sorter', shortDesc: 'Sort word lists alphabetically in ascending (A-Z) and descending (Z-A) order.' },
  { name: 'Word Frequency Chart Generator', slug: 'word-frequency-chart-generator', shortDesc: 'Generate text-based ASCII frequency histograms of top repeated keywords.' },
  { name: 'Sentence Case Formatter', slug: 'sentence-case-formatter', shortDesc: 'Convert uppercase or messy text into standard sentence case capitalization.' },
  { name: 'Text Encoding Inspector', slug: 'text-encoding-inspector', shortDesc: 'Inspect string character lengths, UTF-8/UTF-16 byte sizes, and ASCII compliance.' },
  { name: 'Multilingual Character Counter', slug: 'multilingual-character-counter', shortDesc: 'Count characters partitioned by Latin, CJK, Devanagari, and numeric scripts.' }
];

const socialTools = [
  { name: 'Social Media Caption Length Checker', slug: 'social-media-caption-length-checker', shortDesc: 'Audit post character limits across X/Twitter, Instagram, LinkedIn, and Facebook.' },
  { name: 'Instagram Bio Character Counter', slug: 'instagram-bio-character-counter', shortDesc: 'Count characters and lines against Instagram 150-character bio limits.' },
  { name: 'YouTube Title Length Checker', slug: 'youtube-title-length-checker', shortDesc: 'Optimize YouTube video titles for desktop and mobile search snippet visibility.' },
  { name: 'YouTube Description Formatter', slug: 'youtube-description-formatter', shortDesc: 'Format structured YouTube descriptions with video timestamps and links.' },
  { name: 'Hashtag Organizer', slug: 'hashtag-organizer', shortDesc: 'Clean and format hashtag lists into space-separated, comma-separated, or vertical blocks.' },
  { name: 'Hashtag Deduplicator', slug: 'hashtag-deduplicator', shortDesc: 'Remove duplicate hashtags while preserving tag order and lowercase uniformity.' },
  { name: 'Social Media Calendar Generator', slug: 'social-media-calendar-generator', shortDesc: 'Generate structured weekly posting schedules with formats and theme topics.' },
  { name: 'Post Scheduling Calendar Template', slug: 'post-scheduling-calendar-template', shortDesc: 'Create an editorial social media content matrix with publish times and statuses.' },
  { name: 'Open Graph Image Size Calculator', slug: 'open-graph-image-size-calculator', shortDesc: 'Calculate 1200x630px Open Graph card dimensions and mobile safe zones.' },
  { name: 'Social Share Preview Generator', slug: 'social-share-preview-generator', shortDesc: 'Generate Open Graph and Twitter Card HTML meta tags for rich social sharing.' },
  { name: 'Meta Description Preview Tool', slug: 'meta-description-preview-tool', shortDesc: 'Preview and validate 155-character search engine snippets on desktop and mobile.' },
  { name: 'Video Aspect Ratio Calculator', slug: 'video-aspect-ratio-calculator', shortDesc: 'Calculate 16:9 landscape, 9:16 vertical reels, and 1:1 square video dimensions.' },
  { name: 'Thumbnail Size Calculator', slug: 'thumbnail-size-calculator', shortDesc: 'Reference thumbnail image specifications for YouTube, Podcasts, and Twitch.' },
  { name: 'Social Media Image Crop Planner', slug: 'social-media-image-crop-planner', shortDesc: 'Plan multi-platform image crops from a single 4K master asset.' },
  { name: 'Content Repurposing Planner', slug: 'content-repurposing-planner', shortDesc: 'Turn 1 long-form article into 6 derivative social assets with a content multiplier framework.' },
  { name: 'Content Brief Template Generator', slug: 'content-brief-template-generator', shortDesc: 'Generate comprehensive SEO content briefs with headings, keywords, and search intent.' },
  { name: 'Blog Post Outline Builder', slug: 'blog-post-outline-builder', shortDesc: 'Build structured blog outlines with hooks, problem statements, and key takeaways.' },
  { name: 'Blog Introduction Checklist', slug: 'blog-introduction-checklist', shortDesc: 'Audit blog post opening paragraphs for hooks, keywords, and reader promises.' },
  { name: 'Newsletter Subject Length Checker', slug: 'newsletter-subject-length-checker', shortDesc: 'Check email subject line lengths for mobile Gmail and desktop inbox visibility.' },
  { name: 'Content Publishing Checklist Generator', slug: 'content-publishing-checklist-generator', shortDesc: 'Pre-flight publishing QA checklist covering meta tags, alt text, and canonical links.' }
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

textTools.forEach(t => upsert(t, 'text-language-tools', 'Text & Language Tools'));
socialTools.forEach(t => upsert(t, 'web-content-social-tools', 'Web Content & Social Media Tools'));

// Link related tools
tools.forEach(t => {
  if (t.category === 'text-language-tools') {
    t.related = textTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  } else if (t.category === 'web-content-social-tools') {
    t.related = socialTools.filter(x => x.slug !== t.slug).slice(0, 4).map(x => x.slug);
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully populated 45 tools across 2 categories. Total tools now: ${tools.length}`);

const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const existingSlugs = new Set(tools.map(t => t.slug));

const newTools = [
  // --- 📐 CAD / Engineering Reference ---
  {
    id: 'gear-ratio-calculator-pro',
    name: 'Gear Ratio & Output RPM Calculator',
    slug: 'gear-ratio-calculator-pro',
    category: 'cad-engineering',
    categoryName: 'CAD & Engineering Reference',
    shortDesc: 'Calculate driver-to-driven gear ratios, output RPM speeds, and mechanical torque multipliers.',
    metaTitle: 'Gear Ratio & Output RPM Calculator Online - Mechanical Engineering',
    metaDescription: 'Calculate gear ratios, driver vs driven RPM speeds, and torque multiplication factors.',
    primaryKeyword: 'gear ratio calculator online',
    secondaryKeywords: ['gear ratio output rpm calculator', 'torque multiplier gear ratio solver', 'mechanical gear speed calculator'],
    lsiKeywords: ['teeth driver teeth driven', 'rpm output speed', 'torque multiplier'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Wrench',
    related: ['beam-bending-stress-calculator-pro', 'uptime-downtime-calculator-pro'],
    popular: true
  },
  {
    id: 'beam-bending-stress-calculator-pro',
    name: 'Beam Bending Stress Calculator (Flexural Formula)',
    slug: 'beam-bending-stress-calculator-pro',
    category: 'cad-engineering',
    categoryName: 'CAD & Engineering Reference',
    shortDesc: 'Calculate beam bending stress (σ = M·y / I) in MPa and evaluate structural yield safety.',
    metaTitle: 'Beam Bending Stress Calculator Online - Flexural Stress',
    metaDescription: 'Calculate flexural beam bending stress in MPa using bending moment, neutral axis, and moment of inertia.',
    primaryKeyword: 'beam bending stress calculator online',
    secondaryKeywords: ['flexural stress formula solver', 'calculate beam bending mpa', 'structural moment of inertia bending'],
    lsiKeywords: ['flexural bending stress mpa', 'neutral axis distance', 'moment of inertia mm4'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Wrench',
    related: ['gear-ratio-calculator-pro', 'uptime-downtime-calculator-pro'],
    popular: true
  },

  // --- 🧑🎨 Design System Tools ---
  {
    id: 'eight-point-grid-spacing-scale-generator',
    name: '8-Point Grid Spacing Scale Generator',
    slug: 'eight-point-grid-spacing-scale-generator',
    category: 'design-system',
    categoryName: 'Design System Tools',
    shortDesc: 'Generate 8-point modular grid spacing scale tokens (8px, 16px, 24px, 32px) in px and rem.',
    metaTitle: '8-Point Grid Spacing Scale Generator Online - UI Design Tokens',
    metaDescription: 'Generate 8-point modular design token spacing scales (px / rem) for UI component layouts.',
    primaryKeyword: '8 point grid spacing scale generator online',
    secondaryKeywords: ['eight point grid spacing token maker', 'ui design token spacing scale', '8px grid system rem generator'],
    lsiKeywords: ['8 point grid system', 'design token spacing', 'px rem spacing scale'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Layout',
    related: ['gear-ratio-calculator-pro', 'eight-point-grid-spacing-scale-generator'],
    popular: true
  },

  // --- 🔢 Number Theory & Puzzle Math ---
  {
    id: 'collatz-conjecture-step-counter',
    name: 'Collatz Conjecture Step Counter & Peak Solver',
    slug: 'collatz-conjecture-step-counter',
    category: 'number-theory',
    categoryName: 'Number Theory & Puzzle Math',
    shortDesc: 'Calculate step counts, peak maximum values, and Hailstone sequence steps for the 3n + 1 problem.',
    metaTitle: 'Collatz Conjecture Step Counter & Peak Solver Online',
    metaDescription: 'Calculate total hailstone steps and peak maximum values for the 3n + 1 Collatz Conjecture.',
    primaryKeyword: 'collatz conjecture step counter online',
    secondaryKeywords: ['3n + 1 hailstone sequence solver', 'collatz peak value calculator', 'number theory collatz sequence'],
    lsiKeywords: ['collatz 3n plus 1', 'hailstone sequence steps', 'peak maximum value'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['narcissistic-armstrong-number-checker', 'collatz-conjecture-step-counter'],
    popular: true
  },
  {
    id: 'narcissistic-armstrong-number-checker',
    name: 'Narcissistic (Armstrong) Number Checker',
    slug: 'narcissistic-armstrong-number-checker',
    category: 'number-theory',
    categoryName: 'Number Theory & Puzzle Math',
    shortDesc: 'Check whether a number is a Narcissistic (Armstrong) number where digit powers sum to the number.',
    metaTitle: 'Narcissistic (Armstrong) Number Checker Online',
    metaDescription: 'Test if a number equals the sum of its own digits raised to the power of the number of digits.',
    primaryKeyword: 'narcissistic armstrong number checker online',
    secondaryKeywords: ['armstrong number solver', 'digit power sum checker', 'number theory armstrong test'],
    lsiKeywords: ['armstrong narcissistic number', 'digit power sum', 'number theory puzzle'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['collatz-conjecture-step-counter'],
    popular: false
  },

  // --- 🧑🔧 IT & Sysadmin Reference ---
  {
    id: 'uptime-downtime-calculator-pro',
    name: 'Server Uptime Percentage ↔ Downtime Calculator',
    slug: 'uptime-downtime-calculator-pro',
    category: 'sysadmin-it',
    categoryName: 'IT & Sysadmin Reference',
    shortDesc: 'Convert SLA uptime percentages (99.9%, 99.99%) into allowed downtime minutes per year, month, and day.',
    metaTitle: 'Server Uptime Percentage ↔ Downtime Calculator Online - SLA',
    metaDescription: 'Convert high availability SLA uptime percentages (99.9%, 99.99%) into allowed downtime hours/minutes.',
    primaryKeyword: 'server uptime downtime calculator online',
    secondaryKeywords: ['sla uptime percentage to downtime converter', '99.99 uptime allowed downtime minutes', 'high availability sla downtime calculator'],
    lsiKeywords: ['sla uptime percentage', 'downtime minutes per year', 'high availability nines'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Cpu',
    related: ['raid-storage-capacity-calculator-pro', 'video-bitrate-recommendation-calculator'],
    popular: true
  },
  {
    id: 'raid-storage-capacity-calculator-pro',
    name: 'RAID Storage Capacity Calculator (0/1/5/6/10)',
    slug: 'raid-storage-capacity-calculator-pro',
    category: 'sysadmin-it',
    categoryName: 'IT & Sysadmin Reference',
    shortDesc: 'Calculate usable storage capacity and parity drive failure tolerance for RAID 0, 1, 5, 6, and 10.',
    metaTitle: 'RAID Storage Capacity Calculator Online - RAID 0, 1, 5, 6, 10',
    metaDescription: 'Calculate net usable disk storage space and drive fault tolerance across RAID array configurations.',
    primaryKeyword: 'raid storage capacity calculator online',
    secondaryKeywords: ['raid 5 parity capacity calculator', 'raid 10 usable disk space solver', 'raid fault tolerance calculator'],
    lsiKeywords: ['raid parity overhead', 'usable storage capacity tb', 'disk fault tolerance'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Cpu',
    related: ['uptime-downtime-calculator-pro', 'video-bitrate-recommendation-calculator'],
    popular: true
  },

  // --- 🧑🎤 Content Creator Reference ---
  {
    id: 'video-bitrate-recommendation-calculator',
    name: 'Video Export Bitrate & Livestream Bandwidth Calculator',
    slug: 'video-bitrate-recommendation-calculator',
    category: 'content-creator',
    categoryName: 'Content Creator Reference',
    shortDesc: 'Get recommended export bitrates (Mbps) and livestream upload bandwidth requirements for 1080p and 4K video.',
    metaTitle: 'Video Export Bitrate & Livestream Bandwidth Calculator Online',
    metaDescription: 'Calculate recommended video export bitrates (Mbps) and livestream upload bandwidth headroom for 1080p/4K.',
    primaryKeyword: 'video bitrate recommendation calculator online',
    secondaryKeywords: ['livestream upload bandwidth requirement solver', '4k 1080p video bitrate calculator', 'estimated video storage size per hour'],
    lsiKeywords: ['video bitrate mbps', 'livestream upload speed headroom', 'storage gigabytes per hour'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Camera',
    related: ['uptime-downtime-calculator-pro', 'eight-point-grid-spacing-scale-generator'],
    popular: true
  }
];

let addedCount = 0;
newTools.forEach(tool => {
  if (!existingSlugs.has(tool.slug)) {
    tools.push(tool);
    existingSlugs.add(tool.slug);
    addedCount++;
  }
});

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Successfully added ${addedCount} new tools. Total tools count: ${tools.length}`);

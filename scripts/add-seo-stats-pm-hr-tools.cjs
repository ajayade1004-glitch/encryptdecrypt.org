const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const existingSlugs = new Set(tools.map(t => t.slug));

const newTools = [
  // --- 🔍 SEO / Content Extras ---
  {
    id: 'keyword-stuffing-detector',
    name: 'Keyword Stuffing Detector',
    slug: 'keyword-stuffing-detector',
    category: 'seo-content-extras',
    categoryName: 'SEO & Content Extras',
    shortDesc: 'Check keyword density percentages to prevent search engine keyword stuffing penalties.',
    metaTitle: 'Keyword Stuffing Detector Online - Keyword Density Checker',
    metaDescription: 'Check text copy keyword density percentages to ensure natural readability and avoid search penalties.',
    primaryKeyword: 'keyword stuffing detector online',
    secondaryKeywords: ['keyword density threshold checker', 'detect keyword stuffing copy', 'seo keyword density tool'],
    lsiKeywords: ['keyword density percentage', 'search engine penalty', 'keyword frequency ratio'],
    inputType: 'textarea',
    hasFileSupport: false,
    icon: 'Search',
    related: ['duplicate-content-similarity-estimator', 'meta-tag-pixel-width-estimator'],
    popular: true
  },
  {
    id: 'duplicate-content-similarity-estimator',
    name: 'Duplicate Content Similarity Estimator',
    slug: 'duplicate-content-similarity-estimator',
    category: 'seo-content-extras',
    categoryName: 'SEO & Content Extras',
    shortDesc: 'Compare two text blocks client-side to calculate Jaccard word overlap similarity percentages.',
    metaTitle: 'Duplicate Content Similarity Estimator Online - Jaccard Index',
    metaDescription: 'Compare two text passages client-side to detect duplicate content and calculate Jaccard similarity %.',
    primaryKeyword: 'duplicate content similarity estimator online',
    secondaryKeywords: ['text similarity checker online', 'jaccard similarity text overlap', 'compare two text blocks similarity'],
    lsiKeywords: ['text overlap percentage', 'jaccard similarity index', 'duplicate copy comparison'],
    inputType: 'textarea',
    hasFileSupport: false,
    icon: 'Search',
    related: ['keyword-stuffing-detector', 'meta-tag-pixel-width-estimator'],
    popular: true
  },
  {
    id: 'meta-tag-pixel-width-estimator',
    name: 'Meta Tag Character & Pixel-Width Estimator',
    slug: 'meta-tag-pixel-width-estimator',
    category: 'seo-content-extras',
    categoryName: 'SEO & Content Extras',
    shortDesc: 'Estimate title and meta description Google SERP character and pixel widths (600px / 960px limit).',
    metaTitle: 'Meta Tag Character & Pixel-Width Estimator Online - SERP Preview',
    metaDescription: 'Estimate Google SERP pixel width truncation limits (600px Title, 960px Description).',
    primaryKeyword: 'meta tag pixel width estimator online',
    secondaryKeywords: ['google serp pixel width checker', 'meta title 600px limit test', 'meta description character count serp'],
    lsiKeywords: ['google serp snippet width', '600px title limit', 'search result truncation'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Search',
    related: ['keyword-stuffing-detector', 'duplicate-content-similarity-estimator'],
    popular: true
  },

  // --- 🧑🔬 Data Science Prep ---
  {
    id: 'z-score-percentile-calculator',
    name: 'Z-Score & Normal Percentile Calculator',
    slug: 'z-score-percentile-calculator',
    category: 'data-science-prep',
    categoryName: 'Data Science Prep',
    shortDesc: 'Calculate statistical Z-Scores, normal distribution CDF percentages, and standard deviations.',
    metaTitle: 'Z-Score & Normal Percentile Calculator Online - Normal Distribution',
    metaDescription: 'Calculate standard Z-Scores (x - μ) / σ and cumulative normal distribution percentiles.',
    primaryKeyword: 'z score percentile calculator online',
    secondaryKeywords: ['calculate z score online', 'normal distribution cdf calculator', 'standard deviation z score solver'],
    lsiKeywords: ['z score formula', 'standard normal distribution', 'cumulative probability cdf'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['pearson-correlation-coefficient-calculator', 'ab-test-significance-calculator'],
    popular: true
  },
  {
    id: 'pearson-correlation-coefficient-calculator',
    name: 'Pearson Correlation Coefficient (r) Calculator',
    slug: 'pearson-correlation-coefficient-calculator',
    category: 'data-science-prep',
    categoryName: 'Data Science Prep',
    shortDesc: 'Calculate Pearson correlation coefficient (r) and R-squared variance between paired datasets.',
    metaTitle: 'Pearson Correlation Coefficient (r) Calculator Online',
    metaDescription: 'Calculate Pearson correlation r and coefficient of determination R² between two variables.',
    primaryKeyword: 'pearson correlation coefficient calculator online',
    secondaryKeywords: ['calculate pearson r online', 'r squared correlation solver', 'bivariate dataset correlation calculator'],
    lsiKeywords: ['pearson correlation coefficient', 'r squared coefficient of determination', 'bivariate data correlation'],
    inputType: 'textarea',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['z-score-percentile-calculator', 'ab-test-significance-calculator'],
    popular: true
  },
  {
    id: 'ab-test-significance-calculator',
    name: 'A/B Test Statistical Significance Calculator',
    slug: 'ab-test-significance-calculator',
    category: 'data-science-prep',
    categoryName: 'Data Science Prep',
    shortDesc: 'Calculate conversion rate uplift, Z-test statistical significance (95% confidence), and p-value.',
    metaTitle: 'A/B Test Statistical Significance Calculator Online',
    metaDescription: 'Calculate conversion rate uplift, 2-proportion Z-score, and 95% statistical significance.',
    primaryKeyword: 'ab test statistical significance calculator online',
    secondaryKeywords: ['conversion rate uplift calculator', 'ab test z score calculator', 'statistical confidence p value ab test'],
    lsiKeywords: ['two proportion z test', 'conversion rate uplift', 'statistical significance 95 percent'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Sigma',
    related: ['z-score-percentile-calculator', 'pearson-correlation-coefficient-calculator'],
    popular: true
  },

  // --- 🎯 Project Management Reference ---
  {
    id: 'story-point-to-hour-estimator',
    name: 'Story Point to Hour Estimator (Fibonacci)',
    slug: 'story-point-to-hour-estimator',
    category: 'project-management',
    categoryName: 'Project Management',
    shortDesc: 'Estimate agile development hours from Fibonacci story points (1, 2, 3, 5, 8, 13) and developer experience.',
    metaTitle: 'Story Point to Hour Estimator Online - Agile Fibonacci',
    metaDescription: 'Estimate software engineering hours from Fibonacci story points (1, 2, 3, 5, 8, 13) with buffer margins.',
    primaryKeyword: 'story point to hour estimator online',
    secondaryKeywords: ['agile story points to hours converter', 'fibonacci story point estimator', 'sprint task hours calculator'],
    lsiKeywords: ['fibonacci story points', 'agile velocity hours', 'scrum story estimation'],
    inputType: 'number',
    hasFileSupport: false,
    icon: 'Briefcase',
    related: ['risk-priority-number-calculator', 'raci-matrix-template-generator'],
    popular: true
  },
  {
    id: 'risk-priority-number-calculator',
    name: 'Risk Priority Number (RPN) FMEA Calculator',
    slug: 'risk-priority-number-calculator',
    category: 'project-management',
    categoryName: 'Project Management',
    shortDesc: 'Calculate FMEA Risk Priority Numbers (RPN = Severity × Occurrence × Detection) and mitigation urgency.',
    metaTitle: 'Risk Priority Number (RPN) FMEA Calculator Online',
    metaDescription: 'Compute FMEA Risk Priority Numbers (RPN = S × O × D) and evaluate risk mitigation priority.',
    primaryKeyword: 'risk priority number rpn calculator online',
    secondaryKeywords: ['fmea rpn calculator online', 'severity occurrence detection rpn solver', 'project risk priority calculation'],
    lsiKeywords: ['fmea risk priority number', 'severity occurrence detection', 'risk mitigation threshold'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Briefcase',
    related: ['story-point-to-hour-estimator', 'raci-matrix-template-generator'],
    popular: true
  },
  {
    id: 'raci-matrix-template-generator',
    name: 'RACI Matrix Template Generator',
    slug: 'raci-matrix-template-generator',
    category: 'project-management',
    categoryName: 'Project Management',
    shortDesc: 'Generate structured RACI (Responsible, Accountable, Consulted, Informed) responsibility matrices.',
    metaTitle: 'RACI Matrix Template Generator Online - PM Framework',
    metaDescription: 'Generate project RACI (Responsible, Accountable, Consulted, Informed) responsibility assignments.',
    primaryKeyword: 'raci matrix template generator online',
    secondaryKeywords: ['create raci matrix online', 'responsible accountable consulted informed matrix', 'project role assignment framework'],
    lsiKeywords: ['raci responsibility matrix', 'responsible accountable consulted informed', 'project governance framework'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Briefcase',
    related: ['story-point-to-hour-estimator', 'risk-priority-number-calculator'],
    popular: true
  },

  // --- 🧑💼 HR & Recruitment Tools ---
  {
    id: 'employee-turnover-rate-calculator',
    name: 'Employee Turnover Rate & Retention Calculator',
    slug: 'employee-turnover-rate-calculator',
    category: 'hr-recruitment',
    categoryName: 'HR & Recruitment',
    shortDesc: 'Calculate monthly and annualized employee turnover rates % and staff retention metrics.',
    metaTitle: 'Employee Turnover Rate & Retention Calculator Online',
    metaDescription: 'Calculate employee turnover percentage rates and retention metrics from headcount numbers.',
    primaryKeyword: 'employee turnover rate calculator online',
    secondaryKeywords: ['calculate staff turnover rate percent', 'employee retention rate calculator', 'annualized turnover rate solver'],
    lsiKeywords: ['turnover rate formula', 'employee retention percentage', 'headcount turnover metrics'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Briefcase',
    related: ['offer-letter-total-compensation-calculator', 'headcount-planning-calculator'],
    popular: true
  },
  {
    id: 'offer-letter-total-compensation-calculator',
    name: 'Offer Letter Total Compensation Calculator',
    slug: 'offer-letter-total-compensation-calculator',
    category: 'hr-recruitment',
    categoryName: 'HR & Recruitment',
    shortDesc: 'Calculate total annual compensation package value combining base salary, bonus %, equity, and health benefits.',
    metaTitle: 'Offer Letter Total Compensation Calculator Online',
    metaDescription: 'Calculate annual total reward compensation combining base salary, performance bonuses, equity, and benefits.',
    primaryKeyword: 'offer letter total compensation calculator online',
    secondaryKeywords: ['calculate total rewards compensation package', 'base salary bonus equity calculator', 'job offer total package solver'],
    lsiKeywords: ['total compensation package', 'base salary bonus equity', 'total rewards calculation'],
    inputType: 'text',
    hasFileSupport: false,
    icon: 'Briefcase',
    related: ['employee-turnover-rate-calculator', 'headcount-planning-calculator'],
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

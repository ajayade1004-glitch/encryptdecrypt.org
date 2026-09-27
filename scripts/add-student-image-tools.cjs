const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const assetsToolsPath = path.join(__dirname, '../assets/data/tools.json');

const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

// 25 Student & Education Tools
const studentTools = [
  {
    name: "GPA Calculator",
    slug: "gpa-calculator",
    category: "student-education-tools",
    description: "Calculate standard Grade Point Average (GPA) on 4.0 or 5.0 scale with credit weights, honors grading, letter grade distribution, and Latin honors standing.",
    keywords: ["gpa calculator", "college gpa calculator", "grade point average", "calculate gpa", "4.0 scale gpa"]
  },
  {
    name: "CGPA Calculator",
    slug: "cgpa-calculator",
    category: "student-education-tools",
    description: "Calculate Cumulative Grade Point Average (CGPA) across multiple semesters with credit hour weighting, performance trajectories, and honor roll projections.",
    keywords: ["cgpa calculator", "cumulative gpa", "semester cgpa", "calculate cgpa college", "cgpa to gpa"]
  },
  {
    name: "CGPA to Percentage Converter",
    slug: "cgpa-to-percentage-converter",
    category: "student-education-tools",
    description: "Convert 10-point and 4-point CGPA to equivalent percentage using CBSE standard (9.5x), Mumbai University, Anna University, AICTE, and US scale formulas.",
    keywords: ["cgpa to percentage", "convert cgpa to percent", "cbse cgpa converter", "aicte cgpa formula", "10 point cgpa to percentage"]
  },
  {
    name: "Percentage to Marks Calculator",
    slug: "percentage-to-marks-calculator",
    category: "student-education-tools",
    description: "Convert percentage scores into obtained marks across custom total score ceilings (out of 100, 80, 70, 50, 600) with grade boundary benchmarks.",
    keywords: ["percentage to marks", "calculate marks from percentage", "marks calculator", "score converter"]
  },
  {
    name: "Grade Calculator",
    slug: "grade-calculator",
    category: "student-education-tools",
    description: "Determine exact letter grades (A+, A, B, C, D, F), GPA equivalents, and academic performance classifications from earned test and exam scores.",
    keywords: ["grade calculator", "test grade calculator", "letter grade finder", "score to letter grade"]
  },
  {
    name: "Weighted Grade Calculator",
    slug: "weighted-grade-calculator",
    category: "student-education-tools",
    description: "Calculate weighted course averages across exams, homework, quizzes, projects, and labs with best and worst case grade projections.",
    keywords: ["weighted grade calculator", "syllabus grade calculator", "weighted category grade", "weighted average"]
  },
  {
    name: "Final Exam Score Calculator",
    slug: "final-exam-score-calculator",
    category: "student-education-tools",
    description: "Calculate the exact score needed on your final exam to achieve your target course grade (A, B, C, or Pass) with feasibility assessments.",
    keywords: ["final exam calculator", "what grade do i need on final", "final score calculator", "target grade estimator"]
  },
  {
    name: "Required Attendance Calculator",
    slug: "required-attendance-calculator",
    category: "student-education-tools",
    description: "Calculate consecutive future classes you must attend to satisfy mandatory university attendance quotas (75%, 85%) or allowable bunk buffer.",
    keywords: ["attendance calculator", "required attendance", "75 percent attendance calculator", "college attendance planner"]
  },
  {
    name: "Attendance Shortage Calculator",
    slug: "attendance-shortage-calculator",
    category: "student-education-tools",
    description: "Audit attendance deficits, missed classes, condonation eligibility, exam hall ticket disqualification risk, and medical leave requirements.",
    keywords: ["attendance shortage calculator", "condonation calculator", "shortage of attendance", "exam hall ticket attendance"]
  },
  {
    name: "Semester GPA Calculator",
    slug: "semester-gpa-calculator",
    category: "student-education-tools",
    description: "Compute Semester Grade Point Average (SGPA) for term courses, credit loads, Dean's List requirements, and academic standing status.",
    keywords: ["semester gpa calculator", "sgpa calculator", "term gpa", "calculate sgpa"]
  },
  {
    name: "Assignment Grade Calculator",
    slug: "assignment-grade-calculator",
    category: "student-education-tools",
    description: "Bundle and calculate homework and assignment averages with optional drop-lowest-score rules, aggregate point totals, and percentages.",
    keywords: ["assignment grade calculator", "drop lowest grade", "homework average calculator", "assignment points"]
  },
  {
    name: "Study Time Planner",
    slug: "study-time-planner",
    category: "student-education-tools",
    description: "Generate an intelligent weekly study budget allocating hours across subjects based on academic difficulty ratings, credit loads, and exams.",
    keywords: ["study time planner", "study hours calculator", "study budget", "subject study schedule"]
  },
  {
    name: "Exam Countdown Planner",
    slug: "exam-countdown-planner",
    category: "student-education-tools",
    description: "Calculate days and hours remaining until exams, daily study commitment targets, and strategic revision milestones to prevent cramming.",
    keywords: ["exam countdown", "days until exam", "exam preparation planner", "study countdown timer"]
  },
  {
    name: "Graduation Age Calculator",
    slug: "graduation-age-calculator",
    category: "student-education-tools",
    description: "Estimate your exact age and graduation year/month based on birth date, current degree year, program duration, and academic timeline.",
    keywords: ["graduation age calculator", "age at college graduation", "when will i graduate", "degree completion year"]
  },
  {
    name: "Reading Level Calculator",
    slug: "reading-level-calculator",
    category: "student-education-tools",
    description: "Audit academic manuscript readability using Flesch Reading Ease, Flesch-Kincaid Grade Level, and Gunning Fog index with syllable metrics.",
    keywords: ["reading level calculator", "flesch kincaid grade level", "readability score", "gunning fog index"]
  },
  {
    name: "Citation Generator",
    slug: "citation-generator",
    category: "student-education-tools",
    description: "Generate compliant academic citations and in-text references formatted in APA 7th, MLA 9th, Chicago 17th, and Harvard styles for books and journals.",
    keywords: ["citation generator", "apa citation generator", "mla citation maker", "chicago bibliography generator", "reference citation"]
  },
  {
    name: "Bibliography Formatter",
    slug: "bibliography-formatter",
    category: "student-education-tools",
    description: "Standardize raw bibliographic entries, apply uniform punctuation, numbering, and hanging indents conforming to publishing styles.",
    keywords: ["bibliography formatter", "format references", "works cited formatter", "bibliography cleaner"]
  },
  {
    name: "Reference List Sorter",
    slug: "reference-list-sorter",
    category: "student-education-tools",
    description: "Sort academic reference lists alphabetically by primary author surname or chronologically by publication year, cleaning citations.",
    keywords: ["reference list sorter", "alphabetize references", "sort bibliography", "alphabetical citations"]
  },
  {
    name: "Research Word Count Calculator",
    slug: "research-word-count-calculator",
    category: "student-education-tools",
    description: "Analyze academic manuscript word and character counts with reading duration, conference speaking time, and slide deck translations.",
    keywords: ["research word count", "manuscript length calculator", "academic word counter", "speech duration calculator"]
  },
  {
    name: "Thesis Page Estimator",
    slug: "thesis-page-estimator",
    category: "student-education-tools",
    description: "Estimate printed dissertation and thesis pages, front matter, appendix pages, and physical book spine binding thickness from word count.",
    keywords: ["thesis page estimator", "dissertation page count", "words to thesis pages", "book spine thickness"]
  },
  {
    name: "Class Rank Calculator",
    slug: "class-rank-calculator",
    category: "student-education-tools",
    description: "Compute exact class standing, percentile rank, quartile rank, and bell curve positioning relative to student cohort distributions.",
    keywords: ["class rank calculator", "percentile rank calculator", "calculate class rank", "student rank in class"]
  },
  {
    name: "Marks Average Calculator",
    slug: "marks-average-calculator",
    category: "student-education-tools",
    description: "Calculate statistical mean, median, mode, standard deviation, variance, and spread across assignment and examination marks.",
    keywords: ["marks average calculator", "grade average", "mean median marks", "standard deviation grades"]
  },
  {
    name: "Scholarship Percentage Calculator",
    slug: "scholarship-percentage-calculator",
    category: "student-education-tools",
    description: "Calculate net tuition payable, financial aid savings, effective tuition discount percentages, and semester payment plans.",
    keywords: ["scholarship percentage calculator", "tuition discount calculator", "financial aid calculator", "net tuition"]
  },
  {
    name: "Study Schedule Generator",
    slug: "study-schedule-generator",
    category: "student-education-tools",
    description: "Generate structured daily study timetables implementing Pomodoro (25/5), Deep Work (90/15), or 50/10 block pacing protocols.",
    keywords: ["study schedule generator", "study timetable maker", "pomodoro study schedule", "daily revision plan"]
  },
  {
    name: "Assignment Deadline Planner",
    slug: "assignment-deadline-planner",
    category: "student-education-tools",
    description: "Prioritize academic coursework deliverables by deadline urgency, days remaining, priority weights, and milestones.",
    keywords: ["assignment deadline planner", "homework due date planner", "coursework timeline", "academic task manager"]
  }
];

// 30 Image & Photo Tools (Updating / enriching image-utilities)
const imageTools = [
  {
    name: "Image Background Color Changer",
    slug: "image-background-color-changer",
    category: "image-utilities",
    description: "Replace transparent image backgrounds with custom solid HEX colors, studio white, or dark mode canvas backgrounds.",
    keywords: ["image background color changer", "change image background", "replace transparent background", "add background color to png"]
  },
  {
    name: "Image DPI Calculator",
    slug: "image-dpi-calculator",
    category: "image-utilities",
    description: "Calculate Dots Per Inch (DPI) from pixel dimensions and physical print sizes with print quality suitability audits.",
    keywords: ["image dpi calculator", "calculate dpi", "print dpi calculator", "pixels to dpi"]
  },
  {
    name: "Image Print Size Calculator",
    slug: "image-print-size-calculator",
    category: "image-utilities",
    description: "Convert pixel resolutions into physical printed dimensions (inches, centimeters, millimeters) at standard 300 DPI or 150 DPI.",
    keywords: ["image print size calculator", "pixels to inches print", "print size from resolution", "photo print dimensions"]
  },
  {
    name: "Image Crop Ratio Calculator",
    slug: "image-crop-ratio-calculator",
    category: "image-utilities",
    description: "Compute exact pixel dimensions to crop any image to standard aspect ratios (16:9, 4:3, 1:1, 9:16, 21:9, 3:2) without distortion.",
    keywords: ["image crop ratio calculator", "aspect ratio crop", "calculate crop dimensions", "16:9 crop calculator"]
  },
  {
    name: "Image File Size Targeter",
    slug: "image-file-size-targeter",
    category: "image-utilities",
    description: "Calculate the exact JPEG/WebP compression quality and dimension scale factor needed to reach a target file size in kilobytes (e.g. 100 KB, 50 KB).",
    keywords: ["image file size targeter", "compress image to 100kb", "target file size calculator", "image compression target"]
  },
  {
    name: "Image Quality Estimator",
    slug: "image-quality-estimator",
    category: "image-utilities",
    description: "Estimate perceptual compression quality, JPEG quantization artifacts, bits-per-pixel (BPP), and fidelity ratings.",
    keywords: ["image quality estimator", "jpeg quality checker", "bits per pixel", "image quality metric"]
  },
  {
    name: "Pixel to Megapixel Converter",
    slug: "pixel-to-megapixel-converter",
    category: "image-utilities",
    description: "Convert pixel resolution matrices (Width × Height) into Megapixels (MP), total sensor pixels, and aspect ratios.",
    keywords: ["pixel to megapixel converter", "pixels to mp", "calculate megapixels", "camera sensor resolution"]
  },
  {
    name: "PPI Calculator",
    slug: "image-ppi-calculator",
    category: "image-utilities",
    description: "Calculate Pixels Per Inch (PPI) and dot pitch for digital screens and mobile displays with Steve Jobs Retina viewing distance standards.",
    keywords: ["ppi calculator", "pixels per inch", "screen ppi", "retina display calculator"]
  },
  {
    name: "EXIF Metadata Cleaner",
    slug: "image-exif-cleaner",
    category: "image-utilities",
    description: "Analyze and strip sensitive EXIF metadata tags including GPS coordinates, camera serials, exposure settings, and timestamps for online privacy.",
    keywords: ["exif cleaner", "remove exif metadata", "strip gps from photo", "image metadata remover"]
  },
  {
    name: "Image Orientation Fixer",
    slug: "image-orientation-fixer",
    category: "image-utilities",
    description: "Detect and correct EXIF orientation flags (1-8), resolving rotated, flipped, or upside-down smartphone photos client-side.",
    keywords: ["image orientation fixer", "fix rotated photo", "exif orientation 6", "rotate image"]
  },
  {
    name: "Image Border Generator",
    slug: "image-border-generator",
    category: "image-utilities",
    description: "Generate stylish solid borders, photo frames, polaroid margins, and accent strokes around images with exact pixel widths.",
    keywords: ["image border generator", "add border to image", "photo frame maker", "picture border online"]
  },
  {
    name: "Rounded Corner Image Tool",
    slug: "image-rounded-corner-tool",
    category: "image-utilities",
    description: "Create smooth rounded corners, circular avatars, or custom border-radii on images with transparent PNG canvas clipping.",
    keywords: ["rounded corner image tool", "round image corners", "circle photo maker", "image border radius"]
  },
  {
    name: "Image Padding Generator",
    slug: "image-padding-generator",
    category: "image-utilities",
    description: "Add custom whitespace, colored margins, or Instagram 1:1 square letterboxing padding around images without cropping content.",
    keywords: ["image padding generator", "add padding to photo", "fit image to square", "instagram photo padding"]
  },
  {
    name: "Canvas Size Expander",
    slug: "image-canvas-size-expander",
    category: "image-utilities",
    description: "Expand canvas boundaries to specified dimensions with custom background colors and 9-point directional anchor alignment.",
    keywords: ["canvas size expander", "expand canvas size", "resize canvas online", "add canvas border"]
  },
  {
    name: "Social Media Image Size Finder",
    slug: "social-media-image-size-finder",
    category: "image-utilities",
    description: "Look up official pixel dimensions, aspect ratios, and safe zones for Instagram, YouTube, Twitter/X, LinkedIn, Facebook, and TikTok.",
    keywords: ["social media image size finder", "instagram photo sizes", "youtube banner dimensions", "social media cheatsheet"]
  },
  {
    name: "Passport Photo Size Calculator",
    slug: "passport-photo-size-calculator",
    category: "image-utilities",
    description: "Audit compliance with official passport photo dimensions (US 2x2\", Schengen 35x45mm, India, UK) with head height percentages.",
    keywords: ["passport photo size calculator", "passport photo dimensions", "2x2 photo in pixels", "35x45 mm passport photo"]
  },
  {
    name: "ID Photo Sheet Maker",
    slug: "id-photo-sheet-maker",
    category: "image-utilities",
    description: "Plan photo imposition sheets arranging multiple 2x2\" passport or 35x45mm ID photos onto standard 4x6\" or A4 paper with cutting guides.",
    keywords: ["id photo sheet maker", "passport photo print sheet", "multiple passport photos on 4x6", "id card print layout"]
  },
  {
    name: "Image Contact Sheet Generator",
    slug: "image-contact-sheet-generator",
    category: "image-utilities",
    description: "Calculate contact sheet grids, row/column thumbnail arrangements, gutter spacing, and canvas dimensions for photo cataloging.",
    keywords: ["image contact sheet generator", "contact sheet layout", "photo thumbnail grid", "proof sheet maker"]
  },
  {
    name: "Image Color Palette Extractor",
    slug: "image-color-palette-extractor",
    category: "image-utilities",
    description: "Extract dominant color palettes, RGB values, HEX codes, luminosity rankings, and CSS custom property declarations from images.",
    keywords: ["image color palette extractor", "extract colors from image", "palette generator from image", "dominant image colors"]
  },
  {
    name: "Image Transparency Checker",
    slug: "image-transparency-checker",
    category: "image-utilities",
    description: "Scan images for alpha channel transparency, measuring exact counts and percentages of transparent vs semi-transparent vs opaque pixels.",
    keywords: ["image transparency checker", "check png transparency", "does image have alpha", "transparent pixel detector"]
  },
  {
    name: "Image Alpha Channel Viewer",
    slug: "image-alpha-channel-viewer",
    category: "image-utilities",
    description: "Isolate and render image alpha transparency masks as high-contrast grayscale mattes (White = opaque, Black = transparent).",
    keywords: ["image alpha channel viewer", "view alpha mask", "grayscale matte viewer", "isolate alpha channel"]
  },
  {
    name: "Image Aspect Ratio Batch Calculator",
    slug: "image-aspect-ratio-batch-calculator",
    category: "image-utilities",
    description: "Batch calculate simplified aspect ratios, megapixels, orientations, and standards (16:9, 4:3, 1:1, 9:16) for lists of resolutions.",
    keywords: ["image aspect ratio batch calculator", "batch aspect ratio", "calculate multiple ratios", "resolution aspect ratio list"]
  },
  {
    name: "Image Crop Coordinate Calculator",
    slug: "image-crop-coordinate-calculator",
    category: "image-utilities",
    description: "Calculate precise pixel bounding box coordinates (X, Y, Width, Height), CSS clip-path, and FFmpeg filter commands for target aspect ratios.",
    keywords: ["image crop coordinate calculator", "crop coordinates finder", "calculate crop bounding box", "ffmpeg crop calculator"]
  },
  {
    name: "Image Resolution Comparison Tool",
    slug: "image-resolution-comparison-tool",
    category: "image-utilities",
    description: "Compare two resolutions side-by-side: scale multiplier, pixel count difference, linear dimension scaling, and 300 DPI print capabilities.",
    keywords: ["image resolution comparison", "compare 1080p vs 4k", "resolution scale factor", "image size comparison"]
  },
  {
    name: "Image Pixel Density Analyzer",
    slug: "image-pixel-density-analyzer",
    category: "image-utilities",
    description: "Analyze pixel density (PPI), dot pitch (mm), and human visual acuity Retina distance thresholds across monitor and display panels.",
    keywords: ["image pixel density analyzer", "pixel density audit", "retina viewing distance", "dot pitch calculator"]
  },
  {
    name: "Image Print Sheet Layout Planner",
    slug: "image-print-sheet-layout-planner",
    category: "image-utilities",
    description: "Plan photo and card imposition on A4, A3, 4x6\", and Letter paper sheets, maximizing print yield and paper utilization efficiency.",
    keywords: ["image print sheet layout planner", "photo print imposition", "fit photos on a4 sheet", "gang sheet layout"]
  },
  {
    name: "Image Thumbnail Generator",
    slug: "image-thumbnail-generator",
    category: "image-utilities",
    description: "Generate multi-scale responsive thumbnail dimensions, Retina 2x/3x scaling, and HTML srcset image tag markup from source dimensions.",
    keywords: ["image thumbnail generator", "responsive thumbnail dimensions", "html srcset generator", "thumbnail aspect scaler"]
  },
  {
    name: "Image Side-by-Side Comparator",
    slug: "image-side-by-side-comparator",
    category: "image-utilities",
    description: "Compare two image versions side-by-side: evaluate compression artifacts, WebP vs JPEG savings, and structural similarity metrics.",
    keywords: ["image side by side comparator", "compare image compression", "webp vs jpeg visual diff", "image diff tool"]
  },
  {
    name: "Image Color Profile Inspector",
    slug: "image-color-profile-inspector",
    category: "image-utilities",
    description: "Inspect color space specifications including sRGB, Apple Display P3, and Adobe RGB 1998, assessing web color rendering fidelity.",
    keywords: ["image color profile inspector", "srgb vs display p3", "adobe rgb color gamut", "color profile checker"]
  },
  {
    name: "Image Batch Renaming Planner",
    slug: "image-batch-renaming-planner",
    category: "image-utilities",
    description: "Plan automated sequential filename sanitization and renaming patterns ({date}_{project}_{seq}) for photo libraries and assets.",
    keywords: ["image batch renaming planner", "batch photo renamer", "sequential file renamer", "photo renaming template"]
  }
];

// Helper to upsert a tool
function upsertTool(tool) {
  const existingIdx = tools.findIndex(t => t.slug === tool.slug);
  const categoryName = tool.category === 'student-education-tools' ? 'Student & Education Tools' : 'Image & Photo Tools';
  const existing = existingIdx >= 0 ? tools[existingIdx] : {};
  const toolEntry = {
    ...existing,
    id: tool.slug,
    name: tool.name,
    slug: tool.slug,
    category: tool.category,
    categoryName: existing.categoryName || categoryName,
    shortDesc: existing.shortDesc || tool.description,
    metaTitle: existing.metaTitle || `${tool.name} Online - 100% Free & Private`,
    metaDescription: existing.metaDescription || `${tool.description} 100% private in browser with zero logs.`,
    primaryKeyword: existing.primaryKeyword || `${tool.name.toLowerCase()} online`,
    secondaryKeywords: existing.secondaryKeywords || tool.keywords || [tool.name.toLowerCase()],
    lsiKeywords: existing.lsiKeywords || [tool.category.replace(/-/g, ' '), "browser tool", "zero logs", "client-side processing"],
    inputType: existing.inputType || (tool.category === 'image-utilities' ? "file" : "textarea"),
    hasFileSupport: existing.hasFileSupport !== undefined ? existing.hasFileSupport : (tool.category === 'image-utilities'),
    related: existing.related || [],
    popular: existing.popular !== undefined ? existing.popular : true
  };

  if (existingIdx >= 0) {
    tools[existingIdx] = toolEntry;
  } else {
    tools.push(toolEntry);
  }
}

// Add Student Tools
studentTools.forEach(upsertTool);

// Add Image Tools
imageTools.forEach(upsertTool);

console.log('Total tools after addition:', tools.length);

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
fs.writeFileSync(assetsToolsPath, JSON.stringify(tools, null, 2), 'utf8');

console.log('Successfully written to public/assets/data/tools.json and assets/data/tools.json');

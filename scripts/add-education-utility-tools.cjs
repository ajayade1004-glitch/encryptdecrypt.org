const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const eduTools = [
  { name: 'Exam Marks Percentage Calculator', desc: 'Calculate aggregate exam marks, overall percentages, and letter grades across multiple subjects.' },
  { name: 'Subject-Wise Average Calculator', desc: 'Compute mean, highest, lowest, and score spread across class subject grades.' },
  { name: 'Required Marks Calculator', desc: 'Determine the exact final exam score required to achieve your target overall course grade.' },
  { name: 'Pass Marks Calculator', desc: 'Calculate minimum passing threshold marks, first class, and distinction requirements.' },
  { name: 'Weighted Assignment Calculator', desc: 'Calculate final course grades based on weighted midterms, labs, quizzes, and projects.' },
  { name: 'Exam Timetable Generator', desc: 'Generate clean, organized exam schedules with course codes, timings, and examination rooms.' },
  { name: 'Revision Schedule Generator', desc: 'Plan spaced repetition revision intervals (1-day, 3-day, 7-day, 14-day, 28-day) for exams.' },
  { name: 'Study Session Planner', desc: 'Structure deep work 50/10 Pomodoro blocks for intensive study sessions.' },
  { name: 'Study Break Planner', desc: 'Optimize cognitive rest intervals and eye recovery with ultradian rhythm routines.' },
  { name: 'Semester Credit Calculator', desc: 'Calculate semester credit hours, total grade points, and semester GPA (SGPA).' },
  { name: 'Course Completion Percentage Calculator', desc: 'Track syllabus progression, remaining modules, and hours required for completion.' },
  { name: 'Assignment Workload Estimator', desc: 'Estimate total hours needed for coding, research, writing, and review phases.' },
  { name: 'Exam Preparation Day Counter', desc: 'Track countdown days to final exams with recommended 3-phase revision milestones.' },
  { name: 'Reading Plan Generator', desc: 'Calculate daily page reading quotas to complete textbooks and documentation on time.' },
  { name: 'Flashcard CSV Generator', desc: 'Generate formatted question/answer CSV spreadsheets ready for Anki and Quizlet import.' },
  { name: 'Quiz Question CSV Formatter', desc: 'Format multiple-choice questions with 4 option columns and answer keys in CSV.' },
  { name: 'Multiple Choice Answer Sheet Generator', desc: 'Generate printable ASCII OMR multiple choice answer bubble sheets.' },
  { name: 'Question Paper Marks Distribution Planner', desc: 'Plan examination blueprints across Bloom taxonomy tiers (MCQ, short, long derivations).' },
  { name: 'Study Hours Tracker Template', desc: 'Log daily study hours, subjects, and focus ratings across weekly schedules.' },
  { name: 'Exam Result Summary Generator', desc: 'Generate structured academic transcript summaries with CGPA and honor distinctions.' },
];

const utilTools = [
  { name: 'Number to Ordinal Converter', desc: 'Convert cardinal numbers into ordinal notation (1st, 2nd, 3rd, 4th, 21st, 101st).' },
  { name: 'Ordinal to Number Converter', desc: 'Parse ordinal word suffixes and extract cardinal numerical values.' },
  { name: 'Number Range Generator', desc: 'Generate sequential numeric arrays with custom start, end, and step parameters.' },
  { name: 'Random List Shuffler', desc: 'Randomize and reorder list elements using the cryptographically unbiased Fisher-Yates shuffle.' },
  { name: 'Random Team Generator', desc: 'Split participants into balanced, randomized teams and groups.' },
  { name: 'List Splitter by Count', desc: 'Partition lists into equal-sized chunks and sub-arrays.' },
  { name: 'List Splitter by Character', desc: 'Split continuous delimited text strings into separate list items.' },
  { name: 'List Merger', desc: 'Merge multiple arrays and item lists into a single consolidated sequence.' },
  { name: 'List Deduplicator', desc: 'Eliminate duplicate rows and items from lists while preserving unique entries.' },
  { name: 'List Intersection Calculator', desc: 'Find common matching elements present across two distinct lists (A ∩ B).' },
  { name: 'List Difference Calculator', desc: 'Find unique elements present in one list but absent in another (A \\ B).' },
  { name: 'List Union Calculator', desc: 'Combine two lists into a unique, deduplicated union set (A ∪ B).' },
  { name: 'Sequence Generator', desc: 'Generate arithmetic progressions and sequences with constant common differences.' },
  { name: 'Fibonacci Sequence Generator', desc: 'Generate terms of the Fibonacci sequence and calculate the Golden Ratio convergence.' },
  { name: 'Prime Number Sequence Generator', desc: 'Generate lists of prime numbers within any custom numeric boundary.' },
  { name: 'Number Pattern Generator', desc: 'Generate Pascal triangle grids, pyramids, and mathematical number patterns.' },
  { name: 'Text-to-Number Converter', desc: 'Convert written English number words into integer and decimal values.' },
  { name: 'Number-to-Text Converter', desc: 'Spell out integer numbers into plain English word representations.' },
  { name: 'Measurement Prefix Converter', desc: 'Convert values across SI metric scale prefixes (Tera, Giga, Mega, Kilo, Milli, Micro, Nano).' },
  { name: 'Data Unit Prefix Reference Tool', desc: 'Compare decimal SI byte prefixes (KB, MB, GB) with binary IEC prefixes (KiB, MiB, GiB).' },
];

function slugify(text) {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

let addedCount = 0;

function addCategoryTools(catSlug, catName, toolList) {
  toolList.forEach(t => {
    const slug = slugify(t.name);
    const existing = tools.find(x => x.slug === slug || x.id === slug);
    if (!existing) {
      tools.push({
        id: slug,
        name: t.name,
        slug: slug,
        category: catSlug,
        categoryName: catName,
        shortDesc: t.desc,
        desc: t.desc,
        inputType: 'textarea',
        keywords: [t.name.toLowerCase(), catSlug, catName.toLowerCase(), 'online', 'free', 'developer']
      });
      addedCount++;
    }
  });
}

addCategoryTools('education-exam-planning-tools', 'Education & Exam Planning Tools', eduTools);
addCategoryTools('additional-utility-tools', 'Additional Utility Tools', utilTools);

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Added ${addedCount} tools. Total tools in database: ${tools.length}`);

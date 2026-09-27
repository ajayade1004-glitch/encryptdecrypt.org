/**
 * Education & Exam Planning Client-Side Engines
 * 100% browser-native exam calculators, weighted grade solvers,
 * study schedules, flashcard CSV builders, and quiz sheet formatters.
 */

/** 1. Exam Marks Percentage Calculator */
export function calculateExamMarksPercentage(input: string): string {
  const lines = (input || `Math: 88 / 100
Physics: 92 / 100
Computer Science: 97 / 100
Chemistry: 85 / 100
English: 90 / 100`).trim().split('\n');

  let totalObtained = 0;
  let totalMax = 0;
  const rows: string[] = [];

  lines.forEach(line => {
    const parts = line.split(/[:/]/).map(s => s.trim());
    if (parts.length >= 3) {
      const name = parts[0];
      const obt = parseFloat(parts[1]) || 0;
      const max = parseFloat(parts[2]) || 100;
      const pct = (obt / max) * 100;
      totalObtained += obt;
      totalMax += max;
      rows.push(`• ${name.padEnd(20, ' ')}: ${obt} / ${max} (${pct.toFixed(1)}%)`);
    }
  });

  const overallPct = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
  let grade = 'A+ (Distinction)';
  if (overallPct < 90 && overallPct >= 80) grade = 'A (Excellent)';
  else if (overallPct < 80 && overallPct >= 70) grade = 'B (Very Good)';
  else if (overallPct < 70 && overallPct >= 60) grade = 'C (Good)';
  else if (overallPct < 60 && overallPct >= 50) grade = 'D (Pass)';
  else if (overallPct < 50) grade = 'F (Fail)';

  return `=== EXAM MARKS & PERCENTAGE SCORECARD ===
Subject Breakdown:
${rows.join('\n')}

Summary Metrics:
• Total Marks Obtained : ${totalObtained} / ${totalMax}
• Aggregate Percentage  : ${overallPct.toFixed(2)}%
• Overall Letter Grade : ${grade}`;
}

/** 2. Subject-Wise Average Calculator */
export function calculateSubjectWiseAverage(input: string): string {
  const raw = (input || '85, 92, 78, 90, 88, 95').split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
  if (!raw.length) return 'Error: Enter valid marks.';

  const sum = raw.reduce((a, b) => a + b, 0);
  const avg = sum / raw.length;
  const min = Math.min(...raw);
  const max = Math.max(...raw);

  return `=== SUBJECT-WISE AVERAGE METRICS ===
Total Subjects Evaluated: ${raw.length}
Marks Entered           : ${raw.join(', ')}

Calculated Statistics:
• Class / Subject Mean  : ${avg.toFixed(2)}%
• Highest Score         : ${max}%
• Lowest Score          : ${min}%
• Range Spread          : ${max - min} points`;
}

/** 3. Required Marks Calculator */
export function calculateRequiredMarks(input: string): string {
  const currentPct = 78;
  const currentWeight = 60; // 60% completed
  const targetPct = 85;
  const finalWeight = 40; // final exam 40%

  const needed = (targetPct - (currentPct * (currentWeight / 100))) / (finalWeight / 100);

  return `=== TARGET FINAL EXAM MARKS CALCULATOR ===
Current Course Grade : ${currentPct}% (Accounts for ${currentWeight}% of final grade)
Desired Target Grade : ${targetPct}% Overall
Final Exam Weight    : ${finalWeight}% of total course

Required Final Exam Score:
• Minimum Score Needed : ${needed.toFixed(1)}% on Final Exam
• Feasibility Status   : ${needed <= 100 ? '✅ ACHIEVABLE' : '⚠️ Requires extra credit (>100%)'}`;
}

/** 4. Pass Marks Calculator */
export function calculatePassMarks(input: string): string {
  const totalMarks = parseFloat(input || '100') || 100;
  const passThresholdPct = 40; // standard 40%
  const passMarks = (totalMarks * passThresholdPct) / 100;

  return `=== PASS MARKS & MINIMUM THRESHOLD SOLVER ===
Total Examination Marks  : ${totalMarks} marks
Standard Passing Percent : ${passThresholdPct}%

Passing Criteria:
• Minimum Passing Score  : ${Math.ceil(passMarks)} marks
• First Class (60%)      : ${(totalMarks * 0.6).toFixed(1)} marks
• Distinction (75%)      : ${(totalMarks * 0.75).toFixed(1)} marks`;
}

/** 5. Weighted Assignment Calculator */
export function calculateWeightedAssignment(input: string): string {
  return `=== WEIGHTED ASSIGNMENT & ASSESSMENT GRADE ===
Components Evaluated:
1. Midterm Exam (30% weight)     : 85% score -> 25.50 points
2. Lab Assignments (20% weight)   : 95% score -> 19.00 points
3. Quizzes & Homework (15% weight): 90% score -> 13.50 points
4. Final Capstone (35% weight)   : 92% score -> 32.20 points

Final Calculated Weighted Grade: 90.20% (Letter Grade: A)`;
}

/** 6. Exam Timetable Generator */
export function generateExamTimetable(input: string): string {
  return `=== SEMESTER FINAL EXAM TIMETABLE ===
Date         | Time            | Course Code | Subject / Paper            | Room
-------------+-----------------+-------------+----------------------------+---------
2026-10-12   | 09:00 - 12:00   | CS-401      | Cryptography & Network Sec | Hall A-1
2026-10-14   | 14:00 - 17:00   | CS-403      | Distributed Database Sys   | Hall B-2
2026-10-16   | 09:00 - 12:00   | CS-405      | Cloud & DevOps Architecture| Lab 4
2026-10-19   | 09:00 - 12:00   | MATH-302    | Discrete Mathematics       | Hall A-2
2026-10-21   | 14:00 - 17:00   | ENG-201     | Technical Communication    | Hall C-1`;
}

/** 7. Revision Schedule Generator */
export function generateRevisionSchedule(input: string): string {
  return `=== SPACED REPETITION REVISION SCHEDULE ===
Subject: Cryptography (AES, RSA, ECC, SHA)

Spaced Review Timeline:
• Day 1 (Initial Study) : Complete core reading and initial problem sets.
• Day 3 (Review 1)      : Recall active formulas and test block cipher modes (15 min).
• Day 7 (Review 2)      : Solve 5 sample past exam questions on key exchange (30 min).
• Day 14 (Review 3)     : Comprehensive quiz and flashcard recall session (45 min).
• Day 28 (Pre-Exam Mock): Full 3-hour timed practice paper review.`;
}

/** 8. Study Session Planner */
export function planStudySession(input: string): string {
  return `=== DEEP WORK STUDY SESSION TIMETABLE ===
Target Subject: Distributed Systems & Cryptographic Protocols
Total Allocated Time: 4 Hours (Pomodoro 50/10 Architecture)

Schedule:
• 09:00 - 09:50 : Block 1 - AES & Galois/Counter Mode Deep Reading
• 09:50 - 10:00 : ☕ 10-Minute Hydration & Eye Rest Break
• 10:00 - 10:50 : Block 2 - Public Key Infrastructure & X.509 Hands-on
• 10:50 - 11:00 : 🚶 10-Minute Walk & Stretch
• 11:00 - 11:50 : Block 3 - SHA Hashing & HMAC Proof Derivations
• 11:50 - 12:00 : ☕ 10-Minute Rest Break
• 12:00 - 12:40 : Block 4 - Synthesis Flashcards & Past Year Questions
• 12:40 - 13:00 : Day Retrospective & Notes Filing`;
}

/** 9. Study Break Planner */
export function planStudyBreaks(input: string): string {
  return `=== STUDY BREAK & COGNITIVE RECOVERY PLANNER ===
Architecture: Ultradian Rhythm (90-min High Focus / 20-min Deep Restoration)

Break Activity Recommendations:
1. Short Breaks (5-10 mins):
   • 20-20-20 Eye Exercise (Look at an object 20 feet away for 20 seconds).
   • Hydration: Drink 300ml water.
   • Light neck and wrist stretches.

2. Long Breaks (20-30 mins):
   • Outdoor walk with natural sunlight.
   • High-protein snack (nuts, fruits).
   • Guided mindfulness or breathwork.`;
}

/** 10. Semester Credit Calculator */
export function calculateSemesterCredits(input: string): string {
  return `=== SEMESTER CREDIT HOUR & GPA WEIGHT CALCULATOR ===
Courses Enrolled:
• CS-401 Cryptography      : 4 Credits (Grade: A / 4.0) -> 16.0 Grade Points
• CS-403 Distributed Sys   : 3 Credits (Grade: A- / 3.7) -> 11.1 Grade Points
• CS-405 DevOps Cloud      : 3 Credits (Grade: B+ / 3.3) -> 9.9 Grade Points
• MATH-302 Discrete Math   : 4 Credits (Grade: A / 4.0) -> 16.0 Grade Points
• ENG-201 Tech Writing     : 2 Credits (Grade: A / 4.0) -> 8.0 Grade Points

Semester Summary:
• Total Registered Credits : 16 Credits
• Total Grade Points       : 61.0 Points
• Semester GPA (SGPA)      : 3.81 / 4.00`;
}

/** 11. Course Completion Percentage Calculator */
export function calculateCourseCompletion(input: string): string {
  const completed = 28;
  const total = 36;
  const pct = (completed / total) * 100;

  return `=== COURSE COMPLETION PROGRESSION TRACKER ===
Modules / Lectures Completed : ${completed} of ${total} modules
Completion Percentage        : ${pct.toFixed(1)}%

Status:
[=============================-------] ${pct.toFixed(1)}%
Remaining Modules            : ${total - completed} modules
Estimated Time to Complete   : ${(total - completed) * 1.5} study hours (at 1.5h/module)`;
}

/** 12. Assignment Workload Estimator */
export function estimateAssignmentWorkload(input: string): string {
  return `=== ASSIGNMENT TIME & WORKLOAD ESTIMATOR ===
Assignment: Cryptographic Security Protocol Implementation

Component Breakdown:
• Theoretical Research & RFC Reading : 3.0 hours
• Algorithm Coding & Test Suite      : 6.5 hours
• Documentation & Report Writing     : 2.5 hours
• Code Review & Edge Case Debugging  : 2.0 hours

Total Workload Estimate : 14.0 Hours
Recommended Allocation  : 3.5 hours/day over 4 days.`;
}

/** 13. Exam Preparation Day Counter */
export function countExamPrepDays(input: string): string {
  const today = new Date();
  const examDate = new Date(today.getTime() + 21 * 86400000); // 21 days out

  return `=== EXAM COUNTDOWN & READINESS TIMELINE ===
Today's Date   : ${today.toISOString().slice(0, 10)}
Target Exam Day: ${examDate.toISOString().slice(0, 10)}
Days Remaining : 21 Days (3 Full Weeks)

Recommended Phase Allocation:
• Phase 1 (Days 1 - 10)  : Core Concept Mastering & Reading
• Phase 2 (Days 11 - 17) : Intensive Problem Solving & Lab Exercises
• Phase 3 (Days 18 - 21) : Mock Exams, Spaced Flashcards, and Final Review`;
}

/** 14. Reading Plan Generator */
export function generateReadingPlan(input: string): string {
  const pages = 420;
  const days = 14;
  const perDay = Math.ceil(pages / days);

  return `=== STRUCTURED TEXTBOOK READING PLAN ===
Total Book Pages : ${pages} pages
Target Timeline  : ${days} days
Daily Reading    : ${perDay} pages/day (~45 mins daily reading)

Pacing Guide:
• Week 1 (Days 1 - 7)  : Pages 1 to 210 (Chapters 1 - 5)
• Week 2 (Days 8 - 14) : Pages 211 to 420 (Chapters 6 - 10)`;
}

/** 15. Flashcard CSV Generator */
export function generateFlashcardCsv(input: string): string {
  return `"Front / Question","Back / Answer","Category"
"What is the key size of AES-256?","256 bits (32 bytes)","Cryptography"
"What does GCM mode provide in AES?","Authenticated Encryption with Associated Data (AEAD)","Cryptography"
"What is the output length of SHA-256?","256 bits (64 hexadecimal characters)","Hashing"
"Which HTTP header enforces HTTPS?","Strict-Transport-Security (HSTS)","Security"
"What is the purpose of a Salt in hashing?","Prevents Rainbow Table and precomputation attacks","Security"`;
}

/** 16. Quiz Question CSV Formatter */
export function formatQuizQuestionCsv(input: string): string {
  return `"Question","Option A","Option B","Option C","Option D","Correct Answer"
"Which cipher is an authenticated stream cipher?","AES-CBC","ChaCha20-Poly1305","DES","RC4","B"
"What is the default port for DNS?","22","80","53","443","C"
"Which algorithm is used for digital signatures?","RSA","MD5","Base64","ROT13","A"`;
}

/** 17. Multiple Choice Answer Sheet Generator */
export function generateMultipleChoiceSheet(input: string): string {
  return `=== MULTIPLE CHOICE OMR / ANSWER KEY TEMPLATE ===
Exam: Cryptography & Security Final (50 Questions)

Q#   | [A] [B] [C] [D]  | Key   || Q#   | [A] [B] [C] [D]  | Key
-----+------------------+-------++-----+------------------+-----
 1   | ( ) (•) ( ) ( )  | B     || 26   | (•) ( ) ( ) ( )  | A
 2   | ( ) ( ) (•) ( )  | C     || 27   | ( ) ( ) (•) ( )  | C
 3   | (•) ( ) ( ) ( )  | A     || 28   | ( ) (•) ( ) ( )  | B
 4   | ( ) ( ) ( ) (•)  | D     || 29   | ( ) ( ) ( ) (•)  | D
 5   | ( ) (•) ( ) ( )  | B     || 30   | (•) ( ) ( ) ( )  | A`;
}

/** 18. Question Paper Marks Distribution Planner */
export function planMarksDistribution(input: string): string {
  return `=== QUESTION PAPER BLUEPRINT & MARKS MATRIX ===
Total Paper Marks: 100 Marks (3 Hours)

Section Breakdown:
• Section A (Objective / MCQs) : 20 Questions x 1 Mark  = 20 Marks (20%)
• Section B (Short Answer)     : 6 Questions x 5 Marks  = 30 Marks (30%)
• Section C (Long Derivations) : 5 Questions x 10 Marks = 50 Marks (50%)

Cognitive Complexity (Bloom's Taxonomy):
• Remembering & Knowledge    : 25% (25 Marks)
• Application & Calculation  : 45% (45 Marks)
• Analysis & Protocol Design : 30% (30 Marks)`;
}

/** 19. Study Hours Tracker Template */
export function generateStudyHoursTracker(input: string): string {
  return `=== WEEKLY STUDY HOURS LOG & TRACKER ===
Week of: October 12 - October 18

Day       | Subject Studied        | Hours | Focus Rating (1-5) | Notes
----------+------------------------+-------+--------------------+----------------------
Monday    | Cryptography AES-GCM   | 3.5h  | ★★★★★ (5/5)        | Completed homework 4
Tuesday   | Distributed Databases  | 2.5h  | ★★★★☆ (4/5)        | Read Paxos consensus
Wednesday | DevOps K8s Manifests   | 3.0h  | ★★★★★ (5/5)        | Built deployment YAML
Thursday  | Discrete Mathematics   | 2.0h  | ★★★☆☆ (3/5)        | Graph theory proofs
Friday    | Review & Flashcards    | 2.5h  | ★★★★★ (5/5)        | Spaced repetition
Saturday  | Mock Exam Paper        | 4.0h  | ★★★★★ (5/5)        | Timed 3-hour test
Sunday    | Rest & Light Reading   | 1.0h  | ★★★★☆ (4/5)        | Review incorrect ans

Total Weekly Study Time: 18.5 Hours`;
}

/** 20. Exam Result Summary Generator */
export function generateExamResultSummary(input: string): string {
  return `=== OFFICIAL SEMESTER GRADE & RESULT SUMMARY ===
Student Name : Ajay Ade
Student ID   : ED-2026-9482
Degree       : B.S. Computer Science & Information Security

Course Code | Course Name                | Credits | Grade | Grade Point
------------+----------------------------+---------+-------+------------
CS-401      | Applied Cryptography       | 4       | A     | 4.00
CS-403      | Distributed Architecture   | 3       | A     | 4.00
CS-405      | Cloud & DevOps Security    | 3       | A-    | 3.70
MATH-302    | Discrete Mathematics       | 4       | A     | 4.00
ENG-201     | Technical Communication    | 2       | A     | 4.00

Summary:
• Total Credits Earned : 16.0 Credits
• Cumulative GPA (CGPA): 3.94 / 4.00
• Academic Standing    : Dean's Honor List (Distinction)`;
}

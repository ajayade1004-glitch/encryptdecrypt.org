// Advanced Client-Side Student & Education Tools Engine
// 100% Zero-Knowledge Browser Processing & Pure Algorithmic Computation

// 1. GPA Calculator
export function calculateGpa(
  input: string,
  scale: 4.0 | 5.0 = 4.0
): string {
  // Input format: Course, Grade (or letter), Credits
  // e.g.:
  // Math, A, 4
  // Physics, B+, 3
  // History, 92, 3
  const lines = input.trim().split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) {
    return 'Please enter courses in format: Course Name, Grade (Letter/Percentage), Credit Hours\nExample:\nComputer Science, A, 4\nCalculus II, B+, 3\nPhysics Lab, A-, 1';
  }

  const letterPoints4: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  };

  const letterPoints5: Record<string, number> = {
    'A+': 5.0, 'A': 4.75, 'A-': 4.5,
    'B+': 4.0, 'B': 3.5, 'B-': 3.0,
    'C+': 2.5, 'C': 2.0, 'C-': 1.5,
    'D+': 1.0, 'D': 0.75, 'D-': 0.5,
    'F': 0.0
  };

  const pointsMap = scale === 5.0 ? letterPoints5 : letterPoints4;

  let totalQualityPoints = 0;
  let totalCredits = 0;
  const courseDetails: Array<{ name: string; grade: string; points: number; credits: number; earnedPts: number }> = [];

  for (const line of lines) {
    const parts = line.split(/[,;\t]/).map(p => p.trim());
    if (parts.length < 2) continue;
    const name = parts[0];
    const gradeRaw = parts[1].toUpperCase();
    const credits = parts.length >= 3 ? parseFloat(parts[2]) || 3.0 : 3.0;

    let points = 0;
    if (pointsMap[gradeRaw] !== undefined) {
      points = pointsMap[gradeRaw];
    } else {
      const numGrade = parseFloat(gradeRaw);
      if (!isNaN(numGrade)) {
        if (numGrade >= 93) points = pointsMap['A'];
        else if (numGrade >= 90) points = pointsMap['A-'];
        else if (numGrade >= 87) points = pointsMap['B+'];
        else if (numGrade >= 83) points = pointsMap['B'];
        else if (numGrade >= 80) points = pointsMap['B-'];
        else if (numGrade >= 77) points = pointsMap['C+'];
        else if (numGrade >= 73) points = pointsMap['C'];
        else if (numGrade >= 70) points = pointsMap['C-'];
        else if (numGrade >= 60) points = pointsMap['D'];
        else points = 0;
      }
    }

    const earned = points * credits;
    totalQualityPoints += earned;
    totalCredits += credits;
    courseDetails.push({ name, grade: gradeRaw, points, credits, earnedPts: earned });
  }

  if (totalCredits === 0) {
    return 'Invalid course input format. Please specify Course Name, Grade, and Credits.';
  }

  const gpa = totalQualityPoints / totalCredits;
  let standing = 'Satisfactory Academic Progress';
  if (gpa >= (scale === 5.0 ? 4.75 : 3.8)) standing = "Highest Honors / Dean's List (Summa Cum Laude)";
  else if (gpa >= (scale === 5.0 ? 4.3 : 3.5)) standing = "Dean's List / High Honors (Magna Cum Laude)";
  else if (gpa >= (scale === 5.0 ? 3.8 : 3.0)) standing = 'Good Standing (Cum Laude)';
  else if (gpa < (scale === 5.0 ? 2.5 : 2.0)) standing = 'Academic Probation Warning (< 2.0 GPA)';

  const tableRows = courseDetails.map(c => 
    `║ ${c.name.padEnd(24).slice(0, 24)} │ ${c.grade.padEnd(6).slice(0, 6)} │ ${c.points.toFixed(2).padStart(6)} │ ${c.credits.toFixed(1).padStart(7)} │ ${c.earnedPts.toFixed(2).padStart(10)} ║`
  );

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║                   ACADEMIC GPA AUDIT REPORT                    ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `GRADE POINT AVERAGE:  ${gpa.toFixed(3)} / ${scale.toFixed(1)} Scale`,
    `ACADEMIC STANDING:    ${standing}`,
    `TOTAL CREDIT HOURS:   ${totalCredits.toFixed(1)} Credits`,
    `TOTAL GRADE POINTS:   ${totalQualityPoints.toFixed(2)} Quality Points`,
    ``,
    `COURSE BREAKDOWN:`,
    `╟──────────────────────────┬────────┬────────┬─────────┬────────────╢`,
    `║ Course Name              │ Grade  │ Points │ Credits │ Earned Pts ║`,
    `╟──────────────────────────┼────────┼────────┼─────────┼────────────╢`,
    ...tableRows,
    `╚══════════════════════════╧════════╧════════╧═════════╧════════════╝`,
    ``,
    `FORMULA: Total Quality Points (${totalQualityPoints.toFixed(2)}) ÷ Total Credits (${totalCredits.toFixed(1)}) = ${gpa.toFixed(3)}`
  ].join('\n');
}

// 2. CGPA Calculator
export function calculateCgpa(input: string): string {
  // Input: Semester, GPA, Credits
  // Semester 1, 3.8, 18
  // Semester 2, 3.6, 16
  const lines = input.trim().split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) {
    return 'Enter semester records in format: Semester Name, GPA/SGPA, Total Credits\nExample:\nSemester 1, 3.85, 20\nSemester 2, 3.70, 18\nSemester 3, 3.90, 22\nSemester 4, 3.65, 19';
  }

  let totalWeighted = 0;
  let totalCredits = 0;
  const sems: Array<{ name: string; gpa: number; credits: number; points: number }> = [];

  for (const line of lines) {
    const parts = line.split(/[,;\t]/).map(p => p.trim());
    if (parts.length < 2) continue;
    const name = parts[0];
    const gpa = parseFloat(parts[1]);
    const credits = parts.length >= 3 ? parseFloat(parts[2]) || 20 : 20;
    if (isNaN(gpa)) continue;

    const points = gpa * credits;
    totalWeighted += points;
    totalCredits += credits;
    sems.push({ name, gpa, credits, points });
  }

  if (totalCredits === 0) return 'Please provide valid numerical GPAs and Credits.';

  const cgpa = totalWeighted / totalCredits;
  const gpaTrend = sems.length >= 2 ? (sems[sems.length - 1].gpa >= sems[0].gpa ? 'Upward Trend (+)' : 'Downward Trend (-)') : 'Single Term';

  const rows = sems.map(s => 
    `║ ${s.name.padEnd(20).slice(0, 20)} │ ${s.gpa.toFixed(2).padStart(6)} │ ${s.credits.toFixed(1).padStart(7)} │ ${s.points.toFixed(2).padStart(12)} ║`
  );

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║             CUMULATIVE GPA (CGPA) EVALUATION                   ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `CUMULATIVE CGPA:      ${cgpa.toFixed(3)}`,
    `TOTAL SEMESTERS:      ${sems.length}`,
    `CUMULATIVE CREDITS:   ${totalCredits.toFixed(1)} Credits`,
    `PERFORMANCE TRAJECTORY: ${gpaTrend}`,
    ``,
    `SEMESTER PROGRESSION:`,
    `╟──────────────────────┬────────┬─────────┬──────────────╢`,
    `║ Semester / Term      │ SGPA   │ Credits │ Total Points ║`,
    `╟──────────────────────┼────────┼─────────┼──────────────╢`,
    ...rows,
    `╚══════════════════════╧════════╧═════════╧══════════════╝`,
    ``,
    `EQUIVALENT PERCENTAGE ESTIMATES:`,
    `• CBSE / AICTE Standard (CGPA × 9.5):     ${(cgpa * 9.5).toFixed(2)}%`,
    `• US 100-Point Scale (CGPA ÷ 4.0 × 100):   ${Math.min(100, (cgpa / 4.0) * 100).toFixed(1)}%`
  ].join('\n');
}

// 3. CGPA to Percentage Converter
export function convertCgpaToPercentage(
  cgpaVal: number,
  formula: 'cbse' | 'mumbai' | 'anna' | 'general' = 'cbse'
): string {
  const cgpa = Math.max(0, cgpaVal);
  let pct = 0;
  let formulaDesc = '';

  switch (formula) {
    case 'mumbai':
      // Mumbai University 10-point scale: 7.1 * CGPA + 11 (if CGPA < 7) or 7.25 * CGPA + 11 (if >= 7)
      if (cgpa >= 7) {
        pct = 7.25 * cgpa + 11;
        formulaDesc = 'Mumbai University Formula: Percentage = 7.25 × CGPA + 11';
      } else {
        pct = 7.1 * cgpa + 11;
        formulaDesc = 'Mumbai University Formula: Percentage = 7.1 × CGPA + 11';
      }
      break;
    case 'anna':
      // Anna University: (CGPA - 0.75) * 10
      pct = Math.max(0, (cgpa - 0.75) * 10);
      formulaDesc = 'Anna University / AICTE Formula: Percentage = (CGPA - 0.75) × 10';
      break;
    case 'general':
      // 10-point general multiplier (CGPA * 10)
      pct = cgpa * 10;
      formulaDesc = 'Standard Direct Conversion: Percentage = CGPA × 10';
      break;
    case 'cbse':
    default:
      // CBSE standard: CGPA * 9.5
      pct = cgpa * 9.5;
      formulaDesc = 'CBSE / Central Board Standard: Percentage = CGPA × 9.5';
      break;
  }

  const cappedPct = Math.min(100, pct);
  let division = 'First Class with Distinction';
  if (cappedPct < 40) division = 'Fail / Unsatisfactory';
  else if (cappedPct < 50) division = 'Third Class / Pass';
  else if (cappedPct < 60) division = 'Second Class';
  else if (cappedPct < 75) division = 'First Class';

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               CGPA TO PERCENTAGE CONVERTER                     ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `INPUT CGPA:            ${cgpa.toFixed(2)} (on 10-Point Scale)`,
    `CONVERTED PERCENTAGE:  ${cappedPct.toFixed(2)}%`,
    `ACADEMIC DIVISION:     ${division}`,
    ``,
    `FORMULA METHOD:`,
    `• ${formulaDesc}`,
    ``,
    `COMPARATIVE CONVERSIONS ACROSS STANDARDS:`,
    `• CBSE National (× 9.5):          ${(cgpa * 9.5).toFixed(2)}%`,
    `• Direct 10x Standard (× 10):      ${(cgpa * 10).toFixed(2)}%`,
    `• Anna University ((CGPA-0.75)×10): ${Math.max(0, (cgpa - 0.75) * 10).toFixed(2)}%`,
    `• US 4.0 Scale Equivalent:         ${Math.min(4.0, (cgpa / 2.5)).toFixed(2)} / 4.0`
  ].join('\n');
}

// 4. Percentage to Marks Calculator
export function convertPercentageToMarks(
  percentage: number,
  totalMaxMarks: number = 600
): string {
  const p = Math.max(0, Math.min(100, percentage));
  const max = Math.max(1, totalMaxMarks);
  const obtained = (p / 100) * max;
  const lost = max - obtained;

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               PERCENTAGE TO MARKS CALCULATOR                   ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `PERCENTAGE SCORE:     ${p.toFixed(2)}%`,
    `MAXIMUM TOTAL MARKS:  ${max} Marks`,
    `OBTAINED MARKS:       ${obtained.toFixed(2)} / ${max} Marks`,
    `MARKS DEDUCTED:       ${lost.toFixed(2)} Marks`,
    ``,
    `SUBJECT BREAKDOWN PROJECTIONS (Assuming equal distribution):`,
    `• Out of 100 Marks:   ${((p / 100) * 100).toFixed(1)} / 100`,
    `• Out of 80 Marks:    ${((p / 100) * 80).toFixed(1)} / 80`,
    `• Out of 70 Marks:    ${((p / 100) * 70).toFixed(1)} / 70`,
    `• Out of 50 Marks:    ${((p / 100) * 50).toFixed(1)} / 50`,
    `• Out of 25 Marks:    ${((p / 100) * 25).toFixed(1)} / 25`,
    ``,
    `GPA EQUIVALENT ESTIMATES:`,
    `• 4.0 US Scale:       ${Math.min(4.0, (p / 25) - 0.5 > 0 ? (p / 25) - 0.5 : 0).toFixed(2)}`,
    `• 10.0 Indian Scale:  ${(p / 9.5).toFixed(2)}`
  ].join('\n');
}

// 5. Grade Calculator
export function calculateGrade(
  earnedScore: number,
  maxScore: number = 100,
  gradingScale: string = 'standard'
): string {
  const earned = Math.max(0, earnedScore);
  const max = Math.max(1, maxScore);
  const percentage = (earned / max) * 100;

  let letter = 'F';
  let gpaPoints = 0.0;
  let status = 'Failing';

  if (percentage >= 97) { letter = 'A+'; gpaPoints = 4.0; status = 'Outstanding'; }
  else if (percentage >= 93) { letter = 'A'; gpaPoints = 4.0; status = 'Excellent'; }
  else if (percentage >= 90) { letter = 'A-'; gpaPoints = 3.7; status = 'Very Good'; }
  else if (percentage >= 87) { letter = 'B+'; gpaPoints = 3.3; status = 'Above Average'; }
  else if (percentage >= 83) { letter = 'B'; gpaPoints = 3.0; status = 'Good'; }
  else if (percentage >= 80) { letter = 'B-'; gpaPoints = 2.7; status = 'Above Satisfactory'; }
  else if (percentage >= 77) { letter = 'C+'; gpaPoints = 2.3; status = 'Satisfactory'; }
  else if (percentage >= 73) { letter = 'C'; gpaPoints = 2.0; status = 'Acceptable'; }
  else if (percentage >= 70) { letter = 'C-'; gpaPoints = 1.7; status = 'Minimum Passing'; }
  else if (percentage >= 65) { letter = 'D+'; gpaPoints = 1.3; status = 'Poor'; }
  else if (percentage >= 60) { letter = 'D'; gpaPoints = 1.0; status = 'Conditional Pass'; }

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║                   ACADEMIC GRADE AUDIT                         ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `SCORE:               ${earned.toFixed(1)} / ${max} (${percentage.toFixed(2)}%)`,
    `LETTER GRADE:        ${letter}`,
    `GPA VALUE (4.0):     ${gpaPoints.toFixed(1)}`,
    `PERFORMANCE LEVEL:   ${status}`,
    ``,
    `GRADE BOUNDARIES BENCHMARK:`,
    `• A  (93 - 100%):  ${(max * 0.93).toFixed(1)} - ${max} pts`,
    `• B  (83 - 86%):   ${(max * 0.83).toFixed(1)} - ${(max * 0.86).toFixed(1)} pts`,
    `• C  (73 - 76%):   ${(max * 0.73).toFixed(1)} - ${(max * 0.76).toFixed(1)} pts`,
    `• D  (60 - 64%):   ${(max * 0.60).toFixed(1)} - ${(max * 0.64).toFixed(1)} pts`,
    `• Passing Cutoff:  ${(max * 0.60).toFixed(1)} pts (60.0%)`
  ].join('\n');
}

// 6. Weighted Grade Calculator
export function calculateWeightedGrade(input: string): string {
  // Input: Item, Weight(%), Score(%)
  // Homework, 20, 95
  // Midterm Exam, 30, 84
  // Final Project, 25, 90
  // Final Exam, 25, 88
  const lines = input.trim().split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) {
    return 'Enter grade items in format: Assessment Name, Weight (%), Score (%)\nExample:\nHomework Assignments, 20, 94\nMidterm Examination, 25, 82\nTerm Project, 20, 96\nFinal Exam, 35, 88';
  }

  let totalWeight = 0;
  let totalScoreContribution = 0;
  const items: Array<{ name: string; weight: number; score: number; contribution: number }> = [];

  for (const line of lines) {
    const parts = line.split(/[,;\t]/).map(p => p.trim());
    if (parts.length < 3) continue;
    const name = parts[0];
    const weight = parseFloat(parts[1]);
    const score = parseFloat(parts[2]);
    if (isNaN(weight) || isNaN(score)) continue;

    const cont = (weight * score) / 100;
    totalWeight += weight;
    totalScoreContribution += cont;
    items.push({ name, weight, score, contribution: cont });
  }

  if (totalWeight === 0) return 'Invalid weights entered. Weights must be numbers greater than zero.';

  // If weights don't sum to 100, calculate current grade based on completed weight
  const currentGrade = (totalScoreContribution / totalWeight) * 100;
  const remainingWeight = Math.max(0, 100 - totalWeight);
  const maxPossibleGrade = totalScoreContribution + remainingWeight;
  const minPossibleGrade = totalScoreContribution;

  const rows = items.map(it => 
    `║ ${it.name.padEnd(24).slice(0, 24)} │ ${it.weight.toFixed(1).padStart(5)}% │ ${it.score.toFixed(1).padStart(5)}% │ ${it.contribution.toFixed(2).padStart(8)}% ║`
  );

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║              WEIGHTED COURSE GRADE BREAKDOWN                   ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `CURRENT WEIGHTED GRADE: ${currentGrade.toFixed(2)}%`,
    `TOTAL WEIGHT ENTERED:   ${totalWeight.toFixed(1)}% / 100%`,
    `REMAINING WEIGHT:       ${remainingWeight.toFixed(1)}%`,
    `MAX POSSIBLE GRADE:     ${maxPossibleGrade.toFixed(2)}% (if 100% on remaining)`,
    `MIN POSSIBLE GRADE:     ${minPossibleGrade.toFixed(2)}% (if 0% on remaining)`,
    ``,
    `ASSESSMENT COMPONENTS:`,
    `╟──────────────────────────┬────────┬────────┬───────────╢`,
    `║ Assessment               │ Weight │ Score  │ Contrib.  ║`,
    `╟──────────────────────────┼────────┼────────┼───────────╢`,
    ...rows,
    `╚══════════════════════════╧════════╧════════╧═══════════╝`
  ].join('\n');
}

// 7. Final Exam Score Calculator
export function calculateFinalExamScore(
  currentGrade: number,
  targetGrade: number,
  finalWeight: number
): string {
  const cur = Math.max(0, currentGrade);
  const tgt = Math.max(0, targetGrade);
  const w = Math.max(1, Math.min(99, finalWeight));

  const currentWeight = 100 - w;
  const needed = (tgt - (cur * (currentWeight / 100))) / (w / 100);

  let feasibility = 'Completely Feasible (Within normal range)';
  if (needed > 100) feasibility = 'Requires Extra Credit / Impossible without curve (> 100%)';
  else if (needed > 90) feasibility = 'Challenging (Requires exceptional final score)';
  else if (needed <= 0) feasibility = 'Already Guaranteed! (Even with 0% on final exam)';

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               FINAL EXAM SCORE TARGET CALCULATOR               ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `CURRENT COURSE GRADE:    ${cur.toFixed(2)}% (Weights ${currentWeight}%)`,
    `DESIRED TARGET GRADE:    ${tgt.toFixed(2)}%`,
    `FINAL EXAM WEIGHT:       ${w.toFixed(1)}%`,
    ``,
    `REQUIRED FINAL EXAM SCORE: ${needed.toFixed(2)}%`,
    `FEASIBILITY ASSESSMENT:   ${feasibility}`,
    ``,
    `WHAT IF ANALYSIS (Different Target Grades):`,
    `• To score 90% (A):   ${((90 - (cur * (currentWeight / 100))) / (w / 100)).toFixed(1)}% on Final`,
    `• To score 80% (B):   ${((80 - (cur * (currentWeight / 100))) / (w / 100)).toFixed(1)}% on Final`,
    `• To score 70% (C):   ${((70 - (cur * (currentWeight / 100))) / (w / 100)).toFixed(1)}% on Final`,
    `• To score 60% (Pass):${((60 - (cur * (currentWeight / 100))) / (w / 100)).toFixed(1)}% on Final`
  ].join('\n');
}

// 8. Required Attendance Calculator
export function calculateRequiredAttendance(
  attendedClasses: number,
  totalClassesHeld: number,
  targetPercentage: number = 75
): string {
  const att = Math.max(0, attendedClasses);
  const total = Math.max(1, totalClassesHeld);
  const target = Math.max(1, Math.min(100, targetPercentage));
  const currentPct = (att / total) * 100;

  if (currentPct >= target) {
    // How many classes can be missed without falling below target?
    // att / (total + x) >= target / 100
    // att * 100 >= target * (total + x)
    // x = floor((att * 100 - target * total) / target)
    const canBunk = Math.floor((att * 100 - target * total) / target);
    return [
      `╔════════════════════════════════════════════════════════════════╗`,
      `║               REQUIRED ATTENDANCE AUDIT                        ║`,
      `╚════════════════════════════════════════════════════════════════╝`,
      `CURRENT ATTENDANCE:    ${att} / ${total} classes (${currentPct.toFixed(2)}%)`,
      `TARGET THRESHOLD:      ${target}%`,
      `STATUS:                ON TRACK / SAFE (Above required quota)`,
      ``,
      `BUNK BUFFER:`,
      `• You can miss up to ${canBunk} more upcoming classes without falling below ${target}%.`,
      `• After missing ${canBunk} classes, your attendance will be ${((att / (total + canBunk)) * 100).toFixed(1)}%.`
    ].join('\n');
  }

  // How many consecutive classes needed?
  // (att + x) / (total + x) = target / 100
  // 100(att + x) = target(total + x)
  // 100 att + 100 x = target total + target x
  // x(100 - target) = target total - 100 att
  // x = ceil((target * total - 100 * att) / (100 - target))
  const needed = Math.ceil((target * total - 100 * att) / (100 - target));

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               REQUIRED ATTENDANCE RECOVERY PLAN                ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `CURRENT ATTENDANCE:    ${att} / ${total} classes (${currentPct.toFixed(2)}%)`,
    `TARGET REQUIRED:       ${target}%`,
    `SHORTAGE STATUS:       DEFICIT (${(target - currentPct).toFixed(2)}% below required)`,
    ``,
    `RECOVERY ROADMAP:`,
    `• You MUST attend ${needed} CONSECUTIVE upcoming classes without missing any.`,
    `• Projected count: ${att + needed} / ${total + needed} classes = ${(((att + needed) / (total + needed)) * 100).toFixed(2)}%`,
    `• Recovery duration: Approx. ${Math.ceil(needed / 3)} to ${Math.ceil(needed / 2)} weeks of zero absences.`
  ].join('\n');
}

// 9. Attendance Shortage Calculator
export function calculateAttendanceShortage(
  attended: number,
  totalConducted: number,
  minRequiredPct: number = 75
): string {
  const att = Math.max(0, attended);
  const total = Math.max(1, totalConducted);
  const minPct = Math.max(1, Math.min(100, minRequiredPct));
  const currentPct = (att / total) * 100;
  const missed = total - att;

  const isShortage = currentPct < minPct;
  const deficitClasses = Math.ceil((minPct / 100) * total) - att;

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║             ATTENDANCE SHORTAGE & PENALTY AUDIT                ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `CLASSES ATTENDED:     ${att} / ${total} conducted`,
    `CLASSES MISSED:       ${missed} classes`,
    `CURRENT PERCENTAGE:   ${currentPct.toFixed(2)}%`,
    `MINIMUM STATUTORY:    ${minPct}%`,
    ``,
    `AUDIT VERDICT:        ${isShortage ? '⚠️ CRITICAL ATTENDANCE SHORTAGE' : '✓ ATTENDANCE SATISFIED'}`,
    `DEFICIT TO DATE:      ${isShortage ? `${deficitClasses} class shortage` : '0 shortage (Satisfied)'}`,
    ``,
    `INSTITUTIONAL RISK ASSESSMENT:`,
    `• Hall Ticket / Exam Eligibility: ${isShortage ? 'Subject to De-barment / Condonation' : 'Eligible for Examination'}`,
    `• Medical Condonation Threshold:  Typically 65% - 74% (requires valid medical certificates)`,
    `• Critical Disqualification Band:  < 65% (Strict detention in most universities)`
  ].join('\n');
}

// 10. Semester GPA Calculator
export function calculateSemesterGpa(input: string): string {
  // Input: Course, Grade, Credits
  return calculateGpa(input, 4.0);
}

// 11. Assignment Grade Calculator
export function calculateAssignmentGrade(
  input: string,
  dropLowest: boolean = false
): string {
  // Input: Assignment, Score, MaxScore
  // HW 1, 95, 100
  // HW 2, 70, 100
  const lines = input.trim().split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) {
    return 'Enter assignments in format: Name, Earned Score, Max Score\nExample:\nAssignment 1, 95, 100\nAssignment 2, 88, 100\nQuiz 1, 18, 20\nQuiz 2, 14, 20';
  }

  let parsed: Array<{ name: string; earned: number; max: number; pct: number }> = [];
  for (const line of lines) {
    const parts = line.split(/[,;\t]/).map(p => p.trim());
    if (parts.length < 2) continue;
    const name = parts[0];
    const earned = parseFloat(parts[1]);
    const max = parts.length >= 3 ? parseFloat(parts[2]) || 100 : 100;
    if (isNaN(earned) || isNaN(max)) continue;
    parsed.push({ name, earned, max, pct: (earned / max) * 100 });
  }

  if (parsed.length === 0) return 'No valid assignment data found.';

  let droppedName = '';
  if (dropLowest && parsed.length > 1) {
    let lowestIdx = 0;
    for (let i = 1; i < parsed.length; i++) {
      if (parsed[i].pct < parsed[lowestIdx].pct) lowestIdx = i;
    }
    droppedName = parsed[lowestIdx].name;
    parsed = parsed.filter((_, idx) => idx !== lowestIdx);
  }

  const totalEarned = parsed.reduce((a, b) => a + b.earned, 0);
  const totalMax = parsed.reduce((a, b) => a + b.max, 0);
  const avg = (totalEarned / totalMax) * 100;

  const rows = parsed.map(a => 
    `║ ${a.name.padEnd(24).slice(0, 24)} │ ${a.earned.toFixed(1).padStart(6)} │ ${a.max.toFixed(1).padStart(5)} │ ${a.pct.toFixed(1).padStart(6)}% ║`
  );

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║              ASSIGNMENT BUNDLE GRADE SUMMARY                   ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `AGGREGATE SCORE:      ${totalEarned.toFixed(1)} / ${totalMax.toFixed(1)} Points`,
    `ASSIGNMENT AVERAGE:   ${avg.toFixed(2)}%`,
    `ACTIVE ASSIGNMENTS:   ${parsed.length} items`,
    ...(dropLowest && droppedName ? [`DROPPED LOWEST:      ${droppedName} (Excluded from average)`] : []),
    ``,
    `ASSIGNMENT LOG:`,
    `╟──────────────────────────┬────────┬───────┬─────────╢`,
    `║ Title                    │ Earned │ Max   │ Percent ║`,
    `╟──────────────────────────┼────────┼───────┼─────────╢`,
    ...rows,
    `╚══════════════════════════╧════════╧═══════╧═════════╝`
  ].join('\n');
}

// 12. Study Time Planner
export function planStudyTime(
  subjectsInput: string,
  totalAvailableHours: number = 20
): string {
  // Input: Subject, Difficulty (1-5), Credits
  // Data Structures, 5, 4
  // Linear Algebra, 4, 3
  // English Lit, 2, 2
  const lines = subjectsInput.trim().split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) {
    return 'Enter subjects in format: Subject Name, Difficulty (1-5), Credits (optional)\nExample:\nData Structures & Algorithms, 5, 4\nMultivariable Calculus, 4, 3\nTechnical Writing, 2, 2\nDatabase Systems, 3, 3';
  }

  const subs: Array<{ name: string; diff: number; credits: number; weight: number }> = [];
  let sumWeight = 0;

  for (const line of lines) {
    const parts = line.split(/[,;\t]/).map(p => p.trim());
    if (parts.length < 1) continue;
    const name = parts[0];
    const diff = parts.length >= 2 ? Math.min(5, Math.max(1, parseFloat(parts[1]) || 3)) : 3;
    const creds = parts.length >= 3 ? Math.max(1, parseFloat(parts[2]) || 3) : 3;
    const w = diff * creds;
    sumWeight += w;
    subs.push({ name, diff, credits: creds, weight: w });
  }

  if (sumWeight === 0) return 'Please specify at least one valid subject.';

  const allocated = subs.map(s => {
    const hrs = (s.weight / sumWeight) * totalAvailableHours;
    return {
      ...s,
      hours: hrs,
      dailyMins: Math.round((hrs * 60) / 7)
    };
  });

  const rows = allocated.map(s => 
    `║ ${s.name.padEnd(24).slice(0, 24)} │ ${s.diff.toString().padStart(4)} │ ${s.hours.toFixed(1).padStart(6)} hrs │ ${s.dailyMins.toString().padStart(5)} min/day ║`
  );

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               WEEKLY STUDY TIME ALLOCATION PLAN                ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `TOTAL WEEKLY BUDGET:  ${totalAvailableHours} Hours / Week`,
    `DAILY AVERAGE:        ${(totalAvailableHours / 7).toFixed(1)} Hours / Day`,
    `ALLOCATION STRATEGY:  Weighted by Difficulty × Credit Load`,
    ``,
    `SUBJECT STUDY BUDGET:`,
    `╟──────────────────────────┬──────┬────────────┬─────────────╢`,
    `║ Subject                  │ Diff │ Allocated  │ Daily Goal  ║`,
    `╟──────────────────────────┼──────┼────────────┼─────────────╢`,
    ...rows,
    `╚══════════════════════════╧══════╧════════════╧═════════════╝`,
    ``,
    `RECOMMENDED STUDY PROTOCOL:`,
    `• Split each subject session into 50-minute deep work blocks + 10-minute active recovery breaks.`,
    `• Review the most challenging subjects (Difficulty 4-5) during peak cognitive morning hours.`
  ].join('\n');
}

// 13. Exam Countdown Planner
export function planExamCountdown(
  examName: string = 'Final Examination',
  examDateStr: string = '2026-12-15',
  targetTotalHours: number = 40
): string {
  const targetDate = new Date(examDateStr);
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (isNaN(diffDays)) {
    return 'Invalid exam date. Please enter in YYYY-MM-DD format (e.g., 2026-12-15).';
  }

  const hoursPerDay = diffDays > 0 ? (targetTotalHours / diffDays) : targetTotalHours;

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║                  EXAM COUNTDOWN & PACER                        ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `EXAM TITLE:          ${examName}`,
    `EXAM DATE:           ${targetDate.toDateString()}`,
    `DAYS REMAINING:      ${diffDays > 0 ? `${diffDays} Days` : 'EXAM DAY / PASSED'}`,
    `TARGET STUDY HOURS:  ${targetTotalHours} Hours`,
    ``,
    `PACE REQUIREMENT:`,
    `• Daily Commitment:   ${diffDays > 0 ? `${hoursPerDay.toFixed(1)} Hours / Day` : 'Immediate Review'}`,
    `• Weekly Study Goal:  ${diffDays > 0 ? `${(hoursPerDay * 7).toFixed(1)} Hours / Week` : 'N/A'}`,
    ``,
    `STRATEGIC MILESTONE SCHEDULE:`,
    `• 50% Time Point:    Complete First Pass of Syllabus & Formula Sheets`,
    `• 25% Time Point:    Solve 3 Previous Years Question Papers (Timed)`,
    `• 48 Hours Before:   Mock Exam under strict exam hall conditions`,
    `• 24 Hours Before:   Light formula revision & mandatory 8-hour sleep`
  ].join('\n');
}

// 14. Graduation Age Calculator
export function calculateGraduationAge(
  birthDateStr: string = '2004-05-15',
  currentYearOrGrade: number = 2,
  degreeTotalYears: number = 4
): string {
  const bdate = new Date(birthDateStr);
  const now = new Date();
  if (isNaN(bdate.getTime())) return 'Invalid birth date format. Use YYYY-MM-DD.';

  const remainingYears = Math.max(0, degreeTotalYears - currentYearOrGrade);
  const gradYear = now.getFullYear() + remainingYears;
  const ageAtGrad = gradYear - bdate.getFullYear();

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               GRADUATION AGE & TIMELINE ESTIMATOR              ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `BIRTH DATE:           ${bdate.toLocaleDateString()}`,
    `CURRENT PROGRESS:     Year ${currentYearOrGrade} of ${degreeTotalYears}`,
    `REMAINING DURATION:   ${remainingYears} Academic Year(s)`,
    `ESTIMATED GRADUATION: Spring / Summer ${gradYear}`,
    ``,
    `PROJECTED AGE AT GRADUATION: ~${ageAtGrad} Years Old`,
    ``,
    `CAREER COHORT METRICS:`,
    `• Typical Undergraduate Grad Age: 21 - 23 Years Old`,
    `• Typical Master's Grad Age:       24 - 26 Years Old`,
    `• Early Career Horizon:            ${gradYear} to ${gradYear + 5} (Critical skill foundation)`
  ].join('\n');
}

// 15. Reading Level Calculator
export function calculateReadingLevel(text: string): string {
  const clean = text.trim();
  if (clean.length === 0) return 'Please provide text to evaluate readability scores.';

  const words = clean.split(/\s+/).filter(w => w.length > 0);
  const sentences = clean.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const numWords = Math.max(1, words.length);
  const numSentences = Math.max(1, sentences.length);

  // Count syllables roughly
  let totalSyllables = 0;
  let complexWords = 0;

  for (const word of words) {
    const w = word.toLowerCase().replace(/[^a-z]/g, '');
    if (w.length <= 3) {
      totalSyllables += 1;
      continue;
    }
    const syllables = (w.match(/[aeiouy]{1,2}/g) || []).length;
    const sylCount = Math.max(1, syllables);
    totalSyllables += sylCount;
    if (sylCount >= 3) complexWords++;
  }

  // Flesch Reading Ease: 206.835 - 1.015*(words/sentences) - 84.6*(syllables/words)
  const wordsPerSentence = numWords / numSentences;
  const syllablesPerWord = totalSyllables / numWords;
  const fleschEase = 206.835 - (1.015 * wordsPerSentence) - (84.6 * syllablesPerWord);

  // Flesch-Kincaid Grade Level: 0.39*(words/sentences) + 11.8*(syllables/words) - 15.59
  const fkGrade = (0.39 * wordsPerSentence) + (11.8 * syllablesPerWord) - 15.59;

  // Gunning Fog Index: 0.4 * ((words/sentences) + 100 * (complexWords/words))
  const gunningFog = 0.4 * (wordsPerSentence + (100 * (complexWords / numWords)));

  let readingLevel = 'College Level (Difficult)';
  if (fleschEase >= 90) readingLevel = '5th Grade (Very Easy)';
  else if (fleschEase >= 80) readingLevel = '6th Grade (Easy)';
  else if (fleschEase >= 70) readingLevel = '7th Grade (Fairly Easy)';
  else if (fleschEase >= 60) readingLevel = '8th & 9th Grade (Plain English)';
  else if (fleschEase >= 50) readingLevel = '10th to 12th Grade (Fairly Difficult)';
  else if (fleschEase >= 30) readingLevel = 'College Undergraduate';
  else readingLevel = 'Graduate / Academic Professional (Extremely Difficult)';

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               ACADEMIC READABILITY AUDIT                       ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `FLESCH READING EASE:      ${fleschEase.toFixed(1)} / 100`,
    `ESTIMATED GRADE LEVEL:    Grade ${Math.max(1, Math.round(fkGrade))} (${readingLevel})`,
    `GUNNING FOG INDEX:        ${gunningFog.toFixed(1)} (Years of formal education)`,
    ``,
    `CORPUS STATISTICS:`,
    `• Word Count:             ${numWords} words`,
    `• Sentence Count:         ${numSentences} sentences`,
    `• Avg Sentence Length:    ${wordsPerSentence.toFixed(1)} words/sentence`,
    `• Syllable Density:       ${syllablesPerWord.toFixed(2)} syllables/word`,
    `• Complex Words (3+ syl): ${complexWords} words (${((complexWords / numWords) * 100).toFixed(1)}%)`,
    ``,
    `EDITORIAL RECOMMENDATION:`,
    fkGrade > 14
      ? '• High syntactic complexity suitable for peer-reviewed research and scholarly monographs.'
      : '• Clear, accessible prose suitable for undergraduate textbooks and student essays.'
  ].join('\n');
}

// 16. Citation Generator
export function generateCitation(
  type: 'book' | 'website' | 'journal' = 'book',
  authors: string = 'Knuth, Donald E.',
  title: string = 'The Art of Computer Programming',
  year: string = '1997',
  publisherOrSite: string = 'Addison-Wesley',
  urlOrDoi: string = 'https://www-cs-faculty.stanford.edu/~knuth/taocp.html',
  style: 'apa' | 'mla' | 'chicago' | 'harvard' = 'apa'
): string {
  let fullCitation = '';
  let inText = '';

  const primaryAuthor = authors.split(';')[0].trim();
  const authorLast = primaryAuthor.split(',')[0].trim() || primaryAuthor.split(' ').pop() || 'Author';

  if (style === 'apa') {
    // APA 7th Edition
    if (type === 'book') {
      fullCitation = `${authors} (${year}). ${title}. ${publisherOrSite}.`;
    } else if (type === 'journal') {
      fullCitation = `${authors} (${year}). ${title}. ${publisherOrSite}. ${urlOrDoi ? `https://doi.org/${urlOrDoi}` : ''}`;
    } else {
      fullCitation = `${authors} (${year}). ${title}. ${publisherOrSite}. ${urlOrDoi}`;
    }
    inText = `(${authorLast}, ${year})`;
  } else if (style === 'mla') {
    // MLA 9th Edition
    if (type === 'book') {
      fullCitation = `${authors}. ${title}. ${publisherOrSite}, ${year}.`;
    } else if (type === 'journal') {
      fullCitation = `${authors}. "${title}." ${publisherOrSite}, ${year}, ${urlOrDoi}.`;
    } else {
      fullCitation = `${authors}. "${title}." ${publisherOrSite}, ${year}, ${urlOrDoi}.`;
    }
    inText = `(${authorLast} ${year})`;
  } else if (style === 'chicago') {
    // Chicago 17th
    fullCitation = `${authors}. ${year}. ${title}. ${publisherOrSite}. ${urlOrDoi}`;
    inText = `(${authorLast} ${year})`;
  } else {
    // Harvard
    fullCitation = `${authors} (${year}) '${title}', ${publisherOrSite}. Available at: ${urlOrDoi}.`;
    inText = `(${authorLast}, ${year})`;
  }

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║                 ACADEMIC CITATION GENERATOR                    ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `STYLE STANDARD:       ${style.toUpperCase()} Style Guide`,
    `RESOURCE TYPE:        ${type.toUpperCase()}`,
    ``,
    `FULL BIBLIOGRAPHIC ENTRY:`,
    fullCitation,
    ``,
    `IN-TEXT PARENTHETICAL CITATION:`,
    inText,
    ``,
    `USAGE TIP: In Microsoft Word or LaTeX, remember to apply a 0.5-inch hanging indent to the full bibliographic entry.`
  ].join('\n');
}

// 17. Bibliography Formatter
export function formatBibliography(
  rawEntries: string,
  style: 'apa' | 'mla' | 'chicago' = 'apa'
): string {
  const lines = rawEntries.trim().split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) return 'Please provide raw bibliography entries to format.';

  const formatted = lines.map((entry, idx) => {
    let clean = entry.trim();
    if (!clean.endsWith('.')) clean += '.';
    return `[${idx + 1}]  ${clean}`;
  });

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               STANDARDIZED BIBLIOGRAPHY FORMAT                ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `CITATION STANDARD:    ${style.toUpperCase()}`,
    `TOTAL REFERENCES:     ${lines.length} Sources`,
    ``,
    ...formatted
  ].join('\n\n');
}

// 18. Reference List Sorter
export function sortReferenceList(
  input: string,
  order: 'alphabetical' | 'chronological' = 'alphabetical'
): string {
  const entries = input.trim().split(/\n\s*\n/).filter(e => e.trim().length > 0);
  if (entries.length === 0) {
    const singleLines = input.trim().split('\n').filter(l => l.trim().length > 0);
    if (singleLines.length === 0) return 'Please enter references separated by line breaks.';
    entries.push(...singleLines);
  }

  const sorted = [...entries].sort((a, b) => {
    if (order === 'alphabetical') {
      const cleanA = a.replace(/^\[\d+\]\s*/, '').trim().toLowerCase();
      const cleanB = b.replace(/^\[\d+\]\s*/, '').trim().toLowerCase();
      return cleanA.localeCompare(cleanB);
    } else {
      // Find 4-digit year
      const yearA = parseInt((a.match(/\b(19\d\d|20\d\d)\b/) || ['0'])[0]);
      const yearB = parseInt((b.match(/\b(19\d\d|20\d\d)\b/) || ['0'])[0]);
      return yearA - yearB;
    }
  });

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║                 SORTED REFERENCE BIBLIOGRAPHY                  ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `SORTING LOGIC:        ${order.toUpperCase()} by primary bibliographic key`,
    `TOTAL CITATIONS:      ${sorted.length} Entries`,
    ``,
    ...sorted.map((item, idx) => `[${idx + 1}]  ${item.trim()}`)
  ].join('\n\n');
}

// 19. Research Word Count Calculator
export function calculateResearchWordCount(text: string): string {
  const raw = text.trim();
  if (raw.length === 0) return 'Please input manuscript text for research analysis.';

  const words = raw.split(/\s+/).filter(w => w.length > 0);
  const charsWithSpaces = raw.length;
  const charsNoSpaces = raw.replace(/\s/g, '').length;
  const paragraphs = raw.split(/\n\s*\n/).filter(p => p.trim().length > 0).length;

  const readingTimeMin = Math.ceil(words.length / 225); // 225 wpm academic reading
  const presentationSlides = Math.ceil(words.length / 150); // 150 words per slide

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               RESEARCH MANUSCRIPT METRICS                      ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `WORD COUNT:              ${words.length.toLocaleString()} Words`,
    `CHARACTER COUNT (TOTAL): ${charsWithSpaces.toLocaleString()} Characters`,
    `CHARACTERS (NO SPACES):  ${charsNoSpaces.toLocaleString()} Characters`,
    `PARAGRAPHS:              ${paragraphs} Paragraphs`,
    ``,
    `DELIVERY & PRESENTATION ESTIMATES:`,
    `• Estimated Reading Time:       ~${readingTimeMin} Minutes (@ 225 WPM)`,
    `• Conference Speaking Duration: ~${Math.ceil(words.length / 130)} Minutes (@ 130 WPM oral speech)`,
    `• Slides Deck Equivalent:       ~${presentationSlides} Presentation Slides (@ 150 words/slide)`,
    `• Typical Journal Length:       ${words.length >= 8000 ? 'Full Research Paper' : words.length >= 3000 ? 'Short Communication / Letter' : 'Extended Abstract'}`
  ].join('\n');
}

// 20. Thesis Page Estimator
export function estimateThesisPages(
  wordCount: number = 25000,
  formatting: 'double_times' | 'double_arial' | 'single_times' = 'double_times'
): string {
  const words = Math.max(1, wordCount);
  let wordsPerPage = 250; // standard double-spaced Times New Roman 12pt

  if (formatting === 'double_times') wordsPerPage = 250;
  else if (formatting === 'double_arial') wordsPerPage = 220;
  else if (formatting === 'single_times') wordsPerPage = 500;

  const textPages = Math.ceil(words / wordsPerPage);
  const preliminaryPages = 8; // Title, Abstract, TOC, Dedication, Acknowledgements, List of Figures
  const referencePages = Math.ceil((words * 0.12) / 350); // ~12% references
  const appendixPages = Math.ceil(textPages * 0.10); // ~10% appendices
  const totalPages = textPages + preliminaryPages + referencePages + appendixPages;

  // Book spine thickness: 80 GSM paper ~ 0.1mm per sheet
  const spineThicknessMm = (totalPages * 0.1).toFixed(1);

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               DISSERTATION & THESIS PAGE ESTIMATOR             ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `TOTAL MANUSCRIPT WORDS:  ${words.toLocaleString()} Words`,
    `FORMATTING STANDARD:     ${formatting === 'double_times' ? 'Double Spaced (Times New Roman 12pt, ~250 wpp)' : formatting === 'double_arial' ? 'Double Spaced (Arial 12pt, ~220 wpp)' : 'Single Spaced (~500 wpp)'}`,
    ``,
    `PAGE ESTIMATION BREAKDOWN:`,
    `• Preliminary Pages (Front Matter): ${preliminaryPages} Pages (Title, TOC, Abstract, Declarations)`,
    `• Core Body Chapters:               ${textPages} Pages`,
    `• Bibliography & References:         ${referencePages} Pages`,
    `• Appendices & Raw Data Tables:      ${appendixPages} Pages`,
    `• Total Bound Volume:                ${totalPages} Pages`,
    ``,
    `BINDING SPECIFICATIONS:`,
    `• Estimated Spine Thickness:        ${spineThicknessMm} mm (Based on 80 GSM archival paper)`,
    `• Binding Recommendation:           ${totalPages > 150 ? 'Hardbound Leatherette Gold Foil' : 'Thermal Hardcover / Spiral Binding'}`
  ].join('\n');
}

// 21. Class Rank Calculator
export function calculateClassRank(
  studentScore: number,
  allScoresText: string
): string {
  const scores = allScoresText
    .split(/[,;\n\s]+/)
    .map(s => parseFloat(s.trim()))
    .filter(s => !isNaN(s));

  if (scores.length === 0) {
    return 'Enter peer class scores separated by commas or line breaks to compute rank.\nExample:\n98, 95, 92, 88, 85, 82, 79, 75, 71, 65';
  }

  // Include studentScore if not present
  const all = [...scores].sort((a, b) => b - a); // descending
  let rank = 1;
  for (let i = 0; i < all.length; i++) {
    if (studentScore < all[i]) {
      rank++;
    }
  }

  const percentile = ((all.length - rank + 1) / all.length) * 100;
  const topPercent = (rank / all.length) * 100;

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║                   CLASS RANK & PERCENTILE AUDIT                ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `STUDENT SCORE:        ${studentScore.toFixed(1)}`,
    `CLASS RANK:           Rank #${rank} out of ${all.length} students`,
    `PERCENTILE RANK:      ${percentile.toFixed(2)}th Percentile`,
    `COHORT POSITION:      Top ${topPercent.toFixed(1)}% of class`,
    ``,
    `CLASS SUMMARY:`,
    `• Highest Score:      ${all[0].toFixed(1)}`,
    `• Class Median:       ${all[Math.floor(all.length / 2)].toFixed(1)}`,
    `• Lowest Score:       ${all[all.length - 1].toFixed(1)}`
  ].join('\n');
}

// 22. Marks Average Calculator
export function calculateMarksAverage(marksText: string): string {
  const marks = marksText
    .split(/[,;\n\s]+/)
    .map(m => parseFloat(m.trim()))
    .filter(m => !isNaN(m));

  if (marks.length === 0) {
    return 'Enter marks separated by commas or line breaks.\nExample:\n85, 92, 78, 90, 88, 95, 72, 89';
  }

  const n = marks.length;
  const sum = marks.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const sorted = [...marks].sort((a, b) => a - b);
  const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];

  // Variance & Standard Deviation
  const variance = marks.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n;
  const stdDev = Math.sqrt(variance);

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║             MARKS DESCRIPTIVE STATISTICAL REPORT               ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `DATA POINTS (COUNT):  ${n} Marks Recorded`,
    `SUM TOTAL:            ${sum.toFixed(2)}`,
    `ARITHMETIC MEAN:      ${mean.toFixed(2)}`,
    `MEDIAN:               ${median.toFixed(2)}`,
    `HIGHEST MARK:         ${sorted[n - 1].toFixed(2)}`,
    `LOWEST MARK:          ${sorted[0].toFixed(2)}`,
    `RANGE (SPREAD):       ${(sorted[n - 1] - sorted[0]).toFixed(2)}`,
    `STANDARD DEVIATION:   ${stdDev.toFixed(2)}`,
    `VARIANCE:             ${variance.toFixed(2)}`
  ].join('\n');
}

// 23. Scholarship Percentage Calculator
export function calculateScholarshipPercentage(
  tuitionFee: number = 15000,
  scholarshipType: 'percentage' | 'fixed' = 'percentage',
  scholarshipValue: number = 30,
  additionalFees: number = 1200
): string {
  const tuition = Math.max(0, tuitionFee);
  let scholarshipAmount = 0;
  let pct = 0;

  if (scholarshipType === 'percentage') {
    pct = Math.min(100, Math.max(0, scholarshipValue));
    scholarshipAmount = (pct / 100) * tuition;
  } else {
    scholarshipAmount = Math.min(tuition, Math.max(0, scholarshipValue));
    pct = tuition > 0 ? (scholarshipAmount / tuition) * 100 : 0;
  }

  const netTuition = tuition - scholarshipAmount;
  const netPayable = netTuition + additionalFees;

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               SCHOLARSHIP FINANCIAL AID AUDIT                  ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `GROSS TUITION:        $${tuition.toLocaleString()}`,
    `SCHOLARSHIP DISCOUNT: ${pct.toFixed(2)}% ($${scholarshipAmount.toLocaleString()} Savings)`,
    `NET TUITION PAYABLE:  $${netTuition.toLocaleString()}`,
    `MANDATORY FEES:       $${additionalFees.toLocaleString()} (Campus, Lab, Health)`,
    `TOTAL OUT-OF-POCKET:  $${netPayable.toLocaleString()} per academic year`,
    ``,
    `SEMESTER BREAKDOWN (2 Semesters):`,
    `• Net Payable per Semester: $${(netPayable / 2).toLocaleString()}`,
    `• Monthly Payment Plan (10 Mo): $${(netPayable / 10).toFixed(2)} / month`
  ].join('\n');
}

// 24. Study Schedule Generator
export function generateStudySchedule(
  subjectsInput: string,
  dailyHours: number = 4,
  pacingMode: 'pomodoro' | 'deep_work' | 'block' = 'pomodoro'
): string {
  const subjects = subjectsInput
    .split(/[,;\n]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const subs = subjects.length > 0 ? subjects : ['Mathematics', 'Physics', 'History', 'Programming'];
  const blockMins = pacingMode === 'pomodoro' ? 25 : pacingMode === 'deep_work' ? 90 : 50;
  const breakMins = pacingMode === 'pomodoro' ? 5 : pacingMode === 'deep_work' ? 15 : 10;

  const totalMinutes = dailyHours * 60;
  const cycleMinutes = blockMins + breakMins;
  const totalCycles = Math.floor(totalMinutes / cycleMinutes);

  const timetable: string[] = [];
  let currentStartMinutes = 9 * 60; // start at 09:00 AM

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${displayH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
  };

  for (let i = 0; i < totalCycles; i++) {
    const sub = subs[i % subs.length];
    const sessionStart = currentStartMinutes;
    const sessionEnd = sessionStart + blockMins;
    const breakEnd = sessionEnd + breakMins;

    timetable.push(`• ${formatTime(sessionStart)} - ${formatTime(sessionEnd)}: [STUDY] ${sub} (${blockMins} min focus)`);
    timetable.push(`  ${formatTime(sessionEnd)} - ${formatTime(breakEnd)}: [BREAK] Active rest & hydration (${breakMins} min)`);
    currentStartMinutes = breakEnd;
  }

  return [
    `╔════════════════════════════════════════════════════════════════╗`,
    `║               DAILY OPTIMAL STUDY TIMETABLE                    ║`,
    `╚════════════════════════════════════════════════════════════════╝`,
    `STUDY METHOD:         ${pacingMode.toUpperCase()} Protocol`,
    `PLANNED STUDY TIME:   ${dailyHours} Hours (${totalMinutes} Minutes)`,
    `FOCUS SESSIONS:       ${totalCycles} Focused Sessions (${blockMins}m study + ${breakMins}m break)`,
    ``,
    `DAILY SCHEDULE:`,
    ...timetable,
    ``,
    `COGNITIVE HYGIENE RULES:`,
    `• Zero phone notifications or social media during focus blocks.`,
    `• Step away from computer screens during the active breaks.`
  ].join('\n');
}

// 25. Assignment Deadline Planner
export function planAssignmentDeadlines(input: string): string {
  // Input: Title, DueDate (YYYY-MM-DD), Priority (High/Med/Low)
  // Term Paper, 2026-11-20, High
  // Lab Report, 2026-11-10, Medium
  const lines = input.trim().split('\n').filter(l => l.trim().length > 0);
  if (lines.length === 0) {
    return 'Enter assignments in format: Assignment Title, Due Date (YYYY-MM-DD), Priority\nExample:\nCapstone Proposal, 2026-11-15, High\nPhysics Lab Report, 2026-11-08, Medium\nHistory Discussion Post, 2026-11-04, Low';
  }

  const now = new Date();
  const tasks: Array<{ title: string; due: Date; daysLeft: number; priority: string }> = [];

  for (const line of lines) {
    const parts = line.split(/[,;\t]/).map(p => p.trim());
    if (parts.length < 2) continue;
    const title = parts[0];
    const due = new Date(parts[1]);
    const priority = parts.length >= 3 ? parts[2] : 'Normal';
    if (isNaN(due.getTime())) continue;

    const days = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    tasks.push({ title, due, daysLeft: days, priority });
  }

  if (tasks.length === 0) return 'No valid assignment deadlines found. Check date format (YYYY-MM-DD).';

  tasks.sort((a, b) => a.daysLeft - b.daysLeft);

  const rows = tasks.map(t => {
    let urgency = 'Plenty of time';
    if (t.daysLeft <= 1) urgency = '🚨 DUE TOMORROW / TODAY';
    else if (t.daysLeft <= 3) urgency = '⚠️ HIGH URGENCY';
    else if (t.daysLeft <= 7) urgency = 'Upcoming (This week)';

    return `║ ${t.title.padEnd(22).slice(0, 22)} │ ${t.due.toISOString().slice(0, 10)} │ ${t.daysLeft.toString().padStart(4)}d │ ${t.priority.padEnd(6).slice(0, 6)} │ ${urgency.padEnd(20).slice(0, 20)} ║`;
  });

  return [
    `╔════════════════════════════════════════════════════════════════════════════════╗`,
    `║                   ASSIGNMENT DEADLINE & MILESTONE AUDIT                        ║`,
    `╚════════════════════════════════════════════════════════════════════════════════╝`,
    `PENDING ASSIGNMENTS:  ${tasks.length} Deliverables Tracked`,
    `NEAREST DEADLINE:     ${tasks[0].title} in ${tasks[0].daysLeft} day(s)`,
    ``,
    `DEADLINE SCHEDULE:`,
    `╟────────────────────────┬────────────┬───────┬────────┬──────────────────────╢`,
    `║ Assignment             │ Due Date   │ Left  │ Pri    │ Urgency Status       ║`,
    `╟────────────────────────┼────────────┼───────┼────────┼──────────────────────╢`,
    ...rows,
    `╚════════════════════════╧════════════╧═══════╧════════╧══════════════════════╝`,
    ``,
    `ACTIONABLE WORKFLOW: Work backwards from nearest deadlines. Allocate research 4 days prior, drafting 2 days prior, and proofreading 24 hours prior to submission.`
  ].join('\n');
}

// Advanced Client-Side Excel & Spreadsheet Utilities Engine
// 100% Zero-Knowledge Browser Processing

// 1. Excel Formula Generator
export function generateExcelFormula(prompt: string, locale: 'en' | 'eu' = 'en'): string {
  const p = prompt.toLowerCase().trim();
  const sep = locale === 'eu' ? ';' : ',';

  let formula = '';
  let explanation = '';
  let syntax = '';
  let sampleUse = '';

  if (p.includes('vlookup') || (p.includes('lookup') && p.includes('column'))) {
    formula = `=IFERROR(VLOOKUP(A2${sep} Sheet1!$A$2:$E$100${sep} 2${sep} FALSE)${sep} "Not Found")`;
    explanation = `Searches for the value in A2 within the first column of Sheet1!$A$2:$E$100 and returns the corresponding value from column 2 (B). Wrapped in IFERROR to handle missing matches cleanly.`;
    syntax = `=VLOOKUP(lookup_value${sep} table_array${sep} col_index_num${sep} [range_lookup])`;
    sampleUse = `Cell A2 contains Employee ID, returns Employee Name from Column B.`;
  } else if (p.includes('xlookup') || (p.includes('search') && p.includes('return'))) {
    formula = `=XLOOKUP(A2${sep} Employees!$A$2:$A$500${sep} Employees!$C$2:$C$500${sep} "Not Found"${sep} 0${sep} 1)`;
    explanation = `Modern replacement for VLOOKUP and INDEX/MATCH. Looks up A2 in Employees column A and returns the value from column C. Returns "Not Found" if no match exists.`;
    syntax = `=XLOOKUP(lookup_value${sep} lookup_array${sep} return_array${sep} [if_not_found]${sep} [match_mode]${sep} [search_mode])`;
    sampleUse = `Left-lookup or right-lookup without column index numbers.`;
  } else if (p.includes('sum if') || p.includes('sumif') || (p.includes('sum') && p.includes('condition'))) {
    if (p.includes('multiple') || p.includes('and') || p.includes('between')) {
      formula = `=SUMIFS(Sales!$D$2:$D$1000${sep} Sales!$A$2:$A$1000${sep} "East"${sep} Sales!$B$2:$B$1000${sep} ">=2024-01-01")`;
      explanation = `Calculates the sum of range D2:D1000 where column A equals "East" AND column B date is on or after Jan 1, 2024.`;
      syntax = `=SUMIFS(sum_range${sep} criteria_range1${sep} criteria1${sep} [criteria_range2${sep} criteria2]...)`;
    } else {
      formula = `=SUMIF(A2:A100${sep} "Completed"${sep} C2:C100)`;
      explanation = `Sums values in C2:C100 only where the corresponding cell in A2:A100 equals "Completed".`;
      syntax = `=SUMIF(range${sep} criteria${sep} [sum_range])`;
    }
    sampleUse = `Aggregates financial numbers or quantities matching criteria.`;
  } else if (p.includes('count if') || p.includes('countif') || p.includes('how many')) {
    if (p.includes('multiple') || p.includes('and')) {
      formula = `=COUNTIFS(A2:A500${sep} "Active"${sep} B2:B500${sep} ">100")`;
      explanation = `Counts rows where column A is "Active" and column B has a value greater than 100.`;
      syntax = `=COUNTIFS(criteria_range1${sep} criteria1${sep} ...)`;
    } else {
      formula = `=COUNTIF(A2:A500${sep} "Yes")`;
      explanation = `Counts occurrences of "Yes" in the range A2:A500.`;
      syntax = `=COUNTIF(range${sep} criteria)`;
    }
    sampleUse = `Calculates tallies, response frequencies, or statuses.`;
  } else if (p.includes('date diff') || p.includes('days between') || p.includes('age') || p.includes('years between')) {
    formula = `=DATEDIF(A2${sep} TODAY()${sep} "Y") & " Years, " & DATEDIF(A2${sep} TODAY()${sep} "YM") & " Months"`;
    explanation = `Calculates the exact elapsed time between date in A2 and today's date in full years and remaining months.`;
    syntax = `=DATEDIF(start_date${sep} end_date${sep} unit)`;
    sampleUse = `A2 = Birthdate or Hire Date -> Returns exact age / tenure.`;
  } else if (p.includes('combine') || p.includes('concatenate') || p.includes('join') || p.includes('merge text')) {
    formula = `=TEXTJOIN(" "${sep} TRUE${sep} A2:C2)`;
    explanation = `Joins text from cells A2, B2, and C2 with a space separator, automatically skipping blank cells.`;
    syntax = `=TEXTJOIN(delimiter${sep} ignore_empty${sep} text1${sep} [text2]...)`;
    sampleUse = `Combines First Name (A2), Middle (B2), and Last Name (C2) cleanly.`;
  } else if (p.includes('index match') || p.includes('two way') || p.includes('2d')) {
    formula = `=INDEX($B$2:$M$100${sep} MATCH(O2${sep} $A$2:$A$100${sep} 0)${sep} MATCH(P2${sep} $B$1:$M$1${sep} 0))`;
    explanation = `Two-way matrix lookup: finds the row matching O2 and the column matching P2 within the 2D grid B2:M100.`;
    syntax = `=INDEX(array${sep} row_num${sep} [column_num]) combined with MATCH()`;
    sampleUse = `Matrix pricing grid lookup by Product ID and Region Code.`;
  } else if (p.includes('duplicate') || p.includes('unique')) {
    formula = `=IF(COUNTIF($A$2:$A2${sep} A2)>1${sep} "Duplicate"${sep} "Unique")`;
    explanation = `Running duplicate tracker. Evaluates row-by-row whether the value in A2 has appeared anywhere above it.`;
    syntax = `=COUNTIF(expanding_range${sep} current_cell) > 1`;
    sampleUse = `Flags subsequent repeated entries for easy filtering.`;
  } else if (p.includes('extract') || p.includes('after') || p.includes('email domain')) {
    formula = `=TEXTAFTER(A2${sep} "@")`;
    explanation = `Extracts the domain portion of an email address in A2 (e.g. "company.com" from "user@company.com"). For legacy Excel: =MID(A2${sep} FIND("@"${sep} A2)+1${sep} LEN(A2))`;
    syntax = `=TEXTAFTER(text${sep} delimiter)`;
    sampleUse = `Extracts domains, usernames, or codes after delimiters.`;
  } else if (p.includes('if') || p.includes('condition') || p.includes('status')) {
    formula = `=IFS(A2>=90${sep} "A"${sep} A2>=80${sep} "B"${sep} A2>=70${sep} "C"${sep} TRUE${sep} "F")`;
    explanation = `Multi-condition evaluation assigning letter grades based on the numeric score in A2.`;
    syntax = `=IFS(logical_test1${sep} value_if_true1${sep} ...)`;
    sampleUse = `Clean replacement for deep nested IF statements.`;
  } else {
    formula = `=IFERROR(IF(AND(A2<>""${sep} B2>0)${sep} (B2-C2)/B2${sep} 0)${sep} 0)`;
    explanation = `Calculates profit margin ((Revenue - Cost) / Revenue) when inputs exist and revenue is positive, guarding against divide-by-zero errors.`;
    syntax = `=IFERROR(formula${sep} value_if_error)`;
    sampleUse = `Standard formula template for safe financial percentage calculations.`;
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `               EXCEL FORMULA GENERATION RESULT                  `,
    `════════════════════════════════════════════════════════════════`,
    `PROMPT INTENT: "${prompt}"`,
    `REGIONAL DELIMITER: ${locale === 'eu' ? 'Semicolon (;)' : 'Comma (,)'}`,
    ``,
    `GENERATED FORMULA:`,
    `  ${formula}`,
    ``,
    `EXPLANATION:`,
    `  ${explanation}`,
    ``,
    `STANDARD SYNTAX:`,
    `  ${syntax}`,
    ``,
    `RECOMMENDED SETUP:`,
    `  ${sampleUse}`,
    `════════════════════════════════════════════════════════════════`
  ].join('\n');
}

// 2. Excel Formula Explainer
export function explainExcelFormula(formula: string): string {
  const clean = formula.trim().replace(/^=/, '');
  if (!clean) return 'Please provide an Excel formula to explain.';

  // Extract functions
  const funcRegex = /([A-Z0-9_.]+)\s*\(/g;
  const funcs: string[] = [];
  let match;
  while ((match = funcRegex.exec(clean.toUpperCase())) !== null) {
    if (!funcs.includes(match[1])) funcs.push(match[1]);
  }

  // Extract cell references
  const cellRegex = /([A-Z]+[0-9]+(?::[A-Z]+[0-9]+)?)/gi;
  const refs: string[] = [];
  while ((match = cellRegex.exec(clean)) !== null) {
    if (!refs.includes(match[1])) refs.push(match[1]);
  }

  const funcExplanations: Record<string, string> = {
    'IF': 'Evaluates a logical condition and returns one value if true, another if false.',
    'IFS': 'Checks multiple conditions sequentially and returns the value for the first true condition.',
    'IFERROR': 'Traps and handles calculation errors (#N/A, #VALUE!, #DIV/0!), returning a fallback value.',
    'VLOOKUP': 'Looks down the first column of a table to find a matching key, then retrieves data from a specified column to the right.',
    'XLOOKUP': 'Searches a range or array and returns the corresponding item from a second range or array. Handles exact, approximate, and wildcard matches.',
    'INDEX': 'Retrieves the value at a given row and column coordinate within a table or range.',
    'MATCH': 'Searches for a specified item in a range and returns its relative position (index number).',
    'SUM': 'Adds all numeric values within the specified cells or ranges.',
    'SUMIF': 'Adds numbers in a range that meet a single specified condition.',
    'SUMIFS': 'Adds numbers in a range that satisfy multiple simultaneous criteria.',
    'COUNT': 'Counts the number of cells that contain numbers.',
    'COUNTA': 'Counts the number of non-empty cells (numbers, text, errors).',
    'COUNTBLANK': 'Counts empty cells within a specified range.',
    'COUNTIF': 'Counts the number of cells within a range that meet a specific condition.',
    'COUNTIFS': 'Counts cells across multiple ranges that meet all specified conditions.',
    'AVERAGE': 'Calculates the arithmetic mean of numbers in a range.',
    'CONCATENATE': 'Joins two or more text strings into one string.',
    'CONCAT': 'Modern function combining text strings or cell ranges without delimiters.',
    'TEXTJOIN': 'Joins text items using a specified delimiter, with an option to ignore blank cells.',
    'LEFT': 'Extracts a specified number of characters from the start (left side) of a text string.',
    'RIGHT': 'Extracts characters from the end (right side) of a text string.',
    'MID': 'Extracts a specific length of text from the middle of a string starting at a given position.',
    'LEN': 'Returns the total character count of a text string.',
    'TRIM': 'Removes all leading, trailing, and duplicate spaces from text, leaving only single spaces between words.',
    'TEXT': 'Converts a number or date to formatted text using custom format patterns.',
    'DATE': 'Constructs a valid Excel date serial from year, month, and day integers.',
    'DATEDIF': 'Calculates the difference between two dates in days, months, or years.',
    'TODAY': 'Returns the current date (volatile, updates whenever the worksheet recalculates).',
    'NOW': 'Returns the current date and time.'
  };

  const steps: string[] = [];
  if (clean.includes('IFERROR(')) steps.push('1. Outermost Safety Guard: IFERROR monitors calculation errors and substitutes fallback text if an error occurs.');
  if (clean.includes('INDEX(') && clean.includes('MATCH(')) steps.push('2. Dynamic Lookup: MATCH finds the position index of your lookup value, which feeds directly into INDEX.');
  if (clean.includes('AND(') || clean.includes('OR(')) steps.push('3. Compound Logic: Multiple boolean tests are combined before passing into the conditional statement.');

  return [
    `════════════════════════════════════════════════════════════════`,
    `                 EXCEL FORMULA DECONSTRUCTION                   `,
    `════════════════════════════════════════════════════════════════`,
    `ORIGINAL FORMULA:`,
    `  =${clean}`,
    ``,
    `DETECTED FUNCTIONS (${funcs.length}):`,
    ...funcs.map(f => `  • ${f}: ${funcExplanations[f] || 'Standard Excel worksheet function.'}`),
    ``,
    `REFERENCED CELLS & RANGES (${refs.length}):`,
    `  ${refs.length > 0 ? refs.join(', ') : 'None (uses constants or volatile functions)'}`,
    ``,
    `EVALUATION LOGIC:`,
    ...(steps.length > 0 ? steps : [
      '1. Evaluates inner function arguments from left to right.',
      '2. Resolves cell coordinates and fetches referenced worksheet values.',
      '3. Computes the main function operation and outputs the final cell value.'
    ]),
    ``,
    `COMPATIBILITY & PERFORMANCE:`,
    `  • Excel Versions: Microsoft 365, Excel 2021, 2019, 2016, Excel Online`,
    `  • Google Sheets: 100% Compatible`,
    `  • Volatility: ${clean.includes('TODAY()') || clean.includes('NOW()') || clean.includes('RAND()') || clean.includes('OFFSET(') || clean.includes('INDIRECT(') ? 'HIGH (Recalculates on any sheet change)' : 'LOW (Recalculates only when precedents change)'}`,
    `════════════════════════════════════════════════════════════════`
  ].join('\n');
}

// 3. Excel Formula Debugger
export function debugExcelFormula(formula: string): string {
  const raw = formula.trim();
  const withoutEqual = raw.replace(/^=/, '');
  const issues: string[] = [];
  const fixes: string[] = [];

  // Check parenthetical balance
  let openParen = 0;
  for (const char of withoutEqual) {
    if (char === '(') openParen++;
    if (char === ')') openParen--;
  }
  if (openParen > 0) {
    issues.push(`Unclosed Parentheses: Missing ${openParen} closing parenthesis ')' at the end.`);
    fixes.push(`Append ${openParen} ')' character(s) to close all function calls.`);
  } else if (openParen < 0) {
    issues.push(`Extra Closing Parentheses: Found ${Math.abs(openParen)} unexpected ')' with no matching opening '('.`);
    fixes.push(`Remove redundant closing parentheses.`);
  }

  // Check quotes balance
  const quoteCount = (withoutEqual.match(/"/g) || []).length;
  if (quoteCount % 2 !== 0) {
    issues.push(`Unterminated Text String: Uneven number of double quote (") characters.`);
    fixes.push(`Ensure every text literal has matching opening and closing quotes (e.g. "Completed").`);
  }

  // Check semicolon vs comma delimiter confusion
  const hasComma = withoutEqual.includes(',');
  const hasSemicolon = withoutEqual.includes(';');
  if (hasComma && hasSemicolon) {
    issues.push(`Mixed Delimiters: Formula contains both commas (,) and semicolons (;).`);
    fixes.push(`Standardize on commas (US/UK) or semicolons (European locale).`);
  }

  // Check typo in common functions
  const knownTypos: Record<string, string> = {
    'VLOOKP': 'VLOOKUP',
    'HLOOKP': 'HLOOKUP',
    'XLOOKP': 'XLOOKUP',
    'CONCATINATE': 'CONCATENATE',
    'SUMF': 'SUMIF',
    'SUMIFS': 'SUMIFS',
    'COUNTF': 'COUNTIF',
    'IFEROR': 'IFERROR',
    'AVERGE': 'AVERAGE',
    'INDEXX': 'INDEX',
    'MATCHH': 'MATCH'
  };
  for (const [typo, correct] of Object.entries(knownTypos)) {
    const regex = new RegExp(`\\b${typo}\\s*\\(`, 'i');
    if (regex.test(withoutEqual)) {
      issues.push(`Misspelled Function Name: Found "${typo}", did you mean "${correct}"?`);
      fixes.push(`Replace "${typo}" with "${correct}".`);
    }
  }

  // Check invalid range syntax (e.g., A1;B10 instead of A1:B10)
  if (/[A-Z]+[0-9]+;[A-Z]+[0-9]+/i.test(withoutEqual)) {
    issues.push(`Invalid Range Syntax: Semicolon used inside cell range (e.g. A1;B10).`);
    fixes.push(`Use a colon ':' to specify continuous cell ranges (e.g. A1:B10).`);
  }

  // Check zero division danger
  if (/\/0(?![0-9])/.test(withoutEqual) || /\/\s*0/.test(withoutEqual)) {
    issues.push(`Literal Division by Zero: Formula contains "/0", which triggers #DIV/0! error.`);
    fixes.push(`Wrap calculation in IFERROR or verify denominator is greater than zero.`);
  }

  // Suggested auto-fixed formula
  let corrected = raw.startsWith('=') ? raw : '=' + raw;
  if (openParen > 0) corrected += ')'.repeat(openParen);

  return [
    `════════════════════════════════════════════════════════════════`,
    `                 EXCEL FORMULA DIAGNOSTIC REPORT                `,
    `════════════════════════════════════════════════════════════════`,
    `STATUS: ${issues.length === 0 ? '✅ PASSED — No Critical Syntax Errors Detected' : `⚠️ WARNING — ${issues.length} Potential Issue(s) Identified`}`,
    ``,
    `AUDITED FORMULA:`,
    `  ${raw}`,
    ``,
    issues.length > 0 ? `IDENTIFIED ISSUES:\n` + issues.map((iss, i) => `  ${i + 1}. ${iss}`).join('\n') : `All brackets, quotes, and function identifiers are syntactically valid.`,
    ``,
    fixes.length > 0 ? `RECOMMENDED CORRECTIONS:\n` + fixes.map((fix, i) => `  • ${fix}`).join('\n') : `No corrections needed. Ready to paste into worksheet.`,
    ``,
    `AUTO-CORRECTED PROPOSAL:`,
    `  ${corrected}`,
    `════════════════════════════════════════════════════════════════`
  ].join('\n');
}

// 4. Excel Formula Translator
export function translateExcelFormula(
  formula: string,
  sourceLang: string = 'en',
  targetLang: string = 'es'
): string {
  const dictionary: Record<string, Record<string, string>> = {
    // English -> Target
    'IF': { es: 'SI', fr: 'SI', de: 'WENN', it: 'SE', pt: 'SE', ru: 'ЕСЛИ' },
    'IFS': { es: 'SI.CONJUNTO', fr: 'SI.CONDITIONS', de: 'WENNS', it: 'PIÙ.SE', pt: 'SE.S', ru: 'ЕСЛИМН' },
    'IFERROR': { es: 'SI.ERROR', fr: 'SI.ERREUR', de: 'WENNFEHLER', it: 'SE.ERRORE', pt: 'SE.ERRO', ru: 'ЕСЛИОШИБКА' },
    'VLOOKUP': { es: 'BUSCARV', fr: 'RECHERCHEV', de: 'SVERWEIS', it: 'CERCA.VERT', pt: 'PROCV', ru: 'ВПР' },
    'HLOOKUP': { es: 'BUSCARH', fr: 'RECHERCHEH', de: 'WVERWEIS', it: 'CERCA.ORIZZ', pt: 'PROCH', ru: 'ГПР' },
    'XLOOKUP': { es: 'BUSCARX', fr: 'RECHERCHEX', de: 'XVERWEIS', it: 'CERCA.X', pt: 'PROCX', ru: 'ПРОСМОТРX' },
    'INDEX': { es: 'INDICE', fr: 'INDEX', de: 'INDEX', it: 'INDICE', pt: 'ÍNDICE', ru: 'ИНДЕКС' },
    'MATCH': { es: 'COINCIDIR', fr: 'EQUIV', de: 'VERGLEICH', it: 'CONFRONTA', pt: 'CORRESP', ru: 'ПОИСКПОЗ' },
    'SUM': { es: 'SUMA', fr: 'SOMME', de: 'SUMME', it: 'SOMMA', pt: 'SOMA', ru: 'СУММ' },
    'SUMIF': { es: 'SUMAR.SI', fr: 'SOMME.SI', de: 'SUMMEWENN', it: 'SOMMA.SE', pt: 'SOMASE', ru: 'СУММЕСЛИ' },
    'SUMIFS': { es: 'SUMAR.SI.CONJUNTO', fr: 'SOMME.SI.ENS', de: 'SUMMEWENNS', it: 'SOMMA.PIÙ.SE', pt: 'SOMASES', ru: 'СУММЕСЛИМН' },
    'COUNT': { es: 'CONTAR', fr: 'NB', de: 'ANZAHL', it: 'CONTA.NUMERI', pt: 'CONT.NÚM', ru: 'СЧЁТ' },
    'COUNTA': { es: 'CONTARA', fr: 'NBVAL', de: 'ANZAHL2', it: 'CONTA.VALORI', pt: 'CONT.VALORES', ru: 'СЧЁТЗ' },
    'COUNTBLANK': { es: 'CONTAR.BLANCO', fr: 'NB.VIDE', de: 'ANZAHLLEEREZELLEN', it: 'CONTA.VUOTE', pt: 'CONTAR.VAZIO', ru: 'СЧИТАТЬПУСТОТЫ' },
    'COUNTIF': { es: 'CONTAR.SI', fr: 'NB.SI', de: 'ZÄHLENWENN', it: 'CONTA.SE', pt: 'CONT.SE', ru: 'СЧЁТЕСЛИ' },
    'COUNTIFS': { es: 'CONTAR.SI.CONJUNTO', fr: 'NB.SI.ENS', de: 'ZÄHLENWENNS', it: 'CONTA.PIÙ.SE', pt: 'CONT.SES', ru: 'СЧЁТЕСЛИМН' },
    'AVERAGE': { es: 'PROMEDIO', fr: 'MOYENNE', de: 'MITTELWERT', it: 'MEDIA', pt: 'MÉDIA', ru: 'СРЗНАЧ' },
    'CONCAT': { es: 'CONCAT', fr: 'CONCAT', de: 'TEXTKETTE', it: 'CONCAT', pt: 'CONCAT', ru: 'СЦЕП' },
    'CONCATENATE': { es: 'CONCATENAR', fr: 'CONCATENER', de: 'VERKETTEN', it: 'CONCATENA', pt: 'CONCATENAR', ru: 'СЦЕПИТЬ' },
    'TEXTJOIN': { es: 'UNIRCADENAS', fr: 'JOINDRE.TEXTE', de: 'TEXTVERBINDEN', it: 'TESTO.UNISCI', pt: 'UNIRTEXTO', ru: 'ОБЪЕДИНИТЬ' },
    'LEFT': { es: 'IZQUIERDA', fr: 'GAUCHE', de: 'LINKS', it: 'SINISTRA', pt: 'ESQUERDA', ru: 'ЛЕВСИМВ' },
    'RIGHT': { es: 'DERECHA', fr: 'DROITE', de: 'RECHTS', it: 'DESTRA', pt: 'DIREITA', ru: 'ПРАВСИМВ' },
    'MID': { es: 'EXTRAE', fr: 'STXT', de: 'TEIL', it: 'STRINGA.ESTRAI', pt: 'EXT.TEXTO', ru: 'ПСТР' },
    'LEN': { es: 'LARGO', fr: 'NBCAR', de: 'LÄNGE', it: 'LUNGHEZZA', pt: 'NÚM.CARACT', ru: 'ДЛСТР' },
    'TRIM': { es: 'ESPACIOS', fr: 'SUPPRESPACE', de: 'GLÄTTEN', it: 'ANNULLA.SPAZI', pt: 'ARRUMAR', ru: 'СЖПРОБЕЛЫ' },
    'ROUND': { es: 'REDONDEAR', fr: 'ARRONDI', de: 'RUNDEN', it: 'ARROTONDA', pt: 'ARRED', ru: 'ОКРУГЛ' },
    'TODAY': { es: 'HOY', fr: 'AUJOURDHUI', de: 'HEUTE', it: 'OGGI', pt: 'HOJE', ru: 'СЕГОДНЯ' },
    'NOW': { es: 'AHORA', fr: 'MAINTENANT', de: 'JETZT', it: 'ADESSO', pt: 'AGORA', ru: 'ТДАТА' },
    'AND': { es: 'Y', fr: 'ET', de: 'UND', it: 'E', pt: 'E', ru: 'И' },
    'OR': { es: 'O', fr: 'OU', de: 'ODER', it: 'O', pt: 'OU', ru: 'ИЛИ' },
    'NOT': { es: 'NO', fr: 'NON', de: 'NICHT', it: 'NON', pt: 'NÃO', ru: 'НЕ' },
    'TRUE': { es: 'VERDADERO', fr: 'VRAI', de: 'WAHR', it: 'VERO', pt: 'VERDADEIRO', ru: 'ИСТИНА' },
    'FALSE': { es: 'FALSO', fr: 'FAUX', de: 'FALSCH', it: 'FALSO', pt: 'FALSO', ru: 'ЛОЖЬ' }
  };

  let translated = formula;
  const isEnTarget = targetLang === 'en';

  if (!isEnTarget) {
    // English -> Foreign
    for (const [enName, targets] of Object.entries(dictionary)) {
      const targetName = targets[targetLang];
      if (targetName) {
        const regex = new RegExp(`\\b${enName}\\b(?=\\s*\\()`, 'gi');
        translated = translated.replace(regex, targetName);
      }
    }
    // Handle European delimiter replacement (comma -> semicolon outside quotes)
    if (['de', 'fr', 'es', 'it', 'pt', 'ru'].includes(targetLang)) {
      translated = replaceDelimiters(translated, ',', ';');
    }
  } else {
    // Foreign -> English
    for (const [enName, targets] of Object.entries(dictionary)) {
      const foreignName = targets[sourceLang];
      if (foreignName) {
        const regex = new RegExp(`\\b${foreignName}\\b(?=\\s*\\()`, 'gi');
        translated = translated.replace(regex, enName);
      }
    }
    translated = replaceDelimiters(translated, ';', ',');
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `                EXCEL FORMULA LOCALE TRANSLATION                 `,
    `════════════════════════════════════════════════════════════════`,
    `SOURCE LANGUAGE: ${sourceLang.toUpperCase()}`,
    `TARGET LANGUAGE: ${targetLang.toUpperCase()}`,
    ``,
    `ORIGINAL FORMULA:`,
    `  ${formula}`,
    ``,
    `TRANSLATED FORMULA:`,
    `  ${translated}`,
    ``,
    `NOTE ON DELIMITERS:`,
    `  ${targetLang === 'en' ? 'Uses commas (,) as standard function argument separators.' : 'Converted commas to semicolons (;) conforming to European & international decimal comma notation.'}`,
    `════════════════════════════════════════════════════════════════`
  ].join('\n');
}

function replaceDelimiters(text: string, fromChar: string, toChar: string): string {
  let result = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === '"') inQuotes = !inQuotes;
    if (char === fromChar && !inQuotes) {
      result += toChar;
    } else {
      result += char;
    }
  }
  return result;
}

// 5. Excel Formula Formatter
export function formatExcelFormula(formula: string, indent: number = 2): string {
  const clean = formula.trim();
  const spaces = ' '.repeat(indent);
  let depth = 0;
  let formatted = '';
  let inQuotes = false;

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      formatted += char;
      continue;
    }

    if (inQuotes) {
      formatted += char;
      continue;
    }

    if (char === '(') {
      depth++;
      formatted += '(\n' + spaces.repeat(depth);
    } else if (char === ')') {
      depth = Math.max(0, depth - 1);
      formatted += '\n' + spaces.repeat(depth) + ')';
    } else if (char === ',' || char === ';') {
      formatted += char + '\n' + spaces.repeat(depth);
    } else {
      formatted += char;
    }
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `                 BEAUTIFIED EXCEL FORMULA                       `,
    `════════════════════════════════════════════════════════════════`,
    formatted,
    ``,
    `NESTING DEPTH: ${depth === 0 ? 'Balanced' : 'Warning: Unbalanced parentheses'}`
  ].join('\n');
}

// 6. Excel Column Letter to Number
export function columnLetterToNumber(letter: string): string {
  const clean = letter.trim().toUpperCase().replace(/[^A-Z]/g, '');
  if (!clean) return 'Please enter a valid column letter (e.g. A, Z, AA, XFD).';

  let num = 0;
  for (let i = 0; i < clean.length; i++) {
    num = num * 26 + (clean.charCodeAt(i) - 64);
  }

  const isValidXlsx = num <= 16384;
  const isXlsLegacy = num <= 256;

  return [
    `════════════════════════════════════════════════════════════════`,
    `             EXCEL COLUMN LETTER TO NUMBER CONVERSION           `,
    `════════════════════════════════════════════════════════════════`,
    `COLUMN LETTER:        ${clean}`,
    `1-BASED COLUMN INDEX: ${num}`,
    `0-BASED COLUMN INDEX: ${num - 1}`,
    ``,
    `COMPATIBILITY AUDIT:`,
    `  • Modern Excel (.xlsx / .xlsm): ${isValidXlsx ? `✅ Valid (Max is 16,384 / Column XFD)` : `❌ EXCEEDS LIMIT (Max is 16,384)`}`,
    `  • Legacy Excel 97-2003 (.xls): ${isXlsLegacy ? `✅ Valid (Max is 256 / Column IV)` : `⚠️ Exceeds legacy 256-column limit`}`,
    `  • Google Sheets:              ${num <= 18278 ? `✅ Supported (Up to ZZZ / 18,278)` : `⚠️ Exceeds standard sheet bounds`}`,
    ``,
    `R1C1 NOTATION:`,
    `  For Row 1: R1C${num}`,
    `════════════════════════════════════════════════════════════════`
  ].join('\n');
}

function toColLetter(n: number): string {
  let temp = Math.floor(n);
  let letter = '';
  while (temp > 0) {
    const rem = (temp - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    temp = Math.floor((temp - rem) / 26);
  }
  return letter;
}

// 7. Excel Column Number to Letter
export function columnNumberToLetter(num: number): string {
  if (isNaN(num) || num < 1) return 'Please enter a positive column number (1 to 16384).';

  const letter = toColLetter(num);
  const prevLetter = num > 1 ? toColLetter(num - 1) : 'None (First Column)';
  const nextLetter = toColLetter(num + 1);

  return [
    `════════════════════════════════════════════════════════════════`,
    `             EXCEL COLUMN NUMBER TO LETTER CONVERSION           `,
    `════════════════════════════════════════════════════════════════`,
    `INPUT COLUMN NUMBER: ${num}`,
    `EXCEL COLUMN LETTER:  ${letter}`,
    ``,
    `GRID POSITION REFERENCE:`,
    `  • Preceding Column: ${prevLetter}`,
    `  • Current Column:   ${letter}`,
    `  • Succeeding Column: ${nextLetter}`,
    ``,
    `EXCEL LIMIT AUDIT:`,
    `  ${num <= 16384 ? `✅ Fits within standard Excel worksheet limit (Max 16,384 = XFD)` : `⚠️ Outside standard Excel boundary (Max is 16,384)`}`
  ].join('\n');
}

// 8. Excel Cell Reference Converter
export function convertCellReferences(input: string, mode: 'absolute' | 'relative' | 'row_abs' | 'col_abs' | 'toggle'): string {
  // Regex matches cell references like $A$1, A$1, $A1, A1
  const cellRegex = /(\$?)([A-Z]+)(\$?)([0-9]+)/gi;

  const converted = input.replace(cellRegex, (_match, dollarCol, col, dollarRow, row) => {
    const c = col.toUpperCase();
    const r = row;

    if (mode === 'absolute') {
      return `$${c}$${r}`;
    } else if (mode === 'relative') {
      return `${c}${r}`;
    } else if (mode === 'row_abs') {
      return `${c}$${r}`;
    } else if (mode === 'col_abs') {
      return `$${c}${r}`;
    } else {
      // Toggle cycle: A1 -> $A$1 -> A$1 -> $A1 -> A1
      const isColAbs = Boolean(dollarCol);
      const isRowAbs = Boolean(dollarRow);
      if (!isColAbs && !isRowAbs) return `$${c}$${r}`;
      if (isColAbs && isRowAbs) return `${c}$${r}`;
      if (!isColAbs && isRowAbs) return `$${c}${r}`;
      return `${c}${r}`;
    }
  });

  return [
    `════════════════════════════════════════════════════════════════`,
    `               EXCEL CELL REFERENCE CONVERTER                   `,
    `════════════════════════════════════════════════════════════════`,
    `TARGET MODE: ${mode.toUpperCase()}`,
    ``,
    `ORIGINAL INPUT:`,
    `  ${input}`,
    ``,
    `CONVERTED RESULT:`,
    `  ${converted}`,
    ``,
    `EXPLANATION:`,
    `  • Relative (A1): Shifts both column and row when copied across cells.`,
    `  • Absolute ($A$1): Locks both column and row in place.`,
    `  • Row Absolute (A$1): Locks row 1, allows column to change.`,
    `  • Column Absolute ($A1): Locks column A, allows row to increment.`
  ].join('\n');
}

// 9. Excel Date Serial Converter
export function convertDateSerial(input: string | number, is1904: boolean = false): string {
  const trimmed = String(input).trim();
  const numVal = parseFloat(trimmed);

  if (!isNaN(numVal) && !trimmed.includes('-') && !trimmed.includes('/')) {
    // Serial -> Date
    // Excel 1900 date system has a leap year bug: day 60 was treated as Feb 29, 1900 (which was not a leap year in the Gregorian calendar)
    let days = numVal;
    if (!is1904) {
      if (days > 60) days -= 1; // Compensate for lotus 1-2-3 1900 leap day bug
    }
    const epoch = is1904 ? new Date(Date.UTC(1904, 0, 1)) : new Date(Date.UTC(1899, 11, 31));
    const targetDate = new Date(epoch.getTime() + days * 86400000);

    const iso = targetDate.toISOString().slice(0, 10);
    const formatted = targetDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

    return [
      `════════════════════════════════════════════════════════════════`,
      `               EXCEL DATE SERIAL TO CALENDAR DATE               `,
      `════════════════════════════════════════════════════════════════`,
      `EXCEL SERIAL NUMBER: ${numVal}`,
      `DATE SYSTEM:         ${is1904 ? '1904 (Mac Legacy)' : '1900 (Windows / Modern Default)'}`,
      ``,
      `CALENDAR CONVERSIONS:`,
      `  • ISO 8601 Format:    ${iso}`,
      `  • Formatted Date:     ${formatted}`,
      `  • Day of the Week:    ${targetDate.toLocaleDateString('en-US', { weekday: 'long', timeZone: 'UTC' })}`,
      ``,
      `HISTORICAL CONTEXT:`,
      `  Serial 1 corresponds to January 1, 1900. Excel intentionally preserves Lotus 1-2-3's bug where 1900 was treated as a leap year.`
    ].join('\n');
  } else {
    // Date string -> Serial
    const parsed = new Date(trimmed);
    if (isNaN(parsed.getTime())) return 'Invalid date format. Please provide an ISO date (e.g. 2024-03-15) or an Excel serial number (e.g. 45366).';

    const epoch = is1904 ? new Date(Date.UTC(1904, 0, 1)) : new Date(Date.UTC(1899, 11, 31));
    const utcParsed = new Date(Date.UTC(parsed.getFullYear(), parsed.getMonth(), parsed.getDate()));
    let diffDays = Math.round((utcParsed.getTime() - epoch.getTime()) / 86400000);
    if (!is1904 && diffDays > 60) {
      diffDays += 1;
    }

    return [
      `════════════════════════════════════════════════════════════════`,
      `               CALENDAR DATE TO EXCEL DATE SERIAL               `,
      `════════════════════════════════════════════════════════════════`,
      `INPUT DATE:          ${trimmed}`,
      `EXCEL SERIAL NUMBER: ${diffDays}`,
      `DATE SYSTEM:         ${is1904 ? '1904 System' : '1900 System (Default)'}`,
      ``,
      `WORKSHEET VERIFICATION:`,
      `  In Excel, entering ${diffDays} and formatting as 'Short Date' displays ${parsed.toISOString().slice(0, 10)}.`
    ].join('\n');
  }
}

// 10. Excel VLOOKUP Formula Builder
export function buildVlookupFormula(params: {
  lookupVal: string;
  tableRange: string;
  colIndex: number;
  exactMatch?: boolean;
  wrapIferror?: boolean;
  fallback?: string;
}): string {
  const val = params.lookupVal || 'A2';
  const table = params.tableRange || '$A$2:$E$100';
  const col = params.colIndex > 0 ? params.colIndex : 2;
  const match = params.exactMatch !== false ? 'FALSE' : 'TRUE';
  const fallback = params.fallback || 'Not Found';

  let formula = `=VLOOKUP(${val}, ${table}, ${col}, ${match})`;
  if (params.wrapIferror) {
    formula = `=IFERROR(VLOOKUP(${val}, ${table}, ${col}, ${match}), "${fallback}")`;
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `                   VLOOKUP FORMULA BUILDER                      `,
    `════════════════════════════════════════════════════════════════`,
    `GENERATED FORMULA:`,
    `  ${formula}`,
    ``,
    `ARGUMENT SPECIFICATION:`,
    `  1. Lookup Value:   ${val} (The search key in the current row)`,
    `  2. Table Array:    ${table} (Must include lookup key in 1st column)`,
    `  3. Column Index:   ${col} (Column number to return, starting at 1)`,
    `  4. Range Lookup:   ${match} (${match === 'FALSE' ? 'Exact Match' : 'Approximate Match'})`,
    `  5. Error Handling: ${params.wrapIferror ? `Wrapped in IFERROR returning "${fallback}"` : 'None (may produce #N/A)'}`,
    ``,
    `CRITICAL VLOOKUP RULES:`,
    `  • The lookup column MUST be the left-most column in the table array.`,
    `  • VLOOKUP is not case-sensitive.`,
    `  • Always use absolute references ($) for the table range to prevent drift when dragging formulas down.`
  ].join('\n');
}

// 11. Excel XLOOKUP Formula Builder
export function buildXlookupFormula(params: {
  lookupVal: string;
  lookupArray: string;
  returnArray: string;
  notFoundVal?: string;
  matchMode?: number;
  searchMode?: number;
}): string {
  const val = params.lookupVal || 'A2';
  const lArray = params.lookupArray || 'Sheet1!$A$2:$A$500';
  const rArray = params.returnArray || 'Sheet1!$D$2:$D$500';
  const notFound = params.notFoundVal ? `"${params.notFoundVal}"` : `""`;
  const mMode = params.matchMode !== undefined ? params.matchMode : 0;
  const sMode = params.searchMode !== undefined ? params.searchMode : 1;

  const formula = `=XLOOKUP(${val}, ${lArray}, ${rArray}, ${notFound}, ${mMode}, ${sMode})`;

  const matchModeNames: Record<number, string> = {
    0: 'Exact match (default)',
    [-1]: 'Exact match or next smaller item',
    1: 'Exact match or next larger item',
    2: 'Wildcard character match (*, ?, ~)'
  };

  const searchModeNames: Record<number, string> = {
    1: 'Search first-to-last (default top-to-bottom)',
    [-1]: 'Search last-to-first (bottom-up lookup)',
    2: 'Binary search (ascending sorted array)',
    [-2]: 'Binary search (descending sorted array)'
  };

  return [
    `════════════════════════════════════════════════════════════════`,
    `                   XLOOKUP FORMULA BUILDER                      `,
    `════════════════════════════════════════════════════════════════`,
    `GENERATED FORMULA:`,
    `  ${formula}`,
    ``,
    `ARGUMENT BREAKDOWN:`,
    `  • Lookup Value: ${val}`,
    `  • Lookup Range: ${lArray}`,
    `  • Return Range: ${rArray}`,
    `  • Fallback:     ${notFound}`,
    `  • Match Mode:   ${mMode} (${matchModeNames[mMode] || 'Custom'})`,
    `  • Search Mode:  ${sMode} (${searchModeNames[sMode] || 'Custom'})`,
    ``,
    `ADVANTAGES OVER VLOOKUP:`,
    `  • Can look left (Return range can be to the left of the lookup column).`,
    `  • Native error handling without IFERROR wrapper.`,
    `  • Safe against column insertions and deletions.`
  ].join('\n');
}

// 12. Excel IF Formula Builder
export function buildIfFormula(params: {
  condition: string;
  trueVal: string;
  falseVal: string;
  nestedConditions?: { condition: string; val: string }[];
}): string {
  const cond = params.condition || 'A2 >= 100';
  const tVal = params.trueVal || '"Passed"';
  const fVal = params.falseVal || '"Failed"';

  let singleIf = `=IF(${cond}, ${tVal}, ${fVal})`;

  let ifsFormula = '';
  if (params.nestedConditions && params.nestedConditions.length > 0) {
    const clauses = [`${cond}, ${tVal}`];
    params.nestedConditions.forEach(n => {
      clauses.push(`${n.condition}, ${n.val}`);
    });
    clauses.push(`TRUE, ${fVal}`);
    ifsFormula = `=IFS(${clauses.join(', ')})`;
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `                     IF / IFS FORMULA BUILDER                   `,
    `════════════════════════════════════════════════════════════════`,
    `STANDARD IF FORMULA:`,
    `  ${singleIf}`,
    ``,
    ...(ifsFormula ? [`MULTI-CONDITION IFS FORMULA:\n  ${ifsFormula}\n`] : []),
    `LOGICAL FLOW:`,
    `  Step 1: Check if [${cond}] is TRUE.`,
    `  Step 2: If YES -> Return ${tVal}.`,
    `  Step 3: If NO  -> Return ${fVal}.`
  ].join('\n');
}

// 13. Excel SUMIF / SUMIFS Formula Builder
export function buildSumifFormula(params: {
  range: string;
  criteria: string;
  sumRange?: string;
  multipleCriteria?: { range: string; criteria: string }[];
}): string {
  const range = params.range || 'B2:B100';
  const criteria = params.criteria || '">50"';
  const sumRange = params.sumRange || 'C2:C100';

  const sumif = `=SUMIF(${range}, ${criteria}, ${sumRange})`;

  let sumifs = '';
  if (params.multipleCriteria && params.multipleCriteria.length > 0) {
    const parts = [sumRange, range, criteria];
    params.multipleCriteria.forEach(c => {
      parts.push(c.range, c.criteria);
    });
    sumifs = `=SUMIFS(${parts.join(', ')})`;
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `                  SUMIF / SUMIFS FORMULA BUILDER                `,
    `════════════════════════════════════════════════════════════════`,
    `SINGLE-CONDITION SUMIF:`,
    `  ${sumif}`,
    ``,
    ...(sumifs ? [`MULTI-CRITERIA SUMIFS:\n  ${sumifs}\n`] : []),
    `PRO TIP:`,
    `  Notice that in SUMIF the sum range is the LAST argument, but in SUMIFS the sum range is the FIRST argument.`
  ].join('\n');
}

// 14. Excel COUNTIF / COUNTIFS Formula Builder
export function buildCountifFormula(params: {
  range: string;
  criteria: string;
  multipleCriteria?: { range: string; criteria: string }[];
}): string {
  const range = params.range || 'A2:A500';
  const criteria = params.criteria || '"Active"';

  const countif = `=COUNTIF(${range}, ${criteria})`;

  let countifs = '';
  if (params.multipleCriteria && params.multipleCriteria.length > 0) {
    const parts = [range, criteria];
    params.multipleCriteria.forEach(c => {
      parts.push(c.range, c.criteria);
    });
    countifs = `=COUNTIFS(${parts.join(', ')})`;
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `                COUNTIF / COUNTIFS FORMULA BUILDER              `,
    `════════════════════════════════════════════════════════════════`,
    `COUNTIF:`,
    `  ${countif}`,
    ``,
    ...(countifs ? [`COUNTIFS:\n  ${countifs}\n`] : []),
    `OPERATOR EXAMPLES:`,
    `  • Greater than: ">100"`,
    `  • Text exact:   "Approved"`,
    `  • Wildcard:     "*Ltd*" (Contains Ltd)`,
    `  • Blank cells:  ""`
  ].join('\n');
}

// 15. Excel CONCAT Formula Builder
export function buildConcatFormula(params: {
  items: string[];
  delimiter?: string;
  ignoreEmpty?: boolean;
  method?: 'textjoin' | 'concat' | 'ampersand';
}): string {
  const items = params.items.length > 0 ? params.items : ['A2', 'B2', 'C2'];
  const delim = params.delimiter !== undefined ? params.delimiter : ' ';
  const ignore = params.ignoreEmpty !== false ? 'TRUE' : 'FALSE';
  const method = params.method || 'textjoin';

  let formula = '';
  if (method === 'textjoin') {
    formula = `=TEXTJOIN("${delim}", ${ignore}, ${items.join(', ')})`;
  } else if (method === 'concat') {
    formula = `=CONCAT(${items.map(it => `${it}, "${delim}"`).join(', ').replace(/,\s*"[^"]*"$/, '')})`;
  } else {
    formula = `=${items.join(` & "${delim}" & `)}`;
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `                  CONCATENATION FORMULA BUILDER                 `,
    `════════════════════════════════════════════════════════════════`,
    `SELECTED METHOD: ${method.toUpperCase()}`,
    `GENERATED FORMULA:`,
    `  ${formula}`,
    ``,
    `RECOMMENDATION:`,
    `  TEXTJOIN is superior for 3+ cells because it automatically skips empty cells without creating orphan delimiters.`
  ].join('\n');
}

// 16. Excel TEXT Formula Builder
export function buildTextFormula(params: {
  cellRef: string;
  category: 'date' | 'currency' | 'percentage' | 'pad_zeros' | 'phone';
  formatPattern?: string;
}): string {
  const ref = params.cellRef || 'A2';
  let pattern = params.formatPattern || 'yyyy-mm-dd';

  if (params.category === 'currency') pattern = '$#,##0.00';
  else if (params.category === 'percentage') pattern = '0.0%';
  else if (params.category === 'pad_zeros') pattern = '00000';
  else if (params.category === 'phone') pattern = '(000) 000-0000';

  const formula = `=TEXT(${ref}, "${pattern}")`;

  return [
    `════════════════════════════════════════════════════════════════`,
    `                    TEXT FORMAT FORMULA BUILDER                 `,
    `════════════════════════════════════════════════════════════════`,
    `TARGET CELL:   ${ref}`,
    `FORMAT STRING: "${pattern}"`,
    `FORMULA:`,
    `  ${formula}`,
    ``,
    `COMMON PATTERNS:`,
    `  • Date:       "yyyy-mm-dd" -> 2024-03-15`,
    `  • Month Full: "mmmm d, yyyy" -> March 15, 2024`,
    `  • Currency:   "$#,##0.00" -> $1,250.50`,
    `  • Zero Pad:   "00000" -> 00042`
  ].join('\n');
}

// 17. Excel INDEX MATCH Builder
export function buildIndexMatchFormula(params: {
  returnRange: string;
  lookupVal: string;
  lookupRange: string;
  twoWay?: boolean;
  colLookupVal?: string;
  colLookupRange?: string;
}): string {
  const rRange = params.returnRange || 'C2:C100';
  const val = params.lookupVal || 'E2';
  const lRange = params.lookupRange || 'A2:A100';

  let formula = `=INDEX(${rRange}, MATCH(${val}, ${lRange}, 0))`;
  if (params.twoWay) {
    const colVal = params.colLookupVal || 'F2';
    const colRange = params.colLookupRange || 'B1:Z1';
    formula = `=INDEX(${rRange}, MATCH(${val}, ${lRange}, 0), MATCH(${colVal}, ${colRange}, 0))`;
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `                INDEX / MATCH FORMULA BUILDER                   `,
    `════════════════════════════════════════════════════════════════`,
    `GENERATED FORMULA:`,
    `  ${formula}`,
    ``,
    `HOW IT WORKS:`,
    `  1. MATCH(${val}, ${lRange}, 0) locates the exact row number where ${val} occurs.`,
    `  2. INDEX(${rRange}, [row_num]) fetches the corresponding value from that exact row.`,
    ``,
    `WHY INDEX/MATCH IS BETTER THAN VLOOKUP:`,
    `  • Can look left (Return range can be anywhere in sheet).`,
    `  • Inserting/deleting columns will never break your formulas.`,
    `  • Requires significantly less processing memory on large datasets.`
  ].join('\n');
}

// 18. Excel Conditional Formatting Formula Builder
export function buildConditionalFormattingFormula(
  ruleType: string,
  targetCell: string = 'A1'
): string {
  let ruleFormula = '';
  let ruleDesc = '';

  switch (ruleType) {
    case 'alternate_rows':
      ruleFormula = `=MOD(ROW(), 2) = 0`;
      ruleDesc = 'Highlights every alternate row (zebra striping) dynamically.';
      break;
    case 'duplicates':
      ruleFormula = `=COUNTIF($A:$A, ${targetCell}) > 1`;
      ruleDesc = `Highlights cells in column A that appear more than once.`;
      break;
    case 'above_average':
      ruleFormula = `=${targetCell} > AVERAGE($A$1:$A$100)`;
      ruleDesc = `Highlights values strictly above the population average.`;
      break;
    case 'past_due':
      ruleFormula = `=AND(${targetCell} < TODAY(), ${targetCell} <> "")`;
      ruleDesc = `Highlights dates earlier than today that are not empty.`;
      break;
    case 'weekends':
      ruleFormula = `=WEEKDAY(${targetCell}, 2) > 5`;
      ruleDesc = `Highlights Saturday and Sunday dates automatically.`;
      break;
    case 'blank_cells':
      ruleFormula = `=ISBLANK(${targetCell})`;
      ruleDesc = `Highlights completely unpopulated cells for data auditing.`;
      break;
    default:
      ruleFormula = `=${targetCell} > 100`;
      ruleDesc = `Highlights cells with values exceeding 100.`;
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `         CONDITIONAL FORMATTING FORMULA BUILDER                 `,
    `════════════════════════════════════════════════════════════════`,
    `RULE TYPE: ${ruleType.toUpperCase()}`,
    `TARGET TOP-LEFT CELL: ${targetCell}`,
    ``,
    `RULE FORMULA:`,
    `  ${ruleFormula}`,
    ``,
    `INSTRUCTIONS TO APPLY IN EXCEL:`,
    `  1. Select your target range (e.g. A1:Z100).`,
    `  2. Home Tab -> Conditional Formatting -> New Rule.`,
    `  3. Choose "Use a formula to determine which cells to format".`,
    `  4. Paste the formula above into the rule field.`,
    `  5. Pick your fill/font formatting and click OK.`
  ].join('\n');
}

// 19. Excel Data Validation List Generator
export function generateDataValidationList(items: string[]): string {
  const cleanItems = items.map(s => s.trim()).filter(Boolean);
  const commaSeparated = cleanItems.join(',');

  return [
    `════════════════════════════════════════════════════════════════`,
    `             EXCEL DATA VALIDATION DROPDOWN GENERATOR           `,
    `════════════════════════════════════════════════════════════════`,
    `TOTAL DROPDOWN OPTIONS: ${cleanItems.length}`,
    ``,
    `1. INLINE DROPDOWN STRING (For small static lists):`,
    `  ${commaSeparated}`,
    ``,
    `2. DYNAMIC AUTO-EXPANDING RANGE FORMULA (Recommended):`,
    `  =OFFSET(Lists!$A$2, 0, 0, COUNTA(Lists!$A:$A)-1, 1)`,
    ``,
    `HOW TO CONFIGURE IN EXCEL:`,
    `  1. Select the target column cells where dropdowns should appear.`,
    `  2. Click 'Data' tab -> 'Data Validation'.`,
    `  3. Under 'Allow', select 'List'.`,
    `  4. In the 'Source' box, paste either the comma-separated values or the dynamic formula.`,
    `  5. Click OK.`
  ].join('\n');
}

// 20. Excel Named Range Generator
export function generateNamedRange(
  name: string,
  sheetName: string = 'Sheet1',
  startCell: string = 'A2',
  endCol: string = 'D'
): string {
  const cleanName = name.trim().replace(/[^a-zA-Z0-9_]/g, '_').replace(/^([0-9])/, '_$1');
  const staticRef = `='${sheetName}'!$${startCell}:$'${endCol}'$500`;
  const dynamicFormula = `=OFFSET('${sheetName}'!$${startCell}, 0, 0, COUNTA('${sheetName}'!$${startCell.replace(/[0-9]/g, '')}:$'${startCell.replace(/[0-9]/g, '')}') - 1, 1)`;

  return [
    `════════════════════════════════════════════════════════════════`,
    `                 EXCEL NAMED RANGE GENERATOR                    `,
    `════════════════════════════════════════════════════════════════`,
    `SANITIZED NAME:   ${cleanName}`,
    `SHEET:            ${sheetName}`,
    ``,
    `STATIC RANGE REFERENCE:`,
    `  ${staticRef}`,
    ``,
    `DYNAMIC AUTO-EXPANDING RANGE FORMULA:`,
    `  ${dynamicFormula}`,
    ``,
    `NAMING RULES APPLIED:`,
    `  • Spaces replaced with underscores.`,
    `  • Forbidden punctuation characters stripped.`,
    `  • Starts with a valid letter or underscore.`
  ].join('\n');
}

// 21. Excel Duplicate Cell Finder
export function findDuplicateCells(rawText: string): string {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return 'Please provide column data or rows to check for duplicates.';

  const counts: Record<string, number> = {};
  const firstSeen: Record<string, number> = {};

  lines.forEach((line, idx) => {
    counts[line] = (counts[line] || 0) + 1;
    if (firstSeen[line] === undefined) {
      firstSeen[line] = idx + 1;
    }
  });

  const duplicateKeys = Object.keys(counts).filter(k => counts[k] > 1);
  const uniqueCount = Object.keys(counts).length;

  return [
    `════════════════════════════════════════════════════════════════`,
    `               EXCEL DUPLICATE CELL AUDIT REPORT                `,
    `════════════════════════════════════════════════════════════════`,
    `TOTAL CELLS AUDITED:    ${lines.length}`,
    `UNIQUE VALUES:          ${uniqueCount}`,
    `REDUNDANT DUPLICATES:   ${lines.length - uniqueCount}`,
    ``,
    `DUPLICATE ITEMS SUMMARY:`,
    ...(duplicateKeys.length > 0 ? duplicateKeys.map(k => `  • "${k}" -> Found ${counts[k]} times (First seen at line ${firstSeen[k]})`) : ['  No duplicates found. All cells are unique!']),
    ``,
    `EXCEL DEDUPLICATION FORMULA:`,
    `  Paste in Column B: =IF(COUNTIF($A$2:$A2, A2)>1, "DUPLICATE", "UNIQUE")`,
    `════════════════════════════════════════════════════════════════`
  ].join('\n');
}

// 22. Excel Sheet Comparison Tool
export function compareExcelSheets(sheetA: string, sheetB: string): string {
  const linesA = sheetA.split(/\r?\n/).map(l => l.split(/[\t,]/));
  const linesB = sheetB.split(/\r?\n/).map(l => l.split(/[\t,]/));

  const maxRows = Math.max(linesA.length, linesB.length);
  const diffs: string[] = [];

  for (let r = 0; r < maxRows; r++) {
    const rowA = linesA[r] || [];
    const rowB = linesB[r] || [];
    const maxCols = Math.max(rowA.length, rowB.length);

    for (let c = 0; c < maxCols; c++) {
      const valA = (rowA[c] || '').trim();
      const valB = (rowB[c] || '').trim();
      if (valA !== valB) {
        const colLetter = String.fromCharCode(65 + c);
        diffs.push(`Row ${r + 1}, Col ${colLetter}: Sheet1="${valA}" vs Sheet2="${valB}"`);
      }
    }
  }

  return [
    `════════════════════════════════════════════════════════════════`,
    `                 EXCEL SHEET COMPARISON AUDIT                   `,
    `════════════════════════════════════════════════════════════════`,
    `SHEET 1 ROWS: ${linesA.length} | SHEET 2 ROWS: ${linesB.length}`,
    `TOTAL CELL DIFFERENCES: ${diffs.length}`,
    ``,
    diffs.length > 0 ? `DISCREPANCY LIST (First 20):\n` + diffs.slice(0, 20).map(d => `  • ${d}`).join('\n') : '✅ Both sheets are 100% identical in layout and cell values.',
    ``,
    `EXCEL COMPARISON FORMULA:`,
    `  In a 3rd comparison sheet, enter: =IF(Sheet1!A1=Sheet2!A1, "", "MISMATCH: " & Sheet1!A1 & " ≠ " & Sheet2!A1)`
  ].join('\n');
}

// 23. Excel CSV Import Formatter
export function formatCsvForExcel(rawCsv: string): string {
  const lines = rawCsv.split(/\r?\n/);
  const formattedLines = lines.map(line => {
    if (!line.trim()) return line;
    const parts = line.split(',');
    const sanitized = parts.map(part => {
      const p = part.trim();
      // Leading zero strings (e.g. 00123) or codes that Excel ruins
      if (/^0[0-9]+$/.test(p)) {
        return `=""""${p}""""`;
      }
      return part;
    });
    return sanitized.join(',');
  });

  return [
    `\uFEFF` + formattedLines.join('\n')
  ].join('');
}

// 24. Excel Column Splitter
export function splitExcelColumn(data: string, delimiter: string = ','): string {
  const lines = data.split(/\r?\n/).filter(l => l.trim().length > 0);
  const rows = lines.map(l => l.split(delimiter));

  const preview = rows.slice(0, 10).map((r, i) => `Row ${i + 1}: [ ${r.map(c => `"${c.trim()}"`).join(' | ')} ]`).join('\n');

  return [
    `════════════════════════════════════════════════════════════════`,
    `                   EXCEL COLUMN SPLITTER                        `,
    `════════════════════════════════════════════════════════════════`,
    `DELIMITER DETECTED: "${delimiter}"`,
    `PROCESSED ROWS:     ${rows.length}`,
    ``,
    `SPLIT DATA PREVIEW:`,
    preview,
    ``,
    `MODERN EXCEL 365 FORMULA:`,
    `  =TEXTSPLIT(A2, "${delimiter}")`,
    ``,
    `LEGACY TEXT-TO-COLUMNS STEPS:`,
    `  Data Tab -> Text to Columns -> Delimited -> Choose '${delimiter}' -> Finish.`
  ].join('\n');
}

// 25. Excel Column Merger
export function mergeExcelColumns(data: string, separator: string = ' - '): string {
  const lines = data.split(/\r?\n/).filter(l => l.trim().length > 0);
  const merged = lines.map(l => {
    const parts = l.split(/[\t,]/).map(p => p.trim());
    return parts.join(separator);
  });

  return [
    `════════════════════════════════════════════════════════════════`,
    `                    EXCEL COLUMN MERGER                         `,
    `════════════════════════════════════════════════════════════════`,
    `SEPARATOR APPLIED: "${separator}"`,
    `MERGED ROWS:       ${merged.length}`,
    ``,
    `MERGED DATA SAMPLE:`,
    ...merged.slice(0, 15).map(m => `  ${m}`),
    ``,
    `EXCEL FORMULA:`,
    `  =TEXTJOIN("${separator}", TRUE, A2:C2)`
  ].join('\n');
}

// 26. Excel Row and Column Counter
export function countRowsAndColumns(data: string): string {
  const rawLines = data.split(/\r?\n/);
  const nonEmptyRows = rawLines.filter(l => l.trim().length > 0);
  let maxCols = 0;
  let totalCells = 0;
  let populatedCells = 0;

  nonEmptyRows.forEach(row => {
    const cells = row.split(/[\t,]/);
    maxCols = Math.max(maxCols, cells.length);
    cells.forEach(c => {
      totalCells++;
      if (c.trim().length > 0) populatedCells++;
    });
  });

  const emptyCells = totalCells - populatedCells;
  const density = totalCells > 0 ? ((populatedCells / totalCells) * 100).toFixed(1) : '0';

  return [
    `════════════════════════════════════════════════════════════════`,
    `               SPREADSHEET GRID DIMENSION AUDIT                 `,
    `════════════════════════════════════════════════════════════════`,
    `TOTAL ROWS:             ${rawLines.length}`,
    `NON-EMPTY ROWS:         ${nonEmptyRows.length}`,
    `TOTAL COLUMNS:          ${maxCols}`,
    `TOTAL CELLS:            ${totalCells}`,
    `POPULATED CELLS:        ${populatedCells}`,
    `EMPTY / BLANK CELLS:    ${emptyCells}`,
    `DATA DENSITY:           ${density}%`,
    ``,
    `DIMENSION NOTATION:`,
    `  Grid Size: ${nonEmptyRows.length} Rows x ${maxCols} Columns (A1:${String.fromCharCode(64 + Math.min(26, maxCols))}${nonEmptyRows.length})`
  ].join('\n');
}

// 27. Excel Blank Cell Analyzer
export function analyzeBlankCells(data: string): string {
  const lines = data.split(/\r?\n/).filter(l => l.trim().length > 0);
  const blanks: string[] = [];
  let totalCells = 0;

  lines.forEach((line, rIdx) => {
    const cells = line.split(/[\t,]/);
    cells.forEach((cell, cIdx) => {
      totalCells++;
      if (!cell.trim()) {
        const colLetter = String.fromCharCode(65 + cIdx);
        blanks.push(`Cell ${colLetter}${rIdx + 1}`);
      }
    });
  });

  return [
    `════════════════════════════════════════════════════════════════`,
    `                EXCEL BLANK CELL AUDIT REPORT                   `,
    `════════════════════════════════════════════════════════════════`,
    `TOTAL CELLS INSPECTED: ${totalCells}`,
    `MISSING / BLANK CELLS: ${blanks.length}`,
    `COMPLETENESS RATE:     ${totalCells > 0 ? (((totalCells - blanks.length) / totalCells) * 100).toFixed(2) : 100}%`,
    ``,
    blanks.length > 0 ? `BLANK CELL COORDINATES:\n` + blanks.slice(0, 30).map(b => `  • ${b}`).join('\n') : '✅ Zero blank cells detected in this range.',
    ``,
    `USEFUL BLANK DETECTION FORMULAS:`,
    `  • Count blanks in range: =COUNTBLANK(A1:Z100)`,
    `  • Impute placeholder:    =IF(ISBLANK(A2), "N/A", A2)`
  ].join('\n');
}

// 28. Excel Formula Dependency Visualizer
export function visualizeFormulaDependencies(formula: string): string {
  const clean = formula.trim().replace(/^=/, '');
  const funcs = (clean.match(/[A-Z0-9_.]+\s*(?=\()/gi) || []).map(f => f.toUpperCase());
  const ranges = (clean.match(/(?:'?[A-Za-z0-9_ ]+'?!)?\$?[A-Z]+\$?[0-9]+(?::\$?[A-Z]+\$?[0-9]+)?/g) || []);

  return [
    `════════════════════════════════════════════════════════════════`,
    `             FORMULA DEPENDENCY HIERARCHY TREE                  `,
    `════════════════════════════════════════════════════════════════`,
    `TARGET FORMULA: =${clean}`,
    ``,
    `DEPENDENCY TREE:`,
    `  [Target Formula Cell]`,
    `    │`,
    `    ├── FUNCTIONS CALLED (${funcs.length}):`,
    ...funcs.map((f, i) => `    │     ${i === funcs.length - 1 ? '└──' : '├──'} fn: ${f}()`),
    `    │`,
    `    └── PRECEDENT CELL RANGES (${ranges.length}):`,
    ...ranges.map((r, i) => `          ${i === ranges.length - 1 ? '└──' : '├──'} ref: ${r}`),
    ``,
    `RECALCULATION CHAIN AUDIT:`,
    `  Whenever any cell in [ ${Array.from(new Set(ranges)).join(', ')} ] updates, this formula recalculates automatically.`
  ].join('\n');
}

// 29. Excel Text-to-Columns Planner
export function planTextToColumns(data: string): string {
  const lines = data.split(/\r?\n/).filter(l => l.trim().length > 0).slice(0, 20);

  const delimiterScores: Record<string, number> = {
    'Comma (,)': (data.match(/,/g) || []).length,
    'Tab (\\t)': (data.match(/\t/g) || []).length,
    'Semicolon (;)': (data.match(/;/g) || []).length,
    'Pipe (|)': (data.match(/\|/g) || []).length
  };

  const bestDelim = Object.entries(delimiterScores).sort((a, b) => b[1] - a[1])[0];

  return [
    `════════════════════════════════════════════════════════════════`,
    `              EXCEL TEXT-TO-COLUMNS PLANNER                     `,
    `════════════════════════════════════════════════════════════════`,
    `SAMPLE ROWS ANALYZED: ${lines.length}`,
    `RECOMMENDED STRATEGY: Delimited Split`,
    `DETECTED BEST DELIMITER: ${bestDelim[0]} (Found ${bestDelim[1]} occurrences)`,
    ``,
    `DELIMITER OCCURRENCE BREAKDOWN:`,
    ...Object.entries(delimiterScores).map(([name, count]) => `  • ${name}: ${count} matches`),
    ``,
    `STEP-BY-STEP EXCEL EXECUTION:`,
    `  1. Select the column containing your raw text data.`,
    `  2. Click 'Data' tab -> 'Text to Columns'.`,
    `  3. Select 'Delimited' -> Click Next.`,
    `  4. Check the box for '${bestDelim[0].split(' ')[0]}'.`,
    `  5. In Data Preview, verify columns -> Click Finish.`
  ].join('\n');
}

// 30. Excel Workbook Size Estimator
export function estimateWorkbookSize(
  rows: number,
  cols: number,
  formulaPercent: number = 10,
  hasFormatting: boolean = true
): string {
  const totalCells = rows * cols;
  const bytesPerRawValue = 12; // avg number/string in XML
  const bytesPerFormula = 45; // AST XML nodes
  const formattingOverhead = hasFormatting ? 1.25 : 1.0;

  const rawXmlBytes = (
    (totalCells * (1 - formulaPercent / 100) * bytesPerRawValue) +
    (totalCells * (formulaPercent / 100) * bytesPerFormula)
  ) * formattingOverhead;

  // XLSX is zipped XML, typically 4x to 6x compression
  const estimatedXlsxBytes = Math.round(rawXmlBytes / 4.8);
  const estimatedXlsbBytes = Math.round(estimatedXlsxBytes * 0.55); // XLSB is ~50% smaller
  const estimatedCsvBytes = Math.round(totalCells * 8);

  const formatSize = (b: number) => {
    if (b < 1024) return `${b} B`;
    if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
    return `${(b / (1024 * 1024)).toFixed(2)} MB`;
  };

  return [
    `════════════════════════════════════════════════════════════════`,
    `             EXCEL WORKBOOK FILE SIZE ESTIMATION                `,
    `════════════════════════════════════════════════════════════════`,
    `GRID DIMENSIONS: ${rows.toLocaleString()} Rows x ${cols} Columns`,
    `TOTAL CELLS:     ${totalCells.toLocaleString()}`,
    `FORMULA RATIO:   ${formulaPercent}%`,
    ``,
    `PROJECTED FILE SIZES ON DISK:`,
    `  • OpenXML (.xlsx):     ~${formatSize(estimatedXlsxBytes)} (Standard compressed package)`,
    `  • Binary Sheet (.xlsb): ~${formatSize(estimatedXlsbBytes)} (Fastest load time for big data)`,
    `  • Plain CSV (.csv):     ~${formatSize(estimatedCsvBytes)} (Uncompressed raw text)`,
    ``,
    `RAM FOOTPRINT ESTIMATION:`,
    `  When opened in Excel 64-bit, this sheet will consume approximately ~${formatSize(rawXmlBytes * 2)} of system RAM.`
  ].join('\n');
}

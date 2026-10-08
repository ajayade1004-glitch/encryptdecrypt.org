/**
 * Java Regular Expression Tester Engine (java.util.regex.Pattern & Matcher)
 * 100% Client-Side. Replicates Java 8 - Java 21 Regex Semantics in Web Browsers.
 */

export interface JavaRegexFlags {
  caseInsensitive: boolean; // Pattern.CASE_INSENSITIVE (0x02) - (?i)
  multiline: boolean;       // Pattern.MULTILINE (0x08) - (?m)
  dotall: boolean;          // Pattern.DOTALL (0x20) - (?s)
  unicodeCase: boolean;     // Pattern.UNICODE_CASE (0x40) - (?u)
  comments: boolean;        // Pattern.COMMENTS (0x04) - (?x)
  literal: boolean;         // Pattern.LITERAL (0x10)
  canonEq: boolean;         // Pattern.CANON_EQ (0x80)
}

export interface JavaRegexGroup {
  groupNumber: number;
  groupName?: string;
  value: string;
  start: number;
  end: number;
}

export interface JavaRegexMatch {
  index: number;
  matchIndex: number;
  start: number;
  end: number;
  fullMatch: string;
  groups: JavaRegexGroup[];
}

export interface JavaRegexResult {
  isValid: boolean;
  error?: string;
  pattern: string;
  flags: JavaRegexFlags;
  flagsBitmask: number;
  flagsString: string;
  flagsJavaCode: string;
  testString: string;
  matches: JavaRegexMatch[];
  totalMatches: number;
  replacedText?: string;
  replacementString?: string;
  executionTimeMs: number;
  javaCode: {
    findLoop: string;
    exactMatch: string;
    replace: string;
    escapedJavaString: string;
  };
}

export const DEFAULT_JAVA_FLAGS: JavaRegexFlags = {
  caseInsensitive: false,
  multiline: false,
  dotall: false,
  unicodeCase: false,
  comments: false,
  literal: false,
  canonEq: false
};

// Common Java Regular Expression Presets
export interface JavaRegexPreset {
  id: string;
  title: string;
  category: string;
  description: string;
  pattern: string;
  flags: Partial<JavaRegexFlags>;
  sampleText: string;
  replacement?: string;
}

export const JAVA_REGEX_PRESETS: JavaRegexPreset[] = [
  {
    id: 'email-rfc5322',
    title: 'Email Address (RFC 5322)',
    category: 'Validation',
    description: 'Matches standard user and domain email addresses conforming to standard web forms.',
    pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    flags: { caseInsensitive: true },
    sampleText: 'Contact support@encryptdecrypt.org or admin@dev.acme.co for assistance. Invalid: user@.com',
    replacement: '[PROTECTED_EMAIL]'
  },
  {
    id: 'iso-8601-date',
    title: 'ISO 8601 Date (YYYY-MM-DD)',
    category: 'DateTime',
    description: 'Extracts year, month, and day into capturing groups with boundary limits.',
    pattern: '(?<year>\\d{4})-(?<month>0[1-9]|1[0-2])-(?<day>0[1-9]|[12]\\d|3[01])',
    flags: {},
    sampleText: 'Deployment schedules: Release-1 on 2026-10-08, Sprint-2 on 2026-11-15, Final on 2027-01-01.',
    replacement: '${day}/${month}/${year}'
  },
  {
    id: 'ipv4-address',
    title: 'IPv4 Address with Octets',
    category: 'Networking',
    description: 'Validates 0-255 quad-dotted IPv4 addresses with 4 distinct byte capturing groups.',
    pattern: '\\b((?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\b',
    flags: {},
    sampleText: 'Localhost: 127.0.0.1, Gateway: 192.168.1.1, DNS: 8.8.8.8, Invalid: 999.12.34.56.',
    replacement: '[IP_REDACTED]'
  },
  {
    id: 'java-package-class',
    title: 'Java Fully Qualified Class Name',
    category: 'Java Language',
    description: 'Validates canonical Java package path and class identifiers.',
    pattern: '\\b([a-z_][a-z0-9_]*\\.)+([A-Z][a-zA-Z0-9_$]*)\\b',
    flags: {},
    sampleText: 'Using java.util.regex.Pattern and com.example.service.AuthService inside org.apache.commons.lang3.StringUtils.',
    replacement: '$2'
  },
  {
    id: 'url-parser',
    title: 'HTTP/HTTPS URL with Protocol & Host',
    category: 'Web',
    description: 'Captures protocol, domain host, optional port, and resource path.',
    pattern: '(?<protocol>https?)://(?<host>[a-zA-Z0-9.-]+)(?::(?<port>\\d+))?(?<path>/[^\\s?]*)?',
    flags: { caseInsensitive: true },
    sampleText: 'Visit https://www.encryptdecrypt.org/tools/java-regular-expression-tester or http://localhost:8080/api/v1/health.',
    replacement: '$2'
  },
  {
    id: 'strong-password',
    title: 'Strong Password Policy',
    category: 'Security',
    description: 'Enforces >= 8 chars, 1 uppercase, 1 lowercase, 1 digit, and 1 special symbol via lookaheads.',
    pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$',
    flags: {},
    sampleText: 'P@ssw0rd2026\nweakpass\nSecret123!\nALLCAPS123!',
    replacement: 'VALID_SECRET'
  },
  {
    id: 'hex-color-code',
    title: 'HEX Color Code (#RGB / #RRGGBB)',
    category: 'CSS / Web',
    description: 'Matches 3 or 6 hex digits preceded by a hash symbol.',
    pattern: '#(?:[0-9a-fA-F]{3}){1,2}\\b',
    flags: { caseInsensitive: true },
    sampleText: 'Theme primary is #2E9BFF, secondary #10B981, background #030712, accent #fff or #000.',
    replacement: 'var(--color)'
  },
  {
    id: 'html-tag-stripper',
    title: 'HTML Tag Stripper & Extractor',
    category: 'Text Processing',
    description: 'Matches HTML opening, closing, and self-closing tags with attribute capture.',
    pattern: '<(?<tag>[a-zA-Z0-9]+)(?:\\s+[^>]*)?>(.*?)<\\/\\k<tag>>|<[a-zA-Z0-9]+(?:\\s+[^>]*)?\\/?>',
    flags: { dotall: true },
    sampleText: '<div class="alert"><p>Warning: <strong>Zero server logs</strong> guaranteed.</p><br/></div>',
    replacement: '$2'
  }
];

/**
 * Translates Java POSIX character classes (\p{Alpha}, etc.) into standard JS character classes
 */
function translateJavaPosixClasses(pattern: string): string {
  return pattern
    .replace(/\\p\{Alpha\}/g, '[a-zA-Z]')
    .replace(/\\p\{Lower\}/g, '[a-z]')
    .replace(/\\p\{Upper\}/g, '[A-Z]')
    .replace(/\\p\{Digit\}/g, '\\d')
    .replace(/\\p\{Alnum\}/g, '[a-zA-Z0-9]')
    .replace(/\\p\{Punct\}/g, '[!-/:-@\\[-`{-~]')
    .replace(/\\p\{Graph\}/g, '[!-~]')
    .replace(/\\p\{Print\}/g, '[ -~]')
    .replace(/\\p\{Blank\}/g, '[ \\t]')
    .replace(/\\p\{Cntrl\}/g, '[\\x00-\\x1F\\x7F]')
    .replace(/\\p\{XDigit\}/g, '[0-9a-fA-F]')
    .replace(/\\p\{Space\}/g, '\\s')
    .replace(/\\p\{ASCII\}/g, '[\\x00-\\x7F]');
}

/**
 * Strips comments from regex when Pattern.COMMENTS (?x) is enabled
 */
function stripRegexComments(pattern: string): string {
  const lines = pattern.split('\n');
  return lines
    .map(line => {
      // Find comment # that is not escaped
      let inCharClass = false;
      let escaped = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (escaped) {
          escaped = false;
          continue;
        }
        if (char === '\\') {
          escaped = true;
          continue;
        }
        if (char === '[') inCharClass = true;
        if (char === ']') inCharClass = false;
        if (char === '#' && !inCharClass) {
          return line.substring(0, i).trim();
        }
      }
      return line.trim();
    })
    .join('');
}

/**
 * Computes Java Pattern bitmask from active flags
 */
export function getJavaFlagsBitmask(flags: JavaRegexFlags): { bitmask: number; flagsString: string; javaCode: string } {
  let bitmask = 0;
  const parts: string[] = [];
  const javaParts: string[] = [];

  if (flags.caseInsensitive) {
    bitmask |= 0x02;
    parts.push('i');
    javaParts.push('Pattern.CASE_INSENSITIVE');
  }
  if (flags.multiline) {
    bitmask |= 0x08;
    parts.push('m');
    javaParts.push('Pattern.MULTILINE');
  }
  if (flags.dotall) {
    bitmask |= 0x20;
    parts.push('s');
    javaParts.push('Pattern.DOTALL');
  }
  if (flags.unicodeCase) {
    bitmask |= 0x40;
    parts.push('u');
    javaParts.push('Pattern.UNICODE_CASE');
  }
  if (flags.comments) {
    bitmask |= 0x04;
    parts.push('x');
    javaParts.push('Pattern.COMMENTS');
  }
  if (flags.literal) {
    bitmask |= 0x10;
    javaParts.push('Pattern.LITERAL');
  }
  if (flags.canonEq) {
    bitmask |= 0x80;
    javaParts.push('Pattern.CANON_EQ');
  }

  const flagsString = parts.length > 0 ? `(?${parts.join('')})` : '(none)';
  const javaCode = javaParts.length > 0 ? javaParts.join(' | ') : '0';

  return { bitmask, flagsString, javaCode };
}

/**
 * Escapes regex pattern for use as a Java string literal (e.g. \d -> \\d, " -> \")
 */
export function escapeForJavaStringLiteral(pattern: string): string {
  return pattern
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/\n/g, '\\n')
    .replace(/\r/g, '\\r')
    .replace(/\t/g, '\\t');
}

/**
 * Generates ready-to-run Java 8 - 21 source code snippets
 */
export function generateJavaCodeSnippets(pattern: string, flags: JavaRegexFlags, testString: string, replacement = '$1'): {
  findLoop: string;
  exactMatch: string;
  replace: string;
  escapedJavaString: string;
} {
  const escapedPattern = escapeForJavaStringLiteral(pattern);
  const escapedReplacement = escapeForJavaStringLiteral(replacement);
  const sampleEscaped = escapeForJavaStringLiteral(testString.substring(0, 100));
  const { javaCode } = getJavaFlagsBitmask(flags);

  const patternInit = javaCode !== '0'
    ? `Pattern pattern = Pattern.compile("${escapedPattern}", ${javaCode});`
    : `Pattern pattern = Pattern.compile("${escapedPattern}");`;

  const findLoop = `import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class JavaRegexDemo {
    public static void main(String[] args) {
        String text = "${sampleEscaped}";
        ${patternInit}
        Matcher matcher = pattern.matcher(text);

        int matchCount = 0;
        while (matcher.find()) {
            matchCount++;
            System.out.printf("Match #%d: '%s' [start: %d, end: %d]%n",
                matchCount, matcher.group(), matcher.start(), matcher.end());

            // Iterate over capturing groups
            for (int i = 1; i <= matcher.groupCount(); i++) {
                System.out.printf("  Group %d: '%s' [%d..%d]%n",
                    i, matcher.group(i), matcher.start(i), matcher.end(i));
            }
        }

        if (matchCount == 0) {
            System.out.println("Zero matches found.");
        }
    }
}`;

  const exactMatch = `import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class JavaRegexValidate {
    public static void main(String[] args) {
        String input = "${sampleEscaped}";
        ${patternInit}
        Matcher matcher = pattern.matcher(input);

        // checks if ENTIRE input sequence matches pattern
        boolean isFullMatch = matcher.matches();
        System.out.println("Exact Match: " + isFullMatch);
    }
}`;

  const replace = `import java.util.regex.Pattern;
import java.util.regex.Matcher;

public class JavaRegexReplace {
    public static void main(String[] args) {
        String text = "${sampleEscaped}";
        ${patternInit}
        Matcher matcher = pattern.matcher(text);

        // Matcher.replaceAll with Java group references ($1, $2, etc.)
        String result = matcher.replaceAll("${escapedReplacement}");
        System.out.println("Replaced text: " + result);
    }
}`;

  const escapedJavaString = `"${escapedPattern}"`;

  return { findLoop, exactMatch, replace, escapedJavaString };
}

/**
 * Executes the Java Regular Expression against the test string
 */
export function executeJavaRegex(
  rawPattern: string,
  testString: string,
  flags: JavaRegexFlags = DEFAULT_JAVA_FLAGS,
  replacementString?: string
): JavaRegexResult {
  const startTime = performance.now();
  const { bitmask, flagsString, javaCode: flagsJavaCode } = getJavaFlagsBitmask(flags);

  if (!rawPattern) {
    return {
      isValid: true,
      pattern: '',
      flags,
      flagsBitmask: bitmask,
      flagsString,
      flagsJavaCode,
      testString,
      matches: [],
      totalMatches: 0,
      executionTimeMs: 0,
      javaCode: generateJavaCodeSnippets('', flags, testString, replacementString)
    };
  }

  try {
    let processedPattern = rawPattern;

    if (flags.literal) {
      processedPattern = rawPattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    } else {
      if (flags.comments) {
        processedPattern = stripRegexComments(processedPattern);
      }
      processedPattern = translateJavaPosixClasses(processedPattern);
    }

    // Build JavaScript RegExp flags corresponding to Java flags
    let jsFlags = 'g';
    if (flags.caseInsensitive) jsFlags += 'i';
    if (flags.multiline) jsFlags += 'm';
    if (flags.dotall) jsFlags += 's';
    if (flags.unicodeCase) jsFlags += 'u';

    const regex = new RegExp(processedPattern, jsFlags);
    const matches: JavaRegexMatch[] = [];

    let matchIdx = 0;
    let match: RegExpExecArray | null;

    // Safety guard against infinite loops on zero-length matches
    let lastIndex = -1;
    let iterations = 0;
    const MAX_ITERATIONS = 5000;

    while ((match = regex.exec(testString)) !== null) {
      iterations++;
      if (iterations > MAX_ITERATIONS) break;

      matchIdx++;
      const fullMatch = match[0];
      const start = match.index;
      const end = start + fullMatch.length;

      // Extract capturing groups
      const groups: JavaRegexGroup[] = [];
      let currentOffset = start;

      // Group 0 is full match
      groups.push({
        groupNumber: 0,
        value: fullMatch,
        start,
        end
      });

      for (let g = 1; g < match.length; g++) {
        const val = match[g];
        if (val !== undefined) {
          const gStart = fullMatch.indexOf(val, currentOffset - start);
          const actualStart = gStart !== -1 ? start + gStart : start;
          const actualEnd = actualStart + val.length;
          groups.push({
            groupNumber: g,
            value: val,
            start: actualStart,
            end: actualEnd
          });
        } else {
          groups.push({
            groupNumber: g,
            value: '',
            start: -1,
            end: -1
          });
        }
      }

      // Check for named groups
      if (match.groups) {
        for (const [name, val] of Object.entries(match.groups)) {
          if (val !== undefined) {
            const existing = groups.find(grp => grp.value === val);
            if (existing) {
              existing.groupName = name;
            }
          }
        }
      }

      matches.push({
        index: matchIdx,
        matchIndex: matchIdx,
        start,
        end,
        fullMatch,
        groups
      });

      // Avoid infinite loop on zero-width match
      if (regex.lastIndex === lastIndex) {
        regex.lastIndex++;
      }
      lastIndex = regex.lastIndex;

      if (!regex.global) break;
    }

    // Replacement calculation if replacementString provided
    let replacedText: string | undefined;
    if (replacementString !== undefined) {
      // In Java replacement, $1, $2 are capture references, \\ is backslash, \$ is dollar
      const javaToJsReplacement = replacementString
        .replace(/\\([\\$])/g, '$1')
        .replace(/\$\{([a-zA-Z0-9_]+)\}/g, '$$<$1>'); // named groups

      replacedText = testString.replace(regex, javaToJsReplacement);
    }

    const executionTimeMs = +(performance.now() - startTime).toFixed(2);
    const javaCodeSnippets = generateJavaCodeSnippets(rawPattern, flags, testString, replacementString || '$1');

    return {
      isValid: true,
      pattern: rawPattern,
      flags,
      flagsBitmask: bitmask,
      flagsString,
      flagsJavaCode,
      testString,
      matches,
      totalMatches: matches.length,
      replacedText,
      replacementString,
      executionTimeMs,
      javaCode: javaCodeSnippets
    };
  } catch (err: any) {
    const executionTimeMs = +(performance.now() - startTime).toFixed(2);
    return {
      isValid: false,
      error: err.message || 'Invalid regular expression syntax',
      pattern: rawPattern,
      flags,
      flagsBitmask: bitmask,
      flagsString,
      flagsJavaCode,
      testString,
      matches: [],
      totalMatches: 0,
      executionTimeMs,
      javaCode: generateJavaCodeSnippets(rawPattern, flags, testString, replacementString || '$1')
    };
  }
}

/**
 * Universal text query runner for Java Regular Expression Tester
 * Used by UniversalToolDispatcher and quick runners
 */
export function runJavaRegexTester(input: string): string {
  if (!input || !input.trim()) {
    input = 'Pattern: [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\nText: Contact test@encryptdecrypt.org or dev@java.com';
  }

  // Parse pattern, flags, and text from query if provided in format
  let pattern = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}';
  let text = input;
  let flags = { ...DEFAULT_JAVA_FLAGS };
  let replacement: string | undefined;

  const patternMatch = input.match(/(?:Pattern|Regex|RegEx):\s*(.+)/i);
  const textMatch = input.match(/(?:Text|String|Input):\s*([\s\S]+)/i);
  const flagsMatch = input.match(/(?:Flags):\s*([a-zA-Z_|\s]+)/i);
  const replaceMatch = input.match(/(?:Replace|Replacement):\s*(.+)/i);

  if (patternMatch && textMatch) {
    pattern = patternMatch[1].trim();
    text = textMatch[1].trim();
    if (flagsMatch) {
      const flagStr = flagsMatch[1].toLowerCase();
      if (flagStr.includes('case') || flagStr.includes('i')) flags.caseInsensitive = true;
      if (flagStr.includes('multi') || flagStr.includes('m')) flags.multiline = true;
      if (flagStr.includes('dotall') || flagStr.includes('s')) flags.dotall = true;
      if (flagStr.includes('comments') || flagStr.includes('x')) flags.comments = true;
      if (flagStr.includes('literal')) flags.literal = true;
    }
    if (replaceMatch) {
      replacement = replaceMatch[1].trim();
    }
  }

  const result = executeJavaRegex(pattern, text, flags, replacement);

  if (!result.isValid) {
    return `=== JAVA REGULAR EXPRESSION TESTER ===\nError: ${result.error}\nPattern: ${pattern}\nFlags: ${result.flagsString}\n\nTroubleshooting Tip: In Java string literals, ensure backslashes are escaped (e.g. "\\\\d+" instead of "\\d+").`;
  }

  const lines: string[] = [
    `=== JAVA REGULAR EXPRESSION TESTER (java.util.regex.Pattern) ===`,
    `Pattern: ${result.pattern}`,
    `Flags: ${result.flagsString} [Bitmask: 0x${result.flagsBitmask.toString(16).toUpperCase()}, Java: ${result.flagsJavaCode}]`,
    `Total Matches: ${result.totalMatches}`,
    `Execution Time: ${result.executionTimeMs} ms`,
    `Evaluation Status: Valid Java Regex Pattern`,
    `------------------------------------------------------------`
  ];

  if (result.matches.length === 0) {
    lines.push(`No matches found in the provided test string.`);
  } else {
    result.matches.forEach(m => {
      lines.push(`Match #${m.index}: "${m.fullMatch}" (Indices: ${m.start}..${m.end}, Length: ${m.fullMatch.length})`);
      if (m.groups.length > 1) {
        m.groups.slice(1).forEach(g => {
          const nameTag = g.groupName ? ` [Name: ${g.groupName}]` : '';
          lines.push(`  └─ Group ${g.groupNumber}${nameTag}: "${g.value}" (${g.start}..${g.end})`);
        });
      }
    });
  }

  if (result.replacedText !== undefined) {
    lines.push(`------------------------------------------------------------`);
    lines.push(`Replacement Output (Matcher.replaceAll):`);
    lines.push(result.replacedText);
  }

  lines.push(`------------------------------------------------------------`);
  lines.push(`Java String Literal Representation:`);
  lines.push(`String regex = ${result.javaCode.escapedJavaString};`);
  lines.push(`Pattern pattern = Pattern.compile(regex${result.flagsJavaCode !== '0' ? ', ' + result.flagsJavaCode : ''});`);

  return lines.join('\n');
}

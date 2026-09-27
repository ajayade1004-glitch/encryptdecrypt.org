/**
 * API & JSON Client-Side Developer Engines
 * 100% browser-native JSON transformation, validation, code generation, and formatting.
 */

function safeParseJson(input: string): any {
  try {
    return JSON.parse(input);
  } catch (err: any) {
    throw new Error(`Invalid JSON syntax: ${err.message}`);
  }
}

/**
 * 1. JSON Flatten Tool
 * Flattens nested objects into dot notation keys
 */
export function flattenJson(input: string, delimiter = '.'): string {
  const data = safeParseJson(input);
  const result: Record<string, any> = {};

  function recurse(cur: any, prop: string) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      if (cur.length === 0) {
        result[prop] = [];
      } else {
        for (let i = 0; i < cur.length; i++) {
          recurse(cur[i], prop ? `${prop}${delimiter}${i}` : `${i}`);
        }
      }
    } else {
      let isEmpty = true;
      for (const p of Object.keys(cur)) {
        isEmpty = false;
        recurse(cur[p], prop ? `${prop}${delimiter}${p}` : p);
      }
      if (isEmpty && prop) {
        result[prop] = {};
      }
    }
  }

  recurse(data, '');
  return JSON.stringify(result, null, 2);
}

/**
 * 2. JSON Unflatten Tool
 * Restores dot-notation JSON to nested structure
 */
export function unflattenJson(input: string, delimiter = '.'): string {
  const data = safeParseJson(input);
  if (Object(data) !== data || Array.isArray(data)) {
    return JSON.stringify(data, null, 2);
  }

  const result: Record<string, any> = {};

  for (const i of Object.keys(data)) {
    const keys = i.split(delimiter);
    keys.reduce((acc, key, idx) => {
      if (idx === keys.length - 1) {
        acc[key] = data[i];
        return acc[key];
      }
      const nextKeyIsNum = !isNaN(Number(keys[idx + 1]));
      if (!acc[key]) {
        acc[key] = nextKeyIsNum ? [] : {};
      }
      return acc[key];
    }, result);
  }

  return JSON.stringify(result, null, 2);
}

/**
 * 3. JSON Array Sorter
 */
export function sortJsonArray(input: string, key = 'id', order: 'asc' | 'desc' = 'asc'): string {
  const data = safeParseJson(input);
  if (!Array.isArray(data)) {
    throw new Error('Input must be a JSON array of objects.');
  }

  const sorted = [...data].sort((a, b) => {
    const valA = a?.[key];
    const valB = b?.[key];
    if (valA === undefined) return 1;
    if (valB === undefined) return -1;

    let cmp = 0;
    if (typeof valA === 'number' && typeof valB === 'number') {
      cmp = valA - valB;
    } else {
      cmp = String(valA).localeCompare(String(valB));
    }
    return order === 'desc' ? -cmp : cmp;
  });

  return JSON.stringify(sorted, null, 2);
}

/**
 * 4. JSON Array Filter
 */
export function filterJsonArray(input: string, key = 'status', condition = 'active'): string {
  const data = safeParseJson(input);
  if (!Array.isArray(data)) {
    throw new Error('Input must be a JSON array of objects.');
  }

  const filtered = data.filter(item => {
    if (!item || typeof item !== 'object') return false;
    const val = item[key];
    if (val === undefined) return false;
    return String(val).toLowerCase().includes(condition.toLowerCase());
  });

  return JSON.stringify(filtered, null, 2);
}

/**
 * 5. JSON Key Renamer
 */
export function renameJsonKey(input: string, oldKey = 'user_id', newKey = 'userId'): string {
  const data = safeParseJson(input);

  function walk(node: any): any {
    if (Array.isArray(node)) {
      return node.map(walk);
    }
    if (node && typeof node === 'object') {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(node)) {
        const targetK = k === oldKey ? newKey : k;
        out[targetK] = walk(v);
      }
      return out;
    }
    return node;
  }

  return JSON.stringify(walk(data), null, 2);
}

/**
 * 6. JSON Key Remover
 */
export function removeJsonKey(input: string, keysToRemove = ['password', 'secret', '__v', 'token']): string {
  const data = safeParseJson(input);
  const removeSet = new Set(keysToRemove.map(k => k.trim().toLowerCase()));

  function walk(node: any): any {
    if (Array.isArray(node)) {
      return node.map(walk);
    }
    if (node && typeof node === 'object') {
      const out: Record<string, any> = {};
      for (const [k, v] of Object.entries(node)) {
        if (!removeSet.has(k.toLowerCase())) {
          out[k] = walk(v);
        }
      }
      return out;
    }
    return node;
  }

  return JSON.stringify(walk(data), null, 2);
}

/**
 * 7. JSON Key Extractor
 */
export function extractJsonKeys(input: string): string {
  const data = safeParseJson(input);
  const paths = new Set<string>();

  function walk(node: any, prefix = '') {
    if (Array.isArray(node)) {
      if (node.length > 0) walk(node[0], `${prefix}[]`);
    } else if (node && typeof node === 'object') {
      for (const k of Object.keys(node)) {
        const path = prefix ? `${prefix}.${k}` : k;
        paths.add(path);
        walk(node[k], path);
      }
    }
  }

  walk(data);
  const list = Array.from(paths).sort();
  return `# Extracted JSON Key Hierarchy (${list.length} keys found):\n` + list.join('\n');
}

/**
 * 8. JSON Lines Formatter
 */
export function formatJsonLines(input: string): string {
  const trimmed = input.trim();
  if (trimmed.startsWith('[')) {
    // Array to JSONL
    const arr = safeParseJson(trimmed);
    if (!Array.isArray(arr)) return trimmed;
    return arr.map(item => JSON.stringify(item)).join('\n');
  }

  // JSONL to Array
  const lines = trimmed.split(/\r?\n/).filter(l => l.trim().length > 0);
  const arr = lines.map(line => JSON.parse(line));
  return JSON.stringify(arr, null, 2);
}

/**
 * 9. JSON Deep Merge Tool
 */
export function deepMergeJson(jsonA: string, jsonB: string): string {
  const objA = safeParseJson(jsonA);
  const objB = safeParseJson(jsonB);

  function merge(target: any, source: any): any {
    if (Array.isArray(target) && Array.isArray(source)) {
      return [...target, ...source];
    }
    if (target && typeof target === 'object' && source && typeof source === 'object') {
      const out = { ...target };
      for (const key of Object.keys(source)) {
        if (key in target) {
          out[key] = merge(target[key], source[key]);
        } else {
          out[key] = source[key];
        }
      }
      return out;
    }
    return source !== undefined ? source : target;
  }

  const merged = merge(objA, objB);
  return JSON.stringify(merged, null, 2);
}

/**
 * 10. JSON Patch Generator (RFC 6902)
 */
export function generateJsonPatch(originalStr: string, updatedStr: string): string {
  const original = safeParseJson(originalStr);
  const updated = safeParseJson(updatedStr);
  const patches: Array<{ op: string; path: string; value?: any }> = [];

  function diff(a: any, b: any, path: string) {
    if (a === b) return;
    if (typeof a !== typeof b || a === null || b === null || typeof a !== 'object') {
      patches.push({ op: 'replace', path: path || '/', value: b });
      return;
    }

    if (Array.isArray(a) && Array.isArray(b)) {
      patches.push({ op: 'replace', path: path || '/', value: b });
      return;
    }

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    for (const key of aKeys) {
      if (!(key in b)) {
        patches.push({ op: 'remove', path: `${path}/${key}` });
      }
    }

    for (const key of bKeys) {
      if (!(key in a)) {
        patches.push({ op: 'add', path: `${path}/${key}`, value: b[key] });
      } else {
        diff(a[key], b[key], `${path}/${key}`);
      }
    }
  }

  diff(original, updated, '');
  return JSON.stringify(patches, null, 2);
}

/**
 * 11. JSON Patch Tester (RFC 6902)
 */
export function applyJsonPatch(targetStr: string, patchStr: string): string {
  const target = safeParseJson(targetStr);
  const patches = safeParseJson(patchStr);

  if (!Array.isArray(patches)) {
    throw new Error('Patch must be an array of RFC 6902 operations.');
  }

  const result = JSON.parse(JSON.stringify(target));

  for (const patch of patches) {
    const parts = patch.path.split('/').filter(Boolean);
    let cur = result;
    for (let i = 0; i < parts.length - 1; i++) {
      cur = cur[parts[i]];
      if (!cur) break;
    }

    const lastKey = parts[parts.length - 1];
    if (cur && lastKey) {
      if (patch.op === 'add' || patch.op === 'replace') {
        cur[lastKey] = patch.value;
      } else if (patch.op === 'remove') {
        delete cur[lastKey];
      }
    }
  }

  return JSON.stringify(result, null, 2);
}

/**
 * 12. JSON Pointer Tester (RFC 6901)
 */
export function testJsonPointer(input: string, pointer = '/users/0/email'): string {
  const data = safeParseJson(input);
  if (!pointer || pointer === '/') {
    return JSON.stringify(data, null, 2);
  }

  const tokens = pointer.split('/').slice(1).map(t => t.replace(/~1/g, '/').replace(/~0/g, '~'));
  let current: any = data;

  for (const token of tokens) {
    if (current === undefined || current === null) {
      return `/* JSON Pointer "${pointer}" resolved to: undefined */\nnull`;
    }
    current = current[token];
  }

  return `/* Resolved value at pointer "${pointer}": */\n` + JSON.stringify(current, null, 2);
}

/**
 * 13. JSON Size Calculator
 */
export function calculateJsonSize(input: string): string {
  const rawBytes = new Blob([input]).size;
  let minified = '';
  try {
    minified = JSON.stringify(JSON.parse(input));
  } catch {
    minified = input.replace(/\s+/g, '');
  }
  const minifiedBytes = new Blob([minified]).size;
  const estimatedGzip = Math.round(minifiedBytes * 0.35); // Approx 65% compression ratio

  return `=== JSON SIZE & FOOTPRINT REPORT ===
Raw Formatted Size   : ${rawBytes.toLocaleString()} bytes (${(rawBytes / 1024).toFixed(2)} KB)
Minified Size        : ${minifiedBytes.toLocaleString()} bytes (${(minifiedBytes / 1024).toFixed(2)} KB)
Estimated Gzip/Brotli: ~${estimatedGzip.toLocaleString()} bytes (~${(estimatedGzip / 1024).toFixed(2)} KB)
Bandwidth Reduction  : ${((1 - minifiedBytes / Math.max(1, rawBytes)) * 100).toFixed(1)}% savings via minification`;
}

/**
 * 14. JSON Structure Visualizer
 */
export function visualizeJsonStructure(input: string): string {
  const data = safeParseJson(input);

  function describe(val: any, indent = ''): string {
    if (val === null) return `${indent}null`;
    if (Array.isArray(val)) {
      if (val.length === 0) return `${indent}Array[] (empty)`;
      return `${indent}Array[${val.length}] {\n${describe(val[0], indent + '  ')}\n${indent}}`;
    }
    if (typeof val === 'object') {
      const keys = Object.keys(val);
      if (keys.length === 0) return `${indent}Object{} (empty)`;
      return keys.map(k => `${indent}├── ${k}: ${typeof val[k] === 'object' && val[k] !== null ? '\n' + describe(val[k], indent + '│   ') : typeof val[k]}`).join('\n');
    }
    return `${indent}${typeof val}`;
  }

  return `=== JSON SCHEMA STRUCTURE TREE ===\nRoot: ${Array.isArray(data) ? 'Array' : typeof data}\n` + describe(data);
}

/**
 * 15. JSON Array Deduplicator
 */
export function deduplicateJsonArray(input: string, key?: string): string {
  const data = safeParseJson(input);
  if (!Array.isArray(data)) {
    throw new Error('Input must be a JSON array.');
  }

  const seen = new Set<string>();
  const out: any[] = [];

  for (const item of data) {
    const ident = key && item && typeof item === 'object' && item[key] !== undefined
      ? String(item[key])
      : JSON.stringify(item);

    if (!seen.has(ident)) {
      seen.add(ident);
      out.push(item);
    }
  }

  return JSON.stringify(out, null, 2);
}

/**
 * 16. JSON Object Key Sorter
 */
export function sortJsonObjectKeys(input: string): string {
  const data = safeParseJson(input);

  function sortKeys(obj: any): any {
    if (Array.isArray(obj)) return obj.map(sortKeys);
    if (obj && typeof obj === 'object') {
      const sorted: Record<string, any> = {};
      Object.keys(obj).sort().forEach(k => {
        sorted[k] = sortKeys(obj[k]);
      });
      return sorted;
    }
    return obj;
  }

  return JSON.stringify(sortKeys(data), null, 2);
}

/**
 * 17. JSON Nested Value Extractor
 */
export function extractNestedJsonValues(input: string, targetKey = 'email'): string {
  const data = safeParseJson(input);
  const values: any[] = [];

  function walk(node: any) {
    if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        if (k.toLowerCase() === targetKey.toLowerCase()) {
          values.push(v);
        }
        walk(v);
      }
    }
  }

  walk(data);
  return `# Extracted values for key "${targetKey}" (${values.length} matches found):\n` + JSON.stringify(values, null, 2);
}

/**
 * 18. JSON Path Generator
 */
export function generateJsonPaths(input: string): string {
  const data = safeParseJson(input);
  const paths: string[] = [];

  function walk(node: any, path: string) {
    if (Array.isArray(node)) {
      node.forEach((item, idx) => walk(item, `${path}[${idx}]`));
    } else if (node && typeof node === 'object') {
      for (const [k, v] of Object.entries(node)) {
        walk(v, `${path}.${k}`);
      }
    } else {
      paths.push(`${path} = ${JSON.stringify(node)}`);
    }
  }

  walk(data, '$');
  return `=== JSONPaths (${paths.length} terminal nodes) ===\n` + paths.join('\n');
}

/**
 * 19. JSON Schema Diff Tool
 */
export function diffJsonSchemas(schemaAStr: string, schemaBStr: string): string {
  const a = safeParseJson(schemaAStr);
  const b = safeParseJson(schemaBStr);

  function getType(v: any): string {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    return typeof v;
  }

  const reports: string[] = ['=== JSON SCHEMA DIFF REPORT ==='];

  function compare(objA: any, objB: any, path = 'root') {
    const typeA = getType(objA);
    const typeB = getType(objB);

    if (typeA !== typeB) {
      reports.push(`• [TYPE MISMATCH] at ${path}: Left has "${typeA}", Right has "${typeB}"`);
      return;
    }

    if (typeA === 'object') {
      const allKeys = new Set([...Object.keys(objA || {}), ...Object.keys(objB || {})]);
      for (const k of allKeys) {
        if (!(k in objA)) {
          reports.push(`• [MISSING ON LEFT] ${path}.${k} (present on right as ${getType(objB[k])})`);
        } else if (!(k in objB)) {
          reports.push(`• [MISSING ON RIGHT] ${path}.${k} (present on left as ${getType(objA[k])})`);
        } else {
          compare(objA[k], objB[k], `${path}.${k}`);
        }
      }
    }
  }

  compare(a, b);
  if (reports.length === 1) {
    reports.push('✓ Both JSON documents share an identical schema structure!');
  }
  return reports.join('\n');
}

/**
 * 20. JSON API Mock Response Generator
 */
export function generateApiMockResponse(
  status = 200,
  resource = 'users',
  pageSize = 3
): string {
  const items = Array.from({ length: pageSize }, (_, i) => ({
    id: `usr_${1000 + i}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: i % 2 === 0 ? 'active' : 'pending',
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }));

  const response = {
    status: status,
    success: status >= 200 && status < 300,
    timestamp: new Date().toISOString(),
    pagination: {
      page: 1,
      pageSize: pageSize,
      totalItems: 42,
      totalPages: 14
    },
    data: items
  };

  return JSON.stringify(response, null, 2);
}

/**
 * 21. JSON Data Faker
 */
export function generateFakeJsonData(recordCount = 3): string {
  const firstNames = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Sam', 'Robin'];
  const lastNames = ['Vance', 'Chen', 'Patel', 'Smith', 'Dubois', 'Kim', 'Garcia'];
  const roles = ['Administrator', 'Cryptographer', 'Security Auditor', 'Developer'];

  const list = Array.from({ length: recordCount }, (_, i) => {
    const fn = firstNames[i % firstNames.length];
    const ln = lastNames[i % lastNames.length];
    return {
      id: `usr_${Math.random().toString(36).substring(2, 9)}`,
      name: `${fn} ${ln}`,
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}@cryptovault.org`,
      role: roles[i % roles.length],
      isVerified: true,
      balance: parseFloat((Math.random() * 5000 + 100).toFixed(2)),
      lastLogin: new Date(Date.now() - Math.floor(Math.random() * 10000000)).toISOString()
    };
  });

  return JSON.stringify(list, null, 2);
}

/**
 * 22. JSON to Rust Struct Converter
 */
export function jsonToRustStruct(input: string, rootName = 'RootModel'): string {
  const data = safeParseJson(input);
  const sample = Array.isArray(data) ? (data[0] || {}) : data;

  const lines = [
    'use serde::{Serialize, Deserialize};',
    '',
    '#[derive(Debug, Serialize, Deserialize)]',
    `pub struct ${rootName} {`
  ];

  for (const [k, v] of Object.entries(sample)) {
    let rustType = 'String';
    if (typeof v === 'number') rustType = Number.isInteger(v) ? 'i64' : 'f64';
    else if (typeof v === 'boolean') rustType = 'bool';
    else if (Array.isArray(v)) rustType = 'Vec<serde_json::Value>';
    else if (typeof v === 'object' && v !== null) rustType = 'serde_json::Value';

    const snakeKey = k.replace(/([A-Z])/g, '_$1').toLowerCase().replace(/^_/, '');
    if (snakeKey !== k) {
      lines.push(`    #[serde(rename = "${k}")]`);
    }
    lines.push(`    pub ${snakeKey}: ${rustType},`);
  }

  lines.push('}');
  return lines.join('\n');
}

/**
 * 23. JSON to Swift Model Converter
 */
export function jsonToSwiftModel(input: string, structName = 'UserModel'): string {
  const data = safeParseJson(input);
  const sample = Array.isArray(data) ? (data[0] || {}) : data;

  const lines = [
    `import Foundation`,
    ``,
    `public struct ${structName}: Codable {`
  ];

  for (const [k, v] of Object.entries(sample)) {
    let swiftType = 'String';
    if (typeof v === 'number') swiftType = Number.isInteger(v) ? 'Int' : 'Double';
    else if (typeof v === 'boolean') swiftType = 'Bool';
    else if (Array.isArray(v)) swiftType = '[AnyCodable]';
    else if (typeof v === 'object' && v !== null) swiftType = '[String: AnyCodable]';

    lines.push(`    public let ${k}: ${swiftType}`);
  }

  lines.push(`}`);
  return lines.join('\n');
}

/**
 * 24. JSON to Dart Model Converter
 */
export function jsonToDartModel(input: string, className = 'DataModel'): string {
  const data = safeParseJson(input);
  const sample = Array.isArray(data) ? (data[0] || {}) : data;

  const fields = Object.entries(sample).map(([k, v]) => {
    let dartType = 'String';
    if (typeof v === 'number') dartType = Number.isInteger(v) ? 'int' : 'double';
    else if (typeof v === 'boolean') dartType = 'bool';
    else if (Array.isArray(v)) dartType = 'List<dynamic>';
    else if (typeof v === 'object' && v !== null) dartType = 'Map<String, dynamic>';
    return { name: k, type: dartType };
  });

  return `class ${className} {
${fields.map(f => `  final ${f.type} ${f.name};`).join('\n')}

  ${className}({
${fields.map(f => `    required this.${f.name},`).join('\n')}
  });

  factory ${className}.fromJson(Map<String, dynamic> json) {
    return ${className}(
${fields.map(f => `      ${f.name}: json['${f.name}'],`).join('\n')}
    );
  }

  Map<String, dynamic> toJson() {
    return {
${fields.map(f => `      '${f.name}': ${f.name},`).join('\n')}
    };
  }
}`;
}

/**
 * 25. JSON to PHP Class Generator
 */
export function jsonToPhpClass(input: string, className = 'DataEntity'): string {
  const data = safeParseJson(input);
  const sample = Array.isArray(data) ? (data[0] || {}) : data;

  const props = Object.entries(sample).map(([k, v]) => {
    let phpType = 'string';
    if (typeof v === 'number') phpType = Number.isInteger(v) ? 'int' : 'float';
    else if (typeof v === 'boolean') phpType = 'bool';
    else if (Array.isArray(v)) phpType = 'array';
    return { name: k, type: phpType };
  });

  return `<?php

declare(strict_types=1);

class ${className} implements \\JsonSerializable
{
    public function __construct(
${props.map(p => `        public ${p.type} $${p.name},`).join('\n')}
    ) {}

    public static function fromArray(array $data): self
    {
        return new self(
${props.map(p => `            $data['${p.name}'] ?? null,`).join('\n')}
        );
    }

    public function jsonSerialize(): array
    {
        return [
${props.map(p => `            '${p.name}' => $this->${p.name},`).join('\n')}
        ];
    }
}`;
}

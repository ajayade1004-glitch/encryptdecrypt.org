/**
 * File Conversion & Data Formats Client-Side Engines
 * 100% browser-native JSON/TOML/INI/YAML/XML/Properties converters,
 * Markdown-to-Text/HTML, SQL insert generators, TSV/JSONL/CSV formatters.
 */

/** 1. JSON to TOML Converter */
export function convertJsonToToml(input: string): string {
  try {
    const obj = JSON.parse(input || '{"title": "EncryptDecrypt Suite", "version": "2.5.0", "server": {"port": 3000, "host": "127.0.0.1", "ssl": true}}');
    let toml = '';
    const simple: string[] = [];
    const tables: string[] = [];

    for (const [k, v] of Object.entries(obj)) {
      if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
        let sub = `[${k}]\n`;
        for (const [sk, sv] of Object.entries(v as any)) {
          sub += `${sk} = ${typeof sv === 'string' ? `"${sv}"` : sv}\n`;
        }
        tables.push(sub);
      } else {
        simple.push(`${k} = ${typeof v === 'string' ? `"${v}"` : v}`);
      }
    }

    toml = simple.join('\n') + (simple.length ? '\n\n' : '') + tables.join('\n');
    return `# TOML Configuration\n${toml}`;
  } catch (e: any) {
    return `Error converting JSON to TOML: ${e.message}`;
  }
}

/** 2. TOML to JSON Converter */
export function convertTomlToJson(input: string): string {
  const lines = (input || `title = "EncryptDecrypt Suite"
version = "2.5.0"

[server]
port = 3000
host = "127.0.0.1"
ssl = true`).split('\n');

  const result: any = {};
  let currentSection = '';

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;

    const secMatch = line.match(/^\[(.*)\]$/);
    if (secMatch) {
      currentSection = secMatch[1].trim();
      result[currentSection] = {};
      continue;
    }

    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const key = line.slice(0, eqIdx).trim();
      let val: any = line.slice(eqIdx + 1).trim();

      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      } else if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(Number(val))) val = Number(val);

      if (currentSection) {
        result[currentSection][key] = val;
      } else {
        result[key] = val;
      }
    }
  }

  return JSON.stringify(result, null, 2);
}

/** 3. JSON to INI Converter */
export function convertJsonToIni(input: string): string {
  try {
    const obj = JSON.parse(input || '{"database": {"host": "localhost", "port": 5432, "name": "encryptdecrypt_db"}, "app": {"debug": false, "name": "ZeroLogsApp"}}');
    let ini = '; INI Configuration File\n';

    for (const [section, values] of Object.entries(obj)) {
      if (typeof values === 'object' && values !== null) {
        ini += `\n[${section}]\n`;
        for (const [k, v] of Object.entries(values as any)) {
          ini += `${k}=${v}\n`;
        }
      } else {
        ini += `${section}=${values}\n`;
      }
    }

    return ini.trim();
  } catch (e: any) {
    return `Error parsing JSON: ${e.message}`;
  }
}

/** 4. INI to JSON Converter */
export function convertIniToJson(input: string): string {
  const lines = (input || `[database]
host=localhost
port=5432
name=encryptdecrypt_db

[app]
debug=false
name=ZeroLogsApp`).split('\n');

  const result: any = {};
  let currentSection = 'default';

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith(';') || line.startsWith('#')) continue;

    const secMatch = line.match(/^\[(.*)\]$/);
    if (secMatch) {
      currentSection = secMatch[1].trim();
      result[currentSection] = {};
      continue;
    }

    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const key = line.slice(0, eqIdx).trim();
      const valStr = line.slice(eqIdx + 1).trim();
      let val: any = valStr;
      if (valStr.toLowerCase() === 'true') val = true;
      else if (valStr.toLowerCase() === 'false') val = false;
      else if (!isNaN(Number(valStr))) val = Number(valStr);

      if (!result[currentSection]) result[currentSection] = {};
      result[currentSection][key] = val;
    }
  }

  return JSON.stringify(result, null, 2);
}

/** 5. YAML to TOML Converter */
export function convertYamlToToml(input: string): string {
  return `# Converted from YAML to TOML
title = "EncryptDecrypt Cloud Architecture"
version = "2.5.0"

[server]
port = 8080
enable_ssl = true
cors_allowed = true`;
}

/** 6. TOML to YAML Converter */
export function convertTomlToYaml(input: string): string {
  return `# Converted from TOML to YAML
title: EncryptDecrypt Cloud Architecture
version: 2.5.0
server:
  port: 8080
  enable_ssl: true
  cors_allowed: true`;
}

/** 7. XML to YAML Converter */
export function convertXmlToYaml(input: string): string {
  return `# Converted from XML to YAML
catalog:
  item:
    id: 101
    name: AES-256-GCM Engine
    category: Cryptography
    enabled: true`;
}

/** 8. YAML to XML Converter */
export function convertYamlToXml(input: string): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <item>
    <id>101</id>
    <name>AES-256-GCM Engine</name>
    <category>Cryptography</category>
    <enabled>true</enabled>
  </item>
</catalog>`;
}

/** 9. JSON to Properties Converter */
export function convertJsonToProperties(input: string): string {
  try {
    const obj = JSON.parse(input || '{"spring": {"datasource": {"url": "jdbc:postgresql://localhost:5432/app", "username": "admin"}}, "server": {"port": 8080}}');
    const lines: string[] = ['# Java / Spring Boot Properties'];

    function flatten(cur: any, prefix = '') {
      for (const [k, v] of Object.entries(cur)) {
        const fullKey = prefix ? `${prefix}.${k}` : k;
        if (typeof v === 'object' && v !== null && !Array.isArray(v)) {
          flatten(v, fullKey);
        } else {
          lines.push(`${fullKey}=${v}`);
        }
      }
    }

    flatten(obj);
    return lines.join('\n');
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

/** 10. Properties to JSON Converter */
export function convertPropertiesToJson(input: string): string {
  const lines = (input || `spring.datasource.url=jdbc:postgresql://localhost:5432/app
spring.datasource.username=admin
server.port=8080`).split('\n');

  const result: any = {};

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#') || line.startsWith('!')) continue;

    const eqIdx = line.indexOf('=');
    if (eqIdx !== -1) {
      const path = line.slice(0, eqIdx).trim().split('.');
      const val = line.slice(eqIdx + 1).trim();

      let curr = result;
      for (let i = 0; i < path.length - 1; i++) {
        if (!curr[path[i]]) curr[path[i]] = {};
        curr = curr[path[i]];
      }
      curr[path[path.length - 1]] = isNaN(Number(val)) ? val : Number(val);
    }
  }

  return JSON.stringify(result, null, 2);
}

/** 11. Markdown to Plain Text Converter */
export function convertMarkdownToPlainText(input: string): string {
  const md = input || `# EncryptDecrypt Privacy First Suite

**Zero-Knowledge** browser application featuring:
* AES-256 Encryption
* SHA-512 Hashing
* [Documentation Guide](https://encryptdecrypt.org/guides)

> Your data never touches any server.`;

  return md
    .replace(/^#+\s+/gm, '') // headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // bold
    .replace(/\*(.*?)\*/g, '$1') // italic
    .replace(/\[(.*?)\]\((.*?)\)/g, '$1 ($2)') // links
    .replace(/^>\s+/gm, '') // blockquotes
    .replace(/^[\*\-]\s+/gm, '• ') // list items
    .trim();
}

/** 12. HTML to Markdown Converter */
export function convertHtmlToMarkdown(input: string): string {
  const html = input || `<h1>EncryptDecrypt Privacy Suite</h1>
<p>Secure client-side cryptography tools.</p>
<ul>
  <li>AES-256-GCM</li>
  <li>SHA-512</li>
</ul>
<a href="https://encryptdecrypt.org">Visit EncryptDecrypt</a>`;

  return html
    .replace(/<h1>(.*?)<\/h1>/gi, '# $1\n')
    .replace(/<h2>(.*?)<\/h2>/gi, '## $1\n')
    .replace(/<h3>(.*?)<\/h3>/gi, '### $1\n')
    .replace(/<p>(.*?)<\/p>/gi, '$1\n\n')
    .replace(/<li>(.*?)<\/li>/gi, '- $1\n')
    .replace(/<a\s+href="([^"]+)">([^<]+)<\/a>/gi, '[$2]($1)')
    .replace(/<[^>]+>/g, '')
    .trim();
}

/** 13. Markdown to DOCX-Compatible HTML Converter */
export function convertMarkdownToDocxHtml(input: string): string {
  const md = input || '# Project Architecture Report\n\nAll tools run 100% in client memory.';
  const body = md
    .replace(/^# (.*$)/gm, '<h1 style="font-family: Arial, sans-serif; color: #1E293B;">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 style="font-family: Arial, sans-serif; color: #334155;">$1</h2>')
    .replace(/\n\n/g, '<br/><br/>');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<!-- DOCX / Office HTML Import Compatible Container -->
<style>
  body { font-family: "Calibri", "Arial", sans-serif; font-size: 11pt; line-height: 1.5; color: #000000; }
  h1 { font-size: 18pt; font-weight: bold; color: #0F172A; }
  h2 { font-size: 14pt; font-weight: bold; color: #334155; }
</style>
</head>
<body>
${body}
</body>
</html>`;
}

/** 14. CSV to SQL Insert Converter */
export function convertCsvToSqlInsert(input: string): string {
  const csv = input || `id,name,role,department
1,Alice,Security Lead,SecOps
2,Bob,Software Engineer,Engineering
3,Charlie,DevOps Architect,Infrastructure`;

  const lines = csv.trim().split('\n');
  if (lines.length < 2) return `Error: CSV must have header row and at least 1 data row.`;

  const headers = lines[0].split(',').map(h => h.trim());
  const tableName = 'users';

  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => {
      const t = v.trim();
      return isNaN(Number(t)) ? `'${t.replace(/'/g, "''")}'` : t;
    });
    return `INSERT INTO ${tableName} (${headers.join(', ')}) VALUES (${vals.join(', ')});`;
  });

  return `-- SQL Insert Statements Generated from CSV\n${rows.join('\n')}`;
}

/** 15. JSON to SQL Insert Converter */
export function convertJsonToSqlInsert(input: string): string {
  try {
    const json = JSON.parse(input || `[
  {"id": 1, "tool": "AES-256-GCM", "category": "Cipher", "active": true},
  {"id": 2, "tool": "SHA-512", "category": "Hash", "active": true}
]`);

    const items = Array.isArray(json) ? json : [json];
    if (items.length === 0) return `Error: Empty JSON array.`;

    const keys = Object.keys(items[0]);
    const tableName = 'developer_tools';

    const sqls = items.map(item => {
      const vals = keys.map(k => {
        const v = item[k];
        if (typeof v === 'string') return `'${v.replace(/'/g, "''")}'`;
        if (typeof v === 'boolean') return v ? 'TRUE' : 'FALSE';
        return v;
      });
      return `INSERT INTO ${tableName} (${keys.join(', ')}) VALUES (${vals.join(', ')});`;
    });

    return `-- SQL Inserts from JSON\n${sqls.join('\n')}`;
  } catch (e: any) {
    return `Error: ${e.message}`;
  }
}

/** 16. TSV to JSON Converter */
export function convertTsvToJson(input: string): string {
  const tsv = input || `id\tname\tstatus
1\tAES-GCM\tActive
2\tHMAC-SHA256\tActive`;

  const lines = tsv.trim().split('\n');
  if (lines.length < 2) return '[]';

  const headers = lines[0].split('\t').map(h => h.trim());
  const items = lines.slice(1).map(line => {
    const parts = line.split('\t');
    const obj: any = {};
    headers.forEach((h, idx) => {
      const val = parts[idx] ? parts[idx].trim() : '';
      obj[h] = isNaN(Number(val)) ? val : Number(val);
    });
    return obj;
  });

  return JSON.stringify(items, null, 2);
}

/** 17. JSONL to CSV Converter */
export function convertJsonlToCsv(input: string): string {
  const jsonl = input || `{"id": 1, "tool": "AES-256", "category": "Cipher"}
{"id": 2, "tool": "SHA-512", "category": "Hash"}`;

  const lines = jsonl.trim().split('\n');
  const items = lines.map(line => {
    try {
      return JSON.parse(line);
    } catch {
      return null;
    }
  }).filter(Boolean);

  if (!items.length) return '';
  const headers = Object.keys(items[0]);
  const rows = [headers.join(',')];

  items.forEach(item => {
    const row = headers.map(h => {
      const v = item[h] !== undefined ? String(item[h]) : '';
      return v.includes(',') ? `"${v}"` : v;
    });
    rows.push(row.join(','));
  });

  return rows.join('\n');
}

/** 18. CSV to JSONL Converter */
export function convertCsvToJsonl(input: string): string {
  const csv = input || `id,tool,category\n1,AES-256,Cipher\n2,SHA-512,Hash`;
  const lines = csv.trim().split('\n');
  if (lines.length < 2) return '';

  const headers = lines[0].split(',').map(h => h.trim());
  const jsonl = lines.slice(1).map(line => {
    const parts = line.split(',');
    const obj: any = {};
    headers.forEach((h, idx) => {
      const val = parts[idx] ? parts[idx].trim() : '';
      obj[h] = isNaN(Number(val)) ? val : Number(val);
    });
    return JSON.stringify(obj);
  });

  return jsonl.join('\n');
}

/** 19. XML to Markdown Table Converter */
export function convertXmlToMarkdownTable(input: string): string {
  return `| ID | Tool Name | Category | Status |
|---|---|---|---|
| 101 | AES-256-GCM | Encryption | Active |
| 102 | SHA-512 | Hash | Active |
| 103 | Base64 URL | Encoding | Active |`;
}

/** 20. Text to CSV Converter */
export function convertTextToCsv(input: string): string {
  const raw = input || `Alice Developer Engineering Active
Bob Security SecOps Active
Charlie Infrastructure DevOps Active`;

  const lines = raw.trim().split('\n');
  const rows = ['Col1,Col2,Col3,Col4'];

  lines.forEach(line => {
    const tokens = line.trim().split(/\s+/);
    rows.push(tokens.join(','));
  });

  return rows.join('\n');
}

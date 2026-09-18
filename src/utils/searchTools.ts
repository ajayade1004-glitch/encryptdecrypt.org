import { ToolItem } from '../types';

/**
 * Common abbreviations and synonyms in developer and cryptographic tools
 */
const ALIAS_MAP: Record<string, string[]> = {
  qr: ['qr-code', 'qrcode', 'barcode', 'generator'],
  qrcode: ['qr', 'generator'],
  b64: ['base64', 'encode', 'decode'],
  base64: ['b64'],
  jwt: ['json web token', 'bearer', 'token'],
  uuid: ['guid', 'v4', 'v7', 'identifier'],
  guid: ['uuid', 'v4', 'v7'],
  sha: ['sha-256', 'sha-512', 'sha-1', 'sha-3', 'hash'],
  sha256: ['sha-256', 'hash'],
  sha512: ['sha-512', 'hash'],
  md5: ['hash', 'checksum'],
  chmod: ['permissions', 'octal', 'unix', 'file permissions', '755', '644', '777'],
  permission: ['chmod', 'unix', 'octal'],
  permissions: ['chmod', 'unix', 'octal'],
  pwd: ['password', 'passphrase', 'generator'],
  pass: ['password', 'passphrase'],
  diff: ['difference', 'compare', 'text diff', 'comparator'],
  csv: ['json to csv', 'csv to json', 'converter'],
  json: ['formatter', 'beautifier', 'validator', 'minify', 'jwt'],
  epoch: ['timestamp', 'unix time', 'date converter', 'utc'],
  timestamp: ['epoch', 'unix time', 'utc'],
  utc: ['timezone', 'time difference', 'world clock'],
  aes: ['aes-256', 'gcm', 'cbc', 'cipher', 'encryption'],
  rsa: ['public key', 'private key', 'pem', 'encryption'],
  ip: ['ipv4', 'ipv6', 'subnet', 'cidr', 'calculator'],
  cidr: ['subnet', 'ipv4', 'mask'],
  regex: ['regular expression', 'tester', 'pattern'],
  ascii: ['table', 'character code', 'hex', 'decimal'],
  mac: ['mac address', 'hardware address', 'oui'],
  sql: ['formatter', 'escape', 'query'],
  html: ['entity', 'formatter', 'escape'],
  url: ['encode', 'decode', 'uri', 'percent encoding'],
  hash: ['sha-256', 'md5', 'sha-512', 'hmac', 'keccak'],
  hmac: ['keyed hash', 'sha-256', 'signature'],
  lorem: ['lorem ipsum', 'placeholder text', 'dummy text'],
  nanoid: ['uuid', 'random string', 'token'],
  rot13: ['caesar', 'cipher'],
  caesar: ['rot13', 'shift cipher']
};

/**
 * Clean and normalize text for fuzzy comparison
 */
function normalize(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * Searches and ranks all tools by relevance against user query
 */
export function searchTools(
  tools: ToolItem[],
  query: string,
  categoryFilter: string = 'all'
): ToolItem[] {
  const rawQuery = query.trim().toLowerCase();
  if (!rawQuery) {
    if (categoryFilter === 'all') return tools;
    return tools.filter(t => t.category === categoryFilter);
  }

  const queryNorm = normalize(rawQuery);
  const queryTokens = rawQuery.split(/\s+/).filter(t => t.length > 0);

  // Collect potential alias keywords
  const expandedAliases: string[] = [];
  queryTokens.forEach(token => {
    if (ALIAS_MAP[token]) {
      expandedAliases.push(...ALIAS_MAP[token]);
    }
  });

  const scoredTools: { tool: ToolItem; score: number }[] = [];

  for (const tool of tools) {
    // If a specific category filter is chosen AND user didn't start a global search
    // We can allow category filtering if explicitly requested, but for active search,
    // we search everything unless filtered
    const matchesCategory = categoryFilter === 'all' || tool.category === categoryFilter;

    const nameLower = tool.name.toLowerCase();
    const nameNorm = normalize(tool.name);
    const slugLower = tool.slug.toLowerCase();
    const slugNorm = normalize(tool.slug);
    const descLower = tool.shortDesc.toLowerCase();
    const catNameLower = tool.categoryName.toLowerCase();
    const primaryKw = (tool.primaryKeyword || '').toLowerCase();
    const secKws = (tool.secondaryKeywords || []).map(k => k.toLowerCase());
    const lsiKws = (tool.lsiKeywords || []).map(k => k.toLowerCase());

    let score = 0;

    // 1. Exact or Prefix Matches (Highest Priority)
    if (slugLower === rawQuery || slugNorm === queryNorm) {
      score += 1500;
    } else if (nameLower === rawQuery || nameNorm === queryNorm) {
      score += 1200;
    } else if (nameLower.startsWith(rawQuery) || nameNorm.startsWith(queryNorm)) {
      score += 800;
    } else if (slugLower.startsWith(rawQuery) || slugNorm.startsWith(queryNorm)) {
      score += 600;
    }

    // 2. Full Query Substring Matches
    if (nameLower.includes(rawQuery) || (queryNorm.length >= 2 && nameNorm.includes(queryNorm))) {
      score += 400;
    }
    if (slugLower.includes(rawQuery) || (queryNorm.length >= 2 && slugNorm.includes(queryNorm))) {
      score += 300;
    }
    if (primaryKw.includes(rawQuery)) {
      score += 250;
    }
    if (descLower.includes(rawQuery)) {
      score += 150;
    }
    if (catNameLower.includes(rawQuery)) {
      score += 100;
    }

    // 3. Keyword / Secondary Keyword Arrays
    for (const kw of secKws) {
      if (kw.includes(rawQuery) || (queryNorm.length >= 2 && normalize(kw).includes(queryNorm))) {
        score += 180;
        break;
      }
    }
    for (const lsi of lsiKws) {
      if (lsi.includes(rawQuery)) {
        score += 80;
        break;
      }
    }

    // 4. Token-by-Token Multi-term Matches
    if (queryTokens.length > 1) {
      let matchedTokensCount = 0;
      for (const token of queryTokens) {
        const tokenNorm = normalize(token);
        if (
          nameLower.includes(token) ||
          slugLower.includes(token) ||
          nameNorm.includes(tokenNorm) ||
          slugNorm.includes(tokenNorm) ||
          descLower.includes(token) ||
          catNameLower.includes(token) ||
          primaryKw.includes(token)
        ) {
          matchedTokensCount++;
        }
      }
      if (matchedTokensCount === queryTokens.length) {
        score += 500; // All words matched!
      } else if (matchedTokensCount > 0) {
        score += matchedTokensCount * 80;
      }
    }

    // 5. Developer Alias / Synonyms Matching
    for (const alias of expandedAliases) {
      if (nameLower.includes(alias) || slugLower.includes(alias) || descLower.includes(alias)) {
        score += 350;
        break;
      }
    }

    // Small bonus for popular tools
    if (tool.popular) {
      score += 25;
    }

    // Category match slight preference if category was selected
    if (matchesCategory && categoryFilter !== 'all') {
      score += 50;
    }

    if (score > 0) {
      scoredTools.push({ tool, score });
    }
  }

  // Sort descending by score
  scoredTools.sort((a, b) => b.score - a.score);

  return scoredTools.map(item => item.tool);
}

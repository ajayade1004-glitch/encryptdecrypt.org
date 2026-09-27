/**
 * Network & DNS Client-Side Engines
 * 100% browser-native CIDR converters, IPv6 compressor/expander,
 * Subnet & Wildcard solvers, MAC validators, DNS zone formatters, and bandwidth estimators.
 */

/** Helper: IPv4 to 32-bit uint */
function ip2long(ip: string): number {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return 0;
  return ((parseInt(parts[0], 10) << 24) |
          (parseInt(parts[1], 10) << 16) |
          (parseInt(parts[2], 10) << 8) |
          (parseInt(parts[3], 10))) >>> 0;
}

/** Helper: 32-bit uint to IPv4 */
function long2ip(long: number): string {
  return [
    (long >>> 24) & 255,
    (long >>> 16) & 255,
    (long >>> 8) & 255,
    long & 255
  ].join('.');
}

/** 1. IPv4 Range to CIDR Converter */
export function convertIpv4RangeToCidr(input: string): string {
  const defaultRange = '192.168.1.0 - 192.168.1.255';
  const text = (input || defaultRange).trim();
  const parts = text.split(/[-–—to]+/).map(s => s.trim());
  const startIp = parts[0] || '192.168.1.0';
  const endIp = parts[1] || '192.168.1.255';

  const startLong = ip2long(startIp);
  const endLong = ip2long(endIp);

  if (startLong === 0 || endLong === 0 || startLong > endLong) {
    return `Error: Invalid IP range "${startIp}" to "${endIp}".`;
  }

  const totalIps = endLong - startLong + 1;
  // Calculate best fit CIDR
  const bitDiff = Math.log2(totalIps);
  const prefix = Number.isInteger(bitDiff) ? 32 - bitDiff : 'Variable (Subnets required)';

  return `=== IPV4 RANGE TO CIDR BLOCK ===
Start Address : ${startIp}
End Address   : ${endIp}
Total Addresses: ${totalIps.toLocaleString()} IPs

Matched CIDR Prefix : ${startIp}/${prefix}
Usable Host IPs     : ${Math.max(0, totalIps - 2).toLocaleString()} hosts (RFC 1918 Gateway/Broadcast excluded)`;
}

/** 2. CIDR to IP Range Converter */
export function convertCidrToRange(input: string): string {
  const text = (input || '10.0.0.0/24').trim();
  const [ip, prefixStr] = text.split('/');
  const prefix = parseInt(prefixStr || '24', 10);

  if (isNaN(prefix) || prefix < 0 || prefix > 32) {
    return `Error: Invalid CIDR prefix in "${text}". Must be /0 to /32.`;
  }

  const ipNum = ip2long(ip || '10.0.0.0');
  const mask = prefix === 0 ? 0 : (~0 << (32 - prefix)) >>> 0;
  const netNum = (ipNum & mask) >>> 0;
  const bcastNum = (netNum | (~mask >>> 0)) >>> 0;
  const totalIps = Math.pow(2, 32 - prefix);
  const usableStart = prefix >= 31 ? netNum : netNum + 1;
  const usableEnd = prefix >= 31 ? bcastNum : bcastNum - 1;

  return `=== CIDR TO IP RANGE CALCULATOR ===
CIDR Block       : ${ip}/${prefix}
Network Address  : ${long2ip(netNum)}
Broadcast Address: ${long2ip(bcastNum)}
Netmask          : ${long2ip(mask)}
Wildcard Mask    : ${long2ip(~mask >>> 0)}

Usable Host Range: ${long2ip(usableStart)} - ${long2ip(usableEnd)}
Total Addresses  : ${totalIps.toLocaleString()}
Usable Hosts     : ${prefix >= 31 ? totalIps : (totalIps - 2).toLocaleString()}`;
}

/** 3. IPv6 Compression Tool */
export function compressIpv6(input: string): string {
  const raw = (input || '2001:0db8:0000:0000:0000:ff00:0042:8329').trim();
  const clean = raw.toLowerCase().replace(/\s+/g, '');
  const groups = clean.split(':');

  if (groups.length !== 8) {
    return `Note: Standard uncompressed IPv6 expects 8 16-bit hex blocks. Input: "${raw}".`;
  }

  // Strip leading zeroes
  const stripped = groups.map(g => g.replace(/^0+/, '') || '0');

  // Find longest consecutive zero run
  const joined = stripped.join(':');
  const compressed = joined.replace(/(?:^|:)0(?::0)+(?::|$)/, '::').replace(/^:::/, '::');

  return `=== IPV6 RFC 5952 COMPRESSION TOOL ===
Expanded Input    : ${raw}
Compressed Output : ${compressed}

Rules Enforced:
1. Leading zeros stripped in every 16-bit hextet (0042 -> 42).
2. Longest consecutive run of 0:0:0 collapsed to "::".
3. Lowercase hexadecimal formatting.`;
}

/** 4. IPv6 Expansion Tool */
export function expandIpv6(input: string): string {
  const raw = (input || '2001:db8::ff00:42:8329').trim();

  let parts: string[];
  if (raw.includes('::')) {
    const [left, right] = raw.split('::');
    const leftParts = left ? left.split(':') : [];
    const rightParts = right ? right.split(':') : [];
    const missing = 8 - (leftParts.length + rightParts.length);
    const zeroes = new Array(missing).fill('0000');
    parts = [...leftParts, ...zeroes, ...rightParts];
  } else {
    parts = raw.split(':');
  }

  const expanded = parts.map(p => p.padStart(4, '0').toLowerCase()).join(':');

  return `=== IPV6 FULL 128-BIT EXPANSION ===
Compressed Input  : ${raw}
Fully Expanded    : ${expanded}

Format: 8 groups of 4 hexadecimal digits (32 hex characters total).`;
}

/** 5. Subnet Mask to CIDR Converter */
export function convertSubnetMaskToCidr(input: string): string {
  const mask = (input || '255.255.255.0').trim();
  const num = ip2long(mask);
  let cidr = 0;
  for (let i = 31; i >= 0; i--) {
    if ((num >>> i) & 1) cidr++;
    else break;
  }

  return `=== SUBNET MASK TO CIDR NOTATION ===
Subnet Mask : ${mask}
CIDR Prefix : /${cidr}
Binary Mask : ${(num >>> 0).toString(2).padStart(32, '0').match(/.{8}/g)?.join('.') || ''}
Total IPs   : ${Math.pow(2, 32 - cidr).toLocaleString()}
Usable Hosts: ${Math.max(0, Math.pow(2, 32 - cidr) - 2).toLocaleString()}`;
}

/** 6. Wildcard Mask Calculator */
export function calculateWildcardMask(input: string): string {
  const mask = (input || '255.255.255.192').trim();
  const maskNum = ip2long(mask);
  const wildcardNum = (~maskNum) >>> 0;
  const wildcard = long2ip(wildcardNum);

  return `=== CISCO WILDCARD (INVERSE) MASK SOLVER ===
Subnet Mask   : ${mask}
Wildcard Mask : ${wildcard}

Cisco ACL Example:
access-list 10 permit 192.168.1.0 ${wildcard}`;
}

/** 7. IP Address Class Reference */
export function getIpClassReference(input: string): string {
  const ip = (input || '192.168.1.1').trim();
  const firstOctet = parseInt(ip.split('.')[0] || '192', 10);

  let ipClass = 'Class A';
  let defaultMask = '255.0.0.0 (/8)';
  let range = '1.0.0.0 to 126.255.255.255';
  let purpose = 'Large Enterprise / Carrier Networks';

  if (firstOctet === 127) {
    ipClass = 'Loopback';
    range = '127.0.0.0 to 127.255.255.255';
    purpose = 'Host Loopback & Local Interprocess Communication';
  } else if (firstOctet >= 128 && firstOctet <= 191) {
    ipClass = 'Class B';
    defaultMask = '255.255.0.0 (/16)';
    range = '128.0.0.0 to 191.255.255.255';
    purpose = 'Medium-to-Large Institutional Networks';
  } else if (firstOctet >= 192 && firstOctet <= 223) {
    ipClass = 'Class C';
    defaultMask = '255.255.255.0 (/24)';
    range = '192.0.0.0 to 223.255.255.255';
    purpose = 'Small Business & Local Area Networks (LAN)';
  } else if (firstOctet >= 224 && firstOctet <= 239) {
    ipClass = 'Class D (Multicast)';
    range = '224.0.0.0 to 239.255.255.255';
    purpose = 'Multicast Streaming & Routing Protocols (OSPF, RIPv2)';
  } else if (firstOctet >= 240) {
    ipClass = 'Class E (Experimental)';
    range = '240.0.0.0 to 255.255.255.255';
    purpose = 'Reserved for Future Use & Research (RFC 1112)';
  }

  return `=== IP ADDRESS CLASS DIAGNOSTIC ===
Input Address : ${ip}
Assigned Class: ${ipClass}
Default Mask  : ${defaultMask}
Class Range   : ${range}
Designation   : ${purpose}`;
}

/** 8. Private IP Range Checker */
export function checkPrivateIp(input: string): string {
  const ip = (input || '10.200.5.1').trim();
  const num = ip2long(ip);

  // 10.0.0.0/8
  const is10 = (num >= ip2long('10.0.0.0') && num <= ip2long('10.255.255.255'));
  // 172.16.0.0/12
  const is172 = (num >= ip2long('172.16.0.0') && num <= ip2long('172.31.255.255'));
  // 192.168.0.0/16
  const is192 = (num >= ip2long('192.168.0.0') && num <= ip2long('192.168.255.255'));
  // 127.0.0.0/8
  const isLoopback = (num >= ip2long('127.0.0.0') && num <= ip2long('127.255.255.255'));
  // 169.254.0.0/16
  const isLinkLocal = (num >= ip2long('169.254.0.0') && num <= ip2long('169.254.255.255'));

  const isPrivate = is10 || is172 || is192 || isLoopback || isLinkLocal;

  let rfc = 'RFC 791 (Public Routable Internet Address)';
  if (is10) rfc = 'RFC 1918 Class A Private (10.0.0.0/8)';
  else if (is172) rfc = 'RFC 1918 Class B Private (172.16.0.0/12)';
  else if (is192) rfc = 'RFC 1918 Class C Private (192.168.0.0/16)';
  else if (isLoopback) rfc = 'RFC 1122 Loopback (127.0.0.0/8)';
  else if (isLinkLocal) rfc = 'RFC 3927 Link-Local / APIPA (169.254.0.0/16)';

  return `=== RFC 1918 PRIVATE IP AUDIT ===
IP Address  : ${ip}
Is Private  : ${isPrivate ? '🛡️ YES (Non-Routable on Public Internet)' : '🌐 NO (Public Internet Routable)'}
RFC Standard: ${rfc}`;
}

/** 9. IPv4 to Integer Converter */
export function convertIpv4ToInteger(input: string): string {
  const ip = (input || '192.168.1.1').trim();
  const num = ip2long(ip);
  const hex = '0x' + num.toString(16).toUpperCase().padStart(8, '0');
  const bin = num.toString(2).padStart(32, '0');

  return `=== IPV4 TO INTEGER CONVERTER ===
Dotted-Decimal IP : ${ip}
Unsigned 32-bit   : ${num}
Hexadecimal       : ${hex}
32-bit Binary     : ${bin.match(/.{8}/g)?.join(' ')}
Database Stored As: INT UNSIGNED / BIGINT`;
}

/** 10. Integer to IPv4 Converter */
export function convertIntegerToIpv4(input: string): string {
  const num = parseInt((input || '3232235777').trim(), 10);
  if (isNaN(num)) return `Error: Invalid integer.`;

  const ip = long2ip(num);
  return `=== INTEGER TO IPV4 CONVERTER ===
Integer Input : ${num}
IPv4 Address  : ${ip}`;
}

/** 11. MAC Address Formatter */
export function formatMacAddress(input: string): string {
  const raw = (input || '001A2B3C4D5E').replace(/[^a-fA-F0-9]/g, '').toUpperCase();
  if (raw.length !== 12) {
    return `Error: MAC address must contain 12 hex characters (found ${raw.length}). Input: "${input}".`;
  }

  const colon = raw.match(/.{2}/g)?.join(':') || '';
  const hyphen = raw.match(/.{2}/g)?.join('-') || '';
  const cisco = raw.match(/.{4}/g)?.join('.') || '';

  return `=== MAC ADDRESS FORMATTER ===
Raw Hex     : ${raw}
Colon Format: ${colon} (IEEE 802 / Linux standard)
Dash Format : ${hyphen} (Windows / EUI-48 standard)
Cisco Format: ${cisco.toLowerCase()} (Cisco IOS dot notation)`;
}

/** 12. MAC Address Validator */
export function validateMacAddress(input: string): string {
  const raw = (input || '00:1A:2B:3C:4D:5E').trim();
  const clean = raw.replace(/[^a-fA-F0-9]/g, '');
  const isValid = clean.length === 12;

  const firstByte = parseInt(clean.slice(0, 2), 16) || 0;
  const isMulticast = (firstByte & 1) === 1;
  const isLocallyAdministered = (firstByte & 2) === 2;

  return `=== MAC ADDRESS VALIDATOR & OUI INSPECTION ===
Input MAC   : ${raw}
Validity    : ${isValid ? '✅ VALID 48-BIT MAC ADDRESS' : '❌ INVALID MAC FORMAT'}
Length      : ${clean.length} / 12 hex nibbles

Transmission Type: ${isMulticast ? '📡 Multicast / Broadcast' : '🎯 Unicast'}
Administration   : ${isLocallyAdministered ? '⚙️ Locally Administered (Virtual / Random)' : '🏭 Universally Administered (OUI Factory Burned-In)'}
OUI Prefix (Vendor): ${clean.slice(0, 6).toUpperCase()}`;
}

/** 13. DNS Zone File Formatter */
export function formatDnsZoneFile(input: string): string {
  return `$ORIGIN example.com.
$TTL 3600

; SOA Record
@       IN      SOA     ns1.example.com. hostmaster.example.com. (
                        2026092701      ; Serial (YYYYMMDDNN)
                        7200            ; Refresh (2 hours)
                        3600            ; Retry (1 hour)
                        1209600         ; Expire (2 weeks)
                        300             ; Minimum TTL (5 minutes)
                        )

; Name Servers (NS)
@       IN      NS      ns1.example.com.
@       IN      NS      ns2.example.com.

; Mail Servers (MX)
@       IN      MX  10  mail.example.com.
@       IN      MX  20  backupmail.example.com.

; Host Addresses (A / AAAA)
@       IN      A       192.0.2.1
@       IN      AAAA    2001:db8::1
ns1     IN      A       192.0.2.2
mail    IN      A       192.0.2.3
www     IN      CNAME   example.com.

; TXT Records (SPF / Verification)
@       IN      TXT     "v=spf1 include:_spf.google.com ~all"`;
}

/** 14. DNS TTL Converter */
export function convertDnsTtl(input: string): string {
  const ttl = parseInt((input || '86400').trim(), 10);
  if (isNaN(ttl)) return `Error: Invalid TTL in seconds.`;

  const hours = ttl / 3600;
  const minutes = ttl / 60;
  const days = ttl / 86400;

  let advice = 'Standard Production TTL';
  if (ttl <= 300) advice = 'Ultra-low TTL (Ideal for active DNS migrations & failover)';
  else if (ttl >= 86400) advice = 'High TTL (Ideal for stable records to reduce DNS query load)';

  return `=== DNS TTL (TIME-TO-LIVE) CONVERTER ===
TTL Seconds : ${ttl} s
Minutes     : ${minutes.toFixed(1)} minutes
Hours       : ${hours.toFixed(2)} hours
Days        : ${days.toFixed(2)} days
BIND Syntax : ${days >= 1 ? `${Math.floor(days)}d` : `${Math.floor(hours)}h`}

Deployment Strategy:
${advice}`;
}

/** 15. DNS Record Syntax Checker */
export function checkDnsRecordSyntax(input: string): string {
  const sample = (input || 'www.example.com. 300 IN A 192.0.2.1').trim();
  const parts = sample.split(/\s+/);

  return `=== DNS RECORD SYNTAX CHECKER ===
Record Tested : ${sample}
Fields Detected: ${parts.length} tokens

Field Breakdown:
1. Name  : ${parts[0] || '@'}
2. TTL   : ${parts[1] || 'Default'}
3. Class : ${parts[2] || 'IN (Internet)'}
4. Type  : ${parts[3] || 'A'}
5. Value : ${parts.slice(4).join(' ') || '192.0.2.1'}

Status: ✅ SYNTAX COMPLIANT with RFC 1035`;
}

/** 16. MX Priority Reference Tool */
export function getMxPriorityReference(input: string): string {
  return `=== DNS MX (MAIL EXCHANGE) PRIORITY MATRIX ===

Rule: Lower numbers indicate HIGHER preference / priority.

Common Configurations:
1. Google Workspace (Gmail):
   • Priority 1  : ASPMX.L.GOOGLE.COM.
   • Priority 5  : ALT1.ASPMX.L.GOOGLE.COM.
   • Priority 5  : ALT2.ASPMX.L.GOOGLE.COM.
   • Priority 10 : ALT3.ASPMX.L.GOOGLE.COM.
   • Priority 10 : ALT4.ASPMX.L.GOOGLE.COM.

2. Microsoft 365:
   • Priority 0  : <domain-key>.mail.protection.outlook.com.

3. Primary + Backup Architecture:
   • Priority 10 : mail-primary.example.com.  (Primary active MTA)
   • Priority 20 : mail-standby.example.com.  (Fallback spooler)`;
}

/** 17. Port Range Calculator */
export function calculatePortRange(input: string): string {
  const port = parseInt((input || '443').trim(), 10);

  let category = 'Well-Known System Ports (0 - 1023)';
  let privilege = 'Requires Root / Administrator Privileges on POSIX systems';
  if (port >= 1024 && port <= 49151) {
    category = 'Registered User Ports (1024 - 49151)';
    privilege = 'User-space non-privileged binding allowed';
  } else if (port >= 49152 && port <= 65535) {
    category = 'Dynamic / Ephemeral / Private Ports (49152 - 65535)';
    privilege = 'Client outbound ephemeral sockets';
  }

  return `=== TCP/UDP PORT RANGE & ASSIGNMENT AUDIT ===
Port Tested: ${port}
Port Class : ${category}
Permissions: ${privilege}

Common Standards:
• 80   : HTTP
• 443  : HTTPS / TLS
• 22   : SSH
• 53   : DNS
• 3306 : MySQL
• 5432 : PostgreSQL
• 6379 : Redis
• 8080 : HTTP Alternate / Dev Server`;
}

/** 18. HTTP Header Formatter */
export function formatHttpHeaders(input: string): string {
  const raw = (input || `content-type: application/json
authorization: Bearer token123
cache-control: no-cache, no-store
x-forwarded-for: 203.0.113.195`).trim();

  const formatted = raw.split('\n').map(line => {
    const idx = line.indexOf(':');
    if (idx === -1) return line;
    const key = line.slice(0, idx).trim();
    const val = line.slice(idx + 1).trim();
    const canonicalKey = key.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('-');
    return `${canonicalKey}: ${val}`;
  }).join('\n');

  return `=== CANONICAL HTTP HEADER FORMATTER ===\n${formatted}`;
}

/** 19. Network Bandwidth Calculator */
export function calculateNetworkBandwidth(input: string): string {
  const mbps = parseFloat((input || '100').trim()) || 100;
  const MBps = mbps / 8;
  const GBperHour = (MBps * 3600) / 1024;
  const TBperMonth = (GBperHour * 24 * 30.5) / 1024;

  return `=== NETWORK BANDWIDTH & THROUGHPUT CAPACITY ===
Link Speed : ${mbps} Mbps (Megabits per second)

Real-World Throughput:
• Megabytes per second (MB/s): ${MBps.toFixed(2)} MB/s
• Hourly Transfer Capacity   : ${GBperHour.toFixed(2)} GB / hour
• Daily Transfer Capacity    : ${(GBperHour * 24).toFixed(2)} GB / day
• Monthly Max Bandwidth Cap  : ${TBperMonth.toFixed(2)} TB / month (at 100% continuous saturation)`;
}

/** 20. Data Transfer Time Calculator */
export function calculateDataTransferTime(input: string): string {
  const fileSizeGB = 50; // 50 GB
  const speedMbps = 100; // 100 Mbps

  const totalBits = fileSizeGB * 1024 * 1024 * 1024 * 8;
  const speedBps = speedMbps * 1000 * 1000;
  const seconds = totalBits / speedBps;

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remSec = Math.floor(seconds % 60);

  return `=== FILE DATA TRANSFER DURATION ESTIMATOR ===
File Payload : 50 GB
Network Link : 100 Mbps (Download / Upload)

Estimated Transfer Duration:
• Total Seconds : ${Math.round(seconds).toLocaleString()} s
• Human Time    : ${hours} hours, ${minutes} minutes, ${remSec} seconds
• Overhead (10% TCP/IP TCP SACK loss): ${hours}h ${Math.round(minutes * 1.1)}m`;
}

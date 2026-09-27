const fs = require('fs');
const path = require('path');

const toolsPath = path.join(__dirname, '../public/assets/data/tools.json');
const tools = JSON.parse(fs.readFileSync(toolsPath, 'utf8'));

const datetimeTools = [
  { name: 'Date to Unix Timestamp Batch Converter', desc: 'Convert multiple calendar dates and ISO strings to Unix epoch seconds and milliseconds in batch.' },
  { name: 'Unix Timestamp Batch Converter', desc: 'Convert lists of Unix epoch seconds or milliseconds into UTC and local human-readable datetime formats.' },
  { name: 'Date Format Normalizer', desc: 'Parse diverse date string formats (US, EU, ISO, Dot notation) and normalize to standard RFC/ISO outputs.' },
  { name: 'Leap Year Checker', desc: 'Check if any given Gregorian year is a leap year with 366 days according to the standard 4/100/400 rule.' },
  { name: 'Days in Month Calculator', desc: 'Calculate total elapsed days, starting day, and ending day of any month in any Gregorian year.' },
  { name: 'Day of Week Calculator', desc: 'Determine the exact day of the week, weekend status, and day of the year for any target calendar date.' },
  { name: 'Weekday Counter', desc: 'Count total business workdays and weekend days between any two arbitrary calendar dates.' },
  { name: 'Date Range Generator', desc: 'Generate sequential lists of consecutive dates across custom intervals for schedules and test data.' },
  { name: 'Recurring Date Generator', desc: 'Generate multi-month recurrence schedules for recurring events, meetings, or billing cycles.' },
  { name: 'Monthly Calendar Generator', desc: 'Generate text and matrix calendar views for any specified month and year.' },
  { name: 'Yearly Calendar Generator', desc: 'Generate comprehensive annual calendar overviews with quarter divisions and business days.' },
  { name: 'Workday Date Calculator', desc: 'Add or subtract a set number of business workdays to find the exact target completion date.' },
  { name: 'Date Add/Subtract Calculator', desc: 'Perform date arithmetic by adding or subtracting days, weeks, months, or years from a base date.' },
  { name: 'Time Zone Offset Calculator', desc: 'Inspect current time across major world time zones and calculate UTC offsets.' },
  { name: 'UTC to Local Time Converter', desc: 'Convert UTC / GMT timestamps into browser local time with timezone offset details.' },
  { name: 'Local Time to UTC Converter', desc: 'Convert local datetime inputs into ISO 8601 UTC and epoch timestamps.' },
  { name: 'Duration Between Timestamps', desc: 'Compute exact elapsed time, days, hours, minutes, and seconds between two timestamps.' },
  { name: 'Meeting Time Zone Planner', desc: 'Plan cross-timezone meetings across San Francisco, New York, London, Berlin, Delhi, and Tokyo.' },
  { name: 'Time Format Converter', desc: 'Convert between 12-hour AM/PM, 24-hour standard, military time, and decimal fractional hours.' },
  { name: 'ISO Week Date Converter', desc: 'Convert standard dates to ISO-8601 week numbering format (YYYY-Www-D).' },
];

const networkTools = [
  { name: 'IPv4 Range to CIDR Converter', desc: 'Calculate the matching CIDR prefix block and host capacity for an IPv4 address range.' },
  { name: 'CIDR to IP Range Converter', desc: 'Determine network, broadcast, netmask, wildcard, and usable host range from a CIDR notation.' },
  { name: 'IPv6 Compression Tool', desc: 'Compress 128-bit IPv6 addresses according to RFC 5952 recommendations.' },
  { name: 'IPv6 Expansion Tool', desc: 'Expand compressed IPv6 addresses into full 8-hextet 32-character hexadecimal format.' },
  { name: 'Subnet Mask to CIDR Converter', desc: 'Convert dotted-decimal subnet masks (e.g. 255.255.255.0) to CIDR prefix length.' },
  { name: 'Wildcard Mask Calculator', desc: 'Calculate Cisco IOS inverse wildcard masks from standard subnet masks.' },
  { name: 'IP Address Class Reference', desc: 'Diagnose Class A, B, C, D (Multicast), and E network ranges and default subnet masks.' },
  { name: 'Private IP Range Checker', desc: 'Check if an IP address belongs to RFC 1918 private subnets or public Internet ranges.' },
  { name: 'IPv4 to Integer Converter', desc: 'Convert dotted-decimal IPv4 addresses into 32-bit unsigned integers and hexadecimal values.' },
  { name: 'Integer to IPv4 Converter', desc: 'Convert 32-bit integer numbers back into standard dotted-decimal IPv4 addresses.' },
  { name: 'MAC Address Formatter', desc: 'Format MAC addresses into IEEE colon, Windows dash, and Cisco dot notation.' },
  { name: 'MAC Address Validator', desc: 'Validate 48-bit MAC address syntax and inspect Unicast/Multicast and OUI vendor bits.' },
  { name: 'DNS Zone File Formatter', desc: 'Format standard RFC 1035 BIND DNS zone file records with SOA, NS, MX, A, AAAA, and TXT.' },
  { name: 'DNS TTL Converter', desc: 'Convert DNS Time-To-Live seconds into minutes, hours, days, and BIND duration syntax.' },
  { name: 'DNS Record Syntax Checker', desc: 'Validate DNS resource record token order and RFC syntax compliance.' },
  { name: 'MX Priority Reference Tool', desc: 'Inspect Mail Exchange (MX) record priority weights for Google Workspace, Microsoft 365, and standby MTAs.' },
  { name: 'Port Range Calculator', desc: 'Identify well-known (0-1023), registered (1024-49151), and dynamic ephemeral port classes.' },
  { name: 'HTTP Header Formatter', desc: 'Format and canonicalize HTTP request and response headers.' },
  { name: 'Network Bandwidth Calculator', desc: 'Calculate throughput capacity in MB/s, hourly, daily, and monthly transfer volumes.' },
  { name: 'Data Transfer Time Calculator', desc: 'Estimate file upload and download duration over varying network link speeds.' },
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
    const existing = tools.find(x => x.slug === slug);
    if (!existing) {
      tools.push({
        name: t.name,
        slug: slug,
        category: catSlug,
        categoryName: catName,
        desc: t.desc,
        keywords: [t.name.toLowerCase(), catSlug, catName.toLowerCase(), 'online', 'free', 'developer']
      });
      addedCount++;
    }
  });
}

addCategoryTools('date-calendar-time-tools', 'Date, Calendar & Time Tools', datetimeTools);
addCategoryTools('network-dns-tools', 'Network & DNS Tools', networkTools);

fs.writeFileSync(toolsPath, JSON.stringify(tools, null, 2), 'utf8');
console.log(`Added ${addedCount} tools. Total tools in database: ${tools.length}`);

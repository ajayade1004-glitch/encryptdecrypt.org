const zlib = require('zlib');
const fs = require('fs');
const path = require('path');

function createPng(size) {
  const width = size;
  const height = size;
  const raw = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;

  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.44;

  for (let y = 0; y < height; y++) {
    raw[offset++] = 0; // Filter byte: None
    for (let x = 0; x < width; x++) {
      // Coordinate normalized from -1 to 1
      const nx = (x - cx) / (width * 0.5);
      const ny = (y - cy) / (height * 0.5);
      const dist = Math.sqrt(nx * nx + ny * ny);

      // Default background: deep space dark with cyber border
      let r = 8, g = 14, b = 26, a = 255;

      // Rounded squircle boundary: nx^4 + ny^4 <= 0.85
      const squircle = Math.pow(nx, 4) + Math.pow(ny, 4);
      if (squircle > 0.85) {
        if (squircle > 0.95) {
          // Transparent outside
          r = 0; g = 0; b = 0; a = 0;
        } else {
          // Anti-aliased border
          const borderFactor = 1 - (squircle - 0.85) / 0.1;
          r = 30; g = 120; b = 255;
          a = Math.floor(borderFactor * 255);
        }
      } else {
        // Inside squircle: subtle gradient
        const grad = 0.5 + 0.5 * ny;
        r = Math.floor(6 + grad * 4);
        g = Math.floor(10 + grad * 12);
        b = Math.floor(22 + grad * 25);

        // Shield test
        // Shield formula: top flat with v-peak, curves down to point at bottom
        // x in [-0.65, 0.65], y in [-0.75, 0.75]
        const sx = nx * 1.5;
        const sy = ny * 1.4 + 0.05;

        // Is inside shield?
        let insideShield = false;
        if (sy >= -0.7 && sy <= 0.75) {
          const maxSx = (sy <= 0.1) ? 0.65 : 0.65 * (1 - Math.pow((sy - 0.1) / 0.65, 1.8));
          if (Math.abs(sx) <= maxSx) {
            insideShield = true;
            // Shield border glow
            const edgeDist = maxSx - Math.abs(sx);
            if (edgeDist < 0.12 || sy < -0.58) {
              // Shield border color: Cyan to Blue
              r = 0; g = 210; b = 255;
            } else {
              // Shield inner body
              r = 12; g = 24; b = 48;
            }
          }
        }

        // Inside lock?
        // Padlock body: rect from x: [-0.28, 0.28], y: [0.0, 0.42]
        if (nx >= -0.28 && nx <= 0.28 && ny >= 0.0 && ny <= 0.42) {
          // Lock body gradient (Bright Blue)
          const lockGrad = (ny - 0.0) / 0.42;
          r = Math.floor(46 - lockGrad * 20);
          g = Math.floor(155 - lockGrad * 40);
          b = Math.floor(255 - lockGrad * 30);

          // Keyhole
          const kx = nx;
          const ky = ny - 0.18;
          const kDist = Math.sqrt(kx * kx + ky * ky);
          if (kDist <= 0.07 || (Math.abs(kx) <= 0.045 && ny >= 0.18 && ny <= 0.32)) {
            r = 6; g = 10; b = 20; // dark keyhole
          }
        }

        // Padlock shackle: arch from y: [-0.32, 0.05]
        if (ny >= -0.32 && ny <= 0.05) {
          const shackleDist = Math.sqrt(nx * nx + Math.pow(ny + 0.12, 2));
          if (shackleDist >= 0.16 && shackleDist <= 0.26 && ny <= -0.12) {
            r = 0; g = 240; b = 255; // neon cyan arch
          } else if (ny > -0.12 && (Math.abs(nx + 0.21) <= 0.05 || Math.abs(nx - 0.21) <= 0.05)) {
            r = 0; g = 240; b = 255; // vertical pillars of shackle
          }
        }
      }

      raw[offset++] = Math.min(255, Math.max(0, r));
      raw[offset++] = Math.min(255, Math.max(0, g));
      raw[offset++] = Math.min(255, Math.max(0, b));
      raw[offset++] = Math.min(255, Math.max(0, a));
    }
  }

  const idatData = zlib.deflateSync(raw, { level: 9 });

  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let k = 0; k < 8; k++) {
        c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crc = crc32(Buffer.concat([typeBuf, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeUInt32BE(crc, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', idatData),
    chunk('IEND', Buffer.alloc(0))
  ]);
}

// Generate 48x48 favicon.png
const faviconBuffer = createPng(64);
fs.writeFileSync(path.join(__dirname, '../public/favicon.png'), faviconBuffer);
console.log('Created public/favicon.png size:', faviconBuffer.length, 'bytes');

// Generate 180x180 apple-touch-icon.png
const appleIconBuffer = createPng(180);
fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), appleIconBuffer);
console.log('Created public/apple-touch-icon.png size:', appleIconBuffer.length, 'bytes');

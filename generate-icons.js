import fs from 'fs';
import zlib from 'zlib';

function crc32(buf) {
  let table = [];
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) {
      c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c;
  }
  let crc = -1;
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xff];
  }
  return (crc ^ -1) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeAndData = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData), 0);
  return Buffer.concat([len, typeAndData, crc]);
}

function createPng(width, height, isMaskable = false) {
  const sig = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  const raw = Buffer.alloc(height * (1 + width * 4));
  let offset = 0;
  const cx = width / 2;
  const cy = height / 2;
  const r = width * 0.45;

  for (let y = 0; y < height; y++) {
    raw[offset++] = 0; // filter 0
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Gradient background (Deep indigo #1e1b4b -> Rose #be123c -> Amber #d97706)
      const t = (x + y) / (width + height);
      let rCol = Math.round(30 + t * 190);
      let gCol = Math.round(27 + t * 80);
      let bCol = Math.round(75 + (1 - t) * 160);
      let aCol = 255;

      // Circle icon inner graphics
      if (dist < r * 0.6) {
        // Inner glowing core
        rCol = Math.min(255, rCol + 80);
        gCol = Math.min(255, gCol + 90);
        bCol = Math.min(255, bCol + 110);
      }

      // Border glow
      if (Math.abs(dist - r * 0.8) < width * 0.03) {
        rCol = 251;
        gCol = 191;
        bCol = 36;
      }

      // If not maskable, round outer corners
      if (!isMaskable) {
        const cornerR = width * 0.22;
        const inLeft = x < cornerR;
        const inRight = x > width - cornerR;
        const inTop = y < cornerR;
        const inBottom = y > height - cornerR;

        if ((inLeft || inRight) && (inTop || inBottom)) {
          const cornerX = inLeft ? cornerR : width - cornerR;
          const cornerY = inTop ? cornerR : height - cornerR;
          const cornerDist = Math.hypot(x - cornerX, y - cornerY);
          if (cornerDist > cornerR) {
            aCol = 0;
          }
        }
      }

      raw[offset++] = rCol;
      raw[offset++] = gCol;
      raw[offset++] = bCol;
      raw[offset++] = aCol;
    }
  }

  const compressed = zlib.deflateSync(raw, { level: 9 });
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, makeChunk('IHDR', ihdr), idat, iend]);
}

if (!fs.existsSync('public')) {
  fs.mkdirSync('public', { recursive: true });
}

fs.writeFileSync('public/pwa-192x192.png', createPng(192, 192, false));
fs.writeFileSync('public/pwa-512x512.png', createPng(512, 512, false));
fs.writeFileSync('public/pwa-maskable-512x512.png', createPng(512, 512, true));
fs.writeFileSync('public/apple-touch-icon.png', createPng(180, 180, false));
fs.writeFileSync('public/favicon.ico', createPng(64, 64, false));

console.log('PWA PNG icons generated successfully!');

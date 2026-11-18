// News image for Wednesday 18 November 2026.
// Draws a 1024x1024 editorial poster entirely in code: a 5x7 bitmap font
// written by hand, simple vector pictograms, and a small PNG encoder
// (node:zlib + CRC32). No network, no assets, fully deterministic:
// the same bytes on every run.
//
// Stories (all first reported on 18 Nov 2026, checked against news wires):
//  1. Iran drones hit a US radar site in Bahrain; Bahrain all-clear, Kuwait
//     reports drone interceptions (jagranjosh / appistos / mediaalertpress).
//  2. Ukraine damages the Crimean bridge for a second day; Russia pounds
//     bridges in Kyiv (jagranjosh / educationtimes / Times of India).
//  3. Trump arrives in Manila for Quad talks ahead of a China visit
//     (jagranjosh / educationtimes / studmentor).
//  4. UK sanctions eight Israeli settlement firms over the West Bank
//     (EIN Presswire / Yeni Safak / Times of India).
//  5. Nvidia reports $115.8bn in quarterly revenue (appistos).
//  6. Cyclone Akvan strengthens over the Bay of Bengal; Andhra Pradesh and
//     Odisha on high alert (jagranjosh / studmentor / educationtimes).

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';

// ---------------------------------------------------------------- PNG ---

const W = 1024;
const H = 1024;

const CRC_TABLE: number[] = (() => {
  const t: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length);
  return out;
}

function encodePng(rgb: Uint8Array, w: number, h: number): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // colour type RGB
  const raw = Buffer.alloc(h * (1 + w * 3));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 3)] = 0; // filter: none
    raw.set(rgb.subarray(y * w * 3, (y + 1) * w * 3), y * (1 + w * 3) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ------------------------------------------------------------- canvas ---

const px = new Uint8Array(W * H * 3);

type RGB = [number, number, number];
const PAPER: RGB = [246, 241, 231];
const INK: RGB = [26, 26, 26];
const NAVY: RGB = [20, 33, 61];
const GOLD: RGB = [201, 162, 39];
const WHITE: RGB = [255, 255, 255];
const MUTED: RGB = [90, 88, 80];
const LIGHT: RGB = [210, 208, 198];

function fill(x: number, y: number, w: number, h: number, c: RGB): void {
  const x0 = Math.max(0, x), y0 = Math.max(0, y);
  const x1 = Math.min(W, x + w), y1 = Math.min(H, y + h);
  for (let yy = y0; yy < y1; yy++) {
    for (let xx = x0; xx < x1; xx++) {
      const i = (yy * W + xx) * 3;
      px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2];
    }
  }
}

function setPixel(x: number, y: number, c: RGB): void {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = c[0]; px[i + 1] = c[1]; px[i + 2] = c[2];
}

function line(x0: number, y0: number, x1: number, y1: number, c: RGB, t = 2): void {
  const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
  let err = dx + dy, x = x0, y = y0;
  for (;;) {
    fill(x - ((t / 2) | 0), y - ((t / 2) | 0), t, t, c);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x += sx; }
    if (e2 <= dx) { err += dx; y += sy; }
  }
}

function circle(cx: number, cy: number, r: number, c: RGB, filled: boolean): void {
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      const d = Math.sqrt(x * x + y * y);
      if (filled ? d <= r : Math.abs(d - r) < 1.1) setPixel(cx + x, cy + y, c);
    }
  }
}

function arc(cx: number, cy: number, r: number, a0: number, a1: number, c: RGB, t = 3): void {
  for (let a = a0; a <= a1; a += 0.03) {
    const x = Math.round(cx + r * Math.cos(a));
    const y = Math.round(cy + r * Math.sin(a));
    fill(x - ((t / 2) | 0), y - ((t / 2) | 0), t, t, c);
  }
}

// --------------------------------------------------------------- font ---
// 5x7 bitmap font, uppercase + digits + punctuation. Each glyph is 7 rows
// of 5 characters; '#' is a set pixel.

const FONT: Record<string, string[]> = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01110', '10001', '10000', '10000', '10000', '10001', '01110'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['01110', '00100', '00100', '00100', '00100', '00100', '01110'],
  J: ['00111', '00010', '00010', '00010', '00010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '11011', '10001'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111'],
  '0': ['01110', '10001', '10011', '10101', '11001', '10001', '01110'],
  '1': ['00100', '01100', '00100', '00100', '00100', '00100', '01110'],
  '2': ['01110', '10001', '00001', '00110', '01000', '10000', '11111'],
  '3': ['11111', '00010', '00100', '00010', '00001', '10001', '01110'],
  '4': ['00010', '00110', '01010', '10010', '11111', '00010', '00010'],
  '5': ['11111', '10000', '11110', '00001', '00001', '10001', '01110'],
  '6': ['00110', '01000', '10000', '11110', '10001', '10001', '01110'],
  '7': ['11111', '00001', '00010', '00100', '01000', '01000', '01000'],
  '8': ['01110', '10001', '10001', '01110', '10001', '10001', '01110'],
  '9': ['01110', '10001', '10001', '01111', '00001', '00010', '01100'],
  ' ': ['00000', '00000', '00000', '00000', '00000', '00000', '00000'],
  '.': ['00000', '00000', '00000', '00000', '00000', '01100', '01100'],
  ',': ['00000', '00000', '00000', '00000', '01100', '00100', '01000'],
  "'": ['00100', '00100', '01000', '00000', '00000', '00000', '00000'],
  '-': ['00000', '00000', '00000', '01110', '00000', '00000', '00000'],
  '/': ['00001', '00010', '00010', '00100', '01000', '01000', '10000'],
  '%': ['11001', '11010', '00010', '00100', '01000', '01011', '10011'],
  $: ['00100', '01111', '10100', '01110', '00101', '11110', '00100'],
  ':': ['00000', '01100', '01100', '00000', '01100', '01100', '00000'],
  '!': ['00100', '00100', '00100', '00100', '00100', '00000', '00100'],
  '?': ['01110', '10001', '00001', '00110', '00100', '00000', '00100'],
  '(': ['00010', '00100', '01000', '01000', '01000', '00100', '00010'],
  ')': ['01000', '00100', '00010', '00010', '00010', '00100', '01000'],
  '&': ['01100', '10010', '10100', '01000', '10101', '10010', '01101'],
  '+': ['00000', '00100', '00100', '11111', '00100', '00100', '00000'],
};

const CHAR_W = 6; // 5 px glyph + 1 px spacing

function textWidth(s: string, scale: number): number {
  return s.length * CHAR_W * scale - scale;
}

function drawChar(ch: string, x: number, y: number, scale: number, c: RGB): void {
  const g = FONT[ch] ?? FONT['?'];
  for (let r = 0; r < 7; r++) {
    for (let col = 0; col < 5; col++) {
      if (g[r][col] === '1') fill(x + col * scale, y + r * scale, scale, scale, c);
    }
  }
}

function drawText(s: string, x: number, y: number, scale: number, c: RGB): void {
  for (let i = 0; i < s.length; i++) drawChar(s[i], x + i * CHAR_W * scale, y, scale, c);
}

function drawTextCentered(s: string, cx: number, y: number, scale: number, c: RGB): void {
  drawText(s, cx - Math.floor(textWidth(s, scale) / 2), y, scale, c);
}

function wrap(s: string, scale: number, maxW: number): string[] {
  const words = s.split(' ');
  const lines: string[] = [];
  let cur = '';
  for (const w of words) {
    const trial = cur ? cur + ' ' + w : w;
    if (textWidth(trial, scale) <= maxW || !cur) cur = trial;
    else { lines.push(cur); cur = w; }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ------------------------------------------------------------ content ---

interface Story {
  tag: string;
  color: RGB;
  headline: string;
  summary: string;
  icon: (x: number, y: number, s: number, c: RGB) => void;
}

function iconDrone(x: number, y: number, s: number, c: RGB): void {
  // Quadcopter seen from above: central body, four arms to corner rotors.
  const cx = x + 48, cy = y + 48;
  line(cx - 12, cy - 8, cx - 34, cy - 30, c, 4);
  line(cx + 12, cy - 8, cx + 34, cy - 30, c, 4);
  line(cx - 12, cy + 8, cx - 34, cy + 30, c, 4);
  line(cx + 12, cy + 8, cx + 34, cy + 30, c, 4);
  fill(cx - 15, cy - 9, 30, 18, c);
  for (const [rx, ry] of [[-36, -32], [36, -32], [-36, 32], [36, 32]] as const) {
    line(cx + rx - 12, cy + ry, cx + rx + 12, cy + ry, c, 3);
    circle(cx + rx, cy + ry, 4, c, true);
  }
  circle(cx, cy, 4, WHITE, true);
}

function iconBridge(x: number, y: number, s: number, c: RGB): void {
  // Bridge: deck, two towers, suspension arc, cables.
  const y0 = y + 62;
  fill(x + 8, y0, 80, 5, c);
  fill(x + 20, y + 22, 6, 42, c);
  fill(x + 70, y + 22, 6, 42, c);
  arc(x + 48, y0, 40, Math.PI, 2 * Math.PI, c, 3);
  line(x + 23, y + 26, x + 48, y0 - 2, c, 2);
  line(x + 73, y + 26, x + 48, y0 - 2, c, 2);
  line(x + 8, y + 18, x + 88, y + 18, c, 2);
}

function iconPlane(x: number, y: number, s: number, c: RGB): void {
  // Airliner in flight, nose up-right: thick fuselage, swept wings, tail.
  line(x + 12, y + 64, x + 76, y + 30, c, 7);
  line(x + 34, y + 46, x + 46, y + 70, c, 5);
  line(x + 54, y + 36, x + 66, y + 60, c, 5);
  line(x + 14, y + 62, x + 26, y + 76, c, 4);
  line(x + 70, y + 34, x + 86, y + 22, c, 4);
  circle(x + 78, y + 28, 4, c, true);
}

function iconShield(x: number, y: number, s: number, c: RGB): void {
  // Shield with a check mark.
  const cx = x + 48;
  line(x + 18, y + 14, x + 78, y + 14, c, 4);
  line(x + 18, y + 14, x + 18, y + 52, c, 4);
  line(x + 78, y + 14, x + 78, y + 52, c, 4);
  line(x + 18, y + 52, cx, y + 82, c, 4);
  line(x + 78, y + 52, cx, y + 82, c, 4);
  line(x + 32, y + 46, x + 44, y + 58, c, 5);
  line(x + 44, y + 58, x + 68, y + 30, c, 5);
}

function iconChip(x: number, y: number, s: number, c: RGB): void {
  // Microchip: square body, inner die, pins on four sides.
  fill(x + 26, y + 26, 44, 44, c);
  fill(x + 38, y + 38, 20, 20, WHITE);
  for (let i = 0; i < 4; i++) {
    fill(x + 30 + i * 11, y + 14, 5, 12, c);
    fill(x + 30 + i * 11, y + 70, 5, 12, c);
    fill(x + 14, y + 30 + i * 11, 12, 5, c);
    fill(x + 70, y + 30 + i * 11, 12, 5, c);
  }
}

function iconCyclone(x: number, y: number, s: number, c: RGB): void {
  // Storm swirl: three broken concentric arcs.
  const cx = x + 48, cy = y + 48;
  arc(cx, cy, 36, 0.4, Math.PI * 2 - 0.4, c, 4);
  arc(cx, cy, 24, Math.PI * 0.9, Math.PI * 2.9, c, 4);
  arc(cx, cy, 12, Math.PI * 1.4, Math.PI * 3.4, c, 4);
  circle(cx, cy, 4, c, true);
}

const STORIES: Story[] = [
  {
    tag: 'MIDDLE EAST', color: [176, 58, 46],
    headline: 'IRAN DRONES HIT US RADAR IN BAHRAIN',
    summary: "TEHRAN'S DRONES STRIKE A US RADAR SITE IN BAHRAIN. BAHRAIN SOUNDS THE ALL-CLEAR AS KUWAIT REPORTS INTERCEPTIONS.",
    icon: iconDrone,
  },
  {
    tag: 'UKRAINE WAR', color: [46, 94, 140],
    headline: 'UKRAINE HITS CRIMEA BRIDGE AGAIN',
    summary: 'KYIV DAMAGES THE BRIDGE TO CRIMEA FOR A SECOND DAY AS RUSSIA POUNDS BRIDGES IN KYIV.',
    icon: iconBridge,
  },
  {
    tag: 'ASIA', color: [15, 118, 110],
    headline: 'TRUMP LANDS IN MANILA FOR QUAD TALKS',
    summary: 'THE US PRESIDENT ARRIVES IN THE PHILIPPINES AHEAD OF QUAD TALKS AND A CHINA VISIT.',
    icon: iconPlane,
  },
  {
    tag: 'UNITED KINGDOM', color: [109, 40, 217],
    headline: 'UK SANCTIONS ISRAELI SETTLEMENT FIRMS',
    summary: 'LONDON BLACKLISTS EIGHT FIRMS OVER WEST BANK SETTLEMENTS IN A PUSH FOR A TWO-STATE SOLUTION.',
    icon: iconShield,
  },
  {
    tag: 'BUSINESS', color: [180, 83, 9],
    headline: 'NVIDIA POSTS $115.8BN QUARTER',
    summary: 'THE CHIPMAKER REPORTS $115.8BN IN QUARTERLY REVENUE AND SIGNS NEW MANUFACTURING DEALS.',
    icon: iconChip,
  },
  {
    tag: 'WEATHER', color: [3, 105, 161],
    headline: 'CYCLONE AKVAN BEARS DOWN ON INDIA',
    summary: 'THE STORM STRENGTHENS OVER THE BAY OF BENGAL. ANDHRA PRADESH AND ODISHA ARE ON HIGH ALERT.',
    icon: iconCyclone,
  },
];

// -------------------------------------------------------------- draw ----

function drawPanel(story: Story, x: number, y: number, w: number, h: number, n: number): void {
  fill(x, y, w, h, WHITE);
  // Border.
  fill(x, y, w, 2, INK); fill(x, y + h - 2, w, 2, INK);
  fill(x, y, 2, h, INK); fill(x + w - 2, y, 2, h, INK);
  // Tag bar.
  fill(x + 2, y + 2, w - 4, 36, story.color);
  drawText(story.tag, x + 16, y + 13, 2, WHITE);
  drawText('0' + n, x + w - 44, y + 13, 2, WHITE);
  // Headline (left) + pictogram (right).
  const headLines = wrap(story.headline, 3, 296);
  headLines.slice(0, 3).forEach((ln, i) => drawText(ln, x + 16, y + 52 + i * 24, 3, INK));
  const ix = x + w - 16 - 96, iy = y + 48;
  fill(ix, iy, 96, 96, [245, 242, 234]);
  fill(ix, iy, 96, 2, story.color); fill(ix, iy + 94, 96, 2, story.color);
  fill(ix, iy, 2, 96, story.color); fill(ix + 94, iy, 2, 96, story.color);
  story.icon(ix, iy, 1, story.color);
  // Summary, full width below.
  const sumLines = wrap(story.summary, 2, w - 32);
  sumLines.slice(0, 4).forEach((ln, i) => drawText(ln, x + 16, y + 158 + i * 19, 2, MUTED));
  // Thin rule above the foot of the panel.
  fill(x + 16, y + h - 26, w - 32, 2, LIGHT);
  drawText('18 NOV 2026', x + 16, y + h - 18, 1, MUTED);
}

function draw(): void {
  fill(0, 0, W, H, PAPER);
  // Masthead.
  fill(0, 0, W, 150, NAVY);
  fill(0, 150, W, 4, GOLD);
  drawTextCentered('THE WORLD IN ONE DAY', W / 2, 26, 2, GOLD);
  drawTextCentered('WEDNESDAY 18 NOVEMBER 2026', W / 2, 58, 4, WHITE);
  drawTextCentered('SIX STORIES FROM AROUND THE GLOBE', W / 2, 116, 2, [200, 205, 220]);
  // Grid of story panels: 2 columns x 3 rows.
  const pw = 474, ph = 254, gx = 28, gy = 176, gut = 20;
  STORIES.forEach((s, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    drawPanel(s, gx + col * (pw + gut), gy + row * (ph + 18), pw, ph, i + 1);
  });
  // Footer.
  drawTextCentered('FIRST REPORTED WEDNESDAY 18 NOVEMBER 2026', W / 2, 992, 2, MUTED);
}

// ---------------------------------------------------------------- main ---

draw();
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), encodePng(px, W, H));

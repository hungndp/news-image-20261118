// News poster for Wednesday 18 November 2026 (v2).
// Draws a 1024x1024 editorial poster entirely in code and writes it
// to $MAKEFUN_OUTPUT_DIR/entry.png (default /output). No network, no
// assets, no fonts on disk: a hand-built 5x7 bitmap font stored as one
// 35-character string per glyph, small vector pictograms drawn with
// lines and arcs, and a minimal PNG encoder (node:zlib + a CRC32
// table built at start-up). The run is deterministic: the same input
// files always produce the same bytes.
//
// Layout, top to bottom:
//   masthead (navy band, date + story count)
//   six hero panels (3 x 2) with pictograms
//   a UTC timeline strip of the day's turning points
//   a four-column index of the remaining 104 stories, by region
//   a date-check footer naming the sources
// 110 stories in all, every one first reported on 18 November 2026
// (see stories.ts and the source list in README.md).

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { deflateSync } from 'node:zlib';
import { COLUMNS, HEROES, SOURCES, STORY_COUNT, TIMELINE } from './stories.ts';

const W = 1024;
const H = 1024;

type RGB = [number, number, number];

// ------------------------------------------------------------ PNG out ---

// CRC32 table (polynomial 0xEDB88320), built once at start-up.
const CRC: number[] = [];
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  CRC[n] = c >>> 0;
}

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function pngChunk(type: string, data: Buffer): Buffer {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  const sum = crc32(Buffer.concat([Buffer.from(type, 'ascii'), data]));
  out.writeUInt32BE(sum, 8 + data.length);
  return out;
}

function encodePng(rgb: Uint8Array, w: number, h: number): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // 8-bit samples
  ihdr[9] = 2; // colour type 2 = RGB
  const raw = Buffer.alloc(h * (1 + w * 3));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 3)] = 0; // scanline filter: none
    raw.set(rgb.subarray(y * w * 3, (y + 1) * w * 3), y * (1 + w * 3) + 1);
  }
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    pngChunk('IHDR', ihdr),
    pngChunk('IDAT', deflateSync(raw, { level: 9 })),
    pngChunk('IEND', Buffer.alloc(0)),
  ]);
}

// ------------------------------------------------------------- canvas ---

const px = new Uint8Array(W * H * 3);

const PAPER: RGB = [246, 241, 231];
const INK: RGB = [26, 26, 26];
const NAVY: RGB = [20, 33, 61];
const GOLD: RGB = [201, 162, 39];
const WHITE: RGB = [255, 255, 255];
const MUTED: RGB = [90, 88, 80];
const FAINT: RGB = [208, 206, 196];
const PANEL: RGB = [255, 255, 255];

function rect(x: number, y: number, w: number, h: number, c: RGB): void {
  const x0 = Math.max(0, Math.floor(x));
  const y0 = Math.max(0, Math.floor(y));
  const x1 = Math.min(W, Math.ceil(x + w));
  const y1 = Math.min(H, Math.ceil(y + h));
  for (let yy = y0; yy < y1; yy++) {
    const row = yy * W * 3;
    for (let xx = x0; xx < x1; xx++) {
      const i = row + xx * 3;
      px[i] = c[0];
      px[i + 1] = c[1];
      px[i + 2] = c[2];
    }
  }
}

function dot(x: number, y: number, c: RGB): void {
  if (x < 0 || y < 0 || x >= W || y >= H) return;
  const i = (y * W + x) * 3;
  px[i] = c[0];
  px[i + 1] = c[1];
  px[i + 2] = c[2];
}

function seg(x0: number, y0: number, x1: number, y1: number, c: RGB, t = 2): void {
  const dx = Math.abs(x1 - x0);
  const dy = -Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  let x = x0;
  let y = y0;
  for (;;) {
    rect(x - ((t / 2) | 0), y - ((t / 2) | 0), t, t, c);
    if (x === x1 && y === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) {
      err += dy;
      x += sx;
    }
    if (e2 <= dx) {
      err += dx;
      y += sy;
    }
  }
}

function disc(cx: number, cy: number, r: number, c: RGB, filled: boolean): void {
  for (let y = -r; y <= r; y++) {
    for (let x = -r; x <= r; x++) {
      const d = Math.sqrt(x * x + y * y);
      if (filled ? d <= r : Math.abs(d - r) < 1.1) dot(cx + x, cy + y, c);
    }
  }
}

function arcTo(cx: number, cy: number, r: number, a0: number, a1: number, c: RGB, t = 3): void {
  for (let a = a0; a <= a1; a += 0.03) {
    const x = Math.round(cx + r * Math.cos(a));
    const y = Math.round(cy + r * Math.sin(a));
    rect(x - ((t / 2) | 0), y - ((t / 2) | 0), t, t, c);
  }
}

// --------------------------------------------------------------- font ---
// 5x7 bitmap font, capitals + digits + punctuation. One glyph is a
// single 35-character string: 7 rows of 5 bits, row-major, '1' = ink.

const FONT: Record<string, string> = {
  A: '01110100011000111111100011000110001',
  B: '11110100011000111110100011000111110',
  C: '01110100011000010000100001000101110',
  D: '11110100011000110001100011000111110',
  E: '11111100001000011110100001000011111',
  F: '11111100001000011110100001000010000',
  G: '01110100011000010111100011000101111',
  H: '10001100011000111111100011000110001',
  I: '01110001000010000100001000010001110',
  J: '00111000100001000010000101001001100',
  K: '10001100101010011000101001001010001',
  L: '10000100001000010000100001000011111',
  M: '10001110111010110101100011000110001',
  N: '10001110011010110011100011000110001',
  O: '01110100011000110001100011000101110',
  P: '11110100011000111110100001000010000',
  Q: '01110100011000110001101011001001101',
  R: '11110100011000111110101001001010001',
  S: '01111100001000001110000010000111110',
  T: '11111001000010000100001000010000100',
  U: '10001100011000110001100011000101110',
  V: '10001100011000110001100010101000100',
  W: '10001100011000110101101011101110001',
  X: '10001100010101000100010101000110001',
  Y: '10001100010101000100001000010000100',
  Z: '11111000010001000100010001000011111',
  '0': '01110100011001110101110011000101110',
  '1': '00100011000010000100001000010001110',
  '2': '01110100010000100110010001000011111',
  '3': '11111000100010000010000011000101110',
  '4': '00010001100101010010111110001000010',
  '5': '11111100001111000001000011000101110',
  '6': '00110010001000011110100011000101110',
  '7': '11111000010001000100010000100001000',
  '8': '01110100011000101110100011000101110',
  '9': '01110100011000101111000010001001100',
  ' ': '00000000000000000000000000000000000',
  '.': '00000000000000000000000000110001100',
  ',': '00000000000000000000011000010001000',
  "'": '00100001000100000000000000000000000',
  '-': '00000000000000001110000000000000000',
  '/': '00001000100001000100010000100010000',
  '%': '11001110100001000100010000101110011',
  $: '00100011111010001110001011111000100',
  ':': '00000011000110000000011000110000000',
  ';': '00000011000110000000011000010001000',
  '!': '00100001000010000100001000000000100',
  '?': '01110100010000100110001000000000100',
  '(': '00010001000100001000010000010000010',
  ')': '01000001000001000010000100010001000',
  '&': '01100100101010001000101011001001101',
  '+': '00000001000010011111001000010000000',
};

const STEP = 6; // glyph advance in pixels at scale 1 (5 px + 1 px gap)

function glyphOf(ch: string): string {
  return FONT[ch] ?? FONT['?'];
}

function textW(s: string, scale: number): number {
  return s.length * STEP * scale - scale;
}

function drawGlyph(ch: string, x: number, y: number, scale: number, c: RGB): void {
  const g = glyphOf(ch);
  for (let r = 0; r < 7; r++) {
    for (let col = 0; col < 5; col++) {
      if (g[r * 5 + col] === '1') rect(x + col * scale, y + r * scale, scale, scale, c);
    }
  }
}

function drawText(s: string, x: number, y: number, scale: number, c: RGB): void {
  const rx = Math.round(x);
  const ry = Math.round(y);
  for (let i = 0; i < s.length; i++) drawGlyph(s[i], rx + i * STEP * scale, ry, scale, c);
}

function drawCentred(s: string, cx: number, y: number, scale: number, c: RGB): void {
  drawText(s, cx - Math.floor(textW(s, scale) / 2), y, scale, c);
}

// Greedy word wrap; a single over-long word is kept whole on its own line.
function wrapText(s: string, scale: number, maxW: number): string[] {
  const lines: string[] = [];
  let cur = '';
  for (const w of s.split(' ')) {
    const trial = cur ? cur + ' ' + w : w;
    if (textW(trial, scale) <= maxW || !cur) cur = trial;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

// ------------------------------------------------------------ pictograms ---
// Each icon draws inside a 64x64 box whose top-left is (x, y).

function iconDrone(x: number, y: number, c: RGB): void {
  const cx = x + 32;
  const cy = y + 32;
  seg(cx - 8, cy - 5, cx - 22, cy - 20, c, 3);
  seg(cx + 8, cy - 5, cx + 22, cy - 20, c, 3);
  seg(cx - 8, cy + 5, cx - 22, cy + 20, c, 3);
  seg(cx + 8, cy + 5, cx + 22, cy + 20, c, 3);
  rect(cx - 10, cy - 6, 20, 12, c);
  for (const [rx, ry] of [[-24, -21], [24, -21], [-24, 21], [24, 21]] as const) {
    seg(cx + rx - 8, cy + ry, cx + rx + 8, cy + ry, c, 2);
    disc(cx + rx, cy + ry, 3, c, true);
  }
  disc(cx, cy, 3, WHITE, true);
}

function iconBridge(x: number, y: number, c: RGB): void {
  const deckY = y + 44;
  rect(x + 5, deckY, 54, 4, c);
  rect(x + 13, y + 14, 4, 32, c);
  rect(x + 47, y + 14, 4, 32, c);
  arcTo(x + 32, deckY, 27, Math.PI, 2 * Math.PI, c, 3);
  seg(x + 15, y + 17, x + 32, deckY - 2, c, 2);
  seg(x + 49, y + 17, x + 32, deckY - 2, c, 2);
  seg(x + 5, y + 11, x + 59, y + 11, c, 2);
  // Fallen span: a broken piece dropping into the water below.
  seg(x + 36, deckY + 4, x + 46, deckY + 14, c, 3);
  seg(x + 46, deckY + 14, x + 55, deckY + 9, c, 3);
}

function iconSummit(x: number, y: number, c: RGB): void {
  // Three flags on poles: the three leaders' meeting.
  for (let i = 0; i < 3; i++) {
    const fx = x + 7 + i * 18;
    seg(fx, y + 10, fx, y + 52, c, 3);
    rect(fx + 2, y + 10, 14, 10, c);
    rect(fx + 2, y + 12, 14, 2, WHITE);
  }
  seg(x + 7, y + 52, x + 57, y + 52, c, 3);
}

function iconVoyager(x: number, y: number, c: RGB): void {
  // Probe: dish, body, boom, and a signal wave heading home.
  disc(x + 32, y + 26, 14, c, false);
  disc(x + 32, y + 26, 9, c, false);
  rect(x + 29, y + 30, 6, 12, c);
  seg(x + 32, y + 42, x + 46, y + 55, c, 3);
  disc(x + 48, y + 57, 3, c, true);
  arcTo(x + 12, y + 12, 10, Math.PI * 0.1, Math.PI * 0.9, c, 2);
  disc(x + 12, y + 7, 2, c, true);
  disc(x + 52, y + 10, 2, c, true);
  disc(x + 56, y + 22, 2, c, true);
}

function iconChip(x: number, y: number, c: RGB): void {
  rect(x + 17, y + 17, 30, 30, c);
  rect(x + 25, y + 25, 14, 14, WHITE);
  for (let i = 0; i < 4; i++) {
    rect(x + 20 + i * 7, y + 9, 4, 8, c);
    rect(x + 20 + i * 7, y + 47, 4, 8, c);
    rect(x + 9, y + 20 + i * 7, 8, 4, c);
    rect(x + 47, y + 20 + i * 7, 8, 4, c);
  }
}

function iconCyclone(x: number, y: number, c: RGB): void {
  const cx = x + 32;
  const cy = y + 32;
  arcTo(cx, cy, 24, 0.4, Math.PI * 2 - 0.4, c, 3);
  arcTo(cx, cy, 16, Math.PI * 0.9, Math.PI * 2.9, c, 3);
  arcTo(cx, cy, 8, Math.PI * 1.4, Math.PI * 3.4, c, 3);
  disc(cx, cy, 3, c, true);
}

function drawIcon(kind: string, x: number, y: number, c: RGB): void {
  if (kind === 'drone') iconDrone(x, y, c);
  else if (kind === 'bridge') iconBridge(x, y, c);
  else if (kind === 'summit') iconSummit(x, y, c);
  else if (kind === 'voyager') iconVoyager(x, y, c);
  else if (kind === 'chip') iconChip(x, y, c);
  else iconCyclone(x, y, c);
}

// -------------------------------------------------------------- layout ---

function drawMasthead(): void {
  rect(0, 0, W, 112, NAVY);
  rect(0, 112, W, 4, GOLD);
  drawCentred('THE WORLD IN ONE DAY', W / 2, 16, 2, GOLD);
  drawCentred('WEDNESDAY 18 NOVEMBER 2026', W / 2, 42, 4, WHITE);
  drawCentred(
    STORY_COUNT + ' STORIES FROM EVERY REGION - FIRST REPORTED TODAY',
    W / 2,
    92,
    2,
    [200, 205, 220],
  );
}

function drawHero(
  hero: (typeof HEROES)[number],
  x: number,
  y: number,
  w: number,
  h: number,
  n: number,
): void {
  rect(x, y, w, h, PANEL);
  rect(x, y, w, 2, INK);
  rect(x, y + h - 2, w, 2, INK);
  rect(x, y, 2, h, INK);
  rect(x + w - 2, y, 2, h, INK);
  // Tag bar.
  rect(x + 2, y + 2, w - 4, 24, hero.color);
  drawText(hero.tag, x + 12, y + 9, 1, WHITE);
  drawText('0' + n, x + w - 34, y + 9, 1, WHITE);
  // Pictogram, top right, in a tinted square.
  const ix = x + w - 12 - 64;
  const iy = y + 34;
  rect(ix, iy, 64, 64, [245, 242, 234]);
  rect(ix, iy, 64, 2, hero.color);
  rect(ix, iy + 62, 64, 2, hero.color);
  rect(ix, iy, 2, 64, hero.color);
  rect(ix + 62, iy, 2, 64, hero.color);
  drawIcon(hero.icon, ix, iy, hero.color);
  // Headline, scale 2, up to 3 lines, left of the pictogram.
  const headLines = wrapText(hero.headline, 2, w - 32 - 64 - 8);
  headLines.slice(0, 3).forEach((ln, i) => drawText(ln, x + 12, y + 38 + i * 20, 2, INK));
  // Summary, full width, scale 2, up to 3 lines.
  const sumLines = wrapText(hero.summary, 2, w - 24);
  sumLines.slice(0, 3).forEach((ln, i) => drawText(ln, x + 12, y + 114 + i * 18, 2, MUTED));
  // Foot rule + date.
  rect(x + 12, y + h - 18, w - 24, 2, FAINT);
  drawText('18 NOV 2026', x + 12, y + h - 12, 1, MUTED);
}

function drawTimeline(): void {
  const y0 = 504;
  rect(0, y0, W, 44, NAVY);
  drawText('UTC', 14, y0 + 8, 2, GOLD);
  drawText('TIMELINE', 14, y0 + 26, 1, [200, 205, 220]);
  const slot = (W - 130) / TIMELINE.length;
  TIMELINE.forEach((ev, i) => {
    const cx = 130 + slot * i + slot / 2;
    disc(Math.round(cx), y0 + 10, 3, GOLD, true);
    drawCentred(ev.time, cx, y0 + 17, 1, WHITE);
    const label = wrapText(ev.label, 1, Math.floor(slot) - 8);
    label.slice(0, 2).forEach((ln, j) => drawCentred(ln, cx, y0 + 26 + j * 9, 1, [200, 205, 220]));
  });
}

function drawIndex(): void {
  const y0 = 560;
  const colW = 242;
  const gap = 10;
  const x0 = 12;
  drawText('THE REST OF THE DAY - 104 MORE STORIES', x0, y0, 2, INK);
  rect(x0, y0 + 20, W - 24, 2, INK);
  COLUMNS.forEach((sections, ci) => {
    const cx = x0 + ci * (colW + gap);
    let y = y0 + 32;
    let num = 0;
    for (const sec of sections) {
      drawText(sec.title, cx, y, 1, sec.color);
      rect(cx, y + 10, colW, 2, sec.color);
      y += 15;
      for (const item of sec.items) {
        num++;
        const label = String(num).padStart(2, '0') + ' ' + item;
        drawText(label, cx, y, 1, INK);
        y += 10;
      }
      y += 6;
    }
  });
}

function drawFooter(): void {
  const y0 = 966;
  rect(0, y0, W, 2, GOLD);
  drawCentred('DATE CHECK: EVERY STORY FIRST REPORTED WED 18 NOV 2026', W / 2, y0 + 10, 2, INK);
  drawCentred('SOURCES: ' + SOURCES, W / 2, y0 + 32, 1, MUTED);
  drawCentred('DRAWN IN CODE - 1024 X 1024 - NO PHOTOS, NO NETWORK', W / 2, y0 + 44, 1, MUTED);
}

function draw(): void {
  rect(0, 0, W, H, PAPER);
  drawMasthead();
  // Hero grid: 3 columns x 2 rows.
  const pw = 325;
  const ph = 185;
  HEROES.forEach((hero, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    drawHero(hero, 12 + col * (pw + 12), 124 + row * (ph + 8), pw, ph, i + 1);
  });
  drawTimeline();
  drawIndex();
  drawFooter();
}

// ---------------------------------------------------------------- main ---

draw();
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, 'entry.png'), encodePng(px, W, H));


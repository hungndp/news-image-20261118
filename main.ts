// News poster for Wednesday 18 November 2026, v2.1.
// Renders a 1024x1024 editorial poster in pure code and writes it to
// $MAKEFUN_OUTPUT_DIR/entry.png (default /output). No network, no
// assets, no fonts on disk: a hand-built 5x7 bitmap font kept as seven
// 5-bit rows per glyph, small vector pictograms drawn with lines and
// arcs, and a minimal PNG writer (node:zlib + a CRC32 table built at
// start-up). The run is deterministic: identical inputs always give
// identical bytes.
//
// Layout, top to bottom:
//   masthead (navy band, date + story count)
//   eight lead panels (4 x 2) with pictograms
//   a markets + sport ticker strip
//   a UTC timeline strip of the day's turning points
//   a four-column index of the remaining 126 stories, by region
//   a date-check footer naming the sources
// 134 stories in all, every one first reported on 18 November 2026
// (see stories.ts and the source list in README.md).

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as zlib from 'node:zlib';
import { GRID, LEADS, MARKS, SOURCE_LINE, TOTAL } from './stories.ts';

const W = 1024;
const H = 1024;

type Colour = [number, number, number];

// ------------------------------------------------------------- PNG out ---

// Build the CRC32 table (polynomial 0xEDB88320) once, at start-up.
function buildCrcTable(): number[] {
  const table: number[] = [];
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table.push(c >>> 0);
  }
  return table;
}

const CRC_TABLE = buildCrcTable();

function crcOf(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function makeChunk(kind: string, payload: Buffer): Buffer {
  const head = Buffer.alloc(8);
  head.writeUInt32BE(payload.length, 0);
  head.write(kind, 4, 'ascii');
  const tail = Buffer.alloc(4);
  tail.writeUInt32BE(crcOf(Buffer.concat([Buffer.from(kind, 'ascii'), payload])), 0);
  return Buffer.concat([head, payload, tail]);
}

function toPng(pixels: Uint8Array, w: number, h: number): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // 8-bit samples
  ihdr[9] = 2; // colour type 2 = RGB
  const raw = Buffer.alloc(h * (1 + w * 3));
  for (let y = 0; y < h; y++) {
    raw[y * (1 + w * 3)] = 0; // scanline filter: none
    raw.set(pixels.subarray(y * w * 3, (y + 1) * w * 3), y * (1 + w * 3) + 1);
  }
  const magic = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    magic,
    makeChunk('IHDR', ihdr),
    makeChunk('IDAT', idat),
    makeChunk('IEND', Buffer.alloc(0)),
  ]);
}

// --------------------------------------------------------------- board ---

const PAPER: Colour = [246, 241, 231];
const INK: Colour = [26, 26, 26];
const NAVY: Colour = [20, 33, 61];
const GOLD: Colour = [201, 162, 39];
const WHITE: Colour = [255, 255, 255];
const MUTED: Colour = [90, 88, 80];
const FAINT: Colour = [208, 206, 196];
const PANEL: Colour = [255, 255, 255];
const TINT: Colour = [245, 242, 234];
const PALE: Colour = [200, 205, 220];

// A mutable RGB canvas with the drawing primitives the poster needs.
class Board {
  data = new Uint8Array(W * H * 3);

  fill(x: number, y: number, w: number, h: number, c: Colour): void {
    const x0 = Math.max(0, Math.floor(x));
    const y0 = Math.max(0, Math.floor(y));
    const x1 = Math.min(W, Math.ceil(x + w));
    const y1 = Math.min(H, Math.ceil(y + h));
    for (let yy = y0; yy < y1; yy++) {
      const row = yy * W * 3;
      for (let xx = x0; xx < x1; xx++) {
        const i = row + xx * 3;
        this.data[i] = c[0];
        this.data[i + 1] = c[1];
        this.data[i + 2] = c[2];
      }
    }
  }

  px(x: number, y: number, c: Colour): void {
    if (x < 0 || y < 0 || x >= W || y >= H) return;
    const i = (y * W + x) * 3;
    this.data[i] = c[0];
    this.data[i + 1] = c[1];
    this.data[i + 2] = c[2];
  }

  // Bresenham line, drawn with square nibs of side t.
  line(x0: number, y0: number, x1: number, y1: number, c: Colour, t = 2): void {
    const dx = Math.abs(x1 - x0);
    const dy = -Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    let x = x0;
    let y = y0;
    for (;;) {
      this.fill(x - ((t / 2) | 0), y - ((t / 2) | 0), t, t, c);
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

  ring(cx: number, cy: number, r: number, c: Colour, solid: boolean): void {
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        const d = Math.sqrt(x * x + y * y);
        if (solid ? d <= r : Math.abs(d - r) < 1.1) this.px(cx + x, cy + y, c);
      }
    }
  }

  arc(cx: number, cy: number, r: number, a0: number, a1: number, c: Colour, t = 3): void {
    for (let a = a0; a <= a1; a += 0.03) {
      const x = Math.round(cx + r * Math.cos(a));
      const y = Math.round(cy + r * Math.sin(a));
      this.fill(x - ((t / 2) | 0), y - ((t / 2) | 0), t, t, c);
    }
  }
}

// ---------------------------------------------------------------- font ---
// 5x7 bitmap font, capitals + digits + punctuation. One glyph is seven
// rows, each a 5-bit number: bit 4 is the leftmost column, bit 0 the
// rightmost. A set bit paints ink.

const GLYPHS: Record<string, number[]> = {
  A: [0b01110, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  B: [0b11110, 0b10001, 0b10001, 0b11110, 0b10001, 0b10001, 0b11110],
  C: [0b01110, 0b10001, 0b10000, 0b10000, 0b10000, 0b10001, 0b01110],
  D: [0b11110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b11110],
  E: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b11111],
  F: [0b11111, 0b10000, 0b10000, 0b11110, 0b10000, 0b10000, 0b10000],
  G: [0b01110, 0b10001, 0b10000, 0b10111, 0b10001, 0b10001, 0b01111],
  H: [0b10001, 0b10001, 0b10001, 0b11111, 0b10001, 0b10001, 0b10001],
  I: [0b01110, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  J: [0b00111, 0b00010, 0b00010, 0b00010, 0b00010, 0b10010, 0b01100],
  K: [0b10001, 0b10010, 0b10100, 0b11000, 0b10100, 0b10010, 0b10001],
  L: [0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b10000, 0b11111],
  M: [0b10001, 0b11011, 0b10101, 0b10101, 0b10001, 0b10001, 0b10001],
  N: [0b10001, 0b11001, 0b10101, 0b10011, 0b10001, 0b10001, 0b10001],
  O: [0b01110, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  P: [0b11110, 0b10001, 0b10001, 0b11110, 0b10000, 0b10000, 0b10000],
  Q: [0b01110, 0b10001, 0b10001, 0b10001, 0b10101, 0b10010, 0b01101],
  R: [0b11110, 0b10001, 0b10001, 0b11110, 0b10100, 0b10010, 0b10001],
  S: [0b01111, 0b10000, 0b10000, 0b01110, 0b00001, 0b00001, 0b11110],
  T: [0b11111, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0b00100],
  U: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01110],
  V: [0b10001, 0b10001, 0b10001, 0b10001, 0b10001, 0b01010, 0b00100],
  W: [0b10001, 0b10001, 0b10001, 0b10101, 0b10101, 0b11011, 0b10001],
  X: [0b10001, 0b10001, 0b01010, 0b00100, 0b01010, 0b10001, 0b10001],
  Y: [0b10001, 0b10001, 0b01010, 0b00100, 0b00100, 0b00100, 0b00100],
  Z: [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b10000, 0b11111],
  '0': [0b01110, 0b10001, 0b10011, 0b10101, 0b11001, 0b10001, 0b01110],
  '1': [0b00100, 0b01100, 0b00100, 0b00100, 0b00100, 0b00100, 0b01110],
  '2': [0b01110, 0b10001, 0b00001, 0b00110, 0b01000, 0b10000, 0b11111],
  '3': [0b11111, 0b00010, 0b00100, 0b00010, 0b00001, 0b10001, 0b01110],
  '4': [0b00010, 0b00110, 0b01010, 0b10010, 0b11111, 0b00010, 0b00010],
  '5': [0b11111, 0b10000, 0b11110, 0b00001, 0b00001, 0b10001, 0b01110],
  '6': [0b00110, 0b01000, 0b10000, 0b11110, 0b10001, 0b10001, 0b01110],
  '7': [0b11111, 0b00001, 0b00010, 0b00100, 0b01000, 0b01000, 0b01000],
  '8': [0b01110, 0b10001, 0b10001, 0b01110, 0b10001, 0b10001, 0b01110],
  '9': [0b01110, 0b10001, 0b10001, 0b01111, 0b00001, 0b00010, 0b01100],
  ' ': [0, 0, 0, 0, 0, 0, 0],
  '.': [0, 0, 0, 0, 0, 0b01100, 0b01100],
  ',': [0, 0, 0, 0, 0b01100, 0b00100, 0b01000],
  "'": [0b00100, 0b00100, 0b01000, 0, 0, 0, 0],
  '-': [0, 0, 0, 0b01110, 0, 0, 0],
  '/': [0b00001, 0b00010, 0b00010, 0b00100, 0b01000, 0b01000, 0b10000],
  '%': [0b11001, 0b11010, 0b00010, 0b00100, 0b01000, 0b01011, 0b10011],
  $: [0b00100, 0b01111, 0b10100, 0b01110, 0b00101, 0b11110, 0b00100],
  ':': [0, 0b01100, 0b01100, 0, 0b01100, 0b01100, 0],
  ';': [0, 0b01100, 0b01100, 0, 0b01100, 0b00100, 0b01000],
  '!': [0b00100, 0b00100, 0b00100, 0b00100, 0b00100, 0, 0b00100],
  '?': [0b01110, 0b10001, 0b00001, 0b00110, 0b00100, 0, 0b00100],
  '(': [0b00010, 0b00100, 0b01000, 0b01000, 0b01000, 0b00100, 0b00010],
  ')': [0b01000, 0b00100, 0b00010, 0b00010, 0b00010, 0b00100, 0b01000],
  '&': [0b01100, 0b10010, 0b10100, 0b01000, 0b10101, 0b10010, 0b01101],
  '+': [0, 0b00100, 0b00100, 0b11111, 0b00100, 0b00100, 0],
};

const ADVANCE = 6; // glyph advance in pixels at scale 1 (5 px + 1 px gap)

function rowsOf(ch: string): number[] {
  return GLYPHS[ch] ?? GLYPHS['?'];
}

function measure(text: string, scale: number): number {
  return text.length * ADVANCE * scale - scale;
}

function putChar(b: Board, ch: string, x: number, y: number, scale: number, c: Colour): void {
  const rows = rowsOf(ch);
  for (let r = 0; r < 7; r++) {
    for (let col = 0; col < 5; col++) {
      if ((rows[r] >> (4 - col)) & 1) b.fill(x + col * scale, y + r * scale, scale, scale, c);
    }
  }
}

function putLine(b: Board, s: string, x: number, y: number, scale: number, c: Colour): void {
  const rx = Math.round(x);
  const ry = Math.round(y);
  for (let i = 0; i < s.length; i++) putChar(b, s[i], rx + i * ADVANCE * scale, ry, scale, c);
}

function putCentred(b: Board, s: string, cx: number, y: number, scale: number, c: Colour): void {
  putLine(b, s, cx - Math.floor(measure(s, scale) / 2), y, scale, c);
}

// Greedy word wrap; a single over-long word is kept whole on its own line.
function splitLines(s: string, scale: number, maxW: number): string[] {
  const out: string[] = [];
  let cur = '';
  for (const w of s.split(' ')) {
    const trial = cur ? cur + ' ' + w : w;
    if (measure(trial, scale) <= maxW || !cur) cur = trial;
    else {
      out.push(cur);
      cur = w;
    }
  }
  if (cur) out.push(cur);
  return out;
}

// ------------------------------------------------------------ pictograms ---
// Each icon draws inside a 48x48 box whose top-left is (x, y).

function pictDrone(b: Board, x: number, y: number, c: Colour): void {
  const cx = x + 24;
  const cy = y + 24;
  b.line(cx - 6, cy - 4, cx - 17, cy - 15, c, 2);
  b.line(cx + 6, cy - 4, cx + 17, cy - 15, c, 2);
  b.line(cx - 6, cy + 4, cx - 17, cy + 15, c, 2);
  b.line(cx + 6, cy + 4, cx + 17, cy + 15, c, 2);
  b.fill(cx - 8, cy - 5, 16, 10, c);
  for (const [rx, ry] of [[-18, -16], [18, -16], [-18, 16], [18, 16]] as const) {
    b.line(cx + rx - 6, cy + ry, cx + rx + 6, cy + ry, c, 2);
    b.ring(cx + rx, cy + ry, 2, c, true);
  }
  b.ring(cx, cy, 2, WHITE, true);
}

function pictBridge(b: Board, x: number, y: number, c: Colour): void {
  const deckY = y + 33;
  b.fill(x + 4, deckY, 40, 3, c);
  b.fill(x + 10, y + 10, 3, 24, c);
  b.fill(x + 35, y + 10, 3, 24, c);
  b.arc(x + 24, deckY, 20, Math.PI, 2 * Math.PI, c, 2);
  b.line(x + 11, y + 12, x + 24, deckY - 2, c, 2);
  b.line(x + 37, y + 12, x + 24, deckY - 2, c, 2);
  b.line(x + 4, y + 8, x + 44, y + 8, c, 2);
  // Fallen span: a broken piece dropping into the water below.
  b.line(x + 27, deckY + 3, x + 35, deckY + 11, c, 2);
  b.line(x + 35, deckY + 11, x + 42, deckY + 7, c, 2);
}

function pictSummit(b: Board, x: number, y: number, c: Colour): void {
  // Three flags on poles: the three leaders' meeting.
  for (let i = 0; i < 3; i++) {
    const fx = x + 5 + i * 14;
    b.line(fx, y + 8, fx, y + 40, c, 2);
    b.fill(fx + 2, y + 8, 11, 8, c);
    b.fill(fx + 2, y + 10, 11, 2, WHITE);
  }
  b.line(x + 5, y + 40, x + 43, y + 40, c, 2);
}

function pictVoyager(b: Board, x: number, y: number, c: Colour): void {
  // Probe: dish, body, boom, and a signal wave heading home.
  b.ring(x + 24, y + 20, 11, c, false);
  b.ring(x + 24, y + 20, 7, c, false);
  b.fill(x + 22, y + 23, 4, 9, c);
  b.line(x + 24, y + 32, x + 35, y + 42, c, 2);
  b.ring(x + 37, y + 44, 2, c, true);
  b.arc(x + 9, y + 9, 8, Math.PI * 0.1, Math.PI * 0.9, c, 2);
  b.ring(x + 9, y + 5, 2, c, true);
  b.ring(x + 39, y + 8, 2, c, true);
  b.ring(x + 42, y + 17, 2, c, true);
}

function pictChip(b: Board, x: number, y: number, c: Colour): void {
  b.fill(x + 13, y + 13, 22, 22, c);
  b.fill(x + 19, y + 19, 10, 10, WHITE);
  for (let i = 0; i < 3; i++) {
    b.fill(x + 15 + i * 7, y + 7, 3, 6, c);
    b.fill(x + 15 + i * 7, y + 35, 3, 6, c);
    b.fill(x + 7, y + 15 + i * 7, 6, 3, c);
    b.fill(x + 35, y + 15 + i * 7, 6, 3, c);
  }
}

function pictStorm(b: Board, x: number, y: number, c: Colour): void {
  const cx = x + 24;
  const cy = y + 24;
  b.arc(cx, cy, 18, 0.4, Math.PI * 2 - 0.4, c, 2);
  b.arc(cx, cy, 12, Math.PI * 0.9, Math.PI * 2.9, c, 2);
  b.arc(cx, cy, 6, Math.PI * 1.4, Math.PI * 3.4, c, 2);
  b.ring(cx, cy, 2, c, true);
}

function pictPad(b: Board, x: number, y: number, c: Colour): void {
  // Game controller: body, d-pad cross on the left, buttons right.
  b.fill(x + 8, y + 16, 32, 16, c);
  b.ring(x + 10, y + 24, 5, c, true);
  b.ring(x + 38, y + 24, 5, c, true);
  b.fill(x + 15, y + 20, 3, 8, WHITE);
  b.fill(x + 13, y + 22, 7, 3, WHITE);
  b.ring(x + 30, y + 21, 2, WHITE, true);
  b.ring(x + 35, y + 26, 2, WHITE, true);
  b.line(x + 24, y + 16, x + 24, y + 32, c, 2);
}

function pictBat(b: Board, x: number, y: number, c: Colour): void {
  // Cricket bat, angled, with a ball beside it.
  b.line(x + 26, y + 6, x + 26, y + 16, c, 3);
  b.fill(x + 21, y + 16, 10, 22, c);
  b.fill(x + 23, y + 18, 6, 18, WHITE);
  b.line(x + 18, y + 38, x + 30, y + 42, c, 2);
  b.ring(x + 38, y + 12, 5, c, true);
  b.ring(x + 38, y + 12, 2, WHITE, true);
}

function paintGlyph(b: Board, kind: string, x: number, y: number, c: Colour): void {
  if (kind === 'drone') pictDrone(b, x, y, c);
  else if (kind === 'bridge') pictBridge(b, x, y, c);
  else if (kind === 'summit') pictSummit(b, x, y, c);
  else if (kind === 'voyager') pictVoyager(b, x, y, c);
  else if (kind === 'chip') pictChip(b, x, y, c);
  else if (kind === 'storm') pictStorm(b, x, y, c);
  else if (kind === 'pad') pictPad(b, x, y, c);
  else pictBat(b, x, y, c);
}

// -------------------------------------------------------------- layout ---

const TICKER =
  'MARKETS: DOW -566 TO 50,193 - S&P DOWN 5TH DAY - NASDAQ UP - GOLD $3,736 - OIL $83 - ' +
  'SPORT: USA 8-0 - ARG 7-0 - BRAZIL 7-0 - DUCKETT 133 - NZ 236-5';

function paintMasthead(b: Board): void {
  b.fill(0, 0, W, 100, NAVY);
  b.fill(0, 100, W, 4, GOLD);
  putCentred(b, 'THE WORLD IN ONE DAY', W / 2, 12, 2, GOLD);
  putCentred(b, 'WEDNESDAY 18 NOVEMBER 2026', W / 2, 38, 4, WHITE);
  putCentred(b, TOTAL + ' STORIES FROM EVERY REGION - FIRST REPORTED TODAY', W / 2, 84, 2, PALE);
}

function paintLead(
  b: Board,
  lead: (typeof LEADS)[number],
  x: number,
  y: number,
  w: number,
  h: number,
  n: number,
): void {
  b.fill(x, y, w, h, PANEL);
  b.fill(x, y, w, 2, INK);
  b.fill(x, y + h - 2, w, 2, INK);
  b.fill(x, y, 2, h, INK);
  b.fill(x + w - 2, y, 2, h, INK);
  // Kicker bar.
  b.fill(x + 2, y + 2, w - 4, 18, lead.hue);
  putLine(b, lead.kicker, x + 10, y + 8, 1, WHITE);
  putLine(b, '0' + n, x + w - 28, y + 8, 1, WHITE);
  // Pictogram, top right, in a tinted square.
  const ix = x + w - 58;
  const iy = y + 26;
  b.fill(ix, iy, 48, 48, TINT);
  b.fill(ix, iy, 48, 2, lead.hue);
  b.fill(ix, iy + 46, 48, 2, lead.hue);
  b.fill(ix, iy, 2, 48, lead.hue);
  b.fill(ix + 46, iy, 2, 48, lead.hue);
  paintGlyph(b, lead.glyph, ix, iy, lead.hue);
  // Headline, scale 2, up to 3 lines, left of the pictogram.
  const heads = splitLines(lead.head, 2, w - 24 - 48 - 6);
  heads.slice(0, 3).forEach((ln, i) => putLine(b, ln, x + 10, y + 28 + i * 16, 2, INK));
  // Deck, full width, scale 2, up to 3 lines.
  const decks = splitLines(lead.deck, 2, w - 20);
  decks.slice(0, 3).forEach((ln, i) => putLine(b, ln, x + 10, y + 84 + i * 16, 2, MUTED));
  // Foot rule + date.
  b.fill(x + 10, y + h - 18, w - 20, 2, FAINT);
  putLine(b, '18 NOV 2026', x + 10, y + h - 12, 1, MUTED);
}

function paintTicker(b: Board): void {
  const y0 = 432;
  b.fill(0, y0, W, 24, NAVY);
  putCentred(b, TICKER, W / 2, y0 + 8, 1, GOLD);
}

function paintTimeline(b: Board): void {
  const y0 = 464;
  b.fill(0, y0, W, 44, NAVY);
  putLine(b, 'UTC', 14, y0 + 8, 2, GOLD);
  putLine(b, 'TIMELINE', 14, y0 + 26, 1, PALE);
  const slot = (W - 130) / MARKS.length;
  MARKS.forEach((ev, i) => {
    const cx = 130 + slot * i + slot / 2;
    b.ring(Math.round(cx), y0 + 10, 3, GOLD, true);
    putCentred(b, ev.at, cx, y0 + 17, 1, WHITE);
    const label = splitLines(ev.what, 1, Math.floor(slot) - 8);
    label.slice(0, 2).forEach((ln, j) => putCentred(b, ln, cx, y0 + 26 + j * 9, 1, PALE));
  });
}

function paintIndex(b: Board): void {
  const y0 = 516;
  const colW = 242;
  const gap = 10;
  const x0 = 12;
  putLine(b, 'THE REST OF THE DAY - 126 MORE STORIES', x0, y0, 2, INK);
  b.fill(x0, y0 + 20, W - 24, 2, INK);
  GRID.forEach((blocks, ci) => {
    const cx = x0 + ci * (colW + gap);
    let y = y0 + 32;
    let num = 0;
    for (const block of blocks) {
      putLine(b, block.name, cx, y, 1, block.hue);
      b.fill(cx, y + 10, colW, 2, block.hue);
      y += 15;
      for (const item of block.lines) {
        num++;
        const label = String(num).padStart(2, '0') + ' ' + item;
        putLine(b, label, cx, y, 1, INK);
        y += 9;
      }
      y += 6;
    }
  });
}

function paintFooter(b: Board): void {
  const y0 = 964;
  b.fill(0, y0, W, 2, GOLD);
  putCentred(b, 'DATE CHECK: EVERY STORY FIRST REPORTED WED 18 NOV 2026', W / 2, y0 + 10, 2, INK);
  putCentred(b, 'SOURCES: ' + SOURCE_LINE, W / 2, y0 + 32, 1, MUTED);
  putCentred(b, 'DRAWN IN CODE - 1024 X 1024 - NO PHOTOS, NO NETWORK', W / 2, y0 + 44, 1, MUTED);
}

function paintPoster(): Board {
  const b = new Board();
  b.fill(0, 0, W, H, PAPER);
  paintMasthead(b);
  // Lead grid: 4 columns x 2 rows.
  const pw = 244;
  const ph = 152;
  LEADS.forEach((lead, i) => {
    const col = i % 4;
    const row = Math.floor(i / 4);
    paintLead(b, lead, 12 + col * (pw + 8), 112 + row * (ph + 8), pw, ph, i + 1);
  });
  paintTicker(b);
  paintTimeline(b);
  paintIndex(b);
  paintFooter(b);
  return b;
}

// ---------------------------------------------------------------- main ---

const board = paintPoster();
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'entry.png'), toPng(board.data, W, H));

#!/usr/bin/env node
/**
 * Build docs/assets/data/archive.json from the markdown digest
 * docs/23148320.md (39 Zhihu answers about the Hanyu Pinyin scheme).
 *
 * Reproducible: all data except the hand-curated stance classification
 * is derived from the markdown source. Run with:
 *
 *   cd scripts && npm install && node build-archive.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { marked } from 'marked';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE_REL = 'docs/23148320.md';
const SOURCE = path.join(ROOT, SOURCE_REL);
const OUT_REL = 'docs/assets/data/archive.json';
const OUT = path.join(ROOT, OUT_REL);
const DOCS = path.join(ROOT, 'docs');

const QUESTION = '《汉语拼音方案》有哪些明显的硬伤？';
const QUESTION_URL = 'https://www.zhihu.com/question/23148320';

/* ------------------------------------------------------------------ */
/* Stance classification (fixed mapping supplied with the task).      */
/* ------------------------------------------------------------------ */

const STANCES = {
  1: 'testimony', 2: 'reform', 3: 'defend', 4: 'history', 5: 'reform',
  6: 'defend', 7: 'reform', 8: 'reform', 9: 'history', 10: 'defend',
  11: 'testimony', 12: 'reform', 13: 'history', 14: 'detail', 15: 'testimony',
  16: 'reform', 17: 'detail', 18: 'history', 19: 'testimony', 20: 'reform',
  21: 'reform', 22: 'reform', 23: 'detail', 24: 'history', 25: 'reform',
  26: 'reform', 27: 'history', 28: 'defend', 29: 'reform', 30: 'detail',
  31: 'defend', 32: 'history', 33: 'reform', 34: 'testimony', 35: 'reform',
  36: 'history', 37: 'reform', 38: 'defend', 39: 'reform',
};

const STANCE_LABELS = {
  testimony: '名字的代价',
  reform: '改良方案',
  defend: '维持与正名',
  history: '历史与制度',
  detail: '细节与教学',
};

/*
 * Chinese authors routinely close bold text right before a CJK character,
 * e.g. "**……无稽之谈，**就……". CommonMark treats the CJK comma before the
 * closing ** as punctuation, so the run is not right-flanking and marked
 * leaves the asterisks literal. This small extension applies the author's
 * obvious intent without changing anything else.
 */
const lenientStrong = {
  name: 'lenientStrong',
  level: 'inline',
  start(src) {
    const i = src.indexOf('**');
    return i < 0 ? undefined : i;
  },
  tokenizer(src) {
    const m = /^\*\*(?=\S)([\s\S]*?\S)\*\*/.exec(src);
    if (m) {
      return { type: 'lenientStrong', raw: m[0], tokens: this.lexer.inlineTokens(m[1]) };
    }
    return undefined;
  },
  renderer(token) {
    return `<strong>${this.parser.parseInline(token.tokens)}</strong>`;
  },
};

marked.use({ extensions: [lenientStrong] });

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const NAMED_ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  hellip: '…', mdash: '—', ndash: '–', middot: '·', times: '×',
  copy: '©', reg: '®', deg: '°', plusmn: '±',
};

function decodeEntities(input) {
  return String(input).replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z][a-zA-Z0-9]+);/g, (m, body) => {
    if (body[0] === '#') {
      const hex = body[1] === 'x' || body[1] === 'X';
      const code = Number.parseInt(hex ? body.slice(2) : body.slice(1), hex ? 16 : 10);
      if (Number.isFinite(code) && code > 0 && code <= 0x10ffff) {
        try { return String.fromCodePoint(code); } catch { return m; }
      }
      return m;
    }
    const key = body.toLowerCase();
    return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, key)
      ? NAMED_ENTITIES[key]
      : m;
  });
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Remove tags/scripts/iframes, event handlers and javascript: URLs. */
function sanitizeHtml(html) {
  let out = String(html);

  out = out.replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '');
  out = out.replace(/<script\b[^>]*\/?>/gi, '');
  out = out.replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe\s*>/gi, '');
  out = out.replace(/<iframe\b[^>]*\/?>/gi, '');

  // Clean attributes tag by tag so that on* handlers and javascript: URLs
  // never survive, while ordinary links/images/formatting are preserved.
  out = out.replace(/<([a-zA-Z][a-zA-Z0-9:-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g, (all, tag, attrs) => {
    const name = tag.toLowerCase();
    if (name === 'script' || name === 'iframe') return '';
    let next = attrs;
    next = next.replace(/\s+on[a-zA-Z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '');
    next = next.replace(
      /\s+(href|src)\s*=\s*(?:"\s*javascript:[^"]*"|'\s*javascript:[^']*'|javascript:[^\s>]+)/gi,
      '',
    );
    return `<${tag}${next}>`;
  });

  out = out.replace(/javascript\s*:/gi, '');
  return out.trim();
}

/** Markdown body -> plain prose suitable for an excerpt. */
function markdownToProse(md) {
  let text = String(md);

  text = text.replace(/```[\s\S]*?```/g, ' ');
  text = text.replace(/~~~[\s\S]*?~~~/g, ' ');
  text = text.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ');
  text = text.replace(/^[ \t]*#{1,6}[ \t]+.*$/gm, ' ');
  text = text.replace(/^[ \t]*\|?[ \t]*:?-{3,}:?[ \t]*(\|[ \t]*:?-{3,}:?[ \t]*)+\|?[ \t]*$/gm, ' ');
  text = text.replace(/^[ \t]*(?:-{3,}|\*{3,}|_{3,})[ \t]*$/gm, ' ');
  text = text.replace(/^[ \t]*>[ \t]?/gm, '');
  text = text.replace(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]+/gm, ' ');
  text = text.replace(/\\[ \t]*\n/g, '\n');
  text = text.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
  text = text.replace(/<((?:https?:\/\/|mailto:)[^>]+)>/g, '$1');
  text = text.replace(/<\/?[a-zA-Z][^>]*>/g, ' ');
  text = text.replace(/[*_~`]{1,3}/g, '');
  text = text.replace(/\\([\\`*_{}\[\]()#+\-.!>])/g, '$1');
  text = text.replace(/\|/g, ' ');
  text = decodeEntities(text);

  const CJK = '\\u3400-\\u4dbf\\u4e00-\\u9fff\\uf900-\\ufaff';
  const lines = text
    .split('\n')
    .map((line) => line.replace(/[ \t]+/g, ' ').trim())
    .filter(Boolean)
    .map((line) => line
      // Drop the visual spaces inserted between CJK glyphs on one line...
      .replace(new RegExp(`([${CJK}])\\s+(?=[${CJK}])`, 'g'), '$1')
      .replace(new RegExp(`([。；：！？，、])\\s+(?=[${CJK}])`, 'g'), '$1')
      .replace(/\s+([，。；：！？、）】》」』])/g, '$1')
      .replace(/([（【《「『])\s+/g, '$1'));

  // ...but keep one space at paragraph/line boundaries, so that enumerators
  // such as a lone "一" do not fuse with the following sentence.
  return lines
    .join(' ')
    .replace(new RegExp(`([。；：！？，、])\\s+(?=[${CJK}])`, 'g'), '$1')
    .replace(/\s+([，。；：！？、）】》」』])/g, '$1')
    .replace(/([（【《「『])\s+/g, '$1')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

function makeExcerpt(prose) {
  const TARGET = 180;
  if (prose.length <= TARGET) return { excerpt: prose, truncated: false };

  const window = prose.slice(0, 220);
  const boundary = /[。！？!?；;…]/g;
  let cut = -1;
  let m;
  while ((m = boundary.exec(window)) !== null) {
    const end = m.index + m[0].length;
    if (end >= 140) { cut = end; break; }
  }
  if (cut === -1) cut = TARGET;
  const head = prose.slice(0, cut).trim().replace(/…+$/, '').trim();
  return { excerpt: `${head}……`, truncated: true };
}

function countWords(html) {
  const text = decodeEntities(String(html).replace(/<[^>]+>/g, ' '));
  const cjk = (text.match(/[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g) || []).length;
  const latin = (text.match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g) || []).length;
  return cjk + latin;
}

/* ------------------------------------------------------------------ */
/* Parse                                                               */
/* ------------------------------------------------------------------ */

const raw = fs.readFileSync(SOURCE, 'utf8').replace(/^\uFEFF/, '');
const source = raw.slice(0, raw.indexOf('## 附：图片索引') > 0
  ? raw.indexOf('## 附：图片索引')
  : raw.length);

const h1 = source.match(/^#\s+(.+)$/m);
if (!h1 || h1[1].trim() !== QUESTION) {
  throw new Error(`Unexpected question title: ${h1 ? h1[1] : '(missing)'}`);
}

const headingRe = /^##\s+(\d+)\.\s+(.+?)\s*$/gm;
const headings = [...source.matchAll(headingRe)];
if (headings.length !== 39) {
  throw new Error(`Expected 39 answer headings, found ${headings.length}`);
}

const META_RE = /^[ \t]*>[ \t]*(\d+)[ \t]*赞同[ \t]*[·•][ \t]*(\d{4}-\d{2}-\d{2})[ \t]*[·•][ \t]*\[原回答\]\(\s*(https?:\/\/[^)\s]+)\s*\)[ \t]*$/m;

const answers = [];

for (let i = 0; i < headings.length; i += 1) {
  const h = headings[i];
  const id = Number(h[1]);
  const author = decodeEntities(h[2].trim());
  const start = h.index + h[0].length;
  const end = i + 1 < headings.length ? headings[i + 1].index : source.length;
  let body = source.slice(start, end);

  const meta = body.match(META_RE);
  if (!meta) throw new Error(`Answer ${id}: metadata line not found`);
  const votes = Number(meta[1]);
  const date = meta[2];
  const url = meta[3].replace(/&amp;/g, '&');

  // Drop exactly the metadata line, then the section separator / anchor
  // that belongs to the *next* answer heading.
  body = body.slice(0, meta.index) + body.slice(meta.index + meta[0].length);
  body = body.replace(/\n*<a id="answer-\d+"><\/a>\s*$/, '');
  body = body.replace(/\n*-{3,}\s*$/, '');
  // Lone backslashes are spacing artifacts from the digest, not content.
  body = body.replace(/^[ \t]*\\[ \t]*$/gm, '');
  body = body.trim();

  const bodyHtml = sanitizeHtml(marked.parse(body, { gfm: true, breaks: false }));

  const imagePaths = [];
  const imageRe = /!\[[^\]]*\]\((images\/[^)\s]+)(?:\s+"[^"]*")?\)/g;
  let im;
  while ((im = imageRe.exec(body)) !== null) {
    if (!imagePaths.includes(im[1])) imagePaths.push(im[1]);
  }
  const existingImages = imagePaths.filter((p) => fs.existsSync(path.join(DOCS, p)));
  const missingImages = imagePaths.filter((p) => !fs.existsSync(path.join(DOCS, p)));

  const prose = markdownToProse(body);
  const { excerpt } = makeExcerpt(prose);
  const stance = STANCES[id];
  const stanceLabel = STANCE_LABELS[stance];

  answers.push({
    id,
    anchor: `answer-${id}`,
    author,
    votes,
    date,
    url,
    stance,
    stanceLabel,
    excerpt,
    bodyHtml,
    images: existingImages,
    wordCount: countWords(bodyHtml),
    // internal fields, removed before writing
    _prose: prose,
    _missingImages: missingImages,
  });
}

answers.sort((a, b) => a.id - b.id);

const dates = answers.map((a) => a.date).sort();
const totalVotes = answers.reduce((sum, a) => sum + a.votes, 0);

const archive = {
  meta: {
    question: QUESTION,
    url: QUESTION_URL,
    count: answers.length,
    totalVotes,
    dateRange: [dates[0], dates[dates.length - 1]],
    sourceFile: SOURCE_REL,
  },
  answers: answers.map(({ _prose, _missingImages, ...answer }) => answer),
};

/* ------------------------------------------------------------------ */
/* Quality checks                                                      */
/* ------------------------------------------------------------------ */

const allowedStances = new Set(Object.keys(STANCE_LABELS));
const problems = [];
const warnings = [];

function check(condition, message) {
  if (!condition) problems.push(message);
}

check(archive.answers.length === 39, `count: expected 39, got ${archive.answers.length}`);
check(totalVotes > 0, 'totalVotes must be positive');
check(dates[0] === '2015-04-28', `dateRange min: expected 2015-04-28, got ${dates[0]}`);
check(dates[dates.length - 1] === '2026-08-01', `dateRange max: expected 2026-08-01, got ${dates[dates.length - 1]}`);
check(archive.meta.count === archive.answers.length, 'meta.count mismatch');

for (const a of archive.answers) {
  const tag = `answer-${a.id}`;
  const original = answers.find((x) => x.id === a.id);
  // A handful of answers are only one or two sentences long in the source.
  // For those, the 100-char excerpt and 200-char bodyHtml floors are
  // physically impossible to reach without inventing content, so they are
  // reported as explicit warnings instead of hard failures.
  const shortProse = !original || original._prose.length < 100;
  const shortBody = !original || original.bodyHtml.length <= 200;

  check(a.id >= 1 && a.id <= 39, `${tag}: id out of range`);
  check(a.anchor === tag, `${tag}: bad anchor ${a.anchor}`);
  check(typeof a.author === 'string' && a.author.trim().length > 0, `${tag}: empty author`);
  check(typeof a.votes === 'number' && Number.isFinite(a.votes), `${tag}: votes not a number`);
  check(/^\d{4}-\d{2}-\d{2}$/.test(a.date), `${tag}: bad date ${a.date}`);
  check(/^https:\/\/www\.zhihu\.com\//.test(a.url), `${tag}: bad url ${a.url}`);
  check(allowedStances.has(a.stance), `${tag}: bad stance ${a.stance}`);
  check(a.stanceLabel === STANCE_LABELS[a.stance], `${tag}: stanceLabel mismatch`);
  check(typeof a.excerpt === 'string' && a.excerpt.length <= 260,
    `${tag}: excerpt length ${a.excerpt ? a.excerpt.length : 0}`);
  check(typeof a.excerpt === 'string' && (a.excerpt.length >= 100 || shortProse),
    `${tag}: excerpt length ${a.excerpt ? a.excerpt.length : 0} (source prose is too short)`);
  check(typeof a.bodyHtml === 'string' && (a.bodyHtml.length > 200 || shortBody),
    `${tag}: bodyHtml length ${a.bodyHtml ? a.bodyHtml.length : 0} (source body is too short)`);
  check(!/<script/i.test(a.bodyHtml), `${tag}: <script found`);
  check(!/onerror\s*=/i.test(a.bodyHtml), `${tag}: onerror= found`);
  check(!/onclick\s*=/i.test(a.bodyHtml), `${tag}: onclick= found`);
  check(!/javascript\s*:/i.test(a.bodyHtml), `${tag}: javascript: found`);
  check(Array.isArray(a.images), `${tag}: images not an array`);
  check(a.images.length === new Set(a.images).size, `${tag}: duplicate image paths`);
  for (const img of a.images) {
    check(img.startsWith('images/23148320/'), `${tag}: unexpected image path ${img}`);
    check(fs.existsSync(path.join(DOCS, img)), `${tag}: missing image ${img}`);
  }
  check(typeof a.wordCount === 'number' && a.wordCount > 0, `${tag}: bad wordCount`);

  if (original && original._prose.length < 100) {
    warnings.push(`${tag}: source prose is only ${original._prose.length} chars; excerpt is the complete verbatim text (below the 100-char floor).`);
  }
  if (original && original.bodyHtml.length <= 200) {
    warnings.push(`${tag}: source body is too short for a 200+ char bodyHtml (${original.bodyHtml.length}); kept verbatim.`);
  }
  if (original && original._missingImages.length) {
    warnings.push(`${tag}: dropped missing images: ${original._missingImages.join(', ')}`);
  }
}

// JSON round-trip / BOM check happens after writing.
const json = `${JSON.stringify(archive, null, 2)}\n`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, json, 'utf8');

const writtenBuffer = fs.readFileSync(OUT);
if (writtenBuffer[0] === 0xef && writtenBuffer[1] === 0xbb && writtenBuffer[2] === 0xbf) {
  problems.push('output starts with a UTF-8 BOM');
}
try {
  const parsed = JSON.parse(writtenBuffer.toString('utf8'));
  if (parsed.answers.length !== 39) problems.push('written JSON does not round-trip to 39 answers');
} catch (err) {
  problems.push(`written JSON does not parse: ${err.message}`);
}

/* ------------------------------------------------------------------ */
/* Report                                                              */
/* ------------------------------------------------------------------ */

const stanceCounts = {};
for (const a of archive.answers) {
  stanceCounts[a.stance] = (stanceCounts[a.stance] || 0) + 1;
}

console.log(`Wrote ${OUT_REL}`);
console.log(`answers:     ${archive.answers.length}`);
console.log(`totalVotes:  ${archive.meta.totalVotes}`);
console.log(`dateRange:   ${archive.meta.dateRange.join(' → ')}`);
console.log(`stances:     ${Object.entries(stanceCounts).map(([k, v]) => `${k}=${v}`).join(', ')}`);
for (const w of warnings) console.warn(`WARN  ${w}`);
for (const p of problems) console.error(`FAIL  ${p}`);
console.log(problems.length === 0 ? 'quality checks: PASS (with warnings above)' : `quality checks: FAIL (${problems.length})`);
process.exitCode = problems.length === 0 ? 0 : 1;

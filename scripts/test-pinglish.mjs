#!/usr/bin/env node
/**
 * Pinglish v1.0 tests.
 *
 *   node scripts/test-pinglish.mjs
 *
 * Exits 0 on success. No test framework, no dependencies beyond the vendored
 * pinyin-pro build in docs/assets/vendor/pinyin-pro.js.
 */

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');

const Pinglish = require(path.join(root, 'docs/assets/js/pinglish.js'));
const pinyinPro = require(path.join(root, 'docs/assets/vendor/pinyin-pro.js'));
globalThis.pinyinPro = pinyinPro;

const table = JSON.parse(
  fs.readFileSync(path.join(root, 'docs/assets/data/syllables.json'), 'utf8')
);

let checks = 0;
function eq(actual, expected, label) {
  assert.equal(actual, expected, label);
  checks++;
}
function deep(actual, expected, label) {
  assert.deepEqual(actual, expected, label);
  checks++;
}
function ok(cond, label) {
  assert.ok(cond, label);
  checks++;
}
function throws(fn, pattern, label) {
  assert.throws(fn, pattern, label);
  checks++;
}
function section(name) {
  console.log('\n# ' + name);
}

// ---------------------------------------------------------------------------
section('package surface');
// ---------------------------------------------------------------------------

eq(Pinglish.VERSION, '1.0.0', 'VERSION');
eq(typeof Pinglish.forwardSyllable, 'function', 'forwardSyllable exported');
eq(typeof Pinglish.reverseSyllable, 'function', 'reverseSyllable exported');
eq(typeof Pinglish.toPinglish, 'function', 'toPinglish exported');
eq(typeof Pinglish.toPinyin, 'function', 'toPinyin exported');
eq(typeof Pinglish.toPinglishSyllables, 'function', 'toPinglishSyllables exported');
eq(typeof Pinglish.toPinyinSyllables, 'function', 'toPinyinSyllables exported');
eq(typeof Pinglish.toneMark, 'function', 'toneMark exported');
eq(typeof Pinglish.stripToneMarks, 'function', 'stripToneMarks exported');
eq(typeof Pinglish.chineseToPinglish, 'function', 'chineseToPinglish exported');
eq(typeof Pinglish.chineseToPinyin, 'function', 'chineseToPinyin exported');
deep(Pinglish.SPEC.pinyinToPinglish, table.pinyinToPinglish, 'SPEC inlines pinyinToPinglish');
deep(Pinglish.SPEC.pinglishToPinyin, table.pinglishToPinyin, 'SPEC inlines pinglishToPinyin');
eq(Pinglish.SPEC.version, table.version, 'SPEC version');
ok(typeof Pinglish.SPEC.notes === 'string' && Pinglish.SPEC.notes.length > 20, 'SPEC notes');

// ---------------------------------------------------------------------------
section('syllable table: 407 base syllables + extras, zero collisions');
// ---------------------------------------------------------------------------

const ranges = [
  [0x3400, 0x4dbf],
  [0x4e00, 0x9fff],
  [0xf900, 0xfaff],
  [0x20000, 0x2fa1f]
];
const standard = new Set();
for (const [start, end] of ranges) {
  for (let cp = start; cp <= end; cp++) {
    const ch = String.fromCodePoint(cp);
    const res = pinyinPro.pinyin(ch, {
      toneType: 'none',
      type: 'array',
      nonZh: 'consecutive'
    });
    if (res.length === 1 && /^[a-züê]+$/.test(res[0])) standard.add(res[0]);
  }
}
eq(standard.size, 407, 'dictionary scan yields 407 standard bases');

const extras = ['ê', 'hm', 'hng', 'lo', 'shei', 'zhei', 'biang', 'duang', 'tei'];
for (const base of standard) {
  ok(Object.prototype.hasOwnProperty.call(table.pinyinToPinglish, base), 'table covers ' + base);
}
for (const base of extras) {
  ok(Object.prototype.hasOwnProperty.call(table.pinyinToPinglish, base), 'table covers extra ' + base);
}
eq(Object.keys(table.pinyinToPinglish).length, 416, '416 pinyin bases total');
eq(Object.keys(table.pinglishToPinyin).length, 416, '416 Pinglish bases total');

const seen = Object.create(null);
for (const [pinyinBase, pinglishBase] of Object.entries(table.pinyinToPinglish)) {
  ok(/^[a-z]+$/.test(pinglishBase), 'Pinglish is ASCII: ' + pinglishBase);
  eq(seen[pinglishBase], undefined, 'no collision for ' + pinglishBase);
  seen[pinglishBase] = pinyinBase;
  eq(table.pinglishToPinyin[pinglishBase], pinyinBase, 'reverse table for ' + pinglishBase);
  eq(Pinglish.forwardSyllable(pinyinBase), pinglishBase, 'forwardSyllable ' + pinyinBase);
  eq(Pinglish.reverseSyllable(pinglishBase), pinyinBase, 'reverseSyllable ' + pinglishBase);
  eq(
    Pinglish.reverseSyllable(Pinglish.forwardSyllable(pinyinBase) + '3'),
    pinyinBase + '3',
    'syllable round-trip ' + pinyinBase
  );
}

// ---------------------------------------------------------------------------
section('required single-syllable mappings');
// ---------------------------------------------------------------------------

const forwardCases = {
  'lü3': 'lv3',
  'xue1': 'hve1',
  'jun1': 'gvn1',
  'bo1': 'buo1',
  'shi1': 'shy1',
  'wo3': 'uo3',
  'yuan2': 'ven2',
  'weng1': 'ueng1',
  ju: 'gv',
  'nǐ': 'ni3',
  'lǚ': 'lv3',
  'xuē': 'hve1',
  'jūn': 'gvn1'
};
for (const [pinyinSyllable, expected] of Object.entries(forwardCases)) {
  eq(Pinglish.forwardSyllable(pinyinSyllable), expected, 'forward ' + pinyinSyllable);
}

const reverseCases = {
  lv3: 'lü3',
  hve1: 'xue1',
  gvn1: 'jun1',
  zy1: 'zi1',
  buo1: 'bo1',
  dung1: 'dong1'
};
for (const [pinglishSyllable, expected] of Object.entries(reverseCases)) {
  eq(Pinglish.reverseSyllable(pinglishSyllable), expected, 'reverse ' + pinglishSyllable);
}

// Common ASCII-pinyin input (v for ü, jv for ju) is accepted as an alias.
eq(Pinglish.forwardSyllable('lv3'), 'lv3', 'ASCII ü alias lv');
eq(Pinglish.forwardSyllable('jv1'), 'gv1', 'ASCII ü alias jv');
eq(Pinglish.forwardSyllable('nve4'), 'nve4', 'ASCII ü alias nve');
eq(Pinglish.toneMark('jv1'), 'jū', 'ASCII ü alias in toneMark');
eq(Pinglish.toPinglish('nv3 lv4'), 'nv3 lv4', 'ASCII ü alias in text');
eq(Pinglish.toPinglishSyllables('nv3 lv4').length, 2, 'ASCII ü alias syllable list');

eq(Pinglish.forwardSyllable('ma5'), 'ma0', 'tone 5 normalises to 0 (forward)');
eq(Pinglish.reverseSyllable('ma5'), 'ma0', 'tone 5 normalises to 0 (reverse)');
throws(() => Pinglish.forwardSyllable('hve1'), /invalid pinyin syllable/, 'forward rejects Pinglish');
throws(() => Pinglish.reverseSyllable('xue1'), /invalid Pinglish syllable/, 'reverse rejects pinyin');
throws(() => Pinglish.forwardSyllable('zzz'), /invalid pinyin syllable/, 'forward rejects nonsense');
throws(() => Pinglish.reverseSyllable('zzz'), /invalid Pinglish syllable/, 'reverse rejects nonsense');

// ---------------------------------------------------------------------------
section('tone marks and stripping');
// ---------------------------------------------------------------------------

const marked = {
  'ni3': 'nǐ',
  'lv3': 'lǚ',
  'hve1': 'xuē',
  'gvn1': 'jūn',
  'xue1': 'xuē',
  'jun1': 'jūn',
  'shi3': 'shǐ',
  'zi3': 'zǐ',
  'buo1': 'bō',
  'dung1': 'dōng',
  'gui4': 'guì',
  'liu2': 'liú',
  'jiong3': 'jiǒng',
  'xuan1': 'xuān',
  'lüe4': 'lüè',
  'er2': 'ér',
  'ma0': 'ma',
  'ma5': 'ma'
};
for (const [syllable, expected] of Object.entries(marked)) {
  eq(Pinglish.toneMark(syllable), expected, 'toneMark ' + syllable);
}

eq(Pinglish.stripToneMarks('nǐ hǎo'), 'ni3 hao3', 'stripToneMarks sentence');
eq(Pinglish.stripToneMarks('nǐhǎo'), 'ni3hao3', 'stripToneMarks unspaced');
eq(Pinglish.stripToneMarks('lǚ'), 'lü3', 'stripToneMarks ü');
eq(Pinglish.stripToneMarks('xuē'), 'xue1', 'stripToneMarks xuē');
eq(Pinglish.stripToneMarks('Hànyǔ Pīnyīn'), 'han4yu3 pin1yin1', 'stripToneMarks two words');
eq(Pinglish.stripToneMarks('ni3 hao3'), 'ni3 hao3', 'stripToneMarks is idempotent');

// ---------------------------------------------------------------------------
section('pinyin -> Pinglish text');
// ---------------------------------------------------------------------------

eq(Pinglish.toPinglish('nǐ hǎo'), 'ni3 hau3', 'tone marks + ao -> au');
eq(Pinglish.toPinglish('nǐ hǎo!'), 'ni3 hau3!', 'punctuation preserved');
eq(Pinglish.toPinglish('lǚ'), 'lv3', 'ü -> v');
eq(Pinglish.toPinglish('ma5'), 'ma0', 'neutral 5 -> 0');
eq(
  Pinglish.toPinglish('wo3 xi3 huan1 chi1 bei3 jing1 kao3 ya1'),
  'uo3 hi3 huan1 chy1 bei3 ging1 kau3 ia1',
  'sentence conversion'
);
eq(Pinglish.toPinglish('xi1 an1'), "hi1'an1", 'apostrophe before a');
eq(Pinglish.toPinglish('tian1 an1 men2'), "tien1'an1 men2", '天安门 spacing');
eq(Pinglish.toPinglish("xi1'an1"), "hi1'an1", 'existing apostrophe preserved');
eq(Pinglish.toPinglish('xue1'), 'hve1', 'xue -> hve');

// ---------------------------------------------------------------------------
section('Pinglish -> pinyin text');
// ---------------------------------------------------------------------------

eq(Pinglish.toPinyin('lv3'), 'lǚ', 'lv3 -> lǚ');
eq(Pinglish.toPinyin('hve1'), 'xuē', 'hve1 -> xuē');
eq(Pinglish.toPinyin('gvn1'), 'jūn', 'gvn1 -> jūn');
eq(Pinglish.toPinyin('zy1'), 'zī', 'zy1 -> zī');
eq(Pinglish.toPinyin('buo1'), 'bō', 'buo1 -> bō');
eq(Pinglish.toPinyin('dung1'), 'dōng', 'dung1 -> dōng');
eq(Pinglish.toPinyin("hi1'an1"), 'xī ān', 'hi1\'an1 -> xī ān');
eq(Pinglish.toPinyin("hi1'an1", { toneMarks: false }), 'xi1 an1', 'toneMarks false');
eq(Pinglish.toPinyin('ni3 hau3'), 'nǐ hǎo', 'sentence with marks');
eq(
  Pinglish.toPinyin('uo3 hi3 huan1 chy1 bei3 ging1 kau3 ia1'),
  'wǒ xǐ huān chī běi jīng kǎo yā',
  'sentence without marks'
);
eq(
  Pinglish.toPinyin('uo3 hi3 huan1 chy1 bei3 ging1 kau3 ia1', { toneMarks: false }),
  'wo3 xi3 huan1 chi1 bei3 jing1 kao3 ya1',
  'sentence with tone numbers'
);
eq(Pinglish.toPinyin('ni3 hau3!'), 'nǐ hǎo!', 'punctuation preserved');
eq(Pinglish.toPinyin('ma0'), 'ma', 'neutral tone has no mark');

// ---------------------------------------------------------------------------
section('syllable list helpers');
// ---------------------------------------------------------------------------

deep(Pinglish.toPinglishSyllables('nǐ hǎo'), [
  { pinyin: 'ni', pinglish: 'ni', tone: 3 },
  { pinyin: 'hao', pinglish: 'hau', tone: 3 }
], 'toPinglishSyllables');

deep(Pinglish.toPinyinSyllables("hi1'an1"), [
  { pinglish: 'hi', pinyin: 'xi', tone: 1 },
  { pinglish: 'an', pinyin: 'an', tone: 1 }
], 'toPinyinSyllables');

deep(Pinglish.toPinglishSyllables('xi1an1'), [
  { pinyin: 'xi', pinglish: 'hi', tone: 1 },
  { pinyin: 'an', pinglish: 'an', tone: 1 }
], 'toPinglishSyllables splits adjacent syllables');

// The converter UI appends tone itself, so the helpers must not pre-append it.
const sample = Pinglish.toPinyinSyllables('lv3')[0];
eq(sample.pinyin, 'lü', 'helper pinyin is base only');
eq(sample.tone, 3, 'helper tone is separate');
eq(Pinglish.toneMark(sample.pinyin + sample.tone), 'lǚ', 'UI tone assembly works');

// SPEC §6 / the converter examples spell 语 as "yv3"; accept it on input.
eq(Pinglish.reverseSyllable('yv3'), 'yu3', 'yv compatibility alias (reverse)');
eq(Pinglish.toneMark('yv3'), 'yǔ', 'yv compatibility alias (toneMark)');
eq(Pinglish.toPinyin('han4 yv3 pin1 in1'), 'hàn yǔ pīn yīn', 'yv compatibility alias (text)');

// ---------------------------------------------------------------------------
section('Chinese -> Pinglish (pinyin-pro bridge)');
// ---------------------------------------------------------------------------

const chineseCases = {
  // SPEC.md §6 prints "han4 yv3 pin1 in1"; that conflicts with the authoritative
  // mapping rule "yu -> v" (§4) and docs/index.html ("yú -> v2"), so v3 is used.
  '汉语拼音': 'han4 v3 pin1 in1',
  '吕': 'lv3',
  '女': 'nv3',
  '薛': 'hve1',
  '学': 'hve2',
  '雪': 'hve3',
  '鸡七西': 'gi1 ki1 hi1',
  '居去虚': 'gv1 kv4 hv1',
  '知识': 'zhy1 shy0',
  '资本': 'zy1 ben3',
  '波多': 'buo1 duo1',
  '东西': 'dung1 hi1',
  '穷兄': 'kiung2 hiung1',
  '烟边冤': 'ien1 bien1 ven1',
  '军云': 'gvn1 vn2',
  '我喜欢吃北京烤鸭': 'uo3 hi3 huan0 chy1 bei3 ging1 kau3 ia1',
  '西安': "hi1'an1",
  '先': 'hien1',
  '天安门': "tien1'an1 men2"
};
for (const [chinese, expected] of Object.entries(chineseCases)) {
  eq(Pinglish.chineseToPinglish(chinese), expected, 'chineseToPinglish ' + chinese);
}

eq(Pinglish.chineseToPinglish('汉语拼音，你好！'), 'han4 v3 pin1 in1，ni3 hau3！', 'punctuation');
eq(Pinglish.chineseToPinglish('Hello 世界'), 'Hello shy4 gie4', 'non-Chinese preserved');
eq(
  Pinglish.chineseToPinyin('汉语拼音'),
  'hàn yǔ pīn yīn',
  'chineseToPinyin with tone marks'
);
eq(
  Pinglish.chineseToPinyin('汉语拼音', { toneMarks: false }),
  'han4 yu3 pin1 yin1',
  'chineseToPinyin with tone numbers'
);

const savedPinyinPro = globalThis.pinyinPro;
delete globalThis.pinyinPro;
throws(
  () => Pinglish.chineseToPinglish('你'),
  /pinyin-pro is not loaded/,
  'clear error when pinyin-pro is unavailable'
);
globalThis.pinyinPro = savedPinyinPro;

// ---------------------------------------------------------------------------
section('round-trip on common words');
// ---------------------------------------------------------------------------

const words = [
  '你', '好', '中国', '世界', '汉语', '拼音', '北京', '上海', '学习', '工作',
  '朋友', '老师', '学生', '今天', '明天', '昨天', '时间', '电话', '电脑', '手机',
  '音乐', '电影', '喜欢', '知道', '东西', '知识', '资本', '波多', '穷兄',
  '烟边冤', '军云', '鸡七西', '居去虚', '吕女', '薛学雪', '西安', '先',
  '天安门', '方案', '皮袄', '欧洲', '跑步', '绿色', '女人', '月亮', '云朵',
  '永远', '运动', '唱歌', '喝水', '吃饭', '睡觉', '读书', '写字'
];

for (const word of words) {
  const pinyinSyllables = pinyinPro
    .pinyin(word, { toneType: 'num', type: 'array', nonZh: 'consecutive' })
    .filter((item) => /^[a-züê]+[0-5]?$/.test(item));
  const pinglishText = Pinglish.toPinglish(pinyinSyllables.join(' '));
  const back = Pinglish.toPinyinSyllables(pinglishText).map(
    (item) => item.pinyin + (item.tone === null ? '' : item.tone)
  );
  deep(back, pinyinSyllables, 'round-trip ' + word);
}

console.log('\nAll ' + checks + ' assertions passed.');

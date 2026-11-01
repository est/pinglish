# Archive data builder

Regenerates `docs/assets/data/archive.json` from the Zhihu digest at
`docs/23148320.md`.

## Build

```sh
cd scripts && npm install && node build-archive.mjs
```

That is the whole build. Node 20+ is required (`marked` 16 declares
`node >= 20`); `marked` is the only dependency and is installed locally into
`scripts/node_modules` (ignored by git).

The script resolves the repository root from its own location, so it also
works if invoked as `node scripts/build-archive.mjs` from the repository
root. The output path is always `docs/assets/data/archive.json`.

## What it does

- Splits the digest at each `## N. Author` heading (stopping before
  `## 附：图片索引`).
- Reads votes, date and source URL from the `> N 赞同 · YYYY-MM-DD ·
  [原回答](...)` line, then removes that line and the answer heading from
  the body.
- Renders the body with `marked` (GFM tables, links, images, `<u>`, `<sup>`,
  emphasis and lists are preserved) and sanitises the HTML: `<script>`,
  `<iframe>`, `on*=` attributes and `javascript:` URLs are removed.
- Rewrites relative `images/23148320/...` paths unchanged (they resolve
  from `docs/`) and records only images that exist on disk.
- Builds a plain-text excerpt (140–220 Chinese characters where the source
  is long enough), an approximate `wordCount` (CJK characters + Latin
  words), and the fixed stance/stance-label pair for each answer.
- Writes UTF-8 JSON without a BOM, then re-reads it and runs the quality
  checks (ids/anchors, required fields, stance labels, excerpt/body sizes,
  forbidden HTML, image existence, vote total and date range).

## Output shape

```json
{
  "meta": {
    "question": "《汉语拼音方案》有哪些明显的硬伤？",
    "url": "https://www.zhihu.com/question/23148320",
    "count": 39,
    "totalVotes": 4172,
    "dateRange": ["2015-04-28", "2026-08-01"],
    "sourceFile": "docs/23148320.md"
  },
  "answers": [
    {
      "id": 1,
      "anchor": "answer-1",
      "author": "匿名用户",
      "votes": 735,
      "date": "2016-12-02",
      "url": "https://www.zhihu.com/question/23148320/answer/133939449",
      "stance": "testimony",
      "stanceLabel": "名字的代价",
      "excerpt": "……",
      "bodyHtml": "<p>……</p>",
      "images": ["images/23148320/answer13-pinyin-revision-1.jpg"],
      "wordCount": 1234
    }
  ]
}
```

## Notes

The stance mapping (`testimony`, `reform`, `defend`, `history`, `detail`) is
a fixed editorial classification stored in `build-archive.mjs`; the script
does not try to infer it from the text.

A few answers are only one or two sentences long in the source.
Answers 6, 11, 17, 25 and 29 have less than 100 characters of prose, so their
excerpts are the complete verbatim text rather than padded copy. Answers 6,
7, 11, 17, 25, 29 and 31 also have a naturally short `bodyHtml` (under 200
characters). The build reports these as warnings instead of inventing text.

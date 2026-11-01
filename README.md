# PINGLISH

> 如果汉语拼音生在今天，它会长成什么样？
> What if Hanyu Pinyin were designed today?

**PINGLISH** 是一次关于《汉语拼音方案》的公开设计练习，也是一个把 39 个知乎回答整理成可检索档案的双语静态站点。

- 叙事：一个名字的四种写法，1958 年的四个不可能，一套字母的三份工作。
- 方案：**Pinglish v1.0** —— 纯 ASCII、不简写、不改写、可逆、声调数字化的汉语罗马字方案。
- 转换器：汉字 ⇄ 现行拼音 ⇄ Pinglish，逐音节对照。
- 档案：39 个回答，按立场筛选、搜索、展开全文；英文版提供摘要与原文链接。

线上地址：<https://pinglish.est.im>

> 这不是废除拼音的运动，也不是官方提案。它只是一次参照系实验。

## 术语

本站正文统一使用 **汉语**（语言，包括各种汉语变体）和 **汉字**（统一文字）。`docs/` 原始材料与档案中的引文保留原始用词，并在档案页注明。

## 结构

```
docs/                       原始材料（不参与 Pages 部署）
  23148320.md               知乎回答整理稿
  images/23148320/          13 张原始图片

src/                        GitHub Pages 发布目录
  index.html                汉语版产品首页（三层 ruby 对照 + 转换器）
  story.html                叙事长文（一个名字，四种写法）
  scheme.html               Pinglish 完整规格
  convert.html              交互式转换器
  archive.html              39 份证词
  about.html                方法、来源、事实核查、版权
  en/                       英语版
    index.html
    story.html
    scheme.html
    convert.html
    archive.html
    about.html
  assets/
    css/style.css           设计系统
    js/site.js              主题、导航、滚动揭示、复制
    js/pinglish.js          Pinglish 转换引擎（UMD）
    js/ruby.js              三层 ruby 组件（拼音 / 汉字 / Pinglish）
    js/convert.js           转换器 UI（双语）
    js/archive.js           汉语版档案 UI
    js/archive-en.js        英语版档案 UI
    data/syllables.json     407 个标准音节 + 边缘音节
    data/archive.json       39 个回答的结构化数据
    data/archive-en.json    39 条英文摘要
    vendor/pinyin-pro.js    pinyin-pro 3.29.5（MIT）
  images/23148320/          部署用图片副本
  CNAME                     pinglish.est.im
  .nojekyll

.github/workflows/pages.yml GitHub Pages 构建与部署
SPEC.md                     Pinglish 规格（源文件）
scripts/
  build-archive.mjs         从 docs/23148320.md 生成 archive.json
  test-pinglish.mjs         转换引擎测试
research/factcheck.md       事实核查笔记
```

## 本地预览

站点是零构建的纯静态文件：

```bash
cd src
python3 -m http.server 8000
# 打开 http://localhost:8000
```

不要直接双击 `index.html`：档案页用 `fetch()` 读取 JSON，`file://` 协议会被浏览器拦截。

## 重建档案数据 / 跑测试

```bash
cd scripts
npm install
node build-archive.mjs      # 写入 src/assets/data/archive.json
node test-pinglish.mjs
```

英文摘要保存在 `src/assets/data/archive-en.json`，由编辑维护，不从汉语原文自动翻译。

## 部署

推送到 `main` 后，`.github/workflows/pages.yml` 会：

1. 跑 `node scripts/test-pinglish.mjs`；
2. 把 `src/` 作为 GitHub Pages artifact 上传；
3. 部署到 GitHub Pages。

仓库的 Pages Source 需要设为 **GitHub Actions**。自定义域名由 `src/CNAME` 指向 `pinglish.est.im`。

## 许可

- 本站文本（除引用外）：CC BY-NC-SA 4.0
- 代码：MIT
- 知乎回答：著作权属于原作者，本站为评论、研究与存档目的引用，保留署名与原链接
- pinyin-pro：MIT

## 致谢

39 位知乎答主，以及 1956 年那场把能想到的问题都讨论过一遍的全国大讨论。

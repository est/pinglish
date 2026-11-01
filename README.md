# PINGLISH

> 如果汉语拼音生在今天，它会长成什么样？

**PINGLISH** 是一次关于《汉语拼音方案》的公开设计练习，也是一个把 39 个知乎回答整理成可检索档案的静态站点。

- 叙事：一个名字的四种写法，1958 年的四个不可能，一套字母的三份工作。
- 方案：**Pinglish v1.0** —— 纯 ASCII、不简写、不改写、可逆、声调数字化的普通话罗马字方案。
- 转换器：汉字 ⇄ 现行拼音 ⇄ Pinglish，逐音节对照。
- 档案：39 个回答，按立场筛选、搜索、展开全文。

线上地址：<https://pinglish.est.im>

> 这不是废除拼音的运动，也不是官方提案。它只是一次参照系实验。

## 结构

```
docs/                       GitHub Pages 站点根目录
  index.html                叙事首页
  scheme.html               Pinglish 完整规格
  convert.html              交互式转换器
  archive.html              39 份证词
  about.html                方法、来源、事实核查、版权
  assets/
    css/style.css           设计系统
    js/site.js              主题、导航、滚动揭示、复制
    js/pinglish.js          Pinglish 转换引擎（UMD）
    js/convert.js           转换器 UI
    js/archive.js           档案 UI
    data/syllables.json     407 个音节的映射表
    data/archive.json       39 个回答的结构化数据
    vendor/pinyin-pro.js    pinyin-pro 3.29.5（MIT）
  images/23148320/          知乎回答中的 13 张图片
SPEC.md                     Pinglish 规格（源文件）
scripts/
  build-archive.mjs         从 docs/23148320.md 生成 archive.json
  test-pinglish.mjs         转换引擎测试
research/factcheck.md       事实核查笔记
```

## 本地预览

站点是零构建的纯静态文件：

```bash
cd docs
python3 -m http.server 8000
# 打开 http://localhost:8000
```

不要直接双击 `index.html`：档案页用 `fetch()` 读取 JSON，`file://` 协议会被浏览器拦截。

## 重建数据 / 跑测试

```bash
cd scripts
npm install
node build-archive.mjs
node test-pinglish.mjs
```

## 部署

GitHub Pages 使用 `docs/` 目录，`docs/CNAME` 指向 `pinglish.est.im`。推送到默认分支即可。

## 许可

- 本站文本（除引用外）：CC BY-NC-SA 4.0
- 代码：MIT
- 知乎回答：著作权属于原作者，本站为评论、研究与存档目的引用，保留署名与原链接
- pinyin-pro：MIT

## 致谢

39 位知乎答主，以及 1956 年那场把能想到的问题都讨论过一遍的全国大讨论。

/* PINGLISH — converter UI. Requires assets/js/pinglish.js
   and (for Chinese input) assets/vendor/pinyin-pro.js. */
(function () {
  "use strict";

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function toneHtml(s) {
    return esc(s)
      .replace(/([0-4])(?![0-9])/g, '<span class="tone">$1</span>')
      .replace(/(')/g, '<span class="sep">$1</span>');
  }

  function plainToneHtml(s) {
    return esc(s);
  }

  function setStatus(el, text, isError) {
    if (!el) return;
    el.textContent = text;
    el.style.color = isError ? "var(--accent)" : "";
  }

  function hasEngine() {
    return typeof window.Pinglish !== "undefined";
  }

  function hasPinyinPro() {
    return typeof window.pinyinPro !== "undefined" && typeof window.pinyinPro.pinyin === "function";
  }

  function isCJK(ch) {
    return /[\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF]/.test(ch);
  }

  /* ------------------------------------------------------------- Chinese */

  function zhRows(text) {
    if (!hasPinyinPro()) return [];
    var items;
    try {
      items = window.pinyinPro.pinyin(text, {
        toneType: "num",
        type: "all",
        nonZh: "consecutive"
      });
    } catch (e) { return []; }
    var rows = [];
    items.forEach(function (item) {
      if (item.isZh && item.pinyin) {
        var pg = "";
        try { pg = window.Pinglish.forwardSyllable(item.pinyin); } catch (e) { pg = "?"; }
        rows.push({
          han: item.origin,
          pinyin: window.Pinglish.toneMark(item.pinyin),
          pinyinNum: item.pinyin,
          pinglish: pg,
          tone: item.num
        });
      } else if (item.origin && item.origin.trim()) {
        rows.push({ han: item.origin, pinyin: "", pinyinNum: "", pinglish: item.origin, tone: "" });
      }
    });
    return rows;
  }

  function zhToPinglish(text) {
    if (!hasEngine()) throw new Error("Pinglish engine not loaded");
    if (!hasPinyinPro()) throw new Error("pinyin-pro not loaded");
    return window.Pinglish.chineseToPinglish(text);
  }

  /* --------------------------------------------------------------- render */

  function renderBreakdown(rows) {
    var host = $("#conv-breakdown");
    if (!host) return;
    if (!rows || !rows.length) { host.innerHTML = ""; return; }
    var html = '<div class="breakdown-row head"><span>汉字</span><span>拼音</span><span>Pinglish</span><span>调</span></div>';
    rows.slice(0, 80).forEach(function (r) {
      html += '<div class="breakdown-row">' +
        '<span class="han">' + esc(r.han) + '</span>' +
        '<span class="py">' + esc(r.pinyin || r.pinyinNum || "—") + '</span>' +
        '<span class="pg">' + esc(r.pinglish) + '</span>' +
        '<span class="mono muted">' + esc(r.tone === "" ? "" : r.tone) + '</span>' +
        '</div>';
    });
    if (rows.length > 80) {
      html += '<div class="breakdown-row"><span class="small muted" style="grid-column:1/-1">仅显示前 80 个音节。</span></div>';
    }
    host.innerHTML = html;
  }

  /* ---------------------------------------------------------------- mini */

  function initMini() {
    var root = $("#mini-converter");
    if (!root) return;
    var input = $("#mini-input", root);
    var output = $("#mini-output", root);
    var status = $("#mini-status", root);
    var run = $("#mini-run", root);
    var shuffle = $("#mini-shuffle", root);

    var examples = [
      "汉语拼音是一套注音方案",
      "我喜欢吃北京烤鸭",
      "吕先生和薛小姐去西安",
      "天安门广场上人很多",
      "重庆的火锅很辣",
      "女、绿、略、月、军、云",
      "西安不是先"
    ];
    var idx = 0;

    function convert() {
      var text = input.value.trim();
      if (!text) {
        output.innerHTML = '<span class="placeholder">等待输入……</span>';
        setStatus(status, "READY");
        return;
      }
      if (!hasEngine()) {
        output.innerHTML = '<span class="placeholder">转换引擎尚未加载。</span>';
        setStatus(status, "ENGINE MISSING", true);
        return;
      }
      if (!hasPinyinPro()) {
        output.innerHTML = '<span class="placeholder">pinyin-pro 尚未加载。</span>';
        setStatus(status, "LIBRARY MISSING", true);
        return;
      }
      try {
        var result = zhToPinglish(text);
        output.innerHTML = toneHtml(result);
        setStatus(status, "OK");
      } catch (e) {
        output.innerHTML = '<span class="placeholder">' + esc(e.message) + '</span>';
        setStatus(status, "ERROR", true);
      }
    }

    input.addEventListener("input", convert);
    run.addEventListener("click", convert);
    if (shuffle) {
      shuffle.addEventListener("click", function () {
        idx = (idx + 1) % examples.length;
        input.value = examples[idx];
        convert();
      });
    }
    convert();
  }

  /* ---------------------------------------------------------------- full */

  function initFull() {
    var root = $("#converter-app");
    if (!root) return;

    var mode = "zh";
    var input = $("#conv-input", root);
    var output = $("#conv-output", root);
    var status = $("#conv-status", root);
    var breakdown = $("#conv-breakdown", root);
    var toneToggle = $("#conv-tone", root);
    var swap = $("#conv-swap", root);
    var labelIn = $("#conv-label-in", root);
    var labelOut = $("#conv-label-out", root);
    var run = $("#conv-run", root);
    var copy = $("#conv-copy", root);

    var examples = {
      zh: [
        "汉语拼音是一套注音方案",
        "吕先生和薛小姐去西安",
        "我喜欢吃北京烤鸭",
        "重庆的火锅很辣",
        "女、绿、略、月、军、云"
      ],
      py: [
        "lü3 xue1 xi1 an1",
        "wo3 xi3 huan0 chi1 bei3 jing1 kao3 ya1",
        "nv3 lv4 lüe4 yue4 jun1 yun2",
        "han4 yu3 pin1 yin1"
      ],
      pl: [
        "lv3 hve1 hi1'an1",
        "uo3 hi3 huan0 chy1 bei3 ging1 kau3 ia1",
        "nv3 lv4 lve4 ve4 gvn1 vn2",
        "han4 v3 pin1 in1"
      ]
    };
    var exIndex = { zh: 0, py: 0, pl: 0 };

    var labels = {
      zh: { in: "中文 / 汉字", out: "Pinglish", ph: "输入一句中文，例如：吕先生和薛小姐去西安" },
      py: { in: "现行拼音 / 带调号或数字", out: "Pinglish", ph: "输入拼音，例如：lü3 xue1 xi1 an1" },
      pl: { in: "Pinglish", out: "现行拼音", ph: "输入 Pinglish，例如：lv3 hve1 hi1'an1" }
    };

    function setMode(next) {
      mode = next;
      $$("[data-mode]", root).forEach(function (b) {
        b.setAttribute("aria-selected", b.getAttribute("data-mode") === mode ? "true" : "false");
      });
      labelIn.textContent = labels[mode].in;
      labelOut.textContent = labels[mode].out;
      input.placeholder = labels[mode].ph;
      if (toneToggle) toneToggle.parentElement.style.display = mode === "pl" ? "" : "none";
      input.value = examples[mode][exIndex[mode]];
      convert();
    }

    function convert() {
      var text = input.value.trim();
      if (breakdown) breakdown.innerHTML = "";
      if (!text) {
        output.innerHTML = '<span class="placeholder">输出会出现在这里。</span>';
        setStatus(status, "READY");
        return;
      }
      if (!hasEngine()) {
        output.innerHTML = '<span class="placeholder">转换引擎尚未加载。</span>';
        setStatus(status, "ENGINE MISSING", true);
        return;
      }
      try {
        if (mode === "zh") {
          if (!hasPinyinPro()) throw new Error("pinyin-pro 尚未加载");
          var pg = zhToPinglish(text);
          output.innerHTML = toneHtml(pg);
          renderBreakdown(zhRows(text));
        } else if (mode === "py") {
          var pg2 = window.Pinglish.toPinglish(text);
          output.innerHTML = toneHtml(pg2);
          renderBreakdown(window.Pinglish.toPinglishSyllables(text).map(function (s) {
            return { han: "", pinyin: window.Pinglish.toneMark(s.pinyin + (s.tone == null ? "" : s.tone)), pinyinNum: s.pinyin + (s.tone == null ? "" : s.tone), pinglish: s.pinglish, tone: s.tone || "" };
          }));
        } else {
          var marks = toneToggle ? toneToggle.checked : true;
          var py = window.Pinglish.toPinyin(text, { toneMarks: marks });
          output.innerHTML = plainToneHtml(py);
          renderBreakdown(window.Pinglish.toPinyinSyllables(text).map(function (s) {
            return { han: "", pinyin: marks ? window.Pinglish.toneMark(s.pinyin + (s.tone == null ? "" : s.tone)) : s.pinyin + (s.tone == null ? "" : s.tone), pinyinNum: s.pinyin + (s.tone == null ? "" : s.tone), pinglish: s.pinglish, tone: s.tone || "" };
          }));
        }
        setStatus(status, "OK");
      } catch (e) {
        output.innerHTML = '<span class="placeholder">' + esc(e.message) + '</span>';
        setStatus(status, "ERROR", true);
      }
    }

    $$("[data-mode]", root).forEach(function (btn) {
      btn.addEventListener("click", function () { setMode(btn.getAttribute("data-mode")); });
    });

    input.addEventListener("input", convert);
    if (run) run.addEventListener("click", convert);
    if (toneToggle) toneToggle.addEventListener("change", convert);

    if (swap) {
      swap.addEventListener("click", function () {
        if (mode === "zh") setMode("py");
        else if (mode === "py") setMode("pl");
        else setMode("zh");
      });
    }

    $$("[data-example]", root).forEach(function (btn) {
      btn.addEventListener("click", function () {
        var list = examples[mode];
        exIndex[mode] = (exIndex[mode] + 1) % list.length;
        input.value = list[exIndex[mode]];
        convert();
      });
    });

    if (copy) {
      copy.setAttribute("data-copy", "#conv-output");
    }

    setMode("zh");
  }

  /* ---------------------------------------------------------------- boot */

  function boot() {
    // Wait one tick so deferred vendor scripts can land.
    initMini();
    initFull();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

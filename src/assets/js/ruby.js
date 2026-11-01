/* PINGLISH — three-layer ruby stacks.
   Requires pinyin-pro and Pinglish to be loaded first. */
(function () {
  "use strict";

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function diff(a, b) {
    var m = a.length, n = b.length;
    var dp = [];
    for (var i = 0; i <= m; i++) {
      dp[i] = [];
      for (var j = 0; j <= n; j++) dp[i][j] = 0;
    }
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        if (a.charAt(i - 1) === b.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1] + 1;
        else dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
    var out = [];
    i = m; j = n;
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && a.charAt(i - 1) === b.charAt(j - 1)) {
        out.push({ type: "same", text: a.charAt(i - 1) }); i--; j--;
      } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
        out.push({ type: "ins", text: b.charAt(j - 1) }); j--;
      } else {
        out.push({ type: "del", text: a.charAt(i - 1) }); i--;
      }
    }
    return out.reverse();
  }

  function ruleFor(py, tone) {
    if (py.indexOf("üe") !== -1) return "üe → ve";
    if (py.indexOf("üan") !== -1) return "üan → ven";
    if (py.indexOf("ün") !== -1) return "ün → vn";
    if (py.indexOf("ü") !== -1) return "ü → v";
    if (/^[jqx]ue$/.test(py)) return "üe → ve";
    if (/^[jqx]uan$/.test(py)) return "üan → ven";
    if (/^[jqx]un$/.test(py)) return "ün → vn";
    if (/^[jqx]u$/.test(py)) return "ü → v";
    if (/^[jqx]/.test(py)) return "j/q/x → g/k/h";
    if (/^(zhi|chi|shi|ri|zi|ci|si)$/.test(py)) return "舌尖 -i → y";
    if (/^[bpmf]o$/.test(py)) return "o → uo";
    if (py.indexOf("ao") !== -1) return "ao → au";
    if (py.indexOf("ong") !== -1) return "ong → ung";
    if (py.indexOf("ian") !== -1) return "ian → ien";
    if (py.indexOf("iu") !== -1) return "iu → iou";
    if (py.indexOf("ui") !== -1) return "ui → uei";
    if (py.indexOf("un") !== -1) return "un → uen";
    if (/^[yw]/.test(py)) return "零声母 → 韵母";
    if (tone !== "") return "声调 → 数字";
    return "同形";
  }

  function makeCell(hanzi, pinyinNum) {
    var pinglish = "";
    try { pinglish = window.Pinglish.forwardSyllable(pinyinNum); }
    catch (e) { pinglish = pinyinNum; }

    var pyBase = pinyinNum.replace(/[0-5]$/, "");
    var pgBase = pinglish.replace(/[0-5]$/, "");
    var tone = (pinglish.match(/([0-5])$/) || [])[1] || "";
    var pyDisplay = window.Pinglish.toneMark(pinyinNum);
    var changed = pyBase !== pgBase;
    var segments = diff(pyBase, pgBase);

    var plHtml = "";
    segments.forEach(function (seg) {
      if (seg.type === "same") plHtml += esc(seg.text);
      else if (seg.type === "ins") plHtml += "<ins>" + esc(seg.text) + "</ins>";
    });
    if (tone !== "") plHtml += '<span class="tone">' + esc(tone) + "</span>";

    var cell = document.createElement("span");
    cell.className = "ruby-cell" + (changed ? " is-changed" : "");
    cell.tabIndex = 0;
    cell.setAttribute("data-rule", ruleFor(pyBase, tone));
    cell.setAttribute("aria-label", hanzi + "：拼音 " + pyDisplay + "，Pinglish " + pinglish);
    cell.innerHTML =
      '<span class="ruby-py">' + esc(pyDisplay) + "</span>" +
      '<span class="ruby-hz">' + esc(hanzi) + "</span>" +
      '<span class="ruby-pl">' + plHtml + "</span>";
    return cell;
  }

  function makeLiteral(text, punct) {
    var cell = document.createElement("span");
    cell.className = "ruby-cell" + (punct ? " ruby-cell--punct" : "");
    cell.innerHTML =
      '<span class="ruby-py"></span>' +
      '<span class="ruby-hz">' + esc(text) + "</span>" +
      '<span class="ruby-pl"></span>';
    return cell;
  }

  function render(el) {
    var text = el.getAttribute("data-ruby") || el.textContent || "";
    text = text.trim();
    if (!text) return;
    if (!window.pinyinPro || !window.Pinglish) {
      el.textContent = text;
      return;
    }

    var items;
    try {
      items = window.pinyinPro.pinyin(text, {
        toneType: "num",
        type: "all",
        nonZh: "consecutive"
      });
    } catch (e) {
      el.textContent = text;
      return;
    }

    el.innerHTML = "";
    items.forEach(function (item) {
      if (item.isZh && item.pinyin) {
        el.appendChild(makeCell(item.origin, item.pinyin));
      } else if (item.origin && item.origin.trim() !== "") {
        el.appendChild(makeLiteral(item.origin, /[，。！？、；：,.!?;:]/.test(item.origin)));
      } else {
        var space = document.createElement("span");
        space.className = "ruby-space";
        space.textContent = " ";
        el.appendChild(space);
      }
    });
  }

  function bindToggles() {
    document.querySelectorAll("[data-ruby-toggle]").forEach(function (group) {
      var target = document.querySelector(group.getAttribute("data-target"));
      if (!target) return;
      var buttons = group.querySelectorAll("[data-view]");
      Array.prototype.forEach.call(buttons, function (btn) {
        btn.addEventListener("click", function () {
          target.setAttribute("data-view", btn.getAttribute("data-view"));
          Array.prototype.forEach.call(buttons, function (b) {
            b.setAttribute("aria-pressed", b === btn ? "true" : "false");
          });
        });
      });
    });
  }

  function init() {
    document.querySelectorAll("[data-ruby]").forEach(render);
    bindToggles();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.PinglishRuby = { render: render, init: init };
})();

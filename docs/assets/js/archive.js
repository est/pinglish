/* PINGLISH — archive browser. Requires assets/data/archive.json. */
(function () {
  "use strict";

  var grid = document.getElementById("archive-grid");
  var empty = document.getElementById("archive-empty");
  var countEl = document.getElementById("archive-count");
  var searchEl = document.getElementById("archive-search");
  var sortEl = document.getElementById("archive-sort");
  var chips = document.getElementById("archive-chips");
  var randomBtn = document.getElementById("archive-random");

  if (!grid) return;

  var state = { q: "", stance: "all", sort: "votes" };
  var all = [];
  var meta = null;
  var bodyCache = {};

  var STANCE_LABELS = {
    testimony: "名字的代价",
    reform: "改良方案",
    defend: "维持与正名",
    history: "历史与制度",
    detail: "细节与教学"
  };

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function stripTags(html) {
    var div = document.createElement("div");
    div.innerHTML = html || "";
    return (div.textContent || div.innerText || "").replace(/\s+/g, " ");
  }

  function fmt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function searchText(a) {
    return (a.author + " " + a.excerpt + " " + stripTags(a.bodyHtml)).toLowerCase();
  }

  function prepare(list) {
    return list.map(function (a) {
      var copy = {};
      for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
      copy._search = searchText(a);
      return copy;
    });
  }

  function filtered() {
    var q = state.q.trim().toLowerCase();
    var list = all.filter(function (a) {
      if (state.stance !== "all" && a.stance !== state.stance) return false;
      if (!q) return true;
      return a._search.indexOf(q) !== -1;
    });
    if (state.sort === "votes") {
      list.sort(function (a, b) { return b.votes - a.votes || a.id - b.id; });
    } else if (state.sort === "date-desc") {
      list.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)) || b.votes - a.votes; });
    } else if (state.sort === "date-asc") {
      list.sort(function (a, b) { return String(a.date).localeCompare(String(b.date)) || b.votes - a.votes; });
    }
    return list;
  }

  function card(a) {
    var el = document.createElement("article");
    el.className = "answer-card";
    el.id = "answer-" + a.id;
    el.setAttribute("data-id", a.id);
    el.innerHTML =
      '<div class="answer-head">' +
        '<div>' +
          '<div class="answer-author">' + esc(a.author) + '</div>' +
          '<div class="answer-meta" style="margin-top:6px">' + esc(a.date) + ' · ' + esc(a.stanceLabel || STANCE_LABELS[a.stance] || "") + '</div>' +
        '</div>' +
        '<div class="answer-votes">' + fmt(a.votes) + '<small>赞同</small></div>' +
      '</div>' +
      '<p class="answer-excerpt">' + esc(a.excerpt) + '</p>' +
      '<div class="answer-actions">' +
        '<button class="btn btn--sm" type="button" data-expand>展开全文</button>' +
        '<a class="link-arrow" href="' + esc(a.url) + '" target="_blank" rel="noopener">知乎原回答</a>' +
      '</div>' +
      '<div class="answer-body prose" data-body></div>';

    var body = el.querySelector("[data-body]");
    var btn = el.querySelector("[data-expand]");
    var expanded = false;

    function expand(shouldScroll) {
      if (!expanded) {
        if (!bodyCache[a.id]) {
          var html = a.bodyHtml || "";
          var tmp = document.createElement("div");
          tmp.innerHTML = html;
          // External links open in a new tab; images lazy-load.
          Array.prototype.forEach.call(tmp.querySelectorAll("a[href]"), function (link) {
            var href = link.getAttribute("href") || "";
            if (/^https?:/i.test(href)) {
              link.setAttribute("target", "_blank");
              link.setAttribute("rel", "noopener");
            }
          });
          Array.prototype.forEach.call(tmp.querySelectorAll("img"), function (img) {
            img.setAttribute("loading", "lazy");
          });
          bodyCache[a.id] = tmp.innerHTML;
        }
        body.innerHTML = bodyCache[a.id];
        expanded = true;
        el.classList.add("is-expanded");
        btn.textContent = "收起";
      } else {
        el.classList.remove("is-expanded");
        btn.textContent = "展开全文";
        expanded = false;
      }
      if (shouldScroll && expanded) {
        setTimeout(function () {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 30);
      }
    }

    btn.addEventListener("click", function () { expand(false); });
    el.addEventListener("dblclick", function (e) {
      if (e.target.closest("a, button")) return;
      expand(false);
    });
    el._expand = expand;
    return el;
  }

  function render() {
    var list = filtered();
    grid.innerHTML = "";
    list.forEach(function (a) { grid.appendChild(card(a)); });
    if (countEl) countEl.textContent = "显示 " + list.length + " / " + all.length;
    if (empty) empty.hidden = list.length !== 0;
    // Re-open the hash target after re-render.
    handleHash(false);
  }

  function handleHash(scroll) {
    var hash = decodeURIComponent(location.hash || "");
    var m = hash.match(/^#answer-(\d+)$/);
    if (!m) return;
    var id = Number(m[1]);
    var el = document.getElementById("answer-" + id);
    if (!el) return;
    if (el._expand) el._expand(scroll !== false);
  }

  function bindMeta() {
    if (!meta) return;
    var count = document.querySelector('[data-stat="count"]');
    var votes = document.querySelector('[data-stat="votes"]');
    var years = document.querySelector('[data-stat="years"]');
    var stances = document.querySelector('[data-stat="stances"]');
    if (count) count.textContent = fmt(meta.count);
    if (votes) votes.textContent = fmt(meta.totalVotes);
    if (years && meta.dateRange && meta.dateRange.length === 2) {
      years.textContent = String(Number(meta.dateRange[1].slice(0, 4)) - Number(meta.dateRange[0].slice(0, 4)));
    }
    if (stances) stances.textContent = "5";

    var counts = { all: all.length, testimony: 0, reform: 0, defend: 0, history: 0, detail: 0 };
    all.forEach(function (a) { if (counts[a.stance] != null) counts[a.stance] += 1; });
    document.querySelectorAll("[data-count]").forEach(function (el) {
      var key = el.getAttribute("data-count");
      if (counts[key] != null) el.textContent = counts[key];
    });
  }

  function bindControls() {
    var t = null;
    if (searchEl) {
      searchEl.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () {
          state.q = searchEl.value;
          render();
        }, 120);
      });
    }

    if (sortEl) {
      sortEl.addEventListener("change", function () {
        state.sort = sortEl.value;
        render();
      });
    }

    if (chips) {
      chips.addEventListener("click", function (e) {
        var btn = e.target.closest("[data-stance]");
        if (!btn) return;
        state.stance = btn.getAttribute("data-stance");
        Array.prototype.forEach.call(chips.querySelectorAll("[data-stance]"), function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        render();
      });
    }

    if (randomBtn) {
      randomBtn.addEventListener("click", function () {
        var list = filtered();
        if (!list.length) return;
        var pick = list[Math.floor(Math.random() * list.length)];
        var el = document.getElementById("answer-" + pick.id);
        if (!el) return;
        if (el._expand) el._expand(true);
      });
    }

    window.addEventListener("hashchange", function () { handleHash(true); });
  }

  fetch("assets/data/archive.json", { cache: "no-cache" })
    .then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    })
    .then(function (data) {
      meta = data.meta;
      all = prepare(data.answers || []);
      bindMeta();
      bindControls();
      render();
    })
    .catch(function (err) {
      grid.innerHTML = "";
      if (empty) {
        empty.hidden = false;
        empty.textContent = "档案数据未能载入：" + err.message + "。如果你在本地直接打开文件，请用本地服务器（例如 python3 -m http.server）访问。";
      }
      if (countEl) countEl.textContent = "ERROR";
    });
})();

/* PINGLISH — English archive browser. Requires assets/data/archive-en.json. */
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

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function fmt(n) {
    return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function prepare(list) {
    return list.map(function (a) {
      var copy = {};
      for (var k in a) if (Object.prototype.hasOwnProperty.call(a, k)) copy[k] = a[k];
      copy._search = (a.author + " " + a.summary + " " + a.stanceLabel).toLowerCase();
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
          '<div class="answer-meta" style="margin-top:6px">' + esc(a.date) + ' · ' + esc(a.stanceLabel) + '</div>' +
        '</div>' +
        '<div class="answer-votes">' + fmt(a.votes) + '<small>upvotes</small></div>' +
      '</div>' +
      '<p class="answer-excerpt">' + esc(a.summary) + '</p>' +
      '<div class="answer-actions">' +
        '<a class="btn btn--sm" href="' + esc(a.zhAnchor) + '">Read the full answer (Chinese)</a>' +
        '<a class="link-arrow" href="' + esc(a.url) + '" target="_blank" rel="noopener">Original on Zhihu</a>' +
      '</div>';
    return el;
  }

  function render() {
    var list = filtered();
    grid.innerHTML = "";
    list.forEach(function (a) { grid.appendChild(card(a)); });
    if (countEl) countEl.textContent = "Showing " + list.length + " of " + all.length;
    if (empty) empty.hidden = list.length !== 0;
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

  function handleHash() {
    var m = decodeURIComponent(location.hash || "").match(/^#answer-(\d+)$/);
    if (!m) return;
    var el = document.getElementById("answer-" + m[1]);
    if (!el) return;
    setTimeout(function () {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.animate(
        [{ outline: "2px solid transparent" }, { outline: "2px solid var(--accent)" }, { outline: "2px solid transparent" }],
        { duration: 1600, easing: "ease" }
      );
    }, 60);
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
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.animate(
          [{ outline: "2px solid transparent" }, { outline: "2px solid var(--accent)" }, { outline: "2px solid transparent" }],
          { duration: 1600, easing: "ease" }
        );
      });
    }
  }

  fetch("../assets/data/archive-en.json", { cache: "no-cache" })
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
      handleHash();
      window.addEventListener("hashchange", handleHash);
    })
    .catch(function (err) {
      grid.innerHTML = "";
      if (empty) {
        empty.hidden = false;
        empty.textContent = "The archive could not load: " + err.message + ". If you opened the file directly, serve the site over HTTP (for example, python3 -m http.server).";
      }
      if (countEl) countEl.textContent = "ERROR";
    });
})();

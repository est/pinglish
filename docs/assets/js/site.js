/* PINGLISH — shared site behavior. No dependencies. */
(function () {
  "use strict";

  // ---------------------------------------------------------------- theme
  var root = document.documentElement;
  var stored = null;
  try { stored = localStorage.getItem("pinglish-theme"); } catch (e) {}
  var prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (stored === "dark" || (!stored && prefersDark)) root.setAttribute("data-theme", "dark");

  function updateThemeButton() {
    var btn = document.querySelector("[data-theme-toggle]");
    if (!btn) return;
    var dark = root.getAttribute("data-theme") === "dark";
    btn.setAttribute("aria-label", dark ? "切换到浅色" : "切换到深色");
    btn.setAttribute("title", dark ? "切换到浅色" : "切换到深色");
    btn.innerHTML = dark
      ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"/></svg>'
      : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"/></svg>';
  }
  updateThemeButton();

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-theme-toggle]");
    if (!btn) return;
    var dark = root.getAttribute("data-theme") === "dark";
    if (dark) root.removeAttribute("data-theme");
    else root.setAttribute("data-theme", "dark");
    try { localStorage.setItem("pinglish-theme", dark ? "light" : "dark"); } catch (e2) {}
    updateThemeButton();
  });

  // --------------------------------------------------------------- reveal
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // ---------------------------------------------------------- current nav
  var path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a[href]").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.setAttribute("aria-current", "page");
    }
  });

  // ------------------------------------------------------ compare toggle
  document.querySelectorAll("[data-compare]").forEach(function (group) {
    var target = document.querySelector(group.getAttribute("data-compare"));
    if (!target) return;
    group.querySelectorAll("button[data-view]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        group.querySelectorAll("button[data-view]").forEach(function (b) {
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        var view = btn.getAttribute("data-view");
        var text = target.getAttribute("data-" + view);
        if (text == null) return;
        target.innerHTML = text;
      });
    });
  });

  // --------------------------------------------------------------- copy
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var sel = btn.getAttribute("data-copy");
    var el = document.querySelector(sel);
    if (!el) return;
    var text = el.innerText || el.textContent || "";
    var done = function () {
      var old = btn.getAttribute("data-label") || btn.textContent;
      btn.setAttribute("data-label", old);
      btn.textContent = "已复制";
      setTimeout(function () { btn.textContent = old; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, function () {});
    } else {
      var ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); done(); } catch (e2) {}
      document.body.removeChild(ta);
    }
  });

  // ------------------------------------------------------------- footer year
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();

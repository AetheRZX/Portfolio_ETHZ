/* Builds the pages from content.js. You normally don't need to edit this file. */
(function () {
  var $ = function (s) { return document.querySelector(s); };
  // On your own computer, missing pictures show a grey "drop file here" box.
  // On the live site, missing pictures are hidden.
  var DEV = /^(localhost|127\.0\.0\.1|\[::1\]|)$/.test(location.hostname);
  if (DEV) document.documentElement.classList.add("dev");

  function fmt(s) {
    return String(s == null ? "" : s).replace(/\[TODO:?\s*([^\]]*)\]/g, '<span class="todo">$1</span>');
  }
  function isTodo(s) { return /^\s*\[TODO/.test(s || ""); }

  /* ---------- theme ---------- */
  var SUN = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';
  function setThemeIcon() {
    var b = $("#theme-btn"); if (!b) return;
    var dark = document.documentElement.dataset.theme === "dark";
    b.innerHTML = dark ? SUN : MOON;
    b.setAttribute("aria-label", dark ? "Switch to light mode" : "Switch to dark mode");
  }
  function toggleTheme() {
    var next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    setThemeIcon();
  }

  function nav(onHome) {
    var p = onHome ? "" : "index.html";
    return '<nav class="pill"><a href="' + p + '#projects">Projects</a><a href="' + p + '#about">About</a>' +
      '<a class="cta" href="' + p + '#contact">Contact</a>' +
      '<button id="theme-btn" class="icon-btn" type="button"></button></nav>';
  }

  /* ---------- media: tries .mp4, then images; first file found wins ---------- */
  var IMG = [".jpg", ".png", ".webp", ".gif", ".jpeg", ".svg"];
  function done(el, ok) {
    el.classList.add(ok ? "has-media" : "no-media");
    var sec = el.closest("[data-media-only]");
    if (!ok && sec && !sec.querySelector(".media:not(.no-media)")) sec.classList.add("empty");
  }
  function loadImg(el, bases, i, j) {
    if (i >= bases.length) return done(el, false);
    if (j >= IMG.length) return loadImg(el, bases, i + 1, 0);
    var img = new Image();
    img.alt = el.dataset.alt || "";
    img.onload = function () { el.prepend(img); done(el, true); };
    img.onerror = function () { loadImg(el, bases, i, j + 1); };
    img.src = bases[i] + IMG[j];
  }
  /* videos only play while on screen (saves bandwidth with many clips on one page) */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      var v = e.target;
      if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
    });
  }, { threshold: 0.25 }) : null;
  function makeVideo(src) {
    var v = document.createElement("video");
    v.muted = true; v.loop = true; v.playsInline = true; v.controls = true; v.preload = "metadata";
    v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
    if (io) io.observe(v); else v.autoplay = true;
    v.src = src;
    return v;
  }
  function fillMedia() {
    /* explicit file names, e.g. data-file="assets/bldc/setup.svg" */
    document.querySelectorAll(".media[data-file]").forEach(function (el) {
      var f = el.dataset.file;
      if (/\.(mp4|webm|mov)$/i.test(f)) {
        var v = makeVideo(f);
        var poster = el.dataset.poster; if (poster) v.poster = poster;
        v.addEventListener("loadeddata", function () { el.prepend(v); done(el, true); }, { once: true });
        v.addEventListener("error", function () { done(el, false); }, { once: true });
      } else {
        var img = new Image(); img.alt = el.dataset.alt || "";
        img.onload = function () { el.prepend(img); done(el, true); };
        img.onerror = function () { done(el, false); };
        img.src = f;
      }
    });
    document.querySelectorAll(".media[data-src]").forEach(function (el) {
      var bases = el.dataset.src.split("|");
      if (!el.hasAttribute("data-video")) return loadImg(el, bases, 0, 0);
      var v = document.createElement("video");
      v.muted = true; v.loop = true; v.autoplay = true; v.playsInline = true; v.controls = true;
      v.setAttribute("muted", ""); v.setAttribute("playsinline", "");
      v.addEventListener("loadeddata", function () { el.prepend(v); done(el, true); }, { once: true });
      v.addEventListener("error", function () { loadImg(el, bases, 0, 0); }, { once: true });
      var probe = new Image(); probe.onload = function () { v.poster = probe.src; }; probe.src = bases[0] + ".jpg";
      v.src = bases[0] + ".mp4";
    });
  }
  function media(src, alt, hint, opts) {
    opts = opts || {};
    var attr = /\.[a-z0-9]{2,4}$/i.test(src) ? ' data-file="' + src + '"' : ' data-src="' + src + '"';
    return '<div class="media ' + (opts.cls || "") + '"' + (opts.video ? " data-video" : "") +
      attr + (opts.poster ? ' data-poster="' + opts.poster + '"' : "") +
      ' data-alt="' + String(alt).replace(/<[^>]+>|"/g, "") + '">' +
      (hint ? '<div class="ph"><span>' + hint + "</span></div>" : "") + "</div>";
  }

  /* ---------- HOME ---------- */
  function buttons(P, includeProjects) {
    return [
      ["LinkedIn", P.linkedin], ["GitHub", P.github],
      includeProjects ? ["Projects", "#projects"] : null,
      ["Resume", P.resume], includeProjects ? null : ["Email", "mailto:" + P.email],
    ].filter(function (b) { return b && b[1]; })
      .map(function (b) { return '<a class="btn" href="' + b[1] + '">' + b[0] + "</a>"; }).join("");
  }

  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  var SHOWN = PROJECTS.filter(function (p) { return !p.hidden; });

  function renderHome() {
    var P = PROFILE;
    var cards = SHOWN.map(function (p) {
      return '<a class="card" href="project.html?p=' + p.id + '">' +
        media(p.cover ? "assets/" + p.id + "/" + p.cover : "assets/" + p.id + "/cover|assets/" + p.id + "/hero", p.title, "assets/" + p.id + "/cover.jpg") +
        '<div class="card-row"><h3>' + fmt(p.title) + '</h3><span class="year">' + fmt(p.year) + "</span></div>" +
        '<p class="card-tag">' + fmt(p.tag) + "</p></a>";
    }).join("");
    var others = (typeof OTHER_PROJECTS !== "undefined" ? OTHER_PROJECTS : []).map(function (o) {
      var tag = o.link ? "a" : "div";
      return "<" + tag + ' class="mini"' + (o.link ? ' href="' + o.link + '" target="_blank" rel="noopener"' : "") + ">" +
        media("assets/other/" + (o.img || o.id), o.title, "assets/other/" + (o.img || o.id + ".jpg")) +
        '<div class="mini-row"><h3>' + fmt(o.title) + (o.link ? " ↗" : "") + '</h3><span class="year">' + fmt(o.year) + "</span></div>" +
        '<p class="mini-where">' + fmt(o.where) + "</p>" +
        "<p>" + fmt(o.text) + "</p></" + tag + ">";
    }).join("");
    var list = function (arr) {
      return arr.map(function (e) {
        return '<li><div><span class="what">' + fmt(e.what) + '</span><span class="where">' + fmt(e.where) + '</span></div><span class="when">' + fmt(e.when) + "</span></li>";
      }).join("");
    };
    var skills = Object.keys(SKILLS).map(function (k) { return "<dt>" + k + "</dt><dd>" + fmt(SKILLS[k]) + "</dd>"; }).join("");

    $("#app").innerHTML =
      nav(true) +
      '<header class="hero" id="top">' +
        media("assets/me", P.fullName, "assets/me.jpg", { cls: "photo" }) +
        '<div class="hero-text">' +
          media("assets/deco-1", "", "", { cls: "deco d1" }) +
          media("assets/deco-2", "", "", { cls: "deco d2" }) +
          media("assets/deco-3", "", "", { cls: "deco d3" }) +
          "<h1>I'm " + P.name + (P.role ? ",<br>" + fmt(P.role) : "") + ".</h1>" +
          P.intro.map(function (t) { return "<p>" + fmt(t) + "</p>"; }).join("") +
          '<div class="stack">' + buttons(P, true) + "</div>" +
        "</div>" +
      "</header>" +
      '<section id="projects" class="section"><h2 class="center">Projects</h2><div class="grid">' + cards + "</div></section>" +
      (others ? '<section id="other" class="section"><h2 class="center">Other Projects</h2><div class="minis">' + others + "</div></section>" : "") +
      '<section id="about" class="section narrow">' +
        '<h2 class="center">About</h2>' +
        '<h4>Experience</h4><ul class="timeline">' + list(EXPERIENCE) + "</ul>" +
        '<h4>Education</h4><ul class="timeline">' + list(EDUCATION) + "</ul>" +
        '<h4>Publications</h4><ol class="pubs">' + PUBLICATIONS.map(function (x) { return "<li>" + fmt(x) + "</li>"; }).join("") + "</ol>" +
        '<h4>Skills</h4><dl class="skills">' + skills + "</dl>" +
      "</section>" +
      '<section id="contact" class="section narrow contact">' +
        "<h2>Let's talk</h2>" +
        '<p><a class="big-link" href="mailto:' + P.email + '">' + P.email + "</a></p>" +
        '<div class="btns">' + buttons(P, false) + "</div>" +
      "</section>" +
      "<footer>© " + P.fullName + " · " + new Date().getFullYear() + "</footer>";
  }

  /* ---------- PROJECT PAGE ---------- */
  function renderProject() {
    var id = new URLSearchParams(location.search).get("p");
    var idx = SHOWN.findIndex(function (x) { return x.id === id; });
    if (idx < 0) { location.replace("index.html"); return; }
    var p = SHOWN[idx];
    document.title = p.title.replace(/<[^>]+>/g, "") + " | " + PROFILE.fullName;

    var links = (p.links || []).map(function (l) {
      return isTodo(l.url) ? '<span class="btn">' + l.label + " " + fmt(l.url) + "</span>"
        : '<a class="btn" href="' + l.url + '" target="_blank" rel="noopener">' + l.label + " ↗</a>";
    }).join("");

    var sections = (p.sections || []).map(function (s) {
      var m = s.media || [];
      var pics = m.map(function (name) {
        var path = "assets/" + p.id + "/" + name;
        var hint = /\./.test(name) ? path : path + ".jpg / .mp4";
        var poster = /\.mp4$/.test(name) && name === "hero.mp4" ? "assets/" + p.id + "/hero.jpg" : "";
        return media(path, s.h, hint, { video: true, poster: poster });
      }).join("");
      var cols = s.cols || m.length;
      var code = s.code ? '<figure class="code">' + (s.code.file ? "<figcaption>" + esc(s.code.file) + "</figcaption>" : "") +
        '<pre><code class="language-' + (s.code.lang || "python") + '">' + esc(s.code.src.replace(/^\n+|\s+$/g, "")) + "</code></pre></figure>" : "";
      var onlyMedia = !s.text && m.length && !code;
      return '<section class="psec"' + (onlyMedia ? " data-media-only" : "") + ">" +
        (s.h ? "<h2>" + fmt(s.h) + "</h2>" : "") +
        (s.text ? "<p>" + fmt(s.text) + "</p>" : "") +
        (pics ? '<div class="pics n' + cols + (s.narrow ? " narrow" : "") + '">' + pics + "</div>" : "") +
        (s.caption ? '<p class="caption">' + fmt(s.caption) + "</p>" : "") +
        code +
        "</section>";
    }).join("");

    var prev = SHOWN[(idx - 1 + SHOWN.length) % SHOWN.length];
    var next = SHOWN[(idx + 1) % SHOWN.length];

    $("#app").innerHTML =
      nav(false) +
      '<article class="project">' +
        "<h1>" + fmt(p.title) + "</h1>" +
        '<p class="meta">' + fmt(p.year) + " &nbsp;·&nbsp; " + fmt(p.tag) + "</p>" +
        (links ? '<div class="btns">' + links + "</div>" : "") +
        '<p class="intro">' + fmt(p.intro) + "</p>" +
        sections +
        '<nav class="pager">' +
          '<a href="project.html?p=' + prev.id + '"><span>← Previous</span>' + fmt(prev.title) + "</a>" +
          '<a class="r" href="project.html?p=' + next.id + '"><span>Next →</span>' + fmt(next.title) + "</a>" +
        "</nav>" +
      "</article>" +
      "<footer>© " + PROFILE.fullName + " · " + new Date().getFullYear() + "</footer>";
  }

  if (document.body.dataset.page === "project") renderProject(); else renderHome();
  fillMedia();
  if (window.hljs) document.querySelectorAll("pre code").forEach(function (b) { window.hljs.highlightElement(b); });
  setThemeIcon();
  var tb = $("#theme-btn"); if (tb) tb.addEventListener("click", toggleTheme);
  if (location.hash) { var t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }
})();

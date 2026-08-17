/* ==========================================================================
   PRAGATI ACADEMY — Marketing site renderers
   Runs synchronously at end of <body> so motion.js and ui.js pick the
   injected markup up in their own DOMContentLoaded pass.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.DATA, U = window.UI;
  if (!D) return;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var inr = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };

  function icon(n) { return '<i data-i="' + n + '"></i>'; }

  /* ---------- Program cards ------------------------------------------------ */
  function programCard(p, i) {
    var left = p.seats - p.filled;
    return '' +
    '<a class="pcard" href="' + p.href + '" data-rise style="--d:' + (i * 70) + 'ms;--acc:' + p.accent + '">' +
      (left <= 20 ? '<span class="pcard-seats">' + left + ' seats left</span>' : '') +
      '<div class="pcard-top">' +
        '<div class="pcard-code"><span>' + p.code + '</span><span>' + p.level + '</span></div>' +
        '<div class="pcard-t">' + p.name + '</div>' +
        '<div class="pcard-tag">' +
          '<span class="chip">' + p.duration + '</span>' +
          '<span class="chip">' + p.mode + '</span>' +
        '</div>' +
      '</div>' +
      '<div class="pcard-body">' +
        '<p class="pcard-desc">' + p.desc + '</p>' +
        '<dl class="pcard-meta">' +
          '<div class="pm"><dt>Next batch</dt><dd>' + p.batch + '</dd></div>' +
          '<div class="pm"><dt>Subjects</dt><dd>' + p.subjects.length + ' streams</dd></div>' +
        '</dl>' +
        '<div class="pcard-foot">' +
          '<span class="pcard-fee"><b>' + inr(p.fee) + '</b><span>Program fee</span></span>' +
          '<span class="pcard-go">' + icon('arrowUR') + '</span>' +
        '</div>' +
      '</div>' +
    '</a>';
  }

  var cards = $('#programCards');
  if (cards) cards.innerHTML = D.programs.map(programCard).join('');

  var grid = $('#programGrid');
  if (grid) grid.innerHTML = D.programs.map(programCard).join('');

  /* ---------- Results ------------------------------------------------------- */
  var rg = $('#resultGrid');
  if (rg) {
    rg.innerHTML = D.results.map(function (r, i) {
      return '<div class="res" data-rise style="--d:' + (i * 90) + 'ms">' +
        '<span class="res-demo">DEMO</span>' +
        '<div class="res-v num">' + r.v + '</div>' +
        '<div class="res-l">' + r.l + '</div>' +
        '<div class="res-n">' + r.n + '</div>' +
      '</div>';
    }).join('');
  }

  /* ---------- Faculty ------------------------------------------------------- */
  var fg = $('#facultyGrid');
  if (fg) {
    fg.innerHTML = D.faculty.map(function (f, i) {
      return '<article class="fac" data-rise style="--d:' + (i * 80) + 'ms" tabindex="0">' +
        '<div class="fac-portrait">' + U.portrait(f.seed + f.name) + '</div>' +
        '<div class="fac-info">' +
          '<div class="fac-name">' + f.name + '</div>' +
          '<div class="fac-role">' + f.role + '</div>' +
          '<div class="fac-stats">' +
            '<div class="fs-i"><b>' + f.exp + '</b><span>Experience</span></div>' +
            '<div class="fs-i"><b>' + f.students + '</b><span>Mentored</span></div>' +
            '<div class="fs-i"><b>' + f.spec.split(',')[0] + '</b><span>Focus</span></div>' +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ---------- Student life -------------------------------------------------- */
  var lg = $('#lifeGrid');
  if (lg) {
    var scenes = ['Doubt Desk', 'Silent Floor', 'Mock Hall', 'Library'];
    lg.innerHTML = scenes.map(function (s, i) {
      return '<figure class="life-c" data-zoom style="--d:' + (i * 90) + 'ms">' +
        U.scene(s + i, s.toUpperCase()) +
        '<figcaption class="life-cap">' + s + '</figcaption>' +
      '</figure>';
    }).join('');
  }

  /* ---------- Testimonials -------------------------------------------------- */
  var tg = $('#testimonialGrid');
  if (tg) {
    tg.innerHTML = D.testimonials.map(function (t, i) {
      return '<article class="tst" data-rise style="--d:' + (i * 100) + 'ms">' +
        '<p class="tst-q">' + t.q + '</p>' +
        '<div class="tst-who">' +
          '<span class="tst-av">' + U.portrait(t.seed + t.n) + '</span>' +
          '<span><span class="tst-n">' + t.n + '</span><span class="tst-m">' + t.m + '</span></span>' +
          '<span class="chip chip-gold tst-badge">' + t.badge + '</span>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ---------- Journal -------------------------------------------------------- */
  var jl = $('#journalList');
  if (jl) {
    jl.innerHTML = D.journal.map(function (j, i) {
      return '<a class="jr-item" href="#resources" data-rise style="--d:' + (i * 80) + 'ms">' +
        '<span class="jr-i">0' + (i + 1) + '</span>' +
        '<span class="jr-t">' + j.t + '</span>' +
        '<span class="jr-m">' + j.c + ' · ' + j.d + ' · ' + j.r + '</span>' +
        '<span class="jr-go">' + icon('arrowUR') + '</span>' +
      '</a>';
    }).join('');
  }

  /* ---------- About media ---------------------------------------------------- */
  var am = $('#aboutMedia');
  if (am) am.innerHTML = U.scene('pragati-campus-2016', 'GOMTI NAGAR');

  /* ---------- Anchor-aware nav highlight ------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var ids = ['results', 'faculty', 'life', 'about', 'resources'];
    var links = {};
    ids.forEach(function (id) {
      var a = document.querySelector('.nav-link[href="#' + id + '"]');
      if (a) links[id] = a;
    });
    if (!Object.keys(links).length) return;
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var a = links[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].classList.remove('active'); });
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ids.forEach(function (id) {
      var s = document.getElementById(id);
      if (s) obs.observe(s);
    });
  });

  /* ---------- Program-card accent follows the pointer -------------------------- */
  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest('.pcard, .plat-c');
    if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
    c.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
  }, { passive: true });
})();

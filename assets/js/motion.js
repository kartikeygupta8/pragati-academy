/* ==========================================================================
   PRAGATI ACADEMY — Motion engine
   Scroll reveal · split text · counters · magnetic cursor · parallax
   marquee · tilt · carousel · page transitions
   Dependency-free. ~1 rAF loop for everything pointer/scroll driven.
   ========================================================================== */
(function () {
  'use strict';

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COARSE = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  var lerp = function (a, b, t) { return a + (b - a) * t; };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  var M = window.Motion = {};

  /* ---------------------------------------------------------------------
     1. SPLIT TEXT — wraps [data-split] into animatable line/word/char units
     --------------------------------------------------------------------- */
  function splitText(el) {
    var mode = el.getAttribute('data-split') || 'word';
    var stagger = parseFloat(el.getAttribute('data-stagger')) || (mode === 'char' ? 26 : 70);
    var base = parseFloat(el.getAttribute('data-delay')) || 0;

    if (mode === 'line') {
      // Explicit lines are authored as <span> children
      var kids = Array.prototype.slice.call(el.children);
      if (!kids.length) {
        kids = el.textContent.split('\n').filter(function (s) { return s.trim(); });
        el.innerHTML = '';
        kids.forEach(function (t) {
          var s = document.createElement('span');
          s.textContent = t.trim();
          el.appendChild(s);
        });
        kids = Array.prototype.slice.call(el.children);
      }
      kids.forEach(function (k, i) {
        var line = document.createElement('span');
        line.className = 'sp-line';
        var inner = document.createElement('span');
        inner.className = 'sp-inner';
        inner.style.setProperty('--d', (base + i * stagger) + 'ms');
        while (k.firstChild) inner.appendChild(k.firstChild);
        // preserve any classes authored on the line
        if (k.className) inner.className += ' ' + k.className;
        line.appendChild(inner);
        el.replaceChild(line, k);
      });
      return;
    }

    var text = el.textContent;
    el.innerHTML = '';
    var idx = 0;

    if (mode === 'char') {
      text.split('').forEach(function (ch) {
        if (ch === ' ') { el.appendChild(document.createTextNode(' ')); return; }
        var s = document.createElement('span');
        s.className = 'sp-char';
        s.textContent = ch;
        s.style.setProperty('--d', (base + idx * stagger) + 'ms');
        idx++;
        el.appendChild(s);
      });
      return;
    }

    text.split(/\s+/).filter(Boolean).forEach(function (w, i) {
      var span = document.createElement('span');
      span.className = 'sp-word';
      var inner = document.createElement('i');
      inner.textContent = w;
      inner.style.setProperty('--d', (base + i * stagger) + 'ms');
      span.appendChild(inner);
      el.appendChild(span);
      el.appendChild(document.createTextNode(' '));
    });
  }

  M.splitAll = function (root) {
    (root || document).querySelectorAll('[data-split]:not([data-split-done])').forEach(function (el) {
      el.setAttribute('data-split-done', '');
      splitText(el);
    });
  };

  /* ---------------------------------------------------------------------
     2. REVEAL — one IntersectionObserver for every scroll-triggered thing
     --------------------------------------------------------------------- */
  var revealTargets = '[data-rise],[data-zoom],[data-clip],[data-draw],[data-split],[data-count],[data-reveal],[data-chart],[data-bar],[data-ring],[data-seq]';

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add('in');

      if (el.hasAttribute('data-count')) runCounter(el);
      if (el.hasAttribute('data-bar')) runBar(el);
      if (el.hasAttribute('data-ring')) runRing(el);
      if (el.hasAttribute('data-seq')) runSequence(el);
      if (el.hasAttribute('data-chart') && window.Charts) window.Charts.render(el);

      el.dispatchEvent(new CustomEvent('reveal'));
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  M.observe = function (root) {
    (root || document).querySelectorAll(revealTargets).forEach(function (el) {
      if (el.hasAttribute('data-obs')) return;
      el.setAttribute('data-obs', '');
      // Stagger children of a group
      if (el.hasAttribute('data-group')) {
        var step = parseFloat(el.getAttribute('data-group')) || 90;
        Array.prototype.forEach.call(el.children, function (c, i) {
          c.style.setProperty('--d', i * step + 'ms');
        });
      }
      io.observe(el);
    });
  };

  // Stagger a container's [data-rise] descendants automatically
  M.autoStagger = function (root) {
    (root || document).querySelectorAll('[data-stagger-kids]').forEach(function (p) {
      var step = parseFloat(p.getAttribute('data-stagger-kids')) || 80;
      p.querySelectorAll('[data-rise],[data-zoom],[data-clip]').forEach(function (c, i) {
        if (!c.style.getPropertyValue('--d')) c.style.setProperty('--d', i * step + 'ms');
      });
    });
  };

  /* ---------------------------------------------------------------------
     3. COUNTERS — eased number ramp with formatting
     --------------------------------------------------------------------- */
  function fmt(n, el) {
    var dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var s = n.toFixed(dec);
    if (el.hasAttribute('data-comma')) {
      var p = s.split('.');
      // Indian grouping when data-comma="in"
      if (el.getAttribute('data-comma') === 'in') {
        var x = p[0];
        var last3 = x.slice(-3);
        var rest = x.slice(0, -3);
        if (rest) last3 = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last3;
        p[0] = last3;
      } else {
        p[0] = p[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
      s = p.join('.');
    }
    return s;
  }

  function runCounter(el) {
    var to = parseFloat(el.getAttribute('data-count'));
    var from = parseFloat(el.getAttribute('data-from') || '0');
    var dur = parseFloat(el.getAttribute('data-dur') || '1800');
    var pre = el.getAttribute('data-pre') || '';
    var suf = el.getAttribute('data-suf') || '';
    if (RM) { el.textContent = pre + fmt(to, el) + suf; return; }
    var t0 = performance.now();
    (function tick(now) {
      var p = clamp((now - t0) / dur, 0, 1);
      var e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + fmt(from + (to - from) * e, el) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  }
  M.count = runCounter;

  /* ---------------------------------------------------------------------
     4. BARS & RINGS — progress primitives
     --------------------------------------------------------------------- */
  function runBar(el) {
    var v = parseFloat(el.getAttribute('data-bar')) || 0;
    var d = parseFloat(el.getAttribute('data-bar-delay') || '0');
    setTimeout(function () { el.style.setProperty('--v', v + '%'); }, RM ? 0 : d);
  }

  function runRing(el) {
    var v = clamp(parseFloat(el.getAttribute('data-ring')) || 0, 0, 100);
    var circle = el.querySelector('.ring-val');
    if (!circle) return;
    var r = circle.r.baseVal.value;
    var c = 2 * Math.PI * r;
    circle.style.strokeDasharray = c;
    circle.style.strokeDashoffset = c;
    requestAnimationFrame(function () {
      circle.style.transition = RM ? 'none' : 'stroke-dashoffset 1.5s cubic-bezier(.22,1,.36,1) ' + (el.getAttribute('data-ring-delay') || 0) + 'ms';
      circle.style.strokeDashoffset = c - (c * v) / 100;
    });
  }

  /* ---------------------------------------------------------------------
     5. SEQUENCE — timeline steps lighting up one after another, looping
     --------------------------------------------------------------------- */
  function runSequence(el) {
    var steps = el.querySelectorAll('[data-step]');
    if (!steps.length) return;
    var gap = parseFloat(el.getAttribute('data-seq')) || 900;
    var loop = el.hasAttribute('data-seq-loop');
    var i = 0;
    function fire() {
      steps.forEach(function (s, n) { s.classList.toggle('active', n <= i); s.classList.toggle('current', n === i); });
      i++;
      if (i < steps.length) { setTimeout(fire, gap); }
      else if (loop && !RM) {
        setTimeout(function () {
          steps.forEach(function (s) { s.classList.remove('active', 'current'); });
          i = 0; setTimeout(fire, 420);
        }, gap * 2.2);
      }
    }
    fire();
  }
  M.sequence = runSequence;

  /* ---------------------------------------------------------------------
     6. RAF LOOP — cursor, magnetics, parallax, scroll progress, nav state
     --------------------------------------------------------------------- */
  var mx = window.innerWidth / 2, my = window.innerHeight / 2;
  var cx = mx, cy = my, dx = mx, dy = my;
  var cursor = null, dot = null;
  var magnets = [], parallax = [], tilts = [];
  var prog = null, nav = null, lastY = 0, ticking = false;

  function collect() {
    magnets = Array.prototype.slice.call(document.querySelectorAll('[data-magnet]')).map(function (el) {
      return { el: el, x: 0, y: 0, tx: 0, ty: 0, s: parseFloat(el.getAttribute('data-magnet')) || 0.34 };
    });
    parallax = Array.prototype.slice.call(document.querySelectorAll('[data-para]')).map(function (el) {
      return { el: el, s: parseFloat(el.getAttribute('data-para')) || 0.12, y: 0, ty: 0 };
    });
    tilts = Array.prototype.slice.call(document.querySelectorAll('[data-tilt]'));
    tilts.forEach(bindTilt);
  }

  function bindTilt(el) {
    if (el.__tilt) return;
    el.__tilt = true;
    var max = parseFloat(el.getAttribute('data-tilt')) || 8;
    el.style.transformStyle = 'preserve-3d';
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width - .5;
      var py = (e.clientY - r.top) / r.height - .5;
      el.style.transform = 'perspective(900px) rotateY(' + (px * max) + 'deg) rotateX(' + (-py * max) + 'deg) translateZ(0)';
      el.style.setProperty('--gx', (px * 100 + 50) + '%');
      el.style.setProperty('--gy', (py * 100 + 50) + '%');
    });
    el.addEventListener('pointerleave', function () {
      el.style.transition = 'transform .7s cubic-bezier(.22,1,.36,1)';
      el.style.transform = '';
      setTimeout(function () { el.style.transition = ''; }, 700);
    });
  }

  function loop() {
    // Cursor follow
    if (cursor) {
      cx = lerp(cx, mx, .16); cy = lerp(cy, my, .16);
      dx = lerp(dx, mx, .55); dy = lerp(dy, my, .55);
      cursor.style.transform = 'translate3d(' + cx + 'px,' + cy + 'px,0)';
      dot.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
    }
    // Magnetic buttons
    for (var i = 0; i < magnets.length; i++) {
      var m = magnets[i];
      var r = m.el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) { m.tx = 0; m.ty = 0; }
      else {
        var ox = mx - (r.left + r.width / 2);
        var oy = my - (r.top + r.height / 2);
        var dist = Math.hypot(ox, oy);
        var range = Math.max(r.width, r.height) * 1.15;
        if (dist < range) { m.tx = ox * m.s; m.ty = oy * m.s; }
        else { m.tx = 0; m.ty = 0; }
      }
      m.x = lerp(m.x, m.tx, .16); m.y = lerp(m.y, m.ty, .16);
      if (Math.abs(m.x) > .05 || Math.abs(m.y) > .05) {
        m.el.style.transform = 'translate3d(' + m.x.toFixed(2) + 'px,' + m.y.toFixed(2) + 'px,0)';
      } else { m.el.style.transform = ''; }
    }
    // Parallax
    var vh = window.innerHeight;
    for (var j = 0; j < parallax.length; j++) {
      var p = parallax[j];
      var pr = p.el.getBoundingClientRect();
      if (pr.bottom < -300 || pr.top > vh + 300) continue;
      var center = pr.top + pr.height / 2 - vh / 2;
      p.ty = -center * p.s;
      p.y = lerp(p.y, p.ty, .1);
      p.el.style.transform = 'translate3d(0,' + p.y.toFixed(2) + 'px,0)';
    }
    requestAnimationFrame(loop);
  }

  function onScroll() {
    var y = window.scrollY;
    if (prog) {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      prog.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    }
    if (nav) {
      nav.classList.toggle('stuck', y > 24);
      if (y > 460 && y > lastY + 4) nav.classList.add('hide');
      else if (y < lastY - 4) nav.classList.remove('hide');
    }
    var sc = document.querySelector('.sticky-cta');
    if (sc) sc.classList.toggle('show', y > 520);
    lastY = y;
    ticking = false;
  }

  /* ---------------------------------------------------------------------
     7. MARQUEE — seamless infinite ticker, scroll-velocity aware
     --------------------------------------------------------------------- */
  M.marquee = function (root) {
    (root || document).querySelectorAll('[data-marquee]:not([data-mq-done])').forEach(function (el) {
      el.setAttribute('data-mq-done', '');
      var track = el.firstElementChild;
      if (!track) return;
      var speed = parseFloat(el.getAttribute('data-marquee')) || 40; // px/sec
      var dir = el.hasAttribute('data-reverse') ? -1 : 1;
      var clone = track.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      el.appendChild(clone);
      var w = track.scrollWidth;
      // Duplicate until wider than viewport twice over
      while (w < window.innerWidth * 1.4) {
        el.appendChild(track.cloneNode(true));
        el.appendChild(clone.cloneNode(true));
        w = track.scrollWidth * (el.children.length / 2);
        if (el.children.length > 12) break;
      }
      if (RM) return;
      var x = 0, last = performance.now();
      (function step(now) {
        var dt = Math.min(64, now - last); last = now;
        x -= dir * speed * dt / 1000;
        var span = track.scrollWidth;
        if (x <= -span) x += span;
        if (x > 0) x -= span;
        el.style.setProperty('--mq', x.toFixed(2) + 'px');
        requestAnimationFrame(step);
      })(last);
    });
  };

  /* ---------------------------------------------------------------------
     8. CAROUSEL — drag / wheel / snap with momentum + progress
     --------------------------------------------------------------------- */
  M.carousel = function (el) {
    if (!el || el.__car) return;
    el.__car = true;
    var track = el.querySelector('[data-car-track]');
    if (!track) return;
    var prev = el.querySelector('[data-car-prev]');
    var next = el.querySelector('[data-car-next]');
    var bar = el.querySelector('[data-car-bar]');
    var down = false, sx = 0, sl = 0, moved = 0;

    function step() {
      var card = track.firstElementChild;
      if (!card) return 400;
      var gap = parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0) || 0;
      return card.getBoundingClientRect().width + gap;
    }
    function upd() {
      var max = track.scrollWidth - track.clientWidth;
      if (bar) bar.style.transform = 'scaleX(' + (max > 0 ? clamp(track.scrollLeft / max, 0, 1) : 1) + ')';
      if (prev) prev.disabled = track.scrollLeft < 4;
      if (next) next.disabled = track.scrollLeft > max - 4;
    }
    if (prev) prev.addEventListener('click', function () { track.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { track.scrollBy({ left: step(), behavior: 'smooth' }); });
    track.addEventListener('scroll', upd, { passive: true });

    track.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'touch') return;
      down = true; moved = 0;
      sx = e.clientX; sl = track.scrollLeft;
      track.classList.add('dragging');
      track.setPointerCapture(e.pointerId);
    });
    track.addEventListener('pointermove', function (e) {
      if (!down) return;
      var d = e.clientX - sx;
      moved = Math.abs(d);
      track.scrollLeft = sl - d;
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      track.addEventListener(ev, function () {
        if (!down) return;
        down = false;
        track.classList.remove('dragging');
      });
    });
    track.addEventListener('click', function (e) { if (moved > 8) { e.preventDefault(); e.stopPropagation(); } }, true);
    upd();
    window.addEventListener('resize', upd);
  };

  /* ---------------------------------------------------------------------
     9. PAGE TRANSITIONS — curtain out on nav, curtain in on load
     --------------------------------------------------------------------- */
  function initTransitions() {
    var curtain = document.querySelector('.curtain');
    if (!curtain) return;
    if (!RM) {
      curtain.classList.add('in');
      setTimeout(function () { curtain.classList.remove('in'); }, 950);
    }
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (!a || RM) return;
      var href = a.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') ||
          a.target === '_blank' || a.hasAttribute('data-no-trans') || e.metaKey || e.ctrlKey) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname) return;
      e.preventDefault();
      curtain.classList.remove('in');
      curtain.classList.add('out');
      setTimeout(function () { location.href = a.href; }, 520);
    });
    window.addEventListener('pageshow', function (ev) {
      if (ev.persisted) { curtain.classList.remove('out', 'in'); }
    });
  }

  /* ---------------------------------------------------------------------
     10. PRELOADER
     --------------------------------------------------------------------- */
  function initPreloader() {
    var pre = document.querySelector('.preloader');
    if (!pre) return;
    var barEl = pre.querySelector('.pre-bar i');
    var pctEl = pre.querySelector('.pre-pct');
    var p = 0;
    var iv = setInterval(function () {
      p = Math.min(96, p + Math.random() * 22 + 6);
      if (barEl) barEl.style.width = p + '%';
      if (pctEl) pctEl.textContent = String(Math.round(p)).padStart(3, '0');
    }, 130);
    function finish() {
      clearInterval(iv);
      if (barEl) barEl.style.width = '100%';
      if (pctEl) pctEl.textContent = '100';
      setTimeout(function () {
        pre.classList.add('done');
        document.body.classList.add('loaded');
        document.dispatchEvent(new CustomEvent('pragati:ready'));
      }, 340);
    }
    if (document.readyState === 'complete') setTimeout(finish, 420);
    else window.addEventListener('load', function () { setTimeout(finish, 320); });
    setTimeout(finish, 3200); // hard cap
  }

  /* ---------------------------------------------------------------------
     11. NAV / MENU / MISC UI
     --------------------------------------------------------------------- */
  function initNav() {
    nav = document.querySelector('.nav');
    var burger = document.querySelector('.burger');
    var mmenu = document.querySelector('.mmenu');
    if (burger && mmenu) {
      burger.addEventListener('click', function () {
        var open = document.body.classList.toggle('menu-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = open ? 'hidden' : '';
        mmenu.querySelectorAll('.mm-link').forEach(function (l, i) {
          l.style.transitionDelay = open ? (120 + i * 55) + 'ms' : '0ms';
        });
      });
      mmenu.addEventListener('click', function (e) {
        if (e.target.closest('a')) {
          document.body.classList.remove('menu-open');
          document.body.style.overflow = '';
        }
      });
    }
    // Mark active nav item
    var here = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link[href]').forEach(function (a) {
      var t = a.getAttribute('href').split('#')[0];
      if (t && t === here) a.classList.add('active');
    });
  }

  function initCursor() {
    if (COARSE || RM) return;
    cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.innerHTML = '<span class="c-label"></span>';
    dot = document.createElement('div');
    dot.className = 'cursor-dot';
    document.body.appendChild(cursor);
    document.body.appendChild(dot);

    var label = cursor.querySelector('.c-label');
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest('[data-cursor]');
      if (t) {
        label.textContent = t.getAttribute('data-cursor');
        document.body.classList.add('cur-label');
        document.body.classList.remove('cur-hover');
        return;
      }
      document.body.classList.remove('cur-label');
      document.body.classList.toggle('cur-hover',
        !!e.target.closest('a, button, [role="button"], input, select, textarea, .card-hov, [data-tilt]'));
    });
    document.addEventListener('pointerleave', function () {
      cursor.style.opacity = '0'; dot.style.opacity = '0';
    });
    document.addEventListener('pointerenter', function () {
      cursor.style.opacity = ''; dot.style.opacity = '';
    });
  }

  /* Tabs: [data-tabs] container, [data-tab="id"] buttons, [data-pane="id"] panes */
  M.tabs = function (root) {
    (root || document).querySelectorAll('[data-tabs]:not([data-tabs-done])').forEach(function (box) {
      box.setAttribute('data-tabs-done', '');
      var btns = box.querySelectorAll('[data-tab]');
      var panes = box.querySelectorAll('[data-pane]');
      var ink = box.querySelector('[data-tab-ink]');
      function moveInk(btn) {
        if (!ink || !btn) return;
        var pr = btn.parentElement.getBoundingClientRect();
        var br = btn.getBoundingClientRect();
        ink.style.transform = 'translateX(' + (br.left - pr.left) + 'px)';
        ink.style.width = br.width + 'px';
      }
      function go(id, btn) {
        btns.forEach(function (b) {
          var on = b.getAttribute('data-tab') === id;
          b.classList.toggle('active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
        panes.forEach(function (p) {
          var on = p.getAttribute('data-pane') === id;
          if (on) {
            p.hidden = false;
            requestAnimationFrame(function () { p.classList.add('active'); });
            M.observe(p);
            M.splitAll(p);
            if (window.Charts) window.Charts.scan(p);
          } else {
            p.classList.remove('active');
            p.hidden = true;
          }
        });
        moveInk(btn);
      }
      btns.forEach(function (b) {
        b.addEventListener('click', function () { go(b.getAttribute('data-tab'), b); });
      });
      var first = box.querySelector('[data-tab].active') || btns[0];
      if (first) { go(first.getAttribute('data-tab'), first); setTimeout(function () { moveInk(first); }, 60); }
      window.addEventListener('resize', function () { moveInk(box.querySelector('[data-tab].active')); });
    });
  };

  /* Accordion: [data-acc] wrapper > [data-acc-item] > button + panel */
  M.accordion = function (root) {
    (root || document).querySelectorAll('[data-acc]:not([data-acc-done])').forEach(function (acc) {
      acc.setAttribute('data-acc-done', '');
      var single = acc.getAttribute('data-acc') !== 'multi';
      acc.querySelectorAll('[data-acc-item]').forEach(function (item) {
        var head = item.querySelector('[data-acc-head]');
        var panel = item.querySelector('[data-acc-panel]');
        if (!head || !panel) return;
        head.addEventListener('click', function () {
          var open = item.classList.contains('open');
          if (single) {
            acc.querySelectorAll('[data-acc-item].open').forEach(function (o) {
              o.classList.remove('open');
              var p = o.querySelector('[data-acc-panel]');
              if (p) p.style.maxHeight = '';
              var h = o.querySelector('[data-acc-head]');
              if (h) h.setAttribute('aria-expanded', 'false');
            });
          }
          if (!open) {
            item.classList.add('open');
            panel.style.maxHeight = panel.scrollHeight + 'px';
            head.setAttribute('aria-expanded', 'true');
          } else {
            item.classList.remove('open');
            panel.style.maxHeight = '';
            head.setAttribute('aria-expanded', 'false');
          }
        });
      });
    });
  };

  /* Copy-to-clipboard + toast */
  M.toast = function (msg, kind) {
    var t = document.querySelector('.toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'toast';
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.className = 'toast show' + (kind ? ' toast-' + kind : '');
    clearTimeout(t.__h);
    t.__h = setTimeout(function () { t.classList.remove('show'); }, 2800);
  };

  /* ---------------------------------------------------------------------
     12. BOOT
     --------------------------------------------------------------------- */
  function boot() {
    initPreloader();
    initNav();
    initCursor();
    initTransitions();
    prog = document.querySelector('.scroll-prog');

    M.splitAll();
    M.autoStagger();
    M.observe();
    M.marquee();
    M.tabs();
    M.accordion();
    document.querySelectorAll('[data-carousel]').forEach(M.carousel);
    collect();

    window.addEventListener('pointermove', function (e) { mx = e.clientX; my = e.clientY; }, { passive: true });
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
    }, { passive: true });
    window.addEventListener('resize', function () { collect(); }, { passive: true });
    onScroll();
    requestAnimationFrame(loop);

    // Hero elements animate immediately (no scroll needed)
    document.querySelectorAll('[data-hero]').forEach(function (el, i) {
      setTimeout(function () { el.classList.add('in'); }, 260 + i * 60);
    });

    // Re-scan helper for dynamically injected markup
    M.refresh = function (root) {
      M.splitAll(root); M.autoStagger(root); M.observe(root);
      M.tabs(root); M.accordion(root); collect();
      if (window.Charts) window.Charts.scan(root);
    };
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

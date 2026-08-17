/* ==========================================================================
   PRAGATI ACADEMY — Shared UI
   Icon set · generated portraits & avatars · enquiry modal · helpers
   ========================================================================== */
(function () {
  'use strict';

  var UI = window.UI = {};

  /* ---------- Icons ------------------------------------------------------- */
  var P = {
    arrow:      'M5 12h14M13 6l6 6-6 6',
    arrowUR:    'M7 17 17 7M9 7h8v8',
    arrowL:     'M19 12H5M11 18l-6-6 6-6',
    arrowUp:    'M12 19V5M6 11l6-6 6 6',
    arrowDown:  'M12 5v14M18 13l-6 6-6-6',
    chevR:      'M9 6l6 6-6 6',
    chevD:      'M6 9l6 6 6-6',
    close:      'M18 6 6 18M6 6l12 12',
    check:      'M4 12.5 9 17.5 20 6.5',
    plus:       'M12 5v14M5 12h14',
    search:     'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-4.35-4.35',
    bell:       'M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
    user:       'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z',
    users:      'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
    grid:       'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
    list:       'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
    calendar:   'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z',
    chat:       'M21 11.5a8.4 8.4 0 0 1-9 8.4 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.1a8.4 8.4 0 0 1-.9-3.8 8.4 8.4 0 0 1 8.4-9 8.4 8.4 0 0 1 8.6 8.4Z',
    phone:      'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z',
    file:       'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8',
    settings:   'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z',
    chart:      'M3 3v18h18M7 15l4-5 3 3 5-7',
    bars:       'M12 20V10M18 20V4M6 20v-4',
    bolt:       'M13 2 3 14h8l-1 8 10-12h-8l1-8Z',
    clock:      'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 6v6l4 2',
    archive:    'M21 8v13H3V8M1 3h22v5H1zM10 12h4',
    wallet:     'M20 12V8H6a2 2 0 0 1 0-4h12v4M4 6v12a2 2 0 0 0 2 2h14v-4M18 12a2 2 0 0 0 0 4h4v-4h-4Z',
    target:     'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12ZM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z',
    book:       'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z',
    cap:        'M22 10 12 5 2 10l10 5 10-5ZM6 12v5c3 3 9 3 12 0v-5',
    play:       'M6 4l14 8-14 8V4Z',
    star:       'm12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.9-6.2-3.3-6.2 3.3L7 14.2l-5-4.9 6.9-1L12 2Z',
    award:      'M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM8.2 13.9 7 22l5-3 5 3-1.2-8.1',
    layers:     'm12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5',
    spark:      'M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    atom:       'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM20.2 20.2c2-2-1-8.2-6.6-13.8S3.8 1.8 1.8 3.8s1 8.2 6.6 13.8 9.8 4.6 11.8 2.6ZM1.8 20.2c-2-2 1-8.2 6.6-13.8S20.2 1.8 22.2 3.8s-1 8.2-6.6 13.8-9.8 4.6-11.8 2.6Z',
    flask:      'M9 2v7L3.5 19A2 2 0 0 0 5.3 22h13.4a2 2 0 0 0 1.8-3L15 9V2M8 2h8M7.5 15h9',
    leaf:       'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8a7 7 0 0 1-7 7h-3ZM2 21c0-3 2.9-5.9 5-7',
    test:       'M9 2h6v3H9zM7 5h10a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2ZM9 12h6M9 16h4',
    mail:       'M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2ZM22 7l-10 6L2 7',
    pin:        'M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 1 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z',
    filter:     'M22 3H2l8 9.5V19l4 2v-8.5L22 3Z',
    download:   'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3',
    menu:       'M3 12h18M3 6h18M3 18h18',
    trend:      'M23 6l-9.5 9.5-5-5L1 18M17 6h6v6',
    logout:     'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
    shield:     'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z',
    zap:        'M4 14h7l-1 8 10-12h-7l1-8-10 12Z',
    send:       'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z',
    refresh:    'M23 4v6h-6M1 20v-6h6M3.5 9a9 9 0 0 1 14.9-3.4L23 10M1 14l4.6 4.4A9 9 0 0 0 20.5 15'
  };

  UI.icon = function (name, cls) {
    var d = P[name] || P.arrow;
    return '<svg class="' + (cls || 'ico') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + d + '"/></svg>';
  };

  /* Replace <i data-i="name"></i> placeholders anywhere in the DOM */
  UI.icons = function (root) {
    (root || document).querySelectorAll('[data-i]').forEach(function (n) {
      var name = n.getAttribute('data-i');
      n.outerHTML = UI.icon(name, n.className || 'ico');
    });
  };

  /* ---------- Deterministic colour from a string ---------------------------- */
  var PAL = ['#241CE0', '#FF4D18', '#0FB981', '#B0801E', '#0E86C4', '#A855F7', '#C13584', '#0E9E6E'];
  function hash(s) {
    var h = 0;
    for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
  }
  UI.colorOf = function (s) { return PAL[hash(String(s)) % PAL.length]; };

  UI.initials = function (name) {
    var p = String(name).replace(/^(Dr|Prof|Mr|Ms|Mrs|Mohd)\.?\s+/i, '').trim().split(/\s+/);
    return ((p[0] || '')[0] + (p.length > 1 ? (p[p.length - 1] || '')[0] : '')).toUpperCase();
  };

  UI.avatar = function (name, cls) {
    var c = UI.colorOf(name);
    return '<span class="avatar ' + (cls || '') + '" style="background:' + c + '" aria-hidden="true">' +
      UI.initials(name) + '</span>';
  };

  /* ---------- Generated portrait -------------------------------------------
     A stylised editorial portrait built from geometry. Used in place of stock
     photography so nothing here can be mistaken for a real person.
     -------------------------------------------------------------------- */
  UI.portrait = function (seed, opts) {
    opts = opts || {};
    var h = hash(String(seed));
    var hue1 = h % 360;
    var hue2 = (hue1 + 42 + (h % 40)) % 360;
    var id = 'p' + (h % 99999);
    var sat = opts.mono ? 8 : 62;
    var tilt = ((h >> 3) % 9) - 4;
    var hairStyle = h % 4;

    var hair = [
      '<path d="M92 118c0-42 24-66 58-66s58 24 58 66c0 6-4 8-6 2-6-16-22-26-52-26s-46 10-52 26c-2 6-6 4-6-2Z" fill="url(#h' + id + ')"/>',
      '<path d="M88 126c-4-52 26-78 62-78s66 26 62 78c-1 10-7 10-9 1-4-22-10-34-18-38-10 12-38 16-62 6-14-6-22 6-26 32-2 9-8 9-9-1Z" fill="url(#h' + id + ')"/>',
      '<path d="M94 116c0-40 22-64 56-64s56 24 56 64c0 8-5 9-8 2-8-18-24-24-48-24s-40 6-48 24c-3 7-8 6-8-2Z" fill="url(#h' + id + ')"/><path d="M86 108c8-6 14 4 12 22-2 16-6 34-12 40-8-18-8-52 0-62Z" fill="url(#h' + id + ')"/><path d="M214 108c-8-6-14 4-12 22 2 16 6 34 12 40 8-18 8-52 0-62Z" fill="url(#h' + id + ')"/>',
      '<path d="M90 122c0-46 26-70 60-70s60 24 60 70c0 6-5 7-7 1-8-20-26-30-53-30s-45 10-53 30c-2 6-7 5-7-1Z" fill="url(#h' + id + ')"/>'
    ][hairStyle];

    return '' +
    '<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<defs>' +
        '<linearGradient id="b' + id + '" x1="0" y1="0" x2="1" y2="1">' +
          '<stop offset="0%" stop-color="hsl(' + hue1 + ',' + sat + '%,26%)"/>' +
          '<stop offset="100%" stop-color="hsl(' + hue2 + ',' + (sat - 14) + '%,12%)"/>' +
        '</linearGradient>' +
        '<linearGradient id="s' + id + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="hsl(' + hue1 + ',34%,72%)"/>' +
          '<stop offset="100%" stop-color="hsl(' + hue1 + ',30%,52%)"/>' +
        '</linearGradient>' +
        '<linearGradient id="h' + id + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="hsl(' + hue2 + ',26%,20%)"/>' +
          '<stop offset="100%" stop-color="hsl(' + hue2 + ',30%,9%)"/>' +
        '</linearGradient>' +
        '<pattern id="d' + id + '" width="7" height="7" patternUnits="userSpaceOnUse">' +
          '<circle cx="1.6" cy="1.6" r="1.1" fill="hsl(' + hue1 + ',60%,68%)" opacity=".2"/>' +
        '</pattern>' +
      '</defs>' +
      '<rect width="300" height="400" fill="url(#b' + id + ')"/>' +
      '<rect width="300" height="400" fill="url(#d' + id + ')"/>' +
      '<circle cx="' + (150 + tilt * 4) + '" cy="118" r="120" fill="hsl(' + hue1 + ',48%,54%)" opacity=".14"/>' +
      '<g transform="rotate(' + tilt + ' 150 200)">' +
        '<path d="M150 236c-52 0-84 30-92 76-2 12-2 60-2 88h188c0-28 0-76-2-88-8-46-40-76-92-76Z" fill="url(#s' + id + ')" opacity=".95"/>' +
        '<path d="M150 236c-14 0-26 2-36 6l36 46 36-46c-10-4-22-6-36-6Z" fill="hsl(' + hue1 + ',20%,94%)" opacity=".9"/>' +
        '<rect x="126" y="196" width="48" height="60" rx="24" fill="hsl(' + hue1 + ',30%,58%)"/>' +
        '<ellipse cx="150" cy="150" rx="56" ry="66" fill="url(#s' + id + ')"/>' +
        hair +
        '<ellipse cx="130" cy="152" rx="5" ry="6" fill="hsl(' + hue2 + ',30%,16%)" opacity=".8"/>' +
        '<ellipse cx="170" cy="152" rx="5" ry="6" fill="hsl(' + hue2 + ',30%,16%)" opacity=".8"/>' +
        '<path d="M138 180c7 6 17 6 24 0" stroke="hsl(' + hue2 + ',30%,18%)" stroke-width="3.4" stroke-linecap="round" fill="none" opacity=".65"/>' +
      '</g>' +
      '<rect width="300" height="400" fill="url(#b' + id + ')" opacity=".14"/>' +
    '</svg>';
  };

  /* Scene illustration for student-life / about panels */
  UI.scene = function (seed, label) {
    var h = hash(String(seed));
    var hue = h % 360;
    var id = 'sc' + (h % 99999);
    var bars = '';
    for (var i = 0; i < 9; i++) {
      var bh = 30 + ((h >> (i + 1)) % 130);
      bars += '<rect x="' + (18 + i * 31) + '" y="' + (330 - bh) + '" width="19" height="' + bh + '" rx="8" fill="hsl(' + ((hue + i * 14) % 360) + ',56%,' + (50 + (i % 3) * 8) + '%)" opacity="' + (0.28 + (i % 4) * 0.14) + '"/>';
    }
    return '<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0%" stop-color="hsl(' + hue + ',54%,24%)"/><stop offset="100%" stop-color="hsl(' + ((hue + 50) % 360) + ',46%,10%)"/>' +
      '</linearGradient></defs>' +
      '<rect width="300" height="400" fill="url(#' + id + ')"/>' +
      '<circle cx="' + (60 + h % 180) + '" cy="' + (80 + h % 100) + '" r="96" fill="hsl(' + hue + ',70%,60%)" opacity=".2"/>' +
      bars +
      '<g opacity=".5" stroke="hsl(' + hue + ',40%,88%)" stroke-width="1.2" fill="none">' +
      '<path d="M0 356h300M0 372h300"/></g>' +
      (label ? '<text x="20" y="52" font-family="Sora, sans-serif" font-size="15" font-weight="700" letter-spacing="2" fill="hsl(' + hue + ',30%,92%)" opacity=".8">' + label + '</text>' : '') +
      '</svg>';
  };

  /* ---------- Enquiry modal --------------------------------------------------- */
  UI.modal = function () {
    var m = document.querySelector('.modal');
    if (!m) return;
    var box = m.querySelector('.modal-box');
    var form = m.querySelector('form');
    var ok = m.querySelector('.form-ok');
    var last;

    function open(preset) {
      last = document.activeElement;
      m.classList.add('open');
      document.body.style.overflow = 'hidden';
      if (preset) {
        var sel = form && form.querySelector('[name=program]');
        if (sel) sel.value = preset;
      }
      setTimeout(function () {
        var f = m.querySelector('input, select');
        if (f) f.focus();
      }, 420);
    }
    function close() {
      m.classList.remove('open');
      document.body.style.overflow = '';
      if (last && last.focus) last.focus();
      setTimeout(function () {
        if (form) { form.hidden = false; form.reset(); }
        if (ok) ok.classList.remove('show');
      }, 460);
    }

    document.addEventListener('click', function (e) {
      var t = e.target.closest('[data-enquire]');
      if (t) { e.preventDefault(); open(t.getAttribute('data-enquire') || ''); return; }
      if (e.target.closest('.modal-x') || e.target.classList.contains('modal-bg')) { close(); }
    });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && m.classList.contains('open')) close(); });

    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = (form.querySelector('[name=name]') || {}).value || 'there';
        var btn = form.querySelector('button[type=submit]');
        if (btn) { btn.disabled = true; btn.textContent = 'SENDING…'; }
        setTimeout(function () {
          form.hidden = true;
          if (ok) {
            var who = ok.querySelector('[data-ok-name]');
            if (who) who.textContent = name.split(' ')[0];
            ok.classList.add('show');
          }
          if (btn) { btn.disabled = false; btn.textContent = 'SUBMIT ENQUIRY'; }
          if (window.Motion) window.Motion.toast('Enquiry recorded in the demo CRM as a new lead', 'ok');
        }, 900);
      });
    }
    UI.openEnquiry = open;
  };

  /* ---------- Small helpers ----------------------------------------------------- */
  UI.inr = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };
  UI.esc = function (s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  UI.el = function (tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  };

  /* Countdown to a target date, written into [data-countdown] */
  UI.countdown = function () {
    document.querySelectorAll('[data-countdown]').forEach(function (n) {
      var target = new Date(n.getAttribute('data-countdown')).getTime();
      function tick() {
        var diff = target - Date.now();
        if (diff <= 0) { n.textContent = 'Batch has started'; return; }
        var d = Math.floor(diff / 864e5), h = Math.floor(diff / 36e5) % 24, mm = Math.floor(diff / 6e4) % 60;
        n.textContent = d + 'd ' + String(h).padStart(2, '0') + 'h ' + String(mm).padStart(2, '0') + 'm to go';
      }
      tick();
      setInterval(tick, 30000);
    });
  };

  function boot() {
    UI.icons();
    UI.modal();
    UI.countdown();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

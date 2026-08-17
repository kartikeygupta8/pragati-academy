/* ==========================================================================
   PRAGATI ACADEMY — Chart engine
   Hand-built animated SVG charts. No dependencies.

   Palettes validated with the six-checks validator:
     light  #3B2AE0,#E8410F,#0E9E6E,#B0801E,#0E86C4,#C13584  → ALL PASS
     dark   #7C6BFF,#E85B32,#16A277,#B08630,#2E93C0,#C4508F  → ALL PASS
   Categorical hues are assigned in fixed order and never cycled or re-ranked.

   Usage:  <figure data-chart='{"type":"line","series":[...]}'></figure>
   ========================================================================== */
(function () {
  'use strict';

  var RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var NS = 'http://www.w3.org/2000/svg';

  var CAT = {
    light: ['#3B2AE0', '#E8410F', '#0E9E6E', '#B0801E', '#0E86C4', '#C13584'],
    dark:  ['#7C6BFF', '#E85B32', '#16A277', '#B08630', '#2E93C0', '#C4508F']
  };
  // Sequential = one hue, light → dark
  var SEQ = {
    light: ['#E9E7FD', '#C9C4F7', '#9F96EE', '#7367E4', '#4A3BD8', '#2A1CB4'],
    dark:  ['#232244', '#2E2C63', '#3E3A8C', '#5049B8', '#6A61DC', '#8C84FF']
  };
  var STATUS = {
    good:     { light: '#0E9E6E', dark: '#16A277' },
    warning:  { light: '#B0801E', dark: '#B08630' },
    serious:  { light: '#E8410F', dark: '#E85B32' },
    critical: { light: '#B3200A', dark: '#D14A2E' }
  };
  var INK = {
    light: { t1: '#0A0D12', t2: '#4A5261', t3: '#79808F', grid: 'rgba(10,13,18,.09)', axis: 'rgba(10,13,18,.16)', surf: '#FFFFFF' },
    dark:  { t1: '#F7F5F0', t2: 'rgba(247,245,240,.68)', t3: 'rgba(247,245,240,.44)', grid: 'rgba(247,245,240,.10)', axis: 'rgba(247,245,240,.18)', surf: '#141922' }
  };

  function el(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    if (attrs) for (var k in attrs) if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function div(cls, parent, html) {
    var n = document.createElement('div');
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    if (parent) parent.appendChild(n);
    return n;
  }
  function nice(v) {
    if (v == null || isNaN(v)) return '—';
    return (Math.round(v * 100) / 100).toLocaleString('en-IN');
  }
  function niceMax(v) {
    if (v <= 0) return 10;
    var mag = Math.pow(10, Math.floor(Math.log10(v)));
    var n = v / mag;
    var step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
    return step * mag;
  }
  function theme(node) {
    return node.closest('.dark, [data-theme="dark"]') ? 'dark' : 'light';
  }

  /* ---------- Tooltip (single shared node) ------------------------------ */
  var tip;
  function getTip() {
    if (!tip) { tip = div('ch-tip'); document.body.appendChild(tip); }
    return tip;
  }
  function showTip(html, x, y) {
    var t = getTip();
    t.innerHTML = html;
    t.classList.add('show');
    var r = t.getBoundingClientRect();
    var left = Math.min(window.innerWidth - r.width - 10, Math.max(10, x - r.width / 2));
    var top = y - r.height - 14;
    if (top < 8) top = y + 20;
    t.style.transform = 'translate3d(' + left + 'px,' + top + 'px,0)';
  }
  function hideTip() { if (tip) tip.classList.remove('show'); }

  function tipRows(title, rows) {
    var h = '<div class="ch-tip-t">' + title + '</div>';
    rows.forEach(function (r) {
      h += '<div class="ch-tip-r"><span class="ch-sw" style="background:' + r.c + '"></span>' +
           '<span class="ch-tip-n">' + r.n + '</span><b class="num">' + r.v + '</b></div>';
    });
    return h;
  }

  /* ---------- Legend ---------------------------------------------------- */
  function legend(host, series, colors, mode) {
    if (series.length < 2) return; // one series is named by the title
    var l = div('ch-legend', host);
    series.forEach(function (s, i) {
      var it = div('ch-leg', l);
      it.innerHTML = '<span class="ch-sw" style="background:' + colors[i] + '"></span><span>' + s.name + '</span>';
    });
  }

  /* ======================================================================
     LINE / AREA
     ====================================================================== */
  function lineChart(host, cfg, mode) {
    var C = INK[mode], colors = cfg.colors || CAT[mode];
    var labels = cfg.labels || [];
    var series = cfg.series || [];
    var W = host.clientWidth || 640;
    var H = cfg.height || 260;
    var padL = cfg.padL != null ? cfg.padL : 40, padR = 16, padT = 16, padB = 30;
    var iw = W - padL - padR, ih = H - padT - padB;

    var allV = [];
    series.forEach(function (s) { s.data.forEach(function (v) { if (v != null) allV.push(v); }); });
    var lo = cfg.min != null ? cfg.min : Math.min.apply(null, allV);
    var hi = cfg.max != null ? cfg.max : niceMax(Math.max.apply(null, allV));
    if (cfg.min == null) lo = Math.max(0, Math.floor(lo * 0.82));
    if (hi === lo) hi = lo + 1;

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, class: 'ch-svg', role: 'img' }, host);
    var X = function (i) { return padL + (series[0].data.length > 1 ? (i / (series[0].data.length - 1)) * iw : iw / 2); };
    var Y = function (v) { return padT + ih - ((v - lo) / (hi - lo)) * ih; };

    // Grid + y labels (recessive)
    var ticks = cfg.ticks || 4;
    for (var t = 0; t <= ticks; t++) {
      var v = lo + (hi - lo) * (t / ticks);
      var y = Y(v);
      el('line', { x1: padL, x2: W - padR, y1: y, y2: y, stroke: C.grid, 'stroke-width': 1 }, svg);
      var lab = el('text', { x: padL - 9, y: y + 4, 'text-anchor': 'end', class: 'ch-ax' }, svg);
      lab.setAttribute('fill', C.t3);
      lab.textContent = cfg.yfmt === 'pct' ? Math.round(v) + '%' : nice(Math.round(v));
    }
    // X labels
    labels.forEach(function (L, i) {
      if (labels.length > 8 && i % 2) return;
      var tx = el('text', { x: X(i), y: H - 8, 'text-anchor': 'middle', class: 'ch-ax' }, svg);
      tx.setAttribute('fill', C.t3);
      tx.textContent = L;
    });

    var uid = 'g' + Math.random().toString(36).slice(2, 8);
    var defs = el('defs', null, svg);

    series.forEach(function (s, si) {
      var col = s.color || colors[si % colors.length];
      var pts = s.data.map(function (v, i) { return [X(i), Y(v)] });
      var d = smoothPath(pts, cfg.curve !== false);

      if (cfg.area !== false && (series.length === 1 || cfg.area === true)) {
        var grad = el('linearGradient', { id: uid + si, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
        el('stop', { offset: '0%', 'stop-color': col, 'stop-opacity': mode === 'dark' ? .34 : .22 }, grad);
        el('stop', { offset: '100%', 'stop-color': col, 'stop-opacity': 0 }, grad);
        var ad = d + ' L' + X(s.data.length - 1) + ',' + (padT + ih) + ' L' + X(0) + ',' + (padT + ih) + ' Z';
        var ar = el('path', { d: ad, fill: 'url(#' + uid + si + ')', class: 'ch-area' }, svg);
        ar.style.opacity = 0;
        if (!RM) { ar.style.transition = 'opacity .7s ease .55s'; requestAnimationFrame(function () { ar.style.opacity = 1; }); }
        else ar.style.opacity = 1;
      }

      var p = el('path', {
        d: d, fill: 'none', stroke: col, 'stroke-width': 2,
        'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'ch-line'
      }, svg);
      if (!RM) {
        var len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = len;
        p.style.transition = 'stroke-dashoffset 1.35s cubic-bezier(.22,1,.36,1) ' + (si * 130) + 'ms';
        requestAnimationFrame(function () { p.style.strokeDashoffset = 0; });
      }
      // End dot + direct label (selective labelling — last point only)
      var last = pts[pts.length - 1];
      var dot = el('circle', { cx: last[0], cy: last[1], r: 4, fill: col, stroke: C.surf, 'stroke-width': 2 }, svg);
      dot.style.opacity = 0;
      if (!RM) { dot.style.transition = 'opacity .4s ease ' + (900 + si * 130) + 'ms'; }
      requestAnimationFrame(function () { dot.style.opacity = 1; });
    });

    // Hover layer: crosshair + tooltip
    var cross = el('line', { y1: padT, y2: padT + ih, stroke: C.axis, 'stroke-width': 1, 'stroke-dasharray': '3 3', opacity: 0 }, svg);
    var marks = series.map(function (s, si) {
      return el('circle', { r: 5, fill: s.color || colors[si % colors.length], stroke: C.surf, 'stroke-width': 2, opacity: 0 }, svg);
    });
    var hit = el('rect', { x: padL, y: padT, width: Math.max(1, iw), height: ih, fill: 'transparent', style: 'cursor:crosshair' }, svg);
    hit.addEventListener('pointermove', function (e) {
      var r = svg.getBoundingClientRect();
      var px = (e.clientX - r.left) * (W / r.width);
      var n = series[0].data.length;
      var i = Math.round(((px - padL) / iw) * (n - 1));
      i = Math.max(0, Math.min(n - 1, i));
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('opacity', 1);
      var rows = series.map(function (s, si) {
        marks[si].setAttribute('cx', X(i));
        marks[si].setAttribute('cy', Y(s.data[i]));
        marks[si].setAttribute('opacity', 1);
        return { c: s.color || colors[si % colors.length], n: s.name, v: (cfg.yfmt === 'pct' ? s.data[i] + '%' : nice(s.data[i])) + (s.unit || '') };
      });
      showTip(tipRows(labels[i] || ('#' + (i + 1)), rows), e.clientX, r.top + Y(series[0].data[i]));
    });
    hit.addEventListener('pointerleave', function () {
      cross.setAttribute('opacity', 0);
      marks.forEach(function (m) { m.setAttribute('opacity', 0); });
      hideTip();
    });

    legend(host, series, colors, mode);
  }

  function smoothPath(pts, curve) {
    if (!pts.length) return '';
    if (!curve || pts.length < 3) {
      return pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    }
    var d = 'M' + pts[0][0].toFixed(1) + ',' + pts[0][1].toFixed(1);
    for (var i = 0; i < pts.length - 1; i++) {
      var p0 = pts[i === 0 ? 0 : i - 1], p1 = pts[i], p2 = pts[i + 1], p3 = pts[i + 2] || p2;
      var t = 0.18;
      var c1x = p1[0] + (p2[0] - p0[0]) * t, c1y = p1[1] + (p2[1] - p0[1]) * t;
      var c2x = p2[0] - (p3[0] - p1[0]) * t, c2y = p2[1] - (p3[1] - p1[1]) * t;
      d += ' C' + c1x.toFixed(1) + ',' + c1y.toFixed(1) + ' ' + c2x.toFixed(1) + ',' + c2y.toFixed(1) + ' ' + p2[0].toFixed(1) + ',' + p2[1].toFixed(1);
    }
    return d;
  }

  /* ======================================================================
     BAR — vertical, single or grouped. 4px rounded top, 2px surface gaps.
     ====================================================================== */
  function barChart(host, cfg, mode) {
    var C = INK[mode], colors = cfg.colors || CAT[mode];
    var labels = cfg.labels || [];
    var series = cfg.series || [];
    var W = host.clientWidth || 640;
    var H = cfg.height || 260;
    var padL = cfg.padL != null ? cfg.padL : 40, padR = 12, padT = 18, padB = 34;
    var iw = W - padL - padR, ih = H - padT - padB;

    var allV = [];
    series.forEach(function (s) { s.data.forEach(function (v) { allV.push(v); }); });
    var hi = cfg.max != null ? cfg.max : niceMax(Math.max.apply(null, allV));

    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, class: 'ch-svg', role: 'img' }, host);
    var ticks = cfg.ticks || 4;
    for (var t = 0; t <= ticks; t++) {
      var v = hi * (t / ticks);
      var y = padT + ih - (v / hi) * ih;
      el('line', { x1: padL, x2: W - padR, y1: y, y2: y, stroke: C.grid, 'stroke-width': 1 }, svg);
      var lb = el('text', { x: padL - 9, y: y + 4, 'text-anchor': 'end', class: 'ch-ax' }, svg);
      lb.setAttribute('fill', C.t3);
      lb.textContent = cfg.yfmt === 'pct' ? Math.round(v) + '%' : nice(Math.round(v));
    }

    var n = labels.length;
    var slot = iw / n;
    var groupPad = Math.min(18, slot * 0.28);
    var gw = slot - groupPad;
    var bw = (gw - (series.length - 1) * 2) / series.length; // 2px surface gap between adjacent bars
    var r = Math.min(4, bw / 2);

    labels.forEach(function (L, i) {
      var gx = padL + i * slot + groupPad / 2;
      series.forEach(function (s, si) {
        var val = s.data[i];
        var col = s.color || colors[si % colors.length];
        var bh = Math.max(0, (val / hi) * ih);
        var x = gx + si * (bw + 2);
        var y = padT + ih - bh;
        var path = el('path', {
          d: roundTop(x, y, bw, bh, r), fill: col, class: 'ch-bar'
        }, svg);
        path.style.transformOrigin = (x + bw / 2) + 'px ' + (padT + ih) + 'px';
        if (!RM) {
          path.style.transform = 'scaleY(0)';
          path.style.transition = 'transform .85s cubic-bezier(.22,1,.36,1) ' + (i * 55 + si * 90) + 'ms, opacity .3s';
          requestAnimationFrame(function () { path.style.transform = 'scaleY(1)'; });
        }
        path.addEventListener('pointerenter', function (e) {
          path.style.opacity = .82;
          var br = path.getBoundingClientRect();
          showTip(tipRows(L, [{ c: col, n: s.name, v: (cfg.yfmt === 'pct' ? val + '%' : nice(val)) + (s.unit || '') }]),
            br.left + br.width / 2, br.top);
        });
        path.addEventListener('pointerleave', function () { path.style.opacity = 1; hideTip(); });
      });
      var tx = el('text', { x: padL + i * slot + slot / 2, y: H - 12, 'text-anchor': 'middle', class: 'ch-ax' }, svg);
      tx.setAttribute('fill', C.t2);
      tx.textContent = L;
    });
    el('line', { x1: padL, x2: W - padR, y1: padT + ih, y2: padT + ih, stroke: C.axis, 'stroke-width': 1 }, svg);
    legend(host, series, colors, mode);
  }

  function roundTop(x, y, w, h, r) {
    if (h < r) r = h;
    return 'M' + x + ',' + (y + h) +
           ' L' + x + ',' + (y + r) +
           ' Q' + x + ',' + y + ' ' + (x + r) + ',' + y +
           ' L' + (x + w - r) + ',' + y +
           ' Q' + (x + w) + ',' + y + ' ' + (x + w) + ',' + (y + r) +
           ' L' + (x + w) + ',' + (y + h) + ' Z';
  }

  /* ======================================================================
     HBAR — horizontal ranked bars with direct labels
     ====================================================================== */
  function hbarChart(host, cfg, mode) {
    var C = INK[mode], colors = cfg.colors || CAT[mode];
    var items = cfg.items || [];
    var hi = cfg.max != null ? cfg.max : Math.max.apply(null, items.map(function (i) { return i.value; }));
    var box = div('ch-hbar', host);
    items.forEach(function (it, i) {
      var row = div('ch-hrow', box);
      var col = it.color || colors[i % colors.length];
      row.innerHTML =
        '<div class="ch-hlab">' + it.label + '</div>' +
        '<div class="ch-htrack"><i style="background:' + col + '"></i></div>' +
        '<div class="ch-hval num">' + (cfg.pre || '') + nice(it.value) + (cfg.suf || '') + '</div>';
      var fill = row.querySelector('i');
      var pct = hi > 0 ? (it.value / hi) * 100 : 0;
      if (RM) fill.style.width = pct + '%';
      else {
        fill.style.transition = 'width 1s cubic-bezier(.22,1,.36,1) ' + (i * 90) + 'ms';
        requestAnimationFrame(function () { fill.style.width = pct + '%'; });
      }
      if (it.meta) row.querySelector('.ch-hval').setAttribute('title', it.meta);
    });
  }

  /* ======================================================================
     DONUT — composition, with center headline
     ====================================================================== */
  function donutChart(host, cfg, mode) {
    var C = INK[mode], colors = cfg.colors || CAT[mode];
    var items = cfg.items || [];
    var size = cfg.size || 200;
    var stroke = cfg.stroke || 22;
    var R = (size - stroke) / 2;
    var total = items.reduce(function (a, b) { return a + b.value; }, 0) || 1;

    var box = div('ch-donut', host);
    var svg = el('svg', { viewBox: '0 0 ' + size + ' ' + size, width: size, height: size, class: 'ch-svg' }, box);
    var g = el('g', { transform: 'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')' }, svg);
    el('circle', { cx: size / 2, cy: size / 2, r: R, fill: 'none', stroke: C.grid, 'stroke-width': stroke }, g);

    var circ = 2 * Math.PI * R;
    var acc = 0;
    items.forEach(function (it, i) {
      var col = it.color || colors[i % colors.length];
      var frac = it.value / total;
      var len = circ * frac;
      var c = el('circle', {
        cx: size / 2, cy: size / 2, r: R, fill: 'none', stroke: col,
        'stroke-width': stroke, 'stroke-linecap': 'butt',
        // 2px surface gap between adjacent segments
        'stroke-dasharray': Math.max(0, len - 2) + ' ' + (circ - Math.max(0, len - 2)),
        'stroke-dashoffset': -circ * acc
      }, g);
      c.style.cursor = 'pointer';
      if (!RM) {
        c.style.opacity = 0;
        c.style.transition = 'opacity .5s ease ' + (i * 140 + 120) + 'ms, stroke-width .25s ease';
        requestAnimationFrame(function () { c.style.opacity = 1; });
      }
      c.addEventListener('pointerenter', function (e) {
        c.setAttribute('stroke-width', stroke + 5);
        var br = box.getBoundingClientRect();
        showTip(tipRows(it.label, [{ c: col, n: 'Share', v: Math.round(frac * 100) + '%  ·  ' + nice(it.value) }]),
          br.left + br.width / 2, br.top + 20);
      });
      c.addEventListener('pointerleave', function () { c.setAttribute('stroke-width', stroke); hideTip(); });
      acc += frac;
    });

    if (cfg.center) {
      var ctr = div('ch-donut-c', box);
      ctr.innerHTML = '<b class="num">' + cfg.center + '</b><span>' + (cfg.centerLabel || '') + '</span>';
    }
    // Legend with values — identity is never colour-alone
    var lg = div('ch-dlegend', host);
    items.forEach(function (it, i) {
      var r = div('ch-dleg', lg);
      r.innerHTML = '<span class="ch-sw" style="background:' + (it.color || colors[i % colors.length]) + '"></span>' +
                    '<span class="ch-dleg-n">' + it.label + '</span>' +
                    '<b class="num">' + Math.round((it.value / total) * 100) + '%</b>';
    });
  }

  /* ======================================================================
     RADIAL — single-metric gauge ring
     ====================================================================== */
  function radialChart(host, cfg, mode) {
    var C = INK[mode];
    var size = cfg.size || 132, stroke = cfg.stroke || 11;
    var R = (size - stroke) / 2;
    var val = Math.max(0, Math.min(100, cfg.value || 0));
    var col = cfg.color || (cfg.status ? STATUS[cfg.status][mode] : CAT[mode][0]);
    var box = div('ch-radial', host);
    var svg = el('svg', { viewBox: '0 0 ' + size + ' ' + size, width: size, height: size, class: 'ch-svg' }, box);
    var g = el('g', { transform: 'rotate(-90 ' + size / 2 + ' ' + size / 2 + ')' }, svg);
    el('circle', { cx: size / 2, cy: size / 2, r: R, fill: 'none', stroke: C.grid, 'stroke-width': stroke, 'stroke-linecap': 'round' }, g);
    var c = el('circle', { cx: size / 2, cy: size / 2, r: R, fill: 'none', stroke: col, 'stroke-width': stroke, 'stroke-linecap': 'round' }, g);
    var circ = 2 * Math.PI * R;
    c.style.strokeDasharray = circ;
    c.style.strokeDashoffset = RM ? circ - circ * val / 100 : circ;
    if (!RM) {
      c.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1) ' + (cfg.delay || 100) + 'ms';
      requestAnimationFrame(function () { c.style.strokeDashoffset = circ - circ * val / 100; });
    }
    var ctr = div('ch-radial-c', box);
    ctr.innerHTML = '<b class="num" data-count="' + val + '" data-suf="' + (cfg.suffix || '%') + '">0</b>' +
                    (cfg.label ? '<span>' + cfg.label + '</span>' : '');
    var num = ctr.querySelector('b');
    if (window.Motion) window.Motion.count(num); else num.textContent = val + (cfg.suffix || '%');
  }

  /* ======================================================================
     FUNNEL — admissions pipeline conversion
     ====================================================================== */
  function funnelChart(host, cfg, mode) {
    var C = INK[mode], colors = cfg.colors || CAT[mode];
    var stages = cfg.stages || [];
    var top = stages[0] ? stages[0].value : 1;
    var box = div('ch-funnel', host);
    stages.forEach(function (s, i) {
      var pct = (s.value / top) * 100;
      var row = div('ch-fstage', box);
      var col = s.color || SEQ[mode][Math.min(SEQ[mode].length - 1, i + 1)];
      var conv = i === 0 ? 100 : (s.value / stages[i - 1].value) * 100;
      row.innerHTML =
        '<div class="ch-fhead"><span class="ch-fname">' + s.label + '</span>' +
        '<span class="ch-fnum num">' + nice(s.value) + '</span></div>' +
        '<div class="ch-fbar"><i style="background:' + col + '"></i></div>' +
        '<div class="ch-fmeta">' + (i === 0 ? 'Entry stage' :
          '<span class="ch-fconv num">' + conv.toFixed(1) + '%</span> from ' + stages[i - 1].label) + '</div>';
      var fill = row.querySelector('i');
      if (RM) fill.style.width = pct + '%';
      else {
        fill.style.transition = 'width 1.05s cubic-bezier(.22,1,.36,1) ' + (i * 130) + 'ms';
        requestAnimationFrame(function () { fill.style.width = pct + '%'; });
      }
    });
  }

  /* ======================================================================
     SPARK — inline trend, no axes
     ====================================================================== */
  function sparkChart(host, cfg, mode) {
    var data = cfg.data || [];
    var W = cfg.width || host.clientWidth || 110, H = cfg.height || 34;
    var lo = Math.min.apply(null, data), hi = Math.max.apply(null, data);
    if (hi === lo) hi = lo + 1;
    var col = cfg.color || (cfg.status ? STATUS[cfg.status][mode] : CAT[mode][0]);
    var svg = el('svg', { viewBox: '0 0 ' + W + ' ' + H, width: W, height: H, class: 'ch-svg ch-spark', preserveAspectRatio: 'none' }, host);
    var pts = data.map(function (v, i) {
      return [(i / (data.length - 1)) * (W - 4) + 2, H - 3 - ((v - lo) / (hi - lo)) * (H - 6)];
    });
    var d = smoothPath(pts, true);
    var uid = 's' + Math.random().toString(36).slice(2, 7);
    var defs = el('defs', null, svg);
    var grad = el('linearGradient', { id: uid, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el('stop', { offset: '0%', 'stop-color': col, 'stop-opacity': .28 }, grad);
    el('stop', { offset: '100%', 'stop-color': col, 'stop-opacity': 0 }, grad);
    el('path', { d: d + ' L' + pts[pts.length - 1][0] + ',' + H + ' L' + pts[0][0] + ',' + H + ' Z', fill: 'url(#' + uid + ')' }, svg);
    var p = el('path', { d: d, fill: 'none', stroke: col, 'stroke-width': 1.8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'vector-effect': 'non-scaling-stroke' }, svg);
    if (!RM) {
      var len = p.getTotalLength();
      p.style.strokeDasharray = len; p.style.strokeDashoffset = len;
      p.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.22,1,.36,1) ' + (cfg.delay || 0) + 'ms';
      requestAnimationFrame(function () { p.style.strokeDashoffset = 0; });
    }
  }

  /* ======================================================================
     CALENDAR — attendance grid (sequential, one hue light→dark)
     ====================================================================== */
  function calendarChart(host, cfg, mode) {
    var days = cfg.days || [];
    var ramp = SEQ[mode];
    var box = div('ch-cal', host);
    var head = div('ch-cal-head', box);
    ['M', 'T', 'W', 'T', 'F', 'S', 'S'].forEach(function (d) { div('ch-cal-dow', head, d); });
    var grid = div('ch-cal-grid', box);
    days.forEach(function (d, i) {
      var cell = div('ch-cal-c', grid);
      var c;
      if (d.state === 'off') { cell.classList.add('off'); c = 'transparent'; }
      else if (d.state === 'absent') { c = mode === 'dark' ? 'rgba(232,91,50,.34)' : 'rgba(232,65,15,.20)'; cell.classList.add('absent'); }
      else if (d.state === 'late') { c = ramp[2]; }
      else { c = ramp[4]; }
      cell.style.background = c;
      cell.style.setProperty('--d', (i * 11) + 'ms');
      if (d.day) cell.textContent = d.day;
      if (d.state !== 'off') {
        cell.setAttribute('tabindex', '0');
        var lbl = d.state === 'absent' ? 'Absent' : d.state === 'late' ? 'Late arrival' : 'Present';
        cell.addEventListener('pointerenter', function () {
          var r = cell.getBoundingClientRect();
          showTip(tipRows(cfg.month + ' ' + d.day, [{ c: c === 'transparent' ? '#888' : c, n: lbl, v: d.note || (d.hours || '4h 30m') }]), r.left + r.width / 2, r.top);
        });
        cell.addEventListener('pointerleave', hideTip);
      }
    });
    var key = div('ch-cal-key', box);
    key.innerHTML =
      '<span><i style="background:' + ramp[4] + '"></i>Present</span>' +
      '<span><i style="background:' + ramp[2] + '"></i>Late</span>' +
      '<span><i style="background:' + (mode === 'dark' ? 'rgba(232,91,50,.34)' : 'rgba(232,65,15,.20)') + '"></i>Absent</span>' +
      '<span><i class="ch-key-off"></i>No class</span>';
  }

  /* ======================================================================
     STACK — 100% stacked horizontal bar (source mix, status mix)
     ====================================================================== */
  function stackChart(host, cfg, mode) {
    var colors = cfg.colors || CAT[mode];
    var items = cfg.items || [];
    var total = items.reduce(function (a, b) { return a + b.value; }, 0) || 1;
    var bar = div('ch-stack', host);
    items.forEach(function (it, i) {
      var seg = document.createElement('div');
      seg.className = 'ch-seg';
      var col = it.color || colors[i % colors.length];
      seg.style.background = col;
      seg.style.setProperty('--w', (it.value / total * 100) + '%');
      if (!RM) seg.style.transitionDelay = (i * 100) + 'ms';
      else seg.style.width = (it.value / total * 100) + '%';
      seg.addEventListener('pointerenter', function () {
        var r = seg.getBoundingClientRect();
        showTip(tipRows(it.label, [{ c: col, n: 'Leads', v: nice(it.value) + ' · ' + Math.round(it.value / total * 100) + '%' }]), r.left + r.width / 2, r.top);
      });
      seg.addEventListener('pointerleave', hideTip);
      bar.appendChild(seg);
    });
    requestAnimationFrame(function () {
      bar.querySelectorAll('.ch-seg').forEach(function (s) { s.style.width = s.style.getPropertyValue('--w'); });
    });
    var lg = div('ch-dlegend ch-dlegend-row', host);
    items.forEach(function (it, i) {
      var r = div('ch-dleg', lg);
      r.innerHTML = '<span class="ch-sw" style="background:' + (it.color || colors[i % colors.length]) + '"></span>' +
                    '<span class="ch-dleg-n">' + it.label + '</span><b class="num">' + Math.round(it.value / total * 100) + '%</b>';
    });
  }

  /* ======================================================================
     Public API
     ====================================================================== */
  var TYPES = {
    line: lineChart, area: lineChart, bar: barChart, hbar: hbarChart,
    donut: donutChart, radial: radialChart, funnel: funnelChart,
    spark: sparkChart, calendar: calendarChart, stack: stackChart
  };

  var Charts = window.Charts = {
    palette: CAT, sequential: SEQ, status: STATUS,

    render: function (node) {
      var raw = node.getAttribute('data-chart');
      if (!raw) return;
      var cfg;
      try { cfg = JSON.parse(raw); } catch (err) { console.warn('[charts] bad config', err, raw); return; }
      var fn = TYPES[cfg.type];
      if (!fn) { console.warn('[charts] unknown type', cfg.type); return; }
      node.innerHTML = '';
      node.classList.add('ch');
      var mode = cfg.mode || theme(node);
      node.setAttribute('data-ch-mode', mode);
      fn(node, cfg, mode);
      node.setAttribute('data-ch-done', '1');

      // Re-render on width change (debounced) so charts stay crisp, not scaled
      if (!node.__ro && window.ResizeObserver && cfg.type !== 'radial' && cfg.type !== 'donut') {
        var w = node.clientWidth, h;
        node.__ro = new ResizeObserver(function () {
          if (Math.abs(node.clientWidth - w) < 24) return;
          w = node.clientWidth;
          clearTimeout(h);
          h = setTimeout(function () {
            node.innerHTML = ''; fn(node, cfg, mode);
          }, 180);
        });
        node.__ro.observe(node);
      }
    },

    scan: function (root) {
      (root || document).querySelectorAll('[data-chart]:not([data-ch-done])').forEach(function (n) {
        // Only auto-render if already on screen; otherwise motion.js triggers on reveal
        var r = n.getBoundingClientRect();
        if (r.top < window.innerHeight * 1.2 && r.bottom > -200) Charts.render(n);
      });
    },

    /** Imperatively draw into a node: Charts.draw(node, {type:'line', ...}) */
    draw: function (node, cfg) {
      node.setAttribute('data-chart', JSON.stringify(cfg));
      node.removeAttribute('data-ch-done');
      Charts.render(node);
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { Charts.scan(); });
  else Charts.scan();
})();

/* ==========================================================================
   PRAGATI ACADEMY — Program detail page
   Reads ?p=<program-id> and fills the page from the shared dataset.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.DATA, U = window.UI;
  if (!D) return;

  var id = new URLSearchParams(location.search).get('p') || 'neet-2027';
  var p = D.programs.filter(function (x) { return x.id === id; })[0] || D.programs[0];
  var inr = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };
  var $ = function (s) { return document.querySelector(s); };

  /* ---------- Head + hero -------------------------------------------------- */
  document.title = p.name + ' Program | Pragati Academy, Lucknow';
  var md = document.querySelector('meta[name=description]');
  if (md) md.setAttribute('content', p.desc);

  $('#crumbName').textContent = p.name;
  var title = $('#pdTitle');
  title.textContent = p.name;
  title.setAttribute('data-split', 'word');
  title.setAttribute('data-stagger', '70');

  $('#pdDesc').textContent = p.desc;

  $('#pdChips').innerHTML =
    '<span class="chip chip-verm">' + p.duration + '</span>' +
    '<span class="chip">' + p.mode + '</span>' +
    '<span class="chip">' + p.level + '</span>' +
    p.subjects.map(function (s) { return '<span class="chip">' + s + '</span>'; }).join('');

  $('#pdFacts').innerHTML =
    '<div class="pdf"><dt>Next batch</dt><dd>' + p.batch + '</dd></div>' +
    '<div class="pdf"><dt>Duration</dt><dd>' + p.duration + '</dd></div>' +
    '<div class="pdf"><dt>Program fee</dt><dd>' + inr(p.fee) + '</dd></div>' +
    '<div class="pdf"><dt>Seats</dt><dd>' + (p.seats - p.filled) + ' of ' + p.seats + ' left</dd></div>';

  /* ---------- Sticky rail --------------------------------------------------- */
  $('#railFee').innerHTML = inr(p.fee) + '<small>Program fee · 2 instalments</small>';
  var i1 = Math.round(p.fee * 0.52 / 1000) * 1000;
  $('#railList').innerHTML =
    '<div class="rail-li"><span>Instalment 1</span><b>' + inr(i1) + '</b></div>' +
    '<div class="rail-li"><span>Instalment 2</span><b>' + inr(p.fee - i1) + '</b></div>' +
    '<div class="rail-li"><span>Batch starts</span><b>' + p.batch + '</b></div>' +
    '<div class="rail-li"><span>Mode</span><b>' + p.mode + '</b></div>' +
    '<div class="rail-li"><span>Level</span><b>' + p.level + '</b></div>';
  var left = p.seats - p.filled;
  $('#railSeats').textContent = left + ' / ' + p.seats;
  var bar = document.querySelector('.seat-bar');
  if (bar) bar.setAttribute('data-bar', Math.round(p.filled / p.seats * 100));

  /* ---------- Curriculum ----------------------------------------------------- */
  var phases = [
    { t: 'Phase 1 — Foundation build', w: 'Weeks 1–12', items: buildTopics(p, 0) },
    { t: 'Phase 2 — Core syllabus', w: 'Weeks 13–28', items: buildTopics(p, 1) },
    { t: 'Phase 3 — Advanced application', w: 'Weeks 29–40', items: buildTopics(p, 2) },
    { t: 'Phase 4 — Revision & full mocks', w: 'Weeks 41–52', items: buildTopics(p, 3) }
  ];

  function buildTopics(prog, phase) {
    var byPhase = [
      ['Diagnostic testing and baseline mapping', 'NCERT line-by-line reading discipline', 'Chapter-level practice tiers', 'Weekly concept checks'],
      ['Full theory coverage, chapter by chapter', 'Pattern-wise problem sets', 'Subject tests every fortnight', 'First mentor review cycle'],
      ['Previous-year paper dissection', 'Mixed-topic problem marathons', 'Time-per-question drills', 'Error-log discipline'],
      ['Two complete revision passes', 'Full-syllabus mocks on paper pattern', 'Weak-chapter targeted redo', 'Exam-day simulation and mindset']
    ];
    return byPhase[phase].concat(
      prog.subjects.map(function (s) { return s + ' — phase ' + (phase + 1) + ' module'; })
    );
  }

  $('#curriculum-acc').innerHTML = phases.map(function (ph, i) {
    return '<div class="acc-item" data-acc-item>' +
      '<button class="acc-head" data-acc-head aria-expanded="false">' +
        '<span class="acc-n">0' + (i + 1) + '</span>' +
        '<span class="acc-t">' + ph.t + '</span>' +
        '<span class="chip">' + ph.w + '</span>' +
        '<span class="acc-ic"></span>' +
      '</button>' +
      '<div class="acc-panel" data-acc-panel><div class="acc-inner">' +
        ph.items.map(function (x) { return '<div class="acc-li">' + x + '</div>'; }).join('') +
      '</div></div>' +
    '</div>';
  }).join('');

  /* ---------- Faculty for this program ---------------------------------------- */
  var pick = D.faculty.filter(function (f) {
    if (p.id === 'neet-2027') return /NEET|Chemistry|Physics/.test(f.role);
    if (p.id === 'jee-2027') return /Mathematics|Physics|Chemistry/.test(f.role);
    if (p.id === 'upsc-foundation') return /UPSC/.test(f.role);
    if (p.id === 'data-technology') return /Data/.test(f.role);
    return true;
  });
  if (pick.length < 3) pick = D.faculty.slice(0, 3);
  pick = pick.slice(0, 3);

  $('#pdFaculty').innerHTML = pick.map(function (f, i) {
    return '<article class="fac" data-rise style="--d:' + (i * 90) + 'ms" tabindex="0">' +
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

  /* ---------- Weekly schedule ---------------------------------------------------- */
  var subs = p.subjects;
  var days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var evenings = ['Doubt desk 5–7 PM', 'Practice set 5–7 PM', 'Doubt desk 5–7 PM', 'Mentor slots 5–7 PM', 'Doubt desk 5–7 PM', 'Weekly test 4–7 PM'];
  document.getElementById('schedBody').innerHTML = days.map(function (d, i) {
    var a = subs[i % subs.length], b = subs[(i + 1) % subs.length];
    return '<tr><td><b>' + d + '</b></td><td>' + a + '</td><td>' + b + '</td><td>' + evenings[i] + '</td></tr>';
  }).join('') +
  '<tr><td><b>Sunday</b></td><td colspan="2">Full-syllabus mock (alternate weeks) · 10 AM – 1 PM</td><td>Result review 6 PM</td></tr>';

  /* ---------- Section nav scroll-spy ------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    var links = Array.prototype.slice.call(document.querySelectorAll('.pd-nav a'));
    var secs = links.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
    var obs = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
        var on = document.querySelector('.pd-nav a.on');
        if (on && on.parentElement) {
          var pr = on.parentElement.getBoundingClientRect(), br = on.getBoundingClientRect();
          if (br.left < pr.left + 20 || br.right > pr.right - 20) {
            on.parentElement.scrollTo({ left: on.offsetLeft - 60, behavior: 'smooth' });
          }
        }
      });
    }, { rootMargin: '-18% 0px -70% 0px' });
    secs.forEach(function (s) { obs.observe(s); });
  });

  /* Accent the hero field with the program colour */
  var b1 = document.querySelector('.pd-hero .hero-blob.b1');
  if (b1) b1.style.background = 'radial-gradient(circle, ' + p.accent + ', transparent 66%)';
})();

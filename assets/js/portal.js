/* ==========================================================================
   PRAGATI ACADEMY — Student portal / ERP
   Nine modules: dashboard, classes, assignments, mock tests, attendance,
   performance, fees, mentor and messages. All data is fictional.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.DATA, U = window.UI, M = window.Motion;
  if (!D) return;
  var P = D.portal;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var inr = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };

  /* =======================================================================
     DASHBOARD
     ======================================================================= */
  function vDashboard() {
    var d = P.dash;
    return '' +
    '<div class="pt-hero">' +
      '<div class="pt-hero-in">' +
        '<div>' +
          '<div class="pt-hi">Good morning, Aditya.</div>' +
          '<p class="pt-sub">You are ranked <b>' + d.rank + '</b> of ' + d.rankOf.toLocaleString('en-IN') +
          ' — up ' + (d.rankPrev - d.rank) + ' places since the last mock. Three assignments are still open this week.</p>' +
        '</div>' +
        '<div class="pt-next">' +
          '<div class="lab">Next test</div>' +
          '<div class="val">Physics</div>' +
          '<div class="cd">Sunday, 24 August · 10:00 AM</div>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="row r-4">' +
      metric('Attendance', d.attendance, '%', 'radial', '#0E9E6E', 'Above the 85% batch floor') +
      metric('Mock test average', d.mock, '%', 'radial', '#3B2AE0', 'Last eight full-syllabus mocks') +
      metric('Assignments', Math.round(d.assignmentsDone / d.assignmentsTotal * 100), '%', 'radial', '#B0801E', d.assignmentsDone + ' of ' + d.assignmentsTotal + ' submitted') +
      '<div class="metric"><div class="metric-b" style="width:100%">' +
        '<div class="metric-l">Current rank</div>' +
        '<div class="metric-v num" data-count="' + d.rank + '">0</div>' +
        '<div class="metric-n">of ' + d.rankOf.toLocaleString('en-IN') + ' · <span style="color:#07875D;font-weight:600">▲ ' + (d.rankPrev - d.rank) + '</span> since Mock 07</div>' +
        '<figure data-chart=\'{"type":"spark","height":34,"color":"#C13584","data":[412,368,341,296,247,201,167,124]}\' style="margin-top:10px"></figure>' +
      '</div></div>' +
    '</div>' +

    '<div class="row r-23">' +
      '<div class="panel">' +
        '<div class="panel-head"><div><div class="panel-t">Overall performance</div><div class="panel-s">Percentage across eight mocks · all three subjects</div></div>' +
        '<div class="panel-r"><button class="btn btn-ghost btn-sm" data-jump="performance">Full breakdown</button></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"line","height":250,"yfmt":"pct","max":100,"labels":' +
          JSON.stringify(P.testLabels) + ',"series":' + JSON.stringify(P.overall) + '}\'></figure></div>' +
      '</div>' +
      '<div class="panel">' +
        '<div class="panel-head"><div><div class="panel-t">Today</div><div class="panel-s">Batch A timetable</div></div></div>' +
        '<div>' + P.classes.slice(0, 4).map(classRow).join('') + '</div>' +
      '</div>' +
    '</div>' +

    '<div class="row r-3">' + P.subjects.map(subjectCard).join('') + '</div>' +

    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Open assignments</div><div class="panel-s">Three due this week</div></div>' +
        '<div class="panel-r"><button class="btn btn-ghost btn-sm" data-jump="assignments">All assignments</button></div></div>' +
        '<div>' + P.assignments.filter(function (a) { return !a.done; }).map(assignRow).join('') + '</div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Fees</div><div class="panel-s">Instalment 3 due 10 September</div></div></div>' +
        '<div class="panel-body">' + feeCard() + '</div></div>' +
    '</div>';
  }

  function metric(label, value, suf, kind, color, note) {
    return '<div class="metric">' +
      '<figure data-chart=\'{"type":"radial","size":86,"stroke":9,"value":' + value + ',"color":"' + color + '"}\' style="width:86px;flex:0 0 86px"></figure>' +
      '<div class="metric-b">' +
        '<div class="metric-l">' + label + '</div>' +
        '<div class="metric-v num" data-count="' + value + '" data-suf="' + suf + '">0</div>' +
        '<div class="metric-n">' + note + '</div>' +
      '</div>' +
    '</div>';
  }

  function subjectCard(s) {
    return '<div class="subj">' +
      '<div class="subj-h">' +
        '<span class="subj-ic" style="background:' + s.color + '">' + s.short + '</span>' +
        '<div style="flex:1"><div class="subj-n">' + s.name + '</div>' +
        '<div class="subj-m">Weak: ' + s.weak.join(', ') + '</div></div>' +
        '<span class="chip ' + (s.improve > 0 ? 'chip-mint' : 'chip-verm') + '">' + (s.improve > 0 ? '+' : '') + s.improve + '</span>' +
      '</div>' +
      '<div class="subj-b"><figure data-chart=\'{"type":"line","height":140,"padL":30,"yfmt":"pct","max":100,"labels":' +
        JSON.stringify(P.testLabels) + ',"series":[{"name":"' + s.name + '","data":' + JSON.stringify(s.tests) + ',"color":"' + s.color + '"}]}\'></figure></div>' +
      '<div class="subj-stats">' +
        '<div class="ss"><b class="num">' + s.score + '%</b><span>Score</span></div>' +
        '<div class="ss"><b class="num">' + s.rank + '</b><span>Rank</span></div>' +
        '<div class="ss"><b class="num">' + s.accuracy + '%</b><span>Accuracy</span></div>' +
        '<div class="ss"><b class="num">' + s.time + '</b><span>Time</span></div>' +
      '</div>' +
    '</div>';
  }

  function classRow(c) {
    var tone = c.state === 'live' ? 'chip-verm' : c.state === 'done' ? 'chip-mint' : '';
    var lab = c.state === 'live' ? 'Live now' : c.state === 'done' ? 'Attended' : 'Upcoming';
    return '<div class="list-i">' +
      '<span class="list-ic" style="background:' + c.c + '22;color:' + c.c + '"><i data-i="' + c.ic + '"></i></span>' +
      '<div class="list-b"><div class="list-t">' + c.t + '</div><div class="list-m">' + c.m + '</div></div>' +
      '<div class="list-r"><span class="chip ' + tone + '">' + lab + '</span>' +
      '<div style="font-size:.7rem;color:var(--text-mute);margin-top:5px">' + c.time + '</div></div>' +
    '</div>';
  }

  function assignRow(a) {
    return '<div class="list-i">' +
      '<span class="check' + (a.done ? ' on' : '') + '" data-check></span>' +
      '<span class="list-ic" style="background:' + a.c + '1a;color:' + a.c + '"><i data-i="file"></i></span>' +
      '<div class="list-b"><div class="list-t">' + a.t + '</div><div class="list-m">' + a.s + ' · ' + a.due + '</div></div>' +
      '<div class="list-r">' + (a.score ? '<b style="font-family:var(--display)">' + a.score + '</b>' :
        '<button class="btn btn-ghost btn-sm" data-submit>Submit</button>') + '</div>' +
    '</div>';
  }

  function feeCard() {
    var f = P.fees;
    var pct = Math.round(f.paid / f.total * 100);
    return '<div class="fee-card"><div class="fee-in">' +
      '<div style="display:flex;justify-content:space-between;align-items:baseline;gap:14px;flex-wrap:wrap">' +
        '<div><div style="font-family:var(--display);font-size:.6rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--text-inv-mute)">Course fee</div>' +
        '<div style="font-family:var(--display);font-size:2rem;font-weight:800;letter-spacing:-.05em;line-height:1;margin-top:8px">' + inr(f.total) + '</div></div>' +
        '<span class="chip chip-mint">' + pct + '% paid</span>' +
      '</div>' +
      '<div class="fee-track" style="--v:' + pct + '%"><i></i></div>' +
      '<div class="fee-nums">' +
        '<div class="fee-n"><b>' + inr(f.paid) + '</b><span>Paid</span></div>' +
        '<div class="fee-n"><b>' + inr(f.due) + '</b><span>Remaining</span></div>' +
        '<div class="fee-n"><b>' + f.nextDue.split(' ').slice(0, 2).join(' ') + '</b><span>Next due</span></div>' +
      '</div>' +
      '<div class="fee-due"><i data-i="clock" style="width:15px;height:15px"></i>Instalment 3 of ' + inr(f.due) + ' due on ' + f.nextDue + '</div>' +
      '<button class="btn btn-accent btn-sm mt-m" style="width:100%" data-jump="fees">View payment details</button>' +
    '</div></div>';
  }

  /* =======================================================================
     CLASSES
     ======================================================================= */
  function vClasses() {
    var week = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return '' +
    '<div class="row r-3">' +
      kpi('Classes this week', 24, '#3B2AE0', '4 hours daily, six days') +
      kpi('Attended', 22, '#0E9E6E', '91.6% this week') +
      kpi('Recordings available', 186, '#B0801E', 'Full program library') +
    '</div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Today</div><div class="panel-s">Wednesday, 19 August 2026</div></div>' +
      '<div class="panel-r"><span class="chip chip-verm chip-dot">Chemistry live now</span></div></div>' +
      '<div>' + P.classes.map(classRow).join('') + '</div></div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Weekly timetable</div><div class="panel-s">Classroom Batch A · Room 204</div></div></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Day</th><th>9:00 – 11:00</th><th>11:15 – 1:15</th><th>Evening</th></tr></thead><tbody>' +
      week.map(function (d, i) {
        var subs = ['Physics', 'Chemistry', 'Biology'];
        var ev = ['Doubt desk 5–7 PM', 'Practice set 5–7 PM', 'Doubt desk 5–7 PM', 'Mentor slots 5–7 PM', 'Doubt desk 5–7 PM', 'Weekly test 4–7 PM'];
        return '<tr class="tbl-row-in" style="animation-delay:' + (i * 45) + 'ms"><td><b>' + d + '</b></td>' +
          '<td>' + subs[i % 3] + '</td><td>' + subs[(i + 1) % 3] + '</td><td>' + ev[i] + '</td></tr>';
      }).join('') +
      '<tr><td><b>Sunday</b></td><td colspan="2">Full-syllabus mock (alternate weeks) · 10 AM – 1 PM</td><td>Result review 6 PM</td></tr>' +
      '</tbody></table></div></div>';
  }

  /* =======================================================================
     ASSIGNMENTS
     ======================================================================= */
  function vAssignments() {
    var open = P.assignments.filter(function (a) { return !a.done; });
    var done = P.assignments.filter(function (a) { return a.done; });
    return '' +
    '<div class="row r-4">' +
      kpi('Submitted', P.dash.assignmentsDone, '#0E9E6E', 'of ' + P.dash.assignmentsTotal + ' set this term') +
      kpi('Open', open.length, '#E8410F', 'Due within seven days') +
      kpi('Average score', 88, '#3B2AE0', 'Across submitted work', '%') +
      kpi('On-time rate', 94, '#B0801E', 'Submitted before deadline', '%') +
    '</div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Open</div><div class="panel-s">' + open.length + ' assignments waiting</div></div></div>' +
      '<div>' + open.map(assignRow).join('') + '</div></div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Submitted</div><div class="panel-s">Graded and returned</div></div></div>' +
      '<div>' + done.map(assignRow).join('') + '</div></div>';
  }

  /* =======================================================================
     MOCK TESTS
     ======================================================================= */
  function vMocks() {
    return '' +
    '<div class="row r-4">' +
      kpi('Tests taken', 8, '#3B2AE0', 'Full syllabus this term') +
      kpi('Best score', 612, '#0E9E6E', 'out of 720 · Mock 08') +
      kpi('Best rank', 124, '#C13584', 'of 1,840 in the batch') +
      kpi('Average accuracy', 79, '#B0801E', 'Correct of attempted', '%') +
    '</div>' +
    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Score progression</div><div class="panel-s">Percentage across all mocks</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"line","height":250,"yfmt":"pct","max":100,"labels":' +
          JSON.stringify(P.testLabels) + ',"series":' + JSON.stringify(P.overall) + '}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Batch rank movement</div><div class="panel-s">Lower is better · of 1,840 students</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"line","height":250,"min":0,"max":450,"labels":' +
          JSON.stringify(P.testLabels) + ',"series":' + JSON.stringify(P.rankTrend) + '}\'></figure></div></div>' +
    '</div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Test history</div><div class="panel-s">Results publish within 24 hours of the paper</div></div></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Test</th><th>Date</th><th>Score</th><th>Rank</th><th>Accuracy</th><th>Time taken</th></tr></thead><tbody>' +
      P.mocks.map(function (m, i) {
        var pct = Math.round(m.score / m.total * 100);
        return '<tr class="tbl-row-in" style="animation-delay:' + (i * 50) + 'ms">' +
          '<td><b style="font-family:var(--display)">' + m.n + '</b></td>' +
          '<td>' + m.d + '</td>' +
          '<td><b style="font-family:var(--display)">' + m.score + '</b><span style="color:var(--text-mute)"> / ' + m.total + '</span> ' +
            '<span class="chip ' + (pct >= 80 ? 'chip-mint' : pct >= 70 ? 'chip-gold' : 'chip-verm') + '">' + pct + '%</span></td>' +
          '<td>' + m.rank + '</td><td>' + m.acc + '%</td><td>' + m.time + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  /* =======================================================================
     ATTENDANCE
     ======================================================================= */
  function vAttendance() {
    var s = P.attendanceSummary;
    return '' +
    '<div class="row r-4">' +
      '<div class="metric"><figure data-chart=\'{"type":"radial","size":92,"stroke":10,"value":' + P.dash.attendance + ',"color":"#0E9E6E"}\' style="width:92px;flex:0 0 92px"></figure>' +
        '<div class="metric-b"><div class="metric-l">Attendance</div><div class="metric-v num" data-count="' + P.dash.attendance + '" data-suf="%">0</div>' +
        '<div class="metric-n">Batch floor is 85%</div></div></div>' +
      kpi('Classes attended', s.attended, '#3B2AE0', 'Since March 2026') +
      kpi('Classes missed', s.missed, '#E8410F', '2 medical, 12 unexplained') +
      kpi('Total held', s.total, '#B0801E', 'Program to date') +
    '</div>' +
    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">August 2026</div><div class="panel-s">Hover a day for the session detail</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"calendar","month":"August","days":' + JSON.stringify(P.attendanceDays) + '}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Monthly attendance</div><div class="panel-s">Percentage per month</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"bar","height":250,"yfmt":"pct","max":100,"labels":' +
          JSON.stringify(P.attendanceMonths.labels) + ',"series":[{"name":"Attendance","data":' +
          JSON.stringify(P.attendanceMonths.series[0].data) + ',"color":"#0E9E6E"}]}\'></figure></div></div>' +
    '</div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Missed sessions</div><div class="panel-s">Each one flags the chapter on your plan until make-up work is submitted</div></div></div>' +
      '<div>' +
        missRow('11 August', 'Physics — Rotational Motion I', 'Unexplained', 'Make-up submitted', true) +
        missRow('28 July', 'Chemistry — Chemical Kinetics', 'Medical leave', 'Recording watched', true) +
        missRow('16 July', 'Biology — Plant Physiology II', 'Unexplained', 'Make-up pending', false) +
      '</div></div>';
  }

  function missRow(date, cls, reason, action, ok) {
    return '<div class="list-i">' +
      '<span class="list-ic" style="background:rgba(232,65,15,.1);color:#B3200A"><i data-i="close"></i></span>' +
      '<div class="list-b"><div class="list-t">' + cls + '</div><div class="list-m">' + date + ' · ' + reason + '</div></div>' +
      '<div class="list-r"><span class="chip ' + (ok ? 'chip-mint' : 'chip-gold') + '">' + action + '</span></div>' +
    '</div>';
  }

  /* =======================================================================
     PERFORMANCE
     ======================================================================= */
  function vPerformance() {
    return '' +
    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Subject comparison</div><div class="panel-s">Latest full-syllabus mock, all three subjects</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"bar","height":260,"yfmt":"pct","max":100,"labels":' +
          JSON.stringify(P.testLabels) + ',"series":' + JSON.stringify(P.subjects.map(function (s) {
            return { name: s.name, data: s.tests, color: s.color };
          })) + '}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Accuracy vs speed</div><div class="panel-s">Where the marks are actually going</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"hbar","suf":"%","items":[' +
          '{"label":"Correct","value":79},{"label":"Incorrect","value":13},{"label":"Unattempted","value":8}]}\'></figure>' +
        '<div style="margin-top:22px"><figure data-chart=\'{"type":"donut","size":170,"stroke":22,"center":"84%","centerLabel":"Mock average","items":[' +
          '{"label":"Physics","value":78},{"label":"Chemistry","value":88},{"label":"Biology","value":86}]}\'></figure></div>' +
        '</div></div>' +
    '</div>' +

    P.subjects.map(function (s) {
      return '<div class="panel">' +
        '<div class="panel-head">' +
          '<span class="subj-ic" style="background:' + s.color + '">' + s.short + '</span>' +
          '<div><div class="panel-t">' + s.name + '</div><div class="panel-s">Weak chapters: ' + s.weak.join(', ') + '</div></div>' +
          '<div class="panel-r"><span class="chip ' + (s.improve > 0 ? 'chip-mint' : 'chip-verm') + '">' +
            (s.improve > 0 ? '▲ +' : '▼ ') + s.improve + ' since Mock 01</span></div>' +
        '</div>' +
        '<div class="row r-23" style="margin:0;padding:20px;gap:20px">' +
          '<figure data-chart=\'{"type":"line","height":200,"yfmt":"pct","max":100,"labels":' +
            JSON.stringify(P.testLabels) + ',"series":[{"name":"' + s.name + ' score","data":' +
            JSON.stringify(s.tests) + ',"color":"' + s.color + '"}]}\'></figure>' +
          '<div class="subj-stats" style="border:1px solid var(--line-soft);border-radius:12px;overflow:hidden;align-self:start">' +
            '<div class="ss"><b class="num">' + s.score + '%</b><span>Score</span></div>' +
            '<div class="ss"><b class="num">' + s.rank + '</b><span>Rank</span></div>' +
            '<div class="ss"><b class="num">' + s.accuracy + '%</b><span>Accuracy</span></div>' +
            '<div class="ss"><b class="num">' + s.time + '</b><span>Time taken</span></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }

  /* =======================================================================
     FEES
     ======================================================================= */
  function vFees() {
    var f = P.fees;
    return '' +
    '<div class="row r-32">' +
      '<div>' + feeCard() + '</div>' +
      '<div class="panel" style="margin:0"><div class="panel-head"><div><div class="panel-t">Payment history</div><div class="panel-s">Receipts are issued automatically</div></div></div>' +
        '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Date</th><th>Amount</th><th>Mode</th><th>Reference</th><th>Status</th></tr></thead><tbody>' +
        f.history.map(function (h, i) {
          return '<tr class="tbl-row-in" style="animation-delay:' + (i * 60) + 'ms">' +
            '<td>' + h.d + '</td><td><b style="font-family:var(--display)">' + inr(h.amt) + '</b></td>' +
            '<td>' + h.mode + '</td><td class="mono">' + h.ref + '</td>' +
            '<td><span class="pill ' + (h.state === 'Paid' ? 'p-enrol' : 'p-fee') + '"><i></i>' + h.state + '</span></td></tr>';
        }).join('') + '</tbody></table></div></div>' +
    '</div>' +
    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Fee breakdown</div><div class="panel-s">What the ' + inr(f.total) + ' covers</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"donut","size":190,"stroke":24,"center":"' + inr(f.total) + '","centerLabel":"Total","items":[' +
          '{"label":"Classroom teaching","value":46000},{"label":"Assessment & mocks","value":14000},' +
          '{"label":"Study material","value":11000},{"label":"Mentorship & doubt desk","value":7000}]}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Instalment schedule</div><div class="panel-s">Two paid, one open</div></div></div>' +
        '<div>' +
          instRow('Instalment 1', 30000, '12 March 2026', true) +
          instRow('Instalment 2', 20000, '18 June 2026', true) +
          instRow('Instalment 3', 28000, '10 September 2026', false) +
        '</div></div>' +
    '</div>';
  }

  function instRow(n, amt, date, paid) {
    return '<div class="list-i">' +
      '<span class="check' + (paid ? ' on' : '') + '"></span>' +
      '<div class="list-b"><div class="list-t">' + n + ' — ' + inr(amt) + '</div><div class="list-m">' + date + '</div></div>' +
      '<div class="list-r">' + (paid ? '<span class="chip chip-mint">Paid</span>' :
        '<button class="btn btn-accent btn-sm" data-pay>Pay now</button>') + '</div>' +
    '</div>';
  }

  /* =======================================================================
     MENTOR
     ======================================================================= */
  function vMentor() {
    var f = D.faculty[0];
    return '' +
    '<div class="row r-32">' +
      '<div class="panel" style="margin:0;overflow:hidden">' +
        '<div style="aspect-ratio:3/2.4;position:relative;background:var(--ink-2)">' + U.portrait(f.seed + f.name) + '</div>' +
        '<div class="panel-body">' +
          '<div class="d4">' + f.name + '</div>' +
          '<div style="font-family:var(--display);font-size:.68rem;font-weight:600;letter-spacing:.13em;text-transform:uppercase;color:var(--vermilion);margin-top:6px">' + f.role + '</div>' +
          '<p style="font-size:.88rem;color:var(--text-soft);margin-top:14px;line-height:1.6">' +
            'Your assigned mentor since March 2026. Specialises in ' + f.spec + '. Fortnightly one-to-one reviews of fifteen minutes, recorded in this portal.</p>' +
          '<div class="subj-stats" style="margin-top:18px;border:1px solid var(--line-soft);border-radius:12px;overflow:hidden;grid-template-columns:repeat(3,1fr)">' +
            '<div class="ss"><b>' + f.exp + '</b><span>Experience</span></div>' +
            '<div class="ss"><b>' + f.students + '</b><span>Mentored</span></div>' +
            '<div class="ss"><b>9</b><span>Your reviews</span></div>' +
          '</div>' +
          '<button class="btn btn-indigo btn-sm mt-m" style="width:100%" data-book>Request a review slot</button>' +
        '</div>' +
      '</div>' +
      '<div class="panel" style="margin:0"><div class="panel-head"><div><div class="panel-t">Review history</div>' +
        '<div class="panel-s">Every conversation, with what was agreed</div></div></div>' +
        '<div class="panel-body"><div class="tl">' +
          review('Review 09 — after Mock 08', 'Rank improved to 124. Physics accuracy still the weak link at 71%. Agreed: Rotational Motion redo, 40 problems by 24 August, then re-test.', '14 August 2026', '#0E9E6E') +
          review('Review 08 — after Mock 07', 'Chemistry crossed 85% for the first time. Biology plateau discussed. Agreed: Plant Physiology second reading before Mock 08.', '31 July 2026', '#3B2AE0') +
          review('Review 07 — mid-term checkpoint', 'Attendance dipped to 88% in June. Cause identified as travel. Agreed: shift to hybrid attendance on Tuesdays.', '17 July 2026', '#B0801E') +
          review('Review 06 — parent checkpoint', 'Term progress explained to family. Score trajectory on target for the first-quarter goal set in March.', '3 July 2026', '#C13584') +
          review('Review 05 — after Mock 05', 'Time-per-question in Physics too high at 82 seconds. Agreed: timed 30-question drills, three per week.', '19 June 2026', '#0E86C4') +
        '</div></div></div>' +
    '</div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Agreed actions</div><div class="panel-s">From the most recent review · due before Mock 09</div></div></div>' +
      '<div>' +
        action('Rotational Motion — 40 problems', 'Physics · due 24 August', false) +
        action('Modern Physics — theory second pass', 'Physics · due 22 August', false) +
        action('Plant Physiology — short notes', 'Biology · due 20 August', true) +
        action('Timed drill set 12', 'All subjects · due 21 August', true) +
      '</div></div>';
  }

  function review(t, d, m, c) {
    return '<div class="tl-i" style="--c:' + c + '"><div class="tl-t">' + t + '</div>' +
      '<div class="tl-d">' + d + '</div><div class="tl-m">' + m + '</div></div>';
  }
  function action(t, m, done) {
    return '<div class="list-i"><span class="check' + (done ? ' on' : '') + '" data-check></span>' +
      '<div class="list-b"><div class="list-t">' + t + '</div><div class="list-m">' + m + '</div></div></div>';
  }

  /* =======================================================================
     MESSAGES
     ======================================================================= */
  function vMessages() {
    return '<div class="panel"><div class="panel-head"><div><div class="panel-t">Inbox</div>' +
      '<div class="panel-s">' + P.messages.filter(function (m) { return m.unread; }).length + ' unread</div></div>' +
      '<div class="panel-r"><button class="btn btn-ghost btn-sm" id="markRead">Mark all read</button></div></div>' +
      '<div class="msg-list" id="msgList">' + P.messages.map(function (m, i) {
        return '<div class="msg-i' + (m.unread ? ' unread' : '') + '" style="animation:rowIn .45s var(--ease) both;animation-delay:' + (i * 55) + 'ms">' +
          U.avatar(m.f) +
          '<div class="msg-b"><div class="msg-t">' + m.t + '</div>' +
          '<div style="font-size:.72rem;color:var(--text-mute);margin-top:2px">' + m.f + '</div>' +
          '<div class="msg-p">' + m.p + '</div></div>' +
          '<div class="msg-time">' + m.time + '</div>' +
        '</div>';
      }).join('') + '</div></div>';
  }

  /* ---------- shared -------------------------------------------------------- */
  function kpi(label, value, color, note, suf) {
    return '<div class="kpi" style="--k:' + color + '">' +
      '<div class="kpi-l">' + label + '</div>' +
      '<div class="kpi-v num" data-count="' + value + '" data-comma="in"' + (suf ? ' data-suf="' + suf + '"' : '') + '>0</div>' +
      '<div class="kpi-f"><span class="kpi-n">' + note + '</span></div></div>';
  }

  /* =======================================================================
     ROUTER
     ======================================================================= */
  var VIEWS = {
    dashboard:   { title: 'Dashboard',   sub: 'NEET 2027 · Classroom Batch A',           render: vDashboard },
    classes:     { title: 'My Classes',  sub: 'Timetable, recordings and today\'s sessions', render: vClasses },
    assignments: { title: 'Assignments', sub: 'Open work and graded submissions',        render: vAssignments },
    mocks:       { title: 'Mock Tests',  sub: 'Score, rank, accuracy and time taken',    render: vMocks },
    attendance:  { title: 'Attendance',  sub: 'Monthly record and missed sessions',      render: vAttendance },
    performance: { title: 'Performance', sub: 'Physics, Chemistry and Biology in detail', render: vPerformance },
    fees:        { title: 'Fees',        sub: 'Instalments, receipts and what is due',   render: vFees },
    mentor:      { title: 'Mentor',      sub: 'Dr. Neeraj Verma · assigned since March 2026', render: vMentor },
    messages:    { title: 'Messages',    sub: 'Faculty, assessment cell and admissions',  render: vMessages }
  };
  var current = 'dashboard';

  function go(name) {
    var v = VIEWS[name];
    if (!v) return;
    current = name;
    $('#viewTitle').textContent = v.title;
    $('#viewSub').textContent = v.sub;
    $$('.side-i[data-view]').forEach(function (b) { b.classList.toggle('on', b.dataset.view === name); });
    $$('.view').forEach(function (p) { p.classList.toggle('on', p.dataset.viewPane === name); });

    var pane = $('#v-' + name);
    pane.innerHTML = v.render();
    U.icons(pane);
    hydrate(pane);
    if (history.replaceState) history.replaceState(null, '', '#' + name);
    document.body.classList.remove('side-open');
    $('.app-body').scrollTop = 0;
  }

  function hydrate(root) {
    $$('[data-chart]', root).forEach(function (n) { if (window.Charts) window.Charts.render(n); });
    $$('[data-count]', root).forEach(function (n) { M.count(n); });
    $$('.fee-track', root).forEach(function (t) {
      var i = t.querySelector('i'), v = t.style.getPropertyValue('--v');
      i.style.width = '0';
      requestAnimationFrame(function () { i.style.width = v; });
    });
    $$('[data-check]', root).forEach(function (c) {
      c.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 12.5 9 17.5 20 6.5"/></svg>';
      c.addEventListener('click', function () {
        var on = c.classList.toggle('on');
        M.toast(on ? 'Marked complete' : 'Marked incomplete');
      });
    });
    $$('.check:not([data-check])', root).forEach(function (c) {
      c.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 12.5 9 17.5 20 6.5"/></svg>';
    });
    $$('[data-jump]', root).forEach(function (b) {
      b.addEventListener('click', function () { go(b.dataset.jump); });
    });
    $$('[data-submit]', root).forEach(function (b) {
      b.addEventListener('click', function () { M.toast('Submission window opens in the live build', 'ok'); });
    });
    $$('[data-pay]', root).forEach(function (b) {
      b.addEventListener('click', function () { M.toast('Payment is disabled in this demonstration build'); });
    });
    var bk = $('[data-book]', root);
    if (bk) bk.addEventListener('click', function () { M.toast('Review slot requested — Dr. Verma will confirm by tomorrow', 'ok'); });
    var mr = $('#markRead', root);
    if (mr) mr.addEventListener('click', function () {
      $$('.msg-i.unread', root).forEach(function (m) { m.classList.remove('unread'); });
      $$('.side-i[data-view=messages] .badge').forEach(function (b) { b.remove(); });
      M.toast('All messages marked as read');
    });
  }

  function boot() {
    U.icons();
    $$('.side-i[data-view]').forEach(function (b) {
      b.addEventListener('click', function () { go(b.dataset.view); });
    });
    var burger = $('.app-burger');
    if (burger) burger.addEventListener('click', function () { document.body.classList.toggle('side-open'); });
    document.addEventListener('click', function (e) {
      if (document.body.classList.contains('side-open') &&
          !e.target.closest('.app-side') && !e.target.closest('.app-burger')) {
        document.body.classList.remove('side-open');
      }
    });
    var start = (location.hash || '').replace('#', '');
    go(VIEWS[start] ? start : 'dashboard');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

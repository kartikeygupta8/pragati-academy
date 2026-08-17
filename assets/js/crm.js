/* ==========================================================================
   PRAGATI ACADEMY — Admissions CRM
   Ten views, a draggable pipeline, a lead drawer and live-recalculating stats.
   All data is fictional demo content from data.js.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.DATA, U = window.UI, M = window.Motion;
  if (!D) return;

  var leads = D.leads.map(function (l) { return Object.assign({}, l); });
  var stages = D.stages;
  var C = D.crm;
  var inr = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var stageOf = {};
  stages.forEach(function (s) { stageOf[s.id] = s; });

  var SEG_LABEL = { new: 'New', qual: 'Qualified', couns: 'Counselling', fee: 'Fee talk', app: 'Application', enrol: 'Enrolled' };

  function countStage(id) { return leads.filter(function (l) { return l.stage === id; }).length; }
  function pill(stage) {
    var s = stageOf[stage] || { label: 'Lost' };
    return '<span class="pill ' + (D.stagePill[stage] || 'p-lost') + '"><i></i>' + s.label + '</span>';
  }
  function scoreTone(n) { return n >= 85 ? 'chip-mint' : n >= 70 ? 'chip-gold' : 'chip'; }

  /* =======================================================================
     VIEW: DASHBOARD
     ======================================================================= */
  function vDashboard() {
    var k = C.metrics.map(function (m, i) {
      return '<div class="kpi" style="--k:' + m.color + '">' +
        '<div class="kpi-l">' + m.k + '</div>' +
        '<div class="kpi-v num" data-count="' + m.v + '" data-comma="in">0</div>' +
        '<div class="kpi-f">' +
          '<span class="kpi-d ' + (m.up ? 'up' : 'down') + '"><i data-i="' + (m.up ? 'arrowUp' : 'arrowDown') + '"></i>' + m.d + '%</span>' +
          '<span class="kpi-n">' + m.note + '</span>' +
        '</div>' +
        '<figure class="kpi-spark" data-chart=\'{"type":"spark","height":30,"color":"' + m.color + '","data":[' + m.spark.join(',') + ']}\'></figure>' +
      '</div>';
    }).join('');

    return '' +
    '<div class="row r-5">' + k + '</div>' +

    '<div class="row r-23">' +
      '<div class="panel">' +
        '<div class="panel-head">' +
          '<div><div class="panel-t">Enquiries, qualified and enrolments</div><div class="panel-s">Rolling eight months · demonstration data</div></div>' +
          '<div class="panel-r"><span class="chip chip-mint chip-dot">Live</span></div>' +
        '</div>' +
        '<div class="panel-body">' +
          '<figure data-chart=\'{"type":"line","height":270,"area":false,"labels":' + JSON.stringify(C.months) + ',"series":' + JSON.stringify(C.trend) + '}\'></figure>' +
        '</div>' +
      '</div>' +
      '<div class="panel">' +
        '<div class="panel-head"><div><div class="panel-t">Conversion funnel</div><div class="panel-s">Enquiry → enrolment</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"funnel","stages":' + JSON.stringify(C.funnel) + '}\'></figure></div>' +
      '</div>' +
    '</div>' +

    '<div class="panel">' +
      '<div class="panel-head">' +
        '<div><div class="panel-t">Pipeline</div><div class="panel-s">Drag a card to move a lead between stages — counts and the funnel recalculate</div></div>' +
        '<div class="panel-r"><button class="btn btn-ghost btn-sm" data-view-jump="leads">Open leads table</button></div>' +
      '</div>' +
      '<div class="panel-body"><div class="kan" id="kanban"></div></div>' +
    '</div>' +

    '<div class="row r-3">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Lead sources</div><div class="panel-s">Where the 1,284 enquiries came from</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"stack","items":' + JSON.stringify(C.sources) + '}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Demand by course</div><div class="panel-s">Enquiry volume</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"hbar","items":' + JSON.stringify(C.courses) + '}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Activity</div><div class="panel-s">Everything the team touched today</div></div></div>' +
        '<div class="panel-body"><div class="tl">' + C.activity.map(function (a, i) {
          return '<div class="tl-i" style="--c:' + a.c + ';animation-delay:' + (i * 70) + 'ms">' +
            '<div class="tl-t">' + a.t + '</div><div class="tl-d">' + a.d + '</div><div class="tl-m">' + a.m + '</div></div>';
        }).join('') + '</div></div></div>' +
    '</div>';
  }

  /* ---------- Kanban ------------------------------------------------------- */
  function renderKanban() {
    var box = $('#kanban');
    if (!box) return;
    box.innerHTML = stages.map(function (s) {
      var items = leads.filter(function (l) { return l.stage === s.id; });
      return '<div class="kan-col" data-stage="' + s.id + '">' +
        '<div class="kan-h"><span class="kan-dot" style="background:' + s.color + '"></span>' +
          '<span class="kan-t">' + s.label + '</span>' +
          '<span class="kan-c" data-count-for="' + s.id + '">' + items.length + '</span></div>' +
        '<div class="kan-list">' + items.map(function (l, i) {
          return '<article class="kan-card" draggable="true" data-id="' + l.id + '" style="animation-delay:' + (i * 45) + 'ms">' +
            '<div class="kan-n">' + l.name + '</div>' +
            '<div class="kan-m">' + l.course + ' · ' + l.city + '</div>' +
            '<div class="kan-f">' + U.avatar(l.counsellor) +
              '<span style="font-size:.7rem;color:var(--text-mute)">' + l.counsellor.split(' ')[0] + '</span>' +
              '<span class="kan-time">' + (l.stage === 'enrol' ? 'Enrolled' : l.next.split(',')[0]) + '</span>' +
            '</div>' +
          '</article>';
        }).join('') + '</div>' +
      '</div>';
    }).join('');
    bindDrag();
  }

  function bindDrag() {
    var dragged = null;
    $$('.kan-card').forEach(function (c) {
      c.addEventListener('dragstart', function (e) {
        dragged = c;
        c.classList.add('drag');
        e.dataTransfer.effectAllowed = 'move';
        try { e.dataTransfer.setData('text/plain', c.dataset.id); } catch (err) {}
      });
      c.addEventListener('dragend', function () { c.classList.remove('drag'); dragged = null; });
      c.addEventListener('click', function () { openDrawer(c.dataset.id); });
    });
    $$('.kan-col').forEach(function (col) {
      col.addEventListener('dragover', function (e) { e.preventDefault(); col.classList.add('drop'); });
      col.addEventListener('dragleave', function () { col.classList.remove('drop'); });
      col.addEventListener('drop', function (e) {
        e.preventDefault();
        col.classList.remove('drop');
        if (!dragged) return;
        var id = dragged.dataset.id;
        var to = col.dataset.stage;
        var lead = leads.filter(function (l) { return l.id === id; })[0];
        if (!lead || lead.stage === to) return;
        lead.stage = to;
        renderKanban();
        refreshFunnel();
        M.toast(lead.name + ' moved to ' + stageOf[to].label);
      });
    });
  }

  function refreshFunnel() {
    var f = [
      { label: 'Enquiries', value: C.funnel[0].value },
      { label: 'Qualified', value: C.funnel[1].value },
      { label: 'Counselling Sessions', value: C.funnel[2].value },
      { label: 'Applications', value: C.funnel[3].value },
      { label: 'Enrolments', value: countStage('enrol') + 55 }
    ];
    var node = $('#v-dashboard [data-chart*="funnel"]');
    if (node && window.Charts) window.Charts.draw(node, { type: 'funnel', stages: f });
  }

  /* =======================================================================
     VIEW: LEADS
     ======================================================================= */
  var leadFilter = { stage: 'all', course: 'all', counsellor: 'all', q: '' };
  var sortKey = 'score', sortDir = -1;

  function vLeads() {
    var courses = ['all'].concat(D.programs.map(function (p) { return p.name; }));
    var couns = ['all'].concat(D.counsellors.map(function (c) { return c.name; }));
    return '' +
    '<div class="panel">' +
      '<div class="panel-head">' +
        '<div><div class="panel-t">All leads</div><div class="panel-s"><span id="leadCount">' + leads.length + '</span> records · click any row to open the full history</div></div>' +
        '<div class="panel-r">' +
          '<button class="btn btn-ghost btn-sm" id="exportLeads"><i data-i="download" class="ico"></i>Export</button>' +
          '<button class="btn btn-indigo btn-sm" id="addLead2"><i data-i="plus" class="ico"></i>New lead</button>' +
        '</div>' +
      '</div>' +
      '<div class="filters">' +
        '<div class="seg" id="stageSeg">' +
          '<span class="seg-ink"></span>' +
          '<button class="active" data-stage="all">All</button>' +
          stages.map(function (s) { return '<button data-stage="' + s.id + '">' + SEG_LABEL[s.id] + '</button>'; }).join('') +
        '</div>' +
        '<select class="sel-input" id="fCourse">' + courses.map(function (c) { return '<option value="' + c + '">' + (c === 'all' ? 'All courses' : c) + '</option>'; }).join('') + '</select>' +
        '<select class="sel-input" id="fCouns">' + couns.map(function (c) { return '<option value="' + c + '">' + (c === 'all' ? 'All counsellors' : c) + '</option>'; }).join('') + '</select>' +
        '<button class="btn btn-ghost btn-sm" id="clearFilters" style="margin-left:auto">Clear</button>' +
      '</div>' +
      '<div class="tbl-wrap"><table class="tbl">' +
        '<thead><tr>' +
          '<th class="sortable" data-sort="name">Student <span class="sort-i">▲</span></th>' +
          '<th class="sortable" data-sort="course">Course <span class="sort-i">▲</span></th>' +
          '<th>City</th><th>Source</th><th>Counsellor</th>' +
          '<th class="sortable" data-sort="score">Score <span class="sort-i">▲</span></th>' +
          '<th>Status</th><th>Next follow-up</th>' +
        '</tr></thead>' +
        '<tbody id="leadRows"></tbody>' +
      '</table></div>' +
    '</div>';
  }

  function filteredLeads() {
    var q = leadFilter.q.toLowerCase();
    return leads.filter(function (l) {
      if (leadFilter.stage !== 'all' && l.stage !== leadFilter.stage) return false;
      if (leadFilter.course !== 'all' && l.course !== leadFilter.course) return false;
      if (leadFilter.counsellor !== 'all' && l.counsellor !== leadFilter.counsellor) return false;
      if (q && (l.name + l.course + l.city + l.source + l.counsellor + l.phone + l.id).toLowerCase().indexOf(q) === -1) return false;
      return true;
    }).sort(function (a, b) {
      var x = a[sortKey], y = b[sortKey];
      if (typeof x === 'string') return x.localeCompare(y) * sortDir;
      return (x - y) * sortDir;
    });
  }

  function renderLeadRows() {
    var body = $('#leadRows');
    if (!body) return;
    var rows = filteredLeads();
    var cnt = $('#leadCount');
    if (cnt) cnt.textContent = rows.length;
    if (!rows.length) {
      body.innerHTML = '<tr><td colspan="8"><div class="empty"><i data-i="search"></i><div>No leads match these filters.</div></div></td></tr>';
      U.icons(body);
      return;
    }
    body.innerHTML = rows.map(function (l, i) {
      return '<tr class="tbl-row-in" data-id="' + l.id + '" style="animation-delay:' + Math.min(i * 22, 400) + 'ms">' +
        '<td><div class="who">' + U.avatar(l.name) + '<div><div class="who-n">' + l.name + '</div><div class="who-m">' + l.id + ' · ' + l.phone + '</div></div></div></td>' +
        '<td>' + l.course + '</td>' +
        '<td>' + l.city + '</td>' +
        '<td><span class="chip">' + l.source + '</span></td>' +
        '<td><div class="who">' + U.avatar(l.counsellor, 'avatar-sm') + '<span style="font-size:.82rem">' + l.counsellor + '</span></div></td>' +
        '<td><span class="chip ' + scoreTone(l.score) + '">' + l.score + '</span></td>' +
        '<td>' + pill(l.stage) + '</td>' +
        '<td style="white-space:nowrap;font-size:.82rem;color:' + (/Today/.test(l.next) ? 'var(--vermilion)' : 'var(--text-soft)') + '">' + l.next + '</td>' +
      '</tr>';
    }).join('');
    $$('#leadRows tr[data-id]').forEach(function (tr) {
      tr.addEventListener('click', function () { openDrawer(tr.dataset.id); });
    });
  }

  function bindLeadFilters() {
    var seg = $('#stageSeg');
    if (seg) {
      moveInk(seg);
      seg.addEventListener('click', function (e) {
        var b = e.target.closest('[data-stage]');
        if (!b) return;
        seg.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        leadFilter.stage = b.dataset.stage;
        moveInk(seg);
        renderLeadRows();
      });
      window.addEventListener('resize', function () { moveInk(seg); });
    }
    var fc = $('#fCourse'); if (fc) fc.addEventListener('change', function () { leadFilter.course = fc.value; renderLeadRows(); });
    var fu = $('#fCouns'); if (fu) fu.addEventListener('change', function () { leadFilter.counsellor = fu.value; renderLeadRows(); });
    var cl = $('#clearFilters');
    if (cl) cl.addEventListener('click', function () {
      leadFilter = { stage: 'all', course: 'all', counsellor: 'all', q: '' };
      if (fc) fc.value = 'all'; if (fu) fu.value = 'all';
      var gs = $('#globalSearch'); if (gs) gs.value = '';
      if (seg) { seg.querySelectorAll('button').forEach(function (x, i) { x.classList.toggle('active', i === 0); }); moveInk(seg); }
      renderLeadRows();
    });
    $$('#v-leads th.sortable').forEach(function (th) {
      th.addEventListener('click', function () {
        var k = th.dataset.sort;
        if (sortKey === k) sortDir *= -1; else { sortKey = k; sortDir = k === 'score' ? -1 : 1; }
        $$('#v-leads th.sortable').forEach(function (x) { x.classList.remove('asc', 'desc'); });
        th.classList.add(sortDir === 1 ? 'asc' : 'desc');
        renderLeadRows();
      });
    });
    var ex = $('#exportLeads');
    if (ex) ex.addEventListener('click', function () { M.toast(filteredLeads().length + ' leads would export to CSV in the live build'); });
    var al = $('#addLead2');
    if (al) al.addEventListener('click', addLead);
  }

  function moveInk(seg) {
    var ink = seg.querySelector('.seg-ink');
    var act = seg.querySelector('button.active');
    if (!ink || !act) return;
    ink.style.width = act.offsetWidth + 'px';
    ink.style.transform = 'translateX(' + (act.offsetLeft - 3) + 'px)';
  }

  /* =======================================================================
     VIEW: COUNSELLING / APPLICATIONS / ENROLMENTS  (stage-scoped boards)
     ======================================================================= */
  function stageTable(stageId, title, sub, cols) {
    var rows = leads.filter(function (l) { return l.stage === stageId; });
    return '<div class="panel">' +
      '<div class="panel-head"><div><div class="panel-t">' + title + '</div><div class="panel-s">' + sub + '</div></div>' +
      '<div class="panel-r"><span class="chip chip-indigo">' + rows.length + ' records</span></div></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr>' + cols.map(function (c) { return '<th>' + c + '</th>'; }).join('') + '</tr></thead>' +
      '<tbody>' + rows.map(function (l, i) {
        return '<tr class="tbl-row-in" data-id="' + l.id + '" style="animation-delay:' + (i * 40) + 'ms">' +
          '<td><div class="who">' + U.avatar(l.name) + '<div><div class="who-n">' + l.name + '</div><div class="who-m">' + l.id + ' · ' + l.city + '</div></div></div></td>' +
          '<td>' + l.course + '</td>' +
          '<td><div class="who">' + U.avatar(l.counsellor, 'avatar-sm') + '<span style="font-size:.82rem">' + l.counsellor + '</span></div></td>' +
          '<td style="font-size:.82rem">' + l.next + '</td>' +
          '<td><span class="chip ' + scoreTone(l.score) + '">' + l.score + '</span></td>' +
        '</tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function vCounselling() {
    var sessions = leads.filter(function (l) { return l.stage === 'couns'; });
    return '' +
    '<div class="row r-4">' +
      kpi('Sessions booked', 176, '#B0801E', 'Last 30 days') +
      kpi('Held this week', 23, '#3B2AE0', '6 pending') +
      kpi('Show-up rate', 87, '#0E9E6E', 'Percent, booked → attended', '%') +
      kpi('Avg duration', 34, '#0E86C4', 'Minutes per session', 'm') +
    '</div>' +
    '<div class="row r-23">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Session outcome by counsellor</div><div class="panel-s">Sessions held that reached an application</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"bar","height":250,"yfmt":"pct","max":100,"labels":' +
        JSON.stringify(D.counsellors.map(function (c) { return c.name.split(' ')[0]; })) +
        ',"series":[{"name":"Reached application","data":[64,58,53,47,44]}]}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Today\'s schedule</div><div class="panel-s">' + sessions.length + ' booked</div></div></div>' +
        '<div>' + sessions.slice(0, 6).map(function (l) {
          return '<div class="list-i" data-id="' + l.id + '">' +
            '<span class="list-ic" style="background:rgba(176,128,30,.14);color:#8A6410"><i data-i="chat"></i></span>' +
            '<div class="list-b"><div class="list-t">' + l.name + '</div><div class="list-m">' + l.course + ' · ' + l.counsellor + '</div></div>' +
            '<div class="list-r"><div style="font-size:.78rem;font-family:var(--display);font-weight:600">' + (l.next.split(',')[1] || '').trim() + '</div>' +
            '<div style="font-size:.7rem;color:var(--text-mute)">' + l.next.split(',')[0] + '</div></div>' +
          '</div>';
        }).join('') + '</div></div>' +
    '</div>' +
    stageTable('couns', 'Counselling scheduled', 'Leads with a confirmed slot', ['Student', 'Course', 'Counsellor', 'Session', 'Score']);
  }

  function vApplications() {
    var docs = ['Class 10 marksheet', 'Class 12 marksheet', 'Photograph', 'ID proof'];
    var rows = leads.filter(function (l) { return l.stage === 'app'; });
    return '' +
    '<div class="row r-4">' +
      kpi('Applications', 94, '#C13584', 'Last 30 days') +
      kpi('Documents pending', 31, '#B0801E', 'Across all applications') +
      kpi('Avg time to submit', 1.8, '#3B2AE0', 'Days from counselling', 'd') +
      kpi('Converted', 61, '#0E9E6E', '64.9% of applications') +
    '</div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Open applications</div><div class="panel-s">Document checklist per applicant</div></div></div>' +
      '<div>' + rows.map(function (l, i) {
        var done = 2 + (i % 3);
        return '<div class="list-i" data-id="' + l.id + '">' +
          U.avatar(l.name) +
          '<div class="list-b"><div class="list-t">' + l.name + '</div><div class="list-m">' + l.course + ' · ' + l.city + ' · ' + l.counsellor + '</div>' +
            '<div style="display:flex;gap:6px;margin-top:9px;flex-wrap:wrap">' +
            docs.map(function (d, j) {
              return '<span class="chip ' + (j < done ? 'chip-mint' : '') + '">' + (j < done ? '✓ ' : '') + d + '</span>';
            }).join('') + '</div>' +
          '</div>' +
          '<div class="list-r"><span class="chip ' + (done === 4 ? 'chip-mint' : 'chip-gold') + '">' + done + '/4 docs</span></div>' +
        '</div>';
      }).join('') + '</div></div>' +
    stageTable('app', 'Applications in progress', 'Submitted, awaiting fee clearance', ['Student', 'Course', 'Counsellor', 'Next step', 'Score']);
  }

  function vEnrolments() {
    var rows = leads.filter(function (l) { return l.stage === 'enrol'; });
    var revenue = 61 * 71000;
    return '' +
    '<div class="row r-4">' +
      kpi('Enrolments', 61, '#0E9E6E', 'Last 30 days') +
      kpi('Fee collected', 32, '#3B2AE0', 'Lakh · demonstration figure', 'L', '₹') +
      kpi('Average ticket', 71, '#B0801E', 'Thousand per enrolment', 'k', '₹') +
      kpi('Full-payment share', 38, '#0E86C4', 'Percent paid upfront', '%') +
    '</div>' +
    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Enrolments by program</div><div class="panel-s">Last 30 days</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"hbar","items":[{"label":"NEET 2027","value":24},{"label":"JEE 2027","value":17},{"label":"Foundation 9–10","value":11},{"label":"UPSC Foundation","value":5},{"label":"Data & Technology","value":3},{"label":"Career Programs","value":1}]}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Payment mode</div><div class="panel-s">How the first instalment arrived</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"donut","size":190,"stroke":24,"center":"61","centerLabel":"Enrolments","items":[{"label":"UPI","value":34},{"label":"Net banking","value":15},{"label":"Card","value":8},{"label":"Cash / DD","value":4}]}\'></figure></div></div>' +
    '</div>' +
    stageTable('enrol', 'Enrolled students', 'Moved to the student portal automatically', ['Student', 'Course', 'Counsellor', 'Status', 'Score']);
  }

  /* =======================================================================
     VIEW: FOLLOW-UPS
     ======================================================================= */
  function vFollowups() {
    var groups = [
      { t: 'Overdue', tone: 'p-fee', test: function (l) { return /Today/.test(l.next) && l.score < 70; } },
      { t: 'Due today', tone: 'p-couns', test: function (l) { return /Today/.test(l.next); } },
      { t: 'Tomorrow', tone: 'p-qual', test: function (l) { return /Tomorrow/.test(l.next); } },
      { t: 'This week', tone: 'p-new', test: function (l) { return !/Today|Tomorrow|Enrolled/.test(l.next); } }
    ];
    var used = {};
    return '' +
    '<div class="row r-4">' +
      kpi('Follow-ups due', 24, '#E8410F', 'Across the team today') +
      kpi('Completed', 15, '#0E9E6E', '62.5% of today\'s list') +
      kpi('Automated', 38, '#3B2AE0', 'WhatsApp sequence messages') +
      kpi('Avg response', 4.2, '#B0801E', 'Hours to first reply', 'h') +
    '</div>' +
    groups.map(function (g) {
      var rows = leads.filter(function (l) {
        if (used[l.id]) return false;
        var ok = g.test(l);
        if (ok) used[l.id] = 1;
        return ok;
      });
      if (!rows.length) return '';
      return '<div class="panel"><div class="panel-head"><div><div class="panel-t">' + g.t + '</div>' +
        '<div class="panel-s">' + rows.length + ' leads</div></div>' +
        '<div class="panel-r"><span class="pill ' + g.tone + '"><i></i>' + g.t + '</span></div></div>' +
        '<div>' + rows.map(function (l) {
          return '<div class="list-i" data-id="' + l.id + '">' +
            '<span class="check" data-check></span>' +
            U.avatar(l.name) +
            '<div class="list-b"><div class="list-t">' + l.name + '</div>' +
            '<div class="list-m">' + l.course + ' · ' + l.counsellor + ' · ' + l.next + '</div></div>' +
            '<div class="list-r">' + pill(l.stage) + '</div>' +
          '</div>';
        }).join('') + '</div></div>';
    }).join('');
  }

  /* =======================================================================
     VIEW: COUNSELLOR DESK
     ======================================================================= */
  function vCounsellor() {
    var t = C.today;
    return '' +
    '<div class="pt-hero">' +
      '<div class="pt-hero-in">' +
        '<div>' +
          '<div class="pt-hi">Good morning, Neha.</div>' +
          '<p class="pt-sub">You have ' + (t.calls - t.callsDone) + ' calls left, ' + (t.sessions - t.sessionsDone) + ' counselling sessions this afternoon and ' + t.pendingPayments + ' payments to chase.</p>' +
        '</div>' +
        '<div class="pt-next"><div class="lab">Next session</div><div class="val">Aditya Verma</div><div class="cd">Today · 4:00 PM · NEET 2027</div></div>' +
      '</div>' +
    '</div>' +

    '<div class="row r-3">' +
      progressCard('Today\'s calls', t.callsDone, t.calls, '#3B2AE0', 'phone') +
      progressCard('Follow-ups due', t.followupsDone, t.followups, '#E8410F', 'clock') +
      progressCard('Counselling sessions', t.sessionsDone, t.sessions, '#B0801E', 'chat') +
    '</div>' +

    '<div class="row r-3">' +
      kpi('Applications', t.applications, '#C13584', 'Started today') +
      kpi('Conversions', t.conversions, '#0E9E6E', 'Enrolled today') +
      kpi('Pending payments', t.pendingPayments, '#B0801E', inr(t.pendingValue) + ' outstanding') +
    '</div>' +

    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Call volume by hour</div><div class="panel-s">Today · your desk</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"bar","height":240,"labels":' + JSON.stringify(C.callsByHour.labels) +
        ',"series":[{"name":"Calls","data":' + JSON.stringify(C.callsByHour.data) + ',"color":"#3B2AE0"}]}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Stage conversion trend</div><div class="panel-s">Eight-week rolling rate</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"line","height":240,"area":false,"yfmt":"pct","max":100,"labels":' +
        JSON.stringify(C.convWeeks) + ',"series":' + JSON.stringify(C.convSeries) + '}\'></figure></div></div>' +
    '</div>' +

    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Pending payments</div><div class="panel-s">' + inr(t.pendingValue) + ' across ' + t.pendingPayments + ' students</div></div>' +
      '<div class="panel-r"><button class="btn btn-indigo btn-sm" id="remindAll"><i data-i="chat" class="ico"></i>Send WhatsApp reminders</button></div></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Student</th><th>Course</th><th>Instalment</th><th>Due</th><th style="text-align:right">Amount</th></tr></thead><tbody>' +
      C.pendingPayments.map(function (p, i) {
        return '<tr class="tbl-row-in" style="animation-delay:' + (i * 45) + 'ms">' +
          '<td><div class="who">' + U.avatar(p.name) + '<div class="who-n">' + p.name + '</div></div></td>' +
          '<td>' + p.course + '</td><td><span class="chip">' + p.status + '</span></td><td>' + p.due + '</td>' +
          '<td style="text-align:right"><b style="font-family:var(--display)">' + inr(p.amount) + '</b></td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  function progressCard(label, done, total, color, ic) {
    var pct = Math.round(done / total * 100);
    return '<div class="metric">' +
      '<figure data-chart=\'{"type":"radial","size":86,"stroke":9,"value":' + pct + ',"color":"' + color + '"}\' style="width:86px;flex:0 0 86px"></figure>' +
      '<div class="metric-b">' +
        '<div class="metric-l">' + label + '</div>' +
        '<div class="metric-v num">' + done + '<span style="color:var(--text-mute);font-size:.55em"> / ' + total + '</span></div>' +
        '<div class="metric-n">' + (total - done) + ' still open</div>' +
      '</div>' +
    '</div>';
  }

  function kpi(label, value, color, note, suf, pre) {
    return '<div class="kpi" style="--k:' + color + '">' +
      '<div class="kpi-l">' + label + '</div>' +
      '<div class="kpi-v num" data-count="' + value + '" data-comma="in"' +
        (suf ? ' data-suf="' + suf + '"' : '') + (pre ? ' data-pre="' + pre + '"' : '') +
        (String(value).indexOf('.') > -1 ? ' data-dec="1"' : '') + '>0</div>' +
      '<div class="kpi-f"><span class="kpi-n">' + note + '</span></div>' +
    '</div>';
  }

  /* =======================================================================
     VIEW: COUNSELLORS
     ======================================================================= */
  function vCounsellors() {
    var max = Math.max.apply(null, D.counsellors.map(function (c) { return c.conv; }));
    return '' +
    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Conversion leaderboard</div><div class="panel-s">Enrolments closed this month</div></div></div>' +
        '<div class="panel-body">' + D.counsellors.map(function (c, i) {
          return '<div class="lead-row">' +
            '<span class="lead-rank">' + (i + 1) + '</span>' +
            U.avatar(c.name) +
            '<div class="lead-meta"><div class="who-n">' + c.name + '</div>' +
              '<div class="lead-bar" style="--v:' + (c.conv / max * 100) + '%"><i></i></div></div>' +
            '<div style="text-align:right"><div class="lead-v num">' + c.conv + '</div>' +
            '<div style="font-size:.68rem;color:var(--text-mute)">of ' + c.leads + ' leads</div></div>' +
          '</div>';
        }).join('') + '</div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Workload vs outcome</div><div class="panel-s">Leads handled and sessions held</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"bar","height":250,"labels":' +
        JSON.stringify(D.counsellors.map(function (c) { return c.name.split(' ')[0]; })) + ',"series":[' +
        '{"name":"Leads handled","data":' + JSON.stringify(D.counsellors.map(function (c) { return c.leads; })) + '},' +
        '{"name":"Sessions held","data":' + JSON.stringify(D.counsellors.map(function (c) { return c.sessions; })) + '}]}\'></figure></div></div>' +
    '</div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Team</div><div class="panel-s">Five counsellors on the admissions desk</div></div></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Counsellor</th><th>Leads</th><th>Sessions</th><th>Enrolments</th><th>Conversion</th><th>Rating</th></tr></thead><tbody>' +
      D.counsellors.map(function (c, i) {
        var rate = (c.conv / c.leads * 100).toFixed(1);
        return '<tr class="tbl-row-in" style="animation-delay:' + (i * 50) + 'ms">' +
          '<td><div class="who">' + U.avatar(c.name) + '<div><div class="who-n">' + c.name + '</div><div class="who-m">Admissions desk</div></div></div></td>' +
          '<td>' + c.leads + '</td><td>' + c.sessions + '</td><td><b style="font-family:var(--display)">' + c.conv + '</b></td>' +
          '<td><span class="chip ' + (rate > 9 ? 'chip-mint' : 'chip-gold') + '">' + rate + '%</span></td>' +
          '<td>★ ' + c.rating + '</td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  /* =======================================================================
     VIEW: REPORTS
     ======================================================================= */
  function vReports() {
    return '' +
    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Pipeline trend</div><div class="panel-s">Eight months · enquiries, qualified, enrolments</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"line","height":280,"area":false,"labels":' + JSON.stringify(C.months) + ',"series":' + JSON.stringify(C.trend) + '}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Conversion by stage</div><div class="panel-s">Where the pipeline leaks</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"funnel","stages":' + JSON.stringify(C.funnel) + '}\'></figure></div></div>' +
    '</div>' +
    '<div class="row r-3">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">By source</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"donut","size":180,"stroke":22,"center":"1,284","centerLabel":"Enquiries","items":' + JSON.stringify(C.sources) + '}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">By course</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"hbar","items":' + JSON.stringify(C.courses) + '}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">By city</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"hbar","items":' + JSON.stringify(C.cities) + '}\'></figure></div></div>' +
    '</div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Weekly conversion rates</div><div class="panel-s">Counselling → application and application → enrolment</div></div>' +
      '<div class="panel-r"><button class="btn btn-ghost btn-sm" id="dlReport"><i data-i="download" class="ico"></i>Download report</button></div></div>' +
      '<div class="panel-body"><figure data-chart=\'{"type":"line","height":260,"area":false,"yfmt":"pct","max":100,"labels":' + JSON.stringify(C.convWeeks) + ',"series":' + JSON.stringify(C.convSeries) + '}\'></figure></div></div>';
  }

  /* =======================================================================
     VIEW: SETTINGS
     ======================================================================= */
  function vSettings() {
    var toggles = [
      ['Auto-assign new leads', 'Round-robin across counsellors with open capacity', true],
      ['WhatsApp instant reply', 'Send the program card within five seconds of an enquiry', true],
      ['24-hour counselling reminder', 'Only to leads without a booked slot', true],
      ['Seat-count urgency messages', 'Uses the live seat number, never a fabricated one', true],
      ['Daily digest to counsellors', '7:30 AM summary of the day\'s follow-ups', true],
      ['Parent copy on fee reminders', 'Mirror payment messages to the registered parent number', false]
    ];
    return '' +
    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Automation</div><div class="panel-s">What runs without a human</div></div></div>' +
        '<div>' + toggles.map(function (t) {
          return '<div class="list-i"><div class="list-b"><div class="list-t">' + t[0] + '</div><div class="list-m">' + t[1] + '</div></div>' +
            '<div class="list-r"><button class="check' + (t[2] ? ' on' : '') + '" data-check aria-pressed="' + t[2] + '"></button></div></div>';
        }).join('') + '</div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Pipeline stages</div><div class="panel-s">Rename, reorder or add a stage</div></div></div>' +
        '<div>' + stages.map(function (s, i) {
          return '<div class="list-i"><span class="kan-dot" style="background:' + s.color + ';width:12px;height:12px"></span>' +
            '<div class="list-b"><div class="list-t">' + s.label + '</div><div class="list-m">' + countStage(s.id) + ' leads currently in this stage</div></div>' +
            '<div class="list-r"><span class="chip">Step ' + (i + 1) + '</span></div></div>';
        }).join('') + '</div></div>' +
    '</div>' +
    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Institute profile</div><div class="panel-s">Shown on quotes, receipts and WhatsApp templates</div></div></div>' +
      '<div class="panel-body"><div class="form-grid" style="margin-top:0">' +
        '<div class="form-row">' +
          '<div class="field"><label>Institute name</label><input value="Pragati Academy" readonly></div>' +
          '<div class="field"><label>Location</label><input value="Gomti Nagar, Lucknow" readonly></div>' +
        '</div>' +
        '<div class="form-row">' +
          '<div class="field"><label>Counselling hours</label><input value="10:00 AM – 7:00 PM" readonly></div>' +
          '<div class="field"><label>Academic year</label><input value="2026 – 2027" readonly></div>' +
        '</div>' +
        '<p style="font-size:.8rem;color:var(--text-mute)">This is a demonstration build — settings are read-only and nothing here is persisted.</p>' +
      '</div></div></div>';
  }

  /* =======================================================================
     LEAD DRAWER
     ======================================================================= */
  function openDrawer(id) {
    var l = leads.filter(function (x) { return x.id === id; })[0];
    if (!l) return;
    var dr = $('#drawer'), bg = $('#drawerBg');
    var timeline = [
      { t: 'Enquiry received', d: 'Source: ' + l.source + ' · assigned to ' + l.counsellor, m: '12 August, 10:24 AM', c: '#3B2AE0' },
      { t: 'Automated course card sent', d: 'WhatsApp · delivered and read', m: '12 August, 10:24 AM', c: '#0E9E6E' },
      { t: 'First call connected', d: '6 min 12 sec · interest confirmed for ' + l.course, m: '12 August, 4:41 PM', c: '#B0801E' },
      { t: 'Counselling slot offered', d: 'Two slots sent, one reserved by the student', m: '13 August, 11:02 AM', c: '#0E86C4' },
      { t: 'Current stage: ' + stageOf[l.stage].label, d: l.note, m: 'Next action ' + l.next, c: stageOf[l.stage].color }
    ];
    dr.innerHTML =
      '<div class="drawer-h">' +
        U.avatar(l.name, 'avatar-lg') +
        '<div style="flex:1;min-width:0">' +
          '<div class="d4">' + l.name + '</div>' +
          '<div style="font-size:.78rem;color:var(--text-mute);margin-top:3px">' + l.id + ' · ' + l.phone + '</div>' +
          '<div style="margin-top:9px;display:flex;gap:6px;flex-wrap:wrap">' + pill(l.stage) +
            '<span class="chip ' + scoreTone(l.score) + '">Lead score ' + l.score + '</span></div>' +
        '</div>' +
        '<button class="icon-btn" id="drawerX" aria-label="Close"><i data-i="close"></i></button>' +
      '</div>' +
      '<div class="drawer-b">' +
        '<dl class="dl">' +
          '<div class="dl-i"><dt>Course</dt><dd>' + l.course + '</dd></div>' +
          '<div class="dl-i"><dt>City</dt><dd>' + l.city + '</dd></div>' +
          '<div class="dl-i"><dt>Source</dt><dd>' + l.source + '</dd></div>' +
          '<div class="dl-i"><dt>Counsellor</dt><dd>' + l.counsellor + '</dd></div>' +
          '<div class="dl-i"><dt>Next follow-up</dt><dd>' + l.next + '</dd></div>' +
          '<div class="dl-i"><dt>Stage</dt><dd>' + stageOf[l.stage].label + '</dd></div>' +
        '</dl>' +
        '<div style="margin-top:22px">' +
          '<div class="panel-t" style="margin-bottom:8px">Counsellor note</div>' +
          '<p style="font-size:.88rem;color:var(--text-soft);line-height:1.6;background:var(--white);border:1px solid var(--line-soft);border-radius:12px;padding:14px">' + l.note + '</p>' +
        '</div>' +
        '<div style="margin-top:24px">' +
          '<div class="panel-t" style="margin-bottom:14px">Activity</div>' +
          '<div class="tl">' + timeline.map(function (t, i) {
            return '<div class="tl-i" style="--c:' + t.c + ';animation-delay:' + (i * 70) + 'ms">' +
              '<div class="tl-t">' + t.t + '</div><div class="tl-d">' + t.d + '</div><div class="tl-m">' + t.m + '</div></div>';
          }).join('') + '</div>' +
        '</div>' +
        '<div style="margin-top:22px">' +
          '<div class="panel-t" style="margin-bottom:10px">Move to stage</div>' +
          '<div style="display:flex;gap:6px;flex-wrap:wrap">' + stages.map(function (s) {
            return '<button class="btn btn-ghost btn-sm" data-move="' + s.id + '"' + (s.id === l.stage ? ' disabled style="opacity:.4"' : '') + '>' + s.label + '</button>';
          }).join('') + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="drawer-f">' +
        '<button class="btn btn-indigo btn-sm" data-act="call"><i data-i="phone" class="ico"></i>Log a call</button>' +
        '<button class="btn btn-ghost btn-sm" data-act="wa"><i data-i="chat" class="ico"></i>WhatsApp</button>' +
      '</div>';

    U.icons(dr);
    dr.classList.add('open');
    bg.classList.add('open');

    $('#drawerX').addEventListener('click', closeDrawer);
    $$('[data-move]', dr).forEach(function (b) {
      b.addEventListener('click', function () {
        l.stage = b.dataset.move;
        closeDrawer();
        rerenderCurrent();
        M.toast(l.name + ' moved to ' + stageOf[l.stage].label);
      });
    });
    $$('[data-act]', dr).forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.act === 'wa') { location.href = 'whatsapp.html'; return; }
        M.toast('Call logged against ' + l.name + ' — follow-up rescheduled');
        closeDrawer();
      });
    });
  }
  function closeDrawer() {
    $('#drawer').classList.remove('open');
    $('#drawerBg').classList.remove('open');
  }

  /* =======================================================================
     ROUTER
     ======================================================================= */
  var VIEWS = {
    dashboard:    { title: 'Dashboard',    sub: 'Admissions overview · last 30 days', render: vDashboard },
    leads:        { title: 'Leads',        sub: 'Every enquiry in one table',          render: vLeads },
    counselling:  { title: 'Counselling',  sub: 'Sessions booked, held and reviewed',  render: vCounselling },
    applications: { title: 'Applications', sub: 'Forms submitted and documents pending', render: vApplications },
    enrolments:   { title: 'Enrolments',   sub: 'Confirmed admissions and fee collection', render: vEnrolments },
    followups:    { title: 'Follow-ups',   sub: 'What the team owes people today',     render: vFollowups },
    counsellor:   { title: 'My Desk',      sub: 'Neha Singh · senior counsellor',      render: vCounsellor },
    counsellors:  { title: 'Counsellors',  sub: 'Team workload and conversion',        render: vCounsellors },
    reports:      { title: 'Reports',      sub: 'Pipeline analytics · demonstration data', render: vReports },
    settings:     { title: 'Settings',     sub: 'Automation rules and pipeline configuration', render: vSettings }
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
    if (name === 'dashboard') renderKanban();
    if (name === 'leads') { bindLeadFilters(); renderLeadRows(); }
    bindRows(pane);
    if (history.replaceState) history.replaceState(null, '', '#' + name);
    document.body.classList.remove('side-open');
    $('.app-body').scrollTop = 0;
  }

  function rerenderCurrent() { go(current); }

  function hydrate(root) {
    $$('[data-chart]', root).forEach(function (n) { if (window.Charts) window.Charts.render(n); });
    $$('[data-count]', root).forEach(function (n) { M.count(n); });
    $$('.lead-bar', root).forEach(function (b) {
      var i = b.querySelector('i');
      var v = b.style.getPropertyValue('--v');
      i.style.width = '0';
      requestAnimationFrame(function () { i.style.width = v; });
    });
    $$('[data-check]', root).forEach(function (c) {
      c.innerHTML = '<svg viewBox="0 0 24 24"><path d="M4 12.5 9 17.5 20 6.5"/></svg>';
      c.addEventListener('click', function (e) {
        e.stopPropagation();
        var on = c.classList.toggle('on');
        c.setAttribute('aria-pressed', on);
      });
    });
    var ra = $('#remindAll', root);
    if (ra) ra.addEventListener('click', function () { M.toast('7 payment reminders queued in the WhatsApp engine', 'ok'); });
    var dl = $('#dlReport', root);
    if (dl) dl.addEventListener('click', function () { M.toast('Report export is disabled in the demonstration build'); });
    $$('[data-view-jump]', root).forEach(function (b) {
      b.addEventListener('click', function () { go(b.dataset.viewJump); });
    });
  }

  function bindRows(root) {
    $$('[data-id]', root).forEach(function (n) {
      if (n.classList.contains('kan-card')) return; // handled in bindDrag
      n.style.cursor = 'pointer';
      n.addEventListener('click', function () { openDrawer(n.dataset.id); });
    });
  }

  /* ---------- New lead ------------------------------------------------------- */
  var seq = 1063;
  function addLead() {
    var names = ['Yash Bhatnagar', 'Riya Kaushik', 'Aman Dixit', 'Sanya Joshi', 'Kunal Sethi', 'Priyanshi Rana'];
    var cities = ['Lucknow', 'Kanpur', 'Prayagraj', 'Sitapur', 'Barabanki'];
    var srcs = ['Instagram', 'Google Search', 'Referral', 'WhatsApp', 'YouTube'];
    var n = names[Math.floor(Math.random() * names.length)];
    var l = {
      id: 'PA-' + (seq++),
      name: n,
      course: D.programs[Math.floor(Math.random() * D.programs.length)].name,
      city: cities[Math.floor(Math.random() * cities.length)],
      source: srcs[Math.floor(Math.random() * srcs.length)],
      counsellor: D.counsellors[Math.floor(Math.random() * D.counsellors.length)].name,
      stage: 'new',
      next: 'Tomorrow, 11:00 AM',
      score: 40 + Math.floor(Math.random() * 35),
      phone: '+91 9•••• ••' + Math.floor(100 + Math.random() * 899),
      note: 'Created from the demo "New lead" action. The WhatsApp engine has already sent the course card.'
    };
    leads.unshift(l);
    rerenderCurrent();
    M.toast(l.name + ' added as a new lead · course card sent on WhatsApp', 'ok');
  }

  /* ---------- Boot ------------------------------------------------------------- */
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
    $('#drawerBg').addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDrawer(); });

    var gs = $('#globalSearch');
    if (gs) gs.addEventListener('input', function () {
      leadFilter.q = gs.value;
      if (current !== 'leads') go('leads');
      else renderLeadRows();
    });
    var al = $('#addLead');
    if (al) al.addEventListener('click', addLead);

    var start = (location.hash || '').replace('#', '');
    go(VIEWS[start] ? start : 'dashboard');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

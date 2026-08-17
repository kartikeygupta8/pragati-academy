/* ==========================================================================
   PRAGATI ACADEMY — WhatsApp automation
   A working conversation simulator (quick-reply buttons actually respond),
   the five-step follow-up sequence, template library and delivery analytics.
   ========================================================================== */
(function () {
  'use strict';

  var D = window.DATA, U = window.UI, M = window.Motion;
  if (!D) return;
  var W = D.whatsapp;

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  function now() {
    var d = new Date();
    var h = d.getHours(), m = String(d.getMinutes()).padStart(2, '0');
    var ap = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return h + ':' + m + ' ' + ap;
  }

  /* =======================================================================
     VIEW: LIVE INBOX
     ======================================================================= */
  var convos = [
    { n: 'Aditya Verma', m: 'Hi, I want to know about the NEET batch.', t: 'now', unread: true, live: true },
    { n: 'Sneha Gupta', m: 'Can the fee be split into three parts?', t: '12m', unread: true },
    { n: 'Rahul Srivastava', m: 'Is the UPSC batch full-time?', t: '41m', unread: true },
    { n: 'Ananya Pandey', m: 'Documents uploaded ✅', t: '2h' },
    { n: 'Divya Mehrotra', m: 'What is the online attendance policy?', t: '3h' },
    { n: 'Kabir Malhotra', m: 'Thanks! See you on Thursday.', t: '5h' }
  ];

  function vInbox() {
    return '' +
    '<div class="row r-4">' +
      W.stats.map(function (s, i) {
        var col = ['#0E9E6E', '#3B2AE0', '#B0801E', '#C13584'][i];
        return '<div class="kpi" style="--k:' + col + '">' +
          '<div class="kpi-l">' + s.k + '</div>' +
          '<div class="kpi-v num" data-count="' + s.v + '" data-comma="in"' +
            (s.suf ? ' data-suf="' + s.suf + '" data-dec="1"' : '') + '>0</div>' +
          '<div class="kpi-f"><span class="kpi-n">' + s.note + '</span></div>' +
        '</div>';
      }).join('') +
    '</div>' +

    '<div class="wa-stage">' +

      '<div class="phone">' +
        '<div class="phone-screen">' +
          '<div class="wa-top">' +
            '<span class="wa-av">PA</span>' +
            '<div style="flex:1;min-width:0">' +
              '<div class="wa-name">Pragati Academy</div>' +
              '<div class="wa-status"><i></i>online · typically replies instantly</div>' +
            '</div>' +
          '</div>' +
          '<div class="wa-body" id="waBody"></div>' +
          '<div class="wa-input">' +
            '<div class="fld">Type a message…</div>' +
            '<span class="wa-send"><svg viewBox="0 0 24 24"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg></span>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<div>' +
        '<div class="panel">' +
          '<div class="panel-head">' +
            '<div><div class="panel-t">What is happening in this thread</div>' +
            '<div class="panel-s">The buttons in the phone are real — tap one and the engine answers</div></div>' +
            '<div class="panel-r"><span class="chip chip-mint chip-dot">Automation active</span></div>' +
          '</div>' +
          '<div class="panel-body">' +
            '<div class="tl" id="waLog"></div>' +
          '</div>' +
        '</div>' +

        '<div class="panel">' +
          '<div class="panel-head"><div><div class="panel-t">Other conversations</div><div class="panel-s">' +
            convos.filter(function (c) { return c.unread; }).length + ' unread</div></div></div>' +
          '<div>' + convos.map(function (c) {
            return '<div class="msg-i' + (c.unread ? ' unread' : '') + '">' +
              U.avatar(c.n) +
              '<div class="msg-b"><div class="msg-t">' + c.n + '</div><div class="msg-p">' + c.m + '</div></div>' +
              '<div class="msg-time">' + c.t + '</div>' +
            '</div>';
          }).join('') + '</div>' +
        '</div>' +
      '</div>' +

    '</div>';
  }

  /* ---------- Conversation engine ------------------------------------------- */
  var body, log, busy = false, logSeq = 0, run = 0;

  function bubble(side, html, opts) {
    opts = opts || {};
    var b = document.createElement('div');
    b.className = 'bub ' + (side === 'in' ? 'in-b' : 'out-b');
    b.innerHTML = html +
      '<span class="t">' + now() + (side === 'out' ? '<span class="tick">✓✓</span>' : '') + '</span>';
    if (opts.buttons && opts.buttons.length) {
      var wrap = document.createElement('div');
      wrap.className = 'wa-btns';
      opts.buttons.forEach(function (t) {
        var btn = document.createElement('button');
        btn.className = 'wa-btn';
        btn.type = 'button';
        btn.textContent = t;
        btn.addEventListener('click', function () { choose(t, b); });
        wrap.appendChild(btn);
      });
      b.insertBefore(wrap, b.querySelector('.t'));
    }
    body.appendChild(b);
    body.scrollTop = body.scrollHeight;
    return b;
  }

  function typing(ms) {
    var token = run;
    return new Promise(function (res) {
      var t = document.createElement('div');
      t.className = 'typing';
      t.innerHTML = '<i></i><i></i><i></i>';
      body.appendChild(t);
      body.scrollTop = body.scrollHeight;
      setTimeout(function () {
        t.remove();
        if (token === run) res();   // a restarted conversation abandons this branch
      }, ms);
    });
  }

  function addLog(title, desc, color) {
    if (!log) return;
    var d = document.createElement('div');
    d.className = 'tl-i';
    d.style.setProperty('--c', color || '#0E9E6E');
    d.style.animationDelay = '0ms';
    d.innerHTML = '<div class="tl-t">' + title + '</div><div class="tl-d">' + desc + '</div>' +
      '<div class="tl-m">' + now() + ' · step ' + (++logSeq) + '</div>';
    log.appendChild(d);
  }

  function lockButtons() {
    $$('.wa-btn', body).forEach(function (b) { b.disabled = true; });
  }

  function choose(label, fromBubble) {
    if (busy) return;
    busy = true;
    lockButtons();
    bubble('out', label);
    addLog('Student tapped “' + label + '”', 'Quick-reply captured and written to the CRM lead record.', '#3B2AE0');

    var reply = W.replies[label];
    typing(900 + Math.random() * 500).then(function () {
      if (!reply) {
        bubble('in', 'Thanks — a counsellor will take this from here.');
        addLog('Handed to a human', 'Automation paused. Neha Singh notified on the counsellor desk.', '#B0801E');
        busy = false;
        return;
      }
      bubble('in', reply.text, { buttons: reply.buttons });
      if (/confirmed/.test(reply.text)) {
        addLog('Counselling session booked', 'Slot written to the CRM, calendar invite queued, reminder scheduled for two hours before.', '#0E9E6E');
        M.toast('Counselling session booked — lead moved to “Counselling Scheduled”', 'ok');
      } else if (label === 'YES, CALL ME') {
        addLog('Call-back requested', 'Task created on Neha Singh’s desk for 4:00 PM today.', '#E8410F');
      } else {
        addLog('Template sent: ' + label.toLowerCase(), 'Delivered and read. Reply window stays open for 24 hours.', '#0E9E6E');
      }
      busy = false;
    });
  }

  function startConversation() {
    body = $('#waBody');
    log = $('#waLog');
    if (!body) return;
    body.innerHTML = '';
    if (log) log.innerHTML = '';
    logSeq = 0;
    busy = true;
    var token = ++run;

    var day = document.createElement('div');
    day.className = 'wa-day';
    day.textContent = 'TODAY';
    body.appendChild(day);

    setTimeout(function () {
      if (token !== run) return;
      bubble('out', 'Hi, I want to know about the NEET batch.');
      addLog('Enquiry received', 'Inbound WhatsApp message. A lead record was created in the CRM and assigned to Neha Singh.', '#3B2AE0');

      typing(1100).then(function () {
        bubble('in',
          'Hi Aditya 👋<br><br>Welcome to Pragati Academy.<br><br>The next <b>NEET 2027</b> batch begins on <b>14 September</b>.<br><br>What would you like to know?',
          { buttons: ['COURSE DETAILS', 'FEE STRUCTURE', 'TALK TO COUNSELLOR', 'BOOK COUNSELLING'] });
        addLog('Automated reply sent', 'Program card delivered 4.2 seconds after the enquiry landed.', '#0E9E6E');
        busy = false;
      });
    }, 500);
  }

  /* =======================================================================
     VIEW: FOLLOW-UP FLOW
     ======================================================================= */
  function vFlow() {
    return '' +
    '<div class="panel">' +
      '<div class="panel-head">' +
        '<div><div class="panel-t">Automated follow-up sequence</div>' +
        '<div class="panel-s">Five steps over fourteen days. Any human reply pauses the whole sequence immediately.</div></div>' +
        '<div class="panel-r"><button class="btn btn-ghost btn-sm" id="playFlow"><i data-i="play" class="ico"></i>Replay</button></div>' +
      '</div>' +
      '<div class="panel-body">' +
        '<div class="wf" id="wfBox" data-seq="1000">' +
          '<div class="wf-node" data-step>' +
            '<div class="wf-dot"><i data-i="mail"></i></div>' +
            '<div class="wf-card">' +
              '<span class="wf-when"><i data-i="bolt" class="ico" style="width:11px;height:11px"></i>Trigger</span>' +
              '<div class="wf-t">New enquiry</div>' +
              '<div class="wf-d">A form submission, a WhatsApp message, a missed call or a walk-in registration — all four create the same lead object.</div>' +
              '<div class="wf-stats"><div class="wf-s"><b>1,284</b><span>Triggered</span></div>' +
              '<div class="wf-s"><b>4.2s</b><span>Median latency</span></div></div>' +
            '</div>' +
          '</div>' +
          W.flow.map(function (f) {
            var rate = Math.round(f.replied / f.sent * 100);
            return '<div class="wf-node" data-step>' +
              '<div class="wf-dot"><i data-i="' + f.icon + '"></i></div>' +
              '<div class="wf-card">' +
                '<span class="wf-when">' + f.when + '</span>' +
                '<div class="wf-t">' + f.t + '</div>' +
                '<div class="wf-d">' + f.d + '</div>' +
                '<div class="wf-msg">' + f.msg + '</div>' +
                '<div class="wf-stats">' +
                  '<div class="wf-s"><b>' + f.sent.toLocaleString('en-IN') + '</b><span>Sent</span></div>' +
                  '<div class="wf-s"><b>' + Math.round(f.opened / f.sent * 100) + '%</b><span>Read</span></div>' +
                  '<div class="wf-s"><b>' + rate + '%</b><span>Replied</span></div>' +
                '</div>' +
              '</div>' +
            '</div>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Sequence drop-off</div><div class="panel-s">How many leads each step still reaches</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"funnel","stages":[' +
          '{"label":"Immediate course info","value":1284},' +
          '{"label":"24h counselling reminder","value":918},' +
          '{"label":"3d counsellor follow-up","value":642},' +
          '{"label":"7d batch reminder","value":471},' +
          '{"label":"14d last follow-up","value":318}]}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Reply rate by step</div><div class="panel-s">Replies as a share of messages delivered</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"bar","height":250,"yfmt":"pct","max":50,"labels":["Instant","24h","3d","7d","14d"],"series":[{"name":"Reply rate","data":[41,32,36,30,23],"color":"#0E9E6E"}]}\'></figure></div></div>' +
    '</div>' +

    '<div class="panel"><div class="panel-head"><div><div class="panel-t">Guardrails</div><div class="panel-s">What the sequence will not do</div></div></div>' +
      '<div>' +
        rule('A human reply stops everything', 'The moment a counsellor sends a message by hand, the remaining automated steps are cancelled for that lead — not delayed, cancelled.') +
        rule('Seat counts are read from the CRM', 'The urgency message quotes the live remaining seats. If the batch is not filling, the message says so or does not send.') +
        rule('One sequence per lead', 'Re-enquiring does not restart the sequence. A returning lead goes straight to a counsellor.') +
        rule('Fourteen days and out', 'After the last message the lead moves to a quarterly nurture list. No further sequence messages are sent.') +
        rule('Quiet hours respected', 'Nothing sends between 9 PM and 8 AM. Scheduled messages queue to the next morning.') +
      '</div></div>';
  }

  function rule(t, d) {
    return '<div class="list-i">' +
      '<span class="list-ic" style="background:rgba(14,158,110,.12);color:#07875D"><i data-i="shield"></i></span>' +
      '<div class="list-b"><div class="list-t">' + t + '</div><div class="list-m">' + d + '</div></div>' +
    '</div>';
  }

  /* =======================================================================
     VIEW: TEMPLATES
     ======================================================================= */
  function vTemplates() {
    var list = [
      { n: 'Program card — NEET', cat: 'Utility', body: 'Hi {{name}} 👋 Welcome to Pragati Academy. The next NEET 2027 batch begins on {{batch_date}}. What would you like to know?', used: 1284, status: 'Approved' },
      { n: 'Fee structure', cat: 'Utility', body: 'Course fee: {{fee}}. Instalment 1: {{i1}} at admission. Instalment 2: {{i2}} by {{i2_date}}.', used: 736, status: 'Approved' },
      { n: 'Counselling slots', cat: 'Utility', body: 'Two counselling slots are open this week — {{slot_1}} and {{slot_2}}. Reply with a number to reserve one.', used: 918, status: 'Approved' },
      { n: 'Session confirmed', cat: 'Utility', body: 'Counselling confirmed ✅ {{slot}} at {{address}}. Counsellor: {{counsellor}}. A reminder arrives two hours before.', used: 176, status: 'Approved' },
      { n: 'Seat reminder', cat: 'Marketing', body: '{{seats_left}} of {{seats_total}} seats are still open in the {{program}} batch starting {{batch_date}}.', used: 471, status: 'Approved' },
      { n: 'Fee instalment due', cat: 'Utility', body: 'Hi {{name}}, instalment {{n}} of {{amount}} is due on {{due_date}}. Payment link: {{link}}', used: 284, status: 'Approved' },
      { n: 'Mock test result', cat: 'Utility', body: '{{name}}, your {{test}} result is live in the portal. Score {{score}}, batch rank {{rank}}.', used: 1840, status: 'Approved' },
      { n: 'Last follow-up', cat: 'Marketing', body: 'We will stop messaging about this batch now. Reply KEEP for details on later intakes.', used: 318, status: 'Approved' }
    ];
    return '<div class="panel">' +
      '<div class="panel-head"><div><div class="panel-t">Message templates</div>' +
      '<div class="panel-s">Eight approved templates · variables in double braces are filled from the CRM record</div></div>' +
      '<div class="panel-r"><span class="chip chip-mint">All approved</span></div></div>' +
      '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Template</th><th>Category</th><th>Body</th><th>Sent</th><th>Status</th></tr></thead><tbody>' +
      list.map(function (t, i) {
        return '<tr class="tbl-row-in" style="animation-delay:' + (i * 45) + 'ms">' +
          '<td><b style="font-family:var(--display)">' + t.n + '</b></td>' +
          '<td><span class="chip ' + (t.cat === 'Utility' ? 'chip-indigo' : 'chip-gold') + '">' + t.cat + '</span></td>' +
          '<td style="max-width:420px;font-size:.8rem;color:var(--text-soft)">' + t.body + '</td>' +
          '<td class="num">' + t.used.toLocaleString('en-IN') + '</td>' +
          '<td><span class="pill p-enrol"><i></i>' + t.status + '</span></td></tr>';
      }).join('') + '</tbody></table></div></div>';
  }

  /* =======================================================================
     VIEW: ANALYTICS
     ======================================================================= */
  function vAnalytics() {
    return '' +
    '<div class="row r-4">' +
      W.stats.map(function (s, i) {
        var col = ['#0E9E6E', '#3B2AE0', '#B0801E', '#C13584'][i];
        return '<div class="kpi" style="--k:' + col + '"><div class="kpi-l">' + s.k + '</div>' +
          '<div class="kpi-v num" data-count="' + s.v + '" data-comma="in"' + (s.suf ? ' data-suf="' + s.suf + '" data-dec="1"' : '') + '>0</div>' +
          '<div class="kpi-f"><span class="kpi-n">' + s.note + '</span></div></div>';
      }).join('') +
    '</div>' +
    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Messages per day</div><div class="panel-s">Last two weeks</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"line","height":250,"labels":["1","2","3","4","5","6","7","8","9","10","11","12","13","14"],"series":[{"name":"Messages sent","data":[412,468,391,524,586,502,338,441,509,612,588,641,596,684],"color":"#0E9E6E"}]}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Delivery outcome</div><div class="panel-s">Of 8,462 messages sent</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"donut","size":190,"stroke":24,"center":"98.6%","centerLabel":"Delivered","items":[{"label":"Delivered and read","value":7612},{"label":"Delivered, unread","value":733},{"label":"Failed / blocked","value":117}]}\'></figure></div></div>' +
    '</div>' +
    '<div class="row r-2">' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">Replies by hour</div><div class="panel-s">When students actually answer</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"bar","height":240,"labels":["8a","10a","12p","2p","4p","6p","8p"],"series":[{"name":"Replies","data":[64,148,196,131,224,318,241],"color":"#3B2AE0"}]}\'></figure></div></div>' +
      '<div class="panel"><div class="panel-head"><div><div class="panel-t">What students tap</div><div class="panel-s">Quick-reply button selections</div></div></div>' +
        '<div class="panel-body"><figure data-chart=\'{"type":"hbar","items":[{"label":"Fee structure","value":1841},{"label":"Course details","value":1602},{"label":"Book counselling","value":1114},{"label":"Talk to counsellor","value":867},{"label":"Batch timings","value":523}]}\'></figure></div></div>' +
    '</div>';
  }

  /* =======================================================================
     ROUTER
     ======================================================================= */
  var VIEWS = {
    inbox:     { title: 'Live Inbox',     sub: 'Automated replies with working quick-reply buttons', render: vInbox },
    flow:      { title: 'Follow-up Flow',  sub: 'Five steps from enquiry to the final message',       render: vFlow },
    templates: { title: 'Templates',       sub: 'Approved message templates and their variables',      render: vTemplates },
    analytics: { title: 'Analytics',       sub: 'Delivery, reply and engagement figures',              render: vAnalytics }
  };
  var current = 'inbox';

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
    $$('[data-chart]', pane).forEach(function (n) { if (window.Charts) window.Charts.render(n); });
    $$('[data-count]', pane).forEach(function (n) { M.count(n); });

    if (name === 'inbox') startConversation();
    if (name === 'flow') {
      var box = $('#wfBox');
      M.sequence(box);
      var pf = $('#playFlow');
      if (pf) pf.addEventListener('click', function () {
        $$('[data-step]', box).forEach(function (s) { s.classList.remove('active', 'current'); });
        setTimeout(function () { M.sequence(box); }, 250);
      });
    }
    if (history.replaceState) history.replaceState(null, '', '#' + name);
    document.body.classList.remove('side-open');
    $('.app-body').scrollTop = 0;
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
    var rb = $('#replayBtn');
    if (rb) rb.addEventListener('click', function () {
      if (current !== 'inbox') go('inbox'); else startConversation();
    });

    var start = (location.hash || '').replace('#', '');
    go(VIEWS[start] ? start : 'inbox');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();

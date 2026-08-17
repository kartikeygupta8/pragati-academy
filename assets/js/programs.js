/* ==========================================================================
   PRAGATI ACADEMY — Programs listing page
   Comparison table + mode filter over the cards rendered by site.js
   ========================================================================== */
/* Programs page: comparison table + mode filter */
(function () {
  var D = window.DATA, U = window.UI;
  var inr = function (n) { return '₹' + Number(n).toLocaleString('en-IN'); };

  var body = document.getElementById('compareBody');
  if (body) {
    body.innerHTML = D.programs.map(function (p) {
      var left = p.seats - p.filled;
      var tone = left <= 15 ? 'chip-verm' : left <= 30 ? 'chip-gold' : 'chip-mint';
      return '<tr>' +
        '<td><b>' + p.name + '</b><div style="font-size:.74rem;color:var(--text-mute);margin-top:2px">' + p.level + '</div></td>' +
        '<td>' + p.duration + '</td>' +
        '<td>' + p.mode + '</td>' +
        '<td>' + p.batch + '</td>' +
        '<td><b>' + inr(p.fee) + '</b></td>' +
        '<td><span class="chip ' + tone + '">' + left + ' of ' + p.seats + '</span></td>' +
        '<td style="text-align:right"><a class="link" href="' + p.href + '">View <i data-i="arrowUR"></i></a></td>' +
      '</tr>';
    }).join('');
    U.icons(body);
  }

  var fbox = document.getElementById('progFilters');
  var grid = document.getElementById('programGrid');
  if (fbox && grid) {
    fbox.addEventListener('click', function (e) {
      var b = e.target.closest('[data-filter]');
      if (!b) return;
      fbox.querySelectorAll('[data-filter]').forEach(function (x) { x.classList.remove('active'); });
      b.classList.add('active');
      var f = b.getAttribute('data-filter');
      Array.prototype.forEach.call(grid.children, function (card, i) {
        var mode = (card.querySelector('.pcard-tag .chip:last-child') || {}).textContent || '';
        var show = f === 'all' || mode.indexOf(f) > -1;
        card.style.transition = 'opacity .4s var(--ease), transform .5s var(--ease)';
        card.style.opacity = show ? '1' : '0';
        card.style.transform = show ? 'none' : 'scale(.96)';
        card.style.position = show ? '' : 'absolute';
        card.style.pointerEvents = show ? '' : 'none';
        setTimeout(function () { card.hidden = !show; }, show ? 0 : 380);
        if (show) card.hidden = false;
      });
    });
  }

  /* 'active' state for the ghost filter buttons */
  var st = document.createElement('style');
  st.textContent = '#progFilters .btn.active{background:var(--ink);color:var(--paper);box-shadow:inset 0 0 0 1.4px var(--ink)}';
  document.head.appendChild(st);
})();

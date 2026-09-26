/* The Chronometer: page interactions (count-ups, podcast search, preview form) */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Count-up numbers: data-count, data-dec, data-prefix, data-suffix */
  function fmt(v, dec) { return v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function run(el) {
    var target = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10);
    var pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
    var dur = parseInt(el.dataset.dur || '1800', 10), start = null;
    function step(t) {
      if (!start) start = t;
      var p = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + fmt(target * e, dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if (!reduce && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); run(en.target); } });
    }, { threshold: 0.4 });
    document.querySelectorAll('[data-count]').forEach(function (el) { io.observe(el); });
  }

  /* Podcast episode search */
  var search = document.getElementById('episode-search');
  if (search) {
    var cards = document.querySelectorAll('.ep');
    var empty = document.querySelector('.ep-empty');
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase(), shown = 0;
      cards.forEach(function (c) {
        var hit = !q || c.dataset.title.toLowerCase().indexOf(q) > -1;
        c.style.display = hit ? '' : 'none';
        if (hit) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  /* Preview-only form */
  var form = document.querySelector('form[data-preview]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var note = form.querySelector('.form-note');
      if (note) { note.hidden = false; note.focus(); }
    });
  }
})();

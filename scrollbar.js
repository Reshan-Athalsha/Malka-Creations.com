/* ═══════════════════════════════════════════════
   CUSTOM SCROLLBAR — Floating gradient indicator
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';
  if (matchMedia('(pointer: coarse)').matches && window.innerWidth < 1024) return;

  /* ── Create DOM ── */
  var track = document.createElement('div');
  track.className = 'scroll-track';
  var thumb = document.createElement('div');
  thumb.className = 'scroll-thumb';
  var pct = document.createElement('span');
  pct.className = 'scroll-pct';
  pct.textContent = '0 %';
  track.appendChild(thumb);
  track.appendChild(pct);
  document.body.appendChild(track);

  /* ── Measurements ── */
  var idleTimer = null;
  var hideTimer = null;
  var dragging = false;
  var dragStartY = 0;
  var dragStartScroll = 0;

  function getDocH() { return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight); }
  function getViewH() { return window.innerHeight; }

  function update() {
    var docH = getDocH();
    var viewH = getViewH();
    var scrollY = window.scrollY || window.pageYOffset;
    if (docH <= viewH) { track.classList.remove('visible'); return; }

    var scrollFraction = scrollY / (docH - viewH);
    var thumbH = Math.max(48, (viewH / docH) * viewH);
    var maxTop = viewH - thumbH - 4;
    var top = 2 + scrollFraction * maxTop;

    thumb.style.height = thumbH + 'px';
    thumb.style.top = top + 'px';
    pct.style.top = (top + thumbH / 2 - 10) + 'px';
    pct.textContent = Math.round(scrollFraction * 100) + ' %';

    /* show track */
    track.classList.add('visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () {
      if (!dragging) track.classList.remove('visible');
    }, 1500);

    /* idle glow */
    clearTimeout(idleTimer);
    thumb.classList.remove('idle');
    idleTimer = setTimeout(function () {
      thumb.classList.add('idle');
    }, 3000);
  }

  /* ── Scroll listener ── */
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  /* ── Click-to-jump on track ── */
  track.addEventListener('mousedown', function (e) {
    if (e.target === thumb) return;
    var rect = track.getBoundingClientRect();
    var clickFraction = (e.clientY - rect.top) / rect.height;
    var docH = getDocH();
    var viewH = getViewH();
    window.scrollTo({ top: clickFraction * (docH - viewH), behavior: 'smooth' });
  });

  /* ── Drag thumb ── */
  thumb.addEventListener('mousedown', function (e) {
    e.preventDefault();
    dragging = true;
    dragStartY = e.clientY;
    dragStartScroll = window.scrollY || window.pageYOffset;
    track.classList.add('dragging');
    document.body.style.userSelect = 'none';
  });

  window.addEventListener('mousemove', function (e) {
    if (!dragging) return;
    var delta = e.clientY - dragStartY;
    var viewH = getViewH();
    var docH = getDocH();
    var scrollRange = docH - viewH;
    var thumbH = Math.max(48, (viewH / docH) * viewH);
    var trackRange = viewH - thumbH - 4;
    var scrollDelta = (delta / trackRange) * scrollRange;
    window.scrollTo(0, dragStartScroll + scrollDelta);
  });

  window.addEventListener('mouseup', function () {
    if (!dragging) return;
    dragging = false;
    track.classList.remove('dragging');
    document.body.style.userSelect = '';
  });

  /* ── Show on hover ── */
  track.addEventListener('mouseenter', function () {
    track.classList.add('visible');
    clearTimeout(hideTimer);
  });
  track.addEventListener('mouseleave', function () {
    if (!dragging) {
      hideTimer = setTimeout(function () { track.classList.remove('visible'); }, 800);
    }
  });

  /* ── Initial position ── */
  requestAnimationFrame(update);
})();

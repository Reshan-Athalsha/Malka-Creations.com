/* ═══════════════════════════════════════════════
   මල්කා — INNER PAGES ANIMATION ENGINE
   Scroll reveals, text splits, parallax, tilt
   ═══════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Scroll Reveal ── */
  function initScrollReveal() {
    var els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var delay = parseInt(el.getAttribute('data-reveal-delay') || '0', 10);
        setTimeout(function () { el.classList.add('revealed'); }, delay);
        observer.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── Stagger Children ── */
  function initStaggerReveal() {
    var groups = document.querySelectorAll('[data-stagger]');
    if (!groups.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var parent = entry.target;
        var children = parent.querySelectorAll('[data-stagger-child]');
        var base = parseInt(parent.getAttribute('data-stagger-base') || '80', 10);
        children.forEach(function (child, i) {
          child.style.transitionDelay = (i * base) + 'ms';
          child.classList.add('revealed');
        });
        observer.unobserve(parent);
      });
    }, { threshold: 0.1 });
    groups.forEach(function (g) { observer.observe(g); });
  }

  /* ── Text Split & Reveal ── */
  function initTextReveal() {
    var els = document.querySelectorAll('[data-text-reveal]');
    els.forEach(function (el) {
      var text = el.textContent;
      var html = '';
      for (var i = 0; i < text.length; i++) {
        if (text[i] === ' ') { html += ' '; }
        else { html += '<span class="tr-char" style="transition-delay:' + (i * 28) + 'ms">' + text[i] + '</span>'; }
      }
      el.innerHTML = html;
      el.classList.add('tr-ready');
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('tr-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── Word Reveal (line-by-line) ── */
  function initWordReveal() {
    var els = document.querySelectorAll('[data-word-reveal]');
    els.forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w, i) {
        return '<span class="wr-word" style="transition-delay:' + (i * 60) + 'ms"><span class="wr-inner">' + w + '</span></span>';
      }).join(' ');
      el.classList.add('wr-ready');
    });
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('wr-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── Counter Animation ── */
  function initCounters() {
    var els = document.querySelectorAll('[data-count-to]');
    if (!els.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count-to'), 10);
        var prefix = el.getAttribute('data-count-prefix') || '';
        var suffix = el.getAttribute('data-count-suffix') || '';
        var duration = 1600;
        var start = performance.now();
        function tick(now) {
          var p = Math.min((now - start) / duration, 1);
          var ease = 1 - Math.pow(1 - p, 3);
          el.textContent = prefix + Math.round(target * ease) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── Magnetic Hover (cards) ── */
  function initMagneticHover() {
    if (matchMedia('(pointer:coarse)').matches) return;
    document.querySelectorAll('[data-magnetic]').forEach(function (el) {
      el.addEventListener('mousemove', function (e) {
        var r = el.getBoundingClientRect();
        var x = (e.clientX - r.left - r.width / 2) / r.width;
        var y = (e.clientY - r.top - r.height / 2) / r.height;
        el.style.transform = 'perspective(600px) rotateY(' + (x * 6) + 'deg) rotateX(' + (-y * 6) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () {
        el.style.transform = '';
      });
    });
  }

  /* ── Parallax Sections ── */
  function initParallax() {
    var els = document.querySelectorAll('[data-parallax]');
    if (!els.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var ticking = false;
    function update() {
      var scrollY = window.scrollY;
      els.forEach(function (el) {
        var speed = parseFloat(el.getAttribute('data-parallax') || '0.15');
        var r = el.getBoundingClientRect();
        var center = r.top + r.height / 2;
        var vh = window.innerHeight;
        var offset = (center - vh / 2) * speed;
        el.style.transform = 'translateY(' + offset + 'px)';
      });
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ── Horizontal Scroll Progress Bar ── */
  function initProgressBar() {
    var bar = document.getElementById('read-progress');
    if (!bar) return;
    window.addEventListener('scroll', function () {
      var h = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (h > 0 ? window.scrollY / h : 0) + ')';
    }, { passive: true });
  }

  /* ── Smooth Anchor Scroll ── */
  function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        if (id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ── Image Reveal on Scroll ── */
  function initImageReveal() {
    var imgs = document.querySelectorAll('[data-img-reveal]');
    if (!imgs.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('img-revealed');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.2 });
    imgs.forEach(function (img) { observer.observe(img); });
  }

  /* ── Typewriter Effect ── */
  function initTypewriter() {
    var els = document.querySelectorAll('[data-typewriter]');
    if (!els.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var text = el.getAttribute('data-typewriter');
        var speed = parseInt(el.getAttribute('data-tw-speed') || '50', 10);
        el.textContent = '';
        el.style.borderRight = '2px solid var(--clay)';
        var i = 0;
        var timer = setInterval(function () {
          if (i < text.length) { el.textContent += text[i]; i++; }
          else { clearInterval(timer); setTimeout(function () { el.style.borderRight = 'none'; }, 1000); }
        }, speed);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });
    els.forEach(function (el) { observer.observe(el); });
  }

  /* ── Line Draw (SVG decoration) ── */
  function initLineDraw() {
    var svgs = document.querySelectorAll('[data-line-draw]');
    if (!svgs.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('line-drawn');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.3 });
    svgs.forEach(function (svg) { observer.observe(svg); });
  }

  /* ── INIT ALL ── */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initStaggerReveal();
    initTextReveal();
    initWordReveal();
    initCounters();
    initMagneticHover();
    initParallax();
    initProgressBar();
    initSmoothAnchors();
    initImageReveal();
    initTypewriter();
    initLineDraw();
  });
})();

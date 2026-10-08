(() => {
  'use strict';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- шапка: граница при прокрутке ---------- */
  const header = $('.header');
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- мобильное меню ---------- */
  const burger = $('#burger');
  const nav = $('#nav');
  const desktop = window.matchMedia('(min-width: 900px)');
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('menu-open', open);
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); burger.focus(); } });
  desktop.addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- подсветка пункта меню ---------- */
  const links = $$('[data-nav]', nav);
  const map = { work: 'work', services: 'services', process: 'process', approach: 'process', faq: 'faq', contact: 'contact' };
  if ('IntersectionObserver' in window) {
    const seen = new Map();
    const navObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => seen.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
      let best = null, max = 0;
      seen.forEach((r, id) => { if (map[id] && r > max) { max = r; best = map[id]; } });
      links.forEach((l) => l.classList.toggle('is-active', l.dataset.nav === best));
    }, { rootMargin: '-30% 0px -50% 0px', threshold: [0, .25, .5, 1] });
    Object.keys(map).forEach((id) => { const el = document.getElementById(id); if (el) navObs.observe(el); });
  }

  /* ---------- reveal и анимации секций ---------- */
  const reveals = $$('.reveal');
  const ba = $('#ba');
  const timeline = $('#timeline');
  $$('.steps').forEach((ol) => $$('li', ol).forEach((li, i) => li.style.setProperty('--i', i)));
  if ('IntersectionObserver' in window && !reduce) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-visible'); obs.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach((el) => obs.observe(el));
    const once = (el, cls, threshold) => {
      if (!el) return;
      const o = new IntersectionObserver((e) => { if (e[0].isIntersecting) { el.classList.add(cls); o.disconnect(); } }, { threshold });
      o.observe(el);
    };
    once(ba, 'is-on', 0.3);
    once(timeline, 'is-on', 0.35);
  } else {
    reveals.forEach((el) => el.classList.add('is-visible'));
    if (ba) ba.classList.add('is-on');
    if (timeline) timeline.classList.add('is-on');
  }

  /* ---------- луч: затухает при прокрутке, на десктопе слегка следует за курсором ---------- */
  const beam = $('#beam');
  const hero = $('.hero');
  if (beam && hero && !reduce) {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches && desktop.matches;
    let tx = 0, ty = 0, cx = 0, cy = 0, p = 0, raf = 0;
    const frame = () => {
      raf = 0;
      cx += (tx - cx) * 0.08; cy += (ty - cy) * 0.08;
      beam.style.setProperty('--bx', cx.toFixed(1) + 'px');
      beam.style.setProperty('--by', cy.toFixed(1) + 'px');
      beam.style.setProperty('--bo', (1 - p * 0.9).toFixed(3));
      beam.style.setProperty('--bs', (1 - p * 0.18).toFixed(3));
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };
    const onScrollBeam = () => { p = Math.min(1, Math.max(0, window.scrollY / (hero.offsetHeight * 0.85))); kick(); };
    window.addEventListener('scroll', onScrollBeam, { passive: true });
    onScrollBeam();
    if (finePointer) {
      window.addEventListener('pointermove', (e) => {
        if (window.scrollY > hero.offsetHeight) return;
        tx = (e.clientX / window.innerWidth - 0.5) * 36;
        ty = (e.clientY / window.innerHeight - 0.5) * 12;
        kick();
      }, { passive: true });
    }
  }

  /* ---------- год в футере ---------- */
  const y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

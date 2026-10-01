(() => {
  'use strict';

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- theme toggle ---------------- */

  const themeToggle = document.getElementById('themeToggle');
  const THEME_KEY = 'yamulla-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', String(theme === 'light'));
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', theme === 'light' ? '#f3f6f4' : '#0a0a0a');
  }

  let savedTheme = null;
  try { savedTheme = localStorage.getItem(THEME_KEY); } catch (e) { /* storage unavailable */ }
  applyTheme(savedTheme === 'light' ? 'light' : 'dark');

  themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage unavailable */ }
  });

  /* ---------------- mobile nav ---------------- */

  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  const desktopNav = window.matchMedia('(min-width: 960px)');

  function setMenu(open) {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.classList.toggle('menu-open', open);
  }

  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); burger.focus(); }
  });
  desktopNav.addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------------- active navigation ---------------- */

  const navLinks = [...document.querySelectorAll('.nav__link[data-nav]')];
  // какие секции подсвечивают какой пункт меню
  const navMap = {
    home: 'home', problems: 'home', 'before-after': 'home',
    solutions: 'solutions', help: 'solutions', levels: 'solutions',
    cases: 'cases', process: 'process', faq: 'faq', contact: null
  };

  if ('IntersectionObserver' in window) {
    const visible = new Map();
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0));
      let best = null; let ratio = 0;
      visible.forEach((r, id) => { if (r > ratio) { ratio = r; best = id; } });
      const key = best ? navMap[best] : null;
      navLinks.forEach((l) => {
        const on = l.dataset.nav === key;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
    }, { rootMargin: '-35% 0px -55% 0px', threshold: [0, .01, .25, .5, 1] });
    Object.keys(navMap).forEach((id) => { const el = document.getElementById(id); if (el) navObserver.observe(el); });
  }

  /* ---------------- terminal typing ---------------- */

  function typeTerminal(container) {
    const parts = [...container.querySelectorAll('[data-type]')];
    if (prefersReducedMotion) {
      parts.forEach((p) => { p.textContent = p.dataset.type; });
      return;
    }
    let i = 0;
    const next = () => {
      if (i >= parts.length) return;
      const el = parts[i++];
      const text = el.dataset.type;
      let c = 0;
      const tick = () => {
        el.textContent = text.slice(0, ++c);
        if (c < text.length) setTimeout(tick, 38);
        else setTimeout(next, 260);
      };
      tick();
    };
    next();
  }

  const typedOnce = new WeakSet();
  const startTyping = (el) => { if (!typedOnce.has(el)) { typedOnce.add(el); typeTerminal(el); } };

  /* ---------------- hero automation flow ---------------- */

  const flow = document.getElementById('heroFlow');
  if (flow) {
    const nodes = [...flow.querySelectorAll('.flow__node')];
    let active = 0;
    let paused = false;
    const setActive = (idx) => nodes.forEach((n, i) => n.classList.toggle('is-active', i === idx));
    setActive(0);
    if (!prefersReducedMotion) {
      setInterval(() => {
        if (paused || document.hidden) return;
        active = (active + 1) % nodes.length;
        setActive(active);
      }, 1400);
    }
    nodes.forEach((n, i) => {
      n.addEventListener('mouseenter', () => { paused = true; active = i; setActive(i); });
      n.addEventListener('mouseleave', () => { paused = false; });
      n.addEventListener('focus', () => { paused = true; active = i; setActive(i); });
      n.addEventListener('blur', () => { paused = false; });
      // на тач-устройствах — по тапу
      n.addEventListener('click', () => { active = i; setActive(i); });
    });
  }

  /* ---------------- before / after ---------------- */

  const BA = {
    before: [
      ['Клиент пишет', 'client'],
      ['Менеджер отвечает', 'manual'],
      ['Записывает данные', 'manual'],
      ['Открывает таблицу', 'manual'],
      ['Переносит информацию', 'manual'],
      ['Уведомляет сотрудника', 'manual'],
      ['Контролирует результат', 'manual']
    ],
    after: [
      ['Клиент пишет', 'client'],
      ['AI отвечает', 'auto'],
      ['Собирает данные', 'auto'],
      ['Создаёт заявку', 'auto'],
      ['Обновляет CRM', 'auto'],
      ['Уведомляет сотрудника', 'auto'],
      ['Сохраняет историю', 'auto']
    ]
  };

  const ba = document.getElementById('ba');
  const baSteps = document.getElementById('baSteps');
  const baPanel = document.getElementById('ba-panel');
  const baTabs = ba ? [...ba.querySelectorAll('.ba__tab')] : [];

  function renderBA(mode) {
    ba.dataset.mode = mode;
    baPanel.dataset.mode = mode;
    baPanel.setAttribute('aria-labelledby', `ba-tab-${mode}`);
    baTabs.forEach((t) => {
      const on = t.dataset.mode === mode;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    baSteps.innerHTML = '';
    BA[mode].forEach(([text, who], d) => {
      const li = document.createElement('li');
      const isAuto = who === 'auto';
      li.className = `ba__step ${who === 'client' ? '' : isAuto ? 'ba__step--auto' : 'ba__step--manual'}`;
      li.style.setProperty('--d', d);
      const mark = who === 'client' ? '→' : isAuto ? 'AI' : '✋';
      const label = who === 'client' ? 'старт' : isAuto ? 'система' : 'вручную';
      li.innerHTML = `<span class="ba__mark" aria-hidden="true">${mark}</span><span class="ba__text">${text}</span><span class="ba__who">${label}</span>`;
      baSteps.appendChild(li);
    });
  }

  let baTouched = false;
  if (ba) {
    renderBA('before');
    baTabs.forEach((t) => t.addEventListener('click', () => { baTouched = true; renderBA(t.dataset.mode); }));
    ba.querySelector('[role="tablist"]').addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const next = ba.dataset.mode === 'before' ? 'after' : 'before';
      baTouched = true;
      renderBA(next);
      ba.querySelector(`.ba__tab[data-mode="${next}"]`).focus();
    });
  }

  /* ---------------- process timeline ---------------- */

  const timeline = document.getElementById('timeline');

  /* ---------------- scroll reveal + one-time triggers ---------------- */

  const revealEls = document.querySelectorAll('.reveal');
  const terminals = document.querySelectorAll('.terminal--mini, .cta__terminal');

  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // лёгкий stagger для соседних элементов одной сетки
        const siblings = el.parentElement ? [...el.parentElement.children].filter((c) => c.classList.contains('reveal')) : [];
        const idx = Math.max(0, siblings.indexOf(el));
        el.style.transitionDelay = `${Math.min(idx, 6) * 60}ms`;
        el.classList.add('is-visible');
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));

    const triggerObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        if (el === timeline) {
          el.classList.add('is-on');
          el.style.setProperty('--progress', '1');
        } else if (el === ba) {
          // один раз сами показываем «после», если посетитель не переключил вкладку
          setTimeout(() => { if (!baTouched) renderBA('after'); }, 1800);
        } else {
          startTyping(el);
        }
        triggerObserver.unobserve(el);
      });
    }, { threshold: 0.4 });
    terminals.forEach((t) => triggerObserver.observe(t));
    if (timeline) triggerObserver.observe(timeline);
    if (ba) triggerObserver.observe(ba);
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
    terminals.forEach(startTyping);
    if (timeline) { timeline.classList.add('is-on'); timeline.style.setProperty('--progress', '1'); }
  }

  /* ---------------- analyze form → Telegram ---------------- */

  const form = document.getElementById('analyzeForm');
  const status = document.getElementById('analyzeStatus');
  const TG = 'https://t.me/yamulla';

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fallback below */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      const ok = document.execCommand('copy');
      ta.remove();
      return ok;
    } catch (e) { return false; }
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const text = form.problem.value.trim();
      // копируем, пока вкладка в фокусе; открытие укладывается в окно «жеста пользователя»
      const copied = text ? await copyText(`Здравствуйте! Хочу разобрать процесс: ${text}`) : false;
      const win = window.open(TG, '_blank');
      if (win) win.opener = null;
      if (!text) status.textContent = '> чат открыт — опишите задачу своими словами';
      else status.textContent = copied
        ? '> скопировано ✓ — вставьте текст в открывшийся чат Telegram'
        : '> чат открыт — опишите задачу, скопировать текст не удалось';
      if (!win) status.innerHTML = `> браузер заблокировал окно — <a href="${TG}" target="_blank" rel="noopener">откройте чат</a>`;
      status.classList.add('is-ok');
    });
  }

  /* ---------------- subtle card tilt ---------------- */

  if (canHover && !prefersReducedMotion) {
    document.querySelectorAll('.tilt').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        card.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 4}deg) rotateY(${(x - 0.5) * 4}deg) translateY(-3px)`;
        card.style.setProperty('--mx', `${x * 100}%`);
        card.style.setProperty('--my', `${y * 100}%`);
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------------- footer year ---------------- */

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());
})();

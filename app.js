/* ==========================================================================
   Victor Vandi — victorvandi.com
   Static single-page site: routing, rendering, and interactions.
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     CONFIG — edit these values, nothing else needs touching.
     ------------------------------------------------------------------------ */

  // Freelance profiles. Leave a URL empty ('') and its card/link is hidden
  // automatically, so the site never shows a dead button.
  const PROFILES = {
    fiverr: '',   // e.g. 'https://www.fiverr.com/your-username'
    upwork: ''    // e.g. 'https://www.upwork.com/freelancers/~your-id'
  };

  const EMAIL = 'contact@victorvandi.com';

  const SOCIALS = [
    { key: 'linkedin',  label: 'LinkedIn',  url: 'https://www.linkedin.com/in/victorvandi' },
    { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/victorvandi' }
  ];

  // Shown on /services. Trim anything you don't actually use.
  const TOOLS = [
    'HTML', 'CSS', 'JavaScript', 'Responsive layout', 'Core Web Vitals', 'On-page SEO',
    'Figma', 'Git / GitHub', 'Adobe Photoshop', 'CapCut', 'Premiere Pro', 'DaVinci Resolve'
  ];

  const MARQUEE = [
    'Portfolio sites', 'Landing pages', 'Business websites', 'Long-form YouTube edits',
    'Shorts & Reels', 'Podcast edits', 'Colour grading', 'Captions', 'Motion titles',
    'Speed & SEO fixes'
  ];

  const PROJECTS = [
    {
      name: 'NZLUXE',
      kind: 'Luxury e-commerce',
      url: 'https://nzluxe.ng',
      desc: 'A premium luxury brand storefront — restrained, fast, and built so high-intent shoppers reach checkout without friction.',
      tags: ['E-commerce', 'Brand identity', 'Responsive build'],
      art: 'luxe'
    }
  ];

  const STEPS = [
    { title: 'Brief',      text: 'You tell me the goal, the audience, and anything you already have — references, footage, brand colours, an existing site. I ask the questions that stop surprises later.' },
    { title: 'Scope & quote', text: 'I come back with what I would build, how long it takes, and one fixed number. If the scope changes mid-project, we agree the change before I touch it.' },
    { title: 'Build',      text: 'Design and build, or edit and grade. You see real progress — a live staging link or a first cut — not a status update three weeks from now.' },
    { title: 'Handover',   text: 'Websites go live with the source, a short walkthrough, and a working contact flow. Video is delivered in the formats you need, with revisions until it lands.' }
  ];

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     Theme
     ------------------------------------------------------------------------ */
  const themeBtn = $('#themeBtn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('vv-theme', next); } catch (e) { /* private mode */ }
    });
  }

  /* ------------------------------------------------------------------------
     Rendering helpers
     ------------------------------------------------------------------------ */
  const ICONS = {
    linkedin:  '<svg viewBox="0 0 24 24"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.94v5.66H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zm1.78 13.02H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.64.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92C8.42 2.17 8.8 2.16 12 2.16zM12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.69.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.2-4.35-2.62-6.78-6.98-6.98C15.67.01 15.26 0 12 0zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.89 1.44 1.44 0 0 0 0-2.89z"/></svg>',
    mail:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/></svg>'
  };

  /* Editorial preview artwork for the NZLUXE build. */
  function artLuxe(uid) {
    const g = 'lx' + uid, b = 'lb' + uid;
    return '' +
      '<svg viewBox="0 0 480 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="NZLUXE website preview">' +
        '<defs>' +
          '<linearGradient id="' + g + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#c9a84c"/><stop offset="50%" stop-color="#f2d78f"/><stop offset="100%" stop-color="#9c7429"/>' +
          '</linearGradient>' +
          '<linearGradient id="' + b + '" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="#06060a"/><stop offset="100%" stop-color="#12110d"/>' +
          '</linearGradient>' +
        '</defs>' +
        '<rect width="480" height="300" fill="url(#' + b + ')"/>' +
        '<rect x="20" y="20" width="440" height="260" fill="none" stroke="url(#' + g + ')" stroke-width="0.6" opacity="0.45"/>' +
        '<rect x="27" y="27" width="426" height="246" fill="none" stroke="url(#' + g + ')" stroke-width="0.3" opacity="0.22"/>' +
        '<g stroke="url(#' + g + ')" stroke-width="1.4">' +
          '<path d="M20 20h26M20 20v26M460 20h-26M460 20v26M20 280h26M20 280v-26M460 280h-26M460 280v-26"/>' +
        '</g>' +
        '<line x1="96" y1="98" x2="384" y2="98" stroke="url(#' + g + ')" stroke-width="0.5" opacity="0.35"/>' +
        '<text x="240" y="72" font-family="ui-monospace,monospace" font-size="9" letter-spacing="7" fill="url(#' + g + ')" text-anchor="middle" opacity="0.7">ESTABLISHED 2024</text>' +
        '<text x="240" y="172" font-family="Space Grotesk,sans-serif" font-weight="600" font-size="62" letter-spacing="10" fill="url(#' + g + ')" text-anchor="middle">NZLUXE</text>' +
        '<line x1="96" y1="196" x2="384" y2="196" stroke="url(#' + g + ')" stroke-width="0.5" opacity="0.35"/>' +
        '<text x="240" y="226" font-family="Georgia,serif" font-style="italic" font-size="11" letter-spacing="4" fill="url(#' + g + ')" text-anchor="middle" opacity="0.55">Luxury. Redefined.</text>' +
        '<text x="240" y="262" font-family="ui-monospace,monospace" font-size="9" letter-spacing="3" fill="url(#' + g + ')" text-anchor="middle" opacity="0.4">nzluxe.ng</text>' +
      '</svg>';
  }

  function projectCard(p, uid) {
    return '' +
      '<article class="card work-card reveal">' +
        '<div class="work-shot">' + artLuxe(uid) + '</div>' +
        '<div class="work-body">' +
          '<div class="work-kind">' + esc(p.kind) + '</div>' +
          '<h3 class="work-name">' + esc(p.name) + '</h3>' +
          '<p class="card-text">' + esc(p.desc) + '</p>' +
          '<div class="work-tags">' + p.tags.map((t) => '<span>' + esc(t) + '</span>').join('') + '</div>' +
          '<a class="btn btn--ghost btn--sm" style="margin-top:20px;" href="' + esc(p.url) + '" target="_blank" rel="noopener noreferrer">Visit site <span class="arw">↗</span></a>' +
        '</div>' +
      '</article>';
  }

  function nextProjectCard() {
    return '' +
      '<article class="card work-card reveal" style="justify-content:center;">' +
        '<div class="work-body" style="padding:clamp(30px,4vw,44px);">' +
          '<div class="work-kind">Open slot</div>' +
          '<h3 class="work-name">Your project here</h3>' +
          '<p class="card-text">I take a small number of projects at a time so each one gets real attention. If you want the next slot, the fastest route is a short brief.</p>' +
          '<a class="btn btn--primary btn--sm" style="margin-top:20px;" href="/contact" data-route="contact">Send a brief <span class="arw">→</span></a>' +
        '</div>' +
      '</article>';
  }

  function platformCard(name, url, text) {
    if (!url) {
      return '' +
        '<div class="platform-card">' +
          '<div class="work-kind">' + esc(name) + '</div>' +
          '<h3 class="card-title">Profile link coming soon</h3>' +
          '<p class="card-text">' + esc(text) + ' In the meantime, email me and I\'ll send samples and references directly.</p>' +
          '<a class="btn btn--ghost btn--sm" style="align-self:flex-start;" href="mailto:' + EMAIL + '?subject=Video%20editing%20samples">Email for samples <span class="arw">→</span></a>' +
        '</div>';
    }
    return '' +
      '<div class="platform-card">' +
        '<div class="work-kind">' + esc(name) + '</div>' +
        '<h3 class="card-title">See my ' + esc(name) + ' profile</h3>' +
        '<p class="card-text">' + esc(text) + '</p>' +
        '<a class="btn btn--primary btn--sm" style="align-self:flex-start;" href="' + esc(url) + '" target="_blank" rel="noopener noreferrer">Open ' + esc(name) + ' <span class="arw">↗</span></a>' +
      '</div>';
  }

  function ctaBand(heading, text) {
    return '' +
      '<h2 class="h-lg">' + heading + '</h2>' +
      '<p class="lede">' + esc(text) + '</p>' +
      '<div class="cta-actions">' +
        '<a href="/contact" data-route="contact" class="btn btn--primary">Start a project <span class="arw">→</span></a>' +
        '<a href="mailto:' + EMAIL + '?subject=Project%20enquiry%20from%20victorvandi.com" class="btn btn--ghost">Email me directly</a>' +
      '</div>';
  }

  function firstParagraph(html) {
    const m = /<p>([\s\S]*?)<\/p>/i.exec(html);
    const raw = m ? m[1] : html;
    const div = document.createElement('div');
    div.innerHTML = raw;
    return (div.textContent || '').trim();
  }

  function slugify(s) {
    return String(s).toLowerCase()
      .replace(/[‘’']/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 70);
  }

  const ARTICLE_LIST = (typeof ARTICLES !== 'undefined' ? ARTICLES : []).map((a, i) => ({
    index: i,
    slug: slugify(a.title),
    tag: a.tag,
    title: a.title,
    meta: a.meta,
    body: a.body,
    excerpt: firstParagraph(a.body)
  }));

  /* ------------------------------------------------------------------------
     Build the dynamic parts of the page
     ------------------------------------------------------------------------ */
  function render() {
    const track = $('#marqueeTrack');
    if (track) {
      const once = MARQUEE.map((m) => '<span class="marquee-item">' + esc(m) + '</span>').join('');
      track.innerHTML = once + once; // duplicated so the -50% loop is seamless
    }

    const homeWork = $('#homeWorkGrid');
    if (homeWork) homeWork.innerHTML = projectCard(PROJECTS[0], 'h') + nextProjectCard();

    const workWeb = $('#workWebGrid');
    if (workWeb) workWeb.innerHTML = PROJECTS.map((p, i) => projectCard(p, 'w' + i)).join('') + nextProjectCard();

    const panel = $('#platformPanel');
    if (panel) {
      panel.innerHTML =
        platformCard('Fiverr', PROFILES.fiverr, 'Fixed-scope editing jobs, with public reviews from the clients I have delivered for.') +
        platformCard('Upwork', PROFILES.upwork, 'Longer contracts and ongoing editing retainers, with escrow protection and a public work history.');
    }

    const tools = $('#toolChips');
    if (tools) tools.innerHTML = TOOLS.map((t) => '<span class="chip">' + esc(t) + '</span>').join('');

    const steps = $('#stepsList');
    if (steps) {
      steps.innerHTML = STEPS.map((s, i) =>
        '<div class="step">' +
          '<div class="step-num">' + String(i + 1).padStart(2, '0') + '</div>' +
          '<div><h4 class="step-title">' + esc(s.title) + '</h4><p class="step-text">' + esc(s.text) + '</p></div>' +
        '</div>').join('');
    }

    const aboutChips = $('#aboutChips');
    if (aboutChips) {
      aboutChips.innerHTML = ['Engineering background', 'Creator first-hand', 'Web design & build',
        'Video editing', 'Performance-minded', 'Direct booking']
        .map((t) => '<span class="chip">' + t + '</span>').join('');
    }

    const socials = $('#aboutSocials');
    if (socials) {
      socials.innerHTML = SOCIALS.map((s) =>
        '<a class="social" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
          ICONS[s.key] + esc(s.label) + '</a>').join('') +
        '<a class="social" href="mailto:' + EMAIL + '">' + ICONS.mail + 'Email</a>';
    }

    const lines = $('#contactLines');
    if (lines) {
      const rows = [{ k: 'Email', v: EMAIL, href: 'mailto:' + EMAIL + '?subject=Project%20enquiry%20from%20victorvandi.com' }]
        .concat(SOCIALS.map((s) => ({ k: s.label, v: '@victorvandi', href: s.url })));
      if (PROFILES.fiverr) rows.push({ k: 'Fiverr', v: 'View profile', href: PROFILES.fiverr });
      if (PROFILES.upwork) rows.push({ k: 'Upwork', v: 'View profile', href: PROFILES.upwork });
      rows.push({ k: 'Based in', v: 'Nigeria · working worldwide', href: null });

      lines.innerHTML = rows.map((r) => {
        const inner = '<span class="k">' + esc(r.k) + '</span><span class="v">' + esc(r.v) + '</span>';
        return r.href
          ? '<a class="contact-line" href="' + esc(r.href) + '"' +
            (r.href.indexOf('http') === 0 ? ' target="_blank" rel="noopener noreferrer"' : '') + '>' + inner + '</a>'
          : '<div class="contact-line">' + inner + '</div>';
      }).join('');
    }

    const elsewhere = $('#footerElsewhere');
    if (elsewhere) {
      let html = SOCIALS.map((s) =>
        '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' + esc(s.label) + '</a></li>').join('');
      if (PROFILES.fiverr) html += '<li><a href="' + esc(PROFILES.fiverr) + '" target="_blank" rel="noopener noreferrer">Fiverr</a></li>';
      if (PROFILES.upwork) html += '<li><a href="' + esc(PROFILES.upwork) + '" target="_blank" rel="noopener noreferrer">Upwork</a></li>';
      html += '<li><a href="mailto:' + EMAIL + '">Email</a></li>';
      elsewhere.innerHTML = html;
    }

    const copy = $('#footerCopy');
    if (copy) copy.textContent = '© ' + new Date().getFullYear() + ' Victor Vandi · All rights reserved.';

    const bands = [
      ['#ctaHome',     'Got a project in <span class="grad-text">mind</span>?', 'A website, a video edit, or both. Send a short brief and you will hear back — usually within the hour.'],
      ['#ctaWork',     'Want work like <span class="grad-text">this</span>?',   'Tell me what you are building and I will tell you exactly what it takes.'],
      ['#ctaServices', 'Ready to <span class="grad-text">scope</span> it?',     'Describe the project and you get a fixed number back, not a range that moves later.'],
      ['#ctaAbout',    "Let's <span class=\"grad-text\">work</span> together.",  'I take a small number of projects at a time so each one gets real attention.']
    ];
    bands.forEach((b) => { const el = $(b[0]); if (el) el.innerHTML = ctaBand(b[1], b[2]); });

    const grid = $('#articleGrid');
    if (grid) {
      grid.innerHTML = ARTICLE_LIST.map((a) =>
        '<button class="card article-card reveal" type="button" data-article="' + a.slug + '">' +
          '<span class="article-tag">' + esc(a.tag) + '</span>' +
          '<span class="article-title">' + esc(a.title) + '</span>' +
          '<p class="article-excerpt">' + esc(a.excerpt) + '</p>' +
          '<span class="article-more">Read article <span class="arw">→</span></span>' +
        '</button>').join('');
    }
  }

  /* ------------------------------------------------------------------------
     Routing
     ------------------------------------------------------------------------ */
  const ROUTES  = ['home', 'work', 'services', 'about', 'articles', 'contact'];
  const ALIASES = { website: 'services', websites: 'services', reviews: 'home',
                    testimonials: 'home', portfolio: 'work', 'about-me': 'about',
                    packages: 'services', index: 'home', '': 'home' };

  const TITLES = {
    home:     'Victor Vandi — Web Design & Video Editing',
    work:     'Work — Victor Vandi',
    services: 'Services — Web Design & Video Editing — Victor Vandi',
    about:    'About — Victor Vandi',
    articles: 'Articles — Web Strategy — Victor Vandi',
    contact:  'Contact — Victor Vandi'
  };

  function normalise(name) {
    name = String(name || '').toLowerCase().replace(/^\/+|\/+$/g, '');
    if (ROUTES.indexOf(name) !== -1) return name;
    return ALIASES[name] || 'home';
  }

  let currentRoute = null;

  function setPage(route, opts) {
    opts = opts || {};
    route = normalise(route);

    $$('.page').forEach((p) => p.classList.toggle('is-active', p.id === 'page-' + route));
    $$('#nav .nav-menu a').forEach((a) => {
      if (a.dataset.route === route) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    document.title = TITLES[route] || TITLES.home;
    const canonical = $('link[rel="canonical"]');
    if (canonical) canonical.href = 'https://victorvandi.com/' + (route === 'home' ? '' : route);

    if (opts.push !== false) {
      const url = route === 'home' ? '/' : '/' + route;
      if (location.pathname + location.search !== url) history.pushState({ route: route }, '', url);
    }

    if (currentRoute !== route && !opts.keepScroll) {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    }
    currentRoute = route;
    closeNav();
    observeReveals();
  }

  function readLocation() {
    const params = new URLSearchParams(location.search);
    // 404.html forwards clean URLs here as ?page=…&a=…
    const qPage = params.get('page');
    const qArticle = params.get('a');
    if (qPage) {
      const route = normalise(qPage);
      history.replaceState({ route: route }, '', route === 'home' ? '/' : '/' + route);
      setPage(route, { push: false });
      if (qArticle) openArticle(qArticle, false);
      return;
    }

    const seg = location.pathname.replace(/^\/+|\/+$/g, '').split('/');
    if (seg[0] === 'articles' && seg[1]) {
      setPage('articles', { push: false });
      openArticle(seg[1], false);
      return;
    }
    setPage(seg[0] || 'home', { push: false });
    if (location.hash && location.hash.length > 1) {
      setPage(location.hash.slice(1), { push: false });
    }
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-route]');
    if (!link) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    if (modalOpen) closeArticle(false);
    setPage(link.dataset.route);
  });

  window.addEventListener('popstate', () => {
    if (modalOpen) closeArticle(false);
    readLocation();
  });

  /* ------------------------------------------------------------------------
     Article modal
     ------------------------------------------------------------------------ */
  const modal = $('#modal');
  let modalOpen = false;
  let lastFocus = null;

  function openArticle(slug, push) {
    const a = ARTICLE_LIST.filter((x) => x.slug === slug)[0];
    if (!a || !modal) return;

    lastFocus = document.activeElement;
    $('#modalTag').textContent = a.tag;
    $('#modalTitle').textContent = a.title;
    $('#modalMeta').textContent = a.meta;
    $('#modalBody').innerHTML = a.body;
    $('#modalBox').scrollTop = 0;

    modal.hidden = false;
    requestAnimationFrame(() => modal.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
    modalOpen = true;
    $('#modalClose').focus();

    if (push !== false) history.pushState({ route: 'articles', article: a.slug }, '', '/articles/' + a.slug);
    document.title = a.title + ' — Victor Vandi';
  }

  function closeArticle(push) {
    if (!modalOpen || !modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
    modalOpen = false;
    setTimeout(() => { if (!modalOpen) modal.hidden = true; }, 320);
    document.title = TITLES.articles;
    if (push !== false) history.pushState({ route: 'articles' }, '', '/articles');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  document.addEventListener('click', (e) => {
    const card = e.target.closest('[data-article]');
    if (card) { openArticle(card.dataset.article); return; }
    if (e.target === modal) closeArticle();
    if (e.target.closest('#modalClose')) closeArticle();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { if (modalOpen) closeArticle(); else closeNav(); }
    if (e.key === 'Tab' && modalOpen) {
      const f = $$('a[href], button, [tabindex]:not([tabindex="-1"])', $('#modalBox'));
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ------------------------------------------------------------------------
     Mobile navigation
     ------------------------------------------------------------------------ */
  const navToggle = $('#navToggle');
  const navMenu   = $('#navMenu');

  function closeNav() {
    if (!navMenu) return;
    navMenu.classList.remove('is-open');
    if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
  }

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const open = navMenu.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.addEventListener('click', (e) => {
    if (!navMenu || !navMenu.classList.contains('is-open')) return;
    if (e.target.closest('#navMenu') || e.target.closest('#navToggle')) return;
    closeNav();
  });

  /* ------------------------------------------------------------------------
     Scroll: sticky nav state + reading progress
     ------------------------------------------------------------------------ */
  const nav = $('#nav');
  const progress = $('#progress');
  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY || 0;
      if (nav) nav.classList.toggle('is-stuck', y > 8);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
      }
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ------------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------------ */
  let revealObserver = null;
  if ('IntersectionObserver' in window && !reducedMotion) {
    revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((en, i) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        setTimeout(() => el.classList.add('is-in'), Math.min(i * 60, 240));
        revealObserver.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
  }

  function observeReveals() {
    const items = $$('.page.is-active .reveal:not(.is-in)');
    if (!revealObserver) { items.forEach((el) => el.classList.add('is-in')); return; }
    items.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     Card spotlight (pointer-driven, fine pointers only)
     ------------------------------------------------------------------------ */
  if (matchMedia('(pointer: fine)').matches) {
    document.addEventListener('pointermove', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
    }, { passive: true });
  }

  /* ------------------------------------------------------------------------
     Hero canvas — a light constellation field. No libraries, ~2KB of work.
     ------------------------------------------------------------------------ */
  function heroCanvas() {
    const cv = $('#hero-canvas');
    if (!cv || reducedMotion) return;

    const ctx = cv.getContext('2d');
    let w = 0, h = 0, dpr = 1, pts = [], raf = null;

    function accent() {
      return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#ff6b2c';
    }

    function size() {
      const r = cv.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.min(70, Math.round((w * h) / 19000));
      pts = [];
      for (let i = 0; i < count; i++) {
        pts.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
          r: Math.random() * 1.5 + 0.6
        });
      }
    }

    function frame() {
      ctx.clearRect(0, 0, w, h);
      const col = accent();

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;

        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          const dx = p.x - q.x, dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > 17000) continue;
          ctx.globalAlpha = (1 - d2 / 17000) * 0.16;
          ctx.strokeStyle = col;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }

        ctx.globalAlpha = 0.42;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function start() { if (!raf) raf = requestAnimationFrame(frame); }
    function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

    size();
    start();

    let rt = null;
    window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 180); }, { passive: true });
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

    // Only animate while the home page is on screen.
    if ('IntersectionObserver' in window) {
      new IntersectionObserver((en) => (en[0].isIntersecting ? start() : stop()), { threshold: 0 }).observe(cv);
    }
  }

  /* ------------------------------------------------------------------------
     Enquiry form (Web3Forms)
     ------------------------------------------------------------------------ */
  const form = $('#bookingForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = $('#submitBtn');
      const status = $('#formStatus');

      if (!form.checkValidity()) { form.reportValidity(); return; }

      btn.disabled = true;
      btn.textContent = 'Sending…';
      status.removeAttribute('data-state');
      status.textContent = '';

      const data = Object.fromEntries(new FormData(form).entries());
      data.botcheck = form.botcheck.checked;

      try {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data)
        });
        const out = await res.json();
        if (!res.ok || !out.success) throw new Error(out.message || 'Request failed');

        form.style.display = 'none';
        $('#formDone').classList.add('is-shown');
      } catch (err) {
        status.setAttribute('data-state', 'error');
        status.innerHTML = 'Could not send that — please email <a class="link-inline" href="mailto:' +
          EMAIL + '">' + EMAIL + '</a> instead.';
        btn.disabled = false;
        btn.innerHTML = 'Send enquiry <span class="arw">→</span>';
      }
    });
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  render();
  readLocation();
  observeReveals();
  onScroll();
  heroCanvas();
}());
